# Database & Data Persistence Documentation

**Last Updated:** May 13, 2025

This document outlines data storage, relationships, and data management for the Wolfram Physics Simulator MVP.

## Data Persistence Approach (MVP)

**Primary Database:** None for MVP.

For the Minimum Viable Product (MVP), the Wolfram Physics Simulator does **not** use a traditional persistent database. The simulation state, including the hypergraph (atoms and relations), is managed entirely **in-memory** by the Rust backend process.

However, **State Serialization (F1.6)** is implemented to allow saving the current simulation state to a file and loading it back into memory. This provides a form of persistence for individual simulation instances.
*   **Mechanism:** Utilizes the `serde` library in Rust.
*   **Format (MVP):** JSON (for human readability and ease of debugging).
*   **Future:** Binary formats (e.g., `bincode`) may be considered for performance.

## Data Models (In-Memory & Serialized Representation)

The core data entities are represented in memory and serialized as follows:

### Atom / AtomId

**Description:** Represents a fundamental node in the hypergraph. Atoms are typically referenced by a unique `AtomId`.
**Fields (in Rust struct, conceptual):**
| Field Name | Type (Rust)    | Constraints            | Description |
|------------|----------------|------------------------|-------------|
| `id`       | `AtomId` (e.g., `u64`, `UUID`) | Unique within a hypergraph instance | Unique identifier for the atom. |
| `metadata` | `Option<String>` | (Optional)             | E.g., for `Symbol["A"]` or other annotations. |

### Relation (Hyperedge)

**Description:** Represents a connection or interaction involving a set of atoms.
**Fields (in Rust struct, conceptual):**
| Field Name | Type (Rust)      | Constraints                                  | Description |
|------------|------------------|----------------------------------------------|-------------|
| `atom_ids` | `Vec<AtomId>` or `BTreeSet<AtomId>` | References `AtomId`s, order may be significant | List/set of Atom IDs participating in this relation. |

### Hypergraph State

**Description:** Represents the complete state of the simulation at a given point, which is the structure that gets serialized.
**Fields (in Rust struct, conceptual / gRPC message / Serialized JSON):
| Field Name    | Type (Rust / gRPC / JSON) | Constraints | Description |
|---------------|---------------------------|-------------|-------------|
| `atoms`       | `Collection<Atom>`        |             | Collection of all atoms (or their metadata if IDs are primary). |
| `relations`   | `Collection<Relation>`    |             | Collection of all relations. |
| `step_number` | `u64` / `int64`           |             | Current evolution step of the simulation. |
| `next_atom_id`| `u64` (if sequential)   |             | Counter for generating new unique AtomIds. |

## Entity Relationship Diagram

N/A for traditional database ERD. The relationships are primarily between the in-memory `Hypergraph` struct holding collections of atoms and relations, where `Relation`s refer to `Atom`s via their `AtomId`s.

## Database Migrations

N/A for MVP. If file formats for serialized state evolve, versioning within the serialized file might be needed.

## Query Patterns

All data access is direct in-memory manipulation in Rust. Queries involve iterating collections or using `HashMap` lookups for specific atoms/relations.

## Data Access Layer

Direct struct/method access within the `wolfram_engine_core::hypergraph` and `wolfram_engine_core::simulation` modules in Rust.

## Future Considerations

-   **Post-MVP Database:** A persistent database (e.g., PostgreSQL, NoSQL) might be introduced for managing multiple named simulations, user accounts, shared rule sets, or extensive simulation histories.
-   **Advanced Serialization:** Exploration of more compact or performant binary serialization formats.

## Backup and Recovery

-   **MVP:** Achieved by users manually saving the simulation state to a file via the serialization feature. Recovery involves loading from such a file.
-   **Post-MVP (with database):** Standard database backup and recovery procedures would apply.

## Security Measures

-   **MVP (File-based):** Standard file system permissions apply to saved state files. No specific in-application database security.
-   General application security applies to the web frontend and backend communication.