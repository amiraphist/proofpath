import { useMemo, useState } from "react";
import { makeInitialGraph, validateGraph } from "./graphRules";
import { stages, type GameMode, type NodeType } from "./stages";
import type { GameSession, GraphNode, SessionResult } from "./types";

const freshSession = (stageIndex: number, nextMode: GameMode): GameSession => {
  const stage = stages[stageIndex];
  const graph = makeInitialGraph(stage, nextMode);
  return { mode: nextMode, stageId: stage.id, ...graph, selectedNodeId: null, result: null, attempts: 0, completed: false, notice: null };
};

export function useGameSession() {
  const [mode, setMode] = useState<GameMode>(stages[0].mode);
  const [stageIndex, setStageIndex] = useState(0);
  const [session, setSession] = useState<GameSession>(() => freshSession(0, stages[0].mode));
  const [history, setHistory] = useState<GameSession[]>([]);

  const stage = stages[stageIndex];
  const totalCompleted = useMemo(() => Math.max(0, stageIndex + (session.completed ? 1 : 0)), [stageIndex, session.completed]);
  const saveHistory = (current: GameSession) => setHistory((items) => [...items.slice(-9), current]);

  const reset = (nextMode = mode, nextStage = stageIndex) => {
    setMode(nextMode);
    setStageIndex(nextStage);
    setSession(freshSession(nextStage, nextMode));
    setHistory([]);
  };

  const selectMode = (nextMode: GameMode) => reset(nextMode, stageIndex);
  const selectStage = (nextStage: number) => { const safeIndex = Math.min(stages.length - 1, Math.max(0, nextStage)); reset(stages[safeIndex].mode, safeIndex); };
  const selectNode = (nodeId: string | null) => setSession((current) => ({ ...current, selectedNodeId: current.selectedNodeId === nodeId ? null : nodeId }));
  const showConnectionNotice = (notice: string) => setSession((current) => ({ ...current, notice }));

  const moveNode = (nodeId: string, x: number, y: number) => setSession((current) => ({ ...current, nodes: current.nodes.map((node) => node.id === nodeId ? { ...node, x, y } : node), result: null, notice: null }));

  const connectNodes = (from: string, to: string) => setSession((current) => {
    if (!from) return { ...current, notice: "Choose an output blue dot first, then choose the next card." };
    if (from === to) return { ...current, notice: "A card cannot connect to itself — pick a different blue dot." };
    const existing = current.edges.find((edge) => edge.from === from && edge.to === to);
    if (existing) return { ...current, notice: "That blue pen line is already there. Try a new path." };
    const broken = current.edges.find((edge) => edge.state === "broken");
    if (broken) {
      saveHistory(current);
      return { ...current, edges: current.edges.map((edge) => edge.id === broken.id ? { ...edge, from, to, state: "valid" as const } : edge), result: null, notice: "Nice fix — the broken blue pen line is reconnected." };
    }
    if (current.edges.some((edge) => edge.state === "valid" && edge.from === from)) return { ...current, notice: "Each node gets one blue pen line leaving it. Keep one clear route." };
    if (current.edges.some((edge) => edge.state === "valid" && edge.to === to)) return { ...current, notice: "Each node gets one blue pen line entering it. Keep one clear route." };
    saveHistory(current);
    return { ...current, edges: [...current.edges, { id: `edge-${Date.now()}`, from, to, state: "valid" as const }], result: null, notice: "Blue pen line added. Keep building the path." };
  });

  const addNode = (type: NodeType) => {
    const id = `${type}-${Date.now()}`;
    setSession((current) => {
      saveHistory(current);
      const slot = current.nodes.length;
      const targetCount = Math.max(1, stage.buildSequence.length);
      const gap = targetCount > 1 ? 64 / (targetCount - 1) : 0;
      const x = 18 + Math.min(slot, targetCount - 1) * gap;
      const y = 46 + (slot % 2 === 0 ? -7 : 7);
      return { ...current, nodes: [...current.nodes, { id, type, x, y }], selectedNodeId: id, result: null, notice: "Card added. Drag it somewhere clear, then join the blue dots." };
    });
  };

  const removeNode = (nodeId: string) => setSession((current) => {
    saveHistory(current);
    return { ...current, nodes: current.nodes.filter((node) => node.id !== nodeId), edges: current.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId), selectedNodeId: null, result: null, notice: "Card removed. You can undo that if it was a mistake." };
  });

  const removeEdge = (edgeId: string) => setSession((current) => {
    const edge = current.edges.find((item) => item.id === edgeId);
    if (!edge) return current;
    saveHistory(current);
    return { ...current, edges: current.edges.filter((item) => item.id !== edgeId), result: null, notice: "Blue pen line removed. Draw the safer route instead." };
  });

  const repair = () => setSession((current) => {
    saveHistory(current);
    const gap = stage.buildSequence.length > 1 ? 68 / (stage.buildSequence.length - 1) : 68;
    const used = new Set<string>();
    const nodes = stage.buildSequence.map((type, index) => {
      const existing = current.nodes.find((node) => node.type === type && !used.has(node.id));
      const id = existing?.id ?? `${type}-repair-${index}`;
      used.add(id);
      return { id, type, x: 16 + index * gap, y: 47 + (index % 2 === 0 ? -7 : 7) };
    });
    const edges = nodes.slice(0, -1).map((node, index) => ({ id: `edge-repaired-${index}`, from: node.id, to: nodes[index + 1].id, state: "valid" as const }));
    return { ...current, edges, nodes, selectedNodeId: null, result: null, notice: "Trusted controls restored. The attack event can no longer reach a signer or send step." };
  });

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) {
      setSession((current) => ({ ...current, notice: "Nothing to undo yet." }));
      return;
    }
    setSession(previous);
    setHistory((items) => items.slice(0, -1));
  };

  const run = () => {
    const result: SessionResult = validateGraph(stage, mode, session.nodes, session.edges);
    setSession((current) => ({ ...current, result, attempts: current.attempts + 1, completed: result.ok, notice: result.ok ? "Great route — your payment idea is safe to try." : result.summary }));
  };

  const nextStage = () => selectStage(stageIndex + 1);

  return { mode, stage, stageIndex, session, stages, totalCompleted, selectMode, selectStage, selectNode, moveNode, connectNodes, showConnectionNotice, addNode, removeNode, removeEdge, repair, undo, run, reset, nextStage };
}
