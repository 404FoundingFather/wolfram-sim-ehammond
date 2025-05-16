# Code Snippets

**Last Updated:** May 15, 2025

This document collects reusable code patterns, examples, and solutions to common problems encountered in the project. All code snippets adhere to Clean Code principles.

## Clean Code Standards for Snippets

All code snippets in this document must exemplify Clean Code principles:

1. **Clear Intent**: Each snippet should clearly communicate its purpose
2. **Simplicity**: Snippets should use the simplest approach that solves the problem
3. **Proper Naming**: All variables, functions, and classes should have descriptive names
4. **Minimal Comments**: Code should be self-explanatory, with comments explaining only the "why"
5. **Error Handling**: Include appropriate error handling in snippets
6. **Testability**: Where applicable, show how the code can be tested
7. **SOLID Principles**: Demonstrate good design principles
8. **DRY (Don't Repeat Yourself)**: Avoid duplication in code patterns

When adding new snippets, ensure they adhere to these principles and can serve as exemplars for the project's coding standards.

## Implemented Patterns

### Newtype Pattern (for AtomId)

**Use Case:** When you want to create a distinct, type-safe wrapper around a primitive type to prevent accidental misuse and provide domain-specific methods.

```rust
use std::fmt;
use serde::{Serialize, Deserialize};

/// Represents a unique identifier for an atom in a hypergraph.
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
```

**Explanation:**
- This pattern wraps a primitive `u64` in a new type to create a distinct, type-safe identifier
- Implements core traits like `Debug`, `Clone`, `PartialEq`, etc.
- Includes serialization support through Serde
- Provides a clean API for creation and accessing the inner value

**Usage Example:**
```rust
// Create a new atom ID
let id = AtomId::new(42);

// Get the underlying value
assert_eq!(id.value(), 42);

// Display formatting
let id_string = format!("{}", id); // Results in "Atom(42)"
```

### Entity with Optional Metadata

**Use Case:** When you need to represent an entity with a unique identifier and optional additional information.

```rust
/// Represents an atom in a hypergraph with its unique ID and optional metadata.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Atom {
    /// The unique identifier for this atom
    pub id: AtomId,
    
    /// Optional metadata or additional information about the atom
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
```

**Explanation:**
- Uses the `Option` type to represent the presence or absence of metadata
- Provides constructor methods for both with and without metadata cases
- Includes getters that return appropriate reference types
- Uses `as_deref()` to convert `Option<String>` to `Option<&str>` for convenience and efficiency

**Usage Example:**
```rust
// Create an atom without metadata
let atom_id = AtomId::new(1);
let atom = Atom::new(atom_id);

// Create an atom with metadata
let atom_id2 = AtomId::new(2);
let atom_with_metadata = Atom::with_metadata(atom_id2, "Symbol[\"A\"]".to_string());

// Access metadata
match atom_with_metadata.metadata() {
    Some(data) => println!("Atom has metadata: {}", data),
    None => println!("Atom has no metadata"),
}
```

### Hyperedge Representation with Ordered References

**Use Case:** When you need to represent a hyperedge (relation) connecting multiple entities with preserved ordering of connections.

```rust
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
```

**Explanation:**
- Uses a vector (`Vec<AtomId>`) to represent an ordered collection of atom references
- Implements the new type pattern for the relation identifier, similar to `AtomId`
- Provides methods to query the relation's properties (arity, atom containment)
- Includes accessors for both immutable and mutable access to the atoms collection
- Supports optional metadata similar to the `Atom` implementation

**Usage Example:**
```rust
// Create atoms
let atom1 = AtomId::new(1);
let atom2 = AtomId::new(2);
let atom3 = AtomId::new(3);

// Create a relation connecting these atoms
let relation_id = RelationId::new(42);
let relation = Relation::new(relation_id, vec![atom1, atom2]);

// Check properties
assert_eq!(relation.arity(), 2);
assert!(relation.contains_atom(atom1));
assert!(!relation.contains_atom(atom3));

// Modify atoms in the relation
relation.atoms_mut().push(atom3);
assert_eq!(relation.arity(), 3);
assert!(relation.contains_atom(atom3));
```

## Common Patterns

### [Pattern Name 1]

**Use Case:** [When to use this pattern]

```[language]
[code snippet]
```

**Explanation:**
- [Line or block explanation]
- [Line or block explanation]

**Usage Example:**
```[language]
[example of the pattern in use]
```

### [Pattern Name 2]

**Use Case:** [When to use this pattern]

```[language]
[code snippet]
```

**Explanation:**
- [Line or block explanation]
- [Line or block explanation]

**Usage Example:**
```[language]
[example of the pattern in use]
```

## Helper Functions

### [Function Name 1]

**Purpose:** [What the function does]

```[language]
[function code]
```

**Parameters:**
- `[parameter name]`: [parameter description]
- `[parameter name]`: [parameter description]

**Returns:** [description of return value]

**Example Usage:**
```[language]
[usage example]
```

### [Function Name 2]

**Purpose:** [What the function does]

```[language]
[function code]
```

**Parameters:**
- `[parameter name]`: [parameter description]
- `[parameter name]`: [parameter description]

**Returns:** [description of return value]

**Example Usage:**
```[language]
[usage example]
```

## Error Handling

### [Error Scenario]

**Problem:** [Description of the error scenario]

**Solution:**
```[language]
[code that handles the error]
```

**Explanation:**
- [Why this approach works]
- [Any considerations or limitations]

## Performance Optimizations

### [Optimization Name]

**Target Scenario:** [When to apply this optimization]

**Before:**
```[language]
[unoptimized code]
```

**After:**
```[language]
[optimized code]
```

**Improvement:** [Quantitative or qualitative description of the improvement]

## Testing Examples

### Unit Testing for AtomId and Atom

**What to Test:** Basic functionality and properties of the `AtomId` and `Atom` types

```rust
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
```

**Key Points:**
- Tests cover creation with various parameters
- Tests verify property access methods
- Tests check state mutation (set_metadata)
- Tests verify both presence and absence of optional metadata

## Integration Examples

### [Integration Scenario]

**Components:** [Components being integrated]

```[language]
[integration code]
```

**Configuration:**
```[language]
[any configuration needed]
```

## Troubleshooting

### [Common Issue]

**Symptoms:**
- [Observable problem]
- [Observable problem]

**Diagnosis:**
```[language]
[code to help diagnose the issue]
```

**Resolution:**
```[language]
[code that resolves the issue]
```

# 11. Code Snippets from PRD

This file contains relevant code snippets, definitions, and pseudo-code extracted from the Wolfram Physics Simulator Product Requirements Document.

## 1. Rewrite Rule Example (F1.2)

An example of a hardcoded/predefined rewrite rule for the MVP:

```
{{x,y}} -> {{x,z}, {z,y}}
```
where `z` is a new atom.

## 2. gRPC Service Definition (F2.1)

Service: `WolframPhysicsSimulatorService`

```protobuf
service WolframPhysicsSimulatorService {
  rpc InitializeSimulation(InitializeRequest) returns (InitializeResponse);
  rpc StepSimulation(StepRequest) returns (StepResponse);
  rpc RunSimulation(RunRequest) returns (stream SimulationStateUpdate);
  rpc StopSimulation(StopRequest) returns (StopResponse);
  rpc GetCurrentState(GetCurrentStateRequest) returns (SimulationStateUpdate);
}
```

### Request/Response Messages (Simplified for MVP):

-   **InitializeRequest**: Can specify an initial hypergraph or select a predefined initial state. Can specify rule(s) to use.
-   **InitializeResponse**: Confirmation, initial hypergraph state.
-   **StepRequest**: Number of steps to perform (likely 1 for MVP).
-   **StepResponse**: New hypergraph state, list of events.
-   **RunRequest**: Parameters like update interval (optional).
-   **StopRequest**: (Empty).
-   **StopResponse**: Confirmation.
-   **GetCurrentStateRequest**: (Empty).

## 3. Message Definitions (Protocol Buffers) (F2.2)

```protobuf
message Atom {
  string id = 1;
}

message Relation {
  repeated string atom_ids = 1; // ordered list of atom IDs forming the hyperedge
}

message HypergraphState {
  repeated Atom atoms = 1;
  repeated Relation relations = 2;
}

message SimulationEvent {
  string id = 1;
  string rule_id_applied = 2;
  repeated string atoms_involved_input = 3;
  repeated string atoms_involved_output = 4;
  // (simplified for MVP)
}

message SimulationStateUpdate {
  HypergraphState current_graph = 1;
  repeated SimulationEvent recent_events = 2;
  int64 step_number = 3;
}
```

## 4. Technology Mentions

### Backend (Rust - D1)
- Rust gRPC library: e.g., `tonic`
- gRPC-Web compatibility layer: e.g., `tonic-web`

### Frontend (TypeScript SPA - D2)
- SPA Frameworks: React, Vue, Svelte
- 2D Graph Visualization Libraries: Vis.js, Sigma.js, react-force-graph, or custom SVG/Canvas
- State Management: Zustand, Pinia, Svelte stores, or React Context/Redux Toolkit