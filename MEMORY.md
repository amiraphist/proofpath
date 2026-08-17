# GraphOps Memory

The desktop preview renders the full GraphOps interface correctly with the dark Neon Glass Circuit styling, English-only labels, glass node cards, colored ports, pulse rails, mission panel, tool palette, and incident tape.

An initial mobile screenshot capture returned a white frame, but the browser page view subsequently showed the React root and complete interface with no console errors. This indicates a capture timing/preview snapshot issue rather than a confirmed runtime render failure. The live page content is present and responsive rules are in place for narrow viewports.

The current MVP uses CSS/SVG-native graph rendering and a small ambient canvas rather than raster art because built-in image generation was unavailable at the daily quota limit. No real payment APIs or credentials are used; all runs are deterministic simulations.

## Interaction Fix Findings

The initial build had no pointer handlers on graph cards, no state API for moving nodes, and no user-facing port connection gesture. The palette existed structurally but lacked a clear interaction cue and could be easy to miss in a narrow viewport.

The fix pass now exposes node cards as draggable pointer targets, adds separate input/output port buttons with accessible labels, highlights input ports during a connection, adds a connection preview state, updates edges through `connectNodes`, and adds an in-game three-step guide: Drag → Output → Input. The palette now has an explicit AVAILABLE NODES heading, a Tap + to add cue, and a scroll boundary.

Browser verification shows all nodes expose drag/connection labels and the palette is visible. Clicking a palette Agent adds a new node and the node count increments from 6 to 7.

## Browser Interaction Verification

The live browser exposes separate input/output port buttons for every node and shows the instructional copy `Drag nodes · output → input to connect`. Clicking a palette card increments the node count and renders the new node. A synthetic pointer drag changed the Trigger node from its initial position to a new percentage position, proving the move state updates; the visual browser capture shows the Trigger node relocated lower in the graph. Port selection enters and exits the connection-preview state, and the graph displays route lines in the canvas.

## Final Interaction Test

After resetting the clean session, `Apply safe repair` inserted the Policy Check node before Verified End, and `Run simulation` returned `SYSTEM VERIFIED`, `Repair accepted. The graph now fails safely.`, progress `1 / 25`, and score `97`. The incident tape showed topology validation, policy pass, human approval, simulated tool commit, and audit close.

## Player-First Reproduction

Testing the published domain is blocked by Manus authentication, so the unauthenticated preview was used for the player-path test. From a clean Stage 01, the player sees an already-populated graph and clicks Run. The game returns `RUN BLOCKED — A route can repeat or still contains a broken edge.` with score 42, but the UI does not identify the broken edge, does not visually isolate the failing route, and does not explain the next concrete action. This is the core reason the game feels non-playable despite the controls existing.

The visible objective says `Insert a human approval before any money moves`, while the graph already contains a Human Approval node. The Fix shortcut is visible, but the intended player workflow is ambiguous: there is no clear indication whether to move nodes, reconnect the red edge, add Policy Check, or press Apply safe repair.

## Re-test Result After Player Fix

The revised first-stage player path was executed from a clean reload. Initial Run now explains the exact issue: `Broken route detected. Reconnect the red edge, then run again.` The visible objective also tells the player to insert a Policy Check before approval and run the safe payout route.

Clicking `Apply safe repair` now rebuilds the graph from `stage.buildSequence`, removes the duplicated agent, inserts the Policy Check in the correct order, and recreates all valid edges. Running afterward returns `SYSTEM VERIFIED`, score `100`, and the incident tape confirms topology, policy, human, tool, and end checks. Clicking `Next stage` advances to Stage 02 / 25.

## Paper Lab Redesign Player Test

The app was redesigned from Neon Glass Circuit to Paper Lab: white graph paper, pale blue grid, black hand-drawn node cards, blue pen connectors, friendly English copy, and 16 stages total. Stages 01–08 are Build; 09–16 are Fix.

