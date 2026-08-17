# ProofPath

**ProofPath** is an English-language educational browser game about building safe AI-agent payment workflows. Players draw trusted routes with hand-drawn nodes, blue pen connections, and a Paper Playground visual system.

> This is a learning simulation. It does not connect to wallets, transmit funds, or execute payments.

## What players learn

The 16-mission curriculum contains eight **Build** missions and eight **Fix** missions. It introduces policy enforcement, recipient verification, spending limits, real human approval, multisig quorum, session expiry, transaction preview, intent sealing, and containment of unsafe agent actions.

Fix missions show an external **ATTACK EVENT** rather than a removable hacker node. The player restores trusted controls so an unsafe request fails before it can reach the simulated Ledger Nano™ Gen5 signer or a send step.

## Run locally

```bash
pnpm install
pnpm test
pnpm check
pnpm build
pnpm dev
```

The full authenticated-progress edition expects the managed runtime, OAuth, tRPC, and database configuration used by the app shell. For an independent deployment, read [`SELF_HOSTING_HANDOFF.md`](./SELF_HOSTING_HANDOFF.md) before choosing the static classroom or full-progress migration path.

## Project map

| Path | Purpose |
|---|---|
| `client/src/game/` | Portable curriculum, deterministic rules, game session, and tests. |
| `client/src/components/GameCanvas.tsx` | Paper Playground interface, graph controls, and responsive mobile viewport. |
| `server/` and `drizzle/` | Authenticated progress persistence and server-side contracts. |
| `GRAPH_DESIGNS.md` | Active 16-mission security curriculum. |
| `SELF_HOSTING_HANDOFF.md` | Checklist for an external deployment. |

## Brand and visual system

The approved brand is **ProofPath**. Its visual direction is a blue hand-drawn route passing through a black verification stamp. See [`BRAND_DIRECTIONS.md`](./BRAND_DIRECTIONS.md) for the chosen direction and alternatives considered.

## Ledger notice

The Ledger Nano™ Gen5 graphic is used solely as a supplied, simulated educational signer visual. ProofPath is not affiliated with or endorsed by Ledger.
