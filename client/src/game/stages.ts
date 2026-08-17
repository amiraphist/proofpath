// GraphOps curriculum: precise, payment-only safety missions for a young learner.

export type GameMode = "build" | "fix";
export type NodeType = "agent" | "policy" | "condition" | "verify" | "limit" | "slippage" | "preview" | "approval" | "quorum" | "expiry" | "wallet" | "tool" | "receipt" | "dedupe" | "retry" | "stop" | "rogue";

export type Stage = {
  id: number;
  title: string;
  client: string;
  story: string;
  objective: string;
  lesson: string;
  buildSequence: NodeType[];
  attackSequence?: NodeType[];
  fixFault: string;
  available: NodeType[];
  severity: "low" | "medium" | "high";
  mode: GameMode;
};

export const nodeMeta: Record<NodeType, { label: string; short: string; color: string; icon: string; help: string }> = {
  agent: { label: "AI Agent", short: "AGENT", color: "violet", icon: "✦", help: "Turns the request into a payment plan." },
  policy: { label: "Policy guard", short: "POLICY", color: "red", icon: "⛨", help: "Rejects untrusted instructions before approval or signing." },
  condition: { label: "Check payment", short: "CHECK", color: "black", icon: "◇", help: "Check the amount, network, and payment details." },
  verify: { label: "Verify recipient", short: "VERIFY", color: "teal", icon: "◎", help: "Compare the complete destination, not a shortened preview." },
  limit: { label: "Spending limit", short: "LIMIT", color: "amber", icon: "▥", help: "Cap how much an automated payment may spend." },
  slippage: { label: "Price & slippage", short: "RATE", color: "orange", icon: "≈", help: "Reject a swap if the price moves beyond the allowed range." },
  preview: { label: "Simulate preview", short: "PREVIEW", color: "purple", icon: "◌", help: "Show exactly what the transaction will grant or send." },
  approval: { label: "Owner approval", short: "ASK", color: "amber", icon: "☝", help: "Pause for a real human yes or no." },
  quorum: { label: "Multisig quorum", short: "QUORUM", color: "rose", icon: "Ⅲ", help: "Wait for the required number of independent signatures." },
  expiry: { label: "Session expiry", short: "EXPIRY", color: "indigo", icon: "◷", help: "Reject an approval that is too old to trust." },
  wallet: { label: "Ledger Nano™ Gen5", short: "SIGN", color: "green", icon: "▣", help: "Verify details on a simulated hardware signer." },
  tool: { label: "Send payment", short: "PAY", color: "blue", icon: "↗", help: "Send only after every safety step." },
  receipt: { label: "Save receipt", short: "SAVE", color: "blue", icon: "▤", help: "Leave a clear payment record." },
  dedupe: { label: "Block duplicates", short: "LOCK", color: "violet", icon: "⊘", help: "Stop the same payment from happening twice." },
  retry: { label: "Safe retry", short: "RETRY", color: "black", icon: "↻", help: "Retry a temporary failure without replaying approval." },
  stop: { label: "Stop & flag", short: "STOP", color: "red", icon: "×", help: "Stop the payment and flag the risk." },
  rogue: { label: "Unvetted skill", short: "ROGUE", color: "red", icon: "⚠", help: "An attacker-controlled tool that can reroute a payment." },
};

const agent = "agent" as const;
const policy = "policy" as const;
const check = "condition" as const;
const verify = "verify" as const;
const limit = "limit" as const;
const rate = "slippage" as const;
const preview = "preview" as const;
const ask = "approval" as const;
const quorum = "quorum" as const;
const expiry = "expiry" as const;
const ledger = "wallet" as const;
const pay = "tool" as const;
const stop = "stop" as const;
const rogue = "rogue" as const;

