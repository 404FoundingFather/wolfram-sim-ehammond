use std::collections::{HashMap, HashSet};
use serde::{Serialize, Deserialize};
use super::atom::{Atom, AtomId};
use super::relation::{Relation, RelationId};

/// Represents a hypergraph structure consisting of atoms (vertices) and relations (hyperedges).
/// In the Wolfram Physics Model, this structure evolves over time through the application of rewrite rules.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Hypergraph {
    /// Collection of atoms, indexed by their IDs
    atoms: HashMap<AtomId, Atom>,
    
    /// Collection of relations, indexed by their IDs
    relations: HashMap<RelationId, Relation>,
    
    /// Index mapping each atom to the relations it participates in.
    /// This improves query performance for finding relations containing a specific atom.
    atom_to_relations: HashMap<AtomId, HashSet<RelationId>>,
    
    /// Counter for generating unique atom IDs
    next_atom_id: u64,
    
    /// Counter for generating unique relation IDs
    next_relation_id: u64,
}

impl Hypergraph {
    /// Creates a new, empty hypergraph.
    pub fn new() -> Self {
        Hypergraph {
            atoms: HashMap::new(),
            relations: HashMap::new(),
            atom_to_relations: HashMap::new(),
            next_atom_id: 0,
            next_relation_id: 0,
        }
    }

    /// Creates a new hypergraph with the specified initial capacity for atoms and relations.
    pub fn with_capacity(atom_capacity: usize, relation_capacity: usize) -> Self {
        Hypergraph {
            atoms: HashMap::with_capacity(atom_capacity),
            relations: HashMap::with_capacity(relation_capacity),
            atom_to_relations: HashMap::with_capacity(atom_capacity),
            next_atom_id: 0,
            next_relation_id: 0,
        }
    }
    
    /// Returns the number of atoms in the hypergraph.
    pub fn atom_count(&self) -> usize {
        self.atoms.len()
    }
    
    /// Returns the number of relations in the hypergraph.
    pub fn relation_count(&self) -> usize {
        self.relations.len()
    }
    
    /// Creates a new atom and adds it to the hypergraph.
    /// Returns the ID of the newly created atom.
    pub fn create_atom(&mut self) -> AtomId {
        let id = AtomId::new(self.next_atom_id);
        self.next_atom_id += 1;
        
        let atom = Atom::new(id);
        self.atoms.insert(id, atom);
        self.atom_to_relations.insert(id, HashSet::new());
        
        id
    }
    
    /// Creates a new atom with metadata and adds it to the hypergraph.
    /// Returns the ID of the newly created atom.
    pub fn create_atom_with_metadata(&mut self, metadata: String) -> AtomId {
        let id = AtomId::new(self.next_atom_id);
        self.next_atom_id += 1;
        
        let atom = Atom::with_metadata(id, metadata);
        self.atoms.insert(id, atom);
        self.atom_to_relations.insert(id, HashSet::new());
        
        id
    }
    
    /// Adds an existing atom to the hypergraph.
    /// If an atom with the same ID already exists, it will be replaced.
    /// Returns true if a previous atom was replaced, false otherwise.
    pub fn add_atom(&mut self, atom: Atom) -> bool {
        let id = atom.id();
        let replaced = self.atoms.insert(id, atom).is_some();
        
        if !self.atom_to_relations.contains_key(&id) {
            self.atom_to_relations.insert(id, HashSet::new());
        }
        
        replaced
    }
    
    /// Removes an atom from the hypergraph by its ID.
    /// This will also remove all relations that involve this atom.
    /// Returns the removed atom if it existed.
    pub fn remove_atom(&mut self, atom_id: AtomId) -> Option<Atom> {
        // First, get all relations involving this atom
        if let Some(relation_ids) = self.atom_to_relations.remove(&atom_id) {
            // Clone the set to avoid borrowing issues during iteration
            let relation_ids_vec: Vec<RelationId> = relation_ids.into_iter().collect();
            
            // Remove all relations involving the atom
            for rel_id in relation_ids_vec {
                self.relations.remove(&rel_id);
                
                // Remove this relation ID from all other atoms' relation sets
                if let Some(relation) = self.relations.get(&rel_id) {
                    for other_atom_id in relation.atoms() {
                        if *other_atom_id != atom_id {
                            if let Some(other_rel_set) = self.atom_to_relations.get_mut(other_atom_id) {
                                other_rel_set.remove(&rel_id);
                            }
                        }
                    }
                }
            }
        }
        
        // Finally, remove the atom itself
        self.atoms.remove(&atom_id)
    }
    
