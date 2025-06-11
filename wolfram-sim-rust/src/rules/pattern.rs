use std::fmt;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

use crate::hypergraph::{AtomId, Relation, RelationId};

/// Represents a variable in a rule pattern that can match any atom.
/// Variables are used in patterns to represent atoms that can match
/// different actual atom values across applications of the rule.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Variable {
    /// A unique name for this variable
    name: String,
}

impl Variable {
    /// Creates a new variable with the given name.
    pub fn new<S: Into<String>>(name: S) -> Self {
        Variable { name: name.into() }
    }

    /// Returns the name of this variable.
    pub fn name(&self) -> &str {
        &self.name
    }
}

impl fmt::Display for Variable {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Var({})", self.name)
    }
}

/// Represents a mapping from variables to actual atom IDs in a pattern match.
/// During pattern matching, variables in the pattern are bound to actual atom IDs
/// in the hypergraph being matched against.
#[derive(Debug, Clone, PartialEq, Eq, Default, Serialize, Deserialize)]
pub struct Binding {
    /// Map from variables to the atom IDs they are bound to
    var_bindings: HashMap<Variable, AtomId>,
}

impl Binding {
    /// Creates a new, empty set of bindings.
    pub fn new() -> Self {
        Binding {
            var_bindings: HashMap::new(),
        }
    }

    /// Binds a variable to an atom ID.
    /// If the variable is already bound to a different atom, returns false.
    /// If the variable is already bound to the same atom or is unbound, binds it and returns true.
    pub fn bind(&mut self, variable: Variable, atom_id: AtomId) -> bool {
        if let Some(existing_atom_id) = self.var_bindings.get(&variable) {
            if *existing_atom_id != atom_id {
                return false;
            }
            true // Already bound to the same atom
        } else {
            self.var_bindings.insert(variable, atom_id);
            true
        }
    }

    /// Returns the atom ID that a variable is bound to, if any.
    pub fn get_binding(&self, variable: &Variable) -> Option<AtomId> {
        self.var_bindings.get(variable).copied()
    }

    /// Returns true if the variable is bound to any atom.
    pub fn is_bound(&self, variable: &Variable) -> bool {
        self.var_bindings.contains_key(variable)
    }

    /// Clears all bindings.
    pub fn clear(&mut self) {
        self.var_bindings.clear();
    }

    /// Returns the number of bound variables.
    pub fn len(&self) -> usize {
        self.var_bindings.len()
    }

    /// Returns true if there are no bindings.
    pub fn is_empty(&self) -> bool {
        self.var_bindings.is_empty()
    }

    /// Returns an iterator over the variable-atom bindings.
    pub fn iter(&self) -> impl Iterator<Item = (&Variable, &AtomId)> {
        self.var_bindings.iter()
    }

    /// Combines two sets of bindings, returning None if there are any conflicts.
    pub fn merge(&self, other: &Binding) -> Option<Binding> {
        let mut result = self.clone();

        for (var, atom_id) in other.var_bindings.iter() {
            if !result.bind(var.clone(), *atom_id) {
                return None; // Conflict
            }
        }

        Some(result)
    }
}

/// Represents a pattern in a hypergraph rewrite rule.
/// A pattern consists of a set of relations, potentially containing variables.
/// It is matched against a target hypergraph during rule application.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Pattern {
    /// Relations in the pattern, which may include variables
    relations: Vec<PatternRelation>,
}

/// Represents a relation in a pattern, which may contain variables.
/// This is similar to a regular Relation but can contain Variables instead of AtomIds.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PatternRelation {
    /// Elements of this relation, which can be either concrete atoms or variables
    elements: Vec<PatternElement>,
    
    /// Optional metadata or additional information about the relation
    metadata: Option<String>,
}

/// An element in a pattern relation can be either a concrete AtomId or a Variable.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PatternElement {
    /// A concrete atom ID that must match exactly
    Atom(AtomId),
    /// A variable that can match any atom
    Variable(Variable),
}

impl Pattern {
    /// Creates a new pattern with the specified relations.
    pub fn new(relations: Vec<PatternRelation>) -> Self {
        Pattern { relations }
    }

    /// Returns a reference to the pattern relations.
    pub fn relations(&self) -> &[PatternRelation] {
        &self.relations
    }

    /// Adds a relation to this pattern.
    pub fn add_relation(&mut self, relation: PatternRelation) {
        self.relations.push(relation);
    }

    /// Returns the number of relations in this pattern.
    pub fn len(&self) -> usize {
        self.relations.len()
    }

    /// Returns true if this pattern has no relations.
    pub fn is_empty(&self) -> bool {
        self.relations.is_empty()
    }

    /// Creates a pattern with a single relation using the given elements.
    pub fn from_elements(elements: Vec<PatternElement>) -> Self {
        let relation = PatternRelation::new(elements);
        Pattern::new(vec![relation])
    }
}

impl PatternRelation {
    /// Creates a new pattern relation with the specified elements.
    pub fn new(elements: Vec<PatternElement>) -> Self {
        PatternRelation {
            elements,
            metadata: None,
        }
    }

    /// Creates a new pattern relation with the specified elements and metadata.
    pub fn with_metadata(elements: Vec<PatternElement>, metadata: String) -> Self {
        PatternRelation {
            elements,
            metadata: Some(metadata),
        }
    }

    /// Returns a reference to the elements in this relation.
    pub fn elements(&self) -> &[PatternElement] {
        &self.elements
    }

    /// Returns a reference to the metadata of this relation, if any.
    pub fn metadata(&self) -> Option<&str> {
        self.metadata.as_deref()
    }

