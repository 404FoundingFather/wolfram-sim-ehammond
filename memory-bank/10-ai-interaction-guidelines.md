# AI Interaction Guidelines

**Last Updated:** May 14, 2025

This document outlines guidelines for working with AI assistants (like GitHub Copilot, or other LLMs) on the Wolfram Physics Simulator MVP project.

## General Communication Preferences

### Response Style
-   **Concise but complete:** Provide enough information to be actionable, but avoid unnecessary verbosity.
-   **Technical depth:** Assume a knowledgeable software engineering audience. Explain complex or non-obvious concepts briefly.
-   **Formality:** Professional and direct.
-   **Explanations with code:** Always provide a brief explanation for code changes or suggestions, especially the "why."

### Context Sharing
-   **Reference Memory Bank:** Explicitly mention relevant memory bank files (e.g., "As per `01-productVision.md`...").
-   **PRD is Key:** The `docs/wolfram-sim-prd.md` is the primary source of truth for requirements.
-   **Current Task:** Clearly state the specific task or problem being addressed.

## Code Style Preferences

### Clean Code Requirements

All code generated or suggested by AI assistants MUST adhere to Clean Code principles:

1. **Readability First**: Prioritize human readability over cleverness or conciseness
   - Use clear variable and function names
   - Maintain consistent formatting
   - Avoid excessive nesting

2. **Simplicity**: Write simple, straightforward code
   - Solve the problem directly
   - Avoid premature optimization
   - Prefer explicit over implicit approaches

3. **Self-Documenting Code**: Code should primarily explain itself
   - Choose descriptive names over comments
   - Use comments only for "why" not "what"
   - Structure code logically to tell a story

4. **DRY (Don't Repeat Yourself)**: Avoid duplication
   - Extract repeated code into reusable functions
   - Maintain single sources of truth
   - Create abstractions only when they reduce duplication

5. **SOLID Principles**:
   - Single Responsibility: Each component does one thing well
   - Open/Closed: Open for extension, closed for modification
   - Liskov Substitution: Subtypes must be substitutable for base types
   - Interface Segregation: Many specific interfaces are better than one general interface
   - Dependency Inversion: Depend on abstractions, not implementations

6. **Small Units**: Keep functions and classes small and focused
   - Functions should do one thing
   - Classes should have a single responsibility
   - Files should be organized around a cohesive concept

7. **Meaningful Names**: Use intention-revealing names
   - Variables tell what they contain
   - Functions tell what they do
   - Classes tell what they represent

8. **Minimal Dependencies**: Limit coupling between components
   - Create clear boundaries between modules
   - Minimize shared state
   - Use dependency injection where appropriate

9. **Error Handling**: Handle errors meaningfully
   - Be specific about error types
   - Provide useful error messages
   - Fail fast and visibly

10. **Testable Code**: Generate code with testing in mind
    - Avoid global state
    - Make side effects explicit
    - Design for easy mocking/stubbing

### General Formatting
-   **Indentation:** Rust: `rustfmt` default (4 spaces). TypeScript: Prettier default (usually 2 spaces).
-   **Line length limits:** Aim for 100-120 characters, but prioritize readability over strict adherence.
-   **Casing conventions:** Rust: `snake_case` for functions, variables, modules; `PascalCase` for types, traits, enums. TypeScript: `camelCase` for functions, variables; `PascalCase` for classes, interfaces, types, enums.
-   **File/folder naming conventions:** `snake_case` for Rust files/modules; `kebab-case` or `PascalCase` (for components) for TypeScript files/folders.

### Language-Specific Standards
-   **Rust:** Adhere to `rustfmt` and Clippy lints. Follow standard Rust API guidelines.
-   **TypeScript:** Adhere to ESLint/Prettier configurations (to be set up). Use modern TypeScript features appropriately.
-   **Protocol Buffers (`.proto`):** Follow Google's Protobuf style guide (e.g., `snake_case` for field names, `PascalCase` for message and service names).

### Documentation Standards
-   **Rust:** Use `cargo doc` style comments (`///` for items, `//!` for modules).
-   **TypeScript:** Use JSDoc for functions, classes, and types.
-   **Comments:** Explain the "why" not the "what" if the code isn't self-explanatory. Avoid superfluous comments.

## AI Assistance Guidelines

### Recommended Use Cases
-   Boilerplate code generation (e.g., gRPC service/client setup, component shells).
-   Implementing algorithms based on clear specifications (e.g., pattern matching from PRD).
-   Writing unit tests.
-   Suggesting refactorings for clarity or to adhere to patterns.
-   Generating documentation stubs.
-   Researching library usage or API details.

### Limited Use Cases
-   Core architectural decisions (should be human-led, AI can provide options).
-   Complex, novel algorithm design (human oversight is critical).
-   Security-sensitive code (requires careful human review).
-   Final UI/UX design choices (AI can suggest, humans decide).

### Prompt Engineering Tips
-   Be specific: "Implement the `InitializeSimulation` RPC in Rust as per `wolfram_physics.proto` and `03-systemPatterns.md`."
-   Provide context: Include relevant snippets of code, PRD sections, or memory bank file names.
-   Iterate: Start with a broader request and refine with follow-up prompts.
-   Ask for alternatives if the first suggestion isn't ideal.

## Review Process

### AI-Generated Code Review
-   All AI-generated code must be reviewed by a human developer.
-   Verify correctness, adherence to project style, and fulfillment of requirements.
-   Check for edge cases or potential bugs.
-   Ensure generated tests are meaningful.

### Feedback Loop
-   If AI output is consistently problematic in a certain area, note it for future prompting strategy or manual intervention.
-   Use thumbs up/down or other feedback mechanisms if the AI tool provides them.

## Project-Specific Guidelines

### Domain Knowledge
-   Key concepts: Hypergraph, Atom, Relation, Rewrite Rule, Simulation Step (as defined in PRD and `13-quick-reference.md`).
-   The core logic revolves around graph theory and discrete evolution.

### Technical Context
-   Be mindful of the Rust backend / TypeScript frontend split.
-   gRPC is the primary communication mechanism.
-   MVP focus: simplicity and core functionality over premature optimization.

### Tools Integration
-   **Tool Usage:** Prefer `insert_edit_into_file` for applying changes. Use `get_errors` to validate after edits.
-   **File System:** Use provided tools to read files or list directories; don't assume file existence or content without checking.

## Memory Bank Updates

### Recommended Update Frequency
-   These AI interaction guidelines should be reviewed if interaction quality degrades or project needs change significantly.
-   Other memory bank files should be updated by the AI (with human review) when prompted after significant changes or new information is added to the PRD or by the user.

### Documentation of AI Contributions
-   For significant code blocks or architectural suggestions originating from AI, a brief comment like `// AI-assisted: [brief description of how AI helped]` can be useful for internal tracking if desired, but not strictly required for every minor completion.
-   Major AI contributions can be noted in commit messages if appropriate.

## Best Practices

-   Always adhere to Clean Code principles in all generated code.
-   When suggesting code refactoring, explain how it improves adherence to Clean Code principles.
-   Prioritize readability and maintainability over clever or highly optimized solutions, especially for MVP.
-   Balance Clean Code standards with project-specific requirements (e.g., performance needs if they arise post-MVP).
-   When in doubt about a code pattern, prefer the simpler, more readable approach.
-   **Verify, then trust:** Always review and test AI-generated code.
-   **Iterative refinement:** Use AI as a starting point and refine its output.