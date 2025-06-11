use std::collections::HashMap;
use crate::hypergraph::{Hypergraph, AtomId, RelationId};
use crate::rules::{Rule, pattern::{Pattern, PatternElement, Variable}};
use crate::matching::PatternMatch;

/// Represents the result of applying a rule to a hypergraph.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RewriteResult {
    /// Whether the rewrite was successful
    pub success: bool,
    /// New atoms created during the rewrite (if any)
    pub new_atoms: Vec<AtomId>,
    /// New relations created during the rewrite (if any)
    pub new_relations: Vec<RelationId>,
    /// Relations that were removed during the rewrite
    pub removed_relations: Vec<RelationId>,
    /// Optional error message if the rewrite failed
    pub error_message: Option<String>,
}

impl RewriteResult {
    /// Creates a successful rewrite result.
    pub fn success(
        new_atoms: Vec<AtomId>,
        new_relations: Vec<RelationId>,
        removed_relations: Vec<RelationId>,
    ) -> Self {
        RewriteResult {
            success: true,
            new_atoms,
            new_relations,
            removed_relations,
            error_message: None,
        }
    }

    /// Creates a failed rewrite result with an error message.
    pub fn failure(error_message: String) -> Self {
        RewriteResult {
            success: false,
            new_atoms: Vec::new(),
            new_relations: Vec::new(),
            removed_relations: Vec::new(),
            error_message: Some(error_message),
        }
    }
}

/// Applies a rule to a hypergraph using the given pattern match.
/// This implements the core rewriting logic:
/// 1. Remove the matched pattern elements from the hypergraph
/// 2. Create new atoms for variables in the replacement that aren't in the pattern
/// 3. Add the replacement elements to the hypergraph
pub fn apply_rule(
    hypergraph: &mut Hypergraph,
    rule: &Rule,
    pattern_match: &PatternMatch,
) -> RewriteResult {
    // Step 1: Remove the matched relations from the hypergraph
    let mut removed_relations = Vec::new();
    
    for &relation_id in &pattern_match.matched_relations {
        if hypergraph.remove_relation(relation_id).is_some() {
            removed_relations.push(relation_id);
        } else {
            return RewriteResult::failure(format!(
                "Failed to remove relation {:?} during rewrite",
                relation_id
            ));
        }
    }

    // Step 2: Identify variables in the replacement that need new atoms
    let mut new_atom_bindings = HashMap::new();
    let mut new_atoms = Vec::new();
    
    // Find all variables used in the replacement pattern
    for relation in rule.replacement().relations() {
        for element in relation.elements() {
            if let PatternElement::Variable(var) = element {
                // If this variable is not bound in the pattern match, we need to create a new atom
                                 if pattern_match.binding.get_binding(var).is_none() {
                     if !new_atom_bindings.contains_key(var) {
                         let new_atom_id = hypergraph.create_atom();
                         new_atom_bindings.insert(var.clone(), new_atom_id);
                         new_atoms.push(new_atom_id);
                     }
                 }
            }
        }
    }

    // Step 3: Create the replacement relations
    let mut new_relations = Vec::new();
    
    for replacement_relation in rule.replacement().relations() {
        let mut relation_atoms = Vec::new();
        
        for element in replacement_relation.elements() {
            match element {
                PatternElement::Atom(atom_id) => {
                    // Use the concrete atom directly
                    relation_atoms.push(*atom_id);
                }
                PatternElement::Variable(var) => {
                    // Look up the atom for this variable
                    if let Some(atom_id) = pattern_match.binding.get_binding(var) {
                        // Variable was bound in the pattern match
                        relation_atoms.push(atom_id);
                    } else if let Some(&atom_id) = new_atom_bindings.get(var) {
                        // Variable is new and we created an atom for it
                        relation_atoms.push(atom_id);
                    } else {
                        return RewriteResult::failure(format!(
                            "Variable '{}' not found in binding or new atom mapping",
                            var.name()
                        ));
                    }
                }
            }
        }
        
        // Create the new relation
        let new_relation_id = if let Some(metadata) = replacement_relation.metadata() {
            hypergraph.create_relation_with_metadata(relation_atoms, metadata.to_string())
        } else {
            hypergraph.create_relation(relation_atoms)
        };
        new_relations.push(new_relation_id);
    }

    RewriteResult::success(new_atoms, new_relations, removed_relations)
}

