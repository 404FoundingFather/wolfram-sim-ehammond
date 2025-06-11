// Real gRPC-Web client implementation with polyfill support

// Import polyfill first to set up require() and module.exports
import './grpcPolyfill.js';

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
  stepNumber: number;
  atomsCreated: string[];
  relationsCreated: string[];
  relationsRemoved: string[];
  description: string;
}

export interface ApiSimulationStateUpdate {
  currentGraph: ApiHypergraphState;
  recentEvents: ApiSimulationEvent[];
  stepNumber: number;
  isRunning?: boolean;
  statusMessage?: string;
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
    stepNumber: state.getStepNumber()
  };
}

function convertSimulationEventFromProto(event: any): ApiSimulationEvent {
  return {
    id: event.getId(),
    ruleIdApplied: event.getRuleIdApplied(),
    atomsInvolvedInput: event.getAtomsInvolvedInputList(),
    atomsInvolvedOutput: event.getAtomsInvolvedOutputList(),
    stepNumber: event.getStepNumber(),
    atomsCreated: event.getAtomsCreatedList(),
    relationsCreated: event.getRelationsCreatedList(),
    relationsRemoved: event.getRelationsRemovedList(),
    description: event.getDescription()
  };
}

function convertSimulationStateUpdateFromProto(update: any): ApiSimulationStateUpdate {
  const currentGraph = update.getCurrentGraph();
  return {
    currentGraph: currentGraph ? convertHypergraphStateFromProto(currentGraph) : { atoms: [], relations: [] },
    recentEvents: update.getRecentEventsList().map(convertSimulationEventFromProto),
    stepNumber: update.getStepNumber(),
    isRunning: update.getIsRunning(),
    statusMessage: update.getStatusMessage()
  };
}

// Function to load gRPC modules dynamically
async function loadGrpcModules() {
  try {
    console.log('Loading gRPC modules...');
    
    // Ensure global environment is set up
    if (!(window as any).proto) {
      (window as any).proto = {};
    }
    
    // Load protobuf messages first
    const messagesScript = document.createElement('script');
    messagesScript.src = '/src/generated/proto/wolfram_physics_pb.js';
    messagesScript.type = 'text/javascript';
    
    const messagesPromise = new Promise((resolve, reject) => {
      messagesScript.onload = () => {
        console.log('Protobuf messages loaded');
        
        // The protobuf file exports its messages to the global proto namespace
        const protoMessages = (window as any).proto?.wolfram_physics_simulator;
        if (!protoMessages) {
          reject(new Error('Protobuf messages not found in global proto namespace'));
          return;
        }
        
        // Store in a way that the gRPC client can access
        (window as any).protoMessages = protoMessages;
        resolve(protoMessages);
      };
      messagesScript.onerror = (error) => {
        console.error('Failed to load protobuf messages:', error);
        reject(error);
      };
    });
    
    document.head.appendChild(messagesScript);
    const protoMessages = await messagesPromise;
    
    // Reset module.exports for the next script
    (window as any).module = { exports: {} };
    
    // Load gRPC client
    const clientScript = document.createElement('script');
    clientScript.src = '/src/generated/proto/wolfram_physics_grpc_web_pb.js';
    clientScript.type = 'text/javascript';
    
    const clientPromise = new Promise((resolve, reject) => {
      clientScript.onload = () => {
        console.log('gRPC client loaded');
        
        // The gRPC client exports to module.exports
        const grpcExports = (window as any).module.exports;
        if (!grpcExports) {
          reject(new Error('gRPC client not found in module.exports'));
          return;
        }
        
        resolve(grpcExports);
      };
      clientScript.onerror = (error) => {
        console.error('Failed to load gRPC client:', error);
        reject(error);
      };
    });
    
    document.head.appendChild(clientScript);
    const grpcClient = await clientPromise;
    
    console.log('All gRPC modules loaded successfully');
    return {
      protoMessages,
      grpcClient
    };
  } catch (error) {
    console.error('Failed to load gRPC modules:', error);
    throw error;
  }
}

// Main API Client Class
export class WolframApiClient {
  private client: any;
  private protoMessages: any;
  private grpcClient: any;
  private initialized: boolean = false;

