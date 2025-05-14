# 13. Quick Reference Guide from PRD

**Last Updated:** May 14, 2025

This guide provides a quick lookup for key terms, features, and identifiers from the Wolfram Physics Simulator MVP PRD.

## Core Components & Technologies

-   **Simulation Engine**: Rust (Backend)
    -   **Core Library Crate:** `wolfram_engine_core`
    -   **gRPC Server Crate:** `grpc_server`
-   **User Interface**: TypeScript SPA (Frontend)
-   **Communication Protocol**: gRPC with gRPC-Web
-   **gRPC Service**: `WolframPhysicsSimulatorService`

## Key Data Structures (Protocol Buffers - F2.2)

-   **`Atom`**: `string id`
-   **`Relation`**: `repeated string atom_ids` (hyperedge)
-   **`HypergraphState`**: `repeated Atom atoms`, `repeated Relation relations`
-   **`SimulationEvent`**: `string id`, `string rule_id_applied`, etc. (details changes during simulation)
-   **`SimulationStateUpdate`**: `HypergraphState current_graph`, `repeated SimulationEvent recent_events`, `int64 step_number` (primary message for frontend updates)

## Backend Features (Rust Simulation Engine - F1.x)

-   **Hypergraph Representation (F1.1)**: Atoms (nodes) and Relations (hyperedges - ordered lists of atoms).
-   **Rewrite Rules (F1.2)**: Hardcoded/predefined (e.g., `{{x,y}} -> {{x,z}, {z,y}}`).
-   **Pattern Matching (F1.3)**: Basic sub-hypergraph isomorphism.
-   **Hypergraph Rewriting (F1.4)**: Applying matched rules.
-   **Simulation Loop (F1.5)**: Step-by-step or continuous evolution.
-   **Event Management (F1.6)**: Identifying update events, serializing state.
-   **Hypergraph Persistence (F1.7)**: Save/load hypergraph state from/to files (JSON for MVP), including predefined examples.

## gRPC API Endpoints (F2.1)

-   `InitializeSimulation(InitializeRequest) returns (InitializeResponse)`
-   `StepSimulation(StepRequest) returns (StepResponse)`
-   `RunSimulation(RunRequest) returns (stream SimulationStateUpdate)`
-   `StopSimulation(StopRequest) returns (StopResponse)`
-   `GetCurrentState(GetCurrentStateRequest) returns (SimulationStateUpdate)`
-   `SaveHypergraph(SaveHypergraphRequest) returns (SaveHypergraphResponse)`
-   `LoadHypergraph(LoadHypergraphRequest) returns (LoadHypergraphResponse)`

## Frontend Features (TypeScript SPA - F3.x)

-   **gRPC Client (F3.1)**: Communication with backend.
-   **Simulation Controls (F3.2)**: Initialize, Step, Run, Stop, Save Hypergraph, Load Hypergraph buttons.
-   **Hypergraph Visualization (F3.3)**: 2D display of atoms and relations, dynamic updates.
    -   Binary relations: lines.
    -   Ternary+ relations: e.g., central node or common point.
-   **State Display (F3.4)**: Step number, atom/relation counts.

## MVP Goals (Section 2)

-   **G1**: Functional Rust backend engine.
-   **G2**: Web-based frontend for visualization.
-   **G3**: Robust gRPC communication.
-   **G4**: Basic user controls.
-   **G5**: Extensible foundational architecture.

## Key Non-Goals for MVP (Section 5)

-   User-defined rule editor.
-   Saving/loading arbitrary simulation rules (hypergraph state save/load is IN MVP).
-   Live AI-driven hypergraph generation from prompt (deferred to post-MVP).
-   Advanced visualization (3D, causal graphs, etc.).
-   High-performance matching for very large graphs.
-   Mobile responsiveness.

## Key Backend Modules (Illustrative, within `wolfram_engine_core`)

-   `hypergraph`: Data structures for atoms, relations, hypergraph.
-   `rules`: Rule definition, pattern representation.
-   `matching`: Sub-hypergraph isomorphism logic.
-   `evolution`: Rewriting logic, event scheduling/selection.
-   `simulation`: Main simulation loop, state management.
-   `serialization`: State saving/loading logic (e.g., via `serde` for F1.7 hypergraph persistence; Protobufs for F1.6 gRPC state transmission).

## Technical Choices (Section 6 - Design and Technical Considerations)

-   **Rust Backend (D1)**: `tonic` (gRPC), `tonic-web`.
-   **Frontend (D2)**: Mainstream SPA (React, Vue, Svelte), 2D graph library (Vis.js, Sigma.js, etc.).
-   **Communication (D3)**: Protocol Buffers for serialization.

## Success Metrics (Section 7)

-   **S1**: Successful initialization.
-   **S2**: Observable step-through changes.
-   **S3**: Real-time continuous run (1-2 updates/sec for small graphs).
-   **S4**: Reliable gRPC communication.
-   **S5**: Understandable and extensible codebase.