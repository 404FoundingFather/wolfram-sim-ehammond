# System Patterns

**Last Updated:** June 11, 2025 (Real gRPC Client Implementation Complete)

This document describes the architecture, design patterns, and code organization principles used in the Wolfram Physics Simulator MVP.

## Architecture Overview

The Wolfram Physics Simulator MVP employs a client-server architecture:
-   **Backend:** A Rust-based simulation engine responsible for all hypergraph calculations, rule applications, and state management.
-   **Frontend:** A TypeScript Single-Page Application (SPA) providing user controls for the simulation and visualizing the hypergraph evolution.
-   **Communication:** gRPC (with gRPC-Web for browser compatibility) is used for structured and efficient communication between the frontend and backend.

### Core Components
*   **Rust Simulation Engine:** Manages hypergraph data, applies rewrite rules, and tracks simulation state.
*   **gRPC Service (Backend):** ✅ IMPLEMENTED - Exposes simulation engine functionalities to the frontend via defined RPC methods.
*   **Web Frontend (SPA):** ✅ IMPLEMENTED - Renders the UI, sends user commands to the backend, and visualizes received hypergraph states.

### Component Interactions
1.  The Frontend UI sends user requests (e.g., initialize, step, run, stop, save hypergraph, load hypergraph) to the Backend gRPC Service.
2.  The gRPC Service invokes the appropriate functions within the Rust Simulation Engine.
3.  The Simulation Engine computes the new hypergraph state or performs the requested action.
4.  The gRPC Service sends the updated hypergraph state (or confirmation) back to the Frontend.
5.  The Frontend updates the visualization and status displays. For continuous simulation (`RunSimulation`), the backend streams state updates to the frontend.

## Design Patterns

### Backend (Rust Simulation Engine)
*   **Hypergraph Representation:** ✅ IMPLEMENTED
    *   **Purpose:** To efficiently store and manipulate the hypergraph, representing atoms and relations (hyperedges).
    *   **Implementation:** Custom Rust structs for `AtomId`, `Atom` metadata, `Relation` (as a `Vec<AtomId>`), and the main `Hypergraph` container. Efficient data structures are used for storage and querying, including `HashMap` for atoms and relations and indexed lookups for atom-to-relation mappings.
    *   **Key Classes/Components:** Implemented within the `wolfram-sim-rust` codebase:
        *   `hypergraph/atom.rs`: `AtomId` and `Atom` implementations
        *   `hypergraph/relation.rs`: `RelationId` and `Relation` implementations
        *   `hypergraph/hypergraph.rs`: Main `Hypergraph` container with methods for adding/removing atoms and relations, querying, and ID generation
        *   `hypergraph/mod.rs`: Module exports and structure
*   **Rule Engine:** ✅ IMPLEMENTED
    *   **Purpose:** To define, store, match, and apply rewrite rules.
    *   **Implementation:** Fully implemented `Rule` struct (pattern and replacement hypergraphs), `Variable` for pattern matching, and `Binding` for variable substitution. The `RuleSet` allows managing collections of rules, including a default `create_basic_ruleset()` method with the classic edge-splitting rule (`{{x,y}} -> {{x,z},{z,y}}`). Complete pattern matching using sub-hypergraph isomorphism and rewriting logic.
    *   **Key Classes/Components:** Implemented within `wolfram-sim-rust`:
        *   `rules/rule.rs`: `RuleId`, `Rule`, and `RuleSet` implementations
        *   `rules/pattern.rs`: `Pattern`, `PatternRelation`, `PatternElement`, `Variable`, and `Binding` implementations
        *   `rules/mod.rs`: Module exports and structure
        *   `matching/isomorphism.rs`: Pattern matching logic with `PatternMatch` and `find_pattern_matches` ✅ IMPLEMENTED
        *   `evolution/rewriter.rs`: Apply rewrites with `RewriteResult` and `apply_rule` ✅ IMPLEMENTED
*   **Stateful Simulation Loop & Event Management:** ✅ IMPLEMENTED
    *   **Purpose:** To manage the evolution of the hypergraph over discrete steps or continuous updates, including event selection.
    *   **Implementation:** Fully implemented `SimulationManager` with step-by-step and continuous execution modes. The engine maintains current hypergraph state, applies rule selection strategies (FirstRuleFirstMatch, MostMatches), and tracks simulation events. Supports configurable continuous simulation with stopping conditions.
    *   **Key Classes/Components:** Implemented within `wolfram-sim-rust`:
        *   `simulation/manager.rs`: Main `SimulationManager` with step(), step_multiple(), and run_continuous() methods
        *   `simulation/event.rs`: `SimulationEvent` and `HypergraphState` for event tracking and state transmission
        *   `simulation/mod.rs`: Module exports and structure
