//! Core library for the Wolfram Physics Simulator.
//! This library provides the fundamental data structures and algorithms for simulating
//! hypergraph evolution according to the Wolfram Physics Model.

pub mod hypergraph;
pub mod rules;
pub mod matching;
pub mod evolution;
pub mod simulation;
pub mod serialization;

pub use hypergraph::*;
pub use rules::*;
pub use simulation::*;
pub use serialization::*;

// For gRPC service generation
pub mod wolfram_physics_simulator {
    tonic::include_proto!("wolfram_physics_simulator");
}

#[cfg(test)]
mod integration_tests {
    use super::*;
    use crate::matching::find_pattern_matches;
    use crate::evolution::apply_rule;

    #[test]
    fn test_end_to_end_edge_splitting() {
        // Create a simple hypergraph with one edge: A -- B
        let mut hypergraph = Hypergraph::new();
        let atom_a = hypergraph.create_atom();
        let atom_b = hypergraph.create_atom();
        let initial_relation = hypergraph.create_relation(vec![atom_a, atom_b]);
        
        // Verify initial state
        assert_eq!(hypergraph.atom_count(), 2);
        assert_eq!(hypergraph.relation_count(), 1);
        
        // Create the basic edge splitting rule: {{x,y}} -> {{x,z},{z,y}}
        let rule = Rule::create_basic_edge_splitting_rule();
        
        // Find matches - should find exactly one
        let matches = find_pattern_matches(rule.pattern(), &hypergraph);
        assert_eq!(matches.len(), 1);
        let pattern_match = &matches[0];
        
        // Verify the match binds x->A and y->B (or reverse, both valid)
        assert_eq!(pattern_match.matched_relations.len(), 1);
        assert_eq!(pattern_match.matched_relations[0], initial_relation);
        assert_eq!(pattern_match.binding.len(), 2); // Two variables bound
        
        // Apply the rule
        let result = apply_rule(&mut hypergraph, &rule, pattern_match);
        
        // Verify the rewrite was successful
        assert!(result.success);
        assert_eq!(result.new_atoms.len(), 1); // Created one new atom Z
        assert_eq!(result.new_relations.len(), 2); // Created two new relations
        assert_eq!(result.removed_relations.len(), 1); // Removed one relation
        
        // Verify final hypergraph state
        assert_eq!(hypergraph.atom_count(), 3); // A, B, Z
        assert_eq!(hypergraph.relation_count(), 2); // {A,Z} and {Z,B}
        assert!(!hypergraph.contains_relation(initial_relation)); // Original edge removed
        
        // The new atom should exist
        let new_atom_z = result.new_atoms[0];
        assert!(hypergraph.contains_atom(new_atom_z));
        
        // Verify that the two new relations connect A-Z and Z-B
        let mut found_a_z = false;
        let mut found_z_b = false;
        
        for &new_relation_id in &result.new_relations {
            let relation = hypergraph.get_relation(new_relation_id).unwrap();
            let atoms = relation.atoms();
            
            if (atoms[0] == atom_a && atoms[1] == new_atom_z) ||
               (atoms[0] == new_atom_z && atoms[1] == atom_a) {
                found_a_z = true;
            }
            
            if (atoms[0] == atom_b && atoms[1] == new_atom_z) ||
               (atoms[0] == new_atom_z && atoms[1] == atom_b) {
                found_z_b = true;
            }
        }
        
        assert!(found_a_z, "Should find A-Z connection");
        assert!(found_z_b, "Should find Z-B connection");
    }
} 