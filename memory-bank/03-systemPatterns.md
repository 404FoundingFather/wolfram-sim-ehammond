# System Patterns

**Last Updated:** May 13, 2025

This document describes the architecture, design patterns, and code organization principles used in the Wolfram Physics Simulator MVP.

## Architecture Overview

The Wolfram Physics Simulator MVP employs a client-server architecture:
-   **Backend:** A Rust-based simulation engine responsible for all hypergraph calculations, rule applications, and state management.
-   **Frontend:** A TypeScript Single-Page Application (SPA) providing user controls for the simulation and visualizing the hypergraph evolution.
-   **Communication:** gRPC (with gRPC-Web for browser compatibility) is used for structured and efficient communication between the frontend and backend.

### Core Components
*   **Rust Simulation Engine:** Manages hypergraph data, applies rewrite rules, and tracks simulation state.
*   **gRPC Service (Backend):** Exposes simulation engine functionalities to the frontend via defined RPC methods.
*   **Web Frontend (SPA):** Renders the UI, sends user commands to the backend, and visualizes received hypergraph states.

### Component Interactions
1.  The Frontend UI sends user requests (e.g., initialize, step, run, stop) to the Backend gRPC Service.
2.  The gRPC Service invokes the appropriate functions within the Rust Simulation Engine.
3.  The Simulation Engine computes the new hypergraph state or performs the requested action.
4.  The gRPC Service sends the updated hypergraph state (or confirmation) back to the Frontend.
5.  The Frontend updates the visualization and status displays. For continuous simulation (`RunSimulation`), the backend streams state updates to the frontend.

## Design Patterns

### Backend (Rust Simulation Engine)
*   **Hypergraph Representation:**
    *   **Purpose:** To efficiently store and manipulate the hypergraph, representing atoms and relations (hyperedges).
    *   **Implementation:** Custom Rust structs for `AtomId`, `Atom` metadata, `Relation` (e.g., `Vec<AtomId>`), and the main `Hypergraph` container. Data structures will be chosen for efficient querying and modification (e.g., `HashSet`, `Vec`, `HashMap`).
    *   **Key Classes/Components:** Defined within a core library (e.g., `wolfram_engine_core`) in modules like:
        *   `hypergraph::atom.rs`, `hypergraph::relation.rs`, `hypergraph::hypergraph.rs`
*   **Rule Engine:**
    *   **Purpose:** To define, store, match, and apply rewrite rules.
    *   **Implementation:** Structs for `Rule` (pattern and replacement hypergraphs), variable representation. Pattern matching will involve sub-hypergraph isomorphism algorithms. Rewriting logic will modify the main hypergraph based on matched rules.
    *   **Key Classes/Components:** Modules within `wolfram_engine_core`:
        *   `rules::rule.rs`, `rules::pattern.rs`
        *   `matching::isomorphism.rs` (or similar for pattern matching logic)
        *   `evolution::rewriter.rs` (for applying rewrites)
*   **Stateful Simulation Loop & Event Management:**
    *   **Purpose:** To manage the evolution of the hypergraph over discrete steps or continuous updates, including event selection.
    *   **Implementation:** The engine maintains a "current state" of the hypergraph. Rule application modifies this state. Event selection logic (e.g., deterministic for MVP) chooses which match to apply.
    *   **Key Classes/Components:** Modules within `wolfram_engine_core`:
        *   `simulation::mod.rs` or `simulation::manager.rs` (main simulation loop)
        *   `evolution::scheduler.rs` (for event selection if complex)
*   **State Serialization:**
    *   **Purpose:** To save and load simulation states.
    *   **Implementation:** Using `serde` for serialization to formats like JSON (for MVP) or binary formats.
    *   **Key Classes/Components:** Module within `wolfram_engine_core`:
        *   `serialization::mod.rs`
*   **In-Memory State Management (MVP):**
    *   **Purpose:** To hold the current simulation state.
    *   **Implementation:** The entire hypergraph is stored in RAM within the Rust process. No database is used for MVP.
    *   **Key Classes/Components:** The main `Hypergraph` struct instance.

### Frontend (TypeScript SPA)
*   **Component-Based UI (React, Vue, or Svelte pattern):**
    *   **Purpose:** To create a modular and maintainable user interface.
    *   **Implementation:** The UI will be built as a tree of reusable components (e.g., controls panel, visualization canvas, status display).
    *   **Key Classes/Components:** (To be defined, e.g., `SimulationControls.tsx`, `HypergraphVisualizer.tsx`).
*   **Client-Side State Management (e.g., Zustand, Pinia, Svelte Stores, React Context/Redux Toolkit):**
    *   **Purpose:** To manage incoming simulation states from the backend and reflect them in the UI.
    *   **Implementation:** A dedicated store or state management solution will hold the current hypergraph data, step number, etc., and update UI components reactively.
    *   **Key Classes/Components:** (To be defined, e.g., `simulationStore.ts`).
