// GraphOps style reminder: Neon Glass Circuit, semantic neon colors, English-only technical game voice.

export type GameMode = "build" | "fix";
export type NodeType =
  | "start"
  | "agent"
  | "tool"
  | "condition"
  | "approval"
  | "retry"
  | "stop"
  | "end";

export type Stage = {
  id: number;
  title: string;
  client: string;
  story: string;
  objective: string;
  lesson: string;
  buildSequence: NodeType[];
  fixFault: string;
  available: NodeType[];
  severity: "low" | "medium" | "high";
};

export const nodeMeta: Record<NodeType, { label: string; short: string; color: string; icon: string }> = {
  start: { label: "Trigger", short: "START", color: "cyan", icon: "◉" },
  agent: { label: "Agent", short: "AGENT", color: "violet", icon: "✦" },
  tool: { label: "Tool", short: "TOOL", color: "blue", icon: "⇄" },
  condition: { label: "Policy Check", short: "CHECK", color: "amber", icon: "◇" },
  approval: { label: "Human Approval", short: "HUMAN", color: "orange", icon: "♢" },
  retry: { label: "Retry Guard", short: "RETRY", color: "yellow", icon: "↻" },
  stop: { label: "Circuit Breaker", short: "STOP", color: "red", icon: "⊘" },
  end: { label: "Verified End", short: "END", color: "green", icon: "✓" },
};

const common: NodeType[] = ["agent", "tool", "condition", "approval", "retry", "stop"];

