# 13. Quick Reference Guide from PRD

**Last Updated:** June 11, 2025 (Sprint 4 Completion)

This guide provides a quick lookup for key terms, features, and identifiers from the Wolfram Physics Simulator MVP PRD.

## Core Components & Technologies

-   **Simulation Engine**: Rust (Backend) ✅ IMPLEMENTED
    -   **Core Library Crate:** `wolfram-sim-rust`
    -   **gRPC Server Implementation:** `main.rs`
-   **User Interface**: TypeScript SPA (Frontend)
-   **Communication Protocol**: gRPC with gRPC-Web ✅ IMPLEMENTED
-   **gRPC Service**: `WolframPhysicsSimulatorService` ✅ IMPLEMENTED

## Key Data Structures (Protocol Buffers - F2.2)

-   **`Atom`**: `string id` ✅ IMPLEMENTED
-   **`Relation`**: `repeated string atom_ids` (hyperedge) ✅ IMPLEMENTED
-   **`HypergraphState`**: `repeated Atom atoms`, `repeated Relation relations`, `int64 step_number`, `uint64 next_atom_id`, `uint64 next_relation_id` ✅ IMPLEMENTED
-   **`SimulationEvent`**: `string id`, `string rule_id_applied`, `repeated string atoms_created`, `repeated string relations_created`, `repeated string relations_removed`, `string description`, etc. ✅ IMPLEMENTED
-   **`SimulationStateUpdate`**: `HypergraphState current_graph`, `repeated SimulationEvent recent_events`, `int64 step_number`, `bool is_running`, `string status_message` ✅ IMPLEMENTED

## Backend Features (Rust Simulation Engine - F1.x)

-   **Hypergraph Representation (F1.1)**: ✅ IMPLEMENTED - Atoms (nodes) and Relations (hyperedges - ordered lists of atoms).
-   **Rewrite Rules (F1.2)**: ✅ IMPLEMENTED - Hardcoded/predefined (e.g., `{{x,y}} -> {{x,z}, {z,y}}`).
-   **Pattern Matching (F1.3)**: ✅ IMPLEMENTED - Basic sub-hypergraph isomorphism with backtracking search.
-   **Hypergraph Rewriting (F1.4)**: ✅ IMPLEMENTED - Applying matched rules with variable binding and substitution.
-   **Simulation Loop (F1.5)**: ✅ IMPLEMENTED - Step-by-step and continuous evolution with configurable stopping conditions.
-   **Event Management (F1.6)**: ✅ IMPLEMENTED - Comprehensive event tracking and state transmission.
-   **Hypergraph Persistence (F1.7)**: ✅ IMPLEMENTED - Save/load hypergraph state from/to files (JSON), including 5 predefined examples.

## gRPC API Endpoints (F2.1)

-   `InitializeSimulation(InitializeRequest) returns (InitializeResponse)` ✅ IMPLEMENTED
-   `StepSimulation(StepRequest) returns (StepResponse)` ✅ IMPLEMENTED
-   `RunSimulation(RunRequest) returns (stream SimulationStateUpdate)` ✅ IMPLEMENTED
-   `StopSimulation(StopRequest) returns (StopResponse)` ✅ IMPLEMENTED
-   `GetCurrentState(GetCurrentStateRequest) returns (SimulationStateUpdate)` ✅ IMPLEMENTED
-   `SaveHypergraph(SaveHypergraphRequest) returns (SaveHypergraphResponse)` ✅ IMPLEMENTED
-   `LoadHypergraph(LoadHypergraphRequest) returns (LoadHypergraphResponse)` ✅ IMPLEMENTED

## Frontend Features (TypeScript SPA - F3.x)

-   **gRPC Client (F3.1)**: Communication with backend. [Next: Sprint 5]
-   **Simulation Controls (F3.2)**: Initialize, Step, Run, Stop, Save Hypergraph, Load Hypergraph buttons. [Next: Sprint 5]
-   **Hypergraph Visualization (F3.3)**: 2D display of atoms and relations, dynamic updates. [Next: Sprint 5]
    -   Binary relations: lines.
    -   Ternary+ relations: e.g., central node or common point.
-   **State Display (F3.4)**: Step number, atom/relation counts. [Next: Sprint 5]

## MVP Goals (Section 2)

-   **G1**: Functional Rust backend engine. ✅ IMPLEMENTED
-   **G2**: Web-based frontend for visualization. [Next: Sprint 5]
-   **G3**: Robust gRPC communication. ✅ IMPLEMENTED
-   **G4**: Basic user controls. [Next: Sprint 5]
-   **G5**: Extensible foundational architecture. ✅ IMPLEMENTED

## Key Non-Goals for MVP (Section 5)

-   User-defined rule editor.
-   Saving/loading arbitrary simulation rules (hypergraph state save/load is IN MVP and ✅ IMPLEMENTED).
-   Live AI-driven hypergraph generation from prompt (deferred to post-MVP).
-   Advanced visualization (3D, causal graphs, etc.).
-   High-performance matching for very large graphs.
-   Mobile responsiveness.

## Key Backend Modules (Implemented in `wolfram-sim-rust`)

-   `hypergraph`: ✅ IMPLEMENTED - Data structures for atoms, relations, hypergraph.
-   `rules`: ✅ IMPLEMENTED - Rule definition, pattern representation.
-   `matching`: ✅ IMPLEMENTED - Sub-hypergraph isomorphism logic.
-   `evolution`: ✅ IMPLEMENTED - Rewriting logic, event scheduling/selection.
-   `simulation`: ✅ IMPLEMENTED - Main simulation loop, state management, event tracking.
-   `serialization`: ✅ IMPLEMENTED - State saving/loading logic with PersistenceManager and predefined examples.
-   `main.rs`: ✅ IMPLEMENTED - Complete gRPC service with all 7 RPC handlers.

## Technical Choices (Section 6 - Design and Technical Considerations)

-   **Rust Backend (D1)**: `tonic` (gRPC), `tonic-web` ✅ IMPLEMENTED.
-   **Frontend (D2)**: Mainstream SPA (React, Vue, Svelte), 2D graph library (Vis.js, Sigma.js, etc.). [Next: Sprint 5]
-   **Communication (D3)**: Protocol Buffers for serialization ✅ IMPLEMENTED.

## Success Metrics (Section 7)

-   **S1**: Successful initialization. ✅ IMPLEMENTED
-   **S2**: Observable step-through changes. ✅ IMPLEMENTED
-   **S3**: Real-time continuous run (1-2 updates/sec for small graphs). ✅ IMPLEMENTED
-   **S4**: Reliable gRPC communication. ✅ IMPLEMENTED
-   **S5**: Understandable and extensible codebase. ✅ IMPLEMENTED

## Current Test Status
-   **Total Tests**: 72 tests
-   **Pass Rate**: 100%
-   **Coverage**: Complete backend functionality including simulation, persistence, and gRPC service

## Predefined Examples Available
1. **empty_graph**: Empty hypergraph for custom simulations
2. **single_edge**: Simple A--B edge for edge splitting demos
3. **triangle**: Three atoms in triangular cycle (A--B--C--A)
4. **small_path**: Linear path A--B--C--D
5. **small_cycle**: Four-atom cycle A--B--C--D--A