Player test: Stage 01 started with Start and Finish. The player added Agent from the palette, connected Start output to Agent input and Agent output to Finish input, then ran the graph. An initial validator bug incorrectly checked the last array node for Finish; this was fixed to check node presence. After reload, Build 01 returned `SYSTEM VERIFIED`, score 100, and `Next stage` appeared.

Player test: Stage 09 was selected through the stage menu. `Apply safe repair` inserted the missing Check and rebuilt the route. Run returned `SYSTEM VERIFIED`, score 100, and `Nice repair. The route is safe.`

## Full Player Audit — Findings

While playing Stage 04 from a clean session, two logic/UX problems appeared. Build stages currently start with a blue Start→Finish edge, which makes the mission look already solved and forces the player to override an existing route. Newly added palette nodes also appear near the same right-side position, causing Check/Retry nodes to overlap and making a longer route hard to inspect or connect. These should be fixed before testing the longer Build stages again.

## Full Player Audit — Regression Result

After the fixes, Build 01 was replayed from a clean reload. It now starts with two unconnected nodes, Start and Finish, so the objective is honest. Agent was added, Start output connected to Agent input, Agent output connected to Finish input, and Run returned `SYSTEM VERIFIED`, score 100, with Next stage.

Fix 01 was then opened from the stage selector in a clean state. Apply safe repair inserted the missing Check and rebuilt the route. Run returned `SYSTEM VERIFIED`, score 100, with `Nice repair. The route is safe.`

The audit confirmed two real issues and fixed them: the misleading initial Build edge and overlapping palette-added nodes. The preview screenshot shows the revised paper layout and separated nodes.

## Paper Playground Clarity Pass

The graph model now uses visible action cards only; Start and Finish are no longer teaching nodes. The board shows friendly entry/target labels: Message enters and Safe result. Node cards use action-first language, always expose a close button, and explain their job in one line.

A Web Audio sound layer was added with tiny sine/triangle tones for palette tap, node tap, connection start, connection completion, invalid input, deletion, and success/error. A mute toggle is visible in the header.

Graph connections are now measured from the actual DOM card bounds so the SVG blue pen line starts at the real right-port center and ends at the real left-port center. The line is drawn behind cards. Stage 02 was played in preview: Read the message and Check the details were added, connected via the ports, and Test my idea returned SYSTEM VERIFIED with score 100. Close/remove was also tested successfully on a node.

A further spacing adjustment places added cards across the target route width rather than stacking them near each other.

## Friendly Sounds and Paper Path Verification

The final Paper Playground view now uses the terms PAPER PATH, PENCIL CASE, blue pen dots, Message enters, and Safe result. The header includes a sound toggle. The first Build mission is visually empty by design, with a clear objective and a visible card palette. A clean Stage 02 test added Read the message and Check the details, connected their ports, and passed Test my idea with SYSTEM VERIFIED and score 100. Node deletion worked from the always-visible close button. `pnpm check` and production build passed after the sound and interaction changes.

## Agentic Payments Rebuild Verification

The official Ledger product page confirms the product spelling **Ledger Nano™ Gen5**, a 2.8-inch touchscreen, and transaction-detail verification. GraphOps uses this only as a simulated secure-signer teaching card and does not claim an integration, affiliation, or real payment capability.

The new Build 01 payment mission was played through the UI: AI Agent → Check payment → Owner approval → Ledger Nano™ Gen5 → Send payment. The route completed with `PAYMENT PLAN VERIFIED` and score 100. The payment-specific stage card, distinct palette, hardware signer card, and 10-stage curriculum are rendering in the preview.

Fix 01 was also played from a clean stage selection. The initial state visibly had a fake second AI Agent in place of Check payment, matching the revised Prompt Injection alert and objective. Apply safe repair restored Check payment, and Test my idea completed with `PAYMENT PLAN VERIFIED`, score 100, and the message `Nice repair — the blue pen line is safe again.`


