// GraphOps style reminder: Paper Lab, white graph paper, black ink nodes, blue pen routes, English-only friendly learning voice.

export type GameMode = "build" | "fix";
export type NodeType = "start" | "agent" | "tool" | "condition" | "approval" | "retry" | "stop" | "end";

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
  mode: GameMode;
};

export const nodeMeta: Record<NodeType, { label: string; short: string; color: string; icon: string }> = {
  start: { label: "Start", short: "START", color: "blue", icon: "○" },
  agent: { label: "Agent", short: "THINK", color: "black", icon: "✦" },
  tool: { label: "Tool", short: "DO", color: "blue", icon: "↗" },
  condition: { label: "Check", short: "CHECK", color: "black", icon: "◇" },
  approval: { label: "Ask a human", short: "ASK", color: "black", icon: "☝" },
  retry: { label: "Try again", short: "RETRY", color: "black", icon: "↻" },
  stop: { label: "Stop", short: "STOP", color: "red", icon: "×" },
  end: { label: "Finish", short: "DONE", color: "blue", icon: "✓" },
};

const buildTools: NodeType[] = ["agent", "tool", "condition", "approval", "retry", "stop"];
const fixTools: NodeType[] = ["agent", "tool", "condition", "approval", "retry", "stop"];

export const stages: Stage[] = [
  { id: 1, title: "The Friendly Hello", client: "Build 01", story: "A tiny agent needs to receive a message and say hello.", objective: "Draw a route from Start to Agent to Finish.", lesson: "A graph is a path: something starts, something thinks, and something ends.", buildSequence: ["start", "agent", "end"], fixFault: "The greeting has no clear finish.", available: ["agent", "end"], severity: "low", mode: "build" },
  { id: 2, title: "Check the Name", client: "Build 02", story: "An agent wants to send a message to a friend. First, check who the friend is.", objective: "Put a Check before the Tool.", lesson: "Check important information before asking a tool to act.", buildSequence: ["start", "agent", "condition", "tool", "end"], fixFault: "The tool runs before the name is checked.", available: buildTools, severity: "low", mode: "build" },
  { id: 3, title: "Ask Before Sending", client: "Build 03", story: "The agent wants to send a surprise message. A human should say yes first.", objective: "Place Ask a human before the Tool.", lesson: "Human approval is a pause that protects people.", buildSequence: ["start", "agent", "approval", "tool", "end"], fixFault: "The message is sent without a human pause.", available: buildTools, severity: "medium", mode: "build" },
  { id: 4, title: "A Safe Reward", client: "Build 04", story: "A manager wants to give a small reward to a teammate.", objective: "Build: Agent → Check → Ask a human → Tool.", lesson: "Good agents check, ask, and only then act.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The reward route skips a safety step.", available: buildTools, severity: "medium", mode: "build" },
  { id: 5, title: "Try, But Not Forever", client: "Build 05", story: "A weather tool sometimes needs a second try, but it must not loop forever.", objective: "Add Try again and then Stop before Finish.", lesson: "Every retry needs a limit.", buildSequence: ["start", "agent", "retry", "stop", "end"], fixFault: "The agent keeps trying forever.", available: buildTools, severity: "medium", mode: "build" },
  { id: 6, title: "Read Before You Act", client: "Build 06", story: "The agent reads a list, checks it, and then uses a tool.", objective: "Build: Agent → Check → Tool → Finish.", lesson: "Reading and acting are different steps.", buildSequence: ["start", "agent", "condition", "tool", "end"], fixFault: "The agent acts on unchecked information.", available: buildTools, severity: "low", mode: "build" },
  { id: 7, title: "The Tiny Budget", client: "Build 07", story: "A club has a small budget for snacks.", objective: "Add a Check before the purchase Tool.", lesson: "Rules become useful when they sit before action.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The purchase can pass the budget limit.", available: buildTools, severity: "medium", mode: "build" },
  { id: 8, title: "Explain the Answer", client: "Build 08", story: "The agent finds an answer and must leave a clear trail.", objective: "Build a complete route that ends cleanly.", lesson: "A useful graph should be easy to follow later.", buildSequence: ["start", "agent", "condition", "tool", "end"], fixFault: "The answer disappears without a clear ending.", available: buildTools, severity: "low", mode: "build" },
  { id: 9, title: "The Missing Check", client: "Fix 01", story: "Someone removed the Check from a reward graph.", objective: "Repair the missing Check before the Tool.", lesson: "When a safety step disappears, the graph must stop being trusted.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The graph jumps from Agent to Ask a human.", available: fixTools, severity: "medium", mode: "fix" },
  { id: 10, title: "The Endless Loop", client: "Fix 02", story: "A weather agent keeps trying the same broken tool.", objective: "Repair the loop with Try again and Stop.", lesson: "A safe failure is better than an endless loop.", buildSequence: ["start", "agent", "retry", "stop", "end"], fixFault: "There is no stop after repeated failure.", available: fixTools, severity: "medium", mode: "fix" },
  { id: 11, title: "The Early Tool", client: "Fix 03", story: "A purchase Tool runs before anyone checks the request.", objective: "Move the Check before the Tool.", lesson: "Order changes meaning.", buildSequence: ["start", "agent", "condition", "tool", "end"], fixFault: "The Tool acts on unchecked information.", available: fixTools, severity: "medium", mode: "fix" },
  { id: 12, title: "The Double Reward", client: "Fix 04", story: "A slow network makes the reward happen twice.", objective: "Repair the route so a retry cannot repeat the reward.", lesson: "Retries should protect side effects, not duplicate them.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The reward Tool can run twice.", available: fixTools, severity: "high", mode: "fix" },
  { id: 13, title: "The Missing Human", client: "Fix 05", story: "A sensitive action is sent straight from Agent to Tool.", objective: "Put Ask a human before the Tool.", lesson: "A human checkpoint should arrive before the important action.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "There is no human checkpoint.", available: fixTools, severity: "high", mode: "fix" },
  { id: 14, title: "The Bad Name", client: "Fix 06", story: "Two people have the same name and the graph trusts the first match.", objective: "Repair the route with a Check before the Tool.", lesson: "Names are clues; checks create confidence.", buildSequence: ["start", "agent", "condition", "tool", "end"], fixFault: "The Tool trusts a name without checking identity.", available: fixTools, severity: "medium", mode: "fix" },
  { id: 15, title: "The Hidden Stop", client: "Fix 07", story: "A broken service makes the agent keep working after three failures.", objective: "Add a visible Stop before Finish.", lesson: "Every system needs a safe way to stop.", buildSequence: ["start", "agent", "retry", "stop", "end"], fixFault: "The graph has no safe stop.", available: fixTools, severity: "medium", mode: "fix" },
  { id: 16, title: "The Big Repair", client: "Fix 08", story: "This graph has three missing safety ideas: check, approval, and a clean finish.", objective: "Repair the full route and run it safely.", lesson: "Small safety steps make a big difference.", buildSequence: ["start", "agent", "condition", "approval", "tool", "end"], fixFault: "The graph skips the main safety boundaries.", available: fixTools, severity: "high", mode: "fix" },
];
