import { z } from "zod";

export const withOptionalApiKeySchema = z.object({
  apiKey: z.string().min(1).optional(),
});

export const statsQuerySchema = withOptionalApiKeySchema.extend({
  projectId: z.string().min(1),
  period: z.string().min(1).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  timeBucket: z.string().optional(),
  timezone: z.string().optional(),
  filter: z.string().optional(),
  page: z.number().int().positive().optional(),
  take: z.number().int().positive().max(100).optional(),
});

export const profileSchema = withOptionalApiKeySchema.extend({
  projectId: z.string().min(1),
  profileId: z.string().min(1),
});

export const errorSchema = withOptionalApiKeySchema.extend({
  projectId: z.string().min(1),
  errorId: z.string().min(1),
});

export const pageviewEventSchema = withOptionalApiKeySchema.extend({
  pid: z.string().min(1),
  tz: z.string().optional(),
  pg: z.string().optional(),
  lc: z.string().optional(),
  ref: z.string().optional(),
  so: z.string().optional(),
  me: z.string().optional(),
  ca: z.string().optional(),
  unique: z.boolean().optional(),
  perf: z
    .object({
      dns: z.number().optional(),
      tls: z.number().optional(),
      conn: z.number().optional(),
      response: z.number().optional(),
      render: z.number().optional(),
      dom_load: z.number().optional(),
      page_load: z.number().optional(),
      ttfb: z.number().optional(),
    })
    .optional(),
});

export const customEventSchema = withOptionalApiKeySchema.extend({
  pid: z.string().min(1),
  ev: z.string().min(1).max(256),
  unique: z.boolean().optional(),
  pg: z.string().optional(),
  lc: z.string().optional(),
  ref: z.string().optional(),
  so: z.string().optional(),
  me: z.string().optional(),
  ca: z.string().optional(),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export const heartbeatSchema = withOptionalApiKeySchema.extend({
  pid: z.string().min(1),
});

export const errorEventSchema = withOptionalApiKeySchema.extend({
  pid: z.string().min(1),
  name: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
  lineno: z.number().int().optional(),
  colno: z.number().int().optional(),
  stackTrace: z.string().max(7500).optional(),
  filename: z.string().max(1000).optional(),
  tz: z.string().optional(),
  pg: z.string().optional(),
  lc: z.string().optional(),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export const revenueEventSchema = withOptionalApiKeySchema.extend({
  pid: z.string().min(1),
  type: z.enum(["sale", "refund", "subscription"]),
  amount: z.number().positive(),
  currency: z.string().length(3),
  transactionId: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  profileId: z.string().optional(),
  sessionId: z.string().optional(),
  created: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const projectBaseSchema = withOptionalApiKeySchema.extend({
  name: z.string().min(1),
  host: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export const projectIdSchema = withOptionalApiKeySchema.extend({
  projectId: z.string().min(1),
});

export const organisationIdSchema = withOptionalApiKeySchema.extend({
  organisationId: z.string().min(1),
});

