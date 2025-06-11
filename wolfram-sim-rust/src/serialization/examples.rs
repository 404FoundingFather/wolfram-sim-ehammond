use crate::hypergraph::{Atom, Relation, AtomId, RelationId};
use crate::simulation::HypergraphState;

/// Predefined hypergraph examples for testing and demonstration.
pub struct PredefinedExamples;

impl PredefinedExamples {
    /// Returns a list of all available predefined examples.
    pub fn list_examples() -> Vec<&'static str> {
        vec![
            "empty_graph",
            "single_edge",
            "triangle",
            "small_path",
            "small_cycle",
        ]
    }
    
    /// Gets a predefined example by name.
    pub fn get_example(name: &str) -> Option<HypergraphState> {
        match name {
            "empty_graph" => Some(Self::empty_graph()),
            "single_edge" => Some(Self::single_edge()),
            "triangle" => Some(Self::triangle()),
            "small_path" => Some(Self::small_path()),
            "small_cycle" => Some(Self::small_cycle()),
            _ => None,
        }
    }
    
    /// Creates an empty hypergraph (no atoms or relations).
    /// Useful for starting simulations from scratch.
    pub fn empty_graph() -> HypergraphState {
        HypergraphState::new(
            vec![], // No atoms
            vec![], // No relations
            0,      // Step 0
            0,      // Next atom ID starts at 0
            0,      // Next relation ID starts at 0
        )
    }
    
    /// Creates a hypergraph with a single edge connecting two atoms: A -- B
    /// This is the classic starting point for edge splitting demonstrations.
    pub fn single_edge() -> HypergraphState {
        let atoms = vec![
            Atom::new(AtomId::new(0)),
            Atom::new(AtomId::new(1)),
        ];
        
        let relations = vec![
            Relation::new(RelationId::new(0), vec![AtomId::new(0), AtomId::new(1)]),
        ];
        
        HypergraphState::new(
            atoms,
            relations,
            0,  // Step 0
            2,  // Next atom ID
            1,  // Next relation ID
        )
    }
    
    /// Creates a triangular hypergraph: A -- B -- C -- A
    /// This demonstrates a simple cyclic structure.
    pub fn triangle() -> HypergraphState {
        let atoms = vec![
            Atom::new(AtomId::new(0)),
            Atom::new(AtomId::new(1)),
            Atom::new(AtomId::new(2)),
        ];
        
        let relations = vec![
            Relation::new(RelationId::new(0), vec![AtomId::new(0), AtomId::new(1)]), // A -- B
            Relation::new(RelationId::new(1), vec![AtomId::new(1), AtomId::new(2)]), // B -- C
            Relation::new(RelationId::new(2), vec![AtomId::new(2), AtomId::new(0)]), // C -- A
        ];
        
        HypergraphState::new(
            atoms,
            relations,
            0,  // Step 0
            3,  // Next atom ID
            3,  // Next relation ID
        )
    }
    
    /// Creates a simple path: A -- B -- C -- D
    /// Demonstrates a linear structure that will branch out when rules are applied.
    pub fn small_path() -> HypergraphState {
        let atoms = vec![
            Atom::new(AtomId::new(0)),
            Atom::new(AtomId::new(1)),
            Atom::new(AtomId::new(2)),
            Atom::new(AtomId::new(3)),
        ];
        
        let relations = vec![
            Relation::new(RelationId::new(0), vec![AtomId::new(0), AtomId::new(1)]), // A -- B
            Relation::new(RelationId::new(1), vec![AtomId::new(1), AtomId::new(2)]), // B -- C
            Relation::new(RelationId::new(2), vec![AtomId::new(2), AtomId::new(3)]), // C -- D
        ];
        
        HypergraphState::new(
            atoms,
            relations,
            0,  // Step 0
            4,  // Next atom ID
            3,  // Next relation ID
        )
    }
    
    /// Creates a cycle with 4 vertices: A -- B -- C -- D -- A
    /// More complex cyclic structure for testing.
    pub fn small_cycle() -> HypergraphState {
        let atoms = vec![
            Atom::new(AtomId::new(0)),
            Atom::new(AtomId::new(1)),
            Atom::new(AtomId::new(2)),
            Atom::new(AtomId::new(3)),
        ];
        
        let relations = vec![
            Relation::new(RelationId::new(0), vec![AtomId::new(0), AtomId::new(1)]), // A -- B
            Relation::new(RelationId::new(1), vec![AtomId::new(1), AtomId::new(2)]), // B -- C
            Relation::new(RelationId::new(2), vec![AtomId::new(2), AtomId::new(3)]), // C -- D
            Relation::new(RelationId::new(3), vec![AtomId::new(3), AtomId::new(0)]), // D -- A
        ];
        
        HypergraphState::new(
            atoms,
            relations,
            0,  // Step 0
            4,  // Next atom ID
            4,  // Next relation ID
        )
    }
    
    /// Gets a description of a predefined example.
    pub fn get_description(name: &str) -> Option<&'static str> {
        match name {
            "empty_graph" => Some("An empty hypergraph with no atoms or relations. Good starting point for custom simulations."),
            "single_edge" => Some("A simple edge connecting two atoms (A--B). Classic starting point for edge splitting."),
            "triangle" => Some("Three atoms connected in a triangle (A--B--C--A). Demonstrates a basic cycle."),
            "small_path" => Some("Four atoms connected in a linear path (A--B--C--D). Good for studying linear evolution."),
            "small_cycle" => Some("Four atoms connected in a cycle (A--B--C--D--A). More complex cyclic structure."),
            _ => None,
        }
    }
    
    /// Validates that all predefined examples are properly formed.
    /// This is useful for testing to ensure our examples are valid.
    pub fn validate_all_examples() -> Result<(), String> {
        for example_name in Self::list_examples() {
            let state = Self::get_example(example_name)
                .ok_or_else(|| format!("Example '{}' not found", example_name))?;
            
            // Basic validation: check that all relation atoms exist
            let atom_ids: std::collections::HashSet<_> = state.atoms().iter().map(|a| a.id()).collect();
            
            for relation in state.relations() {
                for atom_id in relation.atoms() {
                    if !atom_ids.contains(atom_id) {
                        return Err(format!(
                            "Example '{}': Relation {} references non-existent atom {}",
                            example_name,
                            relation.id().value(),
                            atom_id.value()
                        ));
                    }
                }
            }
            
            // Check ID consistency
            if let Some(max_atom_id) = state.atoms().iter().map(|a| a.id().value()).max() {
                if state.next_atom_id() <= max_atom_id {
                    return Err(format!(
                        "Example '{}': next_atom_id ({}) should be greater than max atom ID ({})",
                        example_name, state.next_atom_id(), max_atom_id
                    ));
                }
            }
            
            if let Some(max_relation_id) = state.relations().iter().map(|r| r.id().value()).max() {
                if state.next_relation_id() <= max_relation_id {
                    return Err(format!(
                        "Example '{}': next_relation_id ({}) should be greater than max relation ID ({})",
                        example_name, state.next_relation_id(), max_relation_id
                    ));
                }
            }
        }
        
        Ok(())
    }
}

