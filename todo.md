# ProofPath TODO

- [x] Use English for every user-facing string across the game; language audit found no Persian strings in client/src.
- [x] Superseded: the requested scope is now exactly 10 payment missions, all with English titles, narratives, objectives, hints, failure states, and success states.
- [x] Keep node labels, tool names, graph status messages, logs, score labels, and onboarding copy in English.
- [x] Use English-only navigation and mode names: Build and Fix.
- [x] Ensure desktop and mobile web layouts share the same English interface.
- [x] Add responsive mobile layouts without truncating English labels.
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
- [x] Verify the game at mobile and Twitter-sized browser viewports and document responsive constraints.
- [x] Re-run tests, type-check, build, and representative Build/Fix paths before checkpoint; final Stage 06 Fix reached PAYMENT PLAN VERIFIED with score 100.

## Attacker Semantics and 16-Stage Review

- [x] Make dragging the Ledger node work from the device image as well as its text/header area by disabling native image dragging and preserving pointer capture.
- [x] Add explicit compromised/attacker visual markers to malicious AI Agent nodes in Fix missions.
- [x] Add a Policy guard gate and deterministic validator path that isolates the attacker before the Ledger signer.
- [x] Update attack mission copy to explain that the attacker remains visible and is contained rather than silently deleted.
- [x] Re-read the attached 16-stage curriculum, restore it as the active scope, and document the migration in MEMORY.md.
- [x] Re-test the corrected Build/Fix routes, mobile layout, and all deterministic mission tests before checkpoint; Build 01 and Stage 09 Fix both reached PAYMENT PLAN VERIFIED with score 100.

## Attack-Event Fix Redesign

- [x] Replace attacker nodes in Fix start graphs with external attack-event context and flawed trusted-node routing.
- [x] Make every Fix solution add or restore a trusted control that blocks unsafe flow before signing or sending.
- [x] Keep the Ledger signer only in Fix stories where the unsafe route can reach a signing step; omit it from control-only containment stories, including Rogue Skill palette and repair route.
- [x] Rewrite Fix mission copy and safe-repair behavior so the player never solves a mission by deleting or isolating a hacker node.
- [x] Reduce the visible Ledger device size while preserving external connection ports and direct image dragging; direct SVG-image drag moved the Ledger node in browser verification.
- [x] Re-test all 16 deterministic routes plus representative Build/Fix and mobile player paths before checkpoint; Stage 01 Build, Stage 09 Fix, and Stage 13 containment each reached score 100.

## Independent Code Review Fixes

- [x] Make the broken Fix edge stage-aware so the red dashed cue identifies the true insertion or replacement point.
- [x] Clarify Stage 13 by explicitly instructing the player to remove the unsafe Send payment card before adding containment controls.
- [x] Add a permanent UI disclaimer stating that GraphOps is an unofficial educational simulation not affiliated with or endorsed by Ledger.
- [x] Update stale `GRAPH_DESIGNS.md` content so the documentation matches the 16-stage curriculum.
- [x] Align Policy guard ordering across relevant Fix stages.
- [x] Add regression tests that prove each Fix attack graph is broken at its true divergence and each deterministic repair resolves it.
- [x] Re-run browser, test, type-check, and production build after the review fixes.

## Mobile Floating Palette and Ledger Alignment

- [x] Add a floating collapsible Pencil Case button for narrow mobile viewports so node cards stay reachable beside the board.
- [x] Auto-close the mobile Pencil Case after adding a node and keep it keyboard accessible.
- [x] Tighten Ledger input/output port placement around the device body without changing the supplied SVG artwork.
- [x] Verify the mobile palette, Ledger connectivity, desktop layout, tests, and build before checkpoint.

## Mobile and Ledger Verification Gap Closure

- [x] Open the floating mobile Pencil Case behavior, add a node from it, and confirm the drawer auto-closes; browser interaction returned drawer closed and node count 1.
- [x] Play Build 01 after the latest port alignment: AI Agent → Ledger and Ledger → Send payment produced two valid edges and PAYMENT PLAN VERIFIED with score 100.
- [x] Perform an explicit desktop browser check confirming the side Pencil Case remains visible after mobile drawer changes.

## Mobile Nodes Orb Refinement

