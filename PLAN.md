# ProofPath Build Plan

## Product Goal

ProofPath is an English-only educational browser game for safe AI-agent payment workflows. It teaches a fifteen-year-old player to build or repair a trusted route using friendly visual nodes, while making clear that an AI Agent may propose but never authorize a payment.

## Active Curriculum

The product contains **16 deterministic missions**: eight Build missions and eight Fix missions. Build missions begin with an empty paper board. Fix missions begin with a flawed route and an external **ATTACK EVENT**; players add or restore trusted controls rather than deleting a hacker node.

## Interaction Model

The Paper Playground uses hand-drawn black-ink nodes, blue pen connections, and a supplied Ledger Nano™ Gen5 visual asset as a simulated external signer. Desktop supports pointer drag, port connections, keyboard shortcuts, and structural Undo. Mobile supports an accessible Nodes orb, a virtual graph canvas, 30%–180% zoom, pinch/pan, and page scrolling from blank Paper Path space.

## Safety Scope

Each route is a simulation only. No wallet, secret, or real payment API is used. The curriculum covers policy enforcement, recipient verification, spending limits, human approval, quorum, expiry, preview, intent sealing, and containment.

## Acceptance Criteria

- Every intended route validates deterministically and scores 100.
- Every Fix mission has a clear external attack event and a visible repair cue.
- Stage 12 has one visible Policy guard insertion; Stage 15 seals an already-approved exact action.
- The interface works at desktop 1280×720 and mobile 390×844.
- `pnpm test`, `pnpm check`, and `pnpm build` pass before release.