*   **State Serialization & Persistence:** ✅ IMPLEMENTED
    *   **Purpose:** Complete implementation of **F1.7 Hypergraph Persistence**: save/load `HypergraphState` to/from JSON files, with predefined examples and validation. Supports **F1.6 Event Management & State Transmission** with structured state for gRPC messages.
    *   **Implementation:** Full `PersistenceManager` with robust save/load functionality, error handling, validation, and 5 predefined examples. Uses `serde` for JSON serialization with pretty printing and comprehensive error handling via `thiserror`.
    *   **Key Classes/Components:** Implemented within `wolfram-sim-rust`:
        *   `serialization/persistence.rs`: `PersistenceManager` with save/load functionality and validation
        *   `serialization/examples.rs`: `PredefinedExamples` with 5 built-in hypergraph examples
        *   `serialization/mod.rs`: Module exports and structure
*   **In-Memory State Management (MVP):**
    *   **Purpose:** To hold the current simulation state.
    *   **Implementation:** The entire hypergraph is stored in RAM within the Rust process. No database is used for MVP.
    *   **Key Classes/Components:** The main `Hypergraph` struct instance.

### Frontend (TypeScript SPA) - ✅ IMPLEMENTED
*   **Component-Based UI (React):** ✅ IMPLEMENTED
    *   **Purpose:** To create a modular and maintainable user interface.
    *   **Implementation:** The UI is built as a tree of reusable React components following modern React patterns with TypeScript.
    *   **Key Classes/Components:** Implemented:
        *   `SimulationControls.tsx`: Complete simulation control panel with initialization, stepping, running, and file management
        *   `HypergraphVisualizer.tsx`: Interactive 2D visualization using react-force-graph-2d
        *   `StateDisplay.tsx`: Comprehensive status dashboard with event history and system information
        *   `App.tsx`: Main application layout following UI design specifications
*   **Client-Side State Management (Zustand):** ✅ IMPLEMENTED
    *   **Purpose:** To manage incoming simulation states from the backend and reflect them in the UI.
    *   **Implementation:** Zustand store manages all simulation state, UI state, and API interactions with reactive updates.
    *   **Key Classes/Components:** Implemented:
        *   `store/simulationStore.ts`: Complete state management with all simulation actions and state handling
        *   Clean separation between API client, state management, and UI components
*   **Declarative Rendering for Visualization:** ✅ IMPLEMENTED
    *   **Purpose:** To efficiently update the hypergraph display.
    *   **Implementation:** react-force-graph-2d declaratively renders the hypergraph based on current state data with smooth transitions.
    *   **Key Classes/Components:**
        *   `HypergraphVisualizer.tsx`: Custom rendering for atoms (blue circles), binary relations (red lines), and hyperedges (orange central nodes)
        *   Interactive features: zoom/pan, node dragging, hover tooltips, auto-fit functionality
*   **gRPC-Web Client Integration:** ✅ IMPLEMENTED
    *   **Purpose:** To provide type-safe communication with the backend gRPC service.
    *   **Implementation:** Complete TypeScript API client with proper error handling, type conversion, and streaming support.
    *   **Key Classes/Components:** Implemented:
        *   `services/apiClient.ts`: Full gRPC-Web client wrapper with all 7 operations supported
        *   Type-safe interfaces and conversion functions between protobuf and frontend types
        *   Comprehensive error handling and connection management

### Communication (gRPC / gRPC-Web)
*   **Service-Oriented Interface:** ✅ IMPLEMENTED
    *   **Purpose:** To define a clear contract between frontend and backend.
    *   **Implementation:** A `.proto` file defines the `WolframPhysicsSimulatorService` with specific RPC methods for each action, including `InitializeSimulation`, `StepSimulation`, `RunSimulation`, `StopSimulation`, `GetCurrentState`, `SaveHypergraph`, and `LoadHypergraph`.
    *   **Key Classes/Components:** `wolfram_physics.proto`, generated client stubs, backend service implementation in `main.rs`.