*   **Declarative Rendering for Visualization:**
    *   **Purpose:** To efficiently update the hypergraph display.
    *   **Implementation:** The chosen visualization library (or custom SVG/Canvas code) will declaratively render the hypergraph based on the current state data. Changes in state trigger re-renders.
    *   **Key Classes/Components:** `HypergraphVisualizer.tsx` and the chosen graph library.

### Communication (gRPC / gRPC-Web)
*   **Service-Oriented Interface:**
    *   **Purpose:** To define a clear contract between frontend and backend.
    *   **Implementation:** A `.proto` file defines the `WolframPhysicsSimulatorService` with specific RPC methods for each action.
    *   **Key Classes/Components:** `wolfram_physics.proto`, generated client stubs, backend service implementation.
*   **Request-Response Pattern:**
    *   **Purpose:** For operations that have a single request and a single response.
    *   **Implementation:** Used for `InitializeSimulation`, `StepSimulation`, `StopSimulation`, `GetCurrentState`.
*   **Server-Streaming RPC:**
    *   **Purpose:** For continuous updates from the server to the client.
    *   **Implementation:** Used for `RunSimulation`, where the backend continuously streams `SimulationStateUpdate` messages.

## Code Organization

### Tentative Directory Structure (Conceptual)
```
[Project Root: /Users/ehammond/Documents/src/wolfram-sim]
├── backend/
│   ├── wolfram_engine_core/  // Core simulation library crate
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── hypergraph/ (atom.rs, relation.rs, hypergraph.rs)
│   │   │   ├── rules/      (rule.rs, pattern.rs)
│   │   │   ├── matching/   (isomorphism.rs)
│   │   │   ├── evolution/  (rewriter.rs, scheduler.rs)
│   │   │   ├── simulation/ (mod.rs or manager.rs)
│   │   │   └── serialization/ (mod.rs)
│   │   └── Cargo.toml
│   ├── grpc_server/          // gRPC server binary crate
│   │   ├── src/
│   │   │   ├── main.rs       // Entry point, gRPC server setup
│   │   │   └── server.rs     // gRPC service implementation
│   │   └── Cargo.toml
│   └── proto/                // Copied/linked .proto for build
├── frontend/
│   ├── src/
│   │   ├── App.tsx         // Main application component
│   │   ├── components/
│   │   │   ├── SimulationControls.tsx
│   │   │   └── HypergraphVisualizer.tsx
│   │   ├── apiClient.ts    // gRPC-Web client setup
│   │   ├── store/          // State management (e.g., simulationStore.ts)
│   │   └── generated/      // gRPC-Web generated client code from .proto
│   ├── package.json
│   └── public/
├── proto/                  // Master .proto definition files
│   └── wolfram_physics.proto
├── docs/
│   └── wolfram-sim-prd.md
└── memory-bank/
    └── ... (all memory bank files)
```

### Module Responsibilities
*   **`backend/wolfram_engine_core`**: Contains all core Rust simulation engine logic (data structures, rules, matching, evolution, simulation loop, serialization).
*   **`backend/grpc_server`**: Implements the gRPC service, acting as a bridge to the `wolfram_engine_core` library.
*   **`frontend/src`**: Contains all TypeScript SPA frontend code, including UI components, API client, and state management.
*   **`proto` (top-level)**: Canonical location for Protocol Buffer definitions.

## Data Flow

### [Process Name 1]
1. [Step 1]
2. [Step 2]
3. [Step 3]

### [Process Name 2]
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Error Handling Strategy
*   **Backend:** Rust's `Result` type will be used extensively. Errors from the simulation engine will be translated into appropriate gRPC error statuses.
*   **Frontend:** gRPC client calls will handle potential errors (network issues, backend errors). User-facing error messages will be displayed in the "Status Message Area".
*   **Logging:** Basic logging on the backend (e.g., using `log` and `env_logger` crates) and browser console logs on the frontend.

## Security Considerations
* [Authentication approach]
* [Authorization model]
* [Data protection strategies]
* [Other security measures]

## Scalability Considerations
* [Potential bottlenecks]
* [Scaling strategies]
* [Performance optimizations]

## Cross-Cutting Concerns
* [Logging approach]
* [Configuration management]
* [Internationalization]
* [Accessibility]

## Testing Strategy
*   **Unit Tests (Rust):** `cargo test` for `wolfram_engine_core` modules.
*   **Integration Tests (Rust/gRPC):** Testing `grpc_server` endpoints and their interaction with `wolfram_engine_core`.
*   **E2E Tests (Frontend):** Using frameworks like Cypress or Playwright (Post-MVP consideration).
* [Test organization]
* [Coverage goals]