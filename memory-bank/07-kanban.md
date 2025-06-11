# Project Progress (Kanban Board)

**Last Updated:** June 11, 2025 (Sprint 2 Completion)

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
-   **F1.6: State Serialization & Deserialization** (Now Event Management & State Transmission)
    -   Task: Define and log/track simulation "events" (application of a rule) for transmission. - [Owner TBD]
    -   Task: Ensure `HypergraphState` for gRPC includes necessary data (atoms, relations, step #). - [Owner TBD]
-   **F1.7: Hypergraph Persistence (NEW)**
    -   Task: Implement `serde` serialization for `HypergraphState` to JSON. - [Owner TBD]
    -   Task: Implement `serde` deserialization for `HypergraphState` from JSON. - [Owner TBD]
    -   Task: Implement Rust logic to save current hypergraph to a file. - [Owner TBD]
    -   Task: Implement Rust logic to load a hypergraph from a file. - [Owner TBD]
    -   Task: Package 3-5 predefined hypergraph JSON examples as assets. - [Owner TBD]
    -   Task: Implement Rust logic to load predefined hypergraph examples. - [Owner TBD]
    -   Task: Unit tests for hypergraph save/load functionality. - [Owner TBD]

### Phase 2: gRPC Service Implementation
-   **F2.1**: Implement gRPC Service Definition (RPCs: ..., `SaveHypergraph`, `LoadHypergraph`) - [Owner TBD]
    -   Task: Implement gRPC handler for `InitializeSimulation`. - [Owner TBD]
    -   Task: Implement gRPC handler for `StepSimulation`. - [Owner TBD]
    -   Task: Implement gRPC handler for `RunSimulation` (streaming). - [Owner TBD]
    -   Task: Implement gRPC handler for `StopSimulation`. - [Owner TBD]
    -   Task: Implement gRPC handler for `GetCurrentState`. - [Owner TBD]
    -   **NEW**: Task: Implement gRPC handler for `SaveHypergraph`. - [Owner TBD]
    -   **NEW**: Task: Implement gRPC handler for `LoadHypergraph`. - [Owner TBD]
-   **F2.2**: Finalize Protocol Buffer Message Definitions (including for `SaveHypergraphRequest/Response`, `LoadHypergraphRequest/Response`) - [Owner TBD]
-   **F2.3**: Full Integration of gRPC service with the Rust simulation engine (expose all F1.x features through MVP RPCs) - [Owner TBD]
    -   Task: Design and implement simulation state management (e.g., single global instance for MVP, potential for per-client/session if time allows and is deemed critical for MVP stability with multiple frontend interactions, though PRD implies single active simulation focus). - [Owner TBD]

#### Post-MVP gRPC Considerations (Examples)
-   Task: Design & Implement `SetRules` RPC for dynamic rule loading. - [Owner TBD, Post-MVP]
-   Task: Design & Implement `GetHypergraphSlice` RPC for fetching partial graph data. - [Owner TBD, Post-MVP]

### Phase 3: Web Frontend Development
-   **F3.2**: UI Controls
    -   Task: Implement UI for Initialize simulation (predefined/simple editor). - [Owner TBD]
    -   Task: Implement UI for Rule definitions input (Post-MVP, if F2.1 `SetRules` is implemented). - [Owner TBD]
    -   Task: Implement UI Buttons: Step, Run, Stop, Reset. - [Owner TBD]
    -   **NEW**: Task: Implement UI Button/Control for "Save Hypergraph". - [Owner TBD]
    -   **NEW**: Task: Implement UI Button/Dialog for "Load Hypergraph" (from file or predefined). - [Owner TBD]
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

-   Task: Unit tests for all data structures and basic operations (F1.1, F1.2) - [Owner TBD]

--- 

## To Do (Sprint 3: Simulation Loop & Event Management - F1.5, F1.6, F1.7)
**Goal:** Implement simulation step management, event tracking, and hypergraph persistence.
**Dependencies:** Sprint 2 completion.

-   Task: Implement step-by-step simulation loop logic (match, select, apply) (F1.5) - [Owner TBD]
-   Task: Implement "continuous" simulation mode (F1.5) - [Owner TBD]
-   Task: Define and log/track simulation "events" (application of a rule) for transmission (F1.6) - [Owner TBD]
-   Task: Implement `serde` serialization for `HypergraphState` to JSON (F1.7) - [Owner TBD]
-   Task: Implement `serde` deserialization for `HypergraphState` from JSON (F1.7) - [Owner TBD]
-   Task: Develop logic to save current hypergraph to a user-specified/default file (F1.7) - [Owner TBD]
-   Task: Develop logic to load a hypergraph from a user-selected file, replacing current state (F1.7) - [Owner TBD]
-   Task: Package 3-5 predefined hypergraph example JSON files as assets and implement loading them (F1.7) - [Owner TBD]
-   Task: Unit tests for simulation loop components and save/load functionality (F1.5, F1.6, F1.7) - [Owner TBD]

--- 

## To Do (Sprint 3 - Example: Hypergraph Persistence & Simulation Loop Refinements - F1.7, F1.5, F1.6)
**Goal:** Implement save/load for hypergraphs and refine simulation step/event logic.
**Dependencies:** Sprint 1 & 2 completion.

-   Task: Implement `serde` serialization for `HypergraphState` to JSON (F1.7) - [Owner TBD]
-   Task: Implement `serde` deserialization for `HypergraphState` from JSON (F1.7) - [Owner TBD]
-   Task: Develop logic to save current hypergraph to a user-specified/default file (F1.7) - [Owner TBD]
-   Task: Develop logic to load a hypergraph from a user-selected file, replacing current state (F1.7) - [Owner TBD]
-   Task: Package 3-5 predefined hypergraph example JSON files as assets and implement loading them (F1.7) - [Owner TBD]
-   Task: Implement the step-by-step simulation loop logic (match, select, apply) (F1.5) - [Owner TBD]
-   Task: Implement "continuous" simulation mode (F1.5) - [Owner TBD]
-   Task: Define and log/track simulation "events" (application of a rule) for transmission (F1.6) - [Owner TBD]
-   Task: Unit tests for save/load functionality and simulation loop components (F1.5, F1.6, F1.7) - [Owner TBD]

--- 

## In Progress
-   *(Move tasks here when started)*

--- 

## In Review
-   *(Move tasks here when PR is created/QA is needed)*

--- 

## Done

**Sprint 2: Basic Pattern Matching & Rewriting Tasks (F1.3, F1.4)**
-   Task: Develop basic sub-hypergraph isomorphism algorithm for pattern matching (F1.3) - [Completed June 11, 2025]
    - Implemented `PatternMatch` struct to represent match results with variable bindings
    - Implemented `find_pattern_matches` function using backtracking search algorithm
    - Added support for matching patterns with both concrete atoms and variables
    - Implemented comprehensive pattern matching that finds all valid matches
    - Added unit tests for various matching scenarios including empty patterns, variable matches, and concrete atom matches
-   Task: Implement variable binding and substitution logic (F1.3) - [Completed June 11, 2025]
    - Enhanced `Binding` struct to support pattern variable binding during matching
    - Implemented proper variable conflict detection and resolution
    - Added logic to bind pattern variables to actual hypergraph atoms
    - Implemented variable substitution for rule application
    - Added comprehensive unit tests for binding consistency and merging
-   Task: Implement the hypergraph rewriting process (remove old, add new) (F1.4) - [Completed June 11, 2025]
    - Implemented `apply_rule` function for rewriting hypergraphs based on pattern matches
    - Created `RewriteResult` struct to track rewrite outcomes and changes
    - Added logic to remove matched pattern elements and add replacement elements
    - Implemented automatic creation of new atoms for unbound variables in replacements
    - Added `apply_first_available_rule` convenience function
    - Added comprehensive unit tests including end-to-end integration tests
-   Task: Unit tests for matching and rewriting simple cases (F1.3, F1.4) - [Completed June 11, 2025]
    - Implemented comprehensive test coverage with 46 passing tests
    - Added end-to-end integration test demonstrating complete workflow
    - Verified classic edge splitting rule: {{x,y}} -> {{x,z},{z,y}}
    - All tests pass successfully demonstrating correct implementation

**Sprint 1: Core Hypergraph & Rule Representation Tasks (F1.1, F1.2)**
-   Task: Define `Rule` struct (pattern hypergraph, replacement hypergraph) (F1.2) - [Completed June 10, 2025]
    - Implemented `RuleId` type with appropriate methods
    - Implemented `Rule` struct with pattern and replacement fields
    - Added methods for creating, querying, and manipulating rules
    - Added implementation for the classic {{x,y}} -> {{x,z},{z,y}} edge splitting rule
    - Implemented `RuleSet` for managing collections of rules
    - Added comprehensive unit tests for all functionality
-   Task: Implement storage for a set of hardcoded rules (e.g., `{{x,y}} -> {{x,z},{z,y}}`) (F1.2) - [Completed June 10, 2025]
    - Implemented `RuleSet` that can store and manage multiple rules
    - Added methods for adding, querying, and iterating over rules
    - Implemented `create_basic_ruleset()` that creates a set with the basic edge splitting rule
    - Added unit tests for rule storage functionality
-   Task: Implement core `Hypergraph` struct with methods for add/remove, basic queries (F1.1) - [Completed June 10, 2025]
    - Implemented `Hypergraph` struct with core data storage using HashMaps for atoms and relations
    - Added indexed lookup from atoms to relations for efficient querying
    - Implemented methods for adding/removing atoms and relations, with proper cross-reference management
    - Added query methods like find_relations_with_atom, atom_count, relation_count, etc.
    - Added ID generation for atoms and relations
    - Added comprehensive unit tests for all functionality
-   Task: Design and implement `Relation` (hyperedge) representation (e.g., `Vec<AtomId>`) (F1.1) - [Completed June 9, 2025]
    - Implemented `RelationId` as a newtype wrapper around `u64` with serialization support
    - Implemented `Relation` struct with ID, ordered collection of AtomIds, and optional metadata
    - Added methods for creating and querying relations (arity, contains_atom, etc.)
    - Added comprehensive unit tests for all functionality
-   Task: Define and implement `AtomId` type and `Atom` struct/metadata (F1.1) - [Completed June 9, 2025]
    - Implemented `AtomId` as a newtype wrapper around `u64` with serialization support
    - Implemented `Atom` struct with ID and optional metadata
    - Added comprehensive unit tests for all functionality

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