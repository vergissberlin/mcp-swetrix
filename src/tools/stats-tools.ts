import { UserError, type FastMCP } from "fastmcp";
import { z } from "zod";
import { SwetrixApiError, SwetrixClient } from "../http/swetrix-client.js";
import {
  errorSchema,
  profileSchema,
  statsQuerySchema,
  withOptionalApiKeySchema,
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

function getStatsQuery(args: z.infer<typeof statsQuerySchema>) {
  return {
    pid: args.projectId,
    period: args.period,
    from: args.from,
    to: args.to,
    tb: args.timeBucket,
    tz: args.timezone,
    filter: args.filter,
    page: args.page,
    take: args.take,
  };
}

export function registerStatsTools(server: FastMCP, client: SwetrixClient): void {
  server.addTool({
    name: "swetrix_stats_log",
    description: "Get aggregated traffic stats for a project",
    annotations: { readOnlyHint: true },
    parameters: statsQuerySchema,
    execute: async (args) => {
      try {
        const data = await client.get("/v1/log", getStatsQuery(args), args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_performance",
    description: "Get aggregated performance stats for a project",
    annotations: { readOnlyHint: true },
    parameters: statsQuerySchema,
    execute: async (args) => {
      try {
        const data = await client.get("/v1/log/performance", getStatsQuery(args), args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_birdseye",
    description: "Get birdseye summary stats for a project",
    annotations: { readOnlyHint: true },
    parameters: statsQuerySchema,
    execute: async (args) => {
      try {
        const data = await client.get("/v1/log/birdseye", getStatsQuery(args), args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_custom_events",
    description: "Get custom event aggregates for a project",
    annotations: { readOnlyHint: true },
    parameters: statsQuerySchema,
    execute: async (args) => {
      try {
        const data = await client.get("/v1/log/custom-events", getStatsQuery(args), args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_profiles",
    description: "Get tracked visitor profiles for a project",
    annotations: { readOnlyHint: true },
    parameters: statsQuerySchema,
    execute: async (args) => {
      try {
        const data = await client.get("/v1/log/profiles", getStatsQuery(args), args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_profile",
    description: "Get a single visitor profile for a project",
    annotations: { readOnlyHint: true },
    parameters: profileSchema,
    execute: async (args) => {
      try {
        const data = await client.get(
          "/v1/log/profile",
          { pid: args.projectId, profileId: args.profileId },
          args.apiKey,
        );
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_errors",
    description: "Get error groups for a project",
    annotations: { readOnlyHint: true },
    parameters: statsQuerySchema,
    execute: async (args) => {
      try {
        const data = await client.get("/v1/log/errors", getStatsQuery(args), args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_error_detail",
    description: "Get detailed information for one Swetrix error group",
    annotations: { readOnlyHint: true },
    parameters: errorSchema,
    execute: async (args) => {
      try {
        const data = await client.get(
          "/v1/log/get-error",
          { pid: args.projectId, eid: args.errorId },
          args.apiKey,
        );
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_stats_filters",
    description: "Get available filter values for project dimensions",
    annotations: { readOnlyHint: true },
    parameters: withOptionalApiKeySchema.extend({
      projectId: z.string().min(1),
      kind: z.enum(["traffic", "errors"]).default("traffic"),
    }),
    execute: async (args) => {
      try {
        const endpoint = args.kind === "errors" ? "/v1/log/errors-filters" : "/v1/log/filters";
        const data = await client.get(endpoint, { pid: args.projectId }, args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });
}

