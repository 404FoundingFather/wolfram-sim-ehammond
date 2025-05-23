# Technical Context

**Last Updated:** May 14, 2025

This document outlines the technical stack, dependencies, and development environment for the project.

## Technology Stack

### Frontend
*   React (with Vite) as the TypeScript SPA Framework.
*   gRPC-Web: For communication with the backend.
*   2D Graph Visualization Library (e.g., Vis.js, Sigma.js, react-force-graph, or custom SVG/Canvas)

### Backend
*   Rust: Core language for the simulation engine.
*   Tonic: Rust gRPC library.
*   Tonic-web: For gRPC-Web compatibility.
*   Protocol Buffers: For defining gRPC messages.
*   Serde: For serialization and deserialization of Rust data structures (e.g., for state saving).

### Database
*   N/A for MVP (State managed in memory by the Rust engine).

### Infrastructure
*   Standard web hosting for the frontend SPA.
*   Deployment mechanism for the Rust backend (e.g., Docker container, simple binary deployment).
*   (CI/CD to be determined)

## Development Environment

### Requirements
*   Rust (latest stable version)
*   Node.js & npm/yarn (for frontend development using Vite)
*   Protocol Buffer Compiler (`protoc`)
*   Cargo (Rust package manager)

### Setup Instructions
1.  Install Rust: `curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2.  Install Node.js and a package manager (npm or yarn).
3.  Install `protoc` and the necessary gRPC plugins for Rust and Web.
4.  Clone the repository.
5.  For frontend, create a Vite project: `npm create vite@latest my-react-app -- --template react-ts` (or `yarn create vite my-react-app --template react-ts`)
6.  Run `cargo build` for the backend.
7.  Run `npm install` (or `yarn install`) for the frontend.

### Running Locally
*   Backend: `cargo run` (from the backend directory)
*   Frontend: `npm run dev` (or `yarn dev`) (from the frontend directory)

### Testing
*   Backend: `cargo test`
*   Frontend: Vitest (recommended with Vite), or Jest.

## External Dependencies

### APIs
*   N/A for MVP.

### Third-Party Services
*   N/A for MVP.

## Configuration

### Environment Variables
*   (Likely for backend port, frontend API endpoint if not default)

### Config Files
*   `.proto` file for gRPC service and message definitions.
*   `Cargo.toml` for Rust backend dependencies.
*   `package.json` for frontend dependencies.
*   `vite.config.ts` (or `vite.config.js`) for Vite configuration.

## Resource Links

### Documentation
* [Link to official documentation]
* [Link to additional resources]

### Code Repositories
* [Main Repository] - [Link]
* [Related Repositories] - [Link]

## Architecture Diagram
```
[Insert a simple ASCII diagram or placeholder for an architecture diagram]
```

## Technical Decisions
*   Rust for the backend simulation engine due to performance and safety.
*   gRPC with gRPC-Web for efficient and typed communication between frontend and backend.
*   TypeScript for the frontend for type safety and better maintainability.
*   A mainstream SPA framework will be chosen for the frontend to leverage existing ecosystems.
*   Initial hypergraph and rules will be hardcoded for MVP simplicity.

> Note: More detailed technical decisions are documented in 12-decisions.md