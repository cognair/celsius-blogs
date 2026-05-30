# Folder Structure

> Annotated tree of the framework. Skim this once before your first edit; refer back when you can't remember where something lives.

---

## Top-level (project root)

```
celsius-astrolovable/
├── .github/workflows/        # GitHub Actions (auto-deploy to Cloudflare Pages)
│   └── deploy.yml            # The CI workflow — builds + deploys on push to main
├── .nvmrc                    # Node version pin (22.16.0)
├── .env.example              # Template for local env vars (copy to .env, fill in)
├── .gitignore                # Excludes node_modules, dist, .env, .astro, etc.
├── astro.config.mjs          # Astro config — SSR, Cloudflare adapter, redirects, image plugin
├── wrangler.toml             # Cloudflare Pages config (project name, compat date, vars)
├── package.json              # npm scripts + dependencies
├── package-lock.json         # npm lockfile (canonical)
├── bun.lock / bun.lockb      # Bun lockfile (backup — only used if you switch to bun)
├── tailwind.config.ts        # Tailwind + design tokens
├── postcss.config.js         # PostCSS config (Tailwind plugin)
├── tsconfig.json             # TypeScript config + path aliases (@/* → src/*)
├── components.json           # shadcn/ui config
├── eslint.config.js          # ESLint rules
├── vitest.config.ts          # Vitest test runner config
├── playwright.config.ts      # Playwright E2E config (only if you use it)
├── README.md                 # Top-level overview
├── DEPLOYMENT.md             # Legacy deployment doc (superseded by docs/DEPLOYMENT.md)
├── docs/                     # All ongoing documentation lives here
│   ├── ADDING-A-BLOG-POST.md
│   ├── DEPLOYMENT.md
│   └── FOLDER-STRUCTURE.md   # ← you are here
├── public/                   # Static assets served as-is at the root URL
│   ├── favicon.ico
│   ├── robots.txt
│   ├── placeholder.svg
│   └── Logo/                 # Brand logo assets
├── src/                      # All application source code (see below)
├── supabase/                 # Unused Supabase scaffolding from the Lovable starter
└── node_modules/             # npm-installed deps (gitignored)
```

---

## `src/` — application source

This is where 99% of your work happens.

```
src/
├── pages/                    # Astro routes — every .astro file here is a URL
│   ├── index.astro                       → /
│   ├── 404.astro                         → 404 fallback
│   ├── cart.astro                        → /cart
│   ├── cat-dandruff-lotion.astro         → /cat-dandruff-lotion (PDP)
│   ├── cat-ear-infection.astro           → /cat-ear-infection (BLOG)
│   ├── dermveda-folliculitis-shampoo.astro → /dermveda-folliculitis-shampoo (PDP)
│   ├── ear-infection-drops.astro         → /ear-infection-drops (PDP)
│   ├── folliculitis-shampoo.astro        → /folliculitis-shampoo (PDP)
│   ├── scalp-psoriasis-shampoo.astro     → /scalp-psoriasis-shampoo (PDP)
│   ├── vglow-yeast-serum.astro           → /vglow-yeast-serum (PDP)
│   └── blog/
│       └── folliculitis-guide.astro      → /blog/folliculitis-guide (legacy path)
│
├── views/                    # React page-body components (the actual page UI)
│   ├── blog/
│   │   ├── CatEarInfectionGuide.tsx      # Cat ear infection post body (1800+ words)
│   │   └── FolliculitisGuide.tsx         # Folliculitis post body (template reference)
│   ├── pdp/
│   │   ├── CatDandruffLotion.tsx
│   │   ├── DermvedaFolliculitisShampoo.tsx
│   │   ├── EarInfectionDrops.tsx
│   │   ├── FolliculitisShampoo.tsx
│   │   ├── Index.tsx                     # Homepage
│   │   ├── ScalpPsoriasisShampoo.tsx
│   │   └── VglowYeastSerum.tsx
│   └── common/
│       └── NotFound.tsx                  # 404 page body
│
├── islands/                  # Thin React island wrappers (one per route)
│   ├── SiteHeader.tsx                    # Site-wide header (used by Layout.astro)
│   ├── SiteFooter.tsx                    # Site-wide footer
│   ├── CartBag.tsx                       # Cart drawer wrapper
│   ├── blog/
│   │   ├── CatEarInfectionGuide.tsx      # 5-line wrapper around views/blog/CatEarInfectionGuide
│   │   └── FolliculitisGuide.tsx
│   ├── pdp/                              # One wrapper per PDP, mirrors views/pdp/
│   │   └── ...
│   └── common/
│       └── NotFound.tsx
│
├── layouts/
│   └── Layout.astro                      # Wraps every page — <head>, <body>, header, footer, JSON-LD
│
├── components/                           # Shared React components (used across views)
│   ├── CartDrawer.tsx                    # Side cart panel — global state via nanostores
│   ├── CartLines.tsx                     # Cart line item rendering
│   ├── SiteHeader.tsx                    # Header internals (logo, nav, cart icon)
│   ├── SiteFooter.tsx                    # Footer internals
│   ├── PageRoot.tsx                      # Root wrapper shared by all pages
│   ├── NavLink.tsx                       # Header nav link (with hover state)
│   ├── LiteYouTube.tsx                   # Performance-optimized YouTube embed
│   └── ui/                               # shadcn/ui primitives (accordion, button, dialog, etc.)
│       └── ...                           # ~50 files — don't edit directly, use `npx shadcn add`
│
├── lib/                      # Server-side helpers + business logic
│   ├── blog/
│   │   └── cat-ear-infection-faqs.ts     # FAQ data + Article/FAQPage JSON-LD builders
│   └── shopify/                          # Shopify Storefront API client + helpers
│       ├── client.ts                     # GraphQL client factory
│       ├── storefront.ts                 # Top-level storefront fetchers (menus, products)
│       ├── queries.ts                    # GraphQL query strings
│       ├── handles.ts                    # Map of Shopify product handles
│       ├── fetch-product-seo.ts          # Builds Product JSON-LD from Shopify data
│       ├── merge-layout-meta.ts          # Merges Shopify SEO into Layout props
│       ├── cart-actions.ts               # Cart create/update/checkout mutations
│       ├── cart-line-helpers.ts          # Quantity/pricing logic
│       ├── cart-store.ts                 # nanostores cart state (shared across React islands)
│       └── index.ts                      # Barrel export
│
├── assets/                   # Build-time-imported assets (images, fonts)
│   ├── Logo/                             # Brand assets
│   ├── blog/
│   │   ├── cat-ear-hero.webp             # 5 cat-ear post images (~70-185KB each)
│   │   ├── cat-ear-symptoms.webp
│   │   ├── cat-ear-causes.webp
│   │   ├── cat-ear-home.webp
│   │   └── cat-ear-vet.webp
│   └── vglow/                            # vglow PDP product imagery
│
├── styles/
│   └── global.css                        # Tailwind directives + custom CSS reset
│
├── hooks/                    # React hooks (custom, if any)
│
├── integrations/
│   └── supabase/                         # ⚠️ UNUSED — leftover from Lovable starter, safe to ignore
│
└── test/                     # Vitest test files (if present)
```

