# Celsius Herbs — Headless Blog & Storefront Framework

> Astro 5 · React Islands · Shopify Storefront API · Cloudflare Pages · GitHub Actions CI/CD

Headless front-end for **celsiusherbs.com**. The blog lives at `blog.celsiusherbs.com` and product detail pages live in this same framework, fed by the Shopify Storefront API for shared header/footer/cart state. The main `celsiusherbs.com` Shopify storefront is unchanged.

> **👋 First time here?** Start with **[`QUICKSTART.md`](./QUICKSTART.md)** — it's written for non-technical team members and gets you from zero to a running local preview in 10 minutes. Come back here when you want the technical details.

---

## 🚀 Quick Start (technical reference)

```bash
# 1. Install dependencies (npm — bun.lock is included as backup but npm is canonical)
npm install

# 2. Copy environment template and fill in your Shopify Storefront token
cp .env.example .env
# Edit .env: set PUBLIC_SHOPIFY_STORE_DOMAIN and PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN

# 3. Run dev server (Astro at http://localhost:8080)
npm run dev

# 4. Production build (output goes to ./dist)
npm run build

# 5. Preview the production build locally
npm run preview
```

**Node version**: 22.16.0 (pinned via `.nvmrc`). If you use `nvm`, run `nvm use` to switch automatically.

---

## 📐 Architecture

```
                                 ┌─────────────────────────┐
                                 │     User Browser        │
                                 └────────────┬────────────┘
                                              │
                  ┌───────────────────────────┴───────────────────────────┐
                  ▼                                                       ▼
        celsiusherbs.com                                blog.celsiusherbs.com
        (Shopify storefront,                            (this Astro framework
        unchanged)                                      on Cloudflare Pages)
                                                                │
                                                                ▼
                                            ┌──────────────────────────────────┐
                                            │ Astro 5 SSR (Cloudflare Workers) │
                                            │  ├─ React islands (PDPs, blog)   │
                                            │  ├─ Shopify Storefront API       │
                                            │  │   (header/footer menus, cart) │
                                            │  └─ JSON-LD schema rendering     │
                                            └──────────────────────────────────┘
```

**Key concepts:**

- **Astro 5 SSR** with `@astrojs/cloudflare` adapter — pages render at the edge on Cloudflare Workers
- **React islands** — interactive UI (PDPs, blog content, cart drawer) hydrated client-side; static shell rendered server-side
- **Shopify Storefront API** — fetches menus, products, and creates cart/checkout. Token is public-safe (browser-exposed by design)
- **JSON-LD schemas** — every blog post and PDP emits `Article`/`Product`/`FAQPage` structured data for SEO

---

## 📂 Project Structure (high-level)

See `docs/FOLDER-STRUCTURE.md` for the full annotated tree.

```
src/
├── pages/          # Astro routes — each .astro file is a URL
│   ├── cat-ear-infection.astro   ← blog post (served at /cat-ear-infection)
│   ├── ear-infection-drops.astro ← PDP
│   └── ...
├── views/          # Page-level React components (rendered inside islands)
│   ├── blog/       # Blog post bodies
│   └── pdp/        # Product detail page bodies
├── islands/        # Thin React island wrappers (for Astro's `client:load`)
├── components/     # Shared React components (CartDrawer, SiteHeader, etc.)
├── layouts/        # Astro layouts (Layout.astro wraps every page)
├── lib/            # Server-side helpers
│   ├── blog/       # Blog-specific (FAQ arrays, JSON-LD builders)
│   └── shopify/    # Storefront API client + GraphQL queries
├── assets/         # Build-time imported assets (images, fonts)
└── styles/         # Global CSS (Tailwind base)

docs/               # Documentation (this file + companions below)
public/             # Static assets served as-is (favicon, robots.txt, logo)
.github/workflows/  # GitHub Actions (auto-deploy to Cloudflare Pages)
```

---

## 📝 Adding a new blog post

**See `docs/ADDING-A-BLOG-POST.md` for the step-by-step playbook.** Quick summary:

Each post is 4 files:
1. **Page** — `src/pages/<slug>.astro` — Astro route + SEO meta + JSON-LD
2. **Island** — `src/islands/blog/<Name>Guide.tsx` — thin React wrapper
3. **View** — `src/views/blog/<Name>Guide.tsx` — the actual blog content (headings, paragraphs, images)
4. **FAQ data** — `src/lib/blog/<slug>-faqs.ts` — FAQ array + JSON-LD builders

