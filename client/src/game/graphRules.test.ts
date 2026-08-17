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
  it("accepts the intended safe path for all ten missions", () => {
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

  it("keeps the new safety concepts in the intended Build curriculum", () => {
    expect(stages[1].buildSequence).toContain("limit");
    expect(stages[2].buildSequence).toContain("verify");
    expect(stages[3].buildSequence).toEqual(["agent", "slippage", "preview", "wallet", "tool"]);
    expect(stages[4].buildSequence).toContain("quorum");
    expect(stages[8].buildSequence).toContain("expiry");
  });
});