- [x] Remove the unnecessary Message enters and Safe result labels from the graph board.
- [x] Replace card wording with node wording in the empty-board instruction and mobile picker control.
- [x] Turn the mobile Nodes control into a draggable glass orb with a tap-to-open threshold.
- [x] Persist the mobile Nodes orb position on the player device and keep it within safe screen boundaries.
- [x] Verify tap-to-open, drag, persistence, and desktop layout before checkpoint.

## Nodes Orb Verification Gap Closure

- [x] Reload after dragging the Nodes orb and confirm its stored position is restored from localStorage.
- [x] Capture the post-change desktop layout and confirm the desktop Pencil Case remains visible while the mobile orb stays hidden.
- [x] Inspect the desktop-rendered UI and explicitly verify the side Pencil Case is visible while the mobile Nodes orb is hidden.

## Supplied Security Architecture Review

- [x] Map the supplied intelligence-versus-authority, policy, hardware enforcement, sealing, quorum, and containment principles to all 16 active missions.
- [x] Identify any stage whose build or Fix failure path lacks a clear external authority boundary or explicit deny/stop outcome.
- [x] Update stage copy, node semantics, documentation, and tests where the supplied material reveals a concrete educational gap.
- [x] Re-run curriculum tests, type-check, build, and representative player paths after any stage-design changes.
- [x] Add an Action seal control to Stage 15 so its Fix path teaches that approved amount, destination, action type, expiry, and one-time use are locked before hardware signing.
- [x] Place a real Owner approval immediately before Action seal in Stage 15 so the visual route matches the supplied post-approval sealing model.
- [x] Document a concise 16-stage mapping that links each mission to the supplied security principles and fail-closed authority boundary.
- [x] Record the authority-boundary review conclusion, including why Stage 15 was the only curriculum change required by this reference pass.

## Mobile Graph Viewport

- [x] Add pinch zoom to the mobile graph viewport with safe minimum and maximum scales.
- [x] Add two-finger pan to move the mobile graph viewport in every direction without moving nodes.
- [x] Preserve one-finger node dragging and port connection gestures without accidental viewport movement.
- [x] Add a compact mobile zoom reset/control affordance and concise gesture guidance.
- [x] Verify a crowded Fix mission on 390×844 plus desktop regression, automated tests, type-check, and production build.

## Mobile Movement Freedom

- [x] Remove the overly strict graph-node drag boundary so nodes can use the full virtual mobile working area.
- [x] Rework viewport pan bounds so a zoomed or wide mobile canvas can be centered anywhere the player needs.
- [x] Confirm two-finger zoom, blank-space panning, one-finger node movement, and port connections in mobile touch emulation after deployment.
- [x] Preserve desktop paper-board layout and run tests, type-check, and production build after the interaction fix.

## Final Brand Direction

- [x] Prepare concise English game-name options with Persian translations and a distinct logo direction for each.

## Interaction and Mobile Scroll Correction

- [x] Restore desktop node close buttons and blue-port path creation without gesture-layer interference.
- [x] Lower the mobile zoom-out floor to 30% while keeping pan bounds correct across all virtual canvas sizes.
- [x] Allow vertical page scrolling from Paper Path on mobile while retaining intentional node drag, blank-space pan, and pinch zoom.
- [x] Hide the Blue pen line / Needs fixing / Human choice legend on mobile.
- [x] Verify desktop close/connect actions, mobile scroll, 30% zoom, gesture behavior, tests, type-check, and production build.

## External QA Follow-up

- [x] Audit Stage 12’s attack and safe sequences against the one-cue repair engine.
- [x] Rebuild Stage 12 so its visible repair path has exactly one missing trusted-control insertion.
- [x] Add a regression test that locks the intended Stage 12 attack graph and safe repair path.
- [x] Write a self-hosting handoff note that distinguishes portable game logic from platform-managed auth and persistence scaffolding.
- [x] Re-run tests, type-check, build, and play Stage 12 through its repaired route.

## GitHub Handoff

- [x] Confirm the available GitHub connection and choose the destination repository.
- [x] Review repository metadata and ensure the current handoff and self-hosting notes are included.
- [x] Export the complete ProofPath project to GitHub without omitting required source directories.
- [x] Verify the repository’s files and provide the repository link and next-run instructions.
- [x] Use the approved ProofPath name in repository metadata and the GitHub handoff guidance.
- [x] Create the ProofPath GitHub repository as public under @amiraphist.

