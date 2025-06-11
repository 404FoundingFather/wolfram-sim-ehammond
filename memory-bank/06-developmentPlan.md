# Development Plan

**Last Updated:** June 11, 2025

This document outlines the strategic development plan for the Wolfram Physics Simulator MVP. It details the project phases, key deliverables, technical approaches, and risk management, reflecting a focus on robust design and iterative implementation.

## 1. Guiding Principles & Development Approach

*   **Iterative Development:** We will employ an Agile-inspired iterative approach, prioritizing the delivery of a functional MVP. Sprints will focus on incremental feature delivery, allowing for continuous feedback and adaptation.
*   **Correctness First:** For the MVP, emphasis will be on the correctness of the simulation logic and hypergraph operations over premature optimization.
*   **Modularity:** Code will be structured into logical, loosely coupled modules to enhance maintainability and testability.
*   **Clear Abstractions:** Well-defined interfaces between components (Rust engine, gRPC service, frontend) are crucial.
*   **Test-Driven Development (TDD) Influence:** Core logic, especially in the simulation engine, will be heavily unit-tested.

## 2. Project Roadmap (MVP)

The MVP is structured into three primary phases:

### Phase 1: Rust Simulation Engine Core – The Heart of the Model

**Timeline:** [To be defined - Estimated X weeks]
**Goal:** Implement the fundamental building blocks of the Wolfram model simulation, ensuring a correct and extensible foundation in Rust.

**Key Deliverables & Technical Elaboration:**

*   **F1.1: Hypergraph Representation**
    *   **Atoms:** Implement as unique identifiers (e.g., UUIDs or sequential IDs) possibly associated with types or inert metadata (e.g., `Symbol["A"]`). For MVP, atoms are primarily distinct entities.
    *   **Relations (Hyperedges):** Represent as **ordered** collections of Atom identifiers. The order is significant for pattern matching as per the PRD (e.g., a rule matching `{{a,b}}` might not match the hyperedge `(b,a)` unless explicitly designed to or if the rule system has symmetries). For MVP, `Vec<AtomId>` is a suitable representation.
    *   **Hypergraph Data Structure:** Employ a structure that efficiently stores and allows querying of atoms and relations. This could involve `HashSet` for atoms and `Vec<Vec<AtomId>>` for relations, along with indexing structures (e.g., `HashMap<AtomId, Vec<RelationId>>`) for fast lookups. The design should anticipate the need for sub-hypergraph queries.
    *   **Mapping to Wolfram Expressions:** Conceptualize atoms and relations as analogous to symbols and expressions in the Wolfram Language. `Hypergraph { atoms: {A, B, C}, relations: {{A,B}, {B,C}} }` could map to a set of expressions like `{Edge[A,B], Edge[B,C]}`.

*   **F1.2: Rewrite Rule Definition & Storage**
    *   **Rule Structure:** Define a Rust struct for rewrite rules, comprising a `pattern` (a small hypergraph) and a `replacement` (another small hypergraph). Variables within patterns (e.g., `x`, `y` in `{{x,y}} -> {{x,z},{z,y}}`) will need a distinct representation.
    *   **Initial Storage:** For MVP, rules will be hardcoded in Rust (e.g., as static instances of the rule struct). Example: `Rule::new(pattern_xy, replacement_xzyz)`.
    *   **Future Consideration:** Plan for future parsing of rules from a defined syntax (e.g., a string DSL or JSON).

*   **F1.3: Pattern Matching (Sub-hypergraph Isomorphism)**
    *   **Core Challenge:** This involves finding occurrences of the rule's `pattern` hypergraph within the main simulation `Hypergraph`. This is equivalent to the sub-hypergraph isomorphism problem.
    *   **MVP Approach:** Implement a basic, potentially backtracking, search algorithm. For a pattern `P` and graph `G`, the algorithm will attempt to map atoms and relations in `P` to those in `G` respecting connectivity.
    *   **Variable Binding:** The matching process must correctly bind variables in the pattern to specific atoms in the main hypergraph.
    *   **Performance Note:** Acknowledge that this is NP-hard. The MVP implementation will be suitable for small hypergraphs and patterns. Optimizations (e.g., using atom types or degrees to prune search) can be considered if time permits but are not primary.

