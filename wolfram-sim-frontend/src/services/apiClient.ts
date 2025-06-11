// @ts-ignore
import { WolframPhysicsSimulatorServiceClient } from '../generated/proto/wolfram_physics_grpc_web_pb';
import {
  InitializeRequest,
  InitializeResponse,
  StepRequest,
  StepResponse,
  RunRequest,
  StopRequest,
  StopResponse,
  GetCurrentStateRequest,
  SimulationStateUpdate,
  HypergraphState,
  Atom,
  Relation,
  SimulationEvent
} from '../generated/proto/wolfram_physics_pb';

// Types for easier frontend usage
export interface ApiAtom {
  id: string;
}

export interface ApiRelation {
  atomIds: string[];
}

export interface ApiHypergraphState {
  atoms: ApiAtom[];
  relations: ApiRelation[];
  stepNumber?: number;
}

export interface ApiSimulationEvent {
  id: string;
  ruleIdApplied: string;
  atomsInvolvedInput: string[];
  atomsInvolvedOutput: string[];
}

export interface ApiSimulationStateUpdate {
  currentGraph: ApiHypergraphState;
  recentEvents: ApiSimulationEvent[];
  stepNumber: number;
  isRunning?: boolean;
  statusMessage?: string;
}

// Conversion functions between protobuf and API types
function convertAtomFromProto(atom: Atom): ApiAtom {
  return {
    id: atom.getId()
  };
}

function convertRelationFromProto(relation: Relation): ApiRelation {
  return {
    atomIds: relation.getAtomIdsList()
  };
}

function convertHypergraphStateFromProto(state: HypergraphState): ApiHypergraphState {
  return {
    atoms: state.getAtomsList().map(convertAtomFromProto),
    relations: state.getRelationsList().map(convertRelationFromProto),
    stepNumber: 0 // Will be updated from the context
  };
}

function convertSimulationEventFromProto(event: SimulationEvent): ApiSimulationEvent {
  return {
    id: event.getId(),
    ruleIdApplied: event.getRuleIdApplied(),
    atomsInvolvedInput: event.getAtomsInvolvedInputList(),
    atomsInvolvedOutput: event.getAtomsInvolvedOutputList()
  };
}

function convertSimulationStateUpdateFromProto(update: SimulationStateUpdate): ApiSimulationStateUpdate {
  const currentGraph = update.getCurrentGraph();
  return {
    currentGraph: currentGraph ? convertHypergraphStateFromProto(currentGraph) : { atoms: [], relations: [] },
    recentEvents: update.getRecentEventsList().map(convertSimulationEventFromProto),
    stepNumber: update.getStepNumber(),
    isRunning: true, // Will be managed by the frontend
    statusMessage: 'Connected'
  };
}

// Main API Client Class
export class WolframApiClient {
  private client: any; // Using any to avoid TypeScript issues with the generated client

  constructor(hostname: string = 'http://localhost:8080') {
    this.client = new WolframPhysicsSimulatorServiceClient(hostname);
  }

  // Initialize simulation
  async initializeSimulation(options: {
    predefinedInitialStateId?: string;
    ruleIdsToUse?: string[];
  }): Promise<{ success: boolean; message: string; initialState?: ApiHypergraphState }> {
    return new Promise((resolve, reject) => {
      const request = new InitializeRequest();
      
      if (options.predefinedInitialStateId) {
        request.setPredefinedInitialStateId(options.predefinedInitialStateId);
      }
      
      if (options.ruleIdsToUse) {
        request.setRuleIdsToUseList(options.ruleIdsToUse);
      }

      this.client.initializeSimulation(request, {}, (err: any, response: InitializeResponse) => {
        if (err) {
          reject(err);
          return;
        }

        if (!response) {
          reject(new Error('No response received'));
          return;
        }

        resolve({
          success: response.getSuccess(),
          message: response.getMessage(),
          initialState: response.getInitialHypergraphState() 
            ? convertHypergraphStateFromProto(response.getInitialHypergraphState()!)
            : undefined
        });
      });
    });
  }

