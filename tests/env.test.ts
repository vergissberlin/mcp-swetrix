import { describe, expect, it } from "vitest";
import { getEnv } from "../src/config/env.js";

describe("env configuration", () => {
  it("loads required env vars", () => {
    process.env.SWETRIX_API_KEY = "test-key";
    process.env.SWETRIX_BASE_URL = "https://api.swetrix.com";
    process.env.SWETRIX_TIMEOUT_MS = "10000";

    const env = getEnv();
    expect(env.SWETRIX_API_KEY).toBe("test-key");
    expect(env.SWETRIX_BASE_URL).toBe("https://api.swetrix.com");
    expect(env.SWETRIX_TIMEOUT_MS).toBe(10000);
  });
});

