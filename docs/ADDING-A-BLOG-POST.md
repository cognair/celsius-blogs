# Adding a New Blog Post

> Step-by-step playbook. The existing `cat-ear-infection` post is the reference template — every new post follows the same 4-file structure.

---

## Mental model

Every blog post is **4 files**:

| File | Purpose | Convention |
|---|---|---|
| `src/pages/<slug>.astro` | Astro route (URL + SEO meta + JSON-LD wiring) | Lowercase slug, hyphens. E.g. `dog-ear-infection.astro` |
| `src/islands/blog/<Name>Guide.tsx` | Thin React island wrapper for Astro `client:load` | PascalCase. E.g. `DogEarInfectionGuide.tsx` |
| `src/views/blog/<Name>Guide.tsx` | The actual blog content (JSX with headings, images, prose) | Same PascalCase as the island |
| `src/lib/blog/<slug>-faqs.ts` | FAQ array + JSON-LD builder functions | Lowercase slug. E.g. `dog-ear-infection-faqs.ts` |

Plus assets:
- `src/assets/blog/<slug>-hero.webp` (and other supporting images)

---

## Step 1 — Plan the post

Before writing, answer these:

1. **Primary keyword** (one phrase, from Ahrefs/SurferSEO). Example: `cat ear infection`
2. **URL slug**. Should match the keyword closely. Example: `cat-ear-infection`
3. **Word count target** (1,500–3,000 typical based on SERP analysis)
4. **Content sections** (H2s) — usually 5–8 sections
5. **FAQ questions** — 5–8 questions for the FAQPage schema
6. **Internal link targets** — which PDPs or other blog posts should this link to

Use the strategy doc / SurferSEO content brief to fill these in.

---

## Step 2 — Generate hero + supporting images

The cat-ear post uses 5 images (hero, symptoms, causes, home treatment, vet). For new posts, generate 3–5 supporting `.webp` images:

1. Use Nano Banana / Gemini Flash Image API (or whatever your image generator is). Style guide in `keyword-research/image-style-guide.md` of the client folder.
2. Export as `.webp` at ~1200px wide. Aim for under 200KB each (the cat-ear images are 70–185KB).
3. Save to `src/assets/blog/<slug>-<section>.webp`. Example file naming:
   - `cat-ear-hero.webp`
   - `cat-ear-symptoms.webp`
   - `cat-ear-causes.webp`
   - `cat-ear-home.webp`
   - `cat-ear-vet.webp`

⚠️ **Don't commit huge images.** The dist size affects build time. Keep each under 250KB.

---

## Step 3 — Create the FAQ + JSON-LD file

`src/lib/blog/<slug>-faqs.ts`

Copy `src/lib/blog/cat-ear-infection-faqs.ts` as the template. Three things to update:

1. **The FAQ array** — replace questions and answers with the new post's content
2. **Article JSON-LD `headline` and `description`** — match the post's `<title>` and meta description
3. **`@id` URL** — set to the post's canonical URL

```typescript
export const DOG_EAR_INFECTION_FAQS: Faq[] = [
  {
    q: "How do I know if my dog has an ear infection?",
    a: "Look for head shaking, scratching at one ear...",
  },
  // ... more FAQs
];

export function buildDogEarInfectionFaqJsonLd(...) { /* ... */ }
export function buildDogEarInfectionArticleJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dog Ear Infection: ...",
    description: "...",
    // ...
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://blog.celsiusherbs.com/dog-ear-infection",  // ← match the canonical
    },
  };
}
```

---

## Step 4 — Build the View component (the post body)

`src/views/blog/<Name>Guide.tsx`

This is the main work. Copy `src/views/blog/CatEarInfectionGuide.tsx` as the starting point and rewrite:

- **Imports** — update the image imports to the new post's images
- **Hero section** — heading, lead paragraph, hero image
- **Table of Contents** — static (not sticky), lists the H2 sections
- **Body sections** — H2s with paragraphs, images, callouts, tables
- **FAQ section** — uses the `<Accordion>` shadcn component, fed from the FAQ array
- **CTA / related products** — links to relevant PDP

Structural conventions (already in the cat-ear example):
- Use `Cormorant Garamond` for H1/H2, `Inter` for body (loaded in `Layout.astro`)
- Image alt text is required (SEO + a11y)
- Internal links use Astro routes (e.g. `<a href="/ear-infection-drops">`)
- External links open in new tab with `rel="noopener noreferrer"`

---

## Step 5 — Create the Island wrapper

`src/islands/blog/<Name>Guide.tsx`

This is 5 lines. Copy from `src/islands/blog/CatEarInfectionGuide.tsx`:

```tsx
import GuideView from "@/views/blog/DogEarInfectionGuide";

export default function DogEarInfectionGuideIsland() {
  return <GuideView />;
}
```

Astro requires this wrapper so it can hydrate the view as a client-side island.

---

## Step 6 — Create the Astro page

