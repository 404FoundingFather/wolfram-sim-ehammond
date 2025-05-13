# Environment Documentation

**Last Updated:** May 13, 2025

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
-   **gRPC-Web Code Generator Plugins for `protoc`:**
    -   `protoc-gen-grpc-web`: Generates gRPC-Web client stubs.
        -   macOS (via Homebrew): `brew install protoc-gen-grpc-web`
        -   This Homebrew formula also installs `protoc-gen-js` as a dependency, which is used by `protoc` for the `--js_out` flag.
    -   `ts-protoc-gen`: An npm package used as a `protoc` plugin to generate TypeScript definitions (`.d.ts`) for messages and service clients.
        -   Installed as a dev dependency in the frontend project: `npm install --save-dev ts-protoc-gen`
-   **Rust gRPC Build Tooling:**
    -   `tonic-build`: A Cargo build dependency used in `build.rs` to compile `.proto` files for the Rust backend. Added to `wolfram-sim-rust/Cargo.toml`.

### Project Structure

The project is organized as follows in the `wolfram-sim` workspace root:

```
wolfram-sim/
├── proto/                      # Protocol Buffer definitions (.proto files)
│   └── wolfram_physics.proto
├── backend/                    # Contains all backend Rust code
│   ├── wolfram_engine_core/    # Core simulation library crate
│   │   ├── src/                # Library source (lib.rs, modules like hypergraph/, rules/, etc.)
│   │   └── Cargo.toml
│   ├── grpc_server/            # gRPC server binary crate
│   │   ├── src/                # Binary source (main.rs, server.rs)
│   │   └── Cargo.toml
│   └── proto/                  # Optional: build-time copy/link of .proto files for tonic-build
├── wolfram-sim-frontend/       # TypeScript React SPA (gRPC client, visualization)
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── generated/proto/    # Auto-generated client-side gRPC code
│       └── ...                 # React components, etc.
└── ...                         # Other project files (docs, memory-bank, etc.)
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
   - Navigate to the backend directory (e.g., `backend/grpc_server` for the server binary, or `backend/wolfram_engine_core` for the library).
     ```bash
     cd backend/grpc_server # Or wolfram_engine_core
     ```
   - Dependencies (`tonic`, `prost`, `tokio`, `tokio-stream`, `tonic-build` for `grpc_server`, `serde` for `wolfram_engine_core`) are listed in respective `Cargo.toml` files.
   - The `grpc_server`'s `build.rs` file (if used, or directly in `tonic::transport::Server::builder()`) is configured to compile `../../proto/wolfram_physics.proto`.
   - Build the project(s). For example, to build the server:
     ```bash
     cd backend/grpc_server
     cargo build
     ```
   - To run the backend server (from `backend/grpc_server`, listens on `[::1]:50051` by default as per `main.rs`):
     ```bash
     cargo run
     ```
   - Navigate back to the project root for the next steps if needed: `cd ../..`

#### 4. Frontend (TypeScript React SPA - `wolfram-sim-frontend`) Setup:
   - Navigate to the frontend directory:
     ```bash
     cd wolfram-sim-frontend
     ```
   - Install npm dependencies (including `google-protobuf`, `grpc-web`, and `ts-protoc-gen`):
     ```bash
     npm install
     ```
   - **Generate gRPC Client Code:**
     - The `package.json` file contains a script `generate-proto`:
       ```json
       "generate-proto": "protoc -I=../proto ../proto/wolfram_physics.proto --js_out=import_style=es6,binary:src/generated/proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/generated/proto --plugin=protoc-gen-ts=./node_modules/ts-protoc-gen/bin/protoc-gen-ts --ts_out=service=grpc-web:src/generated/proto"
       ```
     - Run the script to generate JavaScript and TypeScript definition files into `src/generated/proto/` (ensure path to `../proto` is correct from `wolfram-sim-frontend` directory):
       ```bash
       npm run generate-proto
       ```
   - To run the frontend development server (Vite):
     ```bash
     npm run dev
     ```
   - Navigate back to the project root if needed: `cd ..`

### Troubleshooting Protobuf/gRPC Code Generation (Frontend)

During setup, several issues were encountered and resolved for frontend code generation:

1.  **Error:** `protoc-gen-js: program not found or is not executable`
    *   **Cause:** The `protoc-gen-js` plugin, needed by `protoc` for the `--js_out` flag, was not in the system `PATH` or not installed.
    *   **Resolution:** Installing `protoc-gen-grpc-web` via Homebrew (`brew install protoc-gen-grpc-web`) also installs `protoc-gen-js` as a dependency and places them in the `PATH`.

2.  **Error:** `--js_out: Unknown import style typescript, expected one of: closure, commonjs, browser, es6.`
    *   **Cause:** The `protoc-gen-js` plugin does not support `import_style=typescript` for the `--js_out` flag.
    *   **Resolution:** Changed to `import_style=es6` in the `generate-proto` script: `--js_out=import_style=es6,binary:src/generated/proto`.

3.  **Error:** `./node_modules/.bin/ts-protoc-gen: program not found or is not executable`
    *   **Cause:** The npm symlink for `ts-protoc-gen` in `./node_modules/.bin/` was not being created or found reliably.
    *   **Resolution:** Modified the `generate-proto` script to point directly to the plugin's executable within its package directory: `--plugin=protoc-gen-ts=./node_modules/ts-protoc-gen/bin/protoc-gen-ts`.

4.  **Error:** `wolfram_physics_pb.d.ts: Tried to write the same file twice.`
    *   **Cause:** Both `--grpc-web_out=import_style=typescript,...` and `--ts_out=service=grpc-web,...` (using `ts-protoc-gen`) were attempting to generate TypeScript definition files for messages, leading to a conflict.
    *   **Resolution:** Changed the `import_style` for the `--grpc-web_out` flag from `typescript` to `commonjs` (`--grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/generated/proto`). This makes `--grpc-web_out` focus on generating JS client stubs, while `--ts_out` handles all `.d.ts` generation.

### Configuration
-   **Backend Port:** The Rust gRPC server in `backend/grpc_server/src/main.rs` is hardcoded to listen on `[::1]:50051`.
-   **Frontend API Target:** The frontend will need to connect to the gRPC-Web endpoint. If using `tonic-web` in the Rust backend for direct gRPC-Web support, this would be `http://localhost:50051` (assuming CORS is handled). If a separate proxy like Envoy is used, it might be `http://localhost:8080`.
    -   **CORS & gRPC-Web Proxy:** `tonic-web` aims to provide gRPC-Web compatibility directly from the Tonic server. This should be configured and tested. If direct gRPC-Web serving faces challenges (e.g., complex CORS scenarios), a dedicated proxy (like Envoy) might be reconsidered. For MVP development, aim for direct serving with `tonic-web` if feasible.

