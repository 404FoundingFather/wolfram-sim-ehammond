# Wolfram Physics Simulator (MVP)

**Current Status:** MVP In Development (as of May 13, 2025)

## Overview

The Wolfram Physics Simulator is a project aimed at creating a visual, interactive simulator based on the principles of the Wolfram Physics Project. The goal of this Minimum Viable Product (MVP) is to establish a foundational engine for hypergraph rewriting and a web-based interface to control and visualize these simulations.

This project explores the idea that the universe can be modeled as an evolving hypergraph, where simple rewrite rules applied to this structure give rise to complex emergent behavior, potentially resembling the laws of physics.

## Core Technologies

*   **Backend Simulation Engine:**
    *   Language: **Rust**
    *   Core Library: `wolfram_engine_core` (for hypergraph manipulation, rule matching, evolution)
    *   gRPC Server: `grpc_server` (using **Tonic**)
*   **Frontend User Interface:**
    *   Framework: **React** (with Vite)
    *   Language: **TypeScript**
*   **Communication Protocol:**
    *   **gRPC** (with **gRPC-Web** for browser compatibility)
    *   Message Definitions: **Protocol Buffers** (`.proto`)
*   **Data Persistence (MVP):**
    *   In-memory hypergraph state.
    *   State serialization to JSON files using **Serde** for saving/loading.

For a detailed technology stack, see `memory-bank/02-techContext.md`.

## Project Structure

A brief overview of the key directories:

```
wolfram-sim/
├── .gitignore                # Git ignore rules
├── README.md                 # This file
├── backend/                  # All Rust backend code
│   ├── wolfram_engine_core/  # Core simulation library
│   └── grpc_server/          # gRPC server application
├── frontend/                 # React/TypeScript frontend SPA
│   └── wolfram-sim-frontend/ # Frontend project root
├── proto/                    # Protocol Buffer definitions (.proto files)
├── docs/                     # General project documentation (e.g., PRD)
└── memory-bank/              # Detailed project context and plans
    ├── 00-index.md           # Index to all memory bank documents
    └── ...                   # Other planning and context documents
```

For a more detailed project structure and explanation, refer to `memory-bank/03-systemPatterns.md` and `memory-bank/09-environment.md`.

## Getting Started

### Prerequisites

Ensure you have the following installed:
*   Rust and Cargo
*   Node.js and npm (or yarn)
*   Protocol Buffer Compiler (`protoc`)
*   gRPC-Web code generator plugins for `protoc`

For detailed prerequisite versions and installation instructions, please refer to:
*   `memory-bank/09-environment.md`

### Setup & Running the Application

1.  **Clone the repository** (if you haven't already).
2.  **Backend Setup:**
    *   Navigate to `backend/wolfram_engine_core/` and run `cargo build`.
    *   Navigate to `backend/grpc_server/` and run `cargo build`.
    *   To run the backend gRPC server: `cd backend/grpc_server && cargo run`
3.  **Frontend Setup:**
    *   Navigate to `frontend/wolfram-sim-frontend/`.
    *   Install dependencies: `npm install`
    *   Generate gRPC client code: `npm run generate-proto`
    *   To run the frontend development server: `npm run dev`

For complete, step-by-step setup instructions, including troubleshooting for gRPC code generation, please see:
*   `memory-bank/09-environment.md`

The backend server typically runs on `[::1]:50051`, and the frontend Vite development server usually starts on `http://localhost:5173` (or the next available port).

## Memory Bank: The Project's Brain

This project utilizes a `memory-bank/` directory to maintain context, plans, and decisions between development sessions, especially when working with AI assistants.

*   Start with `memory-bank/00-index.md` to navigate its contents.
*   Key documents include:
    *   `01-productVision.md`: The overall goals and vision.
    *   `06-developmentPlan.md`: Detailed tasks and phases for development.
    *   `07-kanban.md`: Current project status.

## Development Plan & Progress

The detailed development plan, including phases, features, and sprints, can be found in `memory-bank/06-developmentPlan.md`.
Current progress is tracked in `memory-bank/07-kanban.md`.

## Contributing

This project is currently in its initial MVP development phase. Contribution guidelines will be established post-MVP. For now, focus is on implementing the core features outlined in the development plan.

## License

The license for this project is yet to be determined. 