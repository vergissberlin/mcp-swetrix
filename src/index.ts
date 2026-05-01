import { FastMCP } from "fastmcp";
import { getEnv } from "./config/env.js";
import { SwetrixClient } from "./http/swetrix-client.js";
import { registerAdminTools } from "./tools/admin-tools.js";
import { registerEventsTools } from "./tools/events-tools.js";
import { registerStatsTools } from "./tools/stats-tools.js";

const env = getEnv();

const server = new FastMCP({
  name: "swetrix-fastmcp",
  version: "0.1.0",
});

const client = new SwetrixClient({
  apiKey: env.SWETRIX_API_KEY,
  baseUrl: env.SWETRIX_BASE_URL,
  timeoutMs: env.SWETRIX_TIMEOUT_MS,
});

registerStatsTools(server, client);
registerEventsTools(server, client);
registerAdminTools(server, client);

server.start({
  transportType: "stdio",
});

