// GraphOps style reminder: Neon Glass Circuit, semantic neon colors, English-only technical game voice.

import type { GameMode, Stage } from "./stages";
import type { GraphEdge, GraphNode, SessionResult, TraceEvent } from "./types";

const clock = (index: number) => `00:${String(12 + index * 3).padStart(2, "0")}`;

export function makeInitialGraph(stage: Stage, mode: GameMode): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const sequence = mode === "fix" ? stage.buildSequence.map((type, index) => (index === 2 && type === "condition" ? "agent" : type)) : stage.buildSequence.slice(0, 3);
  const gap = sequence.length > 1 ? 82 / (sequence.length - 1) : 82;
  const nodes = sequence.map((type, index) => ({ id: `${type}-${index}`, type, x: 9 + index * gap, y: 43 + (index % 2 === 0 ? -5 : 7) }));
  const edges = nodes.slice(0, -1).map((node, index) => ({ id: `edge-${index}`, from: node.id, to: nodes[index + 1].id, state: (mode === "fix" && index === 1 ? "broken" : "valid") as "broken" | "valid" }));
  return { nodes, edges };
}

function trace(...events: Omit<TraceEvent, "time">[]): TraceEvent[] {
  return events.map((event, index) => ({ ...event, time: clock(index) }));
}

export function validateGraph(stage: Stage, mode: GameMode, nodes: GraphNode[], edges: GraphEdge[]): SessionResult {
  const types = nodes.map((node) => node.type);
  const expected = stage.buildSequence;
  const hasStart = types[0] === "start";
  const hasEnd = types.at(-1) === "end";
  const missingApproval = stage.id <= 5 || stage.id >= 13 ? !types.includes("approval") : false;
  const duplicate = edges.some((edge) => edge.state === "broken") || new Set(edges.map((edge) => `${edge.from}:${edge.to}`)).size !== edges.length;
  const sequenceMatch = expected.every((type) => types.includes(type));
  const structurallySafe = hasStart && hasEnd && !missingApproval && !duplicate && sequenceMatch;

  if (structurallySafe) {
    return {
      ok: true,
      score: Math.max(72, 100 - Math.max(0, nodes.length - expected.length) * 3),
      summary: mode === "fix" ? "Repair accepted. The graph now fails safely." : "Build accepted. The graph is ready for a safe run.",
      learning: stage.lesson,
      trace: trace(
        { label: "GRAPH", detail: "Topology validated", tone: "neutral" },
        { label: "POLICY", detail: "Safety boundary passed", tone: "good" },
        { label: "HUMAN", detail: "Approval checkpoint reached", tone: "good" },
        { label: "TOOL", detail: "Simulated side effect committed", tone: "good" },
        { label: "END", detail: "Audit trail closed", tone: "good" },
      ),
    };
  }

  const reason = !hasStart ? "The graph needs a clear trigger." : !hasEnd ? "The graph has no verified end state." : missingApproval ? "A human approval boundary is missing." : duplicate ? "Broken route detected. Reconnect the red edge, then run again." : "The graph is missing a required safety step.";
  return {
    ok: false,
    score: Math.max(18, 54 - nodes.length * 2),
    summary: reason,
    learning: stage.lesson,
    trace: trace(
      { label: "GRAPH", detail: "Run started", tone: "neutral" },
      { label: "ALERT", detail: reason, tone: "danger" },
      { label: "STOP", detail: "Side effect blocked by simulator", tone: "warn" },
    ),
  };
}
