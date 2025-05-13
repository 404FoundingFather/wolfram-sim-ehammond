// package: wolfram_physics_simulator
// file: wolfram_physics.proto

import * as jspb from "google-protobuf";

export class Atom extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Atom.AsObject;
  static toObject(includeInstance: boolean, msg: Atom): Atom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Atom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Atom;
  static deserializeBinaryFromReader(message: Atom, reader: jspb.BinaryReader): Atom;
}

export namespace Atom {
  export type AsObject = {
    id: string,
  }
}

export class Relation extends jspb.Message {
  clearAtomIdsList(): void;
  getAtomIdsList(): Array<string>;
  setAtomIdsList(value: Array<string>): void;
  addAtomIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Relation.AsObject;
  static toObject(includeInstance: boolean, msg: Relation): Relation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Relation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Relation;
  static deserializeBinaryFromReader(message: Relation, reader: jspb.BinaryReader): Relation;
}

export namespace Relation {
  export type AsObject = {
    atomIdsList: Array<string>,
  }
}

export class HypergraphState extends jspb.Message {
  clearAtomsList(): void;
  getAtomsList(): Array<Atom>;
  setAtomsList(value: Array<Atom>): void;
  addAtoms(value?: Atom, index?: number): Atom;

  clearRelationsList(): void;
  getRelationsList(): Array<Relation>;
  setRelationsList(value: Array<Relation>): void;
  addRelations(value?: Relation, index?: number): Relation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HypergraphState.AsObject;
  static toObject(includeInstance: boolean, msg: HypergraphState): HypergraphState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HypergraphState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HypergraphState;
  static deserializeBinaryFromReader(message: HypergraphState, reader: jspb.BinaryReader): HypergraphState;
}

export namespace HypergraphState {
  export type AsObject = {
    atomsList: Array<Atom.AsObject>,
    relationsList: Array<Relation.AsObject>,
  }
}

export class SimulationEvent extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getRuleIdApplied(): string;
  setRuleIdApplied(value: string): void;

  clearAtomsInvolvedInputList(): void;
  getAtomsInvolvedInputList(): Array<string>;
  setAtomsInvolvedInputList(value: Array<string>): void;
  addAtomsInvolvedInput(value: string, index?: number): string;

  clearAtomsInvolvedOutputList(): void;
  getAtomsInvolvedOutputList(): Array<string>;
  setAtomsInvolvedOutputList(value: Array<string>): void;
  addAtomsInvolvedOutput(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SimulationEvent.AsObject;
  static toObject(includeInstance: boolean, msg: SimulationEvent): SimulationEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SimulationEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SimulationEvent;
  static deserializeBinaryFromReader(message: SimulationEvent, reader: jspb.BinaryReader): SimulationEvent;
}

export namespace SimulationEvent {
  export type AsObject = {
    id: string,
    ruleIdApplied: string,
    atomsInvolvedInputList: Array<string>,
    atomsInvolvedOutputList: Array<string>,
  }
}

export class InitializeRequest extends jspb.Message {
  hasInitialHypergraph(): boolean;
  clearInitialHypergraph(): void;
  getInitialHypergraph(): HypergraphState | undefined;
  setInitialHypergraph(value?: HypergraphState): void;

  getPredefinedInitialStateId(): string;
  setPredefinedInitialStateId(value: string): void;

  clearRuleIdsToUseList(): void;
  getRuleIdsToUseList(): Array<string>;
  setRuleIdsToUseList(value: Array<string>): void;
  addRuleIdsToUse(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitializeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitializeRequest): InitializeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitializeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitializeRequest;
  static deserializeBinaryFromReader(message: InitializeRequest, reader: jspb.BinaryReader): InitializeRequest;
}

export namespace InitializeRequest {
  export type AsObject = {
    initialHypergraph?: HypergraphState.AsObject,
    predefinedInitialStateId: string,
    ruleIdsToUseList: Array<string>,
  }
}

