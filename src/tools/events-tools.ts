import { UserError, type FastMCP } from "fastmcp";
import { SwetrixApiError, SwetrixClient } from "../http/swetrix-client.js";
import {
  customEventSchema,
  errorEventSchema,
  heartbeatSchema,
  pageviewEventSchema,
  revenueEventSchema,
} from "../schemas/common.js";

function toToolError(error: unknown): UserError {
  if (error instanceof SwetrixApiError) {
    return new UserError(`${error.message} (status ${error.status})`);
  }

  return new UserError("Unexpected error while calling Swetrix");
}

function asResult(data: unknown): string {
  return JSON.stringify({ data });
}

export function registerEventsTools(server: FastMCP, client: SwetrixClient): void {
  server.addTool({
    name: "swetrix_events_pageview",
    description: "Record a pageview event in Swetrix",
    annotations: { idempotentHint: false },
    parameters: pageviewEventSchema,
    execute: async (args) => {
      try {
        const { apiKey, ...body } = args;
        const data = await client.post("/log", body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_events_custom",
    description: "Record a custom event in Swetrix",
    annotations: { idempotentHint: false },
    parameters: customEventSchema,
    execute: async (args) => {
      try {
        const { apiKey, ...body } = args;
        const data = await client.post("/log/custom", body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_events_heartbeat",
    description: "Record a heartbeat event for session activity",
    annotations: { idempotentHint: false },
    parameters: heartbeatSchema,
    execute: async (args) => {
      try {
        const { apiKey, ...body } = args;
        const data = await client.post("/log/hb", body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_events_error",
    description: "Record a client error event in Swetrix",
    annotations: { idempotentHint: false },
    parameters: errorEventSchema,
    execute: async (args) => {
      try {
        const { apiKey, ...body } = args;
        const data = await client.post("/log/error", body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_events_revenue",
    description: "Record a revenue event in Swetrix",
    annotations: { idempotentHint: true },
    parameters: revenueEventSchema,
    execute: async (args) => {
      try {
        const { apiKey, ...body } = args;
        const data = await client.post("/log/revenue", body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });
}

