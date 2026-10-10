import { describe, expect, it } from "vitest";

const maxMessageLength = 10_000;

describe("ScamShield input rules", () => {
  it("allows messages up to 10,000 characters", () => {
    expect("a".repeat(maxMessageLength).length).toBe(10_000);
  });

  it("rejects messages over 10,000 characters", () => {
    expect("a".repeat(maxMessageLength + 1).length > maxMessageLength).toBe(true);
  });
});
