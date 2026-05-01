import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  SWETRIX_API_KEY: z.string().min(1, "SWETRIX_API_KEY is required"),
  SWETRIX_BASE_URL: z.url().default("https://api.swetrix.com"),
  SWETRIX_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}