export const stages: Stage[] = [
  { id: 1, title: "Buy Me a Coffee", client: "Build 01 · Minimal risk", severity: "low", mode: "build", story: "An agent wants to send $3 to a content creator as a tip.", objective: "Build AI Agent → Ledger Nano™ Gen5 → Send payment.", lesson: "Even the smallest transfer must pass through physical signing — no exceptions.", buildSequence: [agent, ledger, pay], fixFault: "No attack here — draw the smallest route that still requires physical signing.", available: [pay, agent, stop, ledger] },
  { id: 2, title: "The Domain Renewal", client: "Build 02 · Recurring payment", severity: "low", mode: "build", story: "A domain is about to expire; this is a recurring automated payment.", objective: "Put Spending limit between AI Agent and the Ledger signer.", lesson: "Recurring automated actions need a spending cap, not just a one-time check.", buildSequence: [agent, limit, ledger, pay], fixFault: "No attack here — keep the recurring renewal inside a clear spending cap.", available: [ledger, limit, agent, stop, pay] },
  { id: 3, title: "Tip the New Creator", client: "Build 03 · New recipient", severity: "low", mode: "build", story: "This is the first time funds are sent to this address.", objective: "Verify the complete recipient before the Ledger signer sees the payment.", lesson: "Unknown addresses need identity verification, even for small amounts.", buildSequence: [agent, verify, ledger, pay], fixFault: "No attack here — protect a first-time recipient from an address mix-up.", available: [pay, verify, agent, check, ledger, stop] },
  { id: 4, title: "Swap on the DEX", client: "Build 04 · Token swap", severity: "medium", mode: "build", story: "The agent wants to swap one token for another.", objective: "Check price and slippage before the Ledger signer reviews the swap.", lesson: "In trades, amount alone is not enough — rate and slippage must be checked before signing.", buildSequence: [agent, rate, ledger, pay], fixFault: "No attack here — build a swap route that cannot hide a bad rate.", available: [ledger, rate, agent, preview, stop, pay] },
  { id: 5, title: "Kid's Game Wallet", client: "Build 05 · Controlled spending", severity: "medium", mode: "build", story: "A limited wallet is being funded for a child’s in-game purchases.", objective: "Use both a Spending limit and Owner approval before signing.", lesson: "When control is delegated, a spending cap and human approval work together.", buildSequence: [agent, limit, ask, ledger, pay], fixFault: "No attack here — keep delegated spending capped and human-approved.", available: [ask, agent, ledger, limit, pay, stop] },
  { id: 6, title: "Cross-Border Contractor", client: "Build 06 · Network safety", severity: "medium", mode: "build", story: "An overseas contractor must be paid on the correct network or funds could be lost.", objective: "Verify the recipient, check payment details, ask the owner, then sign.", lesson: "Cross-network payments need recipient and transaction-detail checks before signing.", buildSequence: [agent, verify, check, ask, ledger, pay], fixFault: "No attack here — check both the destination and network before signing.", available: [check, ledger, verify, ask, agent, pay, stop] },
  { id: 7, title: "DAO Proposal Payout", client: "Build 07 · Governance", severity: "high", mode: "build", story: "A DAO proposal passed and must be paid according to collective governance.", objective: "Check the payment, collect the required multisig quorum, then sign and send.", lesson: "Multisig is a rule, not decoration: the graph must wait for independent signatures.", buildSequence: [agent, check, quorum, ledger, pay], fixFault: "No attack here — make the treasury route require the full quorum.", available: [quorum, check, agent, ledger, ask, pay, stop] },
  { id: 8, title: "Treasury Migration", client: "Build 08 · Final build", severity: "high", mode: "build", story: "The entire project treasury is moving to a new multisig wallet.", objective: "Verify, cap, collect quorum, preview the exact transaction, then sign.", lesson: "The biggest move needs the most layers — preview exactly what will execute before signing.", buildSequence: [agent, verify, limit, quorum, preview, ledger, pay], fixFault: "No attack here — layer recipient, budget, quorum, and preview checks.", available: [preview, quorum, ledger, verify, limit, agent, pay, stop] },
  { id: 9, title: "The Fake System Update", client: "Fix 01 · Prompt injection", severity: "high", mode: "fix", story: "A fake system message says ‘already approved’ and tries to send $1,000 without a real approval.", objective: "Keep the compromised AI Agent visible, isolate it, and add Policy guard plus Owner approval before signing.", lesson: "A system-style message is still text, not permission. Only a trusted policy and real approval can authorize payment.", buildSequence: [agent, policy, check, ask, ledger, pay], attackSequence: [agent, agent, ask, ledger, pay], fixFault: "HACK ALERT: The second AI Agent is compromised. Keep it visible, isolate it, and place Policy guard plus Check payment before approval and signing.", available: [ledger, policy, stop, check, pay, ask] },
  { id: 10, title: "Address Poisoning", client: "Fix 02 · Recipient verification", severity: "high", mode: "fix", story: "The suggested address matches the real one at the edges but differs in the middle.", objective: "Restore Verify recipient before Check payment, approval, and signing.", lesson: "Visual similarity is not identity. Recipient verification must compare the complete destination.", buildSequence: [agent, verify, check, ask, ledger, pay], attackSequence: [agent, check, ask, ledger, pay], fixFault: "HACK ALERT: Recipient Verify was removed. The graph can now sign a look-alike address.", available: [pay, check, verify, stop, ledger, ask] },
  { id: 11, title: "The Infinite Approval", client: "Fix 03 · Hidden allowance", severity: "high", mode: "fix", story: "A normal-looking swap secretly grants a contract unlimited permission to withdraw tokens later.", objective: "Restore Simulate preview before the Ledger signer.", lesson: "The surface amount may hide a blank check. Preview the exact permission before signing.", buildSequence: [agent, rate, preview, ledger, pay], attackSequence: [agent, rate, ledger, pay], fixFault: "HACK ALERT: Preview was removed, hiding an unlimited allowance inside an ordinary-looking swap.", available: [preview, rate, ledger, pay, stop] },
  { id: 12, title: "Deepfake Approval", client: "Fix 04 · Fake owner message", severity: "high", mode: "fix", story: "A fake voice or text message mimics the owner and claims direct approval.", objective: "Restore the real Owner approval channel; arbitrary input must not stand in for it.", lesson: "A claimed identity is not a verified identity. Approval must come through a fixed trusted channel.", buildSequence: [agent, check, ask, ledger, pay], attackSequence: [agent, check, agent, ledger, pay], fixFault: "HACK ALERT: A second AI Agent is impersonating Owner approval. Keep it visible and restore the real approval gate.", available: [ask, check, ledger, stop, pay] },
  { id: 13, title: "The Rogue Skill", client: "Fix 05 · Unvetted tool", severity: "high", mode: "fix", story: "A new unvetted skill silently reroutes the payment to a different address.", objective: "Keep the suspicious skill visible, isolate it, and restore the core Check payment → Owner approval route.", lesson: "Every tool added to an agent is an attack surface. It must be traceable, removable, and outside the trusted route.", buildSequence: [agent, check, ask, ledger, pay], attackSequence: [agent, check, rogue, ask, ledger, pay], fixFault: "HACK ALERT: An unvetted skill can reroute the payment. Keep it visible but isolate it from the trusted path.", available: [check, ask, ledger, rogue, pay, stop] },
  { id: 14, title: "Replay from Last Week", client: "Fix 06 · Stale approval", severity: "high", mode: "fix", story: "An old approved session is reused to authorize a brand-new transaction.", objective: "Add Session expiry between Owner approval and the Ledger signer.", lesson: "Approval must expire — trust is not permanent.", buildSequence: [agent, check, ask, expiry, ledger, pay], attackSequence: [agent, check, ask, ledger, pay], fixFault: "HACK ALERT: Session expiry was cut out, so last week’s approval can authorize today’s payment.", available: [expiry, check, pay, ask, stop, ledger] },
  { id: 15, title: "What You See Isn’t What You Sign", client: "Fix 07 · Preview mismatch", severity: "high", mode: "fix", story: "The preview shows one amount and recipient, but a different payload reaches the Ledger signer.", objective: "Wire Simulate preview directly from the same Check payment output used for signing.", lesson: "The preview must come from the exact data that gets signed, not a separate spoofable copy.", buildSequence: [agent, check, preview, ledger, pay], attackSequence: [agent, preview, check, ledger, pay], fixFault: "HACK ALERT: Preview and execution use different sources. Restore one trusted data path before signing.", available: [check, preview, ledger, pay, stop] },
  { id: 16, title: "The Missing Signature", client: "Fix 08 · Multisig bypass", severity: "high", mode: "fix", story: "A large payment requires three signatures, but the graph releases it after only one owner approves.", objective: "Replace the single Owner approval with a real Multisig quorum before signing.", lesson: "Multisig is not decoration. It must count and wait for the full required signature set.", buildSequence: [agent, check, quorum, ledger, pay], attackSequence: [agent, check, ask, ledger, pay], fixFault: "HACK ALERT: Quorum was replaced by one approval. The treasury can move with too few signatures.", available: [quorum, check, ask, ledger, pay, stop] },
];
