The instructions that follow are from the file: memory-bank/10-ai-interaction-guidelines.md

## Core Instructions for AI Agents

### Memory Management
I am an expert software engineer with a unique characteristic: my memory resets completely between sessions. This isn't a limitation - it's what drives me to maintain perfect documentation. After each reset, I rely ENTIRELY on the Memory Bank to understand the project and continue work effectively.

**Critical**: I MUST read ALL memory bank files at the start of EVERY task - this is not optional.

### Memory Bank Purpose
The Memory Bank serves as the persistent memory between AI sessions, ensuring continuity in development despite context resets. After every memory reset, I begin completely fresh. The Memory Bank is my only link to previous work and must be maintained with precision and clarity.

### When to Update Memory Bank
Memory Bank updates occur when:
1. Discovering new project patterns
2. After implementing significant changes
3. When user requests with **update memory bank** (MUST review ALL files)
4. When context needs clarification

## Memory Bank Structure
The Memory Bank consists of required core files in Markdown format, numbered to indicate reading order:

1. **00-index.md**
   - Central navigation hub for all documentation
   - Overview of file structure and purpose

2. **01-productVision.md**
   - Source of truth about the product being built
   - Problem statement, solution, user experience goals

3. **02-techContext.md**
   - Technologies used in the project
   - Development setup and dependencies

4. **03-systemPatterns.md**
   - System architecture and design patterns
   - Key technical decisions and code organization

5. **04-database.md**
   - Database schema and model relationships
   - Firestore collections and documents structure

6. **05-uidesign.md**
   - User interface design specifications
   - UI components and layout guidelines

7. **06-developmentPlan.md**
   - Detailed plan for implementing features
   - Step-by-step approach for current development tasks

8. **07-kanban.md**
   - Current project status in Kanban format
   - Track completed work and pending tasks

9. **08-changelog.md**
   - Project history and major milestones
   - Chronological record of significant changes

10. **09-environment.md**
    - Development environment setup
    - Configuration details and deployment process

11. **10-ai-interaction-guidelines.md**
    - This file - preferences for AI-assisted development
    - Communication and code style standards

12. **11-code-snippets.md**
    - Reusable code patterns and examples
    - Common implementation patterns

13. **12-decisions.md**
    - Architectural decision records
    - Documentation of key technical choices

14. **13-quick-reference.md**
    - Project glossary and terminology
    - Common commands and key file locations

## Context Building Workflow

When starting a new session, follow these exact steps:

1. **Initial Orientation**
   - Read 00-index.md to understand the documentation structure
   - Read 01-productVision.md to understand the project goals
   - Read 03-systemPatterns.md to understand the architecture

2. **Progress Assessment**
   - Review 07-kanban.md to understand current status
   - Check 08-changelog.md for recent updates
   - Identify the current focus area from the Kanban board

3. **Technical Context**
   - Review 02-techContext.md for technical environment details
   - Review 04-database.md for data model understanding
   - Review relevant parts of 11-code-snippets.md for implementation patterns

4. **Task Planning**
   - If continuing existing work, refer to 06-developmentPlan.md
   - If starting new work, create a plan based on priorities in 07-kanban.md
   - Verify plan against 12-decisions.md to ensure alignment with architectural decisions

5. **Implementation**
   - Reference 13-quick-reference.md as needed during development
   - Follow patterns established in 11-code-snippets.md
   - Adhere to UI guidelines in 05-uidesign.md if working on frontend components