  constructor(private hostname: string = 'http://localhost:3000') {
    console.log('Initializing real gRPC-Web client, connecting to:', hostname);
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      console.log('Initializing gRPC client...');
      const modules = await loadGrpcModules();
      this.protoMessages = modules.protoMessages;
      this.grpcClient = modules.grpcClient;
      
      // Access the client constructor from the loaded modules
      const ClientConstructor = this.grpcClient.WolframPhysicsSimulatorServicePromiseClient;
      if (!ClientConstructor) {
        throw new Error('WolframPhysicsSimulatorServicePromiseClient not found in loaded modules');
      }
      
      this.client = new ClientConstructor(this.hostname);
      this.initialized = true;
      console.log('gRPC client initialized successfully');
    }
  }

  // Initialize simulation
  async initializeSimulation(options: {
    predefinedInitialStateId?: string;
    ruleIdsToUse?: string[];
  }): Promise<{ success: boolean; message: string; initialState?: ApiHypergraphState }> {
    try {
      await this.ensureInitialized();
      
      const request = new this.protoMessages.InitializeRequest();
      
      if (options.predefinedInitialStateId) {
        request.setPredefinedInitialStateId(options.predefinedInitialStateId);
      }
      
      if (options.ruleIdsToUse) {
        request.setRuleIdsToUseList(options.ruleIdsToUse);
      }

      const response = await this.client.initializeSimulation(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
        initialState: response.getInitialHypergraphState() 
          ? convertHypergraphStateFromProto(response.getInitialHypergraphState())
          : undefined
      };
    } catch (error) {
      console.error('Initialize simulation error:', error);
      throw new Error(`Failed to initialize simulation: ${error}`);
    }
  }

  // Step simulation
  async stepSimulation(numSteps: number = 1): Promise<{
    success: boolean;
    message?: string;
    newState?: ApiHypergraphState;
    events?: ApiSimulationEvent[];
    currentStepNumber?: number;
  }> {
    try {
      await this.ensureInitialized();
      
      const request = new this.protoMessages.StepRequest();
      request.setNumSteps(numSteps);

      const response = await this.client.stepSimulation(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
        newState: response.getNewHypergraphState() 
          ? convertHypergraphStateFromProto(response.getNewHypergraphState())
          : undefined,
        events: response.getEventsOccurredList().map(convertSimulationEventFromProto),
        currentStepNumber: response.getCurrentStepNumber()
      };
    } catch (error) {
      console.error('Step simulation error:', error);
      throw new Error(`Failed to step simulation: ${error}`);
    }
  }

  // Start continuous simulation (streaming)
  async runSimulation(options: {
    updateIntervalMs?: number;
    maxSteps?: number;
    stopOnFixedPoint?: boolean;
  }, onUpdate: (update: ApiSimulationStateUpdate) => void): Promise<() => void> {
    try {
      await this.ensureInitialized();
      
      const request = new this.protoMessages.RunRequest();
      
      if (options.updateIntervalMs !== undefined) {
        request.setUpdateIntervalMs(options.updateIntervalMs);
      }
      
      if (options.maxSteps !== undefined) {
        request.setMaxSteps(options.maxSteps);
      }
      
      if (options.stopOnFixedPoint !== undefined) {
        request.setStopOnFixedPoint(options.stopOnFixedPoint);
      }

      const stream = this.client.runSimulation(request);
      
      stream.on('data', (response: any) => {
        onUpdate(convertSimulationStateUpdateFromProto(response));
      });
      
      stream.on('error', (error: any) => {
        console.error('Stream error:', error);
      });

      stream.on('end', () => {
        console.log('Stream ended');
      });

      // Return cancellation function
      return () => {
        stream.cancel();
      };
    } catch (error) {
      console.error('Run simulation error:', error);
      throw new Error(`Failed to start simulation: ${error}`);
    }
  }

  // Stop simulation
  async stopSimulation(): Promise<{ success: boolean; message: string; finalState?: ApiHypergraphState }> {
    try {
      await this.ensureInitialized();
      
      const request = new this.protoMessages.StopRequest();

      const response = await this.client.stopSimulation(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
        finalState: response.getFinalState()
          ? convertHypergraphStateFromProto(response.getFinalState())
          : undefined
      };
    } catch (error) {
      console.error('Stop simulation error:', error);
      throw new Error(`Failed to stop simulation: ${error}`);
    }
  }

  // Get current state
  async getCurrentState(): Promise<ApiSimulationStateUpdate> {
    try {
      await this.ensureInitialized();
      
      const request = new this.protoMessages.GetCurrentStateRequest();

      const response = await this.client.getCurrentState(request);

      return convertSimulationStateUpdateFromProto(response);
    } catch (error) {
      console.error('Get current state error:', error);
      throw new Error(`Failed to get current state: ${error}`);
    }
  }

  // Save hypergraph
  async saveHypergraph(options: {
    filename?: string;
    overwriteExisting?: boolean;
    prettyPrint?: boolean;
  } = {}): Promise<{ success: boolean; message: string; filePath?: string }> {
    try {
      await this.ensureInitialized();
      
      const request = new this.protoMessages.SaveHypergraphRequest();
      
      if (options.filename) {
        request.setFilename(options.filename);
      }
      if (options.overwriteExisting !== undefined) {
        request.setOverwriteExisting(options.overwriteExisting);
      }
      if (options.prettyPrint !== undefined) {
        request.setPrettyPrint(options.prettyPrint);
      }

      const response = await this.client.saveHypergraph(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
        filePath: response.getFilePath()
      };
    } catch (error) {
      console.error('Save hypergraph error:', error);
      throw new Error(`Failed to save hypergraph: ${error}`);
    }
  }

  // Load hypergraph
  async loadHypergraph(source: {
    predefinedExampleName?: string;
    fileContent?: string;
    filePath?: string;
  }): Promise<{ success: boolean; message: string; loadedState?: ApiHypergraphState }> {
    try {
      await this.ensureInitialized();
      
      const request = new this.protoMessages.LoadHypergraphRequest();
      
      if (source.predefinedExampleName) {
        request.setPredefinedExampleName(source.predefinedExampleName);
      } else if (source.fileContent) {
        request.setFileContent(source.fileContent);
      } else if (source.filePath) {
        request.setFilePath(source.filePath);
      }

      const response = await this.client.loadHypergraph(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
        loadedState: response.getLoadedState()
          ? convertHypergraphStateFromProto(response.getLoadedState())
          : undefined
      };
    } catch (error) {
      console.error('Load hypergraph error:', error);
      throw new Error(`Failed to load hypergraph: ${error}`);
    }
  }
}

// Create a singleton instance for the application
export const apiClient = new WolframApiClient(); 