Morning audit notes: the direct Cryptomaan product page confirms the Nano Gen5 presentation used for the vector reference: a compact black hardware wallet with a large light touchscreen, lower control area, and side button. The in-game SVG is explicitly a simulated signer and avoids claiming hardware integration. The preview rendered the vector signer inside the graph card. Graph design was tightened: Stage 03 now has a Stop & flag decoy in its palette, and Stage 05 now uses Safe retry in the actual solution rather than duplicating the dedupe pattern. A missing retry shorthand was fixed; TypeScript is green again.


Morning UI audit: the help button now toggles `Show solution hint` / `Hide solution hint`. With hints hidden, Build 01 no longer shows the exact route; it says: `Choose only the cards this story needs, connect the blue dots, then test it.` The simplified labels now read NOTEBOOK OPEN, TODAY'S CHALLENGE, YOUR PAPER PATH, WHAT HAPPENED, and PAPER PLAYGROUND.

## 2026-08-17 Interaction Quality Pass

- Added keyboard behavior: Enter/Space selects a node, C starts an output connection, V joins an input, and Delete/Backspace removes a node. The board exposes these shortcuts in English and visible focus rings are styled.
- Added a live blue-pen preview path while connecting and a pulsing target highlight on candidate input ports.
- Added inline notices for duplicate edges, self-connections, input-before-output, successful connections, undo, removal, and safe repair.
- Added history snapshots for add, move, connect, remove, repair, and an Undo control.
- Added `player_progress` schema/table plus protected tRPC list/save procedures. Scores, attempts, mode, and completion are stored per authenticated user/stage/mode; anonymous play remains available.
- Added deterministic Vitest coverage for the intended safe path of all 10 missions and Fix starting-state broken routes. `pnpm test` reports 2 files / 3 tests passing.
- Manual duplicate-edge browser test passed: after AI Agent → Check payment was connected once, repeating the same output/input click displayed `That blue pen line is already there. Try a new path.` without adding another line.
- Final desktop screenshot confirmed the Paper Playground board, 10-stage payment curriculum, Ledger Nano™ Gen5 simulated signer card, Undo/Reset/Test controls, and keyboard guidance.

## Additional verification

- 2026-08-17: Fresh 390×844 Telegram-sized screenshot kept the Build/Fix switch, Undo, Reset, Test my idea, Paper Path, and Stage 01 labels readable; the layout stacks the mission and tool panels below the board instead of truncating them.
- 2026-08-17: Clean browser Stage 08 — Attack: Replay Button / Fix 03 was selected. Its attacked route showed duplicate AI Agent state and missing Block duplicates. `Apply safe repair` restored the duplicate lock, and `Test my idea` returned `PAYMENT PLAN VERIFIED`, `Nice repair — the blue pen line is safe again.`, score 100, with Next mission visible.
- 2026-08-17: The connection measurement now reads actual `.node-port--left` and `.node-port--right` DOM rectangles, so blue pen endpoints stay centered on visible port buttons after layout changes.

## Curriculum revision verification

- 2026-08-17: The attached 16-level design was translated into a tighter 10-stage scope: five Build lessons introduce small-tip signing, spending limits, full recipient verification, price/slippage plus simulation preview, and multisig quorum; five Fix lessons cover fake system update/prompt injection, address poisoning, infinite approval, stale approval replay, and missing multisig signatures.
- 2026-08-17: Fix stages now define explicit `attackSequence` data. Stage 06 visibly starts with two AI Agent cards, while its story says the attacker replaced Check payment; Stage 07 removes Recipient Verify, Stage 08 removes Simulate preview, Stage 09 removes Session expiry, and Stage 10 replaces Multisig quorum with one Owner approval.
- 2026-08-17: The solution guide is now opt-in. By default the mission shows a slightly blurred generic challenge inside a dashed box with `Show solution`; clicking it reveals the exact route and changes the control to `Hide solution`.
- 2026-08-17: Palette cards are deterministically shuffled and displayed as a two-column, hand-placed pencil-case grid with rotations and decoys, rather than a vertical sequence that mirrors the answer.
- 2026-08-17: Browser verification of Stage 06 confirmed the HACK ALERT, two-agent attacked graph, mixed palette, and successful Show solution reveal. Tests/build/check pass after the curriculum rewrite.

