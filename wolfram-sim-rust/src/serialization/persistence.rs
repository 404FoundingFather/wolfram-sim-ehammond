use std::fs;
use std::path::{Path, PathBuf};
use std::io::{self, Write};
use serde_json;

use crate::simulation::HypergraphState;

/// Result type for persistence operations.
pub type PersistenceResult<T> = Result<T, PersistenceError>;

/// Errors that can occur during persistence operations.
#[derive(Debug, thiserror::Error)]
pub enum PersistenceError {
    #[error("IO error: {0}")]
    Io(#[from] io::Error),
    
    #[error("JSON serialization error: {0}")]
    JsonSerialization(#[from] serde_json::Error),
    
    #[error("Invalid file path: {0}")]
    InvalidPath(String),
    
    #[error("File not found: {0}")]
    FileNotFound(String),
    
    #[error("Invalid hypergraph data: {0}")]
    InvalidData(String),
}

/// Configuration for save operations.
#[derive(Debug, Clone)]
pub struct SaveConfig {
    /// Whether to create directories if they don't exist
    pub create_directories: bool,
    
    /// Whether to overwrite existing files
    pub overwrite_existing: bool,
    
    /// Whether to format JSON with pretty printing
    pub pretty_print: bool,
}

impl Default for SaveConfig {
    fn default() -> Self {
        SaveConfig {
            create_directories: true,
            overwrite_existing: false,
            pretty_print: true,
        }
    }
}

/// Main persistence manager for hypergraph states.
#[derive(Debug)]
pub struct PersistenceManager {
    /// Default directory for saving hypergraphs
    default_save_directory: PathBuf,
}

impl PersistenceManager {
    /// Creates a new persistence manager with the default save directory.
    pub fn new() -> Self {
        Self::with_save_directory("saved_hypergraphs")
    }
    
    /// Creates a new persistence manager with a custom save directory.
    pub fn with_save_directory<P: AsRef<Path>>(save_directory: P) -> Self {
        PersistenceManager {
            default_save_directory: save_directory.as_ref().to_path_buf(),
        }
    }
    
    /// Saves a hypergraph state to a JSON file.
    /// If no path is provided, saves to the default directory with a generated filename.
    pub fn save_hypergraph_state(
        &self,
        state: &HypergraphState,
        path: Option<&Path>,
        config: Option<SaveConfig>,
    ) -> PersistenceResult<PathBuf> {
        let config = config.unwrap_or_default();
        
        // Determine the save path
        let save_path = match path {
            Some(p) => p.to_path_buf(),
            None => {
                // Generate a filename based on timestamp and step number
                let filename = format!(
                    "hypergraph_step_{}_{}_.json",
                    state.step_number(),
                    chrono::Utc::now().format("%Y%m%d_%H%M%S")
                );
                self.default_save_directory.join(filename)
            }
        };
        
        // Create parent directories if needed
        if config.create_directories {
            if let Some(parent) = save_path.parent() {
                fs::create_dir_all(parent)?;
            }
        }
        
        // Check if file exists and handle overwrite policy
        if save_path.exists() && !config.overwrite_existing {
            return Err(PersistenceError::InvalidPath(format!(
                "File already exists and overwrite is disabled: {}",
                save_path.display()
            )));
        }
        
        // Serialize the state
        let json_data = if config.pretty_print {
            serde_json::to_string_pretty(state)?
        } else {
            serde_json::to_string(state)?
        };
        
        // Write to file
        let mut file = fs::File::create(&save_path)?;
        file.write_all(json_data.as_bytes())?;
        file.flush()?;
        
        Ok(save_path)
    }
    
    /// Loads a hypergraph state from a JSON file.
    pub fn load_hypergraph_state<P: AsRef<Path>>(
        &self,
        path: P,
    ) -> PersistenceResult<HypergraphState> {
        let path = path.as_ref();
        
        // Check if file exists
        if !path.exists() {
            return Err(PersistenceError::FileNotFound(path.display().to_string()));
        }
        
        // Read file contents
        let json_data = fs::read_to_string(path)?;
        
        // Deserialize
        let state: HypergraphState = serde_json::from_str(&json_data)
            .map_err(|e| PersistenceError::InvalidData(format!("Failed to parse JSON: {}", e)))?;
        
        // Basic validation
        self.validate_hypergraph_state(&state)?;
        
        Ok(state)
    }
    
    /// Lists all JSON files in the default save directory.
    pub fn list_saved_hypergraphs(&self) -> PersistenceResult<Vec<PathBuf>> {
        if !self.default_save_directory.exists() {
            return Ok(Vec::new());
        }
        
        let mut files = Vec::new();
        
        for entry in fs::read_dir(&self.default_save_directory)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_file() && 
               path.extension().and_then(|s| s.to_str()) == Some("json") {
                files.push(path);
            }
        }
        
        // Sort by modification time (newest first)
        files.sort_by(|a, b| {
            let a_time = a.metadata().and_then(|m| m.modified()).unwrap_or(std::time::UNIX_EPOCH);
            let b_time = b.metadata().and_then(|m| m.modified()).unwrap_or(std::time::UNIX_EPOCH);
            b_time.cmp(&a_time)
        });
        
        Ok(files)
    }
    
    /// Deletes a saved hypergraph file.
    pub fn delete_hypergraph_file<P: AsRef<Path>>(&self, path: P) -> PersistenceResult<()> {
        let path = path.as_ref();
        
        if !path.exists() {
            return Err(PersistenceError::FileNotFound(path.display().to_string()));
        }
        
        fs::remove_file(path)?;
        Ok(())
    }
    
    /// Gets the default save directory.
    pub fn default_save_directory(&self) -> &Path {
        &self.default_save_directory
    }
    
    /// Sets a new default save directory.
    pub fn set_default_save_directory<P: AsRef<Path>>(&mut self, directory: P) {
        self.default_save_directory = directory.as_ref().to_path_buf();
    }
    
    /// Validates a hypergraph state for basic consistency.
    fn validate_hypergraph_state(&self, state: &HypergraphState) -> PersistenceResult<()> {
        // Check that all atom IDs in relations exist in the atoms list
        let atom_ids: std::collections::HashSet<_> = state.atoms().iter().map(|a| a.id()).collect();
        
        for relation in state.relations() {
            for atom_id in relation.atoms() {
                if !atom_ids.contains(atom_id) {
                    return Err(PersistenceError::InvalidData(format!(
                        "Relation {} references non-existent atom {}",
                        relation.id().value(),
                        atom_id.value()
                    )));
                }
            }
        }
        
        // Check that next_atom_id is greater than any existing atom ID
        if let Some(max_atom_id) = state.atoms().iter().map(|a| a.id().value()).max() {
            if state.next_atom_id() <= max_atom_id {
                return Err(PersistenceError::InvalidData(format!(
                    "next_atom_id ({}) must be greater than maximum existing atom ID ({})",
                    state.next_atom_id(),
                    max_atom_id
                )));
            }
        }
        
        // Check that next_relation_id is greater than any existing relation ID
        if let Some(max_relation_id) = state.relations().iter().map(|r| r.id().value()).max() {
            if state.next_relation_id() <= max_relation_id {
                return Err(PersistenceError::InvalidData(format!(
                    "next_relation_id ({}) must be greater than maximum existing relation ID ({})",
                    state.next_relation_id(),
                    max_relation_id
                )));
            }
        }
        
        Ok(())
    }
}

impl Default for PersistenceManager {
    fn default() -> Self {
        Self::new()
    }
}

/// Convenience functions for quick save/load operations.
impl PersistenceManager {
    /// Quick save function with default configuration.
    pub fn quick_save(&self, state: &HypergraphState, filename: &str) -> PersistenceResult<PathBuf> {
        let path = self.default_save_directory.join(filename);
        self.save_hypergraph_state(state, Some(&path), None)
    }
    
