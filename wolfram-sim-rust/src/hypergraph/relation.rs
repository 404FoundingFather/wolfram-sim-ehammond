use std::fmt;
use serde::{Serialize, Deserialize};
use super::atom::AtomId;

/// Represents a unique identifier for a relation in a hypergraph.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct RelationId(pub u64);

impl RelationId {
    /// Creates a new RelationId with the specified ID value.
    pub fn new(id: u64) -> Self {
        RelationId(id)
    }

    /// Returns the inner value of the RelationId.
    pub fn value(&self) -> u64 {
        self.0
    }
}

impl fmt::Display for RelationId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Relation({})", self.0)
    }
}

/// Represents a relation (hyperedge) in a hypergraph.
/// In the Wolfram Physics Model, relations connect multiple atoms and their order is significant.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Relation {
    /// The unique identifier for this relation
    pub id: RelationId,
    
    /// The ordered collection of atom IDs that are part of this relation
    pub atoms: Vec<AtomId>,
    
    /// Optional metadata or additional information about the relation
    pub metadata: Option<String>,
}

impl Relation {
    /// Creates a new Relation with the specified ID and atoms.
    pub fn new(id: RelationId, atoms: Vec<AtomId>) -> Self {
        Relation {
            id,
            atoms,
            metadata: None,
        }
    }

    /// Creates a new Relation with the specified ID, atoms, and metadata.
    pub fn with_metadata(id: RelationId, atoms: Vec<AtomId>, metadata: String) -> Self {
        Relation {
            id,
            atoms,
            metadata: Some(metadata),
        }
    }

    /// Returns the ID of this relation.
    pub fn id(&self) -> RelationId {
        self.id
    }

    /// Returns a reference to the atoms in this relation.
    pub fn atoms(&self) -> &[AtomId] {
        &self.atoms
    }

    /// Returns a mutable reference to the atoms in this relation.
    pub fn atoms_mut(&mut self) -> &mut Vec<AtomId> {
        &mut self.atoms
    }

    /// Returns the number of atoms in this relation.
    pub fn arity(&self) -> usize {
        self.atoms.len()
    }

    /// Checks if this relation contains the specified atom.
    pub fn contains_atom(&self, atom_id: AtomId) -> bool {
        self.atoms.contains(&atom_id)
    }

    /// Returns a reference to the metadata of this relation, if any.
    pub fn metadata(&self) -> Option<&str> {
        self.metadata.as_deref()
    }

    /// Sets the metadata for this relation.
    pub fn set_metadata(&mut self, metadata: Option<String>) {
        self.metadata = metadata;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_relation_id_creation() {
        let id = RelationId::new(42);
        assert_eq!(id.value(), 42);
    }
    
    #[test]
    fn test_relation_creation() {
        let relation_id = RelationId::new(1);
        let atoms = vec![AtomId::new(1), AtomId::new(2)];
        let relation = Relation::new(relation_id, atoms.clone());
        
        assert_eq!(relation.id(), relation_id);
        assert_eq!(relation.atoms(), atoms.as_slice());
        assert_eq!(relation.metadata(), None);
    }
    
    #[test]
    fn test_relation_with_metadata() {
        let relation_id = RelationId::new(2);
        let atoms = vec![AtomId::new(3), AtomId::new(4)];
        let metadata = "Edge[\"Type1\"]".to_string();
        let relation = Relation::with_metadata(relation_id, atoms.clone(), metadata.clone());
        
        assert_eq!(relation.id(), relation_id);
        assert_eq!(relation.atoms(), atoms.as_slice());
        assert_eq!(relation.metadata(), Some(metadata.as_str()));
    }
    
    #[test]
    fn test_relation_arity() {
        let relation_id = RelationId::new(3);
        let atoms = vec![AtomId::new(5), AtomId::new(6), AtomId::new(7)];
        let relation = Relation::new(relation_id, atoms);
        
        assert_eq!(relation.arity(), 3);
    }
    
    #[test]
    fn test_relation_contains_atom() {
        let relation_id = RelationId::new(4);
        let atom1 = AtomId::new(8);
        let atom2 = AtomId::new(9);
        let atom3 = AtomId::new(10);
        let atoms = vec![atom1, atom2];
        let relation = Relation::new(relation_id, atoms);
        
        assert!(relation.contains_atom(atom1));
        assert!(relation.contains_atom(atom2));
        assert!(!relation.contains_atom(atom3));
    }
    
    #[test]
    fn test_relation_set_metadata() {
        let relation_id = RelationId::new(5);
        let atoms = vec![AtomId::new(11), AtomId::new(12)];
        let mut relation = Relation::new(relation_id, atoms);
        
        assert_eq!(relation.metadata(), None);
        
        relation.set_metadata(Some("Edge[\"Type2\"]".to_string()));
        assert_eq!(relation.metadata(), Some("Edge[\"Type2\"]"));
        
        relation.set_metadata(None);
        assert_eq!(relation.metadata(), None);
    }
    
    #[test]
    fn test_relation_atoms_mut() {
        let relation_id = RelationId::new(6);
        let mut atoms = vec![AtomId::new(13), AtomId::new(14)];
        let mut relation = Relation::new(relation_id, atoms.clone());
        
        // Initial check
        assert_eq!(relation.atoms(), atoms.as_slice());
        
        // Modify atoms through atoms_mut()
        relation.atoms_mut().push(AtomId::new(15));
        atoms.push(AtomId::new(15));
        
        // Check that the modification worked
        assert_eq!(relation.atoms(), atoms.as_slice());
    }
} 