    /// Creates a new relation between the specified atoms and adds it to the hypergraph.
    /// Returns the ID of the newly created relation.
    /// 
    /// # Panics
    /// Panics if any of the atom IDs do not exist in the hypergraph.
    pub fn create_relation(&mut self, atom_ids: Vec<AtomId>) -> RelationId {
        // Verify all atoms exist
        for atom_id in &atom_ids {
            assert!(self.atoms.contains_key(atom_id), "Atom {:?} does not exist in the hypergraph", atom_id);
        }
        
        let id = RelationId::new(self.next_relation_id);
        self.next_relation_id += 1;
        
        let relation = Relation::new(id, atom_ids.clone());
        self.relations.insert(id, relation);
        
        // Update the atom_to_relations index
        for atom_id in atom_ids {
            if let Some(rel_set) = self.atom_to_relations.get_mut(&atom_id) {
                rel_set.insert(id);
            }
        }
        
        id
    }
    
    /// Creates a new relation with metadata and adds it to the hypergraph.
    /// Returns the ID of the newly created relation.
    /// 
    /// # Panics
    /// Panics if any of the atom IDs do not exist in the hypergraph.
    pub fn create_relation_with_metadata(&mut self, atom_ids: Vec<AtomId>, metadata: String) -> RelationId {
        // Verify all atoms exist
        for atom_id in &atom_ids {
            assert!(self.atoms.contains_key(atom_id), "Atom {:?} does not exist in the hypergraph", atom_id);
        }
        
        let id = RelationId::new(self.next_relation_id);
        self.next_relation_id += 1;
        
        let relation = Relation::with_metadata(id, atom_ids.clone(), metadata);
        self.relations.insert(id, relation);
        
        // Update the atom_to_relations index
        for atom_id in atom_ids {
            if let Some(rel_set) = self.atom_to_relations.get_mut(&atom_id) {
                rel_set.insert(id);
            }
        }
        
        id
    }
    
    /// Adds an existing relation to the hypergraph.
    /// If a relation with the same ID already exists, it will be replaced.
    /// Returns true if a previous relation was replaced, false otherwise.
    /// 
    /// # Panics
    /// Panics if any of the atoms in the relation do not exist in the hypergraph.
    pub fn add_relation(&mut self, relation: Relation) -> bool {
        // Verify all atoms exist
        for atom_id in relation.atoms() {
            assert!(self.atoms.contains_key(atom_id), "Atom {:?} does not exist in the hypergraph", atom_id);
        }
        
        let id = relation.id();
        let replaced = self.relations.insert(id, relation.clone()).is_some();
        
        // Update the atom_to_relations index
        for atom_id in relation.atoms() {
            if let Some(rel_set) = self.atom_to_relations.get_mut(atom_id) {
                rel_set.insert(id);
            }
        }
        
        replaced
    }
    
    /// Removes a relation from the hypergraph by its ID.
    /// Returns the removed relation if it existed.
    pub fn remove_relation(&mut self, relation_id: RelationId) -> Option<Relation> {
        if let Some(relation) = self.relations.remove(&relation_id) {
            // Remove this relation ID from all atoms' relation sets
            for atom_id in relation.atoms() {
                if let Some(rel_set) = self.atom_to_relations.get_mut(atom_id) {
                    rel_set.remove(&relation_id);
                }
            }
            
            Some(relation)
        } else {
            None
        }
    }
    
    /// Returns a reference to an atom by its ID.
    pub fn get_atom(&self, atom_id: AtomId) -> Option<&Atom> {
        self.atoms.get(&atom_id)
    }
    
    /// Returns a mutable reference to an atom by its ID.
    pub fn get_atom_mut(&mut self, atom_id: AtomId) -> Option<&mut Atom> {
        self.atoms.get_mut(&atom_id)
    }
    
    /// Returns a reference to a relation by its ID.
    pub fn get_relation(&self, relation_id: RelationId) -> Option<&Relation> {
        self.relations.get(&relation_id)
    }
    
