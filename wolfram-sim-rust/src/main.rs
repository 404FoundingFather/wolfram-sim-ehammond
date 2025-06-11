use std::sync::{Arc, Mutex};
use tonic::{transport::Server, Request, Response, Status};
use tokio_stream::wrappers::ReceiverStream;
use tokio_stream::StreamExt;
use std::collections::HashMap;

// Use our crate's module structure
use wolfram_sim_rust::wolfram_physics_simulator::{
    wolfram_physics_simulator_service_server::{WolframPhysicsSimulatorService, WolframPhysicsSimulatorServiceServer},
    Atom as ProtoAtom, HypergraphState as ProtoHypergraphState, InitializeRequest, InitializeResponse, 
    Relation as ProtoRelation, RunRequest, SimulationEvent as ProtoSimulationEvent, 
    SimulationStateUpdate, StepRequest, StepResponse, StopRequest, StopResponse,
    GetCurrentStateRequest, SaveHypergraphRequest, SaveHypergraphResponse,
    LoadHypergraphRequest, LoadHypergraphResponse, PredefinedExampleInfo,
    ListPredefinedExamplesRequest, ListPredefinedExamplesResponse,
};

// Import our core data structures
use wolfram_sim_rust::hypergraph::{Atom, AtomId, Relation, RelationId, Hypergraph};
use wolfram_sim_rust::rules::rule::RuleSet;
use wolfram_sim_rust::simulation::{
    manager::{SimulationManager, ContinuousSimulationConfig, StopReason},
    event::{HypergraphState, SimulationEvent},
};
use wolfram_sim_rust::serialization::{
    persistence::{PersistenceManager, SaveConfig},
    examples::PredefinedExamples,
};

/// Shared simulation state that can be accessed by multiple gRPC calls
#[derive(Debug)]
struct SimulationState {
    manager: SimulationManager,
    persistence: PersistenceManager,
    is_running: bool,
    running_task_handle: Option<tokio::task::JoinHandle<()>>,
}

impl SimulationState {
    fn new() -> Self {
        SimulationState {
            manager: SimulationManager::new(),
            persistence: PersistenceManager::new(),
            is_running: false,
            running_task_handle: None,
        }
    }
}

/// Define a struct that will implement our service with shared state
#[derive(Debug)]
pub struct MyWolframPhysicsSimulator {
    state: Arc<Mutex<SimulationState>>,
}

impl MyWolframPhysicsSimulator {
    fn new() -> Self {
        MyWolframPhysicsSimulator {
            state: Arc::new(Mutex::new(SimulationState::new())),
        }
    }
}

impl Default for MyWolframPhysicsSimulator {
    fn default() -> Self {
        Self::new()
    }
}

// Helper functions for converting between internal and protobuf types

fn atom_to_proto(atom: &Atom) -> ProtoAtom {
    ProtoAtom {
        id: atom.id().value().to_string(),
    }
}

fn relation_to_proto(relation: &Relation) -> ProtoRelation {
    ProtoRelation {
        atom_ids: relation.atoms().iter().map(|id| id.value().to_string()).collect(),
    }
}

fn hypergraph_state_to_proto(state: &HypergraphState) -> ProtoHypergraphState {
    ProtoHypergraphState {
        atoms: state.atoms().iter().map(atom_to_proto).collect(),
        relations: state.relations().iter().map(relation_to_proto).collect(),
        step_number: state.step_number() as i64,
        next_atom_id: state.next_atom_id(),
        next_relation_id: state.next_relation_id(),
    }
}

fn simulation_event_to_proto(event: &SimulationEvent) -> ProtoSimulationEvent {
    ProtoSimulationEvent {
        id: event.step_number().to_string(),
        rule_id_applied: event.rule_id().value().to_string(),
        atoms_involved_input: vec![], // TODO: Could be enhanced
        atoms_involved_output: vec![], // TODO: Could be enhanced
        step_number: event.step_number() as i64,
        atoms_created: event.atoms_created().iter().map(|id| id.value().to_string()).collect(),
        relations_created: event.relations_created().iter().map(|id| id.value().to_string()).collect(),
        relations_removed: event.relations_removed().iter().map(|id| id.value().to_string()).collect(),
        description: event.description().unwrap_or("").to_string(),
    }
}

