# GraphOps — Current 16-Mission Design

GraphOps is an English-only educational game about safe AI-agent payment workflows. The first eight missions teach secure construction. The final eight begin with an external **ATTACK EVENT** that exploits a missing or flawed trusted control; the player restores the trusted route instead of deleting a hacker node.

| Stage | Mode | Safety concept | Trusted route |
|---|---|---|---|
| 01 | Build | Physical confirmation | Agent → Ledger → Send |
| 02 | Build | Spending cap | Agent → Limit → Ledger → Send |
| 03 | Build | Recipient verification | Agent → Verify → Ledger → Send |
| 04 | Build | Price/slippage check | Agent → Rate → Ledger → Send |
| 05 | Build | Delegated spending | Agent → Limit → Approval → Ledger → Send |
| 06 | Build | Cross-network payment | Agent → Verify → Check → Approval → Ledger → Send |
| 07 | Build | Multisig governance | Agent → Check → Quorum → Ledger → Send |
| 08 | Build | Treasury migration | Agent → Verify → Limit → Quorum → Preview → Ledger → Send |
| 09 | Fix | Prompt injection | Agent → Policy → Check → Approval → Ledger → Send |
| 10 | Fix | Address poisoning | Agent → Verify → Check → Approval → Ledger → Send |
| 11 | Fix | Hidden allowance | Agent → Rate → Preview → Ledger → Send |
| 12 | Fix | Deepfake approval | Agent → Policy → Check → Approval → Ledger → Send |
| 13 | Fix | Rogue-skill containment | Agent → Policy → Stop & flag |
| 14 | Fix | Stale-session replay | Agent → Check → Approval → Expiry → Ledger → Send |
| 15 | Fix | Preview/sign mismatch | Agent → Check → Preview → Ledger → Send |
| 16 | Fix | Multisig bypass | Agent → Check → Quorum → Ledger → Send |

> **Design rule:** Attackers are an external attack event, never a removable graph card. A Fix is valid only when its trusted route blocks unsafe flow before a signer or send step.

Ledger Nano™ Gen5 appears solely as a simulated educational hardware signer. GraphOps is an unofficial fan-made educational simulation and is not affiliated with or endorsed by Ledger.
