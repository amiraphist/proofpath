// GraphOps curriculum: precise, payment-only safety missions for a young learner.

export type GameMode = "build" | "fix";
export type NodeType = "agent" | "policy" | "condition" | "verify" | "limit" | "slippage" | "preview" | "approval" | "quorum" | "expiry" | "wallet" | "tool" | "receipt" | "dedupe" | "retry" | "stop";

export type Stage = {
  id: number;
  title: string;
  client: string;
  story: string;
  objective: string;
  lesson: string;
  buildSequence: NodeType[];
  attackSequence?: NodeType[];
  attackEvent?: string;
  fixFault: string;
  available: NodeType[];
  severity: "low" | "medium" | "high";
  mode: GameMode;
};

export const nodeMeta: Record<NodeType, { label: string; short: string; color: string; icon: string; help: string }> = {
  agent: { label: "AI Agent", short: "AGENT", color: "violet", icon: "✦", help: "Turns the request into a payment plan." },
  policy: { label: "Policy guard", short: "POLICY", color: "red", icon: "⛨", help: "Blocks untrusted instructions before they can authorize payment." },
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
  stop: { label: "Stop & flag", short: "STOP", color: "red", icon: "×", help: "Stop a risky payment before it reaches a signer." },
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

export const stages: Stage[] = [
  { id: 1, title: "Buy Me a Coffee", client: "Build 01 · Minimal risk", severity: "low", mode: "build", story: "An agent wants to send $3 to a content creator as a tip.", objective: "Build AI Agent → Ledger Nano™ Gen5 → Send payment.", lesson: "Even the smallest transfer must pass through physical signing — no exceptions.", buildSequence: [agent, ledger, pay], fixFault: "No attack here — draw the smallest route that still requires physical signing.", available: [pay, agent, stop, ledger] },
  { id: 2, title: "The Domain Renewal", client: "Build 02 · Recurring payment", severity: "low", mode: "build", story: "A domain is about to expire; this is a recurring automated payment.", objective: "Put Spending limit between AI Agent and the Ledger signer.", lesson: "Recurring automated actions need a spending cap, not just a one-time check.", buildSequence: [agent, limit, ledger, pay], fixFault: "No attack here — keep the recurring renewal inside a clear spending cap.", available: [ledger, limit, agent, stop, pay] },
  { id: 3, title: "Tip the New Creator", client: "Build 03 · New recipient", severity: "low", mode: "build", story: "This is the first time funds are sent to this address.", objective: "Verify the complete recipient before the Ledger signer sees the payment.", lesson: "Unknown addresses need identity verification, even for small amounts.", buildSequence: [agent, verify, ledger, pay], fixFault: "No attack here — protect a first-time recipient from an address mix-up.", available: [pay, verify, agent, check, ledger, stop] },
  { id: 4, title: "Swap on the DEX", client: "Build 04 · Token swap", severity: "medium", mode: "build", story: "The agent wants to swap one token for another.", objective: "Check price and slippage before the Ledger signer reviews the swap.", lesson: "In trades, amount alone is not enough — rate and slippage must be checked before signing.", buildSequence: [agent, rate, ledger, pay], fixFault: "No attack here — build a swap route that cannot hide a bad rate.", available: [ledger, rate, agent, preview, stop, pay] },
  { id: 5, title: "Kid's Game Wallet", client: "Build 05 · Controlled spending", severity: "medium", mode: "build", story: "A limited wallet is being funded for a child’s in-game purchases.", objective: "Use both a Spending limit and Owner approval before signing.", lesson: "When control is delegated, a spending cap and human approval work together.", buildSequence: [agent, limit, ask, ledger, pay], fixFault: "No attack here — keep delegated spending capped and human-approved.", available: [ask, agent, ledger, limit, pay, stop] },
  { id: 6, title: "Cross-Border Contractor", client: "Build 06 · Network safety", severity: "medium", mode: "build", story: "An overseas contractor must be paid on the correct network or funds could be lost.", objective: "Verify the recipient, check payment details, ask the owner, then sign.", lesson: "Cross-network payments need recipient and transaction-detail checks before signing.", buildSequence: [agent, verify, check, ask, ledger, pay], fixFault: "No attack here — check both the destination and network before signing.", available: [check, ledger, verify, ask, agent, pay, stop] },
  { id: 7, title: "DAO Proposal Payout", client: "Build 07 · Governance", severity: "high", mode: "build", story: "A DAO proposal passed and must be paid according to collective governance.", objective: "Check the payment, collect the required multisig quorum, then sign and send.", lesson: "Multisig is a rule, not decoration: the graph must wait for independent signatures.", buildSequence: [agent, check, quorum, ledger, pay], fixFault: "No attack here — make the treasury route require the full quorum.", available: [quorum, check, agent, ledger, ask, pay, stop] },
  { id: 8, title: "Treasury Migration", client: "Build 08 · Final build", severity: "high", mode: "build", story: "The entire project treasury is moving to a new multisig wallet.", objective: "Verify, cap, collect quorum, preview the exact transaction, then sign.", lesson: "The biggest move needs the most layers — preview exactly what will execute before signing.", buildSequence: [agent, verify, limit, quorum, preview, ledger, pay], fixFault: "No attack here — layer recipient, budget, quorum, and preview checks.", available: [preview, quorum, ledger, verify, limit, agent, pay, stop] },
  { id: 9, title: "The Fake System Update", client: "Fix 01 · Prompt injection", severity: "high", mode: "fix", story: "A fake system message says ‘already approved’ and exploits a route that can reach signing without a trusted policy.", objective: "Add Policy guard and Check payment before Owner approval and the Ledger signer.", lesson: "A system-style message is still text, not permission. A trusted policy must reject it before signing.", buildSequence: [agent, policy, check, ask, ledger, pay], attackSequence: [agent, ask, ledger, pay], attackEvent: "ATTACK EVENT: A malicious prompt entered as ordinary message data and bypassed the missing policy check.", fixFault: "HACK ALERT: The graph has no Policy guard or payment check before approval. Add the controls so unsafe input cannot reach the signer.", available: [ledger, policy, stop, check, pay, ask] },
  { id: 10, title: "Address Poisoning", client: "Fix 02 · Recipient verification", severity: "high", mode: "fix", story: "A look-alike address arrives in the request and exploits a route with no full-recipient verification.", objective: "Add Verify recipient before Check payment, approval, and signing.", lesson: "Visual similarity is not identity. Recipient verification must compare the complete destination.", buildSequence: [agent, verify, check, ask, ledger, pay], attackSequence: [agent, check, ask, ledger, pay], attackEvent: "ATTACK EVENT: An address-poisoning message swapped the middle characters of the destination.", fixFault: "HACK ALERT: Recipient Verify is missing. Add it before the signer can receive the payment plan.", available: [pay, check, verify, stop, ledger, ask] },
  { id: 11, title: "The Infinite Approval", client: "Fix 03 · Hidden allowance", severity: "high", mode: "fix", story: "A normal-looking swap request hides unlimited token approval because the route skips simulation.", objective: "Add Simulate preview before the Ledger signer.", lesson: "The surface amount may hide a blank check. Preview the exact permission before signing.", buildSequence: [agent, rate, preview, ledger, pay], attackSequence: [agent, rate, ledger, pay], attackEvent: "ATTACK EVENT: A crafted swap payload hides unlimited allowance inside a familiar action.", fixFault: "HACK ALERT: The route reaches Ledger without a simulation preview. Add preview before signing.", available: [preview, rate, ledger, pay, stop] },
  { id: 12, title: "Deepfake Approval", client: "Fix 04 · Fake owner message", severity: "high", mode: "fix", story: "A voice clone claims the owner approved payment and exploits a graph with no trusted approval channel.", objective: "Add Policy guard and real Owner approval before Ledger signing.", lesson: "A claimed identity is not a verified identity. Approval must come through a fixed trusted channel.", buildSequence: [agent, check, policy, ask, ledger, pay], attackSequence: [agent, check, ledger, pay], attackEvent: "ATTACK EVENT: A deepfake approval message arrived through an untrusted channel.", fixFault: "HACK ALERT: The route trusts a message instead of Policy guard and Owner approval. Add both controls before signing.", available: [policy, ask, check, ledger, stop, pay] },
  { id: 13, title: "The Rogue Skill", client: "Fix 05 · Containment", severity: "high", mode: "fix", story: "An unvetted skill tries to turn an agent plan directly into a payment before any signing step exists.", objective: "Add Policy guard and Stop & flag to contain the unsafe request before it reaches any signer.", lesson: "A new tool is an attack surface. Block and flag an untrusted route before it can create a signing request.", buildSequence: [agent, policy, stop], attackSequence: [agent, pay], attackEvent: "ATTACK EVENT: A rogue skill tried to turn a draft payment plan into an immediate send command.", fixFault: "HACK ALERT: The route can send directly. Insert Policy guard and Stop & flag; do not let the attack create a Ledger request.", available: [policy, stop, check, pay] },
  { id: 14, title: "Replay from Last Week", client: "Fix 06 · Stale approval", severity: "high", mode: "fix", story: "An old approved session is reused to authorize a brand-new transaction.", objective: "Add Session expiry between Owner approval and the Ledger signer.", lesson: "Approval must expire — trust is not permanent.", buildSequence: [agent, check, ask, expiry, ledger, pay], attackSequence: [agent, check, ask, ledger, pay], attackEvent: "ATTACK EVENT: A captured approval token was replayed after its valid time window.", fixFault: "HACK ALERT: Session expiry is missing. Add it before the Ledger signer receives a stale approval.", available: [expiry, check, pay, ask, stop, ledger] },
  { id: 15, title: "What You See Isn’t What You Sign", client: "Fix 07 · Preview mismatch", severity: "high", mode: "fix", story: "The request shows a friendly preview but the route sends a different payload to Ledger because the preview step is missing.", objective: "Add Simulate preview directly after Check payment and before Ledger signing.", lesson: "The preview must come from the exact data that gets signed, not a separate spoofable copy.", buildSequence: [agent, check, preview, ledger, pay], attackSequence: [agent, check, ledger, pay], attackEvent: "ATTACK EVENT: A payload mismatch was inserted between the displayed request and the signing request.", fixFault: "HACK ALERT: The signer has no trusted preview. Add Simulate preview between Check payment and Ledger.", available: [check, preview, ledger, pay, stop] },
  { id: 16, title: "The Missing Signature", client: "Fix 08 · Multisig bypass", severity: "high", mode: "fix", story: "A large payment requires three signatures, but the graph releases it after only one approval.", objective: "Replace the single Owner approval with a real Multisig quorum before signing.", lesson: "Multisig is not decoration. It must count and wait for the full required signature set.", buildSequence: [agent, check, quorum, ledger, pay], attackSequence: [agent, check, ask, ledger, pay], attackEvent: "ATTACK EVENT: A quorum check was bypassed so one approval looked like the full signature set.", fixFault: "HACK ALERT: The route can sign after one approval. Replace it with Multisig quorum before Ledger.", available: [quorum, check, ask, ledger, pay, stop] },
];
