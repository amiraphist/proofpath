// GraphOps style reminder: Neon Glass Circuit, semantic neon colors, English-only technical game voice.

import type { GameMode, NodeType } from "./stages";

export type GraphNode = {
  id: string;
  type: NodeType;
  compromised?: boolean;
  x: number;
  y: number;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  state: "valid" | "broken" | "unknown";
};

export type TraceEvent = {
  time: string;
  label: string;
  detail: string;
  tone: "neutral" | "good" | "warn" | "danger";
};

export type SessionResult = {
  ok: boolean;
  score: number;
  summary: string;
  learning: string;
  trace: TraceEvent[];
};

export type GameSession = {
  mode: GameMode;
  stageId: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  result: SessionResult | null;
  attempts: number;
  completed: boolean;
  notice: string | null;
};