*   **F1.4: Hypergraph Rewriting Logic**
    *   **Atomicity:** Define the atomicity of a rewrite. Does a single match get rewritten, or are all non-overlapping matches rewritten simultaneously? For MVP, assume sequential rewriting of one match at a time.
    *   **Process:**
        1.  Identify a match (bindings for pattern variables).
        2.  Remove atoms/relations from the main hypergraph that correspond to the matched `pattern` elements (respecting variable bindings).
        3.  Instantiate the `replacement` hypergraph: create new atoms for any new variables introduced in the replacement (e.g., `z` in `{{x,z},{z,y}}`) and use the bound atoms for existing variables.
        4.  Add the instantiated `replacement` atoms/relations to the main hypergraph.
    *   **Ensuring Uniqueness:** New atoms created must have unique IDs.

*   **F1.5: Simulation Loop & Event Management**
    *   **Step-by-Step Execution:** The primary mode will be discrete steps. Each step involves:
        1.  Finding all possible matches for all defined rules.
        2.  **Event Selection (Causal Invariance):** If multiple matches exist, select one to apply. For MVP, a simple deterministic strategy (e.g., first rule, first match found) will be used. Future iterations might explore random selection or strategies aiming for confluence/causal invariance.
        3.  Apply the selected rewrite (F1.4).
    *   **"Continuous" Simulation (Fixed-Point Seeking):** Implement functionality to run steps repeatedly until no more rules can be applied or a step limit is reached.
    *   **Event Definition:** An "event" corresponds to a single rewrite operation (a specific rule applied to a specific match at a specific "time"/step).

*   **F1.6: Event Management & State Transmission**
    *   **Purpose:** Identifying distinct update "events" (application of a rule) and serializing the current hypergraph state efficiently for gRPC transmission. (Formerly combined with broader serialization, now more focused on transient state for API).
    *   **Content:** `HypergraphState` for transmission will include atoms, relations, and current step number. `SimulationEvent` details will be part of `SimulationStateUpdate`.

*   **F1.7: Hypergraph Persistence (NEW)**
    *   **Purpose:** To allow users to save the current hypergraph state to a file and load a hypergraph state from a file, including from a set of predefined example hypergraphs. This is crucial for testing, demonstrations, and user workflow.
    *   **Save Hypergraph:**
        *   Mechanism: Use `serde` to serialize the full `HypergraphState` (atoms, relations, possibly step number if relevant to the saved state) to a JSON file.
        *   Filename: User-specified or a default naming convention.
    *   **Load Hypergraph:**
        *   Mechanism: Use `serde` to deserialize a `HypergraphState` from a JSON file. This loaded state will replace the current simulation's hypergraph.
        *   Source: User-selected file or a selection from packaged predefined example files.
    *   **Predefined Hypergraphs:**
        *   A collection of 3-5 example hypergraph JSON files (e.g., "empty_graph.json", "simple_cycle.json", "small_branching.json") will be included as assets. These can be generated offline (potentially with AI assistance by developers) to showcase different initial conditions or test specific rule interactions.
    *   **Format:** JSON for MVP for readability. `serde` ensures this.

### Phase 2: gRPC Service Implementation

**Timeline:** [To be defined - Estimated Y weeks, can overlap with Phase 1 refinement]
**Goal:** Expose the simulation engine's capabilities via a robust and well-defined gRPC API.

**Key Deliverables:**
*   **F2.1**: gRPC Service Definition (`WolframPhysicsSimulatorService` with RPCs aligned with PRD: `InitializeSimulation`, `StepSimulation`, `RunSimulation` (streaming), `StopSimulation`, `GetCurrentState`, **`SaveHypergraph` (New)**, **`LoadHypergraph` (New)**).
    *   `SetRules` (for dynamic rule loading) and `GetHypergraphSlice` (for partial graph fetching) are considered post-MVP features.
    *   The PRD's streaming `RunSimulation` RPC will be the primary method for continuous evolution. Client-side logic can manage running this stream until a desired condition (e.g., fixed point, step limit) is met if a "run to end" behavior is needed without a dedicated non-streaming RPC.
