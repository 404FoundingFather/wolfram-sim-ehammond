use std::fmt;
use serde::{Serialize, Deserialize};

use crate::rules::pattern::{Pattern, PatternElement, PatternRelation};

/// Represents a unique identifier for a rule in the Wolfram Physics Model.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct RuleId(pub u64);

impl RuleId {
    /// Creates a new RuleId with the specified ID value.
    pub fn new(id: u64) -> Self {
        RuleId(id)
    }

    /// Returns the inner value of the RuleId.
    pub fn value(&self) -> u64 {
        self.0
    }
}

impl fmt::Display for RuleId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Rule({})", self.0)
    }
}

/// Represents a rewrite rule in the Wolfram Physics Model.
/// A rule consists of a pattern to match and a replacement structure.
/// When the pattern is found in a hypergraph, it can be replaced with
/// the replacement structure according to the model's evolution.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Rule {
    /// The unique identifier for this rule
    pub id: RuleId,
    
    /// The pattern to match in the hypergraph
    pub pattern: Pattern,
    
    /// The replacement structure to substitute for the matched pattern
    pub replacement: Pattern,
    
    /// Optional name or description of the rule
    pub name: Option<String>,
}

impl Rule {
    /// Creates a new Rule with the specified ID, pattern, and replacement.
    pub fn new(id: RuleId, pattern: Pattern, replacement: Pattern) -> Self {
        Rule {
            id,
            pattern,
            replacement,
            name: None,
        }
    }

    /// Creates a new Rule with the specified ID, pattern, replacement, and name.
    pub fn with_name(id: RuleId, pattern: Pattern, replacement: Pattern, name: String) -> Self {
        Rule {
            id,
            pattern,
            replacement,
            name: Some(name),
        }
    }

    /// Returns the ID of this rule.
    pub fn id(&self) -> RuleId {
        self.id
    }

    /// Returns a reference to the pattern in this rule.
    pub fn pattern(&self) -> &Pattern {
        &self.pattern
    }

    /// Returns a reference to the replacement in this rule.
    pub fn replacement(&self) -> &Pattern {
        &self.replacement
    }

    /// Returns a reference to the name of this rule, if any.
    pub fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    /// Sets the name for this rule.
    pub fn set_name(&mut self, name: Option<String>) {
        self.name = name;
    }

    /// Creates the classic "{{x,y}} -> {{x,z},{z,y}}" rule used in many Wolfram Physics Model examples.
    pub fn create_basic_edge_splitting_rule() -> Self {
        // Pattern: {{x,y}}
        let pattern_relation = PatternRelation::new(vec![
            PatternElement::variable("x"),
            PatternElement::variable("y"),
        ]);
        let pattern = Pattern::new(vec![pattern_relation]);
        
        // Replacement: {{x,z},{z,y}}
        let replacement_relation1 = PatternRelation::new(vec![
            PatternElement::variable("x"),
            PatternElement::variable("z"),
        ]);
        let replacement_relation2 = PatternRelation::new(vec![
            PatternElement::variable("z"),
            PatternElement::variable("y"),
        ]);
        let replacement = Pattern::new(vec![replacement_relation1, replacement_relation2]);
        
        Rule::with_name(
            RuleId::new(0),
            pattern,
            replacement,
            "Edge Splitting Rule {{x,y}} -> {{x,z},{z,y}}".to_string(),
        )
    }
}

/// A collection of rules that can be applied during a simulation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct RuleSet {
    /// The rules in this rule set, indexed by their IDs
    rules: Vec<Rule>,
}

impl RuleSet {
    /// Creates a new, empty rule set.
    pub fn new() -> Self {
        RuleSet { rules: Vec::new() }
    }

    /// Creates a new rule set with the specified initial capacity.
    pub fn with_capacity(capacity: usize) -> Self {
        RuleSet {
            rules: Vec::with_capacity(capacity),
        }
    }

    /// Adds a rule to this rule set.
    pub fn add_rule(&mut self, rule: Rule) {
        self.rules.push(rule);
    }

    /// Returns a reference to a rule by its ID.
    pub fn get_rule(&self, rule_id: RuleId) -> Option<&Rule> {
        self.rules.iter().find(|rule| rule.id() == rule_id)
    }

    /// Returns the number of rules in this rule set.
    pub fn len(&self) -> usize {
        self.rules.len()
    }

    /// Returns true if this rule set has no rules.
    pub fn is_empty(&self) -> bool {
        self.rules.is_empty()
    }

    /// Returns an iterator over all rules in this rule set.
    pub fn iter(&self) -> impl Iterator<Item = &Rule> {
        self.rules.iter()
    }

