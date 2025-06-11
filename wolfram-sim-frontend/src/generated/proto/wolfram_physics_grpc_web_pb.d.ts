// TypeScript declarations for wolfram_physics_grpc_web_pb.js

import * as pb from './wolfram_physics_pb';

export class WolframPhysicsSimulatorServiceClient {
  constructor(hostname: string, credentials?: any, options?: any);
  
  initializeSimulation(
    request: pb.InitializeRequest,
    metadata?: any,
    callback?: (error: any, response: pb.InitializeResponse) => void
  ): any;
  
  stepSimulation(
    request: pb.StepRequest,
    metadata?: any,
    callback?: (error: any, response: pb.StepResponse) => void
  ): any;
  
  runSimulation(
    request: pb.RunRequest,
    metadata?: any
  ): any;
  
  stopSimulation(
    request: pb.StopRequest,
    metadata?: any,
    callback?: (error: any, response: pb.StopResponse) => void
  ): any;
  
  getCurrentState(
    request: pb.GetCurrentStateRequest,
    metadata?: any,
    callback?: (error: any, response: pb.SimulationStateUpdate) => void
  ): any;
  
  saveHypergraph(
    request: pb.SaveHypergraphRequest,
    metadata?: any,
    callback?: (error: any, response: pb.SaveHypergraphResponse) => void
  ): any;
  
  loadHypergraph(
    request: pb.LoadHypergraphRequest,
    metadata?: any,
    callback?: (error: any, response: pb.LoadHypergraphResponse) => void
  ): any;
}

export class WolframPhysicsSimulatorServicePromiseClient {
  constructor(hostname: string, credentials?: any, options?: any);
  
  initializeSimulation(
    request: pb.InitializeRequest,
    metadata?: any
  ): Promise<pb.InitializeResponse>;
  
  stepSimulation(
    request: pb.StepRequest,
    metadata?: any
  ): Promise<pb.StepResponse>;
  
  runSimulation(
    request: pb.RunRequest,
    metadata?: any
  ): {
    on(event: 'data', handler: (response: pb.SimulationStateUpdate) => void): void;
    on(event: 'error', handler: (error: any) => void): void;
    on(event: 'end', handler: () => void): void;
    cancel(): void;
  };
  
  stopSimulation(
    request: pb.StopRequest,
    metadata?: any
  ): Promise<pb.StopResponse>;
  
  getCurrentState(
    request: pb.GetCurrentStateRequest,
    metadata?: any
  ): Promise<pb.SimulationStateUpdate>;
  
  saveHypergraph(
    request: pb.SaveHypergraphRequest,
    metadata?: any
  ): Promise<pb.SaveHypergraphResponse>;
  
  loadHypergraph(
    request: pb.LoadHypergraphRequest,
    metadata?: any
  ): Promise<pb.LoadHypergraphResponse>;
} 