*   **F2.2**: Protocol Buffer Message Definitions (Aligned with PRD: `Atom`, `Relation`, `HypergraphState`, `SimulationEvent`, `SimulationStateUpdate`, plus request/response messages for each RPC, **including new messages for `SaveHypergraphRequest`, `SaveHypergraphResponse`, `LoadHypergraphRequest`, `LoadHypergraphResponse`**) - Initial setup to be extended.
    *   Ensure messages are well-structured for efficiency and clarity.
*   **F2.3**: Integration of gRPC service with the Rust simulation engine.
    *   The gRPC server methods will call directly into the Rust simulation engine's public API.
    *   Manage simulation state instances per client or session as appropriate. For MVP, a single global simulation instance might suffice for simplicity, but this is a key design decision for multi-user/multi-simulation scenarios.

### Phase 3: Web Frontend Development

**Timeline:** [To be defined - Estimated Z weeks, can overlap with Phase 2]
**Goal:** Provide an intuitive web interface for users to interact with, control, and visualize simulations.

**Key Deliverables:** *(Largely as before, with minor clarifications and additions)*
*   **F3.1**: gRPC-Web Client Integration - **Initial setup complete (React with Vite, gRPC-Web client generation configured).**
*   **F3.2**: UI Controls:
    *   Initialize simulation (e.g., with a predefined initial hypergraph or a simple editor).
    *   Input for rule definitions (if `SetRules` gRPC endpoint is implemented).
    *   Buttons: Step, Run (continuous/to end), Stop, Reset.
    *   **New Buttons/Controls:**
        *   "Save Hypergraph" button (triggers F2.1 `SaveHypergraph` RPC).
        *   "Load Hypergraph" button/dialog (triggers F2.1 `LoadHypergraph` RPC, allowing selection from user file or predefined examples).
*   **F3.3**: Hypergraph Visualization:
    *   2D rendering of atoms (nodes) and relations (hyperedges - potentially represented by connecting nodes to a central "relation node" or using more complex hyperedge drawing techniques).
    *   Dynamic updates reflecting state changes from the backend.
    *   Basic layout algorithm (e.g., force-directed) for readability.
*   **F3.4**: State Display:
    *   Current step number.
    *   Counts of atoms and relations.
    *   Display of applied rule/event in the last step.

## 3. Current Sprint/Iteration Plan

**Sprint 0: Foundational Setup (Completed May 13, 2025)**
*   **Goal:** Establish CI/CD, project structure, and basic inter-component communication pathways.
*   **Completed Tasks:**
    1.  Rust project (`Cargo.toml`), Tonic for gRPC. [Done]
    2.  Initial `.proto` file. [Done]
    3.  React (Vite) frontend. [Done]
    4.  gRPC-Web client generation. [Done]

**Sprint 1: Core Hypergraph & Rule Representation (Focus: F1.1, F1.2)**
*   **Timeline:** [Start Date] - [End Date]
*   **Goal:** Implement stable data structures for atoms, relations, hypergraphs, and rule definitions in Rust.
*   **Tasks:**
    1.  Define and implement `AtomId` type and `Atom` struct/metadata.
    2.  Design and implement `Relation` (hyperedge) representation (e.g., `Vec<AtomId>`).
    3.  Implement core `Hypergraph` struct with methods for adding/removing atoms & relations, and basic queries (e.g., get relations containing an atom).
    4.  Define `Rule` struct (pattern hypergraph, replacement hypergraph).
    5.  Implement storage for a set of hardcoded rules (e.g., the `{{x,y}} -> {{x,z},{z,y}}` example).
    6.  Unit tests for all data structures and basic operations.
*   **Dependencies:** None.
*   **Owner/Est:** [TBD]

**Sprint 2: Basic Pattern Matching & Rewriting (Focus: F1.3, F1.4)**
*   **Timeline:** [Start Date] - [End Date]
*   **Goal:** Implement initial logic for finding rule matches and applying rewrites.
*   **Tasks:**
    1.  Develop basic sub-hypergraph isomorphism algorithm for pattern matching.
    2.  Implement variable binding and substitution logic.
    3.  Implement the hypergraph rewriting process (remove old, add new).
    4.  Unit tests for matching and rewriting simple cases.
