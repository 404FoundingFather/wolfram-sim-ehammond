# System Patterns

**Last Updated:** May 14, 2025

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
1.  The Frontend UI sends user requests (e.g., initialize, step, run, stop, save hypergraph, load hypergraph) to the Backend gRPC Service.
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
    *   **Purpose:** Primarily for **F1.7 Hypergraph Persistence**: to save the current `HypergraphState` to a file (e.g., JSON) and load a `HypergraphState` from a file. This allows users to persist and resume simulations or work with predefined examples. Also supports **F1.6 Event Management & State Transmission** by ensuring the hypergraph state can be structured for gRPC messages, though the direct serialization for gRPC is handled by Protobuf mechanisms.
    *   **Implementation:** Using `serde` for serialization/deserialization to/from file formats like JSON (for MVP).
    *   **Key Classes/Components:** Module within `wolfram_engine_core` (e.g., `serialization::mod.rs`) will contain logic for file I/O and `serde` integration for F1.7.
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
    *   **Implementation:** A `.proto` file defines the `WolframPhysicsSimulatorService` with specific RPC methods for each action, including `InitializeSimulation`, `StepSimulation`, `RunSimulation`, `StopSimulation`, `GetCurrentState`, `SaveHypergraph`, and `LoadHypergraph`.
    *   **Key Classes/Components:** `wolfram_physics.proto`, generated client stubs, backend service implementation.
*   **Request-Response Pattern:**
    *   **Purpose:** For operations that have a single request and a single response.
    *   **Implementation:** Used for `InitializeSimulation`, `StepSimulation`, `StopSimulation`, `GetCurrentState`, `SaveHypergraph`, `LoadHypergraph`.
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
*   **`backend/wolfram_engine_core`**: Contains all core Rust simulation engine logic (data structures, rules, matching, evolution, simulation loop).
    *   The `serialization` submodule specifically handles file-based saving and loading of `HypergraphState` objects using `serde` (for F1.7).
*   **`backend/grpc_server`**: Implements the gRPC service, acting as a bridge to the `wolfram_engine_core` library.
*   **`frontend/src`**: Contains all TypeScript SPA frontend code, including UI components, API client, and state management.
*   **`proto` (top-level)**: Canonical location for Protocol Buffer definitions.

## Data Flow

### Simulation Step Execution
1.  **Frontend:** User clicks "Step" button.
2.  **Frontend:** `SimulationControls.tsx` calls a function in `apiClient.ts` (which uses the gRPC-Web client).
3.  **Frontend:** `apiClient.ts` sends a `StepRequest` (e.g., for 1 step) to the Backend gRPC `StepSimulation` RPC.
4.  **Backend (grpc_server):** The `StepSimulation` RPC handler in `server.rs` receives the request.
5.  **Backend (grpc_server):** The handler calls the appropriate method in `wolfram_engine_core` (e.g., `simulation_manager.step(1)`).
6.  **Backend (wolfram_engine_core):**
    a.  The simulation manager retrieves the current `Hypergraph` state.
    b.  The `matching` module finds applicable rule matches.
    c.  The `evolution/scheduler` (or simple logic in manager) selects one match to apply.
    d.  The `evolution/rewriter` applies the rule, modifying the `Hypergraph` (creating/deleting atoms and relations).
    e.  A `SimulationEvent` is generated.
    f.  The step number is incremented.
7.  **Backend (grpc_server):** The `wolfram_engine_core` returns the new `HypergraphState` and `SimulationEvent` to the RPC handler.
8.  **Backend (grpc_server):** The RPC handler constructs a `StepResponse` and sends it back to the Frontend.
9.  **Frontend:** `apiClient.ts` receives the `StepResponse`.
10. **Frontend:** The `simulationStore.ts` is updated with the new hypergraph state, events, and step number.
11. **Frontend:** UI components (e.g., `HypergraphVisualizer.tsx`, status displays) react to store changes and re-render.

