fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .compile(&["../proto/wolfram_physics.proto"], &["../proto"])?;
    Ok(())
} 