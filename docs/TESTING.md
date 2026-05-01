# Testing Guide

## Test Stack

- Test runner: `vitest`
- Language: TypeScript
- Strategy:
  - Unit tests for configuration and request behavior
  - Integration-like tests with mocked `fetch`
  - Tool registration contract checks

## Run Commands

```bash
pnpm test
pnpm test:watch
pnpm check
```

## Current Coverage Areas

- Environment parsing and defaults
- Swetrix client request/query/header behavior
- Swetrix client HTTP error handling
- Tool registration across all domains

## Recommended Next Additions

- Add mocked response tests per major tool (`stats`, `events`, `admin`)
- Add rate-limit retry behavior tests when retry logic is introduced
- Add contract snapshots for tool metadata (`description`, `annotations`)
- Add CI workflow to enforce `pnpm check`