## Ledger device vector revision

- 2026-08-17: Replaced the generic Ledger signer rectangle with an inline SVG hardware device: angled dark shell, inset light transaction screen, Bitcoin mark, `Sign transaction to send payment?`, `Hold to sign`, `Reject`, page count, lower USB-style port, side button, and simulated-signer label.
- 2026-08-17: The node remains a true graph node. Its accessible left/right blue ports are still present on the device boundary, and the existing DOM-port measurement keeps edge endpoints centered on those ports.
- 2026-08-17: Desktop browser verification showed the device-shaped signer on the Paper Playground board with the correct title and accessible connection labels. The 390×844 mobile capture kept the board and navigation controls readable; the mission panel continues below the board as intended for Telegram-sized screens.

## Ledger correction pass

- 2026-08-17: Replaced the angled device-card treatment with a front-facing device-only SVG. The surrounding green node frame, background, and shadow are removed; only the device body, its small title/close control, and the two external graph port circles remain.
- 2026-08-17: The palette was restored from the dense two-column layout to the earlier readable single-column card arrangement. The Ledger palette entry now contains a miniature front-facing device SVG and the exact name `Ledger Nano™ Gen5`.
- 2026-08-17: Browser verification on Stage 01 showed the standalone front-facing Ledger device on the graph with accessible `Connect into Ledger Nano™ Gen5` and `Connect from Ledger Nano™ Gen5` controls. Tests, type-check, and production build passed.

## 16-stage curriculum comparison and scope decision

The attached 16-stage design is educationally stronger as a full course because its Build half introduces one new safety invariant at a time: hardware signing, spending limits, full recipient verification, price/slippage checks, owner approval, network/detail checks, multisig quorum, and simulation preview. Its Fix half also gives each attack a distinct mechanism: fake system update, address poisoning, infinite allowance, deepfake approval, rogue skill, stale session replay, preview/execution mismatch, and missing multisig quorum.

The current implementation keeps 10 missions because the earlier product requirement explicitly requested five Build and five Fix missions for a simpler first release. To preserve that simplicity, the current 10-stage set compresses the highest-value concepts into five Build lessons and five Fix attacks. Recommendation: keep the current 10-stage version as the playable MVP and treat the attached 16 stages as the next “Course mode” expansion, rather than silently replacing the existing progression. This keeps the user’s intended short game intact while preserving a precise path to the deeper curriculum.

## Post-correction gameplay verification plan

After the Ledger and palette correction, the representative Build path to replay is Stage 01: AI Agent → Ledger Nano™ Gen5 → Send payment → Test my idea. The representative Fix path is Stage 06: remove the fake second AI Agent, add Check payment, reconnect the broken edge, then Test my idea. Both paths must end in PAYMENT PLAN VERIFIED with score 100 before the corrected checkpoint is saved.

## Post-correction gameplay verification

- 2026-08-17: Build 01 was replayed after the visual correction from a clean Stage 01. The player added AI Agent, the front-facing Ledger Nano™ Gen5 device, and Send payment; connected AI Agent → Ledger → Send payment; ran `Test my idea`; and reached `PAYMENT PLAN VERIFIED` with score 100.
- 2026-08-17: Fix 01 / Stage 06 was selected after the same correction. Its attack state showed the inserted fake AI Agent, `Apply safe repair` replaced it with Check payment, and `Test my idea` reached `PAYMENT PLAN VERIFIED` with score 100.

## SVG, Undo, alert, and mobile pass

