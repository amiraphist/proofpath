// GraphOps style reminder: Paper Playground, visible action cards only, blue pen lines, friendly English feedback.

import type { GameMode, Stage } from "./stages";
import type { GraphEdge, GraphNode, SessionResult, TraceEvent } from "./types";

const clock = (index: number) => `Step ${index + 1}`;

// The red edge marks the exact trusted connection that an attack exploited.
// It is the edge immediately before the first attack/safe-route divergence.
function brokenEdgeIndex(stage: Stage, sequence: GraphNode["type"][]) {
  const safe = stage.buildSequence;
  const firstDifference = sequence.findIndex((type, index) => type !== safe[index]);
  if (firstDifference === -1) return Math.max(0, sequence.length - 2);
  return Math.max(0, Math.min(firstDifference - 1, sequence.length - 2));
}

export function makeInitialGraph(stage: Stage, mode: GameMode): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const sequence = mode === "build"
    ? []
    : (stage.attackSequence ?? stage.buildSequence.map((type, index) => (index === 1 ? "agent" : type)));
  const gap = sequence.length > 1 ? 68 / (sequence.length - 1) : 68;
  const nodes = sequence.map((type, index) => ({
    id: `${type}-${index}`,
    type: type as GraphNode["type"],
    x: 16 + index * gap,
    y: 47 + (index % 2 === 0 ? -7 : 7),
  }));
  const brokenIndex = brokenEdgeIndex(stage, sequence as GraphNode["type"][]);
  const edges = mode === "build"
    ? []
    : nodes.slice(0, -1).map((node, index) => ({
      id: `edge-${index}`,
      from: node.id,
      to: nodes[index + 1].id,
      state: (index === brokenIndex ? "broken" : "valid") as GraphEdge["state"],
    }));
  return { nodes, edges };
}

function trace(...events: Omit<TraceEvent, "time">[]): TraceEvent[] {
  return events.map((event, index) => ({ ...event, time: clock(index) }));
}

function followsSequence(stage: Stage, nodes: GraphNode[], edges: GraphEdge[]) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const outgoing = new Map(edges.filter((edge) => edge.state === "valid").map((edge) => [edge.from, edge]));
  const incoming = new Set(edges.map((edge) => edge.to));
  let current = nodes.find((node) => !incoming.has(node.id));
  const visited = new Set<string>();
  const route: string[] = [];
  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    route.push(current.type);
    const edge = outgoing.get(current.id);
    current = edge ? byId.get(edge.to) : undefined;
  }
  return route.join(">") === stage.buildSequence.join(">");
}

const hasExactNodeSet = (stage: Stage, nodes: GraphNode[]) => {
  if (nodes.length !== stage.buildSequence.length) return false;
  return stage.buildSequence.every((type) => nodes.filter((node) => node.type === type).length === stage.buildSequence.filter((item) => item === type).length);
};

export function validateGraph(stage: Stage, mode: GameMode, nodes: GraphNode[], edges: GraphEdge[]): SessionResult {
  const broken = edges.some((edge) => edge.state === "broken");
  const duplicate = new Set(edges.map((edge) => `${edge.from}:${edge.to}`)).size !== edges.length;
  const nodeSetMatch = hasExactNodeSet(stage, nodes);
  const routeMatch = followsSequence(stage, nodes, edges);
  const safe = nodeSetMatch && !broken && !duplicate && routeMatch;

  if (safe) {
    return {
      ok: true,
      score: 100,
      summary: mode === "fix" ? "Nice repair — the blue pen line is safe again." : "Great idea — the route works!",
      learning: stage.lesson,
      trace: trace(
        { label: "ROUTE", detail: "The blue pen lines follow your plan", tone: "neutral" },
        { label: "CHECK", detail: "The safety idea is in the right place", tone: "good" },
        { label: "DONE", detail: "You solved the story", tone: "good" },
      ),
    };
  }

  const reason = broken
    ? `${mode === "fix" ? stage.fixFault.replace("HACK ALERT: ", "") : "The route is incomplete."} Restore this safety rule: ${stage.lesson} Reconnect the red line.`
    : duplicate
      ? `${stage.lesson} Two blue lines do the same job. Keep one clean path.`
      : !nodeSetMatch
        ? `This story needs: ${stage.buildSequence.map((type) => ({ agent: "AI Agent", condition: "Check payment", verify: "Verify recipient", limit: "Spending limit", slippage: "Price & slippage", preview: "Simulate preview", seal: "Seal exact action", approval: "Owner approval", quorum: "Multisig quorum", expiry: "Session expiry", wallet: "Ledger signer", tool: "Send payment", receipt: "Save receipt", dedupe: "Block duplicates", retry: "Safe retry", stop: "Stop & flag", policy: "Policy guard" } as Record<string, string>)[type]).join(" → ")}.`
        : !routeMatch
          ? `${stage.lesson} The cards are in the wrong order. Follow the blue dots.`
          : `One small piece is missing from this safety rule: ${stage.lesson}`;

  return {
    ok: false,
    score: Math.max(20, 70 - nodes.length * 3),
    summary: reason,
    learning: stage.lesson,
    trace: trace(
      { label: "LOOK", detail: "The paper route needs one more look", tone: "neutral" },
      { label: "HINT", detail: reason, tone: "danger" },
      { label: "WAIT", detail: "Nothing happened yet", tone: "warn" },
    ),
  };
}
