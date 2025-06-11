import { create } from 'zustand';
import { apiClient } from '../services/apiClient';
import type { 
  ApiHypergraphState, 
  ApiSimulationEvent, 
  ApiSimulationStateUpdate 
} from '../services/apiClient';

// Predefined examples available in the backend
export const PREDEFINED_EXAMPLES = [
  { id: 'empty_graph', name: 'Empty Graph', description: 'Empty hypergraph for custom simulations' },
  { id: 'single_edge', name: 'Single Edge', description: 'Simple A--B edge for edge splitting demos' },
  { id: 'triangle', name: 'Triangle', description: 'Three atoms in triangular cycle (A--B--C--A)' },
  { id: 'small_path', name: 'Small Path', description: 'Linear path A--B--C--D' },
  { id: 'small_cycle', name: 'Small Cycle', description: 'Four-atom cycle A--B--C--D--A' }
];

export interface SimulationState {
  // Hypergraph state
  hypergraphState: ApiHypergraphState | null;
  
  // Simulation status
  isInitialized: boolean;
  isRunning: boolean;
  isPaused: boolean;
  currentStepNumber: number;
  
  // Events and history
  recentEvents: ApiSimulationEvent[];
  eventHistory: ApiSimulationEvent[];
  
  // UI state
  statusMessage: string;
  errorMessage: string | null;
  isLoading: boolean;
  
  // Selected options
  selectedExample: string;
  updateInterval: number; // milliseconds
  
  // Stream management
  cancelStream: (() => void) | null;
  
  // Actions
  initializeSimulation: (exampleId?: string) => Promise<void>;
  stepSimulation: (numSteps?: number) => Promise<void>;
  runSimulation: () => Promise<void>;
  pauseSimulation: () => void;
  stopSimulation: () => Promise<void>;
  resetSimulation: () => void;
  setSelectedExample: (exampleId: string) => void;
  setUpdateInterval: (interval: number) => void;
  clearError: () => void;
  saveHypergraph: (filename?: string) => Promise<void>;
  loadHypergraph: (source: { predefinedExampleName?: string; fileContent?: string }) => Promise<void>;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Initial state
  hypergraphState: null,
  isInitialized: false,
  isRunning: false,
  isPaused: false,
  currentStepNumber: 0,
  recentEvents: [],
  eventHistory: [],
  statusMessage: 'Ready to initialize simulation',
  errorMessage: null,
  isLoading: false,
  selectedExample: 'single_edge',
  updateInterval: 500, // 500ms default
  cancelStream: null,

  // Actions
  initializeSimulation: async (exampleId?: string) => {
    const state = get();
    set({ isLoading: true, errorMessage: null, statusMessage: 'Initializing simulation...' });
    
    try {
      const result = await apiClient.initializeSimulation({
        predefinedInitialStateId: exampleId || state.selectedExample
      });
      
      if (result.success && result.initialState) {
        set({
          hypergraphState: result.initialState,
          isInitialized: true,
          isRunning: false,
          isPaused: false,
          currentStepNumber: result.initialState.stepNumber || 0,
          recentEvents: [],
          eventHistory: [],
          statusMessage: result.message,
          isLoading: false
        });
      } else {
        set({
          errorMessage: result.message || 'Failed to initialize simulation',
          statusMessage: 'Initialization failed',
          isLoading: false
        });
      }
    } catch (error) {
      set({
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        statusMessage: 'Connection error',
        isLoading: false
      });
    }
  },

  stepSimulation: async (numSteps = 1) => {
    set({ isLoading: true, errorMessage: null, statusMessage: 'Executing step...' });
    
    try {
      const result = await apiClient.stepSimulation(numSteps);
      
      if (result.success && result.newState) {
        const newEvents = result.events || [];
        const state = get();
        
        set({
          hypergraphState: result.newState,
          currentStepNumber: result.currentStepNumber || state.currentStepNumber + numSteps,
          recentEvents: newEvents,
          eventHistory: [...state.eventHistory, ...newEvents].slice(-50), // Keep last 50 events
          statusMessage: result.message || `Step ${result.currentStepNumber || state.currentStepNumber + numSteps} completed`,
          isLoading: false
        });
      } else {
        set({
          errorMessage: result.message || 'Step execution failed',
          statusMessage: 'Step failed',
          isLoading: false
        });
      }
    } catch (error) {
      set({
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        statusMessage: 'Step execution error',
        isLoading: false
      });
    }
  },

