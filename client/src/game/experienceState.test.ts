import { describe, expect, it } from "vitest";
import { shouldShowProofPathIntro } from "./experienceState";

describe("ProofPath first-run experience", () => {
  it("shows the notebook intro until this browser session has started the game", () => {
    expect(shouldShowProofPathIntro(null)).toBe(true);
    expect(shouldShowProofPathIntro("0")).toBe(true);
    expect(shouldShowProofPathIntro("1")).toBe(false);
  });
});
