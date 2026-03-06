# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bun install

# Dev (all apps)
bun run dev

# Dev (single app)
bun run dev --filter=web    # port 5173
bun run dev --filter=docs   # port 5174

# Build
bun run build
bun run build --filter=web

# Type check / lint / test (all delegate to svelte-check)
bun run check-types
bun run lint
bun run test

# Single app type check
bun run check-types --filter=web

# Format
bun run format

# Generate protobuf types from ../oxtro-proto
bun run proto:gen

# Add shadcn-svelte component
cd packages/shadcn && bunx shadcn-svelte@latest add [component-name]
```

## Architecture

Turborepo monorepo using Bun 1.3.9, SvelteKit 5 (Svelte 5), Tailwind CSS v4.

### Workspace layout

- **`apps/web`** — Main SvelteKit app (port 5173). SSR disabled (`ssr = false` in root layout). Client-side only with ConnectRPC for API communication.
- **`apps/docs`** — Docs SvelteKit app (port 5174). Minimal, no shared UI package yet.
- **`packages/shadcn`** (`@oxtro-ui/shadcn`) — Shared shadcn-svelte component library. 50+ components at `src/lib/components/ui/[name]/`.
- **`packages/proto`** (`@oxtro-ui/proto`) — Auto-generated protobuf types and ConnectRPC service definitions. Generated from `../oxtro-proto` via `buf generate`.

### Import conventions

```ts
// shadcn components — per-path import (preferred)
import { Button } from "@oxtro-ui/shadcn/button";
import * as Card from "@oxtro-ui/shadcn/card";

// Proto types — via gen path
import { Auth } from "@oxtro-ui/proto/gen/auth/v1/auth_pb";
import type { Contact } from "@oxtro-ui/proto/gen/sample_crm/v1/crm_pb";
```

### API layer (`apps/web/src/lib/api/`)

- **`transport.ts`** — Creates ConnectRPC transport using `PUBLIC_API_BASE_URL` env var (defaults to `http://localhost:8080`).
- **`clients/*.ts`** — Service clients (auth, plugin, setup, sample-crm). Each wraps `createClient()` with the authenticated transport.
- **`index.ts`** — Barrel re-export of all clients and transport.

### Auth (`apps/web/src/lib/auth/`)

- **`session.ts`** — localStorage-based token management (access token, refresh token, device ID). Uses Svelte writable store.
- **`interceptor.ts`** — ConnectRPC interceptor that attaches Bearer token and handles automatic token refresh on 401.

### Plugin UI system (`apps/web/src/lib/plugin-ui/`)

Server-driven UI: plugins declare UI manifests (views, actions, data sources) via protobuf. The frontend dynamically renders plugin pages.

- Route: `/app/plugins/[plugin]/[...slug]` — Loads plugin manifests, resolves the matching view, renders via `PluginNodeRenderer.svelte`.
- **`manifest-loader.ts`** — Fetches active plugin UI manifests from the API.
- **`route-resolver.ts`** — Matches URL pathname to a plugin view.
- **`datasource-resolver.ts`** — Resolves data sources declared in plugin views to actual RPC calls.
- **`action-executor.ts`** — Maps plugin actions to RPC method calls.

### Routing (`apps/web/src/routes/`)

Root `+layout.ts` handles client-side auth guards:
- Redirects to `/setup` if initial setup not completed.
- Redirects unauthenticated users to `/login` for protected routes.
- Redirects authenticated users away from public routes (login, register, etc.).

### Tailwind CSS v4

- Uses `@tailwindcss/vite` plugin — no `tailwind.config.js`.
- CSS variables in OKLCH color space defined in `apps/web/src/routes/layout.css`.
- Dark mode via `.dark` class (`@custom-variant dark`).
- `@source` directive scans `packages/shadcn/src` for class usage.

### Protobuf code generation

`buf.gen.yaml` at repo root configures two plugins:
- `protoc-gen-es` → TypeScript message types
- `protoc-gen-connect-es` → ConnectRPC service stubs

Output goes to `packages/proto/src/gen/`. After generation, `bun run --cwd packages/proto generate:index` rebuilds the barrel export.

### Environment

- `PUBLIC_API_BASE_URL` — Backend API URL. Set in `.env` or `apps/web/.env.local`. Defaults to `http://localhost:8080`.
