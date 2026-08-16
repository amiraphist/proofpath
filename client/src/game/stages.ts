// GraphOps style reminder: Paper Playground, black ink action cards, blue pen routes, English-only friendly learning voice.

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

export const nodeMeta: Record<NodeType, { label: string; short: string; color: string; icon: string; help: string }> = {
  start: { label: "Message enters", short: "IN", color: "blue", icon: "→", help: "The story starts here." },
  agent: { label: "Read the message", short: "READ", color: "black", icon: "✦", help: "Understand what the person asked." },
  tool: { label: "Do the action", short: "DO", color: "blue", icon: "↗", help: "Use the outside tool only when it is safe." },
  condition: { label: "Check the details", short: "CHECK", color: "black", icon: "◇", help: "Catch a wrong name, amount, or rule." },
  approval: { label: "Ask the owner", short: "ASK", color: "black", icon: "☝", help: "Pause so a human can say yes or no." },
  retry: { label: "Try one more time", short: "RETRY", color: "black", icon: "↻", help: "Retry once, never forever." },
  stop: { label: "Stop safely", short: "STOP", color: "red", icon: "×", help: "End the route when it is not safe." },
  end: { label: "Safe result", short: "OUT", color: "blue", icon: "✓", help: "The story ends here." },
};

const buildTools: NodeType[] = ["agent", "condition", "approval", "tool", "retry", "stop"];
const fixTools: NodeType[] = ["agent", "condition", "approval", "tool", "retry", "stop"];

