import { z } from "zod";

type Primitive = string | number | boolean;
type QueryValue = Primitive | null | undefined;
type Query = Record<string, QueryValue>;

const responseSchema = z.unknown();

export class SwetrixApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  public constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "SwetrixApiError";
    this.status = status;
    this.details = details;
  }
}

export type SwetrixClientOptions = {
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
};

export class SwetrixClient {
  private readonly options: SwetrixClientOptions;

  public constructor(options: SwetrixClientOptions) {
    this.options = options;
  }

  public async get<T = unknown>(
    path: string,
    query?: Query,
    apiKeyOverride?: string,
  ): Promise<T> {
    return this.request<T>(
      "GET",
      path,
      this.buildRequestOptions({ query, body: undefined, apiKeyOverride }),
    );
  }

  public async post<T = unknown>(
    path: string,
    body?: unknown,
    apiKeyOverride?: string,
  ): Promise<T> {
    return this.request<T>(
      "POST",
      path,
      this.buildRequestOptions({ query: undefined, body, apiKeyOverride }),
    );
  }

  public async put<T = unknown>(
    path: string,
    body?: unknown,
    apiKeyOverride?: string,
  ): Promise<T> {
    return this.request<T>(
      "PUT",
      path,
      this.buildRequestOptions({ query: undefined, body, apiKeyOverride }),
    );
  }

  public async patch<T = unknown>(
    path: string,
    body?: unknown,
    apiKeyOverride?: string,
  ): Promise<T> {
    return this.request<T>(
      "PATCH",
      path,
      this.buildRequestOptions({ query: undefined, body, apiKeyOverride }),
    );
  }

  public async delete<T = unknown>(
    path: string,
    body?: unknown,
    apiKeyOverride?: string,
  ): Promise<T> {
    return this.request<T>(
      "DELETE",
      path,
      this.buildRequestOptions({ query: undefined, body, apiKeyOverride }),
    );
  }

  private buildRequestOptions(opts: {
    query: Query | undefined;
    body: unknown;
    apiKeyOverride: string | undefined;
  }): { query?: Query; body?: unknown; apiKeyOverride?: string } {
    return {
      ...(opts.query !== undefined ? { query: opts.query } : {}),
      ...(opts.body !== undefined ? { body: opts.body } : {}),
      ...(opts.apiKeyOverride !== undefined ? { apiKeyOverride: opts.apiKeyOverride } : {}),
    };
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    opts: { query?: Query; body?: unknown; apiKeyOverride?: string } = {},
  ): Promise<T> {
    const url = new URL(path, this.options.baseUrl);

    if (opts.query) {
      for (const [key, value] of Object.entries(opts.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs);

    try {
      const init: RequestInit = {
        method,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": opts.apiKeyOverride ?? this.options.apiKey,
        },
        ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
      };

      const response = await fetch(url, init);

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new SwetrixApiError(
          `Swetrix API request failed with status ${response.status}`,
          response.status,
          payload,
        );
      }

      return responseSchema.parse(payload) as T;
    } catch (error) {
      if (error instanceof SwetrixApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new SwetrixApiError("Swetrix API request timed out", 408);
      }

      throw new SwetrixApiError("Failed to reach Swetrix API", 500, error);
    } finally {
      clearTimeout(timeout);
    }
  }
}

