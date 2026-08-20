# Vite Preview WebSocket Recovery

The managed development server was healthy on port 3000, but the browser had an old Vite client attempting to connect to `localhost:5173`. This is a stale preview/HMR-client condition rather than a production-game failure. Restarting the managed dev server recreated the expected port-3000 Vite host. A fresh navigation to the managed preview loaded Stage 01 successfully, showed the Stage 01 Ledger card second in the palette, and produced no browser-console output, including no Vite WebSocket error.

No Vite configuration override was required; production delivery remains independent of the development HMR connection.