fn proto_to_hypergraph_state(proto: &ProtoHypergraphState) -> Result<HypergraphState, String> {
    let atoms: Result<Vec<_>, _> = proto.atoms.iter()
        .map(|a| a.id.parse::<u64>().map(|id| Atom::new(AtomId::new(id))))
        .collect();
    let atoms = atoms.map_err(|_| "Invalid atom ID format")?;

    let relations: Result<Vec<_>, _> = proto.relations.iter().enumerate()
        .map(|(i, r)| {
            let atom_ids: Result<Vec<_>, _> = r.atom_ids.iter()
                .map(|id| id.parse::<u64>().map(AtomId::new))
                .collect();
            atom_ids.map(|ids| Relation::new(RelationId::new(i as u64), ids))
        })
        .collect();
    let relations = relations.map_err(|_| "Invalid relation format")?;

    Ok(HypergraphState::new(
        atoms,
        relations,
        proto.step_number as u64,
        proto.next_atom_id,
        proto.next_relation_id,
    ))
}

// Implement the gRPC service trait for our struct
#[tonic::async_trait]
impl WolframPhysicsSimulatorService for MyWolframPhysicsSimulator {
    async fn initialize_simulation(
        &self,
        request: Request<InitializeRequest>,
    ) -> Result<Response<InitializeResponse>, Status> {
        println!("Got an initialize_simulation request: {:?}", request);
        
        let req = request.into_inner();
        let mut state = self.state.lock().unwrap();
        
        // Stop any running simulation first
        state.is_running = false;
        if let Some(handle) = state.running_task_handle.take() {
            handle.abort();
        }
        
        // Initialize based on request parameters
        let hypergraph_state = if let Some(initial_state) = req.initial_hypergraph {
            // Use provided initial state
            match proto_to_hypergraph_state(&initial_state) {
                Ok(state) => state,
                Err(e) => {
                    return Ok(Response::new(InitializeResponse {
                        success: false,
                        message: format!("Invalid initial hypergraph: {}", e),
                        initial_hypergraph_state: None,
                    }));
                }
            }
        } else if !req.predefined_initial_state_id.is_empty() {
            // Use predefined example
            match PredefinedExamples::get_example(&req.predefined_initial_state_id) {
                Some(state) => state,
                None => {
                    return Ok(Response::new(InitializeResponse {
                        success: false,
                        message: format!("Unknown predefined example: {}", req.predefined_initial_state_id),
                        initial_hypergraph_state: None,
                    }));
                }
            }
        } else {
            // Use default empty state
            PredefinedExamples::empty_graph()
        };
        
        // Create new simulation manager with the specified state
        let rule_set = RuleSet::create_basic_ruleset();
        match SimulationManager::from_state(&hypergraph_state, rule_set) {
            Ok(manager) => {
                state.manager = manager;
                let current_state = state.manager.get_current_state();
                
                Ok(Response::new(InitializeResponse {
                    success: true,
                    message: "Simulation initialized successfully".to_string(),
                    initial_hypergraph_state: Some(hypergraph_state_to_proto(&current_state)),
                }))
            }
            Err(e) => {
                Ok(Response::new(InitializeResponse {
                    success: false,
                    message: format!("Failed to initialize simulation: {}", e),
                    initial_hypergraph_state: None,
                }))
            }
        }
    }

    async fn step_simulation(
        &self,
        request: Request<StepRequest>,
    ) -> Result<Response<StepResponse>, Status> {
        println!("Got a step_simulation request: {:?}", request);
        
        let req = request.into_inner();
        let mut state = self.state.lock().unwrap();
        
        let num_steps = req.num_steps.max(1) as u64;
        let results = state.manager.step_multiple(num_steps);
        
        // Convert results to protocol buffer format
        let events: Vec<ProtoSimulationEvent> = results.iter()
            .filter_map(|r| r.event.as_ref().map(simulation_event_to_proto))
            .collect();
        
        let success = !results.is_empty() && results.iter().any(|r| r.success);
        let message = if success {
            format!("Executed {} steps successfully", results.len())
        } else {
            results.first()
                .and_then(|r| r.message.as_ref())
                .unwrap_or(&"No steps could be executed".to_string())
                .clone()
        };
        
        let current_state = state.manager.get_current_state();
        
        Ok(Response::new(StepResponse {
            new_hypergraph_state: Some(hypergraph_state_to_proto(&current_state)),
            events_occurred: events,
            current_step_number: state.manager.step_number() as i64,
            success,
            message,
        }))
    }