### Continuous Simulation (`RunSimulation`)
1.  **Frontend:** User clicks "Run" button.
2.  **Frontend:** `apiClient.ts` initiates a server-streaming `RunSimulation` RPC call.
3.  **Backend (grpc_server):** The `RunSimulation` RPC handler starts a loop in the `wolfram_engine_core`.
4.  **Backend (wolfram_engine_core):** In a loop (e.g., driven by a timer or as fast as possible, respecting an update interval if provided):
    a.  Performs a simulation step (similar to 6a-6f above).
    b.  Constructs a `SimulationStateUpdate` message.
5.  **Backend (grpc_server):** Streams the `SimulationStateUpdate` message to the frontend. This repeats until "Stop" is requested or the stream is otherwise terminated.
6.  **Frontend:** `apiClient.ts` receives each `SimulationStateUpdate` message from the stream.
7.  **Frontend:** Updates `simulationStore.ts` and UI components reactively for each update.

### Save Hypergraph Execution (NEW)
1.  **Frontend:** User clicks "Save Hypergraph" button.
2.  **Frontend:** `SimulationControls.tsx` (or similar) may prompt for a filename (or use a default) and then calls a function in `apiClient.ts`.
3.  **Frontend:** `apiClient.ts` sends a `SaveHypergraphRequest` (possibly with the suggested filename) to the Backend gRPC `SaveHypergraph` RPC.
4.  **Backend (grpc_server):** The `SaveHypergraph` RPC handler in `server.rs` receives the request.
5.  **Backend (grpc_server):** The handler calls the appropriate method in `wolfram_engine_core` (e.g., `simulation_manager.save_current_hypergraph(filename_suggestion)`).
6.  **Backend (wolfram_engine_core):**
    a.  The simulation manager retrieves the current `HypergraphState`.
    b.  The `serialization` module serializes this state to a JSON string using `serde`.
    c.  The simulation manager (or serialization module) writes this string to a file, determining the final filename (e.g., respecting user suggestion or creating a new one).
7.  **Backend (grpc_server):** The `wolfram_engine_core` returns confirmation (e.g., actual path of the saved file) to the RPC handler.
8.  **Backend (grpc_server):** The RPC handler constructs a `SaveHypergraphResponse` and sends it back to the Frontend.
9.  **Frontend:** `apiClient.ts` receives the `SaveHypergraphResponse`.
10. **Frontend:** Displays a confirmation message to the user (e.g., "Hypergraph saved to my_simulation.json").

### Load Hypergraph Execution (NEW)
1.  **Frontend:** User clicks "Load Hypergraph" button and selects either a predefined example or a local file via a file input dialog.
2.  **Frontend:** `SimulationControls.tsx` (or similar) calls a function in `apiClient.ts`, providing either an identifier for a predefined example or the content/path of the user-selected file.
3.  **Frontend:** `apiClient.ts` sends a `LoadHypergraphRequest` to the Backend gRPC `LoadHypergraph` RPC. The request will contain the hypergraph data (if from a local file read by the client) or the identifier for a predefined example. (Alternatively, for local files, the frontend might just send the filename, and the backend reads it, depending on security/design choices). For MVP, let's assume the frontend can read the file content and send it, or send an identifier for a predefined one.
4.  **Backend (grpc_server):** The `LoadHypergraph` RPC handler in `server.rs` receives the request.
5.  **Backend (grpc_server):** The handler calls the appropriate method in `wolfram_engine_core` (e.g., `simulation_manager.load_hypergraph_from_data(hypergraph_json_string)` or `simulation_manager.load_predefined_hypergraph(example_id)`).
6.  **Backend (wolfram_engine_core):**
    a.  If loading from data: The `serialization` module deserializes the `HypergraphState` from the provided JSON string using `serde`.
    b.  If loading a predefined example: The engine retrieves the example hypergraph data (e.g., from an embedded asset or a known file path) and deserializes it.
    c.  The simulation manager validates the loaded `HypergraphState` (basic structural checks).
    d.  The current simulation's `HypergraphState` is replaced with the newly loaded one. The simulation step number might be reset or set from the loaded data if present.
