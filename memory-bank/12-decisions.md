# 12. Key Decisions from PRD

**Last Updated:** May 14, 2025

This document outlines key architectural and scope decisions made for the Wolfram Physics Simulator MVP, as derived from the PRD.

## 1. Core Technologies

-   **Backend Engine**: Rust (G1, D1)
-   **Frontend**: Web-based TypeScript SPA (G2, D2)
-   **Communication**: gRPC with gRPC-Web (G3, D1, D3)

## 2. Scope Limitations for MVP

### Hypergraph Implementation (F1.1)
-   Initially focus on binary and ternary relations.
-   Atoms are simple unique identifiers.

### Rewrite Rules (F1.2)
-   One or a very small set (2-3) of hardcoded/predefined rules.
-   No user-defined rules in MVP.

### Pattern Matching (F1.3)
-   Basic sub-hypergraph isomorphism, simple exhaustive search is acceptable.
-   Performance for large graphs is a non-goal for MVP.

### Simulation Loop (F1.5)
-   One update (rule application) per "step" is acceptable.

### Visualization (F3.3)
-   2D canvas or SVG area.
-   Binary relations as lines; ternary+ relations with a central conceptual point or simplified representation.
-   Simple force-directed or basic fixed layout.
-   Mobile responsiveness is a non-goal (desktop browser primary target) (Section 5).

## 3. API Design (F2.1, F2.2)

-   **Service Name**: `WolframPhysicsSimulatorService`
-   **Key RPCs**: `InitializeSimulation`, `StepSimulation`, `RunSimulation` (streaming), `StopSimulation`, `GetCurrentState`.
-   **Data Structures**: Defined using Protocol Buffers, including `Atom`, `Relation`, `HypergraphState`, `SimulationEvent`, `SimulationStateUpdate`.
-   Initial hypergraph and rules will be hardcoded or loaded from simple embedded structures in the backend (D1).

## 4. Frontend Framework Choice (D2)

-   A mainstream TypeScript SPA framework will be chosen (React, Vue, Svelte mentioned as examples).
-   A 2D graph visualization library will be used (Vis.js, Sigma.js, react-force-graph mentioned, or custom SVG/Canvas).
-   Appropriate state management solution for the chosen framework.

## 5. Non-Goals for MVP (Section 5)

-   User-defined graphical rule editor.
-   Saving/loading arbitrary simulation states or rules.
-   Advanced visualization (3D, causal graphs, multiway systems).
-   High-performance pattern matching for very large graphs.
-   Distributed simulation.
-   User authentication.
-   Detailed simulation metrics analysis beyond basic counts.
-   Undo/redo functionality.

## 6. Error Handling (D4)

-   Basic error handling and user feedback are required (e.g., connection loss, initialization failure).

## 7. Success Metrics Focus (Section 7)

-   Demonstrating core functionality: initialization, step-through, continuous run with observable changes, and reliable communication.
-   Achieving a foundational, understandable codebase.
-   Targeting 1-2 updates per second for small graphs in continuous run (S3).

## 8. Key Implementation Decisions (from Development Plan `06-developmentPlan.md`)

These decisions elaborate on the "how" for certain MVP features, as detailed in the refined development plan.

*   **State Serialization & Persistence (F1.6):**
    *   **Decision:** For MVP, simulation state persistence will be achieved by serializing the `Hypergraph` state to a file.
    *   **Mechanism:** Use the `serde` library in Rust.
    *   **Format (MVP):** JSON, chosen for human readability and ease of debugging during early development.
    *   **Rationale:** Meets MVP need for saving/loading without a full database; JSON is simple for initial phase.

*   **Pattern Matching Algorithm (F1.3):**
    *   **Decision:** Implement a basic, potentially backtracking, search algorithm for sub-hypergraph isomorphism.
    *   **Rationale:** Sufficient for small hypergraphs and patterns targeted in MVP; defers complexity of advanced isomorphism algorithms (known NP-hard problem).

*   **Event Selection Strategy (F1.5):**
    *   **Decision:** Employ a simple, deterministic event selection strategy if multiple rule matches are found (e.g., first applicable rule found, first match instance of that rule).
    *   **Rationale:** Provides predictable behavior for MVP; exploration of causal invariance and more complex selection is post-MVP.

*   **Atomicity of Rewrite Operations (F1.4):**
    *   **Decision:** Rewrites will be applied sequentially, one match at a time.
    *   **Rationale:** Simplifies state management for MVP; simultaneous application of non-overlapping matches is a future consideration.

*   **Rust Backend Code Structure:**
    *   **Decision:** Organize the Rust backend into a core library crate (`wolfram_engine_core`) and a separate binary crate (`grpc_server`).
    *   **`wolfram_engine_core`:** Contains all domain logic: hypergraph data structures, rule definitions, pattern matching, rewriting engine, simulation loop, and state serialization.
    *   **`grpc_server`:** Contains the gRPC service implementation (using Tonic), acting as an interface to the `wolfram_engine_core` library.
    *   **Rationale:** Promotes modularity, separation of concerns (core logic vs. transport/API layer), and better testability.

*   **Initial Rule Storage (F1.2):**
    *   **Decision:** Rewrite rules will be hardcoded directly in Rust for the MVP.
    *   **Rationale:** Simplifies initial development; dynamic rule parsing/definition is a post-MVP feature.