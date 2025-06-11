use std::collections::{HashSet, HashMap};
use crate::hypergraph::{Hypergraph, AtomId, RelationId};
use crate::rules::pattern::{Pattern, PatternElement, Binding, Variable};

/// Represents a match found during pattern matching.
/// Contains the binding of pattern variables to actual atoms in the hypergraph.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PatternMatch {
    /// Variable bindings for this match
    pub binding: Binding,
    /// Relations in the hypergraph that matched the pattern
    pub matched_relations: Vec<RelationId>,
}

impl PatternMatch {
    /// Creates a new pattern match with the given binding and matched relations.
    pub fn new(binding: Binding, matched_relations: Vec<RelationId>) -> Self {
        PatternMatch {
            binding,
            matched_relations,
        }
    }
}

/// Finds all matches of a pattern within the given hypergraph.
/// This implements a basic sub-hypergraph isomorphism algorithm.
pub fn find_pattern_matches(pattern: &Pattern, hypergraph: &Hypergraph) -> Vec<PatternMatch> {
    let mut matches = Vec::new();
    
    // For MVP, we implement a basic backtracking search
    if pattern.is_empty() {
        return matches;
    }
    
    // Get all relation IDs from the hypergraph
    let hypergraph_relations: Vec<_> = hypergraph.relation_ids().copied().collect();
    
    // Start the pattern matching from the beginning
    let mut binding = Binding::new();
    let mut matched_relations = Vec::new();
    
    find_all_matches(
        pattern,
        hypergraph,
        0, // Start with first pattern relation
        &mut binding,
        &mut matched_relations,
        &hypergraph_relations,
        &mut matches,
    );
    
    matches
}

/// Finds all possible matches by exploring all combinations.
fn find_all_matches(
    pattern: &Pattern,
    hypergraph: &Hypergraph,
    pattern_relation_index: usize,
    binding: &mut Binding,
    matched_relations: &mut Vec<RelationId>,
    available_relations: &[RelationId],
    all_matches: &mut Vec<PatternMatch>,
) {
    // Base case: if we've matched all pattern relations, we have a complete match
    if pattern_relation_index >= pattern.relations().len() {
        all_matches.push(PatternMatch::new(binding.clone(), matched_relations.clone()));
        return;
    }
    
    let pattern_relation = &pattern.relations()[pattern_relation_index];
    
    // Try to match this pattern relation against each available hypergraph relation
    for &relation_id in available_relations {
        // Skip if this relation is already matched
        if matched_relations.contains(&relation_id) {
            continue;
        }
        
        if let Some(hypergraph_relation) = hypergraph.get_relation(relation_id) {
            // Check if this hypergraph relation can match the pattern relation
            if let Some(new_binding) = try_match_relation(pattern_relation, hypergraph_relation, binding) {
                // Save current state for backtracking
                let old_binding = binding.clone();
                let old_matched_count = matched_relations.len();
                
                // Apply the new binding
                *binding = new_binding;
                matched_relations.push(relation_id);
                
                // Recursively try to match the remaining pattern relations
                find_all_matches(
                    pattern,
                    hypergraph,
                    pattern_relation_index + 1,
                    binding,
                    matched_relations,
                    available_relations,
                    all_matches,
                );
                
                // Backtrack: restore previous state
                *binding = old_binding;
                matched_relations.truncate(old_matched_count);
            }
        }
    }
}



