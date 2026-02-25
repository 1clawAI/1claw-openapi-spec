# @1claw/openapi-spec

OpenAPI 3.1.0 specification for the [1Claw Vault API](https://1claw.xyz). Use this package to generate API clients in any language.

## Install

```bash
npm install @1claw/openapi-spec
```

## Usage

### Generate a TypeScript client

```bash
npx openapi-typescript node_modules/@1claw/openapi-spec/openapi.yaml -o src/1claw-types.ts
```

### Generate a Python client

```bash
openapi-generator generate \
  -i node_modules/@1claw/openapi-spec/openapi.yaml \
  -g python \
  -o ./1claw-client
```

### Generate a Go client

```bash
openapi-generator generate \
  -i node_modules/@1claw/openapi-spec/openapi.yaml \
  -g go \
  -o ./1claw-client
```

### Use in code

```typescript
import spec from "@1claw/openapi-spec/openapi.json";
```

## What's in the spec (v2.1.0)

- **Vaults** — CRUD, CMEK enable/disable, key rotation with job tracking
- **Secrets** — CRUD, versioning, CMEK-encrypted flag
- **Agents** — CRUD with `token_ttl_seconds`, `vault_ids`, crypto proxy, transaction guardrails
- **Policies** — Glob-based access control
- **Sharing** — Links, user/agent shares, accept/decline
- **Billing** — Subscriptions, credits, x402
- **Audit** — Hash-chained event log
- **Chains** — Supported blockchain registry
- **Auth** — JWT, API keys, agent tokens, MFA, device flow, Google OAuth

## Included files

- `openapi.yaml` — The canonical YAML specification
- `openapi.json` — JSON version for tooling that prefers JSON

## License

PolyForm Noncommercial 1.0.0
