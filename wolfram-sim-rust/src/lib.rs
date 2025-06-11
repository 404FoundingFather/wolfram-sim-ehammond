//! Core library for the Wolfram Physics Simulator.
//! This library provides the fundamental data structures and algorithms for simulating
//! hypergraph evolution according to the Wolfram Physics Model.

pub mod hypergraph;
pub mod rules;

// For gRPC service generation
pub mod wolfram_physics_simulator {
    tonic::include_proto!("wolfram_physics_simulator");
} 