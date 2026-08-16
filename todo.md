# GraphOps TODO

- [ ] Use English for every user-facing string across the game.
- [ ] Write all 25 stage titles, narratives, objectives, hints, failure states, and success states in English.
- [ ] Keep node labels, tool names, graph status messages, logs, score labels, and onboarding copy in English.
- [ ] Use English-only navigation and mode names: Build and Fix.
- [ ] Ensure Telegram Mini App and standalone web layouts share the same English interface.
- [ ] Add responsive mobile layouts for Telegram viewport sizes without truncating English labels.
- [ ] Add accessible English tooltips and keyboard/focus states for graph nodes and controls.
- [ ] Verify there are no Persian, placeholder, or mixed-language strings before delivery.

## Interaction Fix Pass

- [ ] Reproduce and document why graph nodes cannot currently be dragged.
- [ ] Add pointer and touch dragging with clamped node positions.
- [ ] Add visible input/output ports and a clear connection gesture.
- [ ] Add connection preview, valid-target highlighting, and invalid-connection feedback.
- [ ] Make node palette visible, scrollable, and usable on desktop and mobile.
- [ ] Add a short English interaction hint explaining drag, connect, and remove.
- [ ] Test Build mode by creating and running a valid graph.
- [ ] Test Fix mode by repairing a broken edge and running the simulation.
- [ ] Re-run type-check, build, and representative interaction screenshots.

## Player-Path Regression

- [ ] Start Stage 01 from a clean reset and follow the visible objective as a first-time player.
- [ ] Verify whether the default Fix graph can be repaired using only the controls exposed in the UI.
- [ ] Verify whether Build mode exposes a complete, understandable path to a successful run.
- [ ] Ensure the validator matches the graph the player can actually construct.
- [ ] Ensure a successful run visibly unlocks or advances to the next stage.
- [ ] Test the complete player path again after the logic fix.

## Paper Lab Redesign

- [ ] Replace the dark neon command deck with a white paper-and-blue-grid classroom canvas.
- [ ] Use hand-drawn black node outlines, playful imperfect geometry, blue pen connectors, and simple paper shadows.
- [ ] Remove unnecessary HUD density, glow, technical jargon, and complex control surfaces.
- [ ] Rework the game into exactly 16 English stages: 8 Build and 8 Fix.
- [ ] Make each stage teach one LangGraph idea with one clear goal and one visible success condition.
- [ ] Add a friendly onboarding cue suitable for a 15-year-old learner.
- [ ] Keep the graph interaction simple: add, drag, connect, undo/reset, and run.
- [ ] Test the first Build and first Fix stage as a new player before delivery.
