# 13. Quick Reference Guide from PRD

**Last Updated:** June 11, 2025 (Sprint 5 Completion - MVP COMPLETE!)

This guide provides a quick lookup for key terms, features, and identifiers from the Wolfram Physics Simulator MVP PRD.

## 🎉 MVP STATUS: COMPLETE!
**All Features Implemented:** F1.1-F1.7, F2.1-F2.3, F3.1-F3.4  
**Application Status:** ✅ Fully Operational  
**Access URL:** http://localhost:3000  
**Backend Service:** ✅ Running on port 50051  
**Frontend Service:** ✅ Running on port 3000

## 🛠️ Quick Setup Commands

### Prerequisites Installation
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Node.js (download from nodejs.org)

# Install protoc and required plugins
brew install protobuf
brew install protoc-gen-grpc-web  # Also installs protoc-gen-js

# Alternative for plugins if Homebrew fails:
npm install -g protoc-gen-js
```

### Start Development Environment
```bash
# Terminal 1: Start backend
cd wolfram-sim-rust && cargo run --quiet

# Terminal 2: Start frontend  
cd wolfram-sim-frontend && npm run dev

# Access: http://localhost:3000
```

### Common Troubleshooting
```bash
# Proto generation errors
npm run generate-proto  # In wolfram-sim-frontend/

# Build errors
cargo clean && cargo build  # In wolfram-sim-rust/
rm -rf node_modules && npm install  # In wolfram-sim-frontend/
```

## Core Components & Technologies

-   **Simulation Engine**: Rust (Backend) ✅ IMPLEMENTED
    -   **Core Library Crate:** `wolfram-sim-rust`
    -   **gRPC Server Implementation:** `main.rs`
-   **User Interface**: TypeScript React SPA (Frontend) ✅ IMPLEMENTED
    -   **Framework:** React 18+ with TypeScript, Vite, Zustand state management
    -   **Visualization:** react-force-graph-2d for interactive hypergraph display
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

-   **gRPC Client (F3.1)**: ✅ IMPLEMENTED - Complete TypeScript API client with error handling and type conversion
-   **Simulation Controls (F3.2)**: ✅ IMPLEMENTED - Initialize, Step (1 & 5), Run/Pause, Stop, Reset, Save/Load functionality with comprehensive UI
-   **Hypergraph Visualization (F3.3)**: ✅ IMPLEMENTED - Interactive 2D display with real-time updates, zoom/pan, node dragging
    -   Blue circles = atoms • Red lines = binary relations • Orange nodes = hyperedge centers
-   **State Display (F3.4)**: ✅ IMPLEMENTED - Step number, atom/relation counts, event history, system status, JSON viewer

## MVP Goals (Section 2) - ALL ACHIEVED! ✅

-   **G1**: Functional Rust backend engine. ✅ IMPLEMENTED
-   **G2**: Web-based frontend for visualization. ✅ IMPLEMENTED  
-   **G3**: Robust gRPC communication. ✅ IMPLEMENTED
-   **G4**: Basic user controls. ✅ IMPLEMENTED
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

## Frontend Components (Implemented in `wolfram-sim-frontend`)

-   `src/services/apiClient.ts`: ✅ IMPLEMENTED - Complete gRPC-Web client integration
-   `src/store/simulationStore.ts`: ✅ IMPLEMENTED - Zustand state management
-   `src/components/SimulationControls.tsx`: ✅ IMPLEMENTED - All UI controls
-   `src/components/HypergraphVisualizer.tsx`: ✅ IMPLEMENTED - Interactive 2D visualization
-   `src/components/StateDisplay.tsx`: ✅ IMPLEMENTED - Status and event displays
-   `src/App.tsx`: ✅ IMPLEMENTED - Main application layout

## Technical Choices (Section 6 - Design and Technical Considerations)

-   **Rust Backend (D1)**: `tonic` (gRPC), `tonic-web` ✅ IMPLEMENTED.
-   **Frontend (D2)**: React 18+ with TypeScript, react-force-graph-2d for visualization ✅ IMPLEMENTED.
-   **Communication (D3)**: Protocol Buffers for serialization ✅ IMPLEMENTED.

## Success Metrics (Section 7) - ALL MET! ✅

-   **S1**: Successful initialization. ✅ IMPLEMENTED
-   **S2**: Observable step-through changes. ✅ IMPLEMENTED
-   **S3**: Real-time continuous run (1-2 updates/sec for small graphs). ✅ IMPLEMENTED
-   **S4**: Reliable gRPC communication. ✅ IMPLEMENTED
-   **S5**: Understandable and extensible codebase. ✅ IMPLEMENTED

## Current Status - MVP COMPLETE! 🎉

### Test Status
-   **Total Tests**: 72 tests
-   **Pass Rate**: 100%
-   **Coverage**: Complete backend functionality including simulation, persistence, and gRPC service

### Application Status
-   **Backend Service**: ✅ Operational on port 50051
-   **Frontend Application**: ✅ Operational on port 3000
-   **Complete MVP**: ✅ Accessible at http://localhost:3000

### Predefined Examples Available
1. **empty_graph**: Empty hypergraph for custom simulations
2. **single_edge**: Simple A--B edge for edge splitting demos
3. **triangle**: Three atoms in triangular cycle (A--B--C--A)
4. **small_path**: Linear path A--B--C--D
5. **small_cycle**: Four-atom cycle A--B--C--D--A

### How to Use the MVP
1. **Access**: Open http://localhost:3000 in your web browser
2. **Initialize**: Select a predefined example and click "Initialize Simulation"
3. **Step**: Use "Step (1)" or "Step (5)" to advance the simulation
4. **Run**: Click "Run" for continuous simulation with real-time visualization
5. **Visualize**: Watch the hypergraph evolve in the interactive 2D display
6. **Manage**: Save/Load hypergraphs using the file management controls

### Project Completion Status
🎉 **WOLFRAM PHYSICS SIMULATOR MVP FULLY COMPLETE!** 🎉
- All 5 sprints successfully delivered (F1.1-F1.7, F2.1-F2.3, F3.1-F3.4)
- Complete interactive web application for hypergraph simulation
- Ready for production deployment and user testing
- Extensible foundation for future advanced features