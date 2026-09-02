# @1claw/openapi-spec (v0.59.10)

> ⭐ **Star [1clawAI/agent-templates](https://github.com/1clawAI/agent-templates)** — ready-to-run agent templates wired to 1Claw. It is our single starred repo.

OpenAPI 3.1.0 specification for the [1Claw Vault API](https://1claw.co). Use this package to generate API clients in any language.

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

## What's in the spec (v0.59.10)

Additive only — no path or parameter renames, so generated clients keep compiling.

- **Browser device management** — `GET /v1/browser/devices` and
  `DELETE /v1/browser/devices/{id}`. Revoked devices are listed rather than
  hidden; revocation is what makes a leaked `bb_` bridge credential stop working.
- **The fill request gained four required fields** — `form_path`, `field_names`,
  `redirect_chain` and `current_generation` on
  `POST /v1/agents/{id}/browser/fills`. They were optional and the server filled
  them in when absent, which turned three of its own policy checks off. A request
  missing any of them is refused with a 400 naming them. Send
  `current_generation` as the generation observed *now*: the same value as
  `generation` makes the staleness check compare a value to itself.
- **`POST /v1/vaults` documents 409** for a duplicate name, and what 400 covers
  (empty, or over 255 characters). Both were 500s. `CreateVaultRequest.name`
  carries the real constraints.
- **`POST /v1/runtimes/{id}/chat` documents 503** — the runtime's last start
  failed under 120s ago and is not being retried yet.

## What's in the spec (v0.59.4)

### Platform connection expansion (v0.59.4)
- **Portfolio** — `GET /v1/platform/connections/{id}/portfolio` and alias `GET .../balances` (plt_ auth; optional `?chains=`, `?include_tokens=`)
- **Pending approval create** — `POST /v1/platform/connections/{id}/pending-approvals` (plt_ auth; returns **202** with `pending_approval_id`)
- **Connection automations** — `GET/POST .../automations`, `POST .../automations/{aid}/runs/{rid}/cancel`
- **Connection memory** — `GET/PUT/DELETE .../memory/{namespace}/{key}` (optional `?agent_id=`)
- **Content inspection** — `POST /v1/shroud/inspect-content` (MCP `inspect_content` parity; plt_, agent JWT, user JWT)
- **Signing keys + agent patch** — `GET .../signing-keys`, `PATCH .../agents/{aid}` (v0.59.3, documented here for completeness)

## What's in the spec (v0.58.0)

### Platform control plane (v0.58)
- **App-scoped reads (`plt_`)** — `GET /v1/platform/connections/{id}/approvals`, pending-approvals (includes `payload_hash`), spend-policy
- **Spend policy** — `GET /v1/platform/apps/{id}/spend-policies/{policy_id}`; `PUT .../connections/{id}/spend-policy` supports optional **`Idempotency-Key`** (24h body-hash replay)
- **App lifecycle** — soft-delete returns `{ id, slug, deleted_at }`; slug unique per org; inactive apps return 404
- **Ownership transfer** — `POST /v1/platform/apps/{id}/transfer-ownership` with step-up auth

### Platform API expansion (v0.57)
- **SIWE provisioning** — `POST /v1/platform/siwe/challenge`; upsert with wallet subject token
- **Parameterized templates** — bootstrap `parameters` JSON; `POST .../templates/{tid}/preview` dry-runs `{{params.*}}` / `{{subject.*}}`
- **Connection polling** — `GET /v1/platform/connections/{id}` (status, claim, entitlements, wallet address)
- **Per-connection usage** — `GET .../connections/{id}/usage` (inference spend, UTC period)
- **On-chain entitlements** — template `entitlements[]`; refresh + monitor endpoints
- **Inference budgets** — spend policy inference allowance fields; `GET /v1/treasury/wallets/inference-budget`

### Safe accounts & guardrail governance (v0.56)
- **Agent accounts** — `GET/POST /v1/agents/{id}/accounts`, migrate/deprecate EOA, module registry
- **Guardrail governance** — shadow report, revisions, replay; widening guardrails return **202** + approval
- **Human Factor Auth** — treasury send/swap/export step-up policies
- **Org unfreeze** — T3 step-up; cumulative gas budget ledger

### Graduated HITL & extended guardrails (v0.54–0.55)
- **Agent fields** — `tx_approval_policy`, `typed_data_policy`, `simulation_failure_policy`, `raw_signing_policy`, `personal_sign_policy`, `tx_block_unlimited_approvals`, per-recipient limits, USD caps, `allow_erc4337`, `allow_eip7702`, `auto_suspended`, `clear_auto_suspended` (update)
- **Org freeze** — `POST /v1/org/freeze`, `POST /v1/org/unfreeze` (owner/admin emergency stop)
- **Sign HITL** — EIP-712 and raw digest intents can return **202** `awaiting_approval` when policy is `approve`
- **Webhooks** — `tx.awaiting_approval`, `sign.awaiting_approval`, `agent.suspended`, `org.frozen`

### Environment Variables (v0.51)
- **Per-key env vars** — `GET/POST /v1/vaults/{id}/env-vars`, `GET/PATCH/DELETE .../{key}`, `GET .../resolve` with three-tier precedence (org shared < vault < branch override)
- **Vault environments** — `GET/POST /v1/vaults/{id}/environments`, `DELETE .../{slug}` (built-in + tier-gated custom)
- **Org shared vars** — `GET/POST /v1/org/env-vars`, link/unlink to vaults
- **Sensitive vars** — write-only after creation; org setting `env.require_sensitive_prod`
- **Runtime injection** — resolved vars merged into Cloud Runtime container env at start/rebuild

### Agent Environment Tagging (v0.52)
- **Agent fields** — `environment`, `environment_locked`, `env_auto_resolve`, `per_environment_guardrails` on create/update/response schemas
- **JWT claim** — Agent tokens include `environment` when the agent has a tag
- **Policy conditions** — `environment_in` array in built-in policy `conditions` JSON
- **Env var resolution** — `GET /v1/vaults/{id}/env-vars/resolve` accepts optional `environment`; auto-fills from agent tag when `env_auto_resolve` is true

### Cedar/OPA Enforcement v2 (v0.48)
- **Policy backend** — `GET/PATCH /v1/org/settings/policy-backend`, `GET /v1/org/policy-shadow-report`
- **Contract ABIs** — `POST/GET/DELETE /v1/org/contract-abis`, `GET /v1/org/contract-abis/{id}`
- **Pending approvals** — `POST/GET /v1/pending-approvals`, approve/execute/cancel sub-routes
- **Consensus triggers** — `consensus_trigger` on access policy schemas
- **Dynamic enforcement_status** — Cedar/OPA policy and test responses

### Turnkey parity (v0.47)
- **Portfolio** — `GET /v1/portfolio` (unified balance aggregator)
- **Cedar policies** — `POST/GET/DELETE /v1/org/cedar-policies`, dry-run `POST .../test` (Team+ tier)
- **OPA policies** — `POST/GET/DELETE /v1/org/opa-policies`, dry-run `POST .../test` (Business+ tier)
- **Sub-organizations** — `POST/GET/DELETE /v1/org/sub-orgs`, permissions, users, wallet generation
- **Smart account import** — `POST /v1/agents/{id}/smart-accounts/import`
- **Signing key BYOK** — `POST /v1/agents/{id}/signing-keys/{chain}/import` (human-only, `X-Auth-Confirm`)
- **Treasury wallet import** — `POST /v1/treasury/wallets/{chain}/import` (human-only, multi-chain send)

### OAuth & Platform enhancements (0.44.4)
- **OAuth token revocation** — `POST /v1/oauth/revoke` (RFC 7009 token revocation)
- **Consent revocation** — `DELETE /v1/oauth/consents/{app_id}` (user revokes consent for a specific app)
- **Platform marketplace** — `GET /v1/platform/marketplace` (public listing of approved platform apps)
- **App statistics** — `GET /v1/platform/apps/{id}/stats` (usage and connection statistics for a platform app)
- **Webhook secret rotation** — `POST /v1/platform/apps/{id}/rotate-webhook-secret` (rotate a platform app's webhook signing secret)

### Automations v2 & Channels (2.33)
- **Automations v2** — Workflow engine with multi-step pipelines, 14 step types, `{{...}}` template variables, conditional logic (`skip_if`/`run_if`), 10 marketing presets, webhook/event/cron/manual triggers. Enriched list API with `last_run_status`, `total_runs`, `success_rate`, `agent_name`. Run detail with `context` JSONB. Assist NL→workflow drafting.
- **Agent Channels** — Telegram, WhatsApp, Discord messaging channels for agents. CRUD, send, message history, test connectivity.
- **Agent Memory** — Three-tier memory (scratch, durable, semantic) with encryption at rest. CRUD, semantic search, namespace management.
- **Cloud Runtimes** — Managed containers with lifecycle management, hosting, interactive shell. Presets from small to large-cc (confidential compute).
- **Platform delegation** — Platform apps can perform delegated CRUD on connected user resources via `X-Platform-Connection` header. Delegation log for audit.
- **Discovery** — Public agent directory and platform marketplace.

### Non-EVM transaction signing (2.23)
- **Intents API** — `SubmitTransactionRequest` / `SignTransactionRequest` / `SignIntentRequest` extended with non-EVM fields: `destination_tag` (XRP), `memo`, `fee_rate_sat_per_vbyte` (Bitcoin), `fee_limit_sun` (Tron), `token_mint` / `token_decimals` (Solana SPL + Tron TRC-20), `ttl` (Cardano). Native sign + broadcast for Bitcoin, Solana, XRP, Cardano, Tron.
- **`xrpl_tx_json`** — Optional raw XRPL transaction JSON for 30+ transaction types beyond simple Payment.

### Risk Engine & DPoP (2.19)
- **Risk events** — `GET /v1/risk/events` (list, filterable by severity/principal_type)
- **Risk verdicts** — `GET /v1/risk/verdicts` (active verdicts), `GET /v1/risk/verdicts/{type}/{id}` (single principal verdict)
- **Honeytokens** — `GET/POST/DELETE /v1/risk/honeytokens` (canary secret CRUD with trigger counts)
- **DPoP** — RFC 9449 Demonstration of Proof-of-Possession token binding (shipped)

### Webhooks (2.19)
- **Webhook CRUD** — `POST/GET /v1/webhooks`, `GET/PATCH/DELETE /v1/webhooks/{id}`. Events: `wallet.transfer.*`, `proposal.*`, `agent.transaction.*`, `signing_key.rotated`, `policy.*`

### OAuth & Email OTP (2.19)
- **OAuth2 authorization server** — `GET/POST /v1/oauth/authorize`, `POST /v1/oauth/token`, `GET /v1/oauth/userinfo` ("Sign in with 1Claw")
- **Email OTP** — `POST /v1/auth/email-otp/send`, `POST /v1/auth/email-otp/verify` (passwordless login)
- **Spend policies** — `POST/GET/DELETE /v1/platform/apps/{id}/spend-policies`, `PUT /v1/platform/connections/{id}/spend-policy`, `GET /v1/treasury/wallets/spend-policy`

### Bankr dynamic key vending (2.18)
- **Bankr keys** — `POST /v1/agents/{id}/bankr-keys/lease`, `GET /v1/agents/{id}/bankr-keys`, `DELETE /v1/agents/{id}/bankr-keys/{lease_id}`. Partner key vending for scoped, TTL-bound `bk_usr_` wallet API keys.


### CDP parity & embedded wallet (2.16+)
- **Deposit destinations** — `POST/GET/PATCH /v1/deposit-destinations`, `GET /v1/deposit-destinations/{id}`
- **Internal accounts** — `POST/GET /v1/internal-accounts`, `POST /v1/internal-transfers` (supports `Idempotency-Key`), `GET /v1/internal-accounts/{id}/ledger`
- **Fiat ramps** — `POST /v1/fiat/onramp/session`, `POST /v1/fiat/offramp/initiate`, `POST /v1/fiat/webhooks` (MoonPay signature required in production)
- **Social login** — `POST /v1/auth/social-login` (Google/Apple ID tokens with audience validation; Discord authorization code + `oauth_redirect_uri`; no email auto-linking — 409 on conflict)
- **Passkey tx auth** — `POST /v1/auth/passkeys/tx-assert/begin|complete` → `X-Passkey-Token` (+ optional `X-Passkey-Tx-Digest`) on treasury send

### Core API (summary)

- **OIDC Federation (1claw as IdP)** — `GET /.well-known/openid-configuration` (public discovery: issuer, jwks_uri, supported algs `["EdDSA","RS256"]`, supported grant types incl. token-exchange), `GET /.well-known/jwks.json` (public JWKS — every active EdDSA + RS256 key version, keyed by deterministic `kid`), `POST /v1/auth/federated-token` (RFC 8693 token exchange — accepts JSON or `application/x-www-form-urlencoded`; subject token is an agent JWT or `ocv_` API key; returns RS256 JWT scoped to `audience`). Agent fields: `federation_enabled`, `federation_audiences[]`, `federated_token_ttl_seconds`. Designed for Anthropic Workload Identity Federation, GCP STS, AWS STS, etc.
- **Auth — agent JWT** — `POST /v1/auth/agent-token` documents optional JWT claim **`shroud_config`** when the agent has Shroud enabled (mirrors DB; consumed by Shroud PolicyEngine on LLM requests). Re-exchange after changing agent Shroud settings. Federation tokens use a separate KMS RSA-2048 key and are signed RS256.
- **Auth — password reset** — `POST /v1/auth/forgot-password`, `POST /v1/auth/reset-password` (public; anti-enumeration on forgot)
- **Auth — set password** — `POST /v1/auth/set-password` (for platform OIDC users who don't have a password yet)
- **Auth — email change** — `POST /v1/auth/change-email` (request, sends verification code), `POST /v1/auth/verify-email-change` (verify with code)
- **Auth — passkeys (WebAuthn)** — `POST /v1/auth/passkeys/register/begin`, `POST .../register/complete`, `POST /v1/auth/passkeys/assert/begin`, `POST .../assert/complete`, `GET /v1/auth/passkeys` (list), `DELETE /v1/auth/passkeys/{passkey_id}`
- **Approvals** — Human-in-the-loop approval workflow: `POST /v1/approvals/request`, `GET /v1/approvals`, `GET /v1/approvals/{id}`, `POST /v1/approvals/{id}/decide`
- **Billing — LLM token billing** — `GET /v1/billing/llm-token-billing` (`LlmTokenBillingStatus`: `enabled`, `subscription_status`, optional `credit_balance`, optional `billing_cycle_usage` with `metered_lines[]`), `POST .../subscribe`, `POST .../disable` (Stripe AI Gateway add-on; optional org feature)
- **Treasury** — Safe multisig treasuries: `POST/GET /v1/treasury`, `GET/PATCH/DELETE /v1/treasury/{id}`, signers, agent access requests (`requests[]` on list)
- **Treasury Wallets** — Multi-chain wallet generation for human users (replaces CDP embedded wallets): `POST /v1/treasury/wallets/generate`, `GET /v1/treasury/wallets`, `GET /v1/treasury/wallets/{chain}`, `POST .../export`, `POST .../rotate`, `DELETE /v1/treasury/wallets/{chain}`. Supported chains: ethereum, bitcoin, solana, xrp, cardano, tron. Private keys stored in per-org `__treasury-keys` vault with tier-appropriate MPC custody.
- **Treasury Proposals** — Full propose/confirm/execute pipeline for Safe multisig transactions: `POST /v1/treasury/{id}/proposals`, `GET .../proposals`, `GET .../proposals/{pid}`, `POST .../proposals/{pid}/sign`, `POST .../proposals/{pid}/execute`, `DELETE .../proposals/{pid}`. Auto-execute when threshold met.
- **Smart Accounts** — Per-agent multi-chain Safe accounts: `POST /v1/agents/{id}/smart-accounts`, `GET /v1/agents/{id}` returns `smart_accounts[]`. One EOA signer per agent, Intents API resolves Safe by `chain_id`.
- **Vaults** — CRUD, CMEK enable/disable, key rotation with job tracking, MPC enable/disable (`POST /v1/vaults/{id}/mpc`, `DELETE /v1/vaults/{id}/mpc`)
- **Secrets** — CRUD, versioning, CMEK-encrypted flag, `client_share` in responses (MPC vaults)
- **Agents** — CRUD with `auth_method` (api_key, mtls, oidc_client_credentials), auto-generated SSH keypairs, `token_ttl_seconds`, `vault_ids`, Intents API, transaction guardrails (`tx_to_allowlist`, `tx_max_value` (native major units), `tx_daily_limit` (per-chain), `tx_allowed_chains`), **OIDC federation knobs** (`federation_enabled`, `federation_audiences`, `federated_token_ttl_seconds`); **`GET /v1/agents/{id}`** includes **`tx_spent_today`** and **`tx_spent_today_by_chain`** (per-chain daily spend in native units) for clients such as **Shroud** that enforce the daily cap alongside per-tx limits. Deprecated aliases `tx_max_value_eth`, `tx_daily_limit_eth`, `tx_spent_today_eth` are still accepted/returned for backward compatibility.
- **Signing Keys** — Multi-chain key management: `POST /v1/agents/{id}/signing-keys` (provision), `GET .../signing-keys` (list), `POST .../signing-keys/{chain}/rotate`, `DELETE .../signing-keys/{chain}` (deactivate). Supports ethereum, bitcoin, solana, xrp, cardano, tron
- **Unified Signing** — `POST /v1/agents/{id}/sign` — single endpoint for EIP-191 personal_sign, EIP-712 typed_data, and EIP-2718 transaction types (legacy, EIP-1559, EIP-4844, EIP-7702)
- **Policies** — Glob-based access control
- **Sharing** — Links, user/agent shares, accept/decline
- **Billing** — Subscriptions, credits, x402, LLM token billing (see above)
- **Audit** — Hash-chained event log
- **Chains** — Supported blockchain registry
- **Auth** — JWT, API keys, agent tokens, MFA, device flow, Google OAuth, **passkeys (WebAuthn)**, **federated tokens (RFC 8693)**
- **Platform** — Platform API for building multi-tenant apps on 1Claw: `POST/GET /v1/platform/apps`, `GET/PATCH/DELETE /v1/platform/apps/{id}`, `POST/GET /v1/platform/apps/{id}/templates`, `POST /v1/platform/users/upsert`, `POST /v1/platform/connections/{id}/bootstrap`, `GET /v1/platform/apps/{id}/users`, `GET /v1/platform/apps/{id}/audit`, `GET/DELETE /v1/platform/connected-apps`, `GET /v1/platform/claim/{token}` (preview), `POST /v1/platform/claim/{token}` (redeem). Platform apps authenticate with `plt_` prefixed API keys. Supports OIDC user provisioning, bootstrap templates, and billing models (platform_pays, user_pays, hybrid).
- **Org** — List members, invite, update/remove member; `GET /v1/org/agent-keys-vault` (users only, returns __agent-keys vault id or 404)

## Included files

- `openapi.yaml` — The canonical YAML specification
- `openapi.json` — JSON version for tooling that prefers JSON

## License

[MIT](./LICENSE)