    /// Returns the number of elements in this relation.
    pub fn arity(&self) -> usize {
        self.elements.len()
    }
}

impl PatternElement {
    /// Creates a new atom element with the given ID.
    pub fn atom(atom_id: AtomId) -> Self {
        PatternElement::Atom(atom_id)
    }

    /// Creates a new variable element with the given name.
    pub fn variable<S: Into<String>>(name: S) -> Self {
        PatternElement::Variable(Variable::new(name))
    }

    /// Returns true if this element is a variable.
    pub fn is_variable(&self) -> bool {
        matches!(self, PatternElement::Variable(_))
    }

    /// Returns true if this element is an atom.
    pub fn is_atom(&self) -> bool {
        matches!(self, PatternElement::Atom(_))
    }

    /// Returns the variable if this element is a variable.
    pub fn as_variable(&self) -> Option<&Variable> {
        if let PatternElement::Variable(var) = self {
            Some(var)
        } else {
            None
        }
    }

    /// Returns the atom ID if this element is an atom.
    pub fn as_atom(&self) -> Option<AtomId> {
        if let PatternElement::Atom(atom_id) = self {
            Some(*atom_id)
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_variable_creation() {
        let var = Variable::new("x");
        assert_eq!(var.name(), "x");
    }

    #[test]
    fn test_binding_basic() {
        let var_x = Variable::new("x");
        let atom_id = AtomId::new(1);
        
        let mut binding = Binding::new();
        assert!(binding.is_empty());
        
        assert!(binding.bind(var_x.clone(), atom_id));
        assert_eq!(binding.get_binding(&var_x), Some(atom_id));
        assert!(binding.is_bound(&var_x));
        assert_eq!(binding.len(), 1);
    }

    #[test]
    fn test_binding_consistency() {
        let var_x = Variable::new("x");
        let atom_id1 = AtomId::new(1);
        let atom_id2 = AtomId::new(2);
        
        let mut binding = Binding::new();
        
        // Bind x -> 1
        assert!(binding.bind(var_x.clone(), atom_id1));
        
        // Try to rebind x -> 2 (should fail)
        assert!(!binding.bind(var_x.clone(), atom_id2));
        
        // Binding should still be x -> 1
        assert_eq!(binding.get_binding(&var_x), Some(atom_id1));
        
        // Rebinding x -> 1 should succeed
        assert!(binding.bind(var_x.clone(), atom_id1));
    }

    #[test]
    fn test_binding_merge() {
        let var_x = Variable::new("x");
        let var_y = Variable::new("y");
        let var_z = Variable::new("z");
        
        let atom_id1 = AtomId::new(1);
        let atom_id2 = AtomId::new(2);
        let atom_id3 = AtomId::new(3);
        
        // Binding 1: x -> 1, y -> 2
        let mut binding1 = Binding::new();
        binding1.bind(var_x.clone(), atom_id1);
        binding1.bind(var_y.clone(), atom_id2);
        
        // Binding 2: y -> 2, z -> 3
        let mut binding2 = Binding::new();
        binding2.bind(var_y.clone(), atom_id2);
        binding2.bind(var_z.clone(), atom_id3);
        
        // Merge should succeed: x -> 1, y -> 2, z -> 3
        let merged = binding1.merge(&binding2);
        assert!(merged.is_some());
        let merged = merged.unwrap();
        
        assert_eq!(merged.get_binding(&var_x), Some(atom_id1));
        assert_eq!(merged.get_binding(&var_y), Some(atom_id2));
        assert_eq!(merged.get_binding(&var_z), Some(atom_id3));
        
        // Create a conflicting binding: y -> 3
        let mut binding3 = Binding::new();
        binding3.bind(var_y.clone(), atom_id3);
        
        // Merge with conflict should fail
        assert!(binding1.merge(&binding3).is_none());
    }
    
    #[test]
    fn test_pattern_element() {
        let atom_id = AtomId::new(42);
        
        let atom_element = PatternElement::atom(atom_id);
        assert!(atom_element.is_atom());
        assert!(!atom_element.is_variable());
        assert_eq!(atom_element.as_atom(), Some(atom_id));
        assert!(atom_element.as_variable().is_none());
        
        let var_element = PatternElement::variable("x");
        assert!(!var_element.is_atom());
        assert!(var_element.is_variable());
        assert!(var_element.as_atom().is_none());
        assert_eq!(var_element.as_variable().unwrap().name(), "x");
    }

    #[test]
    fn test_pattern_relation() {
        let elements = vec![
            PatternElement::variable("x"),
            PatternElement::atom(AtomId::new(1))
        ];
        
        let relation = PatternRelation::new(elements.clone());
        assert_eq!(relation.arity(), 2);
        assert_eq!(relation.elements(), elements.as_slice());
        assert_eq!(relation.metadata(), None);
        
        let metadata = "Edge[\"Type1\"]".to_string();
        let relation_with_meta = PatternRelation::with_metadata(elements.clone(), metadata.clone());
        assert_eq!(relation_with_meta.metadata(), Some(metadata.as_str()));
    }

    #[test]
    fn test_pattern() {
        let relation1 = PatternRelation::new(vec![
            PatternElement::variable("x"),
            PatternElement::variable("y")
        ]);
        
        let relation2 = PatternRelation::new(vec![
            PatternElement::variable("y"),
            PatternElement::variable("z")
        ]);
        
        let mut pattern = Pattern::new(vec![relation1.clone()]);
        assert_eq!(pattern.len(), 1);
        assert_eq!(pattern.relations()[0], relation1);
        
        pattern.add_relation(relation2.clone());
        assert_eq!(pattern.len(), 2);
        assert_eq!(pattern.relations()[1], relation2);
    }
} 