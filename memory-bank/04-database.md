# Database & Data Persistence Documentation

**Last Updated:** May 14, 2025

This document outlines data storage, relationships, and data management for the Wolfram Physics Simulator MVP.

## Data Persistence Approach (MVP)

**Primary Database:** None for MVP.

For the Minimum Viable Product (MVP), the Wolfram Physics Simulator does **not** use a traditional persistent database. The simulation state, including the hypergraph (atoms and relations), is managed entirely **in-memory** by the Rust backend process.

**Hypergraph Persistence (F1.7)** is now a core feature for MVP. This involves:
*   **Saving Hypergraphs**: Users can save the current `HypergraphState` to a file.
*   **Loading Hypergraphs**: Users can load a `HypergraphState` from a file, or select from a list of predefined hypergraph examples packaged with the application.
*   **Mechanism**: Utilizes the `serde` library in Rust for serialization/deserialization.
*   **Format (MVP):** JSON (for human readability and ease of debugging during initial development).
*   **Future:** Binary formats (e.g., `bincode`) may be considered for performance and smaller file sizes post-MVP.

This file-based save/load functionality provides the necessary persistence for hypergraphs in the MVP, distinct from temporary state serialization for gRPC transmission (previously F1.6, now F1.6 focuses more on event tracking and state for transmission).

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

N/A for MVP regarding a traditional database. If file formats for serialized hypergraphs evolve, versioning within the serialized file might be needed, or simple backward compatibility strategies if changes are minor.

## Query Patterns

All data access is direct in-memory manipulation in Rust. Queries involve iterating collections or using `HashMap` lookups for specific atoms/relations.

## Data Access Layer

Direct struct/method access within the `wolfram_engine_core::hypergraph` and `wolfram_engine_core::simulation` modules in Rust.

## Future Considerations

-   **Post-MVP Database:** A persistent database (e.g., PostgreSQL, NoSQL) might be introduced for managing multiple named simulations, user accounts, shared rule sets, or extensive simulation histories.
-   **Advanced Serialization:** Exploration of more compact or performant binary serialization formats.

## Backup and Recovery

-   **MVP:** Achieved by users manually saving the hypergraph state to a file via the "Save Hypergraph" feature. Recovery involves loading a hypergraph from such a file using the "Load Hypergraph" feature.
-   **Post-MVP (with database):** Standard database backup and recovery procedures would apply if a database is introduced for managing user data or extensive simulation collections.

## Security Measures

-   **MVP (File-based):** Standard file system permissions apply to saved state files. No specific in-application database security.
-   General application security applies to the web frontend and backend communication.