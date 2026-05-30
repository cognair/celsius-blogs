# Deployment Guide

> How code gets from your laptop to https://blog.celsiusherbs.com

---

## TL;DR

1. **Push to `main`** → GitHub Actions auto-builds + deploys → live in ~90 seconds
2. The Cloudflare Pages project is `deploy-celsius-herbs-dev` (Direct Upload mode)
3. Custom domain `blog.celsiusherbs.com` is attached to that project
4. The main `celsiusherbs.com` storefront is untouched and runs on Shopify

---

## Architecture

```
git push origin main
       │
       ▼
GitHub Actions runner (Ubuntu, Node 22.16.0)
       │
       ├─ actions/checkout@v4         (pulls latest source)
       ├─ actions/setup-node@v4       (Node from .nvmrc)
       ├─ npm ci                      (~30-60s)
       ├─ npm run build               (~60-90s — Astro SSR + Cloudflare adapter)
       └─ cloudflare/wrangler-action@v3
              │
              ▼
              wrangler pages deploy dist --project-name=deploy-celsius-herbs-dev
              │
              ▼
       Cloudflare Pages edge network
              │
              ▼
       https://blog.celsiusherbs.com (live in ~10s after CI completes)
```

---

## Why GitHub Actions, not local `wrangler pages deploy`

Local deploys from a typical home/office network hit Cloudflare's 60-second API upload timeout because the dist folder is ~80MB and home internet upload bandwidth (5-15 Mbps) is too slow. We hit this repeatedly during initial setup.

GitHub Actions runners sit in Azure/AWS datacenters with ~1-10 Gbps to Cloudflare. The same upload completes in seconds — the timeout never fires.

**TL;DR: don't deploy from your laptop. Push to `main` and let CI handle it.**