*   **Dependencies:** Sprint 1 completion.
*   **Owner/Est:** [TBD]

**Sprint 3: Simulation Loop, Event Management & Persistence (Focus: F1.5, F1.6, F1.7) - ✅ COMPLETED June 11, 2025**
*   **Timeline:** June 11, 2025 (completed)
*   **Goal:** Implement simulation step management, event tracking, and hypergraph persistence.
*   **Completed Tasks:**
    1.  ✅ Implemented `serde` serialization for `HypergraphState` to JSON (F1.7).
    2.  ✅ Implemented `serde` deserialization for `HypergraphState` from JSON (F1.7).
    3.  ✅ Developed `PersistenceManager` for saving hypergraphs to user-specified/default files (F1.7).
    4.  ✅ Developed logic to load hypergraphs from files, replacing current state (F1.7).
    5.  ✅ Created 5 predefined hypergraph examples as built-in assets (F1.7).
    6.  ✅ Implemented `SimulationManager` with step-by-step simulation loop logic (F1.5).
    7.  ✅ Implemented continuous simulation mode with configurable stopping conditions (F1.5).
    8.  ✅ Defined and implemented comprehensive simulation event tracking (F1.6).
    9.  ✅ Added 26 new unit tests for save/load functionality and simulation loop components.
*   **Achievements:** 72 total tests passing, comprehensive simulation engine core completed.
*   **Dependencies:** Sprint 1 & 2 completion. ✅ Met
*   **Next:** Ready for Sprint 4 (gRPC Service Implementation)

**Sprint 4: gRPC Service Implementation (Focus: F2.1, F2.2, F2.3) - 📋 PLANNED**
*   **Goal:** Expose simulation engine capabilities via gRPC API for frontend integration.
*   **Dependencies:** Sprint 3 completion. ✅ Met

## 4. Development Workflow & QA

### Code Management
*   **Branch Strategy:** `main` (stable, tagged releases), `develop` (integration, nightly/dev releases), feature branches (`feat/F1.1-hypergraph-structs`, `fix/bug-description`).
*   **Merge Process:** Pull Requests (PRs) to `develop`, then `develop` to `main`. PRs require at least one peer review and passing CI checks.
*   **Version Control:** Git. Commit messages to follow Conventional Commits style.

### Testing Requirements
*   **Unit Tests (Rust):** `cargo test`. Must cover all core logic (data structures, algorithms, utils). Aim for high coverage.
*   **Integration Tests (Rust/gRPC):** Test gRPC service endpoints and their interaction with the simulation engine.
*   **End-to-End (E2E) Tests (Frontend):** Use a framework like Cypress or Playwright to test key user flows. (Post-MVP consideration if time is limited for MVP).
*   **Manual Testing:** For UI/UX aspects and exploratory testing.

### Review Process
*   **Code Reviews:** Mandatory for all PRs. Focus on correctness, clarity, performance implications, test coverage, and adherence to style guides.
*   **Design Reviews:** For significant architectural decisions, new complex algorithms, or major API changes.
*   **QA Process:** Combination of automated tests and structured manual testing before releases.

## 5. Implementation Details & Key Components

### Rust Simulation Engine (F1.x)
*   **Approach:** Performance-sensitive components in Rust. Focus on idiomatic Rust, leveraging its strengths in memory safety and concurrency (for future explorations).
*   **Key Modules/Crates (Illustrative):**
    *   `wolfram_engine_core::hypergraph`: `atom.rs`, `relation.rs`, `hypergraph.rs` (data structures, queries).
    *   `wolfram_engine_core::rules`: `rule.rs`, `pattern.rs` (rule definition, variable handling).
    *   `wolfram_engine_core::matching`: `isomorphism.rs` (sub-hypergraph isomorphism logic).
    *   `wolfram_engine_core::evolution`: `rewriter.rs`, `scheduler.rs` (applying rules, event selection).
    *   `wolfram_engine_core::simulation`: `mod.rs` or `manager.rs` (main simulation loop, state management).
    *   `wolfram_engine_core::serialization`: `mod.rs` (state saving/loading to/from files using `serde`, primarily for F1.7 Hypergraph Persistence).

