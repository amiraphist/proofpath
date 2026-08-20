# Vite Preview WebSocket Recovery

The managed development server was healthy on port 3000, but the browser had an old Vite client attempting to connect to `localhost:5173`. This is a stale preview/HMR-client condition rather than a production-game failure. Restarting the managed dev server recreated the expected port-3000 Vite host. A fresh navigation to the managed preview loaded Stage 01 successfully, showed the Stage 01 Ledger card second in the palette, and produced no browser-console output, including no Vite WebSocket error.

No Vite configuration override was required; production delivery remains independent of the development HMR connection.

## Explicit proxy configuration follow-up

The earlier restart alone did not stop an old client from choosing Vite's default port. The development bridge now sets the HMR client protocol to `wss` and port to `443`, while retaining the existing HTTP server for upgrade handling. After restart, a fresh preview session loads normally and its browser console is empty: no `localhost:5173` target and no Vite WebSocket failure. This explicit configuration is scoped to development HMR and does not affect the production bundle.
