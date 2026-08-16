# GraphOps — Design Direction

## Approach 1: Neon Glass Circuit

**Very Brief Intro:** A dark, high-contrast training console where LangGraph nodes feel like living circuit components and every valid connection emits a controlled pulse of light. The mood is focused, technical, and game-like without becoming chaotic.

**Probability:** 0.07

## Approach 2: Paper Protocol Lab

**Very Brief Intro:** A bright editorial workspace inspired by engineering notebooks, incident reports, and annotated architecture diagrams. The experience feels calm, precise, and academically trustworthy.

**Probability:** 0.03

## Approach 3: Signal Garden

**Very Brief Intro:** A softer, atmospheric interface where graphs grow like branching systems and repairs restore color to damaged flows. The mood is curious and approachable, aimed at making systems thinking feel less intimidating.

**Probability:** 0.08

## Selected Direction: Neon Glass Circuit

### Design Movement

A contemporary fusion of **cybernetic interface design, glassmorphism, and technical game HUDs**, restrained by editorial information hierarchy. Neon is used as a semantic signal, not as decoration everywhere.

### Core Principles

1. **Every color means something.** Cyan is flow and connectivity, violet is reasoning, amber is human approval, red is failure or threat, and green is a verified outcome.
2. **Systems stay legible.** Nodes, edges, logs, and status badges must remain readable before glow or atmosphere is allowed to intervene.
3. **The interface reacts to causality.** A correct edge energizes the route; a failed node leaks red noise into the graph; a repair settles the system back into a quiet pulse.
4. **Complexity is revealed progressively.** The player sees only the controls needed for the current stage, with advanced concepts unlocked through play.

### Color Philosophy

The base is an ink-black blue (`#070B13`) rather than pure black, so panels can separate without heavy borders. The signature color is **electric cyan (`#38E8FF`)**, representing permissioned flow and observable state. Violet marks model reasoning, amber marks human judgment, red marks unsafe action, and green marks verified completion. Neon colors appear in edges, status dots, and focused controls; body text stays cool white or muted blue-gray for endurance.

### Layout Paradigm

The game uses a **three-zone command deck** rather than a centered dashboard. The left rail holds the mission and objective, the central stage is a wide graph canvas, and the right rail exposes the current tool palette and live execution trace. On mobile, these become a stacked sequence: mission header, graph viewport, tool drawer, and trace sheet. The graph is always the visual protagonist.

### Signature Elements

1. **Pulse Rails:** valid connections carry a short cyan pulse; blocked paths show a red stutter; repaired paths transition from red to cyan.
2. **Glass Node Cards:** each node is a compact translucent card with a semantic top accent, tiny type label, title, and port indicators.
3. **Incident Tape:** the execution log appears as a narrow stream of timestamped system events with monospace detail and human-readable explanations.

### Interaction Philosophy

The player should understand cause and effect through direct manipulation. Dragging from one port to another previews a route. Invalid connections fail gently with a specific reason. Removing a node feels like isolating a fault, not deleting content. Every action produces a visible graph change and a short log entry. Keyboard and touch interactions must behave consistently.

### Animation

Motion is compact and causal. Node entry uses a 180ms opacity-plus-translate transition. Edges use a 1.4s linear pulse only while a route is active. Errors use a brief 220ms red flicker on the affected node, never a full-screen shake. Success uses a 900ms cyan-to-green settle across the repaired path. Respect `prefers-reduced-motion` by replacing pulses with static accent states.

### Typography System

Use **Space Grotesk** for headings, stage titles, and score numbers; use **IBM Plex Mono** for node types, logs, IDs, and system statuses; use **Inter** only as a compact fallback for long explanatory copy. Headings are tight and assertive, body copy is short, and labels are sentence case rather than shouting in all caps.

### Brand Essence

**GraphOps is a playable systems lab for builders who want to understand how agents behave when the happy path breaks.**

Personality: **sharp, curious, accountable**.

### Brand Voice

Headlines are direct and slightly provocative. CTAs sound like an invitation to inspect a system, not a marketing funnel. Microcopy names the consequence of an action.

Example lines:

- **“The agent did exactly what you allowed. That is the bug.”**
- **“Repair the route. Then prove it can fail safely.”**

### Wordmark & Logo

The mark is a compact **split-node glyph**: two rounded square terminals joined by a broken cyan route, with a small amber bridge representing human approval. The wordmark uses a custom geometric treatment of `GRAPHOPS` with the `O` opened like a graph port. Never render the logo as plain text alone in the UI; pair the wordmark with the split-node mark.

### Signature Brand Color

**Electric Cyan — `#38E8FF`**. It is the recognizable GraphOps signal for a valid, observable route.

### File-Level Reminder

Every edited CSS, component, and page file must begin with a short comment reminding the implementer: **GraphOps uses Neon Glass Circuit; semantic neon, glass node cards, pulse rails, dark ink-blue surfaces, and an English-only technical game voice.**

## Style Decisions

- The first viewport must visibly open as a dark ink-blue command deck with the graph/circuit canvas as the main visual subject.
- Electric cyan `#38E8FF` is the primary observable-flow signal and appears first through routes, ports, focused controls, and key system states.
- Above-the-fold copy uses the GraphOps technical game voice: direct, consequence-aware, and system-specific.