### gRPC Service (F2.x)
*   **Approach:** Use `tonic` in Rust. Define clear, versionable `.proto` files.
*   **Key Components:**
    *   `api/proto/wolfram_physics.proto`: Service and message definitions.
    *   `grpc_server/src/server.rs`: Implementation of gRPC service traits, bridging to `wolfram_engine_core`.

### Web Frontend (F3.x)
*   **Approach:** React with Vite (TypeScript). State management (e.g., Zustand, Redux Toolkit). gRPC-Web for backend communication.
*   **Visualization Library:** Evaluate options like `vis.js`, `sigma.js`, `d3.js` (for custom rendering), or specialized hypergraph libraries if available and suitable. Prototype early.
*   **Key Components:**
    *   `src/services/apiClient.ts`: gRPC-Web client setup.
    *   `src/components/simulation/SimulationControls.tsx`.
    *   `src/components/visualization/HypergraphVisualizer.tsx`.
    *   `src/store/simulationStore.ts`: State management for simulation data.

## 6. Risk Assessment & Mitigation

| Risk                                                | Impact | Likelihood | Mitigation Strategies                                                                                                                               |
| :-------------------------------------------------- | :----- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Sub-hypergraph Isomorphism Complexity**           | High   | High       | MVP: Basic algorithm, clear performance caveats. Research advanced algorithms (e.g., VF2, Ullmann) for post-MVP. Focus on constraints for MVP rules. |
| **Scalability of Hypergraph State**                 | Medium | Medium     | MVP: Target small graphs. For post-MVP, explore optimized data structures, potential for out-of-core processing, or distributed state.                 |
| **Event Selection & Causal Invariance**             | Medium | Medium     | MVP: Simple deterministic event selection. Post-MVP: Research and implement strategies reflecting Wolfram model theory (e.g., exploring different foliations). |
| **gRPC-Web Integration & Performance**              | Medium | Low        | Early, continuous testing of Rust-frontend communication. Optimize message sizes. Monitor network latency.                                                |
| **Visualization Performance for Dynamic Graphs**      | Medium | Medium     | MVP: Basic visualization, limit graph size. Choose efficient library. Post-MVP: Incremental rendering, WebGL, layout optimizations.                |
| **Defining "Correct" Behavior for Complex Rules**   | Medium | Medium     | Rigorous testing against known examples from Wolfram physics. Peer review of rule interpretations. Start with simple, well-understood rules.           |
| **File I/O and Format Errors (New)**                | Medium | Medium     | Robust error handling for file operations (permissions, not found, corrupted JSON). Clear user feedback for failed save/load operations. Validate loaded data. |
| **Team Member Availability / Skillset Gaps**        | Low    | Low        | Cross-training, clear documentation. Identify key expertise areas early.                                                                          |
| **Choosing & Integrating JS Visualization Library** | Low    | Low        | Allocate specific time for evaluation and prototyping with 2-3 candidates. Prioritize ease of use and hypergraph-friendliness for MVP.                |

## 7. Resources

### Team Roles (Illustrative for MVP)
*   Project Lead / Architect
*   Rust Developer (Backend Engine)
*   Frontend Developer (React/TS/Visualization)
*   QA/Test Engineer (shared or dedicated)

### Tools & Technologies
*   **Languages/Runtime:** Rust, TypeScript, Node.js
*   **Frameworks/Libraries:** Tonic (Rust gRPC), React (Vite), gRPC-Web
*   **Build/Package:** Cargo, npm/yarn
*   **CI/CD:** GitHub Actions (or similar)
*   **Version Control:** Git, GitHub (or similar)
*   **Project Management:** Kanban board (e.g., GitHub Projects, Jira)
*   **Documentation:** Markdown (in-repo), potentially a static site generator for user docs.

This rewritten plan aims to be more comprehensive and provide a stronger foundation for the project.