  // Step simulation
  async stepSimulation(numSteps: number = 1): Promise<{
    success: boolean;
    message?: string;
    newState?: ApiHypergraphState;
    events?: ApiSimulationEvent[];
    currentStepNumber?: number;
  }> {
    return new Promise((resolve, reject) => {
      const request = new StepRequest();
      request.setNumSteps(numSteps);

      this.client.stepSimulation(request, {}, (err: any, response: StepResponse) => {
        if (err) {
          reject(err);
          return;
        }

        if (!response) {
          reject(new Error('No response received'));
          return;
        }

        resolve({
          success: true, // Assume success if we got a response
          message: 'Step completed',
          newState: response.getNewHypergraphState() 
            ? convertHypergraphStateFromProto(response.getNewHypergraphState()!)
            : undefined,
          events: response.getEventsOccurredList().map(convertSimulationEventFromProto),
          currentStepNumber: response.getCurrentStepNumber()
        });
      });
    });
  }

  // Start continuous simulation (streaming)
  runSimulation(options: {
    updateIntervalMs?: number;
    maxSteps?: number;
    stopOnFixedPoint?: boolean;
  }, onUpdate: (update: ApiSimulationStateUpdate) => void): () => void {
    const request = new RunRequest();
    
    if (options.updateIntervalMs !== undefined) {
      request.setUpdateIntervalMs(options.updateIntervalMs);
    }

    const stream = this.client.runSimulation(request, {});
    
    stream.on('data', (response: SimulationStateUpdate) => {
      onUpdate(convertSimulationStateUpdateFromProto(response));
    });
    
    stream.on('error', (err: any) => {
      console.error('Stream error:', err);
    });

    // Return cancellation function
    return () => {
      stream.cancel();
    };
  }

  // Stop simulation
  async stopSimulation(): Promise<{ success: boolean; message: string; finalState?: ApiHypergraphState }> {
    return new Promise((resolve, reject) => {
      const request = new StopRequest();

      this.client.stopSimulation(request, {}, (err: any, response: StopResponse) => {
        if (err) {
          reject(err);
          return;
        }

        if (!response) {
          reject(new Error('No response received'));
          return;
        }

        resolve({
          success: response.getSuccess(),
          message: response.getMessage(),
          finalState: undefined // Will be handled by separate getCurrentState call
        });
      });
    });
  }

  // Get current state
  async getCurrentState(): Promise<ApiSimulationStateUpdate> {
    return new Promise((resolve, reject) => {
      const request = new GetCurrentStateRequest();

      this.client.getCurrentState(request, {}, (err: any, response: SimulationStateUpdate) => {
        if (err) {
          reject(err);
          return;
        }

        if (!response) {
          reject(new Error('No response received'));
          return;
        }

        resolve(convertSimulationStateUpdateFromProto(response));
      });
    });
  }

  // Placeholder methods for save/load that will be implemented when proto generation is fixed
  async saveHypergraph(options: {
    filename?: string;
    overwriteExisting?: boolean;
    prettyPrint?: boolean;
  } = {}): Promise<{ success: boolean; message: string; filePath?: string }> {
    // For now, return a mock response
    return Promise.resolve({
      success: false,
      message: 'Save/Load functionality will be available when proto generation is complete'
    });
  }

  async loadHypergraph(source: {
    predefinedExampleName?: string;
    fileContent?: string;
    filePath?: string;
  }): Promise<{ success: boolean; message: string; loadedState?: ApiHypergraphState }> {
    // For now, return a mock response  
    return Promise.resolve({
      success: false,
      message: 'Save/Load functionality will be available when proto generation is complete'
    });
  }
}

// Export a default instance
export const apiClient = new WolframApiClient(); 