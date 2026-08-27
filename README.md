# Swetrix FastMCP Server

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=swetrix-fastmcp&config=eyJjb21tYW5kIjoicG5wbSIsImFyZ3MiOlsiLS1kaXIiLCIvVXNlcnMvYW5kcmVsYWRlbWFubi9EZXZlbG9wbWVudC92ZXJnaXNzYmVybGluL21jcC1zd2V0cml4Iiwic3RhcnQiXSwiZW52Ijp7IlNXRVRSSVhfQVBJX0tFWSI6InlvdXJfcGVyc29uYWxfYXBpX2tleSIsIlNXRVRSSVhfQkFTRV9VUkwiOiJodHRwczovL2FwaS5zd2V0cml4LmNvbSIsIlNXRVRSSVhfVElNRU9VVF9NUyI6IjE1MDAwIn19) [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%22swetrix-fastmcp%22%2C%22command%22%3A%22pnpm%22%2C%22args%22%3A%5B%22--dir%22%2C%22%2FUsers%2Fandrelademann%2FDevelopment%2Fvergissberlin%2Fmcp-swetrix%22%2C%22start%22%5D%2C%22env%22%3A%7B%22SWETRIX_API_KEY%22%3A%22your_personal_api_key%22%2C%22SWETRIX_BASE_URL%22%3A%22https%3A%2F%2Fapi.swetrix.com%22%2C%22SWETRIX_TIMEOUT_MS%22%3A%2215000%22%7D%7D)

> The buttons above install with the `--dir` path already used in the config snippets below. Update it to your local clone location before installing, and fill in your real `SWETRIX_API_KEY` afterwards.

TypeScript MCP server built with FastMCP that exposes core Swetrix APIs:

- Statistics API (`/v1/log*`)
- Events API (`/log*`)
- Admin API (`/v1/project*`, `/v1/organisation*`)

## Features

- Strong runtime validation with `zod`
- Explicit read/write/destructive tool annotations
- Typed Swetrix API client with timeout handling
- Test suite with `vitest`
- Tool names prefixed by domain:
  - `swetrix_stats_*`
  - `swetrix_events_*`
  - `swetrix_admin_*`

## Requirements

- Node.js 20+
- pnpm 10+

## Setup

```bash
pnpm install
cp .env.example .env
```

Set credentials in `.env`:

```env
SWETRIX_API_KEY=your_personal_api_key
SWETRIX_BASE_URL=https://api.swetrix.com
SWETRIX_TIMEOUT_MS=15000
```

## Run

Run as stdio MCP server:

```bash
pnpm dev
```

## Configure in MCP Clients

Use the absolute project path in commands below:
`/Users/andrelademann/Development/vergissberlin/mcp-swetrix`

### Claude Desktop

Add this server to your Claude MCP config file:

```json
{
  "mcpServers": {
    "swetrix-fastmcp": {
      "command": "pnpm",
      "args": ["--dir", "/Users/andrelademann/Development/vergissberlin/mcp-swetrix", "start"],
      "env": {
        "SWETRIX_API_KEY": "your_personal_api_key",
        "SWETRIX_BASE_URL": "https://api.swetrix.com",
        "SWETRIX_TIMEOUT_MS": "15000"
      }
    }
  }
}
```

### Cursor

Add this to your Cursor MCP servers configuration:

```json
{
  "mcpServers": {
    "swetrix-fastmcp": {
      "command": "pnpm",
      "args": ["--dir", "/Users/andrelademann/Development/vergissberlin/mcp-swetrix", "start"],
      "env": {
        "SWETRIX_API_KEY": "your_personal_api_key",
        "SWETRIX_BASE_URL": "https://api.swetrix.com",
        "SWETRIX_TIMEOUT_MS": "15000"
      }
    }
  }
}
```

### OpenCode

Add this MCP server entry to your OpenCode config:

```json
{
  "mcpServers": {
    "swetrix-fastmcp": {
      "command": "pnpm",
      "args": ["--dir", "/Users/andrelademann/Development/vergissberlin/mcp-swetrix", "start"],
      "env": {
        "SWETRIX_API_KEY": "your_personal_api_key",
        "SWETRIX_BASE_URL": "https://api.swetrix.com",
        "SWETRIX_TIMEOUT_MS": "15000"
      }
    }
  }
}
```

Notes:

- If your client supports loading environment variables from a file, you can store the credentials in `.env` instead of inline values.
- Restart the MCP client after changing the config.
- Run `pnpm build && pnpm test` before wiring the server into a client.

## Test

```bash
pnpm test
```

Or run full checks:

```bash
pnpm check
```

## MCP Inspector

Use FastMCP inspector:

```bash
npx fastmcp inspect src/index.ts
```

## Documentation

- Tool catalog: `docs/TOOLS.md`
- Testing strategy: `docs/TESTING.md`
- Architecture and best practices: `docs/ARCHITECTURE.md`

## Security Notes

- Keep API keys in `.env` only.
- Never hardcode secrets in source code.
- Prefer read-only tools when write access is not required.
- Treat destructive admin tools carefully (`destructiveHint: true`).
