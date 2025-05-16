use std::fmt;
use serde::{Serialize, Deserialize};

/// Represents a unique identifier for an atom in a hypergraph.
/// For the MVP, we'll use u64 as the underlying type for simplicity and performance.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct AtomId(pub u64);

impl AtomId {
    /// Creates a new AtomId with the specified ID value.
    pub fn new(id: u64) -> Self {
        AtomId(id)
    }

    /// Returns the inner value of the AtomId.
    pub fn value(&self) -> u64 {
        self.0
    }
}

impl fmt::Display for AtomId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Atom({})", self.0)
    }
}

/// Represents an atom in a hypergraph with its unique ID and optional metadata.
/// Atoms are the fundamental nodes in the Wolfram Physics Model.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Atom {
    /// The unique identifier for this atom
    pub id: AtomId,
    
    /// Optional metadata or additional information about the atom
    /// For MVP, this is a simple string, but could be extended in the future
    pub metadata: Option<String>,
}

impl Atom {
    /// Creates a new Atom with the specified ID and no metadata.
    pub fn new(id: AtomId) -> Self {
        Atom {
            id,
            metadata: None,
        }
    }

    /// Creates a new Atom with the specified ID and metadata.
    pub fn with_metadata(id: AtomId, metadata: String) -> Self {
        Atom {
            id,
            metadata: Some(metadata),
        }
    }

    /// Returns the ID of this atom.
    pub fn id(&self) -> AtomId {
        self.id
    }

    /// Returns a reference to the metadata of this atom, if any.
    pub fn metadata(&self) -> Option<&str> {
        self.metadata.as_deref()
    }

    /// Sets the metadata for this atom.
    pub fn set_metadata(&mut self, metadata: Option<String>) {
        self.metadata = metadata;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_atom_id_creation() {
        let id = AtomId::new(42);
        assert_eq!(id.value(), 42);
    }

    #[test]
    fn test_atom_creation() {
        let atom_id = AtomId::new(1);
        let atom = Atom::new(atom_id);
        assert_eq!(atom.id(), atom_id);
        assert_eq!(atom.metadata(), None);
    }

    #[test]
    fn test_atom_with_metadata() {
        let atom_id = AtomId::new(2);
        let metadata = "Symbol[\"A\"]".to_string();
        let atom = Atom::with_metadata(atom_id, metadata.clone());
        assert_eq!(atom.id(), atom_id);
        assert_eq!(atom.metadata(), Some(metadata.as_str()));
    }

    #[test]
    fn test_set_metadata() {
        let atom_id = AtomId::new(3);
        let mut atom = Atom::new(atom_id);
        assert_eq!(atom.metadata(), None);
        
        atom.set_metadata(Some("Symbol[\"B\"]".to_string()));
        assert_eq!(atom.metadata(), Some("Symbol[\"B\"]"));
        
        atom.set_metadata(None);
        assert_eq!(atom.metadata(), None);
    }
} 