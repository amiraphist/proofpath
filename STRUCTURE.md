# ProofPath Structure

## Application Shell

`client/src/App.tsx` mounts the single-route game. `client/src/components/GameCanvas.tsx` owns the responsive Paper Playground UI, graph board, mobile viewport gestures, palette, feedback trace, and player progress integration.

## Game Modules

| Module | Responsibility |
|---|---|
| `client/src/game/stages.ts` | Typed definitions for the active 16-mission curriculum and node metadata. |
| `client/src/game/graphRules.ts` | Initial attack-state construction and deterministic route validation. |
| `client/src/game/useGameSession.ts` | Session state, edits, repair, Undo, scores, and progression. |
| `client/src/game/graphRules.test.ts` | Curriculum and Fix-route regression coverage. |
| `client/src/game/useSoundEffects.ts` | Lightweight, optional Web Audio interaction feedback. |

## Data and Runtime

Authenticated progress is stored through tRPC procedures in `server/routers.ts` and the `player_progress` database table. The gameplay rule engine remains local and deterministic. See `SELF_HOSTING_HANDOFF.md` for the separation between portable game code and the managed runtime shell.

## Design System

ProofPath uses a Paper Playground aesthetic: white graph paper, pale blue grid lines, black ink nodes, and blue pen routes. The supplied Ledger Nano™ Gen5 asset is an unchanged, simulated educational signer; no affiliation or endorsement is claimed.