Use the existing `cat-ear-infection` post as the reference template.

---

## 🚢 Deployment

**See `docs/DEPLOYMENT.md` for the full deployment guide.** Quick summary:

- **Production URL**: https://blog.celsiusherbs.com
- **Cloudflare Pages project**: `deploy-celsius-herbs-dev`
- **Auto-deploy**: every push to `main` triggers GitHub Actions → builds → deploys to Cloudflare Pages in ~90 seconds
- **Manual deploy**: from any branch, run `npm run build && npx wrangler pages deploy dist --project-name=deploy-celsius-herbs-dev`

---

## 🐛 Common Gotchas

### File case sensitivity (macOS vs Linux CI)
macOS is case-insensitive by default; the Linux CI runner is case-sensitive. If you rename a file's casing locally (e.g. `cartdrawer.tsx` → `CartDrawer.tsx`), git may not track the change. Workaround:

```bash
git mv -f src/components/cartdrawer.tsx src/components/__tmp.tsx
git mv -f src/components/__tmp.tsx src/components/CartDrawer.tsx
git commit -m "Fix case"
```

This repo has `core.ignorecase=false` set locally to catch case-sensitivity bugs early. Keep it that way.

### Image imports rendering as `[object Object]`
Astro 5 transforms image imports (`.jpg`, `.png`, `.webp`) into `ImageMetadata` objects. React components expect plain URL strings. The `imageAsUrlPlugin` in `astro.config.mjs` rewrites these imports — you don't need to do anything special. Just import images normally:

```tsx
import heroImage from "@/assets/blog/cat-ear-hero.webp";
<img src={heroImage} alt="..." />
```

### Cloudflare Pages 502 on local `wrangler pages deploy`
Large dist sizes (>50MB) over slow upload bandwidth can hit Cloudflare's 60s API timeout. **Use the GitHub Actions workflow (auto-triggered on push) instead.** CI runners have datacenter-grade bandwidth and don't hit this wall.

### Build warnings (safe to ignore)
- `[adapter] Cloudflare does not support sharp at runtime` — informational, image optimization happens at build time
- `Browserslist: browsers data is X months old` — informational, doesn't affect output
- npm deprecation warnings — transitive dependencies, not breaking

---

## 🛠️ Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Astro dev server at http://localhost:8080 |
| `npm run build` | Production build to `./dist` (Cloudflare Pages format) |
| `npm run preview` | Locally serve the production build |
| `npm run lint` | ESLint over the codebase |
| `npm test` | Run Vitest test suite |

---

## 📚 Further Reading

- **`docs/AI-BLOG-SKILL.md` — how to use the AI blog skill** (start here for the automated pipeline)
- `docs/ADDING-A-BLOG-POST.md` — the manual article-creation playbook (legacy / fallback)
- `docs/FOLDER-STRUCTURE.md` — full annotated source tree
- `docs/DEPLOYMENT.md` — CI/CD, secrets, manual deploy steps
- [Astro 5 docs](https://docs.astro.build/)
- [@astrojs/cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

---

## 🔐 Secrets & Credentials

**Local development**: copy `.env.example` to `.env`, fill in real values.

**Production (Cloudflare Pages env vars)**: set via Cloudflare dashboard or `wrangler pages secret put`.

**GitHub Actions (CI/CD)**: configured as repository secrets at GitHub → Repo Settings → Secrets and variables → Actions. Required secrets:

| Secret name | Used for |
|---|---|
| `CLOUDFLARE_API_TOKEN` | wrangler authentication |
| `CLOUDFLARE_ACCOUNT_ID` | wrangler account scope |
| `PUBLIC_SHOPIFY_STORE_DOMAIN` | Build-time injection |
| `PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN` | Build-time injection |

---

## 📞 Handoff Notes

This framework was set up to ship the first blog post (`cat-ear-infection`) and validate the end-to-end pipeline. The CI/CD, schema markup, image pipeline, Shopify integration, and routing are all production-tested.

Verified working state: commit on `main` branch — production live at https://blog.celsiusherbs.com/cat-ear-infection

For questions about how a specific piece works, the inline comments in source files (especially `astro.config.mjs`, `src/lib/shopify/storefront.ts`, and `src/pages/cat-ear-infection.astro`) explain the design choices.