*   **Request-Response Pattern:** ✅ IMPLEMENTED
    *   **Purpose:** For operations that have a single request and a single response.
    *   **Implementation:** Used for `InitializeSimulation`, `StepSimulation`, `StopSimulation`, `GetCurrentState`, `SaveHypergraph`, `LoadHypergraph`.
*   **Server-Streaming RPC:** ✅ IMPLEMENTED
    *   **Purpose:** For continuous updates from the server to the client.
    *   **Implementation:** Used for `RunSimulation`, where the backend continuously streams `SimulationStateUpdate` messages.

## Code Organization

### Current Directory Structure ✅ IMPLEMENTED
```
[Project Root: /Users/ehammond/Documents/src/wolfram-sim-ehammond]
├── wolfram-sim-rust/       // Rust backend codebase ✅ IMPLEMENTED
│   ├── src/
│   │   ├── lib.rs         // Library exports
│   │   ├── main.rs        // Entry point, gRPC server setup ✅ IMPLEMENTED
│   │   ├── hypergraph/    // Hypergraph data structures ✅ IMPLEMENTED
│   │   │   ├── mod.rs     // Module definitions
│   │   │   ├── atom.rs    // Atom and AtomId implementations
│   │   │   ├── relation.rs // Relation and RelationId implementations
│   │   │   └── hypergraph.rs // Hypergraph container implementation
│   │   ├── rules/         // Rule engine data structures ✅ IMPLEMENTED
│   │   │   ├── mod.rs     // Module definitions
│   │   │   ├── pattern.rs // Pattern, Variable, and Binding implementations
│   │   │   └── rule.rs    // Rule and RuleSet implementations
│   │   ├── matching/      // Pattern matching algorithms ✅ IMPLEMENTED
│   │   │   ├── mod.rs     // Module definitions
│   │   │   └── isomorphism.rs // Sub-hypergraph isomorphism implementation
│   │   ├── evolution/     // Hypergraph rewriting logic ✅ IMPLEMENTED
│   │   │   ├── mod.rs     // Module definitions
│   │   │   └── rewriter.rs // Rule application and rewriting implementation
│   │   ├── simulation/    // Simulation loop and event management ✅ IMPLEMENTED
│   │   │   ├── mod.rs     // Module definitions
│   │   │   ├── manager.rs // SimulationManager with step and continuous execution
│   │   │   └── event.rs   // SimulationEvent and HypergraphState structures
│   │   └── serialization/ // State persistence and predefined examples ✅ IMPLEMENTED
│   │       ├── mod.rs     // Module definitions
│   │       ├── persistence.rs // PersistenceManager for save/load functionality
│   │       └── examples.rs // PredefinedExamples with 5 built-in hypergraphs
│   ├── examples/          // Example applications and demos
│   │   └── sprint3_demo.rs // Comprehensive demo of all Sprint 3 features
│   ├── Cargo.toml         // Rust dependencies (updated with new deps)
│   └── Cargo.lock         // Locked dependencies
├── wolfram-sim-frontend/   // React TypeScript frontend ✅ IMPLEMENTED
│   ├── src/
│   │   ├── App.tsx        // Main application component ✅ IMPLEMENTED
│   │   ├── App.css        // Main application styles ✅ IMPLEMENTED
│   │   ├── main.tsx       // Frontend entry point
│   │   ├── index.css      // Global styles
│   │   ├── services/      // API client and external services ✅ IMPLEMENTED
│   │   │   └── apiClient.ts // Complete gRPC-Web client wrapper
│   │   ├── store/         // State management ✅ IMPLEMENTED
│   │   │   └── simulationStore.ts // Zustand store with all simulation state
│   │   ├── components/    // React components ✅ IMPLEMENTED
│   │   │   ├── SimulationControls.tsx // Complete control panel
│   │   │   ├── HypergraphVisualizer.tsx // Interactive 2D visualization
│   │   │   └── StateDisplay.tsx // Status dashboard and event history
│   │   ├── assets/        // Static assets
│   │   └── generated/     // gRPC-Web generated client code
│   ├── public/            // Public static files
│   ├── package.json       // Frontend dependencies (updated with visualization libs)
│   ├── vite.config.ts     // Vite configuration with proxy settings
│   └── tsconfig.json      // TypeScript configuration
├── proto/                 // Protocol Buffer definitions ✅ IMPLEMENTED
│   └── wolfram_physics.proto // gRPC service and message definitions
├── docs/                  // Project documentation
├── memory-bank/           // Persistent memory between AI sessions
│   └── ... (all memory bank files)
├── .gitignore             // Git ignore rules
└── README.md              // Project README
```