---

## The 4-file blog post pattern (most important to remember)

Every new blog post creates exactly 4 files. The cat-ear-infection post is the reference:

| Layer | File | Role |
|---|---|---|
| **Page** | `src/pages/cat-ear-infection.astro` | Astro route. Sets URL, SEO meta, JSON-LD. ~20 lines. |
| **Island** | `src/islands/blog/CatEarInfectionGuide.tsx` | Thin wrapper for `client:load` hydration. ~5 lines. |
| **View** | `src/views/blog/CatEarInfectionGuide.tsx` | The actual blog content (JSX with prose, headings, images, FAQ). ~1000+ lines. |
| **FAQ data** | `src/lib/blog/cat-ear-infection-faqs.ts` | FAQ array + JSON-LD builder functions. ~90 lines. |

Plus image assets:
- `src/assets/blog/cat-ear-*.webp` (5 images for this post)

---

## What flows into what

```
Browser request → Astro page (.astro)
  ↓
  Layout.astro wraps it
    │
    ├─ <head>: meta tags from page props + JSON-LD from lib/blog/*-faqs.ts
    ├─ SiteHeader island (fetches menus via lib/shopify/storefront.ts)
    ├─ <slot/>: the page's island (e.g. CatEarInfectionGuideIsland)
    │              ↓
    │              views/blog/CatEarInfectionGuide.tsx (renders the body)
    │                  ↓
    │                  uses components/ for shared bits (Accordion, etc.)
    │                  imports images from src/assets/blog/
    └─ SiteFooter island (also fetches menus from Shopify)
```

---

## Where to put a new file?

| If you're adding... | Put it in... |
|---|---|
| A new blog post | 4 files: `src/pages/`, `src/views/blog/`, `src/islands/blog/`, `src/lib/blog/` |
| A new PDP | 3 files: `src/pages/`, `src/views/pdp/`, `src/islands/pdp/` |
| A reusable UI component | `src/components/` (or `src/components/ui/` for shadcn primitives) |
| A new Shopify GraphQL query | Add to `src/lib/shopify/queries.ts` |
| A new image | `src/assets/` (build-time, gets hashed) or `public/` (static, served as-is) |
| Tailwind theme override | `tailwind.config.ts` |
| Global CSS | `src/styles/global.css` |
| A redirect | `redirects` block in `astro.config.mjs` |

---

## Things you should NOT need to touch (usually)

- `src/components/ui/*` — these are shadcn-generated. Use `npx shadcn add <component>` to add new ones, don't hand-edit.
- `src/integrations/supabase/` — unused leftover from the Lovable starter. Leave it alone or delete the whole folder.
- `astro.config.mjs` — only edit when adding redirects or changing the adapter
- `wrangler.toml` — only edit when changing the Pages project name or compatibility settings
- `.github/workflows/deploy.yml` — only edit if you change the build/deploy flow
