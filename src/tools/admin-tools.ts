import { UserError, type FastMCP } from "fastmcp";
import { z } from "zod";
import { SwetrixApiError, SwetrixClient } from "../http/swetrix-client.js";
import {
  organisationIdSchema,
  projectBaseSchema,
  projectIdSchema,
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

export function registerAdminTools(server: FastMCP, client: SwetrixClient): void {
  server.addTool({
    name: "swetrix_admin_list_projects",
    description: "List all projects accessible by the API key",
    annotations: { readOnlyHint: true },
    parameters: withOptionalApiKeySchema,
    execute: async ({ apiKey }) => {
      try {
        const data = await client.get("/v1/project", undefined, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_get_project",
    description: "Get a single project by id",
    annotations: { readOnlyHint: true },
    parameters: projectIdSchema,
    execute: async (args) => {
      try {
        const data = await client.get(`/v1/project/${args.projectId}`, undefined, args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_create_project",
    description: "Create a new Swetrix project",
    annotations: { idempotentHint: false },
    parameters: projectBaseSchema,
    execute: async (args) => {
      try {
        const { apiKey, ...body } = args;
        const data = await client.post("/v1/project", body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_update_project",
    description: "Update an existing Swetrix project",
    annotations: { idempotentHint: true },
    parameters: projectBaseSchema.extend({
      projectId: z.string().min(1),
    }),
    execute: async (args) => {
      try {
        const { apiKey, projectId, ...body } = args;
        const data = await client.put(`/v1/project/${projectId}`, body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_delete_project",
    description: "Delete a project permanently",
    annotations: { destructiveHint: true, idempotentHint: true },
    parameters: projectIdSchema,
    execute: async (args) => {
      try {
        const data = await client.delete(`/v1/project/${args.projectId}`, undefined, args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_pin_project",
    description: "Pin or unpin a project for quick access",
    annotations: { idempotentHint: true },
    parameters: projectIdSchema.extend({
      pinned: z.boolean(),
    }),
    execute: async (args) => {
      try {
        const endpoint = `/v1/project/${args.projectId}/pin`;
        const data = args.pinned
          ? await client.post(endpoint, undefined, args.apiKey)
          : await client.delete(endpoint, undefined, args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_project_views",
    description: "Read or manage saved views for a project",
    parameters: withOptionalApiKeySchema.extend({
      projectId: z.string().min(1),
      action: z.enum(["list", "get", "create", "update", "delete"]),
      viewId: z.string().optional(),
      payload: z.record(z.string(), z.unknown()).optional(),
    }),
    execute: async (args) => {
      try {
        const base = `/v1/project/${args.projectId}/views`;

        if (args.action === "list") {
          return asResult(await client.get(base, undefined, args.apiKey));
        }
        if (args.action === "get") {
          if (!args.viewId) throw new UserError("viewId is required for action=get");
          return asResult(await client.get(`${base}/${args.viewId}`, undefined, args.apiKey));
        }
        if (args.action === "create") {
          return asResult(await client.post(base, args.payload ?? {}, args.apiKey));
        }
        if (args.action === "update") {
          if (!args.viewId) throw new UserError("viewId is required for action=update");
          return asResult(await client.patch(`${base}/${args.viewId}`, args.payload ?? {}, args.apiKey));
        }

        if (!args.viewId) throw new UserError("viewId is required for action=delete");
        return asResult(await client.delete(`${base}/${args.viewId}`, undefined, args.apiKey));
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_project_annotations",
    description: "Read or manage annotations for a project",
    parameters: withOptionalApiKeySchema.extend({
      projectId: z.string().min(1),
      action: z.enum(["list", "create", "update", "delete"]),
      annotationId: z.string().optional(),
      payload: z.record(z.string(), z.unknown()).optional(),
    }),
    execute: async (args) => {
      try {
        const listPath = `/v1/project/annotations/${args.projectId}`;

        if (args.action === "list") {
          return asResult(await client.get(listPath, undefined, args.apiKey));
        }
        if (args.action === "create") {
          return asResult(await client.post("/v1/project/annotation", args.payload ?? {}, args.apiKey));
        }
        if (args.action === "update") {
          return asResult(await client.patch("/v1/project/annotation", args.payload ?? {}, args.apiKey));
        }

        if (!args.annotationId) {
          throw new UserError("annotationId is required for action=delete");
        }
        return asResult(
          await client.delete(
            `/v1/project/annotation/${args.annotationId}/${args.projectId}`,
            undefined,
            args.apiKey,
          ),
        );
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_project_funnels",
    description: "Read or manage funnels for a project",
    parameters: withOptionalApiKeySchema.extend({
      projectId: z.string().min(1),
      action: z.enum(["list", "create", "update", "delete"]),
      funnelId: z.string().optional(),
      payload: z.record(z.string(), z.unknown()).optional(),
    }),
    execute: async (args) => {
      try {
        if (args.action === "list") {
          return asResult(await client.get(`/v1/project/funnels/${args.projectId}`, undefined, args.apiKey));
        }
        if (args.action === "create") {
          return asResult(await client.post("/v1/project/funnel", args.payload ?? {}, args.apiKey));
        }
        if (args.action === "update") {
          return asResult(await client.patch("/v1/project/funnel", args.payload ?? {}, args.apiKey));
        }

        if (!args.funnelId) {
          throw new UserError("funnelId is required for action=delete");
        }
        return asResult(
          await client.delete(
            `/v1/project/funnel/${args.funnelId}/${args.projectId}`,
            undefined,
            args.apiKey,
          ),
        );
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_list_organisations",
    description: "List organisations available for the API key",
    annotations: { readOnlyHint: true },
    parameters: withOptionalApiKeySchema,
    execute: async ({ apiKey }) => {
      try {
        const data = await client.get("/v1/organisation", undefined, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_get_organisation",
    description: "Get organisation details by id",
    annotations: { readOnlyHint: true },
    parameters: organisationIdSchema,
    execute: async (args) => {
      try {
        const data = await client.get(`/v1/organisation/${args.organisationId}`, undefined, args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_create_organisation",
    description: "Create a new organisation",
    parameters: organisationIdSchema.omit({ organisationId: true }).extend({
      name: z.string().min(1),
    }),
    execute: async (args) => {
      try {
        const { apiKey, ...body } = args;
        const data = await client.post("/v1/organisation", body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_update_organisation",
    description: "Update an organisation",
    parameters: organisationIdSchema.extend({
      name: z.string().min(1),
    }),
    execute: async (args) => {
      try {
        const { apiKey, organisationId, ...body } = args;
        const data = await client.patch(`/v1/organisation/${organisationId}`, body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_delete_organisation",
    description: "Delete an organisation permanently",
    annotations: { destructiveHint: true, idempotentHint: true },
    parameters: organisationIdSchema,
    execute: async (args) => {
      try {
        const data = await client.delete(`/v1/organisation/${args.organisationId}`, undefined, args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_invite_member",
    description: "Invite a member to an organisation",
    parameters: organisationIdSchema.extend({
      email: z.email(),
      role: z.string().min(1),
    }),
    execute: async (args) => {
      try {
        const { apiKey, organisationId, ...body } = args;
        const data = await client.post(`/v1/organisation/${organisationId}/invite`, body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_update_member",
    description: "Update organisation member role",
    parameters: withOptionalApiKeySchema.extend({
      memberId: z.string().min(1),
      role: z.string().min(1),
    }),
    execute: async (args) => {
      try {
        const { apiKey, memberId, ...body } = args;
        const data = await client.patch(`/v1/organisation/member/${memberId}`, body, apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });

  server.addTool({
    name: "swetrix_admin_remove_member",
    description: "Remove a member from an organisation",
    annotations: { destructiveHint: true, idempotentHint: true },
    parameters: withOptionalApiKeySchema.extend({
      memberId: z.string().min(1),
    }),
    execute: async (args) => {
      try {
        const data = await client.delete(`/v1/organisation/member/${args.memberId}`, undefined, args.apiKey);
        return asResult(data);
      } catch (error) {
        throw toToolError(error);
      }
    },
  });
}

