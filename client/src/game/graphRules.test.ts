import { describe, expect, it } from "vitest";
import { stages } from "./stages";
import { makeInitialGraph, validateGraph } from "./graphRules";

function solvedGraph(stageIndex: number) {
  const stage = stages[stageIndex];
  const nodes = stage.buildSequence.map((type, index) => ({ id: `${type}-test-${index}`, type, x: 20 + index * 12, y: 45 }));
  const edges = nodes.slice(0, -1).map((node, index) => ({ id: `edge-test-${index}`, from: node.id, to: nodes[index + 1].id, state: "valid" as const }));
  return { nodes, edges };
}

describe("ProofPath payment curriculum", () => {
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
    const expectedBrokenEdgeByStage: Record<number, number> = { 9: 0, 10: 0, 11: 1, 12: 0, 13: 0, 14: 2, 15: 3, 16: 1 };
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

  it("rejects Stage 03 when a direct Agent-to-Ledger bypass sits beside recipient verification", () => {
    const stage = stages[2];
    const graph = solvedGraph(2);
    const [agent, verify, ledger] = graph.nodes;
    const bypassed = {
      ...graph,
      edges: [...graph.edges, { id: "unsafe-bypass", from: agent.id, to: ledger.id, state: "valid" as const }],
    };

    expect(validateGraph(stage, "build", bypassed.nodes, bypassed.edges).ok).toBe(false);
    expect(validateGraph(stage, "build", graph.nodes, graph.edges).ok).toBe(true);
    expect(verify.type).toBe("verify");
  });

  it("explains the first connection gesture when all required nodes exist but no line has been drawn", () => {
    const stage = stages[2];
    const graph = solvedGraph(2);
    const result = validateGraph(stage, "build", graph.nodes, []);

    expect(result.ok).toBe(false);
    expect(result.summary).toMatch(/click an output dot, then click the next input dot/i);
  });

  it("gives an empty unsafe board zero progress instead of a partial score", () => {
    const stage = stages[0];
    const result = validateGraph(stage, "build", [], []);

    expect(result.ok).toBe(false);
    expect(result.score).toBe(0);
    expect(result.summary).toMatch(/This story needs:/);
  });

  it("keeps Policy first for untrusted approval fixes and makes Rogue Skill deletion explicit", () => {
    expect(stages[8].buildSequence.slice(0, 3)).toEqual(["agent", "policy", "condition"]);
    expect(stages[11].buildSequence.slice(0, 3)).toEqual(["agent", "policy", "condition"]);
    expect(stages[12].objective).toMatch(/Delete the Send payment card/i);
    expect(stages[12].available).not.toContain("wallet");
  });

  it("makes Deepfake Approval a single visible Policy guard repair", () => {
    const stage = stages[11];
    const attacked = makeInitialGraph(stage, "fix");
    expect(stage.attackSequence).toEqual(["agent", "condition", "approval", "wallet", "tool"]);
    expect(stage.buildSequence).toEqual(["agent", "policy", "condition", "approval", "wallet", "tool"]);
    expect(attacked.edges.filter((edge) => edge.state === "broken").map((edge) => edge.id)).toEqual(["edge-0"]);
    expect(stage.attackSequence.filter((type) => !stage.buildSequence.includes(type))).toEqual([]);
    expect(stage.buildSequence.filter((type) => !stage.attackSequence?.includes(type))).toEqual(["policy"]);
    expect(validateGraph(stage, "fix", attacked.nodes, attacked.edges).ok).toBe(false);
    const repaired = solvedGraph(11);
    expect(validateGraph(stage, "fix", repaired.nodes, repaired.edges).ok).toBe(true);
  });

  it("requires a sealed action before hardware signing when an agent can mutate an approved request", () => {
    const stage = stages[14];
    expect(stage.buildSequence).toEqual(["agent", "condition", "preview", "approval", "seal", "wallet", "tool"]);
    expect(stage.attackSequence).toEqual(["agent", "condition", "preview", "approval", "wallet", "tool"]);
    expect(stage.attackEvent).toMatch(/changed the destination after real owner approval/i);
    expect(stage.fixFault).toMatch(/Seal exact action/i);
  });
});