/// Attempts to match a pattern relation against a hypergraph relation.
/// Returns Some(new_binding) if successful, None if the match fails.
fn try_match_relation(
    pattern_relation: &crate::rules::pattern::PatternRelation,
    hypergraph_relation: &crate::hypergraph::Relation,
    current_binding: &Binding,
) -> Option<Binding> {
    // Relations must have the same arity to match
    if pattern_relation.arity() != hypergraph_relation.arity() {
        return None;
    }
    
    let mut new_binding = current_binding.clone();
    
    // Try to match each element in the pattern relation
    for (pattern_element, &hypergraph_atom_id) in 
        pattern_relation.elements().iter().zip(hypergraph_relation.atoms().iter()) {
        
        match pattern_element {
            PatternElement::Atom(pattern_atom_id) => {
                // Concrete atom must match exactly
                if *pattern_atom_id != hypergraph_atom_id {
                    return None;
                }
            }
            PatternElement::Variable(var) => {
                // Try to bind the variable to this atom
                if !new_binding.bind(var.clone(), hypergraph_atom_id) {
                    return None; // Binding conflict
                }
            }
        }
    }
    
    Some(new_binding)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hypergraph::{Hypergraph, AtomId};
    use crate::rules::pattern::{Pattern, PatternRelation, PatternElement, Variable};

    #[test]
    fn test_empty_pattern_no_matches() {
        let mut hypergraph = Hypergraph::new();
        let atom1 = hypergraph.create_atom();
        let atom2 = hypergraph.create_atom();
        hypergraph.create_relation(vec![atom1, atom2]);
        
        let pattern = Pattern::new(vec![]);
        let matches = find_pattern_matches(&pattern, &hypergraph);
        
        assert!(matches.is_empty());
    }

    #[test]
    fn test_simple_variable_match() {
        let mut hypergraph = Hypergraph::new();
        let atom1 = hypergraph.create_atom();
        let atom2 = hypergraph.create_atom();
        let relation_id = hypergraph.create_relation(vec![atom1, atom2]);
        
        // Pattern: {{x, y}}
        let pattern_relation = PatternRelation::new(vec![
            PatternElement::variable("x"),
            PatternElement::variable("y"),
        ]);
        let pattern = Pattern::new(vec![pattern_relation]);
        
        let matches = find_pattern_matches(&pattern, &hypergraph);
        
        assert_eq!(matches.len(), 1);
        let match_result = &matches[0];
        
        // Check that variables are bound
        let var_x = Variable::new("x");
        let var_y = Variable::new("y");
        assert_eq!(match_result.binding.get_binding(&var_x), Some(atom1));
        assert_eq!(match_result.binding.get_binding(&var_y), Some(atom2));
        assert_eq!(match_result.matched_relations, vec![relation_id]);
    }

    #[test]
    fn test_concrete_atom_match() {
        let mut hypergraph = Hypergraph::new();
        let atom1 = hypergraph.create_atom();
        let atom2 = hypergraph.create_atom();
        let atom3 = hypergraph.create_atom();
        
        let relation_id1 = hypergraph.create_relation(vec![atom1, atom2]);
        let _relation_id2 = hypergraph.create_relation(vec![atom2, atom3]);
        
        // Pattern: {{atom1, y}} - should only match first relation
        let pattern_relation = PatternRelation::new(vec![
            PatternElement::atom(atom1),
            PatternElement::variable("y"),
        ]);
        let pattern = Pattern::new(vec![pattern_relation]);
        
        let matches = find_pattern_matches(&pattern, &hypergraph);
        
        assert_eq!(matches.len(), 1);
        let match_result = &matches[0];
        
        let var_y = Variable::new("y");
        assert_eq!(match_result.binding.get_binding(&var_y), Some(atom2));
        assert_eq!(match_result.matched_relations, vec![relation_id1]);
    }

    #[test]
    fn test_no_match_different_arity() {
        let mut hypergraph = Hypergraph::new();
        let atom1 = hypergraph.create_atom();
        let atom2 = hypergraph.create_atom();
        let atom3 = hypergraph.create_atom();
        
        // Create a ternary relation
        hypergraph.create_relation(vec![atom1, atom2, atom3]);
        
        // Pattern: {{x, y}} - binary pattern shouldn't match ternary relation
        let pattern_relation = PatternRelation::new(vec![
            PatternElement::variable("x"),
            PatternElement::variable("y"),
        ]);
        let pattern = Pattern::new(vec![pattern_relation]);
        
        let matches = find_pattern_matches(&pattern, &hypergraph);
        
        assert!(matches.is_empty());
    }
} 