# ProofPath — Current 16-Mission Design

ProofPath is an English-only educational game about safe AI-agent payment workflows. The first eight missions teach secure construction. The final eight begin with an external **ATTACK EVENT** that exploits a missing or flawed trusted control; the player restores the trusted route instead of deleting a hacker node.

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
| 15 | Fix | Intent lock / post-approval mutation | Agent → Check → Preview → Owner approval → Seal exact action → Ledger → Send |
| 16 | Fix | Multisig bypass | Agent → Check → Quorum → Ledger → Send |

> **Design rule:** Attackers are an external attack event, never a removable graph card. A Fix is valid only when its trusted route blocks unsafe flow before a signer or send step.

> **Authority rule:** The AI Agent may propose a payment route, but it never holds final authority. The simulated hardware signer remains outside the agent runtime; policy checks, real approval, quorum, expiration, preview, and sealed-action controls decide whether a request may reach it.

> **Failure-path rule:** A Fix stage makes a compromised agent or untrusted message fail closed. Stage 15 now demonstrates intent locking: once the exact action is reviewed, a sealed amount, recipient, action type, expiry, and single-use scope prevent a later agent mutation from reaching the signer.

## Security Architecture Mapping

The curriculum applies the supplied principle that an **AI Agent proposes but never authorizes**. Every safe route terminates at the simulated external hardware signer, except Stage 13, which deliberately terminates at **Stop & flag** before a signer or send step can exist.

| Stage | Primary security principle | Authority boundary and fail-closed outcome |
|---|---|---|
| 01 | Hardware enforcement | The Agent can prepare the tip; Ledger Nano™ Gen5 is the external final signer before Send payment. |
| 02 | Spending limits | The limit constrains an automated renewal before it can reach the external signer. |
| 03 | Recipient verification | A full destination check is required before the signer receives a first-time payment. |
| 04 | Transaction constraints | Price and slippage are checked before a swap reaches signing. |
| 05 | Delegation with human oversight | Spending limit plus Owner approval constrain delegated spending before hardware signing. |
| 06 | Independent transaction checks | Recipient, network/detail checks, and Owner approval all occur before signing. |
| 07 | Quorum authority | A governance payment requires the independent Multisig quorum, not an Agent or single approver. |
| 08 | Layered treasury control | Verification, limit, quorum, and exact preview compose before the external signer. |
| 09 | Prompt-injection containment | External malicious text meets Policy guard and Check payment; it cannot authorize a signer request. |
| 10 | Address-poisoning defense | Verify recipient rejects a look-alike destination before approval and hardware signing. |
| 11 | Simulation before irreversible action | Simulate preview exposes a hidden allowance before the request reaches Ledger. |
| 12 | Trusted approval channel | Policy guard rejects an untrusted deepfake claim before the already-present real Owner approval path reaches signing. |
| 13 | Local-breach containment | Policy guard routes an unvetted skill to Stop & flag; there is no Ledger or Send payment endpoint to reach. |
| 14 | Expiring authority | Session expiry invalidates a replayed approval before the external signer. |
| 15 | Intent locking / sealed action | After Preview and Owner approval, Seal exact action binds amount, recipient, action, expiry, and one-time use; mutation fails before Ledger. |
| 16 | Multi-party authorization | Multisig quorum replaces a single approval, preventing a bypass from reaching the signer. |

## Reference-Pass Conclusion

The review found that the active curriculum already represented policy enforcement, hardware signing, quorum, expiration, preview, and containment with a visible trusted route and an external **ATTACK EVENT** for every Fix mission. The first material gap was a post-approval mutation lesson: Stage 15 now uses **Owner approval → Seal exact action → Ledger Nano™ Gen5**, making an altered post-approval request fail closed. A subsequent QA pass found that Stage 12 had two missing controls but only one visual repair cue. Its attacked route now preserves **Check payment** and the real **Owner approval**, leaving exactly one visible repair: insert **Policy guard** immediately after the Agent. This keeps every Fix mission aligned with the current single broken-edge teaching engine.

Ledger Nano™ Gen5 appears solely as a simulated educational hardware signer. ProofPath is an unofficial fan-made educational simulation and is not affiliated with or endorsed by Ledger.