    type RunSimulationStream = ReceiverStream<Result<SimulationStateUpdate, Status>>;

    async fn run_simulation(
        &self,
        request: Request<RunRequest>,
    ) -> Result<Response<Self::RunSimulationStream>, Status> {
        println!("Got a run_simulation request: {:?}", request);
        
        let req = request.into_inner();
        let (tx, rx) = tokio::sync::mpsc::channel(16);
        
        // Clone the state Arc to move into the spawned task
        let state_arc = Arc::clone(&self.state);
        
        // Spawn a task to run the simulation
        let handle = tokio::spawn(async move {
            let update_interval = std::time::Duration::from_millis(req.update_interval_ms.max(10) as u64);
            
            loop {
                let (should_continue, update) = {
                    let mut state = state_arc.lock().unwrap();
                    if !state.is_running {
                        break;
                    }
                    
                    // Execute one step
                    let step_result = state.manager.step();
                    let current_state = state.manager.get_current_state();
                    
                    let events = if let Some(event) = step_result.event {
                        vec![simulation_event_to_proto(&event)]
                    } else {
                        vec![]
                    };
                    
                    let update = SimulationStateUpdate {
                        current_graph: Some(hypergraph_state_to_proto(&current_state)),
                        recent_events: events,
                        step_number: state.manager.step_number() as i64,
                        is_running: state.is_running,
                        status_message: step_result.message.unwrap_or_default(),
                    };
                    
                    (step_result.success, update)
                };
                
                if tx.send(Ok(update)).await.is_err() {
                    break; // Client disconnected
                }
                
                if !should_continue {
                    // No more rules applicable
                    let final_update = {
                        let state = state_arc.lock().unwrap();
                        SimulationStateUpdate {
                            current_graph: Some(hypergraph_state_to_proto(&state.manager.get_current_state())),
                            recent_events: vec![],
                            step_number: state.manager.step_number() as i64,
                            is_running: false,
                            status_message: "Simulation reached fixed point - no more applicable rules".to_string(),
                        }
                    };
                    let _ = tx.send(Ok(final_update)).await;
                    break;
                }
                
                tokio::time::sleep(update_interval).await;
            }
        });
        
        // Mark simulation as running and store the handle
        {
            let mut state = self.state.lock().unwrap();
            state.is_running = true;
            state.running_task_handle = Some(handle);
        }
        
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    async fn stop_simulation(
        &self,
        request: Request<StopRequest>,
    ) -> Result<Response<StopResponse>, Status> {
        println!("Got a stop_simulation request: {:?}", request);
        
        let mut state = self.state.lock().unwrap();
        state.is_running = false;
        
        if let Some(handle) = state.running_task_handle.take() {
            handle.abort();
        }
        
        let final_state = state.manager.get_current_state();
        
        Ok(Response::new(StopResponse {
            success: true,
            message: "Simulation stopped successfully".to_string(),
            final_state: Some(hypergraph_state_to_proto(&final_state)),
        }))
    }

    async fn get_current_state(
        &self,
        request: Request<GetCurrentStateRequest>,
    ) -> Result<Response<SimulationStateUpdate>, Status> {
        println!("Got a get_current_state request: {:?}", request);
        
        let state = self.state.lock().unwrap();
        let current_state = state.manager.get_current_state();
        
        Ok(Response::new(SimulationStateUpdate {
            current_graph: Some(hypergraph_state_to_proto(&current_state)),
            recent_events: vec![], // Could be enhanced to include recent events
            step_number: state.manager.step_number() as i64,
            is_running: state.is_running,
            status_message: "Current state retrieved successfully".to_string(),
        }))
    }

    async fn save_hypergraph(
        &self,
        request: Request<SaveHypergraphRequest>,
    ) -> Result<Response<SaveHypergraphResponse>, Status> {
        println!("Got a save_hypergraph request: {:?}", request);
        
        let req = request.into_inner();
        let state = self.state.lock().unwrap();
        
        let current_state = state.manager.get_current_state();
        
        let config = SaveConfig {
            create_directories: true,
            overwrite_existing: req.overwrite_existing,
            pretty_print: req.pretty_print,
        };
        
        let file_path = if req.filename.as_ref().map_or(true, |s| s.is_empty()) {
            None
        } else {
            req.filename.as_ref().map(|s| std::path::Path::new(s))
        };
        
        match state.persistence.save_hypergraph_state(&current_state, file_path, Some(config)) {
            Ok(saved_path) => {
                Ok(Response::new(SaveHypergraphResponse {
                    success: true,
                    message: "Hypergraph saved successfully".to_string(),
                    file_path: saved_path.to_string_lossy().to_string(),
                }))
            }
            Err(e) => {
                Ok(Response::new(SaveHypergraphResponse {
                    success: false,
                    message: format!("Failed to save hypergraph: {}", e),
                    file_path: String::new(),
                }))
            }
        }
    }

    async fn load_hypergraph(
        &self,
        request: Request<LoadHypergraphRequest>,
    ) -> Result<Response<LoadHypergraphResponse>, Status> {
        println!("Got a load_hypergraph request: {:?}", request);
        
        let req = request.into_inner();
        let mut state = self.state.lock().unwrap();
        
        // Stop any running simulation first
        state.is_running = false;
        if let Some(handle) = state.running_task_handle.take() {
            handle.abort();
        }
        
        let loaded_state = match req.source {
            Some(source) => match source {
                wolfram_sim_rust::wolfram_physics_simulator::load_hypergraph_request::Source::PredefinedExampleName(name) => {
                    match PredefinedExamples::get_example(&name) {
                        Some(state) => state,
                        None => {
                            return Ok(Response::new(LoadHypergraphResponse {
                                success: false,
                                message: format!("Unknown predefined example: {}", name),
                                loaded_state: None,
                            }));
                        }
                    }
                }
                wolfram_sim_rust::wolfram_physics_simulator::load_hypergraph_request::Source::FileContent(content) => {
                    match serde_json::from_str::<HypergraphState>(&content) {
                        Ok(state) => state,
                        Err(e) => {
                            return Ok(Response::new(LoadHypergraphResponse {
                                success: false,
                                message: format!("Failed to parse hypergraph content: {}", e),
                                loaded_state: None,
                            }));
                        }
                    }
                }
                wolfram_sim_rust::wolfram_physics_simulator::load_hypergraph_request::Source::FilePath(path) => {
                    match state.persistence.load_hypergraph_state(&path) {
                        Ok(state) => state,
                        Err(e) => {
                            return Ok(Response::new(LoadHypergraphResponse {
                                success: false,
                                message: format!("Failed to load hypergraph from file: {}", e),
                                loaded_state: None,
                            }));
                        }
                    }
                }
            },
            None => {
                return Ok(Response::new(LoadHypergraphResponse {
                    success: false,
                    message: "No source specified for loading hypergraph".to_string(),
                    loaded_state: None,
                }));
            }
        };
        
        // Load the state into the simulation manager
        match state.manager.load_state(&loaded_state) {
            Ok(()) => {
                Ok(Response::new(LoadHypergraphResponse {
                    success: true,
                    message: "Hypergraph loaded successfully".to_string(),
                    loaded_state: Some(hypergraph_state_to_proto(&loaded_state)),
                }))
            }
            Err(e) => {
                Ok(Response::new(LoadHypergraphResponse {
                    success: false,
                    message: format!("Failed to load hypergraph state: {}", e),
                    loaded_state: None,
                }))
            }
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Test our Atom implementation
    let atom_id = AtomId::new(1);
    let atom = Atom::new(atom_id);
    println!("Created test atom: {:?} with ID: {}", atom, atom.id());

    // Test our Rule implementation
    let ruleset = RuleSet::create_basic_ruleset();
    println!("Created basic ruleset with {} rules", ruleset.len());
    
    // Print information about each rule
    for rule in ruleset.iter() {
        println!("Rule: {}", rule.name().unwrap_or("Unnamed"));
        println!("  Pattern has {} relations", rule.pattern().len());
        println!("  Replacement has {} relations", rule.replacement().len());
    }

    // Test predefined examples
    println!("Available predefined examples:");
    for example_name in PredefinedExamples::list_examples() {
        let info = PredefinedExamples::get_description(example_name).unwrap_or("No description");
        println!("  {}: {}", example_name, info);
    }

    let addr = "[::1]:50051".parse()?;
    let simulator_service = MyWolframPhysicsSimulator::new();

    println!("WolframPhysicsSimulatorService listening on {}", addr);

    Server::builder()
        .add_service(WolframPhysicsSimulatorServiceServer::new(simulator_service))
        .serve(addr)
        .await?;

    Ok(())
}
