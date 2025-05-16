pub mod atom;
pub mod relation;
pub mod hypergraph;

// Re-export main types for convenience
pub use atom::{Atom, AtomId};
pub use relation::{Relation, RelationId};
pub use hypergraph::Hypergraph; 