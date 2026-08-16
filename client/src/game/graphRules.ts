// GraphOps style reminder: Paper Lab, black ink nodes, blue pen routes, one clear learning action per stage.

import type { GameMode, Stage } from "./stages";
import type { GraphEdge, GraphNode, SessionResult, TraceEvent } from "./types";

const clock = (index: number) => `Step ${index + 1}`;

export function makeInitialGraph(stage: Stage, mode: GameMode): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const sequence = mode === "build" ? ["start", "end"] : stage.buildSequence.map((type, index) => (index === 2 ? "agent" : type));
  const gap = sequence.length > 1 ? 82 / (sequence.length - 1) : 82;
  const nodes = sequence.map((type, index) => ({ id: `${type}-${index}`, type: type as GraphNode["type"], x: 9 + index * gap, y: 43 + (index % 2 === 0 ? -5 : 7) }));
  const edges = mode === "build" ? [] : nodes.slice(0, -1).map((node, index) => ({ id: `edge-${index}`, from: node.id, to: nodes[index + 1].id, state: (index === 1 ? "broken" : "valid") as GraphEdge["state"] }));
  return { nodes, edges };
}

function trace(...events: Omit<TraceEvent, "time">[]): TraceEvent[] {
  return events.map((event, index) => ({ ...event, time: clock(index) }));
}

function followsSequence(stage: Stage, nodes: GraphNode[], edges: GraphEdge[]) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const outgoing = new Map(edges.map((edge) => [edge.from, edge]));
  let current = nodes.find((node) => node.type === "start");
  const visited = new Set<string>();
  const route: string[] = [];
  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    route.push(current.type);
    const edge = outgoing.get(current.id);
    current = edge && edge.state === "valid" ? byId.get(edge.to) : undefined;
  }
  return route.join(">") === stage.buildSequence.join(">");
}

export function validateGraph(stage: Stage, mode: GameMode, nodes: GraphNode[], edges: GraphEdge[]): SessionResult {
  const hasStart = nodes.some((node) => node.type === "start");
  const hasEnd = nodes.some((node) => node.type === "end");
  const duplicate = edges.some((edge) => edge.state === "broken") || new Set(edges.map((edge) => `${edge.from}:${edge.to}`)).size !== edges.length;
  const sequenceMatch = stage.buildSequence.every((type) => nodes.some((node) => node.type === type));
  const routeMatch = followsSequence(stage, nodes, edges);
  const safe = hasStart && hasEnd && !duplicate && sequenceMatch && routeMatch;

  if (safe) {
    return {
      ok: true,
      score: Math.max(80, 100 - Math.max(0, nodes.length - stage.buildSequence.length) * 4),
      summary: mode === "fix" ? "Nice repair. The route is safe." : "Great build. The route works!",
      learning: stage.lesson,
      trace: trace(
        { label: "GRAPH", detail: "Route follows the plan", tone: "neutral" },
        { label: "CHECK", detail: "Safety step passed", tone: "good" },
        { label: "RUN", detail: "The tool was called safely", tone: "good" },
        { label: "DONE", detail: "You solved the mission", tone: "good" },
      ),
    };
  }

  const reason = !hasStart ? "Start the graph with a Start node." : !hasEnd ? "Give the graph a Finish node." : duplicate ? "A red route is broken. Repair it before you run." : !sequenceMatch ? "The graph is missing one important step." : !routeMatch ? "The route order is mixed up. Follow the blue path." : "Try a simpler route.";
  return {
    ok: false,
    score: Math.max(20, 60 - nodes.length * 2),
    summary: reason,
    learning: stage.lesson,
    trace: trace(
      { label: "GRAPH", detail: "The paper route was checked", tone: "neutral" },
      { label: "LOOK", detail: reason, tone: "danger" },
      { label: "STOP", detail: "Nothing was sent", tone: "warn" },
    ),
  };
}