If you absolutely need to deploy from your laptop (e.g. CI is broken), see [Manual Deploy](#manual-deploy-emergency-only) at the bottom.

---

## The CI workflow file

`.github/workflows/deploy.yml`

It does 5 things:
1. Checks out the code
2. Sets up Node 22.16.0 (from `.nvmrc`)
3. Runs `npm ci` (clean install from `package-lock.json`)
4. Runs `npm run build` with env vars injected
5. Runs `wrangler pages deploy dist --project-name=deploy-celsius-herbs-dev`

The workflow triggers on:
- Every push to `main` (auto-deploy)
- Manual trigger from the Actions tab (workflow_dispatch)

---

## Required GitHub repo secrets

Configure at: **Repo → Settings → Secrets and variables → Actions → Repository secrets**

| Name | Value | Where to get it |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with `Pages: Edit` scope | https://dash.cloudflare.com/profile/api-tokens — "Create Token" → custom token, Account → Cloudflare Pages → Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Cloudflare dashboard → account home → right sidebar |
| `PUBLIC_SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` | Shopify Admin URL |
| `PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN` | Storefront API access token | Shopify Admin → Apps → Develop apps → [your app] → API credentials |

The two `PUBLIC_*` vars are also needed locally — copy `.env.example` to `.env` and fill them in.

---

## How to deploy a code change

```bash
# 1. Make your changes
# 2. Verify local build passes
npm run build

# 3. Commit + push
git add <your-changed-files>
git commit -m "Describe what you changed"
git push origin main

# 4. Watch CI
# Open https://github.com/<your-org>/<your-repo>/actions
# Wait ~90 seconds for the green checkmark
```

---

## How to verify a deploy succeeded

After the GitHub Actions run completes (green check):

```bash
# Should return HTTP 200
curl -I https://blog.celsiusherbs.com/cat-ear-infection

# Or visit in browser
open https://blog.celsiusherbs.com/cat-ear-infection
```

For a fully new post, also paste the URL into https://search.google.com/test/rich-results to verify the JSON-LD schemas validate.

---

## Looking at deploy logs

**GitHub Actions logs**:
- https://github.com/<your-org>/<your-repo>/actions
- Click the latest run → click the "Build & Deploy" job → expand any step to see logs

**Cloudflare Pages deploy logs**:
- https://dash.cloudflare.com → Workers & Pages → `deploy-celsius-herbs-dev`
- Click any deployment to see the build output + deployment URL

---

## Common CI failures

### Build fails with "Could not load /path/to/SomeFile"
**Cause**: case-sensitivity mismatch. macOS treats `Foo.tsx` and `foo.tsx` as the same file; Linux CI doesn't.

**Fix**:
```bash
# In the repo root
git mv -f src/components/foo.tsx src/components/__tmp.tsx
git mv -f src/components/__tmp.tsx src/components/Foo.tsx
git commit -m "Fix case"
git push
```

Or set `git config core.ignorecase false` repo-wide to make git always treat case as significant (already set in this repo).

### Build fails with "Cannot find module" for a new dependency
**Cause**: you installed a dep locally but didn't commit `package.json` and/or `package-lock.json`.

**Fix**: commit both files together.

### Deploy step fails with "Project not found"
**Cause**: `wrangler.toml` has the wrong project name, or the Cloudflare token doesn't have access to that project.

**Fix**:
- Confirm `wrangler.toml` has `name = "deploy-celsius-herbs-dev"`
- Verify the API token's scope includes Account → Cloudflare Pages → Edit

### Deploy times out with 502 Bad Gateway
**Cause**: usually transient Cloudflare API issue. CI deploys rarely hit this (only local deploys do).

**Fix**: re-run the workflow from the Actions tab → "Re-run jobs"

---

## Rotating the Cloudflare API token

If the token is compromised or needs rotation:

1. Generate a new token at https://dash.cloudflare.com/profile/api-tokens
2. Update the `CLOUDFLARE_API_TOKEN` secret in GitHub: Repo Settings → Secrets → Actions → click the secret → "Update"
3. Revoke the old token in the Cloudflare dashboard
4. Trigger a manual deploy to confirm the new token works (Actions tab → workflow → "Run workflow")

---

## Cloudflare Pages settings (one-time setup, already done)

This is documented so future engineers know how it's set up. **Already configured — don't redo unless rebuilding from scratch.**

- **Project name**: `deploy-celsius-herbs-dev`
- **Project type**: Direct Upload (NOT Git-connected — and that's intentional. Direct Upload + GitHub Actions gives us the same CI/CD benefit with more flexibility)
- **Custom domain**: `blog.celsiusherbs.com` (set via Cloudflare Pages → Custom domains)
- **Production branch**: `main`
- **Build output directory**: `dist`
- **Environment variables (Production)**: same as repo secrets above

---

## DNS

Configured at the Cloudflare zone level for `celsiusherbs.com`:

- `celsiusherbs.com` (apex) → Shopify origin (unchanged, runs the storefront)
- `blog.celsiusherbs.com` → Cloudflare Pages (this project)
- All other paths on `celsiusherbs.com` → Shopify (unchanged)

The subdomain split exists because the Shopify-Cloudflare partnership overrides Cloudflare Workers at the apex domain, so we couldn't route `celsiusherbs.com/blog/*` to Pages without an Enterprise plan. The subdomain solves this cleanly.

---

## Rollback

If a deploy breaks production:

**Fast rollback (Cloudflare dashboard)**:
1. Open https://dash.cloudflare.com → Workers & Pages → `deploy-celsius-herbs-dev`
2. Click the **Deployments** tab
3. Find the last known-good deploy
4. Click the `...` menu → "Rollback to this deployment"

The rollback is instant (within ~10s).

**Code rollback (preferred for permanent fixes)**:
```bash
git revert <bad-commit-sha>
git push origin main
```

This triggers a new CI run with the bad commit reverted. Takes ~90 seconds. Leaves a clean audit trail.

---

## Manual deploy (emergency only)

If CI is broken and you need to deploy from your laptop:

```bash
# 1. Build locally
npm run build

# 2. Deploy directly via wrangler (requires CLOUDFLARE_API_TOKEN env var or `wrangler login`)
npx wrangler pages deploy dist --project-name=deploy-celsius-herbs-dev --branch=main
```

**This will likely fail with a 60s timeout on slow connections.** Workarounds:
- Retry the command (Cloudflare dedupes already-uploaded files, so subsequent retries are faster)
- Use a tethered phone hotspot (4G/5G upload often beats home cable upload)
- Use a wired ethernet connection if you're on WiFi
- Use a VM in a datacenter (e.g. `gh codespaces`) which has fast network

If none of those work, fix CI and push there.

---

## Local dev preview (not deployment)

If you just want to see your changes locally without deploying:

```bash
npm run dev          # http://localhost:8080, hot reload
# OR
npm run build && npm run preview  # production build served locally
```

Useful for spot-checking before pushing to CI.