### Module Responsibilities ✅ IMPLEMENTED
*   **`wolfram-sim-rust`**: Contains all Rust backend code including simulation engine logic and gRPC service.
    *   `src/hypergraph/`: Core data structures for the simulation (atoms, relations, hypergraph container). ✅ IMPLEMENTED
    *   `src/rules/`: Rule engine data structures (rules, patterns, variables, bindings). ✅ IMPLEMENTED
    *   `src/matching/`: Pattern matching algorithms for sub-hypergraph isomorphism. ✅ IMPLEMENTED
    *   `src/evolution/`: Hypergraph rewriting logic for applying rules. ✅ IMPLEMENTED
    *   `src/simulation/`: Simulation loop management, event tracking, and state management. ✅ IMPLEMENTED
    *   `src/serialization/`: State persistence, save/load functionality, and predefined examples. ✅ IMPLEMENTED
    *   `src/lib.rs`: Exposes the library functionality.
    *   `src/main.rs`: Entry point and complete gRPC server implementation with all 7 RPC handlers. ✅ IMPLEMENTED
    *   `examples/`: Demonstration applications showcasing functionality.
*   **`wolfram-sim-frontend/src`**: Contains all TypeScript SPA frontend code, including React components and gRPC-Web client. ✅ IMPLEMENTED
    *   `services/`: API client and external service integrations. ✅ IMPLEMENTED
    *   `store/`: State management using Zustand. ✅ IMPLEMENTED
    *   `components/`: Modular React components for UI. ✅ IMPLEMENTED
    *   `App.tsx`: Main application layout and routing. ✅ IMPLEMENTED
*   **`proto` (top-level)**: Canonical location for Protocol Buffer definitions. ✅ IMPLEMENTED

## Data Flow ✅ IMPLEMENTED

### Simulation Step Execution
1.  **Frontend:** User clicks "Step" button.
2.  **Frontend:** `SimulationControls.tsx` calls a function in `simulationStore.ts` which uses the `apiClient.ts` (gRPC-Web client).
3.  **Frontend:** `apiClient.ts` sends a `StepRequest` to the Backend gRPC `StepSimulation` RPC.
4.  **Backend (wolfram-sim-rust):** The `StepSimulation` RPC handler in `main.rs` receives the request.
5.  **Backend (wolfram-sim-rust):** The handler calls the appropriate method in the simulation engine (`simulation_manager.step()`).
6.  **Backend (wolfram-sim-rust):**
    a.  The simulation manager retrieves the current `Hypergraph` state.
    b.  The matching logic finds applicable rule matches using pattern matching against the current `Hypergraph`.
    c.  Event selection logic selects one match to apply.
    d.  The rewriter applies the rule, modifying the `Hypergraph` (creating/deleting atoms and relations).
    e.  A `SimulationEvent` is generated.
    f.  The step number is incremented.
7.  **Backend (wolfram-sim-rust):** The simulation engine returns the new `HypergraphState` and `SimulationEvent` to the RPC handler.
8.  **Backend (wolfram-sim-rust):** The RPC handler constructs a `StepResponse` and sends it back to the Frontend.
9.  **Frontend:** `apiClient.ts` receives the `StepResponse`.
10. **Frontend:** The Zustand store in `simulationStore.ts` is updated with the new hypergraph state, events, and step number.
11. **Frontend:** UI components (`HypergraphVisualizer.tsx`, `StateDisplay.tsx`) react to store changes and re-render.

### Continuous Simulation (`RunSimulation`) ✅ IMPLEMENTED
1.  **Frontend:** User clicks "Run" button.
2.  **Frontend:** `SimulationControls.tsx` triggers `runSimulation()` in the Zustand store.
3.  **Frontend:** `apiClient.ts` initiates a server-streaming `RunSimulation` RPC call with update interval configuration.
4.  **Backend (wolfram-sim-rust):** The `RunSimulation` RPC handler starts an asynchronous simulation loop.
5.  **Backend (wolfram-sim-rust):** In a tokio task with configured intervals:
    a.  Performs simulation steps (similar to step execution above).
    b.  Constructs `SimulationStateUpdate` messages.
    c.  Streams updates to the frontend until stopped or conditions met.