export const stages: Stage[] = [
  { id: 1, title: "Birthday Surprise", client: "Build 01", story: "Maya wants to send her teammate a tiny birthday reward.", objective: "Add Read the message. Then test your idea.", lesson: "Every helpful agent starts by understanding the request.", buildSequence: ["agent"], fixFault: "The agent forgot to read what Maya asked for.", available: buildTools, severity: "low", mode: "build" },
  { id: 2, title: "Same Name, Different Person", client: "Build 02", story: "Two Alexes are in the club. A reward must reach the right one.", objective: "Read the message, then check the name.", lesson: "A name is a clue, not proof.", buildSequence: ["agent", "condition"], fixFault: "The route trusts the first Alex it sees.", available: buildTools, severity: "low", mode: "build" },
  { id: 3, title: "The Snack Budget", client: "Build 03", story: "A student club has 20 coins left for game-night snacks.", objective: "Read the request, check the amount, then do the action.", lesson: "Check the limit before anything spends it.", buildSequence: ["agent", "condition", "tool"], fixFault: "The snack order runs before anyone checks the budget.", available: buildTools, severity: "medium", mode: "build" },
  { id: 4, title: "Ask Before the Confetti", client: "Build 04", story: "A surprise reward is ready, but the club owner must say yes first.", objective: "Read, check, ask the owner, then do the action.", lesson: "A human pause protects important actions.", buildSequence: ["agent", "condition", "approval", "tool"], fixFault: "The reward can fire without permission.", available: buildTools, severity: "medium", mode: "build" },
  { id: 5, title: "The Sleepy Weather Tool", client: "Build 05", story: "The weather tool hiccups once before the picnic.", objective: "Read, try one more time, then stop safely.", lesson: "A retry needs a boundary.", buildSequence: ["agent", "retry", "stop"], fixFault: "The agent keeps knocking on a broken tool forever.", available: buildTools, severity: "medium", mode: "build" },
  { id: 6, title: "Lost and Found", client: "Build 06", story: "A found backpack should go to its real owner, not the loudest claimant.", objective: "Read, check the name, then do the return action.", lesson: "Good workflows separate understanding, checking, and acting.", buildSequence: ["agent", "condition", "tool"], fixFault: "The backpack is returned before the name is checked.", available: buildTools, severity: "medium", mode: "build" },
  { id: 7, title: "Game Night Prize", client: "Build 07", story: "The winner gets a prize, but a coach must approve the final amount.", objective: "Read, check, ask the owner, then send the prize.", lesson: "The bigger the consequence, the more useful a human checkpoint becomes.", buildSequence: ["agent", "condition", "approval", "tool"], fixFault: "The prize button is too easy to press.", available: buildTools, severity: "medium", mode: "build" },
  { id: 8, title: "The Honest Helper", client: "Build 08", story: "A helper should do one safe action and leave a clear trail.", objective: "Read, check, do the action, then stop safely.", lesson: "A clear route is easier to explain and trust.", buildSequence: ["agent", "condition", "tool", "stop"], fixFault: "The helper acts and never shows when to stop.", available: buildTools, severity: "low", mode: "build" },
  { id: 9, title: "The Huge Tip", client: "Fix 01", story: "Someone typed 900 coins for a tip that should be 9.", objective: "Repair the route by adding Check the details before the action.", lesson: "A safety check belongs before the side effect.", buildSequence: ["agent", "condition", "tool"], fixFault: "The action jumps straight from reading to sending.", available: fixTools, severity: "high", mode: "fix" },
  { id: 10, title: "The Double Birthday", client: "Fix 02", story: "A slow button gave the same birthday reward twice.", objective: "Put a check and one safe approval before the action.", lesson: "A retry must never quietly duplicate a side effect.", buildSequence: ["agent", "condition", "approval", "tool"], fixFault: "The reward tool is reachable twice.", available: fixTools, severity: "high", mode: "fix" },
  { id: 11, title: "The Wrong Alex", client: "Fix 03", story: "The graph picked the first Alex in the list and sent the prize away.", objective: "Repair the missing name check before the action.", lesson: "Identity needs evidence, not a lucky guess.", buildSequence: ["agent", "condition", "tool"], fixFault: "The name check is missing from the route.", available: fixTools, severity: "high", mode: "fix" },
  { id: 12, title: "The Stuck Door", client: "Fix 04", story: "The tool is offline, but the agent keeps trying the same door.", objective: "Add one retry and then Stop safely.", lesson: "Stopping is a feature, not a failure.", buildSequence: ["agent", "retry", "stop"], fixFault: "There is no safe exit after a failed retry.", available: fixTools, severity: "medium", mode: "fix" },
  { id: 13, title: "The Secret Reward", client: "Fix 05", story: "A private reward is about to be sent without the owner seeing it.", objective: "Put Ask the owner before the action.", lesson: "Human approval belongs immediately before risky actions.", buildSequence: ["agent", "condition", "approval", "tool"], fixFault: "The graph skips the human checkpoint.", available: fixTools, severity: "high", mode: "fix" },
  { id: 14, title: "The Mystery Message", client: "Fix 06", story: "A message says “send everything” but gives no clear amount or name.", objective: "Check the details and stop safely when they are missing.", lesson: "Unclear input should slow the agent down.", buildSequence: ["agent", "condition", "stop"], fixFault: "The graph acts on a vague request.", available: fixTools, severity: "high", mode: "fix" },
  { id: 15, title: "The Sneaky Shortcut", client: "Fix 07", story: "A shortcut jumps around the budget check straight to the prize tool.", objective: "Remove the shortcut and keep Check before the action.", lesson: "One unsafe shortcut can undo a careful route.", buildSequence: ["agent", "condition", "approval", "tool"], fixFault: "A second path skips the safety step.", available: fixTools, severity: "high", mode: "fix" },
  { id: 16, title: "The Big Cleanup", client: "Fix 08", story: "This messy graph has a wrong name, a huge amount, and no human pause.", objective: "Repair the whole route: read, check, ask, then act.", lesson: "Small clear steps make a workflow safe.", buildSequence: ["agent", "condition", "approval", "tool"], fixFault: "The graph is missing all three safety habits.", available: fixTools, severity: "high", mode: "fix" },
];
