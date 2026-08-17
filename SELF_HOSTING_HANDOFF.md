# GraphOps: Self-Hosting Handoff

## Scope of this note

GraphOps currently runs as a React game inside a managed application shell. The **gameplay curriculum and graph validator are portable**, but the shipped application also includes platform-provided authentication, tRPC, database, and runtime bootstrap code. A code archive that excludes those shell directories will not type-check or build unchanged.

| Layer | Location | Self-hosting status |
|---|---|---|
| Curriculum, safety rules, and tests | `client/src/game/` | Portable TypeScript; no service dependency. |
| Paper Playground game UI | `client/src/components/GameCanvas.tsx` | Portable after replacing the progress/auth integration. |
| Auth and progress persistence | `client/src/_core/`, `client/src/main.tsx`, `server/routers.ts`, `drizzle/` | Requires a replacement auth provider, API, and database deployment. |
| Runtime bootstrap and environment wiring | `server/_core/` | Managed-shell code; it must be included intact or replaced for another host. |

## Why a partial archive fails

The client entrypoint configures a typed `/api/trpc` client, authentication redirect behavior, and a platform session fallback. The game canvas also reads authenticated progress. Therefore, an archive that omits `client/src/_core/` or `server/_core/` has unresolved imports even though the game rule engine itself is valid.

> A partial archive is not a complete self-hosting handoff. It contains the lesson logic, but not all runtime contracts that the app imports.

## Two safe migration paths

### A. Static classroom edition

Use this path for a public educational game with no account requirement. Keep `client/src/game/`, `GameCanvas.tsx`, CSS, static Ledger asset references, and the 16 stages. Replace authenticated progress calls with `localStorage`, remove the tRPC provider and OAuth redirect wiring from `client/src/main.tsx`, and deploy the Vite build to any static host.

This is the simplest independent version. Players retain progress only in their own browser, and no payment or identity data is needed.

### B. Full progress edition

Use this path when accounts and cross-device progress are required. Deploy the React app with a Node API, recreate the authenticated `progress.list` and `progress.save` contracts, provision a database for `player_progress`, and replace the current OAuth session flow with the selected provider. Preserve the existing game tests and add integration tests for the new progress API.

## Preflight checklist for an external handoff

- [ ] Export every imported source directory, not only `client/src/game/`.
- [ ] Replace or include `client/src/_core/` and `server/_core/` before running `tsc --noEmit`.
- [ ] Decide between the static classroom edition and full progress edition.
- [ ] If retaining progress, configure a database migration and authenticated API before deployment.
- [ ] Run `pnpm test`, `pnpm check`, and `pnpm build` in the target environment.
- [ ] Re-test Build 01, Deepfake Approval (Stage 12), Rogue Skill (Stage 13), Replay from Last Week (Stage 14), and Intent Lock (Stage 15) after migration.

## Managed deployment note

The current application is designed to run on its managed deployment. Questions about hosting availability, link lifetime, domains, or platform terms should be confirmed with the hosting provider before a public launch. This document intentionally does not make service-level permanence or availability guarantees.
