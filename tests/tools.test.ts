import { describe, expect, it, vi } from "vitest";
import { SwetrixClient } from "../src/http/swetrix-client.js";
import { registerAdminTools } from "../src/tools/admin-tools.js";
import { registerEventsTools } from "../src/tools/events-tools.js";
import { registerStatsTools } from "../src/tools/stats-tools.js";

describe("tool registration", () => {
  it("registers all core tool groups", () => {
    const addTool = vi.fn();
    const server = { addTool } as unknown as Parameters<typeof registerStatsTools>[0];
    const client = new SwetrixClient({
      apiKey: "test",
      baseUrl: "https://api.swetrix.com",
      timeoutMs: 1000,
    });

    registerStatsTools(server, client);
    registerEventsTools(server, client);
    registerAdminTools(server, client);

    expect(addTool).toHaveBeenCalled();
    expect(addTool.mock.calls.length).toBeGreaterThanOrEqual(20);
  });
});