7.  **Backend (grpc_server):** The `wolfram_engine_core` returns the new (loaded) `HypergraphState` to the RPC handler.
8.  **Backend (grpc_server):** The RPC handler constructs a `LoadHypergraphResponse` (containing the `HypergraphState`) and sends it back to the Frontend.
9.  **Frontend:** `apiClient.ts` receives the `LoadHypergraphResponse`.
10. **Frontend:** The `simulationStore.ts` is updated with the new hypergraph state, step number, etc.
11. **Frontend:** UI components (e.g., `HypergraphVisualizer.tsx`, status displays) react to store changes and re-render, displaying the loaded hypergraph.

## Error Handling Strategy
*   **Backend:** Rust's `Result` type will be used extensively. Errors from the simulation engine will be translated into appropriate gRPC error statuses.
*   **Frontend:** gRPC client calls will handle potential errors (network issues, backend errors). User-facing error messages will be displayed in the "Status Message Area".
*   **Logging:** Basic logging on the backend (e.g., using `log` and `env_logger` crates) and browser console logs on the frontend.

## Security Considerations
*   **Authentication/Authorization:** N/A for MVP. The application is designed to be run locally or in a trusted environment. No user accounts or specific access controls are implemented.
*   **Data Protection:** Simulation data is transient and managed in memory by the backend for MVP for active simulations. Saved hypergraph files (e.g., JSON) are stored on the file system as per user actions. File system permissions will govern access to these saved files. The application will need appropriate rights to read/write files in user-designated or application-specific locations for predefined examples. Communication via gRPC is structured but not encrypted by default (gRPC-Web typically runs over HTTPS, providing transport layer security).
*   **Input Validation:** Basic validation of gRPC request parameters (e.g., step counts) will be performed by the backend. For loaded hypergraph files, the backend should perform validation (e.g., checking for malformed JSON, consistency of the data structure) to prevent errors or crashes and provide appropriate error feedback to the user. The primary concern for MVP is stability rather than defending against malicious inputs.
*   **Other Security Measures:** For MVP, focus is on functional correctness. Standard secure coding practices will be followed (e.g., avoiding obvious panics in Rust, proper error handling).

## Scalability Considerations
*   **Current Design:** The MVP is designed for small-scale simulations (hundreds to a few thousand atoms/relations) running on a single backend instance with an in-memory hypergraph.
*   **Potential Bottlenecks (Post-MVP):**
    *   Sub-hypergraph isomorphism (pattern matching) can be very slow for large graphs or complex rules.
    *   Memory usage for very large hypergraphs.
    *   Rendering performance in the frontend for very large graphs.
    *   Single-threaded rule application if not parallelized.
*   **Scaling Strategies (Post-MVP):**
    *   Optimized pattern matching algorithms.
    *   Parallel rule application (exploiting non-conflicting updates).
    *   Distributed simulation engine (complex).
    *   More efficient data structures or database backend for graph storage.
    *   Frontend visualization optimizations (e.g., WebGL, graph virtualization).
*   **Performance Optimizations (MVP):** Focus on clean Rust code. For very small graphs as targeted by MVP, even naive algorithms should be acceptable.

## Cross-Cutting Concerns
*   **Logging:**
    *   **Backend:** `log` crate with `env_logger` (or similar like `tracing`) for different log levels (DEBUG, INFO, WARN, ERROR). Configurable via environment variables.
    *   **Frontend:** Standard `console.log`, `console.warn`, `console.error`.
*   **Configuration Management:**
    *   **Backend:** Primarily via `Cargo.toml` for dependencies. Potential for a simple config file (e.g., TOML) for server port or default simulation parameters if needed, but mostly hardcoded for MVP.
    *   **Frontend:** Primarily via `package.json` and `vite.config.ts`. API endpoint can be configurable.
*   **Internationalization (i18n):** Out of scope for MVP.
*   **Accessibility (a11y):** Basic accessibility practices for web UI (e.g., semantic HTML) will be considered, but comprehensive a11y auditing is out of scope for MVP.

## Testing Strategy
*   **Unit Tests (Rust):** `cargo test` for `wolfram_engine_core` modules.
*   **Integration Tests (Rust/gRPC):** Testing `grpc_server` endpoints and their interaction with `wolfram_engine_core`.
*   **E2E Tests (Frontend):** Using frameworks like Cypress or Playwright (Post-MVP consideration).
* [Test organization]
* [Coverage goals]