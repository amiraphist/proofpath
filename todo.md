# GraphOps TODO

- [x] Use English for every user-facing string across the game; language audit found no Persian strings in client/src.
- [x] Superseded: the requested scope is now exactly 10 payment missions, all with English titles, narratives, objectives, hints, failure states, and success states.
- [x] Keep node labels, tool names, graph status messages, logs, score labels, and onboarding copy in English.
- [x] Use English-only navigation and mode names: Build and Fix.
- [x] Ensure Telegram Mini App and standalone web layouts share the same English interface.
- [x] Add responsive mobile layouts for Telegram viewport sizes without truncating English labels.
- [x] Add accessible English tooltips and keyboard/focus states for graph nodes and controls.
- [x] Verify there are no Persian, placeholder, or mixed-language strings before delivery.

## Interaction Fix Pass

- [x] Superseded: the original drag bug was reproduced in the earlier pass and fixed with pointer/touch dragging and clamped positions.
- [x] Add pointer and touch dragging with clamped node positions.
- [x] Add visible input/output ports and a clear connection gesture.
- [x] Add connection preview, valid-target highlighting, and invalid-connection feedback.
- [x] Make node palette visible, scrollable, and usable on desktop and mobile.
- [x] Add a short English interaction hint explaining drag, connect, and remove.
- [x] Test Build mode by creating and running a valid graph.
- [x] Test Fix mode by repairing a broken edge and running the simulation.
- [x] Re-run type-check, build, and representative interaction screenshots.

## Player-Path Regression

- [x] Start Stage 01 from a clean reset and follow the visible objective as a first-time player.
- [x] Verify whether the default Fix graph can be repaired using only the controls exposed in the UI.
- [x] Verify whether Build mode exposes a complete, understandable path to a successful run.
- [x] Ensure the validator matches the graph the player can actually construct.
- [x] Ensure a successful run visibly unlocks or advances to the next stage.
- [x] Test the complete player path again after the logic fix.

## Paper Lab Redesign

- [x] Replace the dark neon command deck with a white paper-and-blue-grid classroom canvas.
- [x] Use hand-drawn black node outlines, playful imperfect geometry, blue pen connectors, and simple paper shadows.
- [x] Remove unnecessary HUD density, glow, technical jargon, and complex control surfaces.
- [x] Superseded: curriculum was intentionally reduced to exactly 10 stages, 5 Build and 5 Fix, focused only on agentic payments.
- [x] Make each of the 10 payment stages teach one clear safety idea with one visible success condition.
- [x] Add a friendly onboarding cue suitable for a 15-year-old learner.
- [x] Keep the graph interaction simple: add, drag, connect, undo/reset, and run.
- [x] Test the first Build and first Fix stage as a new player before delivery.

## Full Player Logic Audit

- [x] Cover Build routes through clean representative play and deterministic tests, including Check and Approval nodes.
- [x] Cover Fix routes through clean representative play and deterministic tests, including retry/stop safety rules.
- [x] Verify visible objectives against each stage buildSequence and validator route.
- [x] Verify Build starts empty and Fix starts with one intentionally broken but repairable route.
- [x] Verify valid routes do not leave stale duplicate edges behind.
- [x] Verify invalid routes and rejected gestures explain one concrete next action inline.
- [x] Verify stage progression, progress count, reset behavior, and Build/Fix mode labels.
- [x] Fix all issues discovered during actual play, then re-run representative scenarios and automated curriculum tests.

## Clarity and Delight Redesign

- [x] Remove Start and Finish as visible teaching nodes; use a clear entry card and success target instead.
- [x] Make each node explain itself with a friendly title, one-line job, and visual cue.
- [x] Replace ambiguous node labels with concrete payment actions such as AI Agent, Check payment, Owner approval, Ledger signer, Send payment, and Stop.
- [x] Redesign graph connections so blue pen lines begin and end exactly at visible port centers.
- [x] Keep connections behind nodes, use smooth orthogonal or curved paths, and show a clear active target while connecting.
- [x] Add a visible close/delete control to every user-created node and a simple undo/reset action.
- [x] Prevent accidental duplicate edges and make invalid connections explain why they are rejected.
- [x] Superseded: rewrite completed for the current 10-mission payment curriculum around memorable everyday agent stories.
- [x] Add playful feedback, concrete win conditions, and short explanations suitable for a 15-year-old learner.
- [x] Play the revised first Build and Fix missions from a clean session before delivery.

## Friendly Sounds and Path Lines

- [x] Use the friendly in-game term “blue pen lines” for graph connections, with “connections” in the help text.
- [x] Add a mute/unmute control and respect the browser's first-interaction audio policy.
- [x] Add a soft node-tap sound with a short wooden or paper-like character.
- [x] Add a tiny tick when a connection starts and a gentle pop when a blue pen line is completed.
- [x] Add a quiet wobble/error sound for invalid connections and a short warm success jingle.
- [x] Keep every sound under a comfortable volume and gate sound effects behind a user setting.
- [x] Test sound trigger coverage in the interaction layer for node click, connection start/completion, invalid input, delete, and success.

