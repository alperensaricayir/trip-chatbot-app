import { describe, expect, it } from "vitest";
import {
  clamp,
  computeEarlyBonus,
  computeTimeoutPenalty,
  createInitialState,
  getDifficultyConfig,
} from "./gameEngine";

describe("gameEngine", () => {
  it("clamp clamps to range", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it("computeEarlyBonus gives +2 when answered early", () => {
    expect(computeEarlyBonus(12)).toBe(2);
    expect(computeEarlyBonus(20)).toBe(2);
    expect(computeEarlyBonus(11)).toBe(0);
    expect(computeEarlyBonus(0)).toBe(0);
  });

  it("computeTimeoutPenalty scales with anger", () => {
    const normal = getDifficultyConfig("normal");
    expect(computeTimeoutPenalty(normal, 1)).toBe(normal.timeoutPenalty);
    expect(computeTimeoutPenalty(normal, 4)).toBe(normal.timeoutPenaltyAngry);
    expect(computeTimeoutPenalty(normal, 7)).toBe(normal.timeoutPenaltyAngry);
  });

  it("createInitialState creates a playable state", () => {
    const s = createInitialState("female", "normal", 0);
    expect(s.phase).toBe("playing");
    expect(s.patience).toBe(70);
    expect(s.angerLevel).toBe(1);
    expect(s.messageCount).toBe(0);
    expect(s.messages.length).toBe(1);
    expect(s.awaitingUserSince).not.toBeNull();
  });
});
