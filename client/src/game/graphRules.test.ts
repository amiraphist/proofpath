import { describe, expect, it } from "vitest";
import { stages } from "./stages";
import { makeInitialGraph, validateGraph } from "./graphRules";

function solvedGraph(stageIndex: number) {
  const stage = stages[stageIndex];
  const nodes = stage.buildSequence.map((type, index) => ({ id: `${type}-test-${index}`, type, x: 20 + index * 12, y: 45 }));
  const edges = nodes.slice(0, -1).map((node, index) => ({ id: `edge-test-${index}`, from: node.id, to: nodes[index + 1].id, state: "valid" as const }));
  return { nodes, edges };
}

describe("GraphOps payment curriculum", () => {
  it("accepts the intended safe path for all sixteen missions", () => {
    stages.forEach((stage, index) => {
      const graph = solvedGraph(index);
      const result = validateGraph(stage, stage.mode, graph.nodes, graph.edges);
      expect(result.ok, `stage ${stage.id}: ${stage.title}`).toBe(true);
      expect(result.score).toBe(100);
    });
  });

  it("starts every Fix mission with its own attack state and an explicitly broken route", () => {
    stages.filter((stage) => stage.mode === "fix").forEach((stage) => {
      const graph = makeInitialGraph(stage, "fix");
      expect(stage.attackSequence).toBeDefined();
      expect(graph.nodes.map((node) => node.type)).toEqual(stage.attackSequence);
      expect(graph.nodes.map((node) => node.type)).not.toEqual(stage.buildSequence);
      expect(graph.edges.some((edge) => edge.state === "broken")).toBe(true);
      expect(stage.fixFault).toMatch(/HACK ALERT:/);
    });
  });

  it("keeps the attacker visible while requiring the policy guard in Fake System Update", () => {
    const stage = stages[8];
    const attacked = makeInitialGraph(stage, "fix");
    expect(attacked.nodes.some((node) => node.compromised)).toBe(true);
    expect(attacked.nodes.find((node) => node.compromised)?.type).toBe("agent");
    const repairedNodes = stage.buildSequence.map((type, index) => ({ id: `${type}-safe-${index}`, type, x: 20 + index * 12, y: 45 }));
    const repairedEdges = repairedNodes.slice(0, -1).map((node, index) => ({ id: `edge-safe-${index}`, from: node.id, to: repairedNodes[index + 1].id, state: "valid" as const }));
    const withVisibleAttacker = [...repairedNodes, { id: "agent-attacker", type: "agent" as const, compromised: true, x: 52, y: 78 }];
    const result = validateGraph(stage, "fix", withVisibleAttacker, repairedEdges);
    expect(result.ok).toBe(true);
  });

  it("keeps the new safety concepts in the intended Build curriculum", () => {
    expect(stages[1].buildSequence).toContain("limit");
    expect(stages[2].buildSequence).toContain("verify");
    expect(stages[3].buildSequence).toEqual(["agent", "slippage", "wallet", "tool"]);
    expect(stages[6].buildSequence).toContain("quorum");
    expect(stages[13].buildSequence).toContain("expiry");
  });
});