6.  **Frontend:** `apiClient.ts` receives each `SimulationStateUpdate` message from the stream.
7.  **Frontend:** Store updates trigger reactive UI updates in `HypergraphVisualizer.tsx` for real-time visualization.

### Save Hypergraph Execution ✅ IMPLEMENTED
1.  **Frontend:** User clicks "Save Hypergraph" button and enters filename.
2.  **Frontend:** `SimulationControls.tsx` calls `saveHypergraph()` in the store, which uses `apiClient.ts`.
3.  **Frontend:** `apiClient.ts` sends a `SaveHypergraphRequest` to the Backend gRPC `SaveHypergraph` RPC.
4.  **Backend (wolfram-sim-rust):** The `SaveHypergraph` RPC handler receives the request.
5.  **Backend (wolfram-sim-rust):** Handler calls `PersistenceManager` to save the current state.
6.  **Backend (wolfram-sim-rust):** `PersistenceManager` serializes the `HypergraphState` to JSON and writes to file.
7.  **Backend (wolfram-sim-rust):** Returns confirmation with file path in `SaveHypergraphResponse`.
8.  **Frontend:** Success/error feedback is displayed to the user through the UI.

### Load Hypergraph Execution ✅ IMPLEMENTED
1.  **Frontend:** User clicks "Load Hypergraph" and selects predefined example or uploads file.
2.  **Frontend:** `SimulationControls.tsx` handles file reading (if needed) and calls `loadHypergraph()` in store.
3.  **Frontend:** `apiClient.ts` sends `LoadHypergraphRequest` with example name or file content.
4.  **Backend (wolfram-sim-rust):** `LoadHypergraph` RPC handler uses `PersistenceManager` or `PredefinedExamples`.
5.  **Backend (wolfram-sim-rust):** Validates and loads the hypergraph, replacing current simulation state.
6.  **Backend (wolfram-sim-rust):** Returns new state in `LoadHypergraphResponse`.
7.  **Frontend:** Store updates with new state, triggering UI refresh with loaded hypergraph.

## 🎉 Final MVP Implementation Status
- **Backend Engine:** ✅ Complete (72 tests, 100% pass rate)
- **gRPC Service:** ✅ Complete (All 7 operations operational)
- **Frontend Application:** ✅ Complete (Full React SPA with visualization)
- **Integration:** ✅ Complete (End-to-end functionality verified)
- **Deployment:** ✅ Operational (Backend: port 50051, Frontend: port 3000)

## Error Handling Strategy ✅ IMPLEMENTED
*   **Backend:** Rust's `Result` type used extensively. Errors are translated into appropriate gRPC error statuses.
*   **Frontend:** Comprehensive error handling in API client and UI components. User-friendly error messages displayed through the state management system.
*   **Logging:** Complete logging on backend and browser console logging on frontend.

## Security Considerations ✅ IMPLEMENTED
*   **Authentication/Authorization:** N/A for MVP (local/trusted environment).
*   **Data Protection:** In-memory simulation data with optional file persistence. Standard file system permissions apply.
*   **Input Validation:** Comprehensive validation of gRPC requests and loaded hypergraph data with error feedback.
*   **Error Handling:** Robust error boundaries prevent crashes and provide user feedback.

## Scalability Considerations
*   **Current Design:** MVP designed for small-scale simulations (hundreds to thousands of atoms/relations).
*   **Performance:** Real-time visualization supports interactive exploration with smooth updates.
*   **Future Scaling:** Architecture designed for extensibility with modular components and clean interfaces.

## Cross-Cutting Concerns ✅ IMPLEMENTED
*   **Logging:** Complete logging implementation in both backend (env_logger) and frontend (console).
*   **Configuration Management:** Vite configuration, Cargo.toml, and environment-based settings.
*   **Accessibility:** Semantic HTML, keyboard navigation, and ARIA labels implemented.
*   **Responsive Design:** Desktop-focused with mobile considerations as specified.

## Testing Strategy ✅ IMPLEMENTED
*   **Unit Tests (Rust):** 72 tests with 100% pass rate covering all core functionality.
*   **Integration Tests:** Complete gRPC service testing and frontend-backend integration.
*   **End-to-End Testing:** Manual testing of complete user workflows verified.
*   **Test Coverage:** High coverage of algorithms, data structures, and critical user paths.