    /// Returns a mutable reference to a relation by its ID.
    pub fn get_relation_mut(&mut self, relation_id: RelationId) -> Option<&mut Relation> {
        self.relations.get_mut(&relation_id)
    }
    
    /// Returns an iterator over all atoms in the hypergraph.
    pub fn atoms(&self) -> impl Iterator<Item = &Atom> {
        self.atoms.values()
    }
    
    /// Returns an iterator over all atom IDs in the hypergraph.
    pub fn atom_ids(&self) -> impl Iterator<Item = &AtomId> {
        self.atoms.keys()
    }
    
    /// Returns an iterator over all relations in the hypergraph.
    pub fn relations(&self) -> impl Iterator<Item = &Relation> {
        self.relations.values()
    }
    
    /// Returns an iterator over all relation IDs in the hypergraph.
    pub fn relation_ids(&self) -> impl Iterator<Item = &RelationId> {
        self.relations.keys()
    }
    
    /// Finds all relations that involve the specified atom.
    pub fn find_relations_with_atom(&self, atom_id: AtomId) -> Vec<&Relation> {
        if let Some(relation_ids) = self.atom_to_relations.get(&atom_id) {
            relation_ids
                .iter()
                .filter_map(|rel_id| self.relations.get(rel_id))
                .collect()
        } else {
            Vec::new()
        }
    }
    
    /// Sets the next available atom ID.
    /// This is useful when loading a hypergraph from a file to ensure new atoms
    /// get unique IDs.
    pub fn set_next_atom_id(&mut self, next_id: u64) {
        self.next_atom_id = next_id;
    }
    
    /// Sets the next available relation ID.
    /// This is useful when loading a hypergraph from a file to ensure new relations
    /// get unique IDs.
    pub fn set_next_relation_id(&mut self, next_id: u64) {
        self.next_relation_id = next_id;
    }
    
    /// Checks if the hypergraph contains an atom with the specified ID.
    pub fn contains_atom(&self, atom_id: AtomId) -> bool {
        self.atoms.contains_key(&atom_id)
    }
    
    /// Checks if the hypergraph contains a relation with the specified ID.
    pub fn contains_relation(&self, relation_id: RelationId) -> bool {
        self.relations.contains_key(&relation_id)
    }
    
    /// Clears all atoms and relations from the hypergraph.
    pub fn clear(&mut self) {
        self.atoms.clear();
        self.relations.clear();
        self.atom_to_relations.clear();
        // Note: We don't reset the ID counters to allow for consistent unique IDs
    }
}

impl Default for Hypergraph {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_create_atom() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let atom2_id = hypergraph.create_atom();
        