/// Helper struct for detailed example information.
pub struct ExampleInfo {
    pub name: &'static str,
    pub description: &'static str,
    pub atom_count: usize,
    pub relation_count: usize,
}

impl PredefinedExamples {
    /// Gets detailed information about all examples.
    pub fn get_all_example_info() -> Vec<ExampleInfo> {
        Self::list_examples()
            .into_iter()
            .map(|name| {
                let state = Self::get_example(name).unwrap();
                ExampleInfo {
                    name,
                    description: Self::get_description(name).unwrap_or("No description available"),
                    atom_count: state.atoms().len(),
                    relation_count: state.relations().len(),
                }
            })
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_all_examples_exist() {
        for example_name in PredefinedExamples::list_examples() {
            let state = PredefinedExamples::get_example(example_name);
            assert!(state.is_some(), "Example '{}' should exist", example_name);
        }
    }
    
    #[test]
    fn test_all_examples_are_valid() {
        let result = PredefinedExamples::validate_all_examples();
        assert!(result.is_ok(), "All examples should be valid: {:?}", result.err());
    }
    
    #[test]
    fn test_empty_graph() {
        let state = PredefinedExamples::empty_graph();
        assert_eq!(state.atoms().len(), 0);
        assert_eq!(state.relations().len(), 0);
        assert_eq!(state.step_number(), 0);
        assert_eq!(state.next_atom_id(), 0);
        assert_eq!(state.next_relation_id(), 0);
    }
    
    #[test]
    fn test_single_edge() {
        let state = PredefinedExamples::single_edge();
        assert_eq!(state.atoms().len(), 2);
        assert_eq!(state.relations().len(), 1);
        assert_eq!(state.step_number(), 0);
        assert_eq!(state.next_atom_id(), 2);
        assert_eq!(state.next_relation_id(), 1);
        
        // Verify the edge connects the two atoms
        let relation = &state.relations()[0];
        assert_eq!(relation.atoms().len(), 2);
    }
    
    #[test]
    fn test_triangle() {
        let state = PredefinedExamples::triangle();
        assert_eq!(state.atoms().len(), 3);
        assert_eq!(state.relations().len(), 3);
        
        // Each atom should be part of exactly 2 relations (forming a triangle)
        for atom in state.atoms() {
            let connections = state.relations()
                .iter()
                .filter(|r| r.contains_atom(atom.id()))
                .count();
            assert_eq!(connections, 2, "Each atom in triangle should have exactly 2 connections");
        }
    }
    
    #[test]
    fn test_small_path() {
        let state = PredefinedExamples::small_path();
        assert_eq!(state.atoms().len(), 4);
        assert_eq!(state.relations().len(), 3);
        
        // First and last atoms should have 1 connection, middle atoms should have 2
        let atoms: Vec<_> = state.atoms().iter().collect();
        let connections_0 = state.relations().iter().filter(|r| r.contains_atom(atoms[0].id())).count();
        let connections_1 = state.relations().iter().filter(|r| r.contains_atom(atoms[1].id())).count();
        let connections_2 = state.relations().iter().filter(|r| r.contains_atom(atoms[2].id())).count();
        let connections_3 = state.relations().iter().filter(|r| r.contains_atom(atoms[3].id())).count();
        
        // In a path A--B--C--D, A and D have 1 connection, B and C have 2
        assert_eq!(connections_0, 1, "First atom should have 1 connection");
        assert_eq!(connections_1, 2, "Second atom should have 2 connections");
        assert_eq!(connections_2, 2, "Third atom should have 2 connections");
        assert_eq!(connections_3, 1, "Last atom should have 1 connection");
    }
    
    #[test]
    fn test_small_cycle() {
        let state = PredefinedExamples::small_cycle();
        assert_eq!(state.atoms().len(), 4);
        assert_eq!(state.relations().len(), 4);
        
        // In a cycle, each atom should have exactly 2 connections
        for atom in state.atoms() {
            let connections = state.relations()
                .iter()
                .filter(|r| r.contains_atom(atom.id()))
                .count();
            assert_eq!(connections, 2, "Each atom in cycle should have exactly 2 connections");
        }
    }
    
    #[test]
    fn test_all_examples_have_descriptions() {
        for example_name in PredefinedExamples::list_examples() {
            let description = PredefinedExamples::get_description(example_name);
            assert!(description.is_some(), "Example '{}' should have a description", example_name);
            assert!(!description.unwrap().is_empty(), "Example '{}' description should not be empty", example_name);
        }
    }
    
    #[test]
    fn test_get_all_example_info() {
        let info = PredefinedExamples::get_all_example_info();
        assert_eq!(info.len(), PredefinedExamples::list_examples().len());
        
        for item in &info {
            assert!(!item.name.is_empty());
            assert!(!item.description.is_empty());
            // Atom and relation counts should be reasonable
            assert!(item.atom_count <= 10, "Example atom count should be reasonable");
            assert!(item.relation_count <= 10, "Example relation count should be reasonable");
        }
    }
    
    #[test]
    fn test_nonexistent_example() {
        let state = PredefinedExamples::get_example("nonexistent");
        assert!(state.is_none(), "Nonexistent example should return None");
        
        let description = PredefinedExamples::get_description("nonexistent");
        assert!(description.is_none(), "Nonexistent example description should return None");
    }
} 