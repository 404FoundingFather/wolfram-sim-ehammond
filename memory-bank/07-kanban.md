# Project Progress (Kanban Board)

**Last Updated:** May 14, 2025

This document tracks the current status of development tasks using a Kanban-style board. Items are moved based on the Development Plan (`06-developmentPlan.md`).

## Columns
-   **Backlog:** All features and tasks planned for the MVP, not yet prioritized for the current sprint.
-   **To Do (Sprint):** Tasks prioritized for the current sprint/iteration.
-   **In Progress:** Tasks actively being worked on.
-   **In Review:** Completed tasks awaiting code review or QA.
-   **Done:** Tasks that are completed, reviewed, and merged.

--- 

## Backlog

### Phase 1: Rust Simulation Engine Core (Post-Sprint 2)
-   **F1.5: Simulation Loop & Event Management**
    -   Task: Implement step-by-step execution logic (match, select, apply). - [Owner TBD]
    -   Task: Implement "continuous" simulation (fixed-point seeking loop). - [Owner TBD]
    -   Task: Define and log simulation "events". - [Owner TBD]
-   **F1.6: State Serialization & Deserialization**
    -   Task: Implement `serde` with `JSON` for `Hypergraph` state. - [Owner TBD]
    -   Task: Implement save-to-file and load-from-file functionality for simulation state. - [Owner TBD]

### Phase 2: gRPC Service Implementation
-   **F2.1**: Implement gRPC Service Definition (`WolframPhysicsSimulatorService` with PRD RPCs: `InitializeSimulation`, `StepSimulation`, `RunSimulation` (streaming), `StopSimulation`, `GetCurrentState`) - [Owner TBD]
    -   Task: Implement gRPC handler for `InitializeSimulation`. - [Owner TBD]
    -   Task: Implement gRPC handler for `StepSimulation`. - [Owner TBD]
    -   Task: Implement gRPC handler for `RunSimulation` (streaming). - [Owner TBD]
    -   Task: Implement gRPC handler for `StopSimulation`. - [Owner TBD]
    -   Task: Implement gRPC handler for `GetCurrentState`. - [Owner TBD]
-   **F2.2**: Ensure Protocol Buffer Message Definitions are finalized and match usage (PRD messages: `Atom`, `Relation`, `HypergraphState`, `SimulationEvent`, `SimulationStateUpdate`, plus relevant request/response messages) - [Owner TBD]
-   **F2.3**: Full Integration of gRPC service with the Rust simulation engine (expose all F1.x features through the defined MVP RPCs) - [Owner TBD]
    -   Task: Design and implement simulation state management (e.g., single global instance for MVP, potential for per-client/session if time allows and is deemed critical for MVP stability with multiple frontend interactions, though PRD implies single active simulation focus). - [Owner TBD]

#### Post-MVP gRPC Considerations (Examples)
-   Task: Design & Implement `SetRules` RPC for dynamic rule loading. - [Owner TBD, Post-MVP]
-   Task: Design & Implement `GetHypergraphSlice` RPC for fetching partial graph data. - [Owner TBD, Post-MVP]

### Phase 3: Web Frontend Development
-   **F3.2**: UI Controls
    -   Task: Implement UI for Initialize simulation (predefined/simple editor). - [Owner TBD]
    -   Task: Implement UI for Rule definitions input (Post-MVP, if F2.1 `SetRules` is implemented). - [Owner TBD]
    -   Task: Implement UI Buttons: Step, Run, Stop, Reset. - [Owner TBD]
-   **F3.3**: Hypergraph Visualization
    -   Task: Evaluate and select a 2D graph visualization library. - [Owner TBD]
    -   Task: Implement basic 2D rendering of atoms (nodes) and relations (hyperedges). - [Owner TBD]
    -   Task: Implement dynamic updates to visualization from backend state. - [Owner TBD]
    -   Task: Implement basic layout algorithm for visualization. - [Owner TBD]
-   **F3.4**: State Display
    -   Task: Display current step number. - [Owner TBD]
    -   Task: Display atom and relation counts. - [Owner TBD]
    -   Task: Display applied rule/event in the last step. - [Owner TBD]

--- 

## To Do (Sprint 1: Core Hypergraph & Rule Representation - F1.1, F1.2)
**Goal:** Implement stable data structures for atoms, relations, hypergraphs, and rule definitions in Rust.

-   Task: Define and implement `AtomId` type and `Atom` struct/metadata (F1.1) - [Owner TBD]
-   Task: Design and implement `Relation` (hyperedge) representation (e.g., `Vec<AtomId>`) (F1.1) - [Owner TBD]
-   Task: Implement core `Hypergraph` struct with methods for add/remove, basic queries (F1.1) - [Owner TBD]
-   Task: Define `Rule` struct (pattern hypergraph, replacement hypergraph) (F1.2) - [Owner TBD]
-   Task: Implement storage for a set of hardcoded rules (e.g., `{{x,y}} -> {{x,z},{z,y}}`) (F1.2) - [Owner TBD]
-   Task: Unit tests for all data structures and basic operations (F1.1, F1.2) - [Owner TBD]

--- 

## To Do (Sprint 2: Basic Pattern Matching & Rewriting - F1.3, F1.4)
**Goal:** Implement initial logic for finding rule matches and applying rewrites.
**Dependencies:** Sprint 1 completion.

-   Task: Develop basic sub-hypergraph isomorphism algorithm for pattern matching (F1.3) - [Owner TBD]
-   Task: Implement variable binding and substitution logic (F1.3) - [Owner TBD]
-   Task: Implement the hypergraph rewriting process (remove old, add new) (F1.4) - [Owner TBD]
-   Task: Unit tests for matching and rewriting simple cases (F1.3, F1.4) - [Owner TBD]

--- 

## In Progress
-   *(Move tasks here when started)*

--- 

## In Review
-   *(Move tasks here when PR is created/QA is needed)*

--- 

## Done

**Sprint 0: Foundational Setup (Completed May 13, 2025)**
-   Rust project (`Cargo.toml`), Tonic for gRPC. [Done]
-   Initial `.proto` file. [Done]
-   React (Vite) frontend. [Done]
-   gRPC-Web client code generation. [Done]

**Documentation & Planning (Pre-Sprint 0 / Ongoing)**
-   Project Initialization & PRD Definition (docs/wolfram-sim-prd.md)
-   Memory Bank Setup & Initial Population (`memory-bank/` files)
-   Refined Development Plan (`06-developmentPlan.md` update)

--- 

## Blocked/Issues
-   *(Track any blockers here)*

## Notes
-   Tasks are derived from `06-developmentPlan.md`.
-   [Owner TBD] and [Est. TBD] to be filled as sprint planning occurs for Sprint 1 onwards.