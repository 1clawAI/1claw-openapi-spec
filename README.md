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

## What's in the spec (v0.16.x)

- **Auth — password reset** — `POST /v1/auth/forgot-password`, `POST /v1/auth/reset-password` (public; anti-enumeration on forgot)
- **Billing — LLM token billing** — `GET /v1/billing/llm-token-billing` (`LlmTokenBillingStatus`: `enabled`, `subscription_status`, optional `credit_balance`, optional `billing_cycle_usage` with `metered_lines[]`), `POST .../subscribe`, `POST .../disable` (Stripe AI Gateway add-on; optional org feature)
- **Treasury** — Safe multisig treasuries: `POST/GET /v1/treasury`, `GET/PATCH/DELETE /v1/treasury/{id}`, signers, agent access requests (`requests[]` on list)
- **Vaults** — CRUD, CMEK enable/disable, key rotation with job tracking
- **Secrets** — CRUD, versioning, CMEK-encrypted flag
- **Agents** — CRUD with `auth_method` (api_key, mtls, oidc_client_credentials), auto-generated SSH keypairs, `token_ttl_seconds`, `vault_ids`, Intents API, transaction guardrails
- **Policies** — Glob-based access control
- **Sharing** — Links, user/agent shares, accept/decline
- **Billing** — Subscriptions, credits, x402, LLM token billing (see above)
- **Audit** — Hash-chained event log
- **Chains** — Supported blockchain registry
- **Auth** — JWT, API keys, agent tokens, MFA, device flow, Google OAuth
- **Org** — List members, invite, update/remove member; `GET /v1/org/agent-keys-vault` (users only, returns __agent-keys vault id or 404)

## Included files

- `openapi.yaml` — The canonical YAML specification
- `openapi.json` — JSON version for tooling that prefers JSON

## License

[MIT](./LICENSE)