    /// Quick load function.
    pub fn quick_load(&self, filename: &str) -> PersistenceResult<HypergraphState> {
        let path = self.default_save_directory.join(filename);
        self.load_hypergraph_state(path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hypergraph::{Atom, Relation, AtomId, RelationId};
    use tempfile::TempDir;

    fn create_test_state() -> HypergraphState {
        let atoms = vec![
            Atom::new(AtomId::new(0)),
            Atom::new(AtomId::new(1)),
            Atom::new(AtomId::new(2)),
        ];
        let relations = vec![
            Relation::new(RelationId::new(0), vec![AtomId::new(0), AtomId::new(1)]),
            Relation::new(RelationId::new(1), vec![AtomId::new(1), AtomId::new(2)]),
        ];
        
        HypergraphState::new(atoms, relations, 5, 3, 2)
    }

    #[test]
    fn test_save_and_load_hypergraph_state() {
        let temp_dir = TempDir::new().unwrap();
        let persistence_manager = PersistenceManager::with_save_directory(temp_dir.path());
        
        let original_state = create_test_state();
        
        // Save the state
        let save_path = persistence_manager
            .save_hypergraph_state(&original_state, None, None)
            .unwrap();
        
        assert!(save_path.exists());
        
        // Load the state
        let loaded_state = persistence_manager
            .load_hypergraph_state(&save_path)
            .unwrap();
        
        // Verify they are equal
        assert_eq!(original_state, loaded_state);
    }
    
    #[test]
    fn test_quick_save_and_load() {
        let temp_dir = TempDir::new().unwrap();
        let persistence_manager = PersistenceManager::with_save_directory(temp_dir.path());
        
        let original_state = create_test_state();
        
        // Quick save
        let save_path = persistence_manager
            .quick_save(&original_state, "test_hypergraph.json")
            .unwrap();
        
        assert!(save_path.exists());
        
        // Quick load
        let loaded_state = persistence_manager
            .quick_load("test_hypergraph.json")
            .unwrap();
        
        assert_eq!(original_state, loaded_state);
    }
    
    #[test]
    fn test_list_saved_hypergraphs() {
        let temp_dir = TempDir::new().unwrap();
        let persistence_manager = PersistenceManager::with_save_directory(temp_dir.path());
        
        // Initially empty
        let files = persistence_manager.list_saved_hypergraphs().unwrap();
        assert_eq!(files.len(), 0);
        
        // Save some files
        let state = create_test_state();
        persistence_manager.quick_save(&state, "test1.json").unwrap();
        persistence_manager.quick_save(&state, "test2.json").unwrap();
        
        // Should now list 2 files
        let files = persistence_manager.list_saved_hypergraphs().unwrap();
        assert_eq!(files.len(), 2);
    }
    
    #[test]
    fn test_overwrite_protection() {
        let temp_dir = TempDir::new().unwrap();
        let persistence_manager = PersistenceManager::with_save_directory(temp_dir.path());
        
        let state = create_test_state();
        let path = temp_dir.path().join("test.json");
        
        // First save should succeed
        let result = persistence_manager.save_hypergraph_state(
            &state,
            Some(&path),
            Some(SaveConfig { overwrite_existing: false, ..Default::default() })
        );
        assert!(result.is_ok());
        
        // Second save should fail due to overwrite protection
        let result = persistence_manager.save_hypergraph_state(
            &state,
            Some(&path),
            Some(SaveConfig { overwrite_existing: false, ..Default::default() })
        );
        assert!(result.is_err());
        
        // Third save should succeed with overwrite enabled
        let result = persistence_manager.save_hypergraph_state(
            &state,
            Some(&path),
            Some(SaveConfig { overwrite_existing: true, ..Default::default() })
        );
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_validation_catches_invalid_references() {
        let temp_dir = TempDir::new().unwrap();
        let persistence_manager = PersistenceManager::with_save_directory(temp_dir.path());
        
        // Create invalid state where relation references non-existent atom
        let atoms = vec![
            Atom::new(AtomId::new(0)),
            Atom::new(AtomId::new(1)),
        ];
        let relations = vec![
            Relation::new(RelationId::new(0), vec![AtomId::new(0), AtomId::new(99)]), // Invalid reference
        ];
        
        let invalid_state = HypergraphState::new(atoms, relations, 0, 2, 1);
        
        // Save should work (we don't validate on save)
        let path = persistence_manager.quick_save(&invalid_state, "invalid.json").unwrap();
        
        // Load should fail validation
        let result = persistence_manager.load_hypergraph_state(&path);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), PersistenceError::InvalidData(_)));
    }
} 