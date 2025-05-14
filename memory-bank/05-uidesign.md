# UI Design

**Last Updated:** May 14, 2025

This document outlines the user interface design principles, components, and layouts for the Wolfram Physics Simulator MVP.

## Design System

### Brand Identity
- **Primary Colors:** `#2c3e50` (Dark Blue/Charcoal), `#3498db` (Blue)
- **Secondary Colors:** `#ecf0f1` (Light Gray/Silver), `#95a5a6` (Medium Gray)
- **Typography:** Sans-serif (e.g., Open Sans, Lato, or system UI fonts) for readability. Monospace font for displaying rules or raw data.
- **Logo Usage:** (Placeholder for a simple project logo/icon if developed)

### Design Principles
- **Clarity:** The interface should clearly present the simulation state and controls.
- **Simplicity:** MVP focuses on core functionality; the UI should be uncluttered and intuitive.
- **Responsiveness (Visual):** The visualization should feel connected to the controls and update promptly.
- **Feedback:** Provide clear feedback for user actions (e.g., simulation started, stopped, error messages).

## Component Library

### Navigation Components
- N/A for MVP (Single-page application focus).

### Input Components
- **Button:** Standard buttons for "Initialize Simulation", "Step", "Run", "Stop", "Reset".
  - States: Default, Hover, Active, Disabled.
  - **Initial State:** "Initialize Simulation" enabled. "Step", "Run", "Stop", "Reset" initially disabled until a simulation is successfully initialized.
- **Select Dropdown / Simple Editor (for Initialization - F3.2):**
  - To choose a predefined initial hypergraph state OR potentially a very simple text-based input/editor for defining a small initial hypergraph (MVP focus on predefined).
  - To choose a predefined rewrite rule (from the hardcoded set).
- **Text Area / Input (for Rule Definition - F3.2, if `SetRules` gRPC is implemented):**
  - To allow users to input or modify rule definitions if this feature is included beyond hardcoded rules for MVP.
- **Number Input (Optional for Run):** To specify update interval for continuous run (defaults to a reasonable value if omitted).

### Display Components
- **Canvas/SVG Area:** Main area for 2D hypergraph visualization.
- **Text Label:** For displaying "Current Step Number", "Number of Atoms", "Number of Relations".
- **Status Message Area:** To show confirmations (e.g., "Simulation Initialized") or error messages (e.g., "Backend connection lost").

### Layout Components
- **Main Layout Container:** A two-column or top-bottom layout.
  - One area for controls and status information.
  - One (larger) area for the hypergraph visualization.

## Page Layouts

### Main Simulator Page

```
+--------------------------------------------------------------------+
| Wolfram Physics Simulator MVP                                      |
+--------------------------------------------------------------------+
| Controls & Status          | Visualization                       |
|----------------------------|-------------------------------------|
| [Initialize Section]       |                                     |
|   - Initial State: [Select/Editor] |                                     |
|   - Rule: [Select]         |                                     |
|   - [Initialize Button]    |                                     |
|   - (Optional Rule Input)  |                                     |
|                            |                                     |
| [Simulation Control]       |  [Hypergraph Visualization Area]    |
|   - [Run Button]           |  (Atoms as circles,                |
|   - [Stop Button]          |   relations as lines/connections)   |
|   - [Step Button]          |                                     |
|   - [Reset Button]         |                                     |
|                            |                                     |
| [Status Display]           |                                     |
|   - Step: [Number]         |                                     |
|   - Atoms: [Number]        |                                     |
|   - Relations: [Number]    |                                     |
|   - Message: [Text]        |                                     |
+----------------------------+-------------------------------------+
```

**Key Features:**
- All controls accessible in one primary view.
- Clear separation between controls and visualization.
- Real-time update of status display and visualization.

## User Flows

### Basic Simulation Flow
1.  **User selects/defines** an initial state using a dropdown or simple editor.
2.  **User selects** a predefined rewrite rule from a dropdown (or potentially inputs a rule if that feature is active).
3.  **User clicks** "Initialize Simulation" button.
    - System: Backend initializes, sends initial hypergraph state to frontend. Visualization updates.
4.  **User clicks** "Step" button.
    - System: Backend performs one simulation step, sends updated state. Visualization updates. Status (step number) updates.
5.  **User clicks** "Run" button.
    - System: Backend starts continuous simulation, streams state updates. Visualization updates continuously. Status updates.
6.  **User clicks** "Stop" button.
    - System: Backend stops continuous simulation. Visualization remains at the last state.
7.  **User clicks** "Reset" button.
    - System: Frontend clears the current visualization and status displays (step, atom/relation counts, messages). Backend is requested to reset its internal state to be ready for a new initialization (or simply the frontend stops interacting with the old simulation instance if the backend is stateless between distinct `InitializeSimulation` calls). The selected initial state and rule in the UI dropdowns remain unchanged. Simulation control buttons ("Step", "Run", "Stop") become disabled. "Initialize Simulation" button remains/becomes enabled.

### Error Flow (Example: Backend Connection Lost)
1.  User attempts an action (e.g., "Step").
2.  Frontend fails to communicate with the backend.
3.  System: Displays an error message in the "Status Message Area" (e.g., "Error: Could not connect to simulation engine.").
4.  Controls that require backend interaction (Step, Run, Stop, Initialize) may become disabled until the connection is restored.

## Responsive Design

### Breakpoints
- **Desktop:** Primary target (as per PRD Non-Goals for mobile responsiveness).

### Mobile Adaptations
- N/A for MVP. The layout will be designed for desktop browser use.

## Accessibility Considerations

### Standards Compliance
- Aim for WCAG 2.1 Level AA where feasible within MVP constraints.

### Specific Implementations
- **Color Contrast:** Ensure text and UI elements have sufficient contrast against their backgrounds (using the defined color palette).
- **Keyboard Navigation:** All interactive elements (buttons, selects) should be focusable and operable via keyboard.
- **Labels:** Inputs should have clear, associated labels.
- **Screen Reader Support:** Use semantic HTML elements where possible to aid screen readers.

## UI Assets

### Icons
- Consider simple, universally understood icons for Run (play), Stop (square), Step (arrow-right or similar) if desired, otherwise text labels are sufficient for MVP.

### Images/Illustrations
- N/A for MVP.

## Design Tools & Resources

- **Design Files:** N/A for MVP (this document and ASCII layout serve as the primary design guide).
- **Style Guide:** This document.
- **Prototypes:** N/A for MVP.