        assert_eq!(hypergraph.atom_count(), 2);
        assert_ne!(atom1_id, atom2_id);
        assert!(hypergraph.contains_atom(atom1_id));
        assert!(hypergraph.contains_atom(atom2_id));
    }
    
    #[test]
    fn test_create_atom_with_metadata() {
        let mut hypergraph = Hypergraph::new();
        let metadata = "Symbol[\"A\"]".to_string();
        let atom_id = hypergraph.create_atom_with_metadata(metadata.clone());
        
        let atom = hypergraph.get_atom(atom_id).unwrap();
        assert_eq!(atom.metadata(), Some(metadata.as_str()));
    }
    
    #[test]
    fn test_add_atom() {
        let mut hypergraph = Hypergraph::new();
        let atom_id = AtomId::new(42);
        let atom = Atom::new(atom_id);
        
        assert!(!hypergraph.add_atom(atom.clone()));
        assert!(hypergraph.contains_atom(atom_id));
        
        // Replace the atom
        assert!(hypergraph.add_atom(atom));
    }
    
    #[test]
    fn test_remove_atom() {
        let mut hypergraph = Hypergraph::new();
        let atom_id = hypergraph.create_atom();
        
        assert!(hypergraph.contains_atom(atom_id));
        let removed_atom = hypergraph.remove_atom(atom_id).unwrap();
        assert_eq!(removed_atom.id(), atom_id);
        assert!(!hypergraph.contains_atom(atom_id));
    }
    
    #[test]
    fn test_create_relation() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let atom2_id = hypergraph.create_atom();
        
        let relation_id = hypergraph.create_relation(vec![atom1_id, atom2_id]);
        
        assert_eq!(hypergraph.relation_count(), 1);
        assert!(hypergraph.contains_relation(relation_id));
        
        let relation = hypergraph.get_relation(relation_id).unwrap();
        assert_eq!(relation.atoms(), &[atom1_id, atom2_id]);
    }
    
    #[test]
    fn test_create_relation_with_metadata() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let atom2_id = hypergraph.create_atom();
        let metadata = "Edge[\"Type1\"]".to_string();
        
        let relation_id = hypergraph.create_relation_with_metadata(vec![atom1_id, atom2_id], metadata.clone());
        
        let relation = hypergraph.get_relation(relation_id).unwrap();
        assert_eq!(relation.atoms(), &[atom1_id, atom2_id]);
        assert_eq!(relation.metadata(), Some(metadata.as_str()));
    }
    
    #[test]
    fn test_add_relation() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let atom2_id = hypergraph.create_atom();
        
        let relation_id = RelationId::new(42);
        let relation = Relation::new(relation_id, vec![atom1_id, atom2_id]);
        
        assert!(!hypergraph.add_relation(relation.clone()));
        assert!(hypergraph.contains_relation(relation_id));
        
        // Replace the relation
        assert!(hypergraph.add_relation(relation));
    }
    
    #[test]
    fn test_remove_relation() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let atom2_id = hypergraph.create_atom();
        
        let relation_id = hypergraph.create_relation(vec![atom1_id, atom2_id]);
        
        assert!(hypergraph.contains_relation(relation_id));
        let removed_relation = hypergraph.remove_relation(relation_id).unwrap();
        assert_eq!(removed_relation.id(), relation_id);
        assert!(!hypergraph.contains_relation(relation_id));
    }
    
    #[test]
    fn test_find_relations_with_atom() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let atom2_id = hypergraph.create_atom();
        let atom3_id = hypergraph.create_atom();
        
        let relation1_id = hypergraph.create_relation(vec![atom1_id, atom2_id]);
        let relation2_id = hypergraph.create_relation(vec![atom2_id, atom3_id]);
        
        let relations_with_atom1 = hypergraph.find_relations_with_atom(atom1_id);
        assert_eq!(relations_with_atom1.len(), 1);
        assert_eq!(relations_with_atom1[0].id(), relation1_id);
        
        let relations_with_atom2 = hypergraph.find_relations_with_atom(atom2_id);
        assert_eq!(relations_with_atom2.len(), 2);
        assert!(relations_with_atom2.iter().any(|r| r.id() == relation1_id));
        assert!(relations_with_atom2.iter().any(|r| r.id() == relation2_id));
    }
    
    #[test]
    fn test_removing_atom_removes_associated_relations() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let atom2_id = hypergraph.create_atom();
        let atom3_id = hypergraph.create_atom();
        
        let relation1_id = hypergraph.create_relation(vec![atom1_id, atom2_id]);
        let relation2_id = hypergraph.create_relation(vec![atom2_id, atom3_id]);
        
        assert_eq!(hypergraph.relation_count(), 2);
        
        // Remove atom2 - should remove both relations
        hypergraph.remove_atom(atom2_id);
        
        assert_eq!(hypergraph.relation_count(), 0);
        assert!(!hypergraph.contains_relation(relation1_id));
        assert!(!hypergraph.contains_relation(relation2_id));
    }
    
    #[test]
    fn test_clear() {
        let mut hypergraph = Hypergraph::new();
        hypergraph.create_atom();
        hypergraph.create_atom();
        let atom3_id = hypergraph.create_atom();
        
        hypergraph.create_relation(vec![atom3_id]);
        
        assert_eq!(hypergraph.atom_count(), 3);
        assert_eq!(hypergraph.relation_count(), 1);
        
        hypergraph.clear();
        
        assert_eq!(hypergraph.atom_count(), 0);
        assert_eq!(hypergraph.relation_count(), 0);
    }
    
    #[test]
    #[should_panic(expected = "does not exist")]
    fn test_create_relation_with_nonexistent_atom() {
        let mut hypergraph = Hypergraph::new();
        let atom1_id = hypergraph.create_atom();
        let nonexistent_atom_id = AtomId::new(9999);
        
        // This should panic because nonexistent_atom_id doesn't exist in the hypergraph
        hypergraph.create_relation(vec![atom1_id, nonexistent_atom_id]);
    }
} 