`src/pages/<slug>.astro`

Copy `src/pages/cat-ear-infection.astro`. Update:

```astro
---
import Layout from "../layouts/Layout.astro";
import DogEarInfectionGuideIsland from "../islands/blog/DogEarInfectionGuide";
import {
  buildDogEarInfectionFaqJsonLd,
  buildDogEarInfectionArticleJsonLd,
} from "../lib/blog/dog-ear-infection-faqs";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    buildDogEarInfectionArticleJsonLd(),
    buildDogEarInfectionFaqJsonLd(),
  ],
};
---

<Layout
  title="Dog Ear Infection: Symptoms, Causes & Natural Treatment"
  description="Field guide to dog ear infections — symptoms, causes, natural home treatment, when to call the vet. Vet-reviewed."
  canonical="https://blog.celsiusherbs.com/dog-ear-infection"
  ogType="article"
  jsonLd={jsonLd}
>
  <DogEarInfectionGuideIsland client:load />
</Layout>
```

**SEO meta rules:**
- `title` ≤ 60 chars. Front-load the primary keyword.
- `description` ≤ 155 chars. Should naturally include primary + 1 secondary keyword.
- `canonical` — full absolute URL. **Must match the actual route** or Google may penalize.
- `ogType="article"` for blog posts (default is `website` for non-blog pages).

---

## Step 7 — Add a 301 redirect (if you're moving an existing post)

If the new post replaces an old URL, add the redirect in `astro.config.mjs`:

```js
redirects: {
  "/old-slug": {
    status: 301,
    destination: "/new-slug",
  },
},
```

---

## Step 8 — Test locally

```bash
npm run dev
```

Visit http://localhost:8080/<your-slug>. Check:

- [ ] Page renders without errors (check browser console)
- [ ] Title shows correctly in browser tab
- [ ] All images load (no broken image icons)
- [ ] Internal links work
- [ ] FAQ accordion expands/collapses
- [ ] Mobile responsive (resize browser to mobile width)

Then verify JSON-LD by viewing page source (Cmd+Option+U) — look for the `<script type="application/ld+json">` block. Paste its contents into https://search.google.com/test/rich-results to confirm Article + FAQPage schemas validate.

---

## Step 9 — Build (catch errors before pushing)

```bash
npm run build
```

If the build fails, fix the error before pushing. Common build failures:

- **Missing image file** — check the import path matches the filename exactly (case-sensitive)
- **Import path typo** — TypeScript will complain at build time even if dev server tolerated it
- **JSON-LD syntax error** — make sure the FAQ array isn't malformed

---

## Step 10 — Commit and push

```bash
git add src/pages/<slug>.astro \
        src/views/blog/<Name>Guide.tsx \
        src/islands/blog/<Name>Guide.tsx \
        src/lib/blog/<slug>-faqs.ts \
        src/assets/blog/<slug>-*.webp

git commit -m "Add <topic> blog post (target kw: <keyword>)"

git push origin main
```

GitHub Actions auto-deploys to Cloudflare Pages. The CI run takes ~90 seconds. Watch progress at:

`https://github.com/<your-org>/<your-repo>/actions`

---

## Step 11 — Verify live

After CI completes (green checkmark), verify:

```bash
curl -I https://blog.celsiusherbs.com/<your-slug>
# Should return: HTTP/2 200
```

Then in browser:
1. Visit https://blog.celsiusherbs.com/<your-slug> — page renders
2. View source — JSON-LD is in `<head>`
3. https://search.google.com/test/rich-results — paste the live URL, confirm Article + FAQPage schemas detected

---

## Checklist (TL;DR)

Before merging a new post:

- [ ] 4 files created: page, island, view, faq
- [ ] All images saved to `src/assets/blog/` as `.webp`, each <250KB
- [ ] `<title>` ≤60 chars with primary keyword
- [ ] `description` ≤155 chars with primary + secondary keywords
- [ ] `canonical` matches the actual route (full URL)
- [ ] FAQ array has 5+ questions
- [ ] JSON-LD `@id` matches the canonical
- [ ] Internal links to relevant PDPs
- [ ] Local `npm run build` passes
- [ ] Local dev page renders correctly
- [ ] Rich Results Test validates Article + FAQPage schemas

---

## Common pitfalls

- **Image renders as `[object Object]`**: The `imageAsUrlPlugin` in `astro.config.mjs` should prevent this. If you see it, make sure your import is from a `.tsx` or `.ts` file (not `.astro`) and is a plain image import (no `?url` suffix).
- **JSON-LD doesn't appear in `<head>`**: Make sure `jsonLd` prop is passed to `<Layout>` and is a valid JS object (not a string).
- **Page returns 404 in production but works locally**: case-sensitivity issue on a file or import path. Re-read the README's "File case sensitivity" section.
- **FAQ accordion not interactive**: missing `client:load` on the island, or the island isn't importing the view correctly.
