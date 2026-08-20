import type { NodeType } from "./stages";

/** Keeps the hardware signer early in every palette without revealing a solution order. */
export function orderPaletteNodes(available: readonly NodeType[]): NodeType[] {
  const ordered = [...available];
  const ledgerIndex = ordered.indexOf("wallet");
  if (ledgerIndex < 0) return ordered;

  const [ledger] = ordered.splice(ledgerIndex, 1);
  ordered.splice(Math.min(2, ordered.length), 0, ledger);
  return ordered;
}