- 2026-08-17: The supplied `ledger_illustrator_no_bitcoin.svg` is now used unchanged as the exact asset for the graph device and the palette thumbnail. The previous inline redraw was removed. The graph node shows only the device image; the connection circles remain external and the exact `Ledger Nano™ Gen5` label remains accessible.
- 2026-08-17: Node movement is no longer saved into Undo history. Undo continues to cover structural actions such as add, connect, remove, and safe repair; a newly added card should be removed directly with its close button instead of treating a drag as an undoable action.
- 2026-08-17: Fix mode now applies a restrained red paper-alert pulse to the graph board and caption, with a reduced-motion fallback. Stage 06 browser verification showed the attacked graph and alert treatment without reducing text readability.
- 2026-08-17: The 390×844 mobile capture keeps the toolbar, graph board, entry/result markers, and legible paper-grid interaction visible, with the mission and palette continuing below the board. Telegram WebApp `ready`, `expand`, header color, and background color hooks are already present; the current deployment can serve as the web/Twitter link and Mini App shell, pending Telegram BotFather configuration and launch-link setup.

## Final Fix verification after exact asset pass

- 2026-08-17: After switching to the supplied unchanged SVG asset, removing movement from Undo history, and adding the subtle red Fix alert, Stage 06 was reopened from its attacked state. `Apply safe repair` replaced the fake AI Agent with Check payment, and `Test my idea` reached `PAYMENT PLAN VERIFIED` with score 100.

## Attacker semantics and 16-stage curriculum pass

- 2026-08-17: The attached 16-level design was restored as the active curriculum: eight Build missions introduce one payment-safety concept at a time, followed by eight Fix missions covering prompt injection, address poisoning, infinite approvals, deepfake approval, rogue skills, stale-session replay, preview/execution mismatch, and multisig bypass. The UI now reports `/ 16` and the selector contains all sixteen missions.
- 2026-08-17: Fake System Update now keeps the compromised AI Agent on the board as a red `COMPROMISED` / `ATTACKER NODE · ISOLATE` card. Safe repair adds Policy guard and Check payment to the trusted path without silently deleting the attacker. The validator ignores the isolated compromised card while requiring the complete safe build sequence.
- 2026-08-17: Stage 09 was browser-tested after the migration. Applying safe repair kept the attacker visible, created AI Agent → Policy guard → Check payment → Owner approval → Ledger Nano™ Gen5 → Send payment, and `Test my idea` reached PAYMENT PLAN VERIFIED with score 100.
- 2026-08-17: Mobile capture at 390×844 shows the mobile-first order as toolbar, paper graph, then mission panel and palette content below; the stage counter correctly reads `01 / 16` and remains readable for a Twitter/TikTok-style phone entry point.
- 2026-08-17: Stage 01 Build was replayed in the browser after restoring the 16-stage curriculum. AI Agent → Ledger Nano™ Gen5 → Send payment reached PAYMENT PLAN VERIFIED with score 100. The Ledger image was also the direct pointer target during the browser interaction check; its native image dragging is disabled so the node drag handler receives the gesture.

## Attack-event Fix redesign

- 2026-08-17: Fix missions no longer place a removable hacker node inside the graph. Each mission now shows an external `ATTACK EVENT` panel explaining how an attacker exploited a missing or flawed trusted control; the player repairs the trusted route instead of deleting an attacker.
- 2026-08-17: Stage 09 browser verification reached PAYMENT PLAN VERIFIED with Policy guard and Check payment added before Owner approval, Ledger Nano™ Gen5, and Send payment. Stage 13 browser verification reached score 100 through AI Agent → Policy guard → Stop & flag, with no Ledger in the solved containment route.
- 2026-08-17: Ledger device dimensions were reduced for cleaner board balance while retaining device-image drag handling and external input/output ports. Mobile 390×844 capture remained readable after the board and device changes.
- 2026-08-17: Rogue Skill no longer exposes Ledger Nano™ Gen5 in its palette, because its trusted solution contains the attack before any signing request is created. Direct pointer-event browser verification from the center of the current Ledger SVG image changed the node position from `50%,53%` to `63.7482%,57.8111%`; Stage 01 then completed at score 100 after that direct image drag.
