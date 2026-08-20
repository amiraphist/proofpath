# Stage 01 Ledger Position Findings

The reported fourth-position issue was reproduced in the public GitHub repository before synchronization: `main` was still at commit `77356a95`, which had `available: [pay, agent, stop, ledger]` and no `paletteOrder.ts`; therefore Ledger rendered fourth in the classroom build.

The local ProofPath application already had the stage-aware helper and passed `stage.id` into the shared desktop/mobile `paletteCards` render. The current Stage 01 result is `Send payment`, `Ledger Nano™ Gen5`, `AI Agent`, `Stop & flag`.

The local branch was pushed to `amiraphist/proofpath` and the GitHub Pages workflow completed successfully for commit `c20bf62a`. A fresh navigation to `https://amiraphist.github.io/proofpath/?stage-order-check=1`, followed by opening the notebook, showed the live Stage 01 list in the second position: Send payment first, Ledger Nano™ Gen5 second, AI Agent third, Stop & flag fourth. The same `paletteCards` array is used by desktop and mobile render paths.

Conclusion: the earlier fourth-position observation was valid for the stale public deployment, not the current source. The public workflow has now deployed the correction; a hard refresh or cache-busting query is recommended if an old browser tab still shows the prior order.

## Audit note

The project TODO remains English-only in repository-facing content; this finding file is an internal QA record.
