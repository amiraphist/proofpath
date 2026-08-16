import { stages } from "../client/src/game/stages.ts";
import { validateGraph } from "../client/src/game/graphRules.ts";

const results = stages.map((stage) => {
  const nodes = stage.buildSequence.map((type, index) => ({ id: `${type}-${index}`, type, x: 15 + index * 10, y: 50 }));
  const edges = nodes.slice(0, -1).map((node, index) => ({ id: `edge-${index}`, from: node.id, to: nodes[index + 1].id, state: "valid" }));
  const outcome = validateGraph(stage, stage.mode, nodes, edges);
  return { id: stage.id, title: stage.title, mode: stage.mode, ok: outcome.ok, score: outcome.score };
});

console.table(results);
if (results.some((result) => !result.ok || result.score !== 100)) process.exit(1);
