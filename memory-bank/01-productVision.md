# Product Vision

**Last Updated:** May 14, 2025

This document serves as the source of truth for the product we are building, defining the problem space, solution approach, and user experience goals.

## Problem Statement

*   The Wolfram Physics Project introduces complex concepts of hypergraph evolution that are not easily accessible or explorable without dedicated tools.
*   There is a need for a basic, interactive simulator to help understand and visualize the fundamental mechanics of these models.
*   Existing tools might be too complex or not specifically tailored to the simple rule-based hypergraph rewriting described in the early stages of the Wolfram Physics model.

## Proposed Solution

*   Develop a Minimum Viable Product (MVP) of a Wolfram Physics Model Simulator.
*   The simulator will feature a Rust-based core engine for hypergraph evolution and a web-based frontend for visualization and control.
*   It will demonstrate simulating hypergraph evolution with simple, predefined rewrite rules and visualize this in real-time.
*   The system will use gRPC (with gRPC-Web) for robust communication between the backend and frontend.

## User Experience Goals

*   Provide an intuitive way to initialize, run, step through, and stop a hypergraph simulation.
*   Offer a clear visualization of the hypergraph state and its evolution.
*   Ensure the interface is straightforward for users to understand the simulation's progress and the rules being applied.
*   The tool should feel responsive for small-scale simulations.

## Key Features

### Rust Simulation Engine (Backend)
*   Basic hypergraph representation (atoms, relations).
*   Hardcoded/predefined rewrite rule definition and storage (e.g., `{{x,y}} -> {{x,z}, {z,y}}`).
*   Basic sub-hypergraph isomorphism for pattern matching.
*   Hypergraph rewriting logic.
*   Simulation loop (step-by-step, continuous run).
*   Basic event management and state tracking.

### gRPC Service (Backend API)
*   `InitializeSimulation` RPC.
*   `StepSimulation` RPC.
*   `RunSimulation` RPC (streaming state updates).
*   `StopSimulation` RPC.
*   `GetCurrentState` RPC.
*   Protocol Buffer definitions for `Atom`, `Relation`, `HypergraphState`, `SimulationEvent`, `SimulationStateUpdate`.

### Web Frontend (TypeScript SPA)
*   gRPC-Web client integration.
*   UI controls: Initialize, Step, Run, Stop.
*   2D hypergraph visualization (nodes for atoms, lines/connections for relations).
*   Dynamic updates to visualization based on backend state.
*   Display of current step number, atom/relation counts.

## Target Audience
*   **TA1**: Students and enthusiasts interested in learning the basics of the Wolfram Physics model.
*   **TA2**: Researchers or developers looking for a simple, open platform to experiment with basic hypergraph rewriting systems.
*   **TA3**: The development team itself, to validate the core architecture.

## Success Metrics
*   **S1**: Users can successfully initialize a simulation with a predefined setup.
*   **S2**: Users can step through the simulation and observe the hypergraph changing in the visualization.
*   **S3**: Users can run the simulation continuously and see real-time updates (e.g., at least 1-2 updates per second for small graphs).
*   **S4**: The gRPC communication channel reliably transmits state between backend and frontend.
*   **S5**: The foundational codebase is understandable and provides a clear path for future feature additions.

## Future Expansion
*   User-defined rules (textual or graphical input).
*   Loading/saving simulation configurations.
*   More sophisticated visualization (3D, causal graphs).
*   Performance optimizations.
*   Exploration of multiway systems.
*   Exporting simulation data and visualizations.

## Constraints
*   MVP scope is limited to core functionality (no user-defined rules, advanced viz, etc. as per PRD Non-Goals).
*   Focus on desktop browser as primary target.
*   Initial performance will be for small graphs.
*   Limited set of hardcoded rules for MVP.