export class InitializeResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): void;

  getMessage(): string;
  setMessage(value: string): void;

  hasInitialHypergraphState(): boolean;
  clearInitialHypergraphState(): void;
  getInitialHypergraphState(): HypergraphState | undefined;
  setInitialHypergraphState(value?: HypergraphState): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitializeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InitializeResponse): InitializeResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitializeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitializeResponse;
  static deserializeBinaryFromReader(message: InitializeResponse, reader: jspb.BinaryReader): InitializeResponse;
}

export namespace InitializeResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    initialHypergraphState?: HypergraphState.AsObject,
  }
}

export class StepRequest extends jspb.Message {
  getNumSteps(): number;
  setNumSteps(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StepRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StepRequest): StepRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StepRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StepRequest;
  static deserializeBinaryFromReader(message: StepRequest, reader: jspb.BinaryReader): StepRequest;
}

export namespace StepRequest {
  export type AsObject = {
    numSteps: number,
  }
}

export class StepResponse extends jspb.Message {
  hasNewHypergraphState(): boolean;
  clearNewHypergraphState(): void;
  getNewHypergraphState(): HypergraphState | undefined;
  setNewHypergraphState(value?: HypergraphState): void;

  clearEventsOccurredList(): void;
  getEventsOccurredList(): Array<SimulationEvent>;
  setEventsOccurredList(value: Array<SimulationEvent>): void;
  addEventsOccurred(value?: SimulationEvent, index?: number): SimulationEvent;

  getCurrentStepNumber(): number;
  setCurrentStepNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StepResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StepResponse): StepResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StepResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StepResponse;
  static deserializeBinaryFromReader(message: StepResponse, reader: jspb.BinaryReader): StepResponse;
}

export namespace StepResponse {
  export type AsObject = {
    newHypergraphState?: HypergraphState.AsObject,
    eventsOccurredList: Array<SimulationEvent.AsObject>,
    currentStepNumber: number,
  }
}

export class RunRequest extends jspb.Message {
  getUpdateIntervalMs(): number;
  setUpdateIntervalMs(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RunRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RunRequest): RunRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RunRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RunRequest;
  static deserializeBinaryFromReader(message: RunRequest, reader: jspb.BinaryReader): RunRequest;
}

export namespace RunRequest {
  export type AsObject = {
    updateIntervalMs: number,
  }
}

export class SimulationStateUpdate extends jspb.Message {
  hasCurrentGraph(): boolean;
  clearCurrentGraph(): void;
  getCurrentGraph(): HypergraphState | undefined;
  setCurrentGraph(value?: HypergraphState): void;

  clearRecentEventsList(): void;
  getRecentEventsList(): Array<SimulationEvent>;
  setRecentEventsList(value: Array<SimulationEvent>): void;
  addRecentEvents(value?: SimulationEvent, index?: number): SimulationEvent;

  getStepNumber(): number;
  setStepNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SimulationStateUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: SimulationStateUpdate): SimulationStateUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SimulationStateUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SimulationStateUpdate;
  static deserializeBinaryFromReader(message: SimulationStateUpdate, reader: jspb.BinaryReader): SimulationStateUpdate;
}

export namespace SimulationStateUpdate {
  export type AsObject = {
    currentGraph?: HypergraphState.AsObject,
    recentEventsList: Array<SimulationEvent.AsObject>,
    stepNumber: number,
  }
}

export class StopRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StopRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StopRequest): StopRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StopRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StopRequest;
  static deserializeBinaryFromReader(message: StopRequest, reader: jspb.BinaryReader): StopRequest;
}

export namespace StopRequest {
  export type AsObject = {
  }
}

export class StopResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StopResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StopResponse): StopResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StopResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StopResponse;
  static deserializeBinaryFromReader(message: StopResponse, reader: jspb.BinaryReader): StopResponse;
}

export namespace StopResponse {
  export type AsObject = {
    success: boolean,
    message: string,
  }
}

export class GetCurrentStateRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCurrentStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCurrentStateRequest): GetCurrentStateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCurrentStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCurrentStateRequest;
  static deserializeBinaryFromReader(message: GetCurrentStateRequest, reader: jspb.BinaryReader): GetCurrentStateRequest;
}

export namespace GetCurrentStateRequest {
  export type AsObject = {
  }
}

