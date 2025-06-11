use serde::{Serialize, Deserialize};
use crate::hypergraph::{AtomId, RelationId};
use crate::rules::RuleId;

/// Represents a single simulation event - the application of a rule to a specific match.
/// This corresponds to one "step" in the hypergraph evolution.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SimulationEvent {
    /// The step number when this event occurred
    pub step_number: u64,
    
    /// The ID of the rule that was applied
    pub rule_id: RuleId,
    
    /// The atoms that were created during this event
    pub atoms_created: Vec<AtomId>,
    
    /// The relations that were created during this event
    pub relations_created: Vec<RelationId>,
    
    /// The relations that were removed during this event
    pub relations_removed: Vec<RelationId>,
    
    /// Optional description of the event for debugging/logging
    pub description: Option<String>,
}

impl SimulationEvent {
    /// Creates a new simulation event.
    pub fn new(
        step_number: u64,
        rule_id: RuleId,
        atoms_created: Vec<AtomId>,
        relations_created: Vec<RelationId>,
        relations_removed: Vec<RelationId>,
    ) -> Self {
        SimulationEvent {
            step_number,
            rule_id,
            atoms_created,
            relations_created,
            relations_removed,
            description: None,
        }
    }
    
    /// Creates a new simulation event with a description.
    pub fn with_description(
        step_number: u64,
        rule_id: RuleId,
        atoms_created: Vec<AtomId>,
        relations_created: Vec<RelationId>,
        relations_removed: Vec<RelationId>,
        description: String,
    ) -> Self {
        SimulationEvent {
            step_number,
            rule_id,
            atoms_created,
            relations_created,
            relations_removed,
            description: Some(description),
        }
    }
    
    /// Returns the step number when this event occurred.
    pub fn step_number(&self) -> u64 {
        self.step_number
    }
    
    /// Returns the rule ID that was applied.
    pub fn rule_id(&self) -> RuleId {
        self.rule_id
    }
    
    /// Returns the atoms created in this event.
    pub fn atoms_created(&self) -> &[AtomId] {
        &self.atoms_created
    }
    
    /// Returns the relations created in this event.
    pub fn relations_created(&self) -> &[RelationId] {
        &self.relations_created
    }
    
    /// Returns the relations removed in this event.
    pub fn relations_removed(&self) -> &[RelationId] {
        &self.relations_removed
    }
    
    /// Returns the event description if available.
    pub fn description(&self) -> Option<&str> {
        self.description.as_deref()
    }
    
    /// Sets the description for this event.
    pub fn set_description(&mut self, description: Option<String>) {
        self.description = description;
    }
}

/// Represents the current state of the hypergraph for transmission.
/// This structure contains all the information needed to reconstruct the hypergraph
/// and is used for gRPC communication and serialization.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HypergraphState {
    /// All atoms in the hypergraph
    pub atoms: Vec<crate::hypergraph::Atom>,
    
    /// All relations in the hypergraph
    pub relations: Vec<crate::hypergraph::Relation>,
    
    /// Current step number of the simulation
    pub step_number: u64,
    
    /// The next atom ID to be assigned (for proper reconstruction)
    pub next_atom_id: u64,
    
    /// The next relation ID to be assigned (for proper reconstruction)
    pub next_relation_id: u64,
}

impl HypergraphState {
    /// Creates a new hypergraph state.
    pub fn new(
        atoms: Vec<crate::hypergraph::Atom>,
        relations: Vec<crate::hypergraph::Relation>,
        step_number: u64,
        next_atom_id: u64,
        next_relation_id: u64,
    ) -> Self {
        HypergraphState {
            atoms,
            relations,
            step_number,
            next_atom_id,
            next_relation_id,
        }
    }
    
    /// Returns the atoms in this state.
    pub fn atoms(&self) -> &[crate::hypergraph::Atom] {
        &self.atoms
    }
    
    /// Returns the relations in this state.
    pub fn relations(&self) -> &[crate::hypergraph::Relation] {
        &self.relations
    }
    
    /// Returns the current step number.
    pub fn step_number(&self) -> u64 {
        self.step_number
    }
    
    /// Returns the next atom ID.
    pub fn next_atom_id(&self) -> u64 {
        self.next_atom_id
    }
    
    /// Returns the next relation ID.
    pub fn next_relation_id(&self) -> u64 {
        self.next_relation_id
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::rules::RuleId;

    #[test]
    fn test_simulation_event_creation() {
        let rule_id = RuleId::new(1);
        let atoms_created = vec![AtomId::new(10), AtomId::new(11)];
        let relations_created = vec![RelationId::new(20)];
        let relations_removed = vec![RelationId::new(19)];
        
        let event = SimulationEvent::new(
            5,
            rule_id,
            atoms_created.clone(),
            relations_created.clone(),
            relations_removed.clone(),
        );
        
        assert_eq!(event.step_number(), 5);
        assert_eq!(event.rule_id(), rule_id);
        assert_eq!(event.atoms_created(), &atoms_created);
        assert_eq!(event.relations_created(), &relations_created);
        assert_eq!(event.relations_removed(), &relations_removed);
        assert_eq!(event.description(), None);
    }
    
    #[test]
    fn test_simulation_event_with_description() {
        let rule_id = RuleId::new(1);
        let description = "Applied edge splitting rule".to_string();
        
        let event = SimulationEvent::with_description(
            3,
            rule_id,
            vec![AtomId::new(5)],
            vec![RelationId::new(10), RelationId::new(11)],
            vec![RelationId::new(9)],
            description.clone(),
        );
        
        assert_eq!(event.step_number(), 3);
        assert_eq!(event.description(), Some(description.as_str()));
    }
    
    #[test]
    fn test_set_description() {
        let rule_id = RuleId::new(1);
        let mut event = SimulationEvent::new(1, rule_id, vec![], vec![], vec![]);
        
        assert_eq!(event.description(), None);
        
        event.set_description(Some("Test description".to_string()));
        assert_eq!(event.description(), Some("Test description"));
        
        event.set_description(None);
        assert_eq!(event.description(), None);
    }
    
    #[test]
    fn test_hypergraph_state_creation() {
        let atoms = vec![
            crate::hypergraph::Atom::new(AtomId::new(1)),
            crate::hypergraph::Atom::new(AtomId::new(2)),
        ];
        let relations = vec![
            crate::hypergraph::Relation::new(RelationId::new(1), vec![AtomId::new(1), AtomId::new(2)]),
        ];
        
        let state = HypergraphState::new(atoms.clone(), relations.clone(), 10, 3, 2);
        
        assert_eq!(state.atoms().len(), 2);
        assert_eq!(state.relations().len(), 1);
        assert_eq!(state.step_number(), 10);
        assert_eq!(state.next_atom_id(), 3);
        assert_eq!(state.next_relation_id(), 2);
    }
} 