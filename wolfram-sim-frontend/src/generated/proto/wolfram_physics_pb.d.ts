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

  getStepNumber(): number;
  setStepNumber(value: number): void;

  getNextAtomId(): number;
  setNextAtomId(value: number): void;

  getNextRelationId(): number;
  setNextRelationId(value: number): void;

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
    stepNumber: number,
    nextAtomId: number,
    nextRelationId: number,
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

  getStepNumber(): number;
  setStepNumber(value: number): void;

  clearAtomsCreatedList(): void;
  getAtomsCreatedList(): Array<string>;
  setAtomsCreatedList(value: Array<string>): void;
  addAtomsCreated(value: string, index?: number): string;

  clearRelationsCreatedList(): void;
  getRelationsCreatedList(): Array<string>;
  setRelationsCreatedList(value: Array<string>): void;
  addRelationsCreated(value: string, index?: number): string;

  clearRelationsRemovedList(): void;
  getRelationsRemovedList(): Array<string>;
  setRelationsRemovedList(value: Array<string>): void;
  addRelationsRemoved(value: string, index?: number): string;

  getDescription(): string;
  setDescription(value: string): void;

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
    stepNumber: number,
    atomsCreatedList: Array<string>,
    relationsCreatedList: Array<string>,
    relationsRemovedList: Array<string>,
    description: string,
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

  getSuccess(): boolean;
  setSuccess(value: boolean): void;

  getMessage(): string;
  setMessage(value: string): void;

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
    success: boolean,
    message: string,
  }
}

export class RunRequest extends jspb.Message {
  getUpdateIntervalMs(): number;
  setUpdateIntervalMs(value: number): void;

  hasMaxSteps(): boolean;
  clearMaxSteps(): void;
  getMaxSteps(): number;
  setMaxSteps(value: number): void;

  getStopOnFixedPoint(): boolean;
  setStopOnFixedPoint(value: boolean): void;

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
    maxSteps: number,
    stopOnFixedPoint: boolean,
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

  getIsRunning(): boolean;
  setIsRunning(value: boolean): void;

  getStatusMessage(): string;
  setStatusMessage(value: string): void;

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
    isRunning: boolean,
    statusMessage: string,
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

  hasFinalState(): boolean;
  clearFinalState(): void;
  getFinalState(): HypergraphState | undefined;
  setFinalState(value?: HypergraphState): void;

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
    finalState?: HypergraphState.AsObject,
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

export class SaveHypergraphRequest extends jspb.Message {
  hasFilename(): boolean;
  clearFilename(): void;
  getFilename(): string;
  setFilename(value: string): void;

  getOverwriteExisting(): boolean;
  setOverwriteExisting(value: boolean): void;

  getPrettyPrint(): boolean;
  setPrettyPrint(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveHypergraphRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SaveHypergraphRequest): SaveHypergraphRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SaveHypergraphRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveHypergraphRequest;
  static deserializeBinaryFromReader(message: SaveHypergraphRequest, reader: jspb.BinaryReader): SaveHypergraphRequest;
}

export namespace SaveHypergraphRequest {
  export type AsObject = {
    filename: string,
    overwriteExisting: boolean,
    prettyPrint: boolean,
  }
}

export class SaveHypergraphResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): void;

  getMessage(): string;
  setMessage(value: string): void;

  getFilePath(): string;
  setFilePath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveHypergraphResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SaveHypergraphResponse): SaveHypergraphResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SaveHypergraphResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveHypergraphResponse;
  static deserializeBinaryFromReader(message: SaveHypergraphResponse, reader: jspb.BinaryReader): SaveHypergraphResponse;
}

export namespace SaveHypergraphResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    filePath: string,
  }
}

export class LoadHypergraphRequest extends jspb.Message {
  hasPredefinedExampleName(): boolean;
  clearPredefinedExampleName(): void;
  getPredefinedExampleName(): string;
  setPredefinedExampleName(value: string): void;

  hasFileContent(): boolean;
  clearFileContent(): void;
  getFileContent(): string;
  setFileContent(value: string): void;

  hasFilePath(): boolean;
  clearFilePath(): void;
  getFilePath(): string;
  setFilePath(value: string): void;

  getSourceCase(): LoadHypergraphRequest.SourceCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoadHypergraphRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LoadHypergraphRequest): LoadHypergraphRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LoadHypergraphRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoadHypergraphRequest;
  static deserializeBinaryFromReader(message: LoadHypergraphRequest, reader: jspb.BinaryReader): LoadHypergraphRequest;
}

export namespace LoadHypergraphRequest {
  export type AsObject = {
    predefinedExampleName: string,
    fileContent: string,
    filePath: string,
  }

  export enum SourceCase {
    SOURCE_NOT_SET = 0,
    PREDEFINED_EXAMPLE_NAME = 1,
    FILE_CONTENT = 2,
    FILE_PATH = 3,
  }
}

export class LoadHypergraphResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): void;

  getMessage(): string;
  setMessage(value: string): void;

  hasLoadedState(): boolean;
  clearLoadedState(): void;
  getLoadedState(): HypergraphState | undefined;
  setLoadedState(value?: HypergraphState): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoadHypergraphResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LoadHypergraphResponse): LoadHypergraphResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LoadHypergraphResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoadHypergraphResponse;
  static deserializeBinaryFromReader(message: LoadHypergraphResponse, reader: jspb.BinaryReader): LoadHypergraphResponse;
}

export namespace LoadHypergraphResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    loadedState?: HypergraphState.AsObject,
  }
}

export class ListPredefinedExamplesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPredefinedExamplesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListPredefinedExamplesRequest): ListPredefinedExamplesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListPredefinedExamplesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPredefinedExamplesRequest;
  static deserializeBinaryFromReader(message: ListPredefinedExamplesRequest, reader: jspb.BinaryReader): ListPredefinedExamplesRequest;
}

export namespace ListPredefinedExamplesRequest {
  export type AsObject = {
  }
}

export class PredefinedExampleInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getAtomCount(): number;
  setAtomCount(value: number): void;

  getRelationCount(): number;
  setRelationCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PredefinedExampleInfo.AsObject;
  static toObject(includeInstance: boolean, msg: PredefinedExampleInfo): PredefinedExampleInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PredefinedExampleInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PredefinedExampleInfo;
  static deserializeBinaryFromReader(message: PredefinedExampleInfo, reader: jspb.BinaryReader): PredefinedExampleInfo;
}

export namespace PredefinedExampleInfo {
  export type AsObject = {
    name: string,
    description: string,
    atomCount: number,
    relationCount: number,
  }
}

export class ListPredefinedExamplesResponse extends jspb.Message {
  clearExamplesList(): void;
  getExamplesList(): Array<PredefinedExampleInfo>;
  setExamplesList(value: Array<PredefinedExampleInfo>): void;
  addExamples(value?: PredefinedExampleInfo, index?: number): PredefinedExampleInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPredefinedExamplesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListPredefinedExamplesResponse): ListPredefinedExamplesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListPredefinedExamplesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPredefinedExamplesResponse;
  static deserializeBinaryFromReader(message: ListPredefinedExamplesResponse, reader: jspb.BinaryReader): ListPredefinedExamplesResponse;
}

export namespace ListPredefinedExamplesResponse {
  export type AsObject = {
    examplesList: Array<PredefinedExampleInfo.AsObject>,
  }
}

