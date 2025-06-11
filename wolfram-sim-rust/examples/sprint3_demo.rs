use std::path::PathBuf;
use wolfram_sim_rust::{
    simulation::{SimulationManager, ContinuousSimulationConfig},
    serialization::{PersistenceManager, PredefinedExamples},
};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Wolfram Physics Simulator - Sprint 3 Demo ===\n");
    
    // F1.7: Demonstrate loading predefined examples
    println!("📚 F1.7: Predefined Examples");
    println!("Available examples: {:?}", PredefinedExamples::list_examples());
    
    for example_name in &["single_edge", "triangle", "small_path"] {
        if let Some(state) = PredefinedExamples::get_example(example_name) {
            println!("  - {}: {} atoms, {} relations - {}", 
                example_name, 
                state.atoms().len(), 
                state.relations().len(),
                PredefinedExamples::get_description(example_name).unwrap_or("No description")
            );
        }
    }
    println!();
    
    // Load the single edge example to start our simulation
    let initial_state = PredefinedExamples::get_example("single_edge").unwrap();
    println!("🔧 Starting simulation with 'single_edge' example");
    println!("Initial state: {} atoms, {} relations\n", 
        initial_state.atoms().len(), 
        initial_state.relations().len()
    );
    
    // F1.5: Demonstrate simulation loop - step-by-step execution
    println!("⚡ F1.5: Step-by-Step Simulation");
    let rule_set = wolfram_sim_rust::rules::rule::RuleSet::create_basic_ruleset();
    let mut sim_manager = SimulationManager::from_state(&initial_state, rule_set)?;
    
    for i in 1..=3 {
        let step_result = sim_manager.step();
        if step_result.success {
            if let Some(event) = &step_result.event {
                println!("  Step {}: Applied rule {} - Created {} atoms, {} relations, removed {} relations",
                    i,
                    event.rule_id().value(),
                    event.atoms_created().len(),
                    event.relations_created().len(),
                    event.relations_removed().len()
                );
                println!("    Current state: {} atoms, {} relations",
                    step_result.hypergraph_state.atoms().len(),
                    step_result.hypergraph_state.relations().len()
                );
            }
        } else {
            println!("  Step {}: No applicable rules", i);
            break;
        }
    }
    println!();
    
    // F1.6: Demonstrate event management and state tracking
    println!("📊 F1.6: Event Management & State Tracking");
    let current_state = sim_manager.get_current_state();
    println!("Current step number: {}", current_state.step_number());
    println!("Total atoms: {}, Total relations: {}", 
        current_state.atoms().len(), 
        current_state.relations().len()
    );
    
    // Show that we can get detailed state information
    println!("Next atom ID: {}, Next relation ID: {}", 
        current_state.next_atom_id(), 
        current_state.next_relation_id()
    );
    println!();
    
    // F1.5: Demonstrate continuous simulation
    println!("🚀 F1.5: Continuous Simulation");
    let fresh_state = PredefinedExamples::get_example("triangle").unwrap();
    let rule_set = wolfram_sim_rust::rules::rule::RuleSet::create_basic_ruleset();
    let mut sim_manager = SimulationManager::from_state(&fresh_state, rule_set)?;
    
    let config = ContinuousSimulationConfig {
        max_steps: Some(5),
        stop_on_fixed_point: true,
        report_interval: 1,
    };
    
    println!("Running continuous simulation on triangle for max 5 steps...");
    let result = sim_manager.run_continuous(config);
    
    println!("  Executed {} steps", result.steps_executed);
    println!("  Generated {} events", result.events.len());
    println!("  Stopped due to: {:?}", result.stop_reason);
    println!("  Final state: {} atoms, {} relations", 
        result.final_state.atoms().len(), 
        result.final_state.relations().len()
    );
    
    // Show details of some events
    for (i, event) in result.events.iter().take(3).enumerate() {
        println!("    Event {}: Rule {} at step {} - {} new atoms, {} new relations",
            i + 1,
            event.rule_id().value(),
            event.step_number(),
            event.atoms_created().len(),
            event.relations_created().len()
        );
    }
    println!();
    
    // F1.7: Demonstrate persistence - saving and loading
    println!("💾 F1.7: Hypergraph Persistence");
    let persistence_manager = PersistenceManager::new();
    
    // Save the final state
    println!("Saving final simulation state...");
    let save_path = persistence_manager.save_hypergraph_state(
        &result.final_state,
        None, // Use default path
        None  // Use default config
    )?;
    println!("  Saved to: {}", save_path.display());
    
    // List saved files
    let saved_files = persistence_manager.list_saved_hypergraphs()?;
    println!("  Found {} saved hypergraph files:", saved_files.len());
    for (i, file) in saved_files.iter().take(3).enumerate() {
        println!("    {}: {}", i + 1, file.file_name().unwrap().to_str().unwrap());
    }
    
    // Load it back to verify persistence works
    println!("Loading saved state back...");
    let loaded_state = persistence_manager.load_hypergraph_state(&save_path)?;
    
    // Verify the loaded state matches what we saved
    let matches = loaded_state.atoms().len() == result.final_state.atoms().len() &&
                  loaded_state.relations().len() == result.final_state.relations().len() &&
                  loaded_state.step_number() == result.final_state.step_number();
    
    println!("  Verification: State loaded correctly: {}", matches);
    println!("    Loaded: {} atoms, {} relations, step {}",
        loaded_state.atoms().len(),
        loaded_state.relations().len(),
        loaded_state.step_number()
    );
    
    // Demonstrate loading from predefined examples through persistence
    println!("\nTesting persistence with predefined examples:");
    let example_state = PredefinedExamples::get_example("small_cycle").unwrap();
    let temp_path = PathBuf::from("temp_example.json");
    
    // Save and reload an example
    persistence_manager.save_hypergraph_state(&example_state, Some(&temp_path), None)?;
    let reloaded_example = persistence_manager.load_hypergraph_state(&temp_path)?;
    
    let example_matches = example_state == reloaded_example;
    println!("  Example save/load verification: {}", example_matches);
    
    // Clean up temp file
    std::fs::remove_file(&temp_path).ok();
    
    println!("\n✅ Sprint 3 Demo Complete!");
    println!("   F1.5: Simulation Loop & Event Management - ✅ Working");
    println!("   F1.6: Event Management & State Transmission - ✅ Working");
    println!("   F1.7: Hypergraph Persistence - ✅ Working");
    
    Ok(())
} 