    /// Creates a simple rule set with just the basic edge splitting rule.
    pub fn create_basic_ruleset() -> Self {
        let mut ruleset = RuleSet::new();
        ruleset.add_rule(Rule::create_basic_edge_splitting_rule());
        ruleset
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::rules::pattern::{PatternElement, PatternRelation, Pattern};

    #[test]
    fn test_rule_id_creation() {
        let id = RuleId::new(42);
        assert_eq!(id.value(), 42);
    }

    #[test]
    fn test_rule_creation() {
        let rule_id = RuleId::new(1);
        
        // Simple pattern: {{x,y}}
        let pattern_relation = PatternRelation::new(vec![
            PatternElement::variable("x"),
            PatternElement::variable("y"),
        ]);
        let pattern = Pattern::new(vec![pattern_relation]);
        
        // Simple replacement: {{x,z}}
        let replacement_relation = PatternRelation::new(vec![
            PatternElement::variable("x"),
            PatternElement::variable("z"),
        ]);
        let replacement = Pattern::new(vec![replacement_relation]);
        
        let rule = Rule::new(rule_id, pattern.clone(), replacement.clone());
        
        assert_eq!(rule.id(), rule_id);
        assert_eq!(rule.pattern(), &pattern);
        assert_eq!(rule.replacement(), &replacement);
        assert_eq!(rule.name(), None);
    }

    #[test]
    fn test_rule_with_name() {
        let rule_id = RuleId::new(2);
        
        // Simple pattern and replacement
        let pattern = Pattern::from_elements(vec![
            PatternElement::variable("a"),
            PatternElement::variable("b"),
        ]);
        let replacement = Pattern::from_elements(vec![
            PatternElement::variable("b"),
            PatternElement::variable("a"),
        ]);
        
        let name = "Swap Rule".to_string();
        let rule = Rule::with_name(rule_id, pattern, replacement, name.clone());
        
        assert_eq!(rule.name(), Some(name.as_str()));
    }

    #[test]
    fn test_set_name() {
        let rule_id = RuleId::new(3);
        let pattern = Pattern::new(vec![]);
        let replacement = Pattern::new(vec![]);
        
        let mut rule = Rule::new(rule_id, pattern, replacement);
        assert_eq!(rule.name(), None);
        
        rule.set_name(Some("Test Rule".to_string()));
        assert_eq!(rule.name(), Some("Test Rule"));
        
        rule.set_name(None);
        assert_eq!(rule.name(), None);
    }

    #[test]
    fn test_basic_edge_splitting_rule() {
        let rule = Rule::create_basic_edge_splitting_rule();
        
        // Pattern should be {{x,y}}
        assert_eq!(rule.pattern().len(), 1);
        assert_eq!(rule.pattern().relations()[0].arity(), 2);
        
        // Replacement should be {{x,z},{z,y}}
        assert_eq!(rule.replacement().len(), 2);
        assert_eq!(rule.replacement().relations()[0].arity(), 2);
        assert_eq!(rule.replacement().relations()[1].arity(), 2);
        
        // Check that the first relation links x and z
        assert_eq!(
            rule.replacement().relations()[0].elements()[0].as_variable().unwrap().name(),
            "x"
        );
        assert_eq!(
            rule.replacement().relations()[0].elements()[1].as_variable().unwrap().name(),
            "z"
        );
        
        // Check that the second relation links z and y
        assert_eq!(
            rule.replacement().relations()[1].elements()[0].as_variable().unwrap().name(),
            "z"
        );
        assert_eq!(
            rule.replacement().relations()[1].elements()[1].as_variable().unwrap().name(),
            "y"
        );
    }

    #[test]
    fn test_rule_set() {
        let mut ruleset = RuleSet::new();
        assert!(ruleset.is_empty());
        
        let rule1 = Rule::create_basic_edge_splitting_rule();
        let rule_id1 = rule1.id();
        ruleset.add_rule(rule1);
        
        assert_eq!(ruleset.len(), 1);
        assert!(ruleset.get_rule(rule_id1).is_some());
        assert!(ruleset.get_rule(RuleId::new(999)).is_none());
        
        // Test iteration
        let rules: Vec<&Rule> = ruleset.iter().collect();
        assert_eq!(rules.len(), 1);
        assert_eq!(rules[0].id(), rule_id1);
    }

    #[test]
    fn test_create_basic_ruleset() {
        let ruleset = RuleSet::create_basic_ruleset();
        
        assert_eq!(ruleset.len(), 1);
        let rule = ruleset.iter().next().unwrap();
        assert_eq!(rule.name(), Some("Edge Splitting Rule {{x,y}} -> {{x,z},{z,y}}"));
    }
} 