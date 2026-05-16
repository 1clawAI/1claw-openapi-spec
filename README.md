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

## What's in the spec (v0.23.2 — API `info.version` 2.13.0)

- **OIDC Federation (1claw as IdP)** — `GET /.well-known/openid-configuration` (public discovery: issuer, jwks_uri, supported algs `["EdDSA","RS256"]`, supported grant types incl. token-exchange), `GET /.well-known/jwks.json` (public JWKS — every active EdDSA + RS256 key version, keyed by deterministic `kid`), `POST /v1/auth/federated-token` (RFC 8693 token exchange — accepts JSON or `application/x-www-form-urlencoded`; subject token is an agent JWT or `ocv_` API key; returns RS256 JWT scoped to `audience`). Agent fields: `federation_enabled`, `federation_audiences[]`, `federated_token_ttl_seconds`. Designed for Anthropic Workload Identity Federation, GCP STS, AWS STS, etc.
- **Auth — agent JWT** — `POST /v1/auth/agent-token` documents optional JWT claim **`shroud_config`** when the agent has Shroud enabled (mirrors DB; consumed by Shroud PolicyEngine on LLM requests). Re-exchange after changing agent Shroud settings. Federation tokens use a separate KMS RSA-2048 key and are signed RS256.
- **Auth — password reset** — `POST /v1/auth/forgot-password`, `POST /v1/auth/reset-password` (public; anti-enumeration on forgot)
- **Billing — LLM token billing** — `GET /v1/billing/llm-token-billing` (`LlmTokenBillingStatus`: `enabled`, `subscription_status`, optional `credit_balance`, optional `billing_cycle_usage` with `metered_lines[]`), `POST .../subscribe`, `POST .../disable` (Stripe AI Gateway add-on; optional org feature)
- **Treasury** — Safe multisig treasuries: `POST/GET /v1/treasury`, `GET/PATCH/DELETE /v1/treasury/{id}`, signers, agent access requests (`requests[]` on list)
- **Treasury Wallets** — Multi-chain wallet generation for human users (replaces CDP embedded wallets): `POST /v1/treasury/wallets/generate`, `GET /v1/treasury/wallets`, `GET /v1/treasury/wallets/{chain}`, `POST .../export`, `POST .../rotate`, `DELETE /v1/treasury/wallets/{chain}`. Supported chains: ethereum, bitcoin, solana, xrp, cardano, tron. Private keys stored in per-org `__treasury-keys` vault with tier-appropriate MPC custody.
- **Vaults** — CRUD, CMEK enable/disable, key rotation with job tracking, MPC enable/disable (`POST /v1/vaults/{id}/mpc`, `DELETE /v1/vaults/{id}/mpc`)
- **Secrets** — CRUD, versioning, CMEK-encrypted flag, `client_share` in responses (MPC vaults)
- **Agents** — CRUD with `auth_method` (api_key, mtls, oidc_client_credentials), auto-generated SSH keypairs, `token_ttl_seconds`, `vault_ids`, Intents API, transaction guardrails (`tx_to_allowlist`, `tx_max_value_eth`, `tx_daily_limit_eth`, `tx_allowed_chains`), **OIDC federation knobs** (`federation_enabled`, `federation_audiences`, `federated_token_ttl_seconds`); **`GET /v1/agents/{id}`** includes **`tx_spent_today_eth`** (rolling UTC-day spend from recorded txs) for clients such as **Shroud** that enforce the daily cap alongside per-tx limits
- **Signing Keys** — Multi-chain key management: `POST /v1/agents/{id}/signing-keys` (provision), `GET .../signing-keys` (list), `POST .../signing-keys/{chain}/rotate`, `DELETE .../signing-keys/{chain}` (deactivate). Supports ethereum, bitcoin, solana, xrp, cardano, tron
- **Unified Signing** — `POST /v1/agents/{id}/sign` — single endpoint for EIP-191 personal_sign, EIP-712 typed_data, and EIP-2718 transaction types (legacy, EIP-1559, EIP-4844, EIP-7702)
- **Policies** — Glob-based access control
- **Sharing** — Links, user/agent shares, accept/decline
- **Billing** — Subscriptions, credits, x402, LLM token billing (see above)
- **Audit** — Hash-chained event log
- **Chains** — Supported blockchain registry
- **Auth** — JWT, API keys, agent tokens, MFA, device flow, Google OAuth, **federated tokens (RFC 8693)**
- **Platform** — Platform API for building multi-tenant apps on 1Claw: `POST/GET /v1/platform/apps`, `GET/PATCH/DELETE /v1/platform/apps/{id}`, `POST/GET /v1/platform/apps/{id}/templates`, `POST /v1/platform/users/upsert`, `POST /v1/platform/connections/{id}/bootstrap`, `GET /v1/platform/apps/{id}/users`, `GET /v1/platform/apps/{id}/audit`, `GET/DELETE /v1/platform/connected-apps`, `GET /v1/platform/claim/{token}` (preview), `POST /v1/platform/claim/{token}` (redeem). Platform apps authenticate with `plt_` prefixed API keys. Supports OIDC user provisioning, bootstrap templates, and billing models (platform_pays, user_pays, hybrid).
- **Org** — List members, invite, update/remove member; `GET /v1/org/agent-keys-vault` (users only, returns __agent-keys vault id or 404)

## Included files

- `openapi.yaml` — The canonical YAML specification
- `openapi.json` — JSON version for tooling that prefers JSON

## License

[MIT](./LICENSE)
