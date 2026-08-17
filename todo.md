# GraphOps TODO

- [ ] Use English for every user-facing string across the game.
- [ ] Write all 25 stage titles, narratives, objectives, hints, failure states, and success states in English.
- [x] Keep node labels, tool names, graph status messages, logs, score labels, and onboarding copy in English.
- [x] Use English-only navigation and mode names: Build and Fix.
- [x] Ensure Telegram Mini App and standalone web layouts share the same English interface.
- [ ] Add responsive mobile layouts for Telegram viewport sizes without truncating English labels.
- [x] Add accessible English tooltips and keyboard/focus states for graph nodes and controls.
- [ ] Verify there are no Persian, placeholder, or mixed-language strings before delivery.

## Interaction Fix Pass

- [ ] Reproduce and document why graph nodes cannot currently be dragged.
- [x] Add pointer and touch dragging with clamped node positions.
- [x] Add visible input/output ports and a clear connection gesture.
- [x] Add connection preview, valid-target highlighting, and invalid-connection feedback.
- [x] Make node palette visible, scrollable, and usable on desktop and mobile.
- [x] Add a short English interaction hint explaining drag, connect, and remove.
- [x] Test Build mode by creating and running a valid graph.
- [x] Test Fix mode by repairing a broken edge and running the simulation.
- [x] Re-run type-check, build, and representative interaction screenshots.

## Player-Path Regression

- [ ] Start Stage 01 from a clean reset and follow the visible objective as a first-time player.
- [ ] Verify whether the default Fix graph can be repaired using only the controls exposed in the UI.
- [ ] Verify whether Build mode exposes a complete, understandable path to a successful run.
- [x] Ensure the validator matches the graph the player can actually construct.
- [x] Ensure a successful run visibly unlocks or advances to the next stage.
- [x] Test the complete player path again after the logic fix.

## Paper Lab Redesign

- [x] Replace the dark neon command deck with a white paper-and-blue-grid classroom canvas.
- [x] Use hand-drawn black node outlines, playful imperfect geometry, blue pen connectors, and simple paper shadows.
- [x] Remove unnecessary HUD density, glow, technical jargon, and complex control surfaces.
- [ ] Rework the game into exactly 16 English stages: 8 Build and 8 Fix.
- [ ] Make each stage teach one LangGraph idea with one clear goal and one visible success condition.
- [x] Add a friendly onboarding cue suitable for a 15-year-old learner.
- [x] Keep the graph interaction simple: add, drag, connect, undo/reset, and run.
- [x] Test the first Build and first Fix stage as a new player before delivery.

## Full Player Logic Audit

- [ ] Play at least two Build stages from a clean reset, including one with a Check or Approval.
- [ ] Play at least two Fix stages from a clean reset, including one with a retry or stop rule.
- [ ] Verify every visible objective matches the graph the player can actually build or repair.
- [ ] Verify that starting graphs are intentionally solvable and not accidentally misleading.
- [ ] Verify that valid routes do not leave stale duplicate edges behind.
- [ ] Verify that invalid routes explain one concrete next action.
- [ ] Verify stage progression, progress count, reset behavior, and mode labels.
- [ ] Fix all issues discovered during actual play, then re-run the same scenarios.

## Clarity and Delight Redesign

- [x] Remove Start and Finish as visible teaching nodes; use a clear entry card and success target instead.
- [ ] Make each node explain itself with a friendly title, one-line job, and playful visual cue.
- [ ] Replace ambiguous node labels with concrete actions such as Read message, Check amount, Ask owner, Send reward, and Stop.
- [ ] Redesign graph connections so blue pen lines begin and end exactly at visible port centers.
- [x] Keep connections behind nodes, use smooth orthogonal or curved paths, and show a clear active target while connecting.
- [x] Add a visible close/delete control to every user-created node and a simple undo/reset action.
- [x] Prevent accidental duplicate edges and make invalid connections explain why they are rejected.
- [ ] Rewrite all 16 missions around memorable everyday agent stories with one clear challenge each.
- [ ] Add playful feedback, concrete win conditions, and short explanations suitable for a 15-year-old learner.
- [x] Play the revised first Build and Fix missions from a clean session before delivery.

## Friendly Sounds and Path Lines

- [x] Use the friendly in-game term “blue pen lines” for graph connections, with “connections” in the help text.
- [x] Add a mute/unmute control and respect the browser's first-interaction audio policy.
- [ ] Add a soft node-tap sound with a short wooden or paper-like character.
- [ ] Add a tiny tick when a connection starts and a gentle pop when a blue pen line is completed.
- [ ] Add a quiet wobble/error sound for invalid connections and a short warm success jingle.
- [x] Keep every sound under a comfortable volume and gate sound effects behind a user setting.
- [ ] Test sounds on node click, connection start, connection completion, invalid target, delete, reset, and success.

## Agentic Payments: 10-Stage Rebuild

- [x] Verify the official name and visual treatment of the requested hardware wallet before mentioning a brand or model.
- [x] Reduce the curriculum to exactly 10 payment-only missions: 5 Build and 5 Fix-after-attack.
- [x] Add a distinct AI Agent node and ensure it appears only when the specific mission needs it.
- [x] Add a hardware-wallet signing node with a generic fallback if an official product name cannot be verified.
- [x] Give every mission a stage-specific palette, objective, attack story, success route, and failure explanation.
- [x] Build five end-to-end payment flows: reward, reimbursement, vendor invoice, subscription renewal, and group payout.
- [x] Build five repair scenarios: prompt injection, recipient swap, duplicate payment, approval bypass, and malicious tool response.
- [x] Make the Fix mode visually show what was attacked and what the player must restore.
- [ ] Play every Build and Fix mission from a clean reset and confirm that the route, validator, score, and next-stage transition agree.

## Next Interaction Quality Pass

- [x] Add keyboard controls and visible focus states for node cards, ports, close buttons, palette cards, and graph actions.
- [ ] Add actual tooltips or a compact help popover for node controls and port actions.
- [x] Render a live blue-pen preview line while connecting and highlight valid target ports.
- [x] Show a specific inline explanation when a connection is rejected.
- [x] Add Undo for the last add, remove, connect, or move action.
- [ ] Refine Paper Playground marks and shadows so the board feels intentionally hand-drawn, not dashboard-perfect.
- [x] Add explicit duplicate-edge guards and verify them in the browser.

## August 2026 Completion Record

- [x] Add `player_progress` schema/table with user-stage-mode uniqueness and safe non-destructive database migration.
- [x] Add protected tRPC procedures for loading and saving authenticated stage progress, scores, and attempts.
- [x] Add deterministic tests covering the intended safe route for all 10 payment missions and broken Fix starts.
- [x] Manually verify duplicate-edge prevention in the browser and record the player-path result in MEMORY.md.