### Development Tools
-   **Code Editor:** VS Code highly recommended.
    -   **Rust Extensions:** `rust-analyzer`.
    -   **TypeScript/Frontend Extensions:** `ESLint`, `Prettier`, `Volar` (for Vue, if chosen) or official React/Svelte extensions.
-   **Debugging Tools:**
    -   Rust: `lldb` or `gdb` via `rust-gdb` or editor integrations.
    -   Frontend: Browser Developer Tools (debugger, console, network inspector).
-   **Local Testing:**
    -   Backend: `cargo test` (from `backend/wolfram_engine_core` and `backend/grpc_server` directories respectively).
    -   Frontend: `npm run test` (from `wolfram-sim-frontend` directory, using Vitest, which comes with Vite by default).

## Staging Environment
N/A for MVP.

## Production Environment
N/A for MVP.

## Environment Variables
(To be defined as needed. Examples:)
| Variable Name        | Development Value Example  | Description                                     |
|----------------------|----------------------------|-------------------------------------------------|
| `RUST_LOG`           | `info,my_crate=debug`      | Controls Rust backend logging level and scope.    |
| `BACKEND_GRPC_PORT`  | `50051`                    | Port for the Rust gRPC backend.                 |
| `FRONTEND_API_URL`   | `http://localhost:50051`   | Full URL for the gRPC-Web endpoint from frontend. |