  runSimulation: async () => {
    const state = get();
    if (state.isRunning || !state.isInitialized) return;
    
    set({ 
      isRunning: true, 
      isPaused: false, 
      statusMessage: 'Running simulation...', 
      errorMessage: null 
    });
    
    try {
      const cancelFn = await apiClient.runSimulation(
        { updateIntervalMs: state.updateInterval },
        (update: ApiSimulationStateUpdate) => {
          const currentState = get();
          if (currentState.isRunning) {
            set({
              hypergraphState: update.currentGraph,
              currentStepNumber: update.stepNumber,
              recentEvents: update.recentEvents,
              eventHistory: [...currentState.eventHistory, ...update.recentEvents].slice(-50),
              statusMessage: update.statusMessage || `Step ${update.stepNumber} - Running`
            });
          }
        }
      );
      
      set({ cancelStream: cancelFn });
    } catch (error) {
      set({
        isRunning: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to start simulation',
        statusMessage: 'Start simulation error'
      });
    }
  },

  pauseSimulation: () => {
    const state = get();
    if (state.cancelStream) {
      state.cancelStream();
    }
    set({ 
      isRunning: false, 
      isPaused: true, 
      cancelStream: null,
      statusMessage: 'Simulation paused' 
    });
  },

  stopSimulation: async () => {
    const state = get();
    if (state.cancelStream) {
      state.cancelStream();
    }
    
    set({ 
      isRunning: false, 
      isPaused: false, 
      cancelStream: null,
      statusMessage: 'Stopping simulation...' 
    });
    
    try {
      const result = await apiClient.stopSimulation();
      set({ 
        statusMessage: result.message || 'Simulation stopped' 
      });
    } catch (error) {
      set({
        errorMessage: error instanceof Error ? error.message : 'Error stopping simulation',
        statusMessage: 'Stop error'
      });
    }
  },

  resetSimulation: () => {
    const state = get();
    if (state.cancelStream) {
      state.cancelStream();
    }
    
    set({
      hypergraphState: null,
      isInitialized: false,
      isRunning: false,
      isPaused: false,
      currentStepNumber: 0,
      recentEvents: [],
      eventHistory: [],
      statusMessage: 'Ready to initialize simulation',
      errorMessage: null,
      isLoading: false,
      cancelStream: null
    });
  },

  setSelectedExample: (exampleId: string) => {
    set({ selectedExample: exampleId });
  },

  setUpdateInterval: (interval: number) => {
    set({ updateInterval: interval });
  },

  clearError: () => {
    set({ errorMessage: null });
  },

  saveHypergraph: async (filename?: string) => {
    set({ isLoading: true, errorMessage: null, statusMessage: 'Saving hypergraph...' });
    
    try {
      const result = await apiClient.saveHypergraph({ filename, prettyPrint: true });
      
      set({
        statusMessage: result.success 
          ? `Saved to ${result.filePath || filename || 'file'}` 
          : result.message,
        errorMessage: result.success ? null : result.message,
        isLoading: false
      });
    } catch (error) {
      set({
        errorMessage: error instanceof Error ? error.message : 'Save failed',
        statusMessage: 'Save error',
        isLoading: false
      });
    }
  },

  loadHypergraph: async (source: { predefinedExampleName?: string; fileContent?: string }) => {
    set({ isLoading: true, errorMessage: null, statusMessage: 'Loading hypergraph...' });
    
    try {
      const result = await apiClient.loadHypergraph(source);
      
      if (result.success && result.loadedState) {
        set({
          hypergraphState: result.loadedState,
          isInitialized: true,
          isRunning: false,
          isPaused: false,
          currentStepNumber: result.loadedState.stepNumber || 0,
          recentEvents: [],
          eventHistory: [],
          statusMessage: result.message,
          isLoading: false
        });
      } else {
        set({
          errorMessage: result.message || 'Failed to load hypergraph',
          statusMessage: 'Load failed',
          isLoading: false
        });
      }
    } catch (error) {
      set({
        errorMessage: error instanceof Error ? error.message : 'Load error',
        statusMessage: 'Load error',
        isLoading: false
      });
    }
  }
})); 