## ProofPath Rebrand

- [x] Replace all player-facing GraphOps naming with ProofPath in the header, browser title, footer, and accessibility labels.
- [x] Align package and repository metadata with ProofPath without altering curriculum or gameplay behavior.
- [x] Update brand and self-hosting documentation to call the product ProofPath while preserving legacy technical paths only where required.
- [x] Verify the desktop and mobile branded interface, tests, type-check, and production build.

## ProofPath Launch Pack

- [x] Create and integrate a Paper Playground ProofPath logo and favicon asset.
- [x] Build an independent static classroom edition that runs without managed auth, tRPC, database, or server dependencies.
- [x] Add complete local and free-host deployment instructions for the static edition.
- [x] Add an automated GitHub Pages workflow with a free `amiraphist.github.io/proofpath` path deployment.
- [x] Update the public GitHub repository with launch assets, static edition, and README guidance.
- [x] Verify the main app plus the static edition build, then validate deployed path configuration.

## Final Name Audit

- [x] Rename the legacy GraphOps TODO heading to ProofPath TODO and verify no player-facing or handoff title retains the old product name.

## Standalone Web Cleanup

- [x] Remove Telegram WebApp runtime calls and the external Telegram SDK script.
- [x] Remove Telegram and Mini App mentions from public documentation and product planning files.
- [x] Verify no Telegram or Mini App references remain in tracked code and handoff docs.
- [x] Re-run tests, type-check, production build, and public GitHub sync for the standalone web edition.

## English-only Repository Audit

- [x] Remove all Persian text from player copy, README, documentation, code comments, metadata, and repository handoff files.
- [x] Verify the tracked ProofPath project contains no Persian Unicode characters.
- [x] Re-run validation and sync the English-only cleanup to the public GitHub repository.

## GitHub Pages Launch

- [x] Publish the independent ProofPath static edition at `amiraphist.github.io/proofpath`.
- [x] Configure a Pages workflow that rebuilds and redeploys on updates to `main`.
- [x] Verify the live URL opens the playable standalone game from a clean browser session.
- [x] Permit the temporary static preview host so the standalone classroom can be visually smoke-tested before Pages deployment.
- [x] Fix the classroom entry route so the independent Vite root loads the game rather than a blank page.

## Stage 03 Safe-Route Validation Regression

- [x] Reproduce the accepted unsafe bypass where AI Agent can connect directly to Ledger beside the required Verify recipient route.
- [x] Enforce a single valid predecessor per input port and reject required-route bypasses or parallel unsafe paths.
- [x] Add a regression test proving Stage 03 only passes when verification is the sole path to Ledger.
- [x] Re-run the complete curriculum and publish the validator correction.

## Interaction QA Regression Pass

- [x] Reproduce click-to-connect, attempted drag-to-connect, rejected connection, edge removal, keyboard, and mobile port-targeting behavior.
- [x] Align all connection guidance with the supported interaction model and remove any misleading drag-to-connect instruction.
- [x] Make connection ports stationary with larger desktop/mobile hit targets and clear available/occupied states.
- [x] Add clear feedback for rejected connection attempts and a direct way to remove an incorrect blue pen line.
- [x] Give each palette add control an unambiguous accessible label and verify keyboard-first connection flow.
- [x] Add regression coverage, run desktop/mobile smoke tests, and publish the QA corrections.

## Mobile Scroll and Nodes Orb Regression

- [x] Reproduce page-scroll blocking or hang when swiping the Paper Path on a touch viewport.
- [x] Reproduce the Nodes orb tap path and identify why the mobile palette does not open.
- [x] Separate page scroll, graph pan/zoom, node drag, and orb tap gestures without blocking one another.
- [x] Add or extend touch regression coverage for scroll and Nodes orb open/close behavior.
- [x] Run mobile visual and interaction QA, then publish the correction.

## Live GitHub Pages Mobile Verification

