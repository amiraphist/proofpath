# GraphOps Build Plan

## Product Goal

GraphOps is an English-only browser game that teaches practical LangGraph thinking through 25 compact scenarios. It runs as a standalone web link and is designed to fit the Telegram Mini App viewport. The player uses a small set of visual nodes to build or repair a workflow.

## Modes

- **Build:** assemble a valid graph from a small tool palette.
- **Fix:** inspect a damaged graph, identify the faulty edge or missing guard, and repair it.

## MVP Scope

The first playable version includes a single responsive screen, a stage selector, Build/Fix mode switcher, a graph canvas rendered with SVG and CSS glass cards, draggable or selectable nodes, animated edges, a tool palette, a compact incident log, stage objective, hint, reset, run, and success/failure feedback. All UI and content are English-only.

## 25-Stage Learning Arc

1. Human approval before payment
2. Validate recipient identity
3. Reject negative amounts
4. Enforce a spending limit
5. Prevent duplicate execution
6. Retry a failed read-only tool
7. Stop after a retry budget
8. Handle a malformed tool response
9. Separate planning from execution
10. Add a policy check
11. Block an untrusted instruction in external data
12. Protect sensitive payment fields
13. Require a verified account
14. Escalate high-value transfers
15. Handle a timeout without assuming success
16. Add an idempotency key
17. Route a declined payment safely
18. Preserve an audit log
19. Verify a webhook before updating state
20. Recover from a partial workflow
21. Add a human review branch
22. Coordinate two specialist agents
23. Limit agent-to-agent permissions
24. Design a safe purchase mandate
25. Repair a complete multi-step payout graph

## Risk Slices

- Graph interaction must remain usable on touch screens and narrow Telegram viewports.
- Node connections must communicate validity without relying on color alone.
- Build and Fix rules need deterministic stage validation and clear failure explanations.
- Motion must remain lightweight and respect reduced-motion preferences.
- The UI must not imply real payments; all execution is a simulation.
- The stage data model must prevent mixed-language strings.

## Acceptance Criteria

- A first-time player can understand the objective within 10 seconds.
- A player can complete at least the first five stages without documentation.
- Every stage displays an objective, available tools, a deterministic validator, and a learning takeaway.
- Failed runs explain the violated safety principle in plain English.
- The interface works at desktop 1280x720 and mobile 390x844.
- No real payment API, wallet, secret, or external transaction is used.
- `pnpm check` passes and the preview shows the interactive game rather than template content.