export const stages: Stage[] = [
  { id: 1, title: "The Bonus Run", client: "Northstar Labs", story: "A founder wants to send a surprise bonus to the team. The agent currently has a direct line to the payment tool.", objective: "Insert a human approval before any money moves.", lesson: "A capable agent still needs a meaningful permission boundary.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "Payment is executed before a human reviews it.", available: ["agent", "condition", "approval", "tool", "end"], severity: "medium" },
  { id: 2, title: "The Right Recipient", client: "Mira Studio", story: "The team has two employees with similar names. The agent must not trust a display name alone.", objective: "Validate the recipient before creating a payment.", lesson: "Identity is a graph step, not a string match.", buildSequence: ["start", "agent", "tool", "condition", "approval", "end"], fixFault: "The graph pays the first matching display name.", available: common, severity: "high" },
  { id: 3, title: "No Negative Rewards", client: "Brightline", story: "A malformed request asks for a reward of -500 credits. The model tries to be helpful.", objective: "Reject invalid amounts before approval or execution.", lesson: "Validate data before reasoning about it.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "Negative amounts pass through the graph.", available: common, severity: "medium" },
  { id: 4, title: "The Budget Gate", client: "Orbit Works", story: "A department has a monthly reward budget. The agent can read the balance but must respect the cap.", objective: "Add a policy check for the spending limit.", lesson: "Policies turn intent into bounded action.", buildSequence: ["start", "agent", "tool", "condition", "approval", "end"], fixFault: "The budget is checked after the payment.", available: common, severity: "high" },
  { id: 5, title: "Double Tap", client: "Lumen House", story: "A slow payment provider causes a retry. The same reward is about to be sent twice.", objective: "Prevent duplicate execution on retry.", lesson: "Retries need idempotency, not hope.", buildSequence: ["start", "agent", "retry", "tool", "condition", "end"], fixFault: "The retry route calls the payment tool twice.", available: common, severity: "high" },
  { id: 6, title: "Read It Again", client: "Fieldnote", story: "The employee directory sometimes returns a temporary error. Reading again is safe; paying again is not.", objective: "Retry a read-only tool without duplicating a side effect.", lesson: "Not every tool deserves the same retry policy.", buildSequence: ["start", "agent", "retry", "tool", "condition", "end"], fixFault: "The graph retries the payment tool instead of the directory tool.", available: common, severity: "medium" },
  { id: 7, title: "Three Strikes", client: "Harbor Cloud", story: "A broken API keeps returning an error. The agent loops forever while the user waits.", objective: "Stop after a bounded number of attempts.", lesson: "A safe graph knows when to stop trying.", buildSequence: ["start", "agent", "retry", "stop", "end"], fixFault: "There is no terminal path after repeated failure.", available: common, severity: "medium" },
  { id: 8, title: "Bad Tool, Clear Signal", client: "Pollen", story: "The rewards tool returns a payload missing its transaction ID.", objective: "Check the tool response before moving on.", lesson: "A successful HTTP response is not proof of a successful action.", buildSequence: ["start", "agent", "tool", "condition", "stop", "end"], fixFault: "The graph assumes every tool response is valid.", available: common, severity: "high" },
  { id: 9, title: "Plan Before Action", client: "Atlas Retail", story: "The agent jumps from a vague request straight into an external tool call.", objective: "Separate planning from execution.", lesson: "Planning is not authorization.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The model's plan is treated as an approved action.", available: common, severity: "medium" },
  { id: 10, title: "The Policy Door", client: "Cedar Finance", story: "A reward request arrives outside the company's allowed categories.", objective: "Block policy violations before a human sees a misleading draft.", lesson: "Human review is stronger when the graph filters noise first.", buildSequence: ["start", "agent", "condition", "stop", "end"], fixFault: "Policy violations reach the payment tool.", available: common, severity: "high" },
  { id: 11, title: "The Poisoned Note", client: "Signal House", story: "An external document contains an instruction pretending to be a system message.", objective: "Treat retrieved content as data, not authority.", lesson: "Prompt injection is an authorization problem.", buildSequence: ["start", "agent", "condition", "stop", "approval", "end"], fixFault: "External text can rewrite the graph's intent.", available: common, severity: "high" },
  { id: 12, title: "Keep the Secret", client: "Moss & Co.", story: "The agent sees sensitive payment details while preparing a reward.", objective: "Keep sensitive fields out of the model context.", lesson: "Data minimization is part of the graph design.", buildSequence: ["start", "agent", "condition", "tool", "approval", "end"], fixFault: "Sensitive payment data is passed through the agent node.", available: common, severity: "high" },
  { id: 13, title: "Verified Account", client: "Kindred", story: "A new contractor submits a reward request before their payout account is verified.", objective: "Require verification before approval.", lesson: "A human can approve only what the system has verified.", buildSequence: ["start", "agent", "tool", "condition", "approval", "end"], fixFault: "The approval form appears before account verification.", available: common, severity: "medium" },
  { id: 14, title: "Escalate the Big One", client: "Vector Labs", story: "The reward is above the manager's normal approval limit.", objective: "Route high-value requests to an extra reviewer.", lesson: "Escalation is a graph branch, not a warning label.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "Every amount uses the same approval path.", available: common, severity: "high" },
  { id: 15, title: "Timeout Is Unknown", client: "Juniper", story: "The payment tool times out. It may have succeeded even though no response arrived.", objective: "Pause and reconcile instead of blindly retrying.", lesson: "Unknown state needs investigation, not repetition.", buildSequence: ["start", "agent", "tool", "condition", "approval", "end"], fixFault: "A timeout immediately triggers a second payment.", available: common, severity: "high" },
  { id: 16, title: "One Request, One Effect", client: "Arcade Systems", story: "Two workers submit the same reward request at nearly the same time.", objective: "Use a stable idempotency key before execution.", lesson: "Identity for the request protects the side effect.", buildSequence: ["start", "agent", "condition", "tool", "approval", "end"], fixFault: "The graph has no stable request identity.", available: common, severity: "high" },
  { id: 17, title: "Declined, Not Done", client: "Lighthouse", story: "The payment is declined. The agent reports success because the API call completed.", objective: "Route a declined result to a safe recovery path.", lesson: "Business status matters more than transport status.", buildSequence: ["start", "agent", "tool", "condition", "stop", "end"], fixFault: "A declined payment reaches the success message.", available: common, severity: "medium" },
  { id: 18, title: "Leave a Trail", client: "Paperplane", story: "Finance needs to know who approved, what was sent, and why.", objective: "Record an audit event before completion.", lesson: "If it cannot be explained later, it is not finished.", buildSequence: ["start", "agent", "approval", "tool", "condition", "end"], fixFault: "The graph finishes without an audit record.", available: common, severity: "medium" },
  { id: 19, title: "Trust the Webhook", client: "Kiteworks", story: "A webhook claims that a reward settled. The payload is unsigned.", objective: "Verify an event before updating state.", lesson: "Incoming events need their own trust boundary.", buildSequence: ["start", "tool", "condition", "agent", "end"], fixFault: "Any webhook can mark a payment as settled.", available: common, severity: "high" },
  { id: 20, title: "Halfway There", client: "Morrow", story: "The graph completed the transfer but failed while writing the receipt.", objective: "Recover from a partial workflow without paying again.", lesson: "Recovery must know what already happened.", buildSequence: ["start", "tool", "condition", "retry", "end"], fixFault: "Recovery restarts the entire graph.", available: common, severity: "high" },
  { id: 21, title: "The Second Pair of Eyes", client: "Common Thread", story: "A sensitive reward needs a second reviewer when risk signals are present.", objective: "Add a meaningful human review branch.", lesson: "Approval should be placed where it can still change the outcome.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The reviewer is asked to approve after execution.", available: common, severity: "medium" },
  { id: 22, title: "Specialists, Not Chaos", client: "Delta Union", story: "A research agent and a payment agent must collaborate without sharing everything.", objective: "Connect specialists through a controlled handoff.", lesson: "Multi-agent design is permission design.", buildSequence: ["start", "agent", "condition", "tool", "approval", "end"], fixFault: "One agent receives every tool and every secret.", available: common, severity: "high" },
  { id: 23, title: "Least Privilege", client: "Bluebird", story: "The notification agent somehow has permission to issue refunds.", objective: "Limit each agent to the tools it needs.", lesson: "An unused capability is still an attack surface.", buildSequence: ["start", "agent", "condition", "stop", "end"], fixFault: "A low-trust agent can call a high-impact tool.", available: common, severity: "high" },
  { id: 24, title: "The Mandate", client: "Open Market", story: "A buyer gives an agent a budget, time window, and seller requirement.", objective: "Turn intent into a bounded purchase mandate.", lesson: "Delegation needs explicit conditions.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The agent chooses outside the user's stated limits.", available: common, severity: "high" },
  { id: 25, title: "The Full Repair", client: "GraphOps HQ", story: "A complete payout graph was attacked. It retries payments, skips policy, and hides its trace.", objective: "Repair the graph so it can act, fail, stop, and explain itself.", lesson: "Reliable agents are designed around safe failure.", buildSequence: ["start", "agent", "condition", "approval", "retry", "tool", "stop", "end"], fixFault: "Three safety boundaries are missing from the production graph.", available: common, severity: "high" },
];