/// Convenience function to find and apply the first available rule match.
/// Returns None if no matches are found for any rule.
pub fn apply_first_available_rule(
    hypergraph: &mut Hypergraph,
    rules: &[Rule],
) -> Option<RewriteResult> {
    for rule in rules {
        let matches = crate::matching::find_pattern_matches(rule.pattern(), hypergraph);
        if let Some(first_match) = matches.first() {
            return Some(apply_rule(hypergraph, rule, first_match));
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hypergraph::Hypergraph;
    use crate::rules::{Rule, pattern::{Pattern, PatternRelation, PatternElement, Variable, Binding}};
    use crate::matching::{find_pattern_matches, PatternMatch};

    #[test]
    fn test_apply_basic_edge_splitting_rule() {
        let mut hypergraph = Hypergraph::new();
        
        // Create initial hypergraph: {{A, B}}
        let atom_a = hypergraph.create_atom();
        let atom_b = hypergraph.create_atom();
        let initial_relation = hypergraph.create_relation(vec![atom_a, atom_b]);
        
        // Create the edge splitting rule: {{x,y}} -> {{x,z},{z,y}}
        let rule = Rule::create_basic_edge_splitting_rule();
        
        // Find matches
        let matches = find_pattern_matches(rule.pattern(), &hypergraph);
        assert_eq!(matches.len(), 1);
        
        let pattern_match = &matches[0];
        
        // Apply the rule
        let result = apply_rule(&mut hypergraph, &rule, pattern_match);
        
        assert!(result.success);
        assert_eq!(result.new_atoms.len(), 1); // One new atom 'z'
        assert_eq!(result.new_relations.len(), 2); // Two new relations: {{x,z},{z,y}}
        assert_eq!(result.removed_relations.len(), 1); // One removed relation: {{x,y}}
        assert_eq!(result.removed_relations[0], initial_relation);
        
        // Verify the hypergraph state after rewrite
        assert_eq!(hypergraph.atom_count(), 3); // A, B, and new atom Z
        assert_eq!(hypergraph.relation_count(), 2); // Two new relations
        
        // Verify the new atom exists
        let new_atom_z = result.new_atoms[0];
        assert!(hypergraph.contains_atom(new_atom_z));
        
        // Verify the new relations exist and have correct structure
        for &new_relation_id in &result.new_relations {
            let relation = hypergraph.get_relation(new_relation_id).unwrap();
            assert_eq!(relation.arity(), 2); // Binary relations
            
            // One relation should connect A to Z, the other Z to B
            let atoms = relation.atoms();
            assert!(
                (atoms[0] == atom_a && atoms[1] == new_atom_z) ||
                (atoms[0] == new_atom_z && atoms[1] == atom_b)
            );
        }
    }

    #[test]
    fn test_apply_rule_with_concrete_atoms() {
        let mut hypergraph = Hypergraph::new();
        
        // Create hypergraph with specific atoms
        let atom1 = hypergraph.create_atom();
        let atom2 = hypergraph.create_atom();
        let atom3 = hypergraph.create_atom();
        
        let relation1 = hypergraph.create_relation(vec![atom1, atom2]);
        let _relation2 = hypergraph.create_relation(vec![atom2, atom3]);
        
        // Create a rule that matches a specific atom: {{atom1, y}} -> {{atom1, z}}
        let pattern_relation = PatternRelation::new(vec![
            PatternElement::atom(atom1),
            PatternElement::variable("y"),
        ]);
        let pattern = Pattern::new(vec![pattern_relation]);
        
        let replacement_relation = PatternRelation::new(vec![
            PatternElement::atom(atom1),
            PatternElement::variable("z"), // New variable, should create new atom
        ]);
        let replacement = Pattern::new(vec![replacement_relation]);
        
        let rule = Rule::new(crate::rules::RuleId::new(100), pattern, replacement);
        
        // Find matches
        let matches = find_pattern_matches(rule.pattern(), &hypergraph);
        assert_eq!(matches.len(), 1);
        
        // Apply the rule
        let result = apply_rule(&mut hypergraph, &rule, &matches[0]);
        
        assert!(result.success);
        assert_eq!(result.new_atoms.len(), 1); // Created atom for variable 'z'
        assert_eq!(result.new_relations.len(), 1); // One new relation
        assert_eq!(result.removed_relations.len(), 1); // Removed {{atom1, atom2}}
        assert_eq!(result.removed_relations[0], relation1);
        
        // Verify the new relation connects atom1 to the new atom
        let new_relation = hypergraph.get_relation(result.new_relations[0]).unwrap();
        assert_eq!(new_relation.atoms()[0], atom1);
        assert_eq!(new_relation.atoms()[1], result.new_atoms[0]);
    }

    #[test]
    fn test_apply_first_available_rule() {
        let mut hypergraph = Hypergraph::new();
        
        // Create a simple graph
        let atom_a = hypergraph.create_atom();
        let atom_b = hypergraph.create_atom();
        hypergraph.create_relation(vec![atom_a, atom_b]);
        
        // Create a set of rules including the edge splitting rule
        let rules = vec![Rule::create_basic_edge_splitting_rule()];
        
        // Apply first available rule
        let result = apply_first_available_rule(&mut hypergraph, &rules);
        
        assert!(result.is_some());
        let result = result.unwrap();
        assert!(result.success);
        assert_eq!(result.new_atoms.len(), 1);
        assert_eq!(result.new_relations.len(), 2);
        assert_eq!(result.removed_relations.len(), 1);
    }

    #[test]
    fn test_no_rules_applicable() {
        let mut hypergraph = Hypergraph::new();
        
        // Create a ternary relation
        let atom_a = hypergraph.create_atom();
        let atom_b = hypergraph.create_atom();
        let atom_c = hypergraph.create_atom();
        hypergraph.create_relation(vec![atom_a, atom_b, atom_c]);
        
        // Edge splitting rule only works on binary relations
        let rules = vec![Rule::create_basic_edge_splitting_rule()];
        
        // No rule should be applicable
        let result = apply_first_available_rule(&mut hypergraph, &rules);
        assert!(result.is_none());
    }
} 