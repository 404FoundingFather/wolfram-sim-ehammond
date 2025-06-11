// Note: Using mock implementation for now due to CommonJS/ES6 module compatibility issues

// Import the TypeScript definitions for proper typing
import type {
  Atom,
  Relation,
  HypergraphState,
  SimulationEvent,
  InitializeRequest,
  InitializeResponse,
  StepRequest,
  StepResponse,
  RunRequest,
  SimulationStateUpdate,
  StopRequest,
  StopResponse,
  GetCurrentStateRequest,
  SaveHypergraphRequest,
  SaveHypergraphResponse,
  LoadHypergraphRequest,
  LoadHypergraphResponse
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

// Mock protobuf classes for development
class MockProtoClass {
  private data: any = {};
  
  constructor(data?: any) {
    if (data) this.data = data;
  }
  
  getId() { return this.data.id || ''; }
  setId(value: string) { this.data.id = value; }
  
  getAtomIdsList() { return this.data.atomIds || []; }
  setAtomIdsList(value: string[]) { this.data.atomIds = value; }
  
  getAtomsList() { return this.data.atoms || []; }
  setAtomsList(value: any[]) { this.data.atoms = value; }
  
  getRelationsList() { return this.data.relations || []; }
  setRelationsList(value: any[]) { this.data.relations = value; }
  
  getStepNumber() { return this.data.stepNumber || 0; }
  setStepNumber(value: number) { this.data.stepNumber = value; }
  
  getSuccess() { return this.data.success || false; }
  setSuccess(value: boolean) { this.data.success = value; }
  
  getMessage() { return this.data.message || ''; }
  setMessage(value: string) { this.data.message = value; }
  
  getInitialHypergraphState() { return this.data.initialHypergraphState; }
  setInitialHypergraphState(value: any) { this.data.initialHypergraphState = value; }
  
  getNewHypergraphState() { return this.data.newHypergraphState; }
  setNewHypergraphState(value: any) { this.data.newHypergraphState = value; }
  
  getEventsOccurredList() { return this.data.eventsOccurred || []; }
  setEventsOccurredList(value: any[]) { this.data.eventsOccurred = value; }
  
  getCurrentStepNumber() { return this.data.currentStepNumber || 0; }
  setCurrentStepNumber(value: number) { this.data.currentStepNumber = value; }
  
  getCurrentGraph() { return this.data.currentGraph; }
  setCurrentGraph(value: any) { this.data.currentGraph = value; }
  
  getRecentEventsList() { return this.data.recentEvents || []; }
  setRecentEventsList(value: any[]) { this.data.recentEvents = value; }
  
  getRuleIdApplied() { return this.data.ruleIdApplied || ''; }
  setRuleIdApplied(value: string) { this.data.ruleIdApplied = value; }
  
  getAtomsInvolvedInputList() { return this.data.atomsInvolvedInput || []; }
  setAtomsInvolvedInputList(value: string[]) { this.data.atomsInvolvedInput = value; }
  
  getAtomsInvolvedOutputList() { return this.data.atomsInvolvedOutput || []; }
  setAtomsInvolvedOutputList(value: string[]) { this.data.atomsInvolvedOutput = value; }
  
  setPredefinedInitialStateId(value: string) { this.data.predefinedInitialStateId = value; }
  setRuleIdsToUseList(value: string[]) { this.data.ruleIdsToUse = value; }
  
  setNumSteps(value: number) { this.data.numSteps = value; }
  setUpdateIntervalMs(value: number) { this.data.updateIntervalMs = value; }
  
  setFilename(value: string) { this.data.filename = value; }
  setOverwriteExisting(value: boolean) { this.data.overwriteExisting = value; }
  setPrettyPrint(value: boolean) { this.data.prettyPrint = value; }
  
  getFilePath() { return this.data.filePath || ''; }
  
  setPredefinedExampleName(value: string) { this.data.predefinedExampleName = value; }
  setFileContent(value: string) { this.data.fileContent = value; }
  setFilePath(value: string) { this.data.filePath = value; }
  
  getLoadedState() { return this.data.loadedState; }
  
  serializeBinary() { return new Uint8Array(); }
}

// Mock gRPC client for development
class MockGrpcClient {
  private hostname: string;
  
  constructor(hostname: string) {
    this.hostname = hostname;
  }
  
  initializeSimulation(request: any, metadata: any, callback: Function) {
    // Mock successful response
    setTimeout(() => {
      const response = new MockProtoClass({
        success: true,
        message: 'Mock initialization successful',
        initialHypergraphState: new MockProtoClass({
          atoms: [new MockProtoClass({ id: 'atom1' }), new MockProtoClass({ id: 'atom2' })],
          relations: [new MockProtoClass({ atomIds: ['atom1', 'atom2'] })],
          stepNumber: 0
        })
      });
      callback(null, response);
    }, 100);
  }
  
  stepSimulation(request: any, metadata: any, callback: Function) {
    setTimeout(() => {
      const response = new MockProtoClass({
        success: true,
        message: 'Mock step completed',
        newHypergraphState: new MockProtoClass({
          atoms: [new MockProtoClass({ id: 'atom1' }), new MockProtoClass({ id: 'atom2' }), new MockProtoClass({ id: 'atom3' })],
          relations: [new MockProtoClass({ atomIds: ['atom1', 'atom3'] }), new MockProtoClass({ atomIds: ['atom3', 'atom2'] })],
          stepNumber: 1
        }),
        eventsOccurred: [new MockProtoClass({ id: 'event1', ruleIdApplied: 'edge_split', atomsInvolvedInput: ['atom1', 'atom2'], atomsInvolvedOutput: ['atom1', 'atom3', 'atom2'] })],
        currentStepNumber: 1
      });
      callback(null, response);
    }, 100);
  }
  
  runSimulation(request: any, metadata: any) {
    return {
      on: (event: string, handler: Function) => {
        if (event === 'data') {
          // Mock streaming data
          const mockUpdate = new MockProtoClass({
            currentGraph: new MockProtoClass({
              atoms: [new MockProtoClass({ id: 'atom1' }), new MockProtoClass({ id: 'atom2' })],
              relations: [new MockProtoClass({ atomIds: ['atom1', 'atom2'] })],
              stepNumber: 0
            }),
            recentEvents: [],
            stepNumber: 0
          });
          setTimeout(() => handler(mockUpdate), 100);
        }
      },
      cancel: () => console.log('Mock stream cancelled')
    };
  }
  
  stopSimulation(request: any, metadata: any, callback: Function) {
    setTimeout(() => {
      const response = new MockProtoClass({
        success: true,
        message: 'Mock simulation stopped'
      });
      callback(null, response);
    }, 100);
  }
  
  getCurrentState(request: any, metadata: any, callback: Function) {
    setTimeout(() => {
      const response = new MockProtoClass({
        currentGraph: new MockProtoClass({
          atoms: [new MockProtoClass({ id: 'atom1' }), new MockProtoClass({ id: 'atom2' })],
          relations: [new MockProtoClass({ atomIds: ['atom1', 'atom2'] })],
          stepNumber: 0
        }),
        recentEvents: [],
        stepNumber: 0
      });
      callback(null, response);
    }, 100);
  }
  
  saveHypergraph(request: any, metadata: any, callback: Function) {
    setTimeout(() => {
      const response = new MockProtoClass({
        success: true,
        message: 'Mock save successful',
        filePath: '/mock/path/hypergraph.json'
      });
      callback(null, response);
    }, 100);
  }
  
  loadHypergraph(request: any, metadata: any, callback: Function) {
    setTimeout(() => {
      const response = new MockProtoClass({
        success: true,
        message: 'Mock load successful',
        loadedState: new MockProtoClass({
          atoms: [new MockProtoClass({ id: 'loaded_atom1' }), new MockProtoClass({ id: 'loaded_atom2' })],
          relations: [new MockProtoClass({ atomIds: ['loaded_atom1', 'loaded_atom2'] })],
          stepNumber: 0
        })
      });
      callback(null, response);
    }, 100);
  }
}

// Conversion functions between protobuf and API types
function convertAtomFromProto(atom: any): ApiAtom {
  return {
    id: atom.getId()
  };
}

function convertRelationFromProto(relation: any): ApiRelation {
  return {
    atomIds: relation.getAtomIdsList()
  };
}

function convertHypergraphStateFromProto(state: any): ApiHypergraphState {
  return {
    atoms: state.getAtomsList().map(convertAtomFromProto),
    relations: state.getRelationsList().map(convertRelationFromProto),
    stepNumber: 0 // Will be updated from the context
  };
}

function convertSimulationEventFromProto(event: any): ApiSimulationEvent {
  return {
    id: event.getId(),
    ruleIdApplied: event.getRuleIdApplied(),
    atomsInvolvedInput: event.getAtomsInvolvedInputList(),
    atomsInvolvedOutput: event.getAtomsInvolvedOutputList()
  };
}

function convertSimulationStateUpdateFromProto(update: any): ApiSimulationStateUpdate {
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
  private client: any;
  private protoModule: any;

  constructor(hostname: string = 'http://localhost:8080') {
    // Use mock client for now
    console.warn('Using mock gRPC client for development');
    this.client = new MockGrpcClient(hostname);
    this.protoModule = MockProtoClass;
  }

  // Initialize simulation
  async initializeSimulation(options: {
    predefinedInitialStateId?: string;
    ruleIdsToUse?: string[];
  }): Promise<{ success: boolean; message: string; initialState?: ApiHypergraphState }> {
    return new Promise((resolve, reject) => {
      const request = new this.protoModule();
      
      if (options.predefinedInitialStateId) {
        request.setPredefinedInitialStateId(options.predefinedInitialStateId);
      }
      
      if (options.ruleIdsToUse) {
        request.setRuleIdsToUseList(options.ruleIdsToUse);
      }

      this.client.initializeSimulation(request, {}, (err: any, response: any) => {
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
            ? convertHypergraphStateFromProto(response.getInitialHypergraphState())
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
      const request = new this.protoModule();
      request.setNumSteps(numSteps);

      this.client.stepSimulation(request, {}, (err: any, response: any) => {
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
            ? convertHypergraphStateFromProto(response.getNewHypergraphState())
            : undefined,
          events: response.getEventsOccurredList().map(convertSimulationEventFromProto),
          currentStepNumber: response.getCurrentStepNumber()
        });
      });
    });
  }

  // Start continuous simulation (streaming)
  async runSimulation(options: {
    updateIntervalMs?: number;
    maxSteps?: number;
    stopOnFixedPoint?: boolean;
  }, onUpdate: (update: ApiSimulationStateUpdate) => void): Promise<() => void> {
    const request = new this.protoModule();
    
    if (options.updateIntervalMs !== undefined) {
      request.setUpdateIntervalMs(options.updateIntervalMs);
    }

    const stream = this.client.runSimulation(request, {});
    
    stream.on('data', (response: any) => {
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
      const request = new this.protoModule();

      this.client.stopSimulation(request, {}, (err: any, response: any) => {
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
      const request = new this.protoModule();

      this.client.getCurrentState(request, {}, (err: any, response: any) => {
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

  // Save hypergraph
  async saveHypergraph(options: {
    filename?: string;
    overwriteExisting?: boolean;
    prettyPrint?: boolean;
  } = {}): Promise<{ success: boolean; message: string; filePath?: string }> {
    return new Promise((resolve, reject) => {
      const request = new this.protoModule();
      
      if (options.filename) {
        request.setFilename(options.filename);
      }
      if (options.overwriteExisting !== undefined) {
        request.setOverwriteExisting(options.overwriteExisting);
      }
      if (options.prettyPrint !== undefined) {
        request.setPrettyPrint(options.prettyPrint);
      }

      this.client.saveHypergraph(request, {}, (err: any, response: any) => {
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
          filePath: response.getFilePath()
        });
      });
    });
  }

  // Load hypergraph
  async loadHypergraph(source: {
    predefinedExampleName?: string;
    fileContent?: string;
    filePath?: string;
  }): Promise<{ success: boolean; message: string; loadedState?: ApiHypergraphState }> {
    return new Promise((resolve, reject) => {
      const request = new this.protoModule();
      
      if (source.predefinedExampleName) {
        request.setPredefinedExampleName(source.predefinedExampleName);
      } else if (source.fileContent) {
        request.setFileContent(source.fileContent);
      } else if (source.filePath) {
        request.setFilePath(source.filePath);
      }

      this.client.loadHypergraph(request, {}, (err: any, response: any) => {
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
          loadedState: response.getLoadedState() 
            ? convertHypergraphStateFromProto(response.getLoadedState())
            : undefined
        });
      });
    });
  }
}

// Export a default instance
export const apiClient = new WolframApiClient(); 