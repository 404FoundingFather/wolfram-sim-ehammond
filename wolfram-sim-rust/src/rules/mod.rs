pub mod rule;
pub mod pattern;

// Re-export main types for convenience
pub use rule::{Rule, RuleId};
pub use pattern::{Pattern, Variable, Binding}; 