# Product Requirements Document: Wolfram Physics Simulator MVP (Rust Engine)

## 1. Introduction

This document outlines the requirements for the Minimum Viable Product (MVP) of a Wolfram Physics Model Simulator. The simulator will consist of a core simulation engine built in Rust and a web-based frontend for visualization and control. The primary goal of the MVP is to demonstrate the fundamental capabilities of simulating hypergraph evolution based on simple rewrite rules and visualizing this evolution in real-time. This project aims to provide a basic tool for exploring the concepts of the Wolfram Physics Project.

## 2. Goals

- **G1**: Develop a functional backend simulation engine in Rust capable of evolving a hypergraph based on predefined rewrite rules.
- **G2**: Create a web-based frontend to visualize the hypergraph and its evolution step-by-step or continuously.
- **G3**: Implement a robust communication channel between the frontend and backend using gRPC (with gRPC-Web).
- **G4**: Provide basic user controls for initializing, starting, stopping, and stepping through the simulation.
- **G5**: Establish a foundational architecture that can be extended for more complex features in future iterations.

## 3. Target Audience

- **TA1**: Students and enthusiasts interested in learning the basics of the Wolfram Physics model.
- **TA2**: Researchers or developers looking for a simple, open platform to experiment with basic hypergraph rewriting systems.
- **TA3**: The development team itself, to validate the core architecture and gather feedback for future development.

## 4. Scope & Features (MVP)

The MVP will focus on delivering a core, usable simulation experience.

### 4.1. Rust Simulation Engine (Backend)

- **F1.1: Hypergraph Representation**:
  - Implement a basic hypergraph data structure. For MVP, this will consist of:
    - A collection of unique "atoms" (nodes).
    - A collection of "relations" (hyperedges), where each relation is an ordered list of atoms. (For MVP, we can start with binary and ternary relations primarily).

- **F1.2: Rewrite Rule Definition & Storage**:
  - Allow for one (or a very small set of 2-3) hardcoded/predefined rewrite rule(s) within the Rust engine.
  - A rule will specify a pattern (a small sub-hypergraph to match) and a replacement (a small sub-hypergraph to substitute).
  - Example MVP Rule: `{{x,y}} -> {{x,z}, {z,y}}` where `z` is a new atom.

- **F1.3: Pattern Matching**:
  - Implement a basic sub-hypergraph isomorphism algorithm to find occurrences of the rule's pattern in the current hypergraph state. For MVP, this can be a simple, exhaustive search, acknowledging performance limitations for large graphs.

- **F1.4: Hypergraph Rewriting**:
  - Implement the logic to apply a matched rule: remove the matched sub-hypergraph elements and add the replacement elements, creating new atoms as necessary and updating relations.

- **F1.5: Simulation Loop**:
  - Provide a mechanism to evolve the hypergraph:
    - Step-by-step: Apply one valid rule update (or a maximal set of non-conflicting updates, for MVP, one update per "step" is acceptable).
    - Continuous run: Repeatedly apply updates.
  - Manage a "current state" of the hypergraph.

- **F1.6: Event Management & State Tracking (Basic)**:
  - The engine should identify distinct update "events" (application of a rule).
  - The engine should be able to serialize the current hypergraph state for transmission.

### 4.2. gRPC Service (Backend API)

- **F2.1: Service Definition (WolframPhysicsSimulatorService)**:
  - `rpc InitializeSimulation(InitializeRequest) returns (InitializeResponse)`:
    - **InitializeRequest**: Can specify an initial hypergraph (e.g., a list of atoms and relations) or select a predefined initial state. Can specify the rule(s) to use (from the hardcoded set).
    - **InitializeResponse**: Confirmation of initialization, initial hypergraph state.
  - `rpc StepSimulation(StepRequest) returns (StepResponse)`:
    - **StepRequest**: Number of steps to perform (for MVP, likely just 1).
    - **StepResponse**: New hypergraph state after the step(s), list of events that occurred.
  - `rpc RunSimulation(RunRequest) returns (stream SimulationStateUpdate)`:
    - **RunRequest**: Parameters like update interval (optional).
    - **SimulationStateUpdate**: A message containing the current hypergraph state. This stream sends updates as the simulation runs in the backend.
  - `rpc StopSimulation(StopRequest) returns (StopResponse)`:
    - **StopRequest**: (Empty).
    - **StopResponse**: Confirmation.
  - `rpc GetCurrentState(GetCurrentStateRequest) returns (SimulationStateUpdate)`:
    - **GetCurrentStateRequest**: (Empty).
    - **SimulationStateUpdate**: The current hypergraph state.

