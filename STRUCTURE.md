# GraphOps Structure

## Frontend Composition

`client/src/App.tsx` owns the route and theme provider. `client/src/pages/Home.tsx` is the game shell. `client/src/components/GameCanvas.tsx` owns the full-screen visual surface and hosts the interactive graph board; the first implementation uses SVG/CSS graph rendering so node ports and touch gestures remain precise. A lightweight Babylon scene may provide the atmospheric background layer only if it does not compete with the graph controls.

## Game Modules

- `client/src/game/stages.ts`: typed definitions for all 25 English stages.
- `client/src/game/types.ts`: NodeType, GameMode, GraphNode, GraphEdge, StageState, and validation result types.
- `client/src/game/graphRules.ts`: deterministic connection rules and mode-specific validators.
- `client/src/game/simulator.ts`: simulated tool execution, incident generation, and event trace creation.
- `client/src/game/useGameSession.ts`: React hook for selected stage, mode, graph state, run state, score, hints, and reset.
- `client/src/game/graphLayout.ts`: stable initial positions and responsive layout helpers.

## UI Components

- `GameShell`: full-screen responsive layout and mode navigation.
- `MissionPanel`: stage title, story, objective, progress, score, and hint.
- `GraphBoard`: SVG edges, node cards, port interactions, selection, and repair state.
- `NodePalette`: available node cards grouped by semantic color.
- `ExecutionTrace`: compact log stream for each simulated run.
- `ResultBanner`: success, failure, and learning takeaway.
- `StagePicker`: 25-stage navigation with lock/completion states.

## Interaction Model

The MVP supports click-to-select and click-to-connect first, with drag preview as a progressive enhancement. Selecting a node highlights valid targets. Connections are validated on creation and can be removed through a small node action. The Run button executes a deterministic simulation and returns a result without real network or payment calls.

## Visual System

Dark ink-blue background, glass panels, semantic neon accents, SVG pulse rails, monospace trace labels, and English-only copy. The graph board remains the dominant surface. All interactions must have a focus state and a non-color explanation.
