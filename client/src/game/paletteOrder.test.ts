import { describe, expect, it } from "vitest";
import { orderPaletteNodes } from "./paletteOrder";

describe("orderPaletteNodes", () => {
  it("keeps Ledger in the third palette position when two or more other nodes are available", () => {
    expect(orderPaletteNodes(["agent", "condition", "approval", "wallet", "tool"])).toEqual([
      "agent",
      "condition",
      "wallet",
      "approval",
      "tool",
    ]);
  });

  it("places Ledger second in Stage 01 for immediate first-mission discoverability", () => {
    expect(orderPaletteNodes(["agent", "tool", "wallet"], 1)).toEqual(["agent", "wallet", "tool"]);
  });

  it("preserves the original order when the stage does not offer a Ledger signer", () => {
    expect(orderPaletteNodes(["agent", "condition", "tool"])).toEqual(["agent", "condition", "tool"]);
  });
});
