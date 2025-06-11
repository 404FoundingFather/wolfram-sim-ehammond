# Environment Documentation

**Last Updated:** May 14, 2025

This document provides detailed information about the development environment for the Wolfram Physics Simulator MVP. Staging and Production environments are not applicable for the MVP.

## Local Development Environment

### Prerequisites

-   **Rust and Cargo:** Required for the backend simulation engine.
    -   Install via `rustup`: `curl --proto '=https'` --tlsv1.2 -sSf https://sh.rustup.rs | sh`
    -   Verify with `rustc --version` and `cargo --version`.
-   **Node.js and npm:** Required for the frontend web application.
    -   Download from [https://nodejs.org/](https://nodejs.org/) or use a version manager like `nvm`.
    -   Verify with `node --version` and `npm --version`.
-   **Protocol Buffer Compiler (`protoc`):** Required for generating code from `.proto` files.
    -   macOS (via Homebrew): `brew install protobuf`
    -   Verify with `protoc --version`.
-   **gRPC-Web Code Generator Plugins for `protoc`:** **CRITICAL FOR FRONTEND BUILD**
    -   `protoc-gen-grpc-web`: Generates gRPC-Web client stubs.
        -   macOS (via Homebrew): `brew install protoc-gen-grpc-web`
        -   This Homebrew formula also installs `protoc-gen-js` as a dependency, which is used by `protoc` for the `--js_out` flag.
        -   **Note**: Without these plugins, you'll get errors like "protoc-gen-js: program not found" or import errors like "does not provide an export named 'Atom'"
    -   `ts-protoc-gen`: An npm package used as a `protoc` plugin to generate TypeScript definitions (`.d.ts`) for messages and service clients.
        -   Installed as a dev dependency in the frontend project: `npm install --save-dev ts-protoc-gen`
    -   **Alternative installation**: If Homebrew fails, install globally via npm: `npm install -g protoc-gen-js`
-   **Rust gRPC Build Tooling:**
    -   `tonic-build`: A Cargo build dependency used in `build.rs` to compile `.proto` files for the Rust backend. Added to `wolfram-sim-rust/Cargo.toml`.

### Project Structure

The project is organized as follows in the `wolfram-sim-ehammond` workspace root:

```
wolfram-sim-ehammond/
├── proto/                          # Protocol Buffer definitions (.proto files)
│   └── wolfram_physics.proto
├── wolfram-sim-rust/              # Rust backend (single crate)
│   ├── src/
│   │   ├── main.rs                # gRPC server entry point
│   │   ├── lib.rs                 # Library exports
│   │   ├── hypergraph/            # Core data structures
│   │   ├── rules/                 # Rule engine
│   │   ├── matching/              # Pattern matching
│   │   ├── evolution/             # Hypergraph rewriting
│   │   ├── simulation/            # Simulation management
│   │   └── serialization/         # State persistence
│   ├── Cargo.toml
│   └── examples/                  # Demo applications
├── wolfram-sim-frontend/          # TypeScript React SPA (gRPC client, visualization)
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── generated/proto/       # Auto-generated client-side gRPC code
│       ├── components/            # React components
│       ├── services/             # API client
│       └── store/                # State management
├── memory-bank/                   # Project documentation
├── docs/                         # Technical documentation
└── README.md                     # Project overview and setup
```

### Setup Instructions

#### 1. Clone the Repository (if not already done):
   ```bash
   # git clone [repository-url] wolfram-sim
   cd wolfram-sim
   ```

#### 2. Install System-Wide Prerequisites (if not already done):
   - Rust & Cargo (see above)
   - Node.js & npm (see above)
   - `protoc`: `brew install protobuf`
   - `protoc-gen-grpc-web` (and `protoc-gen-js`): `brew install protoc-gen-grpc-web`

#### 3. Backend (Rust - `backend/`) Setup:
   - Navigate to the relevant backend directory. For building/testing the library: `cd backend/wolfram_engine_core`. For building, testing, and running the server: `cd backend/grpc_server`.
     ```bash
     # Example for server operations (assuming you are in project root):
     cd backend/grpc_server
     ```
   - Dependencies (`tonic`, `prost`, `tokio`, `tokio-stream`, `tonic-build` for `grpc_server`; `serde` for `wolfram_engine_core`) are listed in respective `Cargo.toml` files.
   - The `grpc_server`'s `build.rs` file is configured to compile `../../proto/wolfram_physics.proto`.
   - Build the project(s). For example, to build the server (from within `backend/grpc_server`):
     ```bash
     cargo build
     ```
   - To run the backend server (from within `backend/grpc_server`, which typically listens on `[::1]:50051` as per its `main.rs`):
     ```bash
     cargo run
     ```
   - To run tests for a specific crate (e.g., from within `backend/wolfram_engine_core` or `backend/grpc_server`):
     ```bash
     cargo test
     ```
   - Navigate back to the project root for the next steps if needed (e.g., `cd ../..` if in `backend/grpc_server`).

#### 4. Frontend (TypeScript React SPA - `