// GraphOps style reminder: Neon Glass Circuit, semantic neon colors, English-only technical game voice.

import { useMemo, useState } from "react";
import { makeInitialGraph, validateGraph } from "./graphRules";
import { stages, type GameMode, type NodeType } from "./stages";
import type { GameSession, GraphNode, SessionResult } from "./types";

export function useGameSession() {
  const [mode, setMode] = useState<GameMode>("fix");
  const [stageIndex, setStageIndex] = useState(0);
  const [session, setSession] = useState<GameSession>(() => {
    const stage = stages[0];
    const graph = makeInitialGraph(stage, "fix");
    return { mode: "fix", stageId: stage.id, ...graph, selectedNodeId: null, result: null, attempts: 0, completed: false };
  });

  const stage = stages[stageIndex];
  const totalCompleted = useMemo(() => Math.max(0, stageIndex + (session.completed ? 1 : 0)), [stageIndex, session.completed]);

  const reset = (nextMode = mode, nextStage = stageIndex) => {
    const nextStageData = stages[nextStage];
    const graph = makeInitialGraph(nextStageData, nextMode);
    setMode(nextMode);
    setStageIndex(nextStage);
    setSession({ mode: nextMode, stageId: nextStageData.id, ...graph, selectedNodeId: null, result: null, attempts: 0, completed: false });
  };

  const selectMode = (nextMode: GameMode) => reset(nextMode, stageIndex);
  const selectStage = (nextStage: number) => reset(mode, Math.min(stages.length - 1, Math.max(0, nextStage)));

  const selectNode = (nodeId: string | null) => setSession((current) => ({ ...current, selectedNodeId: current.selectedNodeId === nodeId ? null : nodeId }));

  const moveNode = (nodeId: string, x: number, y: number) => setSession((current) => ({ ...current, nodes: current.nodes.map((node) => node.id === nodeId ? { ...node, x, y } : node), result: null }));

  const connectNodes = (from: string, to: string) => setSession((current) => {
    if (from === to) return current;
    const existing = current.edges.find((edge) => edge.from === from && edge.to === to);
    if (existing) return { ...current, edges: current.edges.map((edge) => edge.id === existing.id ? { ...edge, state: "valid" as const } : edge), result: null };
    const broken = current.edges.find((edge) => edge.state === "broken");
    if (broken) return { ...current, edges: current.edges.map((edge) => edge.id === broken.id ? { ...edge, from, to, state: "valid" as const } : edge), result: null };
    return { ...current, edges: [...current.edges, { id: `edge-${Date.now()}`, from, to, state: "valid" as const }], result: null };
  });

  const addNode = (type: NodeType) => {
    const id = `${type}-${Date.now()}`;
    const last = session.nodes.at(-1);
    const x = Math.min(90, (last?.x ?? 10) + 12);
    const y = last?.y && last.y > 50 ? 43 : 56;
    setSession((current) => ({ ...current, nodes: [...current.nodes, { id, type, x, y }], selectedNodeId: id, result: null }));
  };

  const removeNode = (nodeId: string) => {
    setSession((current) => ({ ...current, nodes: current.nodes.filter((node) => node.id !== nodeId), edges: current.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId), selectedNodeId: null, result: null }));
  };

  const repair = () => {
    setSession((current) => {
      const edges = current.edges.map((edge, index) => ({ ...edge, state: index === 1 ? "valid" as const : edge.state }));
      const nodes = current.nodes.some((node) => node.type === "condition") ? current.nodes : (() => { const repairNode = { id: "condition-repair", type: "condition" as NodeType, x: 55, y: 36 }; const endIndex = current.nodes.findIndex((node) => node.type === "end"); return endIndex >= 0 ? [...current.nodes.slice(0, endIndex), repairNode, ...current.nodes.slice(endIndex)] : [...current.nodes, repairNode]; })();
      return { ...current, edges, nodes, result: null };
    });
  };

  const run = () => {
    const result: SessionResult = validateGraph(stage, mode, session.nodes, session.edges);
    setSession((current) => ({ ...current, result, attempts: current.attempts + 1, completed: result.ok }));
  };

  const nextStage = () => selectStage(stageIndex + 1);

  return { mode, stage, stageIndex, session, stages, totalCompleted, selectMode, selectStage, selectNode, moveNode, connectNodes, addNode, removeNode, repair, run, reset, nextStage };
}