- [x] Reproduce the reported Paper Path scroll and Nodes orb failure on the public GitHub Pages build in a clean mobile session.
- [x] Compare the deployed public asset revision and touch behavior against the local preview.
- [x] Apply the production-specific mobile correction and verify it survives the Pages deployment path.
- [x] Confirm the live mobile game scrolls and opens Nodes before closing the issue.

## Real-Device Mobile Regression Recovery

- [x] Compare the latest live touch and Nodes orb changes against the last user-confirmed mobile-stable checkpoint.
- [x] Revert only the regression-causing gesture handling while preserving safe graph behavior.
- [x] Verify the revised Pages build on a clean session and obtain user confirmation from iPhone and Android.

## Touch-Safe Nodes Picker Recovery

- [x] Isolate why the Vaul-based mobile Nodes drawer does not open from iPhone and Android touch input despite state changes in automated replay.
- [x] Replace the fragile mobile drawer trigger with a lightweight touch-safe picker independent from graph gesture handling.
- [x] Preserve a draggable glass Nodes orb while making a tap open the picker on Build and Fix stages.
- [x] Verify real-device tap, node selection, close behavior, and page scroll before resuming publication.

## Nodes Orb Drag Affordance Polish

- [x] Replace the prominent blue drag button beside the Nodes orb with a subtle glass-styled grab affordance.
- [x] Preserve separate, reliable tap-to-open and drag-to-move mobile behaviors.
- [x] Verify the refined orb in mobile layout and publish the visual polish.

## Invisible Nodes Orb Drag

- [x] Remove the visible drag grip beside the Nodes orb.
- [x] Make a short tap open Nodes and a deliberate long-press enable orb movement without adding visual clutter.
- [x] Verify tap, long-press drag, scroll, and node picker on mobile before publishing.

## External QA Score and Layout Pass

- [x] Reproduce the empty-board validation result and confirm score behavior is appropriate for zero progress.
- [x] Add regression coverage requiring a zero score for an empty unsafe graph.
- [x] Review desktop board density and palette overflow, preserving intentional space for draggable nodes.
- [x] Correct any confirmed palette clipping or layout imbalance without changing click-to-connect into drag-to-connect.
- [x] Re-run QA, desktop/mobile checks, and publish validated corrections.

## Tall Desktop Viewport Board Sizing

- [x] Reproduce board stretching at a 1280×1800 desktop viewport.
- [x] Cap desktop board height with a responsive clamp while retaining the mobile working area.
- [x] Verify normal desktop, tall desktop, and mobile layouts before publishing.

## Paper Playground Intro and Success Celebration

- [x] Design an opening screen with the ProofPath mark, short learning promise, paper-grid background, and a playful loading-to-start flow.
- [x] Make the intro responsive, accessible, skippable by keyboard, and non-blocking after the player has started a session.
- [x] Replace the dry success presentation with a paper-stamp celebration and an unambiguous Next mission action.
- [x] Preserve the existing score, progression save, sounds, and last-stage completion behavior.
- [x] Add regression coverage and verify intro, success, next-stage progression, desktop, and mobile before publishing.

## Intro Credit and Optical Centering

- [x] Add a subtle linked `@amiraphist` creator credit to the ProofPath intro.
- [x] Adjust the intro layout for optical centering on wide desktop viewports without shifting the mobile composition.
- [x] Verify wide desktop and mobile composition, then publish the polish.

## ProofPath X Launch Assets

- [x] Write a lowercase English launch thread with each post limited to 240 characters.
- [x] Create a social launch visual aligned with the Paper Playground ProofPath aesthetic.
- [x] Review the final launch copy and visual for public posting.

## Hardening Star Rating

- [x] Define stage-specific optional hardening controls without accepting unsafe bypasses as verified.
- [x] Add a 3–5 star rating to successful simulations and explain the player’s hardening level.
- [x] Add automated coverage for base verified routes and hardened routes.
- [x] Verify the result card on desktop and mobile, then publish the upgraded gameplay.

## Ledger Nano Gen5 Color Picker

- [x] Add a four-color picker for Jet Black, Cherry Red, Matcha Green, and Glacier White when a Ledger node is selected.
- [x] Preserve the supplied Ledger SVG file unchanged while applying the selected color as a visual device treatment.
- [x] Verify node dragging, ports, close behavior, and color selection on desktop and mobile.
