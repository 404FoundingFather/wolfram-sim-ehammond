// package: wolfram_physics_simulator
// file: wolfram_physics.proto

import * as wolfram_physics_pb from "./wolfram_physics_pb";
import {grpc} from "@improbable-eng/grpc-web";

type WolframPhysicsSimulatorServiceInitializeSimulation = {
  readonly methodName: string;
  readonly service: typeof WolframPhysicsSimulatorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof wolfram_physics_pb.InitializeRequest;
  readonly responseType: typeof wolfram_physics_pb.InitializeResponse;
};

type WolframPhysicsSimulatorServiceStepSimulation = {
  readonly methodName: string;
  readonly service: typeof WolframPhysicsSimulatorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof wolfram_physics_pb.StepRequest;
  readonly responseType: typeof wolfram_physics_pb.StepResponse;
};

type WolframPhysicsSimulatorServiceRunSimulation = {
  readonly methodName: string;
  readonly service: typeof WolframPhysicsSimulatorService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof wolfram_physics_pb.RunRequest;
  readonly responseType: typeof wolfram_physics_pb.SimulationStateUpdate;
};

type WolframPhysicsSimulatorServiceStopSimulation = {
  readonly methodName: string;
  readonly service: typeof WolframPhysicsSimulatorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof wolfram_physics_pb.StopRequest;
  readonly responseType: typeof wolfram_physics_pb.StopResponse;
};

type WolframPhysicsSimulatorServiceGetCurrentState = {
  readonly methodName: string;
  readonly service: typeof WolframPhysicsSimulatorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof wolfram_physics_pb.GetCurrentStateRequest;
  readonly responseType: typeof wolfram_physics_pb.SimulationStateUpdate;
};

type WolframPhysicsSimulatorServiceSaveHypergraph = {
  readonly methodName: string;
  readonly service: typeof WolframPhysicsSimulatorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof wolfram_physics_pb.SaveHypergraphRequest;
  readonly responseType: typeof wolfram_physics_pb.SaveHypergraphResponse;
};

type WolframPhysicsSimulatorServiceLoadHypergraph = {
  readonly methodName: string;
  readonly service: typeof WolframPhysicsSimulatorService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof wolfram_physics_pb.LoadHypergraphRequest;
  readonly responseType: typeof wolfram_physics_pb.LoadHypergraphResponse;
};

export class WolframPhysicsSimulatorService {
  static readonly serviceName: string;
  static readonly InitializeSimulation: WolframPhysicsSimulatorServiceInitializeSimulation;
  static readonly StepSimulation: WolframPhysicsSimulatorServiceStepSimulation;
  static readonly RunSimulation: WolframPhysicsSimulatorServiceRunSimulation;
  static readonly StopSimulation: WolframPhysicsSimulatorServiceStopSimulation;
  static readonly GetCurrentState: WolframPhysicsSimulatorServiceGetCurrentState;
  static readonly SaveHypergraph: WolframPhysicsSimulatorServiceSaveHypergraph;
  static readonly LoadHypergraph: WolframPhysicsSimulatorServiceLoadHypergraph;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class WolframPhysicsSimulatorServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  initializeSimulation(
    requestMessage: wolfram_physics_pb.InitializeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.InitializeResponse|null) => void
  ): UnaryResponse;
  initializeSimulation(
    requestMessage: wolfram_physics_pb.InitializeRequest,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.InitializeResponse|null) => void
  ): UnaryResponse;
  stepSimulation(
    requestMessage: wolfram_physics_pb.StepRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.StepResponse|null) => void
  ): UnaryResponse;
  stepSimulation(
    requestMessage: wolfram_physics_pb.StepRequest,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.StepResponse|null) => void
  ): UnaryResponse;
  runSimulation(requestMessage: wolfram_physics_pb.RunRequest, metadata?: grpc.Metadata): ResponseStream<wolfram_physics_pb.SimulationStateUpdate>;
  stopSimulation(
    requestMessage: wolfram_physics_pb.StopRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.StopResponse|null) => void
  ): UnaryResponse;
  stopSimulation(
    requestMessage: wolfram_physics_pb.StopRequest,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.StopResponse|null) => void
  ): UnaryResponse;
  getCurrentState(
    requestMessage: wolfram_physics_pb.GetCurrentStateRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.SimulationStateUpdate|null) => void
  ): UnaryResponse;
  getCurrentState(
    requestMessage: wolfram_physics_pb.GetCurrentStateRequest,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.SimulationStateUpdate|null) => void
  ): UnaryResponse;
  saveHypergraph(
    requestMessage: wolfram_physics_pb.SaveHypergraphRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.SaveHypergraphResponse|null) => void
  ): UnaryResponse;
  saveHypergraph(
    requestMessage: wolfram_physics_pb.SaveHypergraphRequest,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.SaveHypergraphResponse|null) => void
  ): UnaryResponse;
  loadHypergraph(
    requestMessage: wolfram_physics_pb.LoadHypergraphRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.LoadHypergraphResponse|null) => void
  ): UnaryResponse;
  loadHypergraph(
    requestMessage: wolfram_physics_pb.LoadHypergraphRequest,
    callback: (error: ServiceError|null, responseMessage: wolfram_physics_pb.LoadHypergraphResponse|null) => void
  ): UnaryResponse;
}

