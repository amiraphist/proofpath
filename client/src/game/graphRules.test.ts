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

  it("marks the genuine divergence edge and accepts the deterministic repair for every Fix mission", () => {
    const expectedBrokenEdgeByStage: Record<number, number> = { 9: 0, 10: 0, 11: 1, 12: 0, 13: 0, 14: 2, 15: 1, 16: 1 };
    stages.forEach((stage, index) => {
      if (stage.mode !== "fix") return;
      const attacked = makeInitialGraph(stage, "fix");
      const broken = attacked.edges.find((edge) => edge.state === "broken");
      expect(broken, `stage ${stage.id}`).toBeDefined();
      expect(broken?.id, `stage ${stage.id}`).toBe(`edge-${expectedBrokenEdgeByStage[stage.id]}`);
      expect(validateGraph(stage, "fix", attacked.nodes, attacked.edges).ok, `attacked stage ${stage.id}`).toBe(false);
      const repaired = solvedGraph(index);
      expect(validateGraph(stage, "fix", repaired.nodes, repaired.edges).ok, `repaired stage ${stage.id}`).toBe(true);
    });
  });

  it("models Fake System Update as an external attack event that policy guard blocks", () => {
    const stage = stages[8];
    const attacked = makeInitialGraph(stage, "fix");
    expect(stage.attackEvent).toMatch(/malicious prompt/i);
    expect(attacked.nodes.some((node) => node.compromised)).toBe(false);
    const repairedNodes = stage.buildSequence.map((type, index) => ({ id: `${type}-safe-${index}`, type, x: 20 + index * 12, y: 45 }));
    const repairedEdges = repairedNodes.slice(0, -1).map((node, index) => ({ id: `edge-safe-${index}`, from: node.id, to: repairedNodes[index + 1].id, state: "valid" as const }));
    const result = validateGraph(stage, "fix", repairedNodes, repairedEdges);
    expect(result.ok).toBe(true);
    expect(stage.buildSequence).toContain("policy");
  });

  it("keeps the new safety concepts in the intended Build curriculum", () => {
    expect(stages[1].buildSequence).toContain("limit");
    expect(stages[2].buildSequence).toContain("verify");
    expect(stages[3].buildSequence).toEqual(["agent", "slippage", "wallet", "tool"]);
    expect(stages[6].buildSequence).toContain("quorum");
    expect(stages[13].buildSequence).toContain("expiry");
  });

  it("keeps Policy first for untrusted approval fixes and makes Rogue Skill deletion explicit", () => {
    expect(stages[8].buildSequence.slice(0, 3)).toEqual(["agent", "policy", "condition"]);
    expect(stages[11].buildSequence.slice(0, 3)).toEqual(["agent", "policy", "condition"]);
    expect(stages[12].objective).toMatch(/Delete the Send payment card/i);
    expect(stages[12].available).not.toContain("wallet");
  });
});
