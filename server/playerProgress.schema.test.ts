import { getTableColumns, getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { playerStageProgress } from "../drizzle/schema";

describe("player stage progress schema", () => {
  it("uses an isolated row-per-stage table rather than the legacy JSON progress table", () => {
    expect(getTableName(playerStageProgress)).toBe("player_stage_progress");
    expect(Object.keys(getTableColumns(playerStageProgress))).toEqual([
      "id",
      "userId",
      "stageId",
      "mode",
      "completed",
      "score",
      "attempts",
      "updatedAt",
    ]);
  });
});