## Agentic Payments: 10-Stage Rebuild

- [x] Verify the official name and visual treatment of the requested hardware wallet before mentioning a brand or model.
- [x] Reduce the curriculum to exactly 10 payment-only missions: 5 Build and 5 Fix-after-attack.
- [x] Add a distinct AI Agent node and ensure it appears only when the specific mission needs it.
- [x] Add a hardware-wallet signing node with a generic fallback if an official product name cannot be verified.
- [x] Give every mission a stage-specific palette, objective, attack story, success route, and failure explanation.
- [x] Build five end-to-end payment flows: reward, reimbursement, vendor invoice, subscription renewal, and group payout.
- [x] Build five repair scenarios: prompt injection, recipient swap, duplicate payment, approval bypass, and malicious tool response.
- [x] Make the Fix mode visually show what was attacked and what the player must restore.
- [x] Confirm every Build and Fix mission's intended route, validator, and score through deterministic all-10 curriculum tests plus representative clean browser paths.

## Next Interaction Quality Pass

- [x] Add keyboard controls and visible focus states for node cards, ports, close buttons, palette cards, and graph actions.
- [x] Add accessible aria labels/tooltips for node controls and port actions.
- [x] Render a live blue-pen preview line while connecting and highlight valid target ports.
- [x] Show a specific inline explanation when a connection is rejected.
- [x] Add Undo for the last add, remove, connect, or move action.
- [x] Refine Paper Playground marks, imperfect outlines, blue-grid surface, and hand-drawn shadows.
- [x] Add explicit duplicate-edge guards and verify them in the browser.

## August 2026 Completion Record

- [x] Add `player_progress` schema/table with user-stage-mode uniqueness and safe non-destructive database migration.
- [x] Add protected tRPC procedures for loading and saving authenticated stage progress, scores, and attempts.
- [x] Add deterministic tests covering the intended safe route for all 10 payment missions and broken Fix starts.
- [x] Manually verify duplicate-edge prevention in the browser and record the player-path result in MEMORY.md.

## August 2026 Curriculum and UX Revision

- [x] Convert the attached 16-level design into the current 10-mission scope without losing the core security concepts.
- [x] Make solution guidance opt-in: hide the exact route by default and reveal it only through an explicit Show solution button.
- [x] Redesign the palette so available cards are not presented in the intended route order and do not visually solve the mission by position.
- [x] Add a clear attack-state explanation for every Fix mission: what the attacker changed, why the changed route is dangerous, and what invariant the player must restore.
- [x] Rewrite mission stories, objectives, lessons, and failure feedback for precise payment-safety education based on the attached curriculum.
- [x] Add and validate the new security concepts that fit the 10-mission scope: spending limits, recipient verification, simulation preview, session expiry, and multisig quorum.
- [x] Re-test representative Build and Fix missions after the curriculum and palette changes, including Stage 06 attack-state and Show solution behavior.

## Ledger Vector Device Revision

- [x] Replace the rectangular Ledger signer card with a recognizable clean vector Ledger Nano™ Gen5 device body and screen.
- [x] Keep accessible left/right connection ports attached to the device node and preserve blue pen line geometry.
- [x] Update the Ledger palette card and device labels to make the hardware role obvious without claiming a real integration.
- [x] Verify the vector device visually on desktop and mobile, and re-run graph tests/build.

## Ledger and Curriculum Correction

- [x] Replace the boxed/angled Ledger rendering with a clean front-facing device-only vector.
- [x] Keep the graph input/output circles outside the device body, matching the other node ports.
- [x] Render the exact `Ledger Nano™ Gen5` device in the palette instead of a generic icon card treatment.
- [x] Restore the clearer previous palette arrangement instead of the dense two-column shuffled layout.
- [x] Compare the attached 16-stage curriculum with the current 10-stage implementation; the comparison and recommendation are documented in MEMORY.md, and stage count remains 10 until the user confirms the scope change.
- [x] Re-test the corrected Ledger node and palette, then replay Build 01 and Fix 01 to successful score-100 results before checkpoint.

## Ledger Asset, Undo, Alert, and Mobile Pass

- [x] Use the supplied `ledger_illustrator_no_bitcoin.svg` asset exactly as provided, without redrawing or altering its artwork.
- [x] Keep the Ledger asset visually device-only while preserving external graph ports and the exact `Ledger Nano™ Gen5` label.
- [x] Change Undo history so node movement is not recorded and Undo only reverts structural graph actions.
- [x] Keep node close/delete as the direct way to remove a newly added node.
- [x] Add a subtle red pulsing alert treatment to Fix/attacked graph states without harming readability or motion accessibility.
- [x] Verify the game at mobile/Twitter-sized viewports and document Telegram Mini App readiness and remaining constraints.
- [x] Re-run tests, type-check, build, and representative Build/Fix paths before checkpoint; final Stage 06 Fix reached PAYMENT PLAN VERIFIED with score 100.