- **F2.2: Message Definitions (Protocol Buffers)**:
  - **Atom**: `string id`
  - **Relation**: `repeated string atom_ids` (ordered list of atom IDs forming the hyperedge).
  - **HypergraphState**: `repeated Atom atoms`, `repeated Relation relations`.
  - **SimulationEvent**: `string id`, `string rule_id_applied`, `repeated string atoms_involved_input`, `repeated string atoms_involved_output` (simplified for MVP).
  - **SimulationStateUpdate**: `HypergraphState current_graph`, `repeated SimulationEvent recent_events`, `int64 step_number`.

### 4.3. Web Frontend (TypeScript SPA)

- **F3.1: gRPC Client Integration**:
  - Implement client-side stubs generated from the `.proto` file (using gRPC-Web) to communicate with the Rust backend.

- **F3.2: Simulation Controls**:
  - UI Buttons/Inputs for:
    - "Initialize Simulation" (with options for selecting predefined initial state/rule).
    - "Step" (to advance the simulation by one update event).
    - "Run" (to start continuous simulation updates).
    - "Stop" (to pause continuous simulation).

- **F3.3: Hypergraph Visualization**:
  - Display the current hypergraph state in a 2D canvas or SVG area.
  - Represent atoms as nodes (e.g., circles).
  - Represent relations/hyperedges. For MVP:
    - Binary relations as simple lines between two nodes.
    - Ternary (or higher-arity) relations could be represented by a small central "relation node" connected to the constituent atoms, or simply by drawing lines from each atom in the relation to a common conceptual point.
  - Use a simple force-directed layout or a basic fixed layout for node placement.
  - The visualization should update dynamically when new `SimulationStateUpdate` messages are received from the backend.

- **F3.4: State Display (Basic)**:
  - Display current step number.
  - Optionally, display the number of atoms and relations.

## 5. Non-Goals (for MVP)

- User-defined graphical rule editor.
- Saving or loading arbitrary simulation states or rules from files.
- Advanced visualization techniques (3D, complex hyperedge rendering, causal graph visualization, multiway system exploration).
- High-performance pattern matching for very large graphs.
- Distributed simulation capabilities.
- User authentication or accounts.
- Detailed analysis or plotting of simulation metrics beyond basic counts.
- Mobile responsiveness (desktop browser is the primary target).
- Undo/redo functionality.

## 6. Design and Technical Considerations

- **D1: Rust Backend**:
  - Utilize a Rust gRPC library (e.g., `tonic`) and a gRPC-Web compatibility layer (e.g., `tonic-web`).
  - Focus on clear, modular code for hypergraph manipulation and rule application, even if not highly optimized for MVP.
  - Initial hypergraph and rules will be hardcoded or loaded from simple embedded structures.

- **D2: Frontend**:
  - Choose a mainstream TypeScript SPA framework (React, Vue, Svelte).
  - Employ a 2D graph visualization library (e.g., Vis.js, Sigma.js, react-force-graph, or custom SVG/Canvas rendering) to display the hypergraph.
  - State management on the frontend (e.g., Zustand, Pinia, Svelte stores, or React Context/Redux Toolkit) to handle incoming simulation states.

- **D3: Communication**:
  - Ensure efficient serialization/deserialization of hypergraph states via Protocol Buffers.
  - Handle streaming connections gracefully.

- **D4: Error Handling**:
  - Basic error handling and feedback to the user (e.g., if initialization fails, if the backend connection is lost).

## 7. Success Metrics (for MVP)

- **S1**: Users can successfully initialize a simulation with a predefined setup.
- **S2**: Users can step through the simulation and observe the hypergraph changing in the visualization.
- **S3**: Users can run the simulation continuously and see real-time updates (e.g., at least 1-2 updates per second for small graphs).
- **S4**: The gRPC communication channel reliably transmits state between backend and frontend.
- **S5**: The foundational codebase is understandable and provides a clear path for future feature additions.

## 8. Future Considerations (Post-MVP)

- User-defined rules (textual or graphical input).
- Loading/saving simulation configurations.
- More sophisticated visualization (3D, better hyperedge rendering, causal graphs).
- Performance optimizations for larger graphs and more complex rules.
- Exploration of multiway systems.
- Exporting simulation data and visualizations.
- More detailed analytics and metrics.

This PRD provides a focused scope for the MVP, emphasizing core functionality and establishing a solid architectural base.

