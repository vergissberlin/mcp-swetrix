import { afterEach, describe, expect, it, vi } from "vitest";
import { SwetrixApiError, SwetrixClient } from "../src/http/swetrix-client.js";

describe("SwetrixClient", () => {
  const client = new SwetrixClient({
    apiKey: "default-api-key",
    baseUrl: "https://api.swetrix.com",
    timeoutMs: 5000,
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends query params and api key header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await client.get("/v1/log", { pid: "p1", period: "7d" }, "override-key");
    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("pid=p1");
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({ "X-Api-Key": "override-key" });
  });

  it("throws SwetrixApiError on non-2xx response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "bad request" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(client.get("/v1/log")).rejects.toBeInstanceOf(SwetrixApiError);
  });
});

