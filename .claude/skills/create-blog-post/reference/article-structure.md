# Article Structure Template

The EEAT-focused structure Stage 3 follows when drafting. Mirrors the existing `src/views/blog/CatEarInfectionGuide.tsx` post — proven 83/100 SurferSEO score.

---

## Required output structure (in this order)

### 1. Frontmatter metadata block

Before the article body, emit a fenced YAML block with these fields. Stage 6 will parse this to populate the page route's meta tags.

```yaml
---
title: "<Title — ≤60 chars, primary keyword front-loaded>"
description: "<≤155 chars, primary + 1 secondary keyword woven in>"
canonical: "https://blog.celsiusherbs.com/<slug>"
ogType: "article"
ogImage: "https://blog.celsiusherbs.com/og/<slug>.webp"
is_pet_article: <true|false>
primary_keyword: "<from research.json>"
---
```

### 2. Hero / introduction section

- 2–3 paragraphs (~150–200 words)
- Lead with empathy or the problem statement — what's the reader actually worried about?
- Within the first 100 words: a direct answer to the primary query (Google likes this; helps featured-snippet capture)
- End the intro with a hero image placeholder:

```
[IMAGE: hero | brand-consistent hero shot of <subject>, warm natural lighting, no text overlay]
```

### 3. Table of contents (static — not sticky)

A simple bulleted list of all H2 sections coming up. The view component (Stage 6) renders this as a static list, NOT a floating sticky sidebar.

### 4. Body sections (5–8 H2 sections)

Each section:
- ~200–400 words
- H2 follows the pattern: `## Chapter NN — <Section Title>` (matches existing CatEarInfectionGuide voice)
- Include one image placeholder near the start of the section (except for very short sections)
- Mix of paragraphs, bullet lists, callouts, and one comparison/data table per article where appropriate
- Cite Perplexity sources inline: `[Source: <publication>, <year>]` — same format the research notes use

Image placeholder format:

```
[IMAGE: <name> | <descriptive prompt>]
```

The `<name>` becomes part of the filename (`<slug>-<name>.webp`) in Stage 5. Recommended names map to article sections — e.g. `symptoms`, `causes`, `home`, `vet`, `treatment`, `prevention`.

### 5. FAQ section

- 5–8 questions
- Each Q maps to a People Also Ask query if possible
- Stored in `src/lib/blog/<slug>-faqs.ts` (Stage 6 generates this from the FAQ block)
- Format in the draft:

```
## Frequently Asked Questions

**Q: <Question?>**
A: <Concise sourced answer, 2–4 sentences.>

**Q: <Question?>**
A: <Answer.>
```

### 6. References section

List every Perplexity citation as a numbered bibliography.

```
## References

1. <Publication name, year>. <Specific article title>. URL if available.
2. ...
```

### 7. Final CTA

A "Final CTA" section (NOT marked as a numbered chapter) that:
- Frames a clear "next action" for the reader
- Links to the relevant Celsius PDP (pet articles → `/ear-infection-drops` is the safe default; for non-ear topics pick the closest match from the existing PDPs in `src/pages/*.astro`)
- 1 short paragraph + a button link

---

## Required image placeholders

Exactly **5 image tags** must appear in the draft (consistent with all other posts so Stage 5 always generates the same number):

1. `[IMAGE: hero | ...]` — top of article
2. `[IMAGE: <section-1-name> | ...]` — inside section 1 body
3. `[IMAGE: <section-2-name> | ...]` — inside section 2 body
4. `[IMAGE: <section-3-name> | ...]` — inside section 3 body
5. `[IMAGE: <section-4-name> | ...]` — inside section 4 body

If the article has more than 5 sections, do NOT add more images — pick the 4 most visually distinctive sections to illustrate, leave others image-free. If fewer than 5 sections, add a second image to the most visual section.

---

## Keyword placement rules

- **Primary keyword** appears in:
  - The title (frontloaded — first 50 chars)
  - The meta description
  - The first 100 words of the intro
  - At least 2 H2 section headings
  - At least one FAQ question
- **Secondary keywords**: distributed naturally across H2s and body. NO keyword stuffing — readability wins.
- The `[Source: ...]` citation density: 1 citation per 2–3 paragraphs minimum, more for medical claims.

---

## Length

Use `recommended_word_count` from `research.json` as the target. Defaults if unset:
- Quick win / KD < 10: 1500–2000 words
- Authority / KD 10–30: 2000–2500 words
- Hub / KD > 30: 3000+ words

---

## Voice / tone

Match the cat-ear-infection post:
- Direct, plainspoken, empathy for the owner
- No fluff, no AI-isms ("delve into", "in conclusion", "navigate the world of")
- Cited claims (don't speculate or generalize without a source)
- Concrete > abstract (specific symptoms over vague "your pet might not feel well")
- Honest about uncertainty (call out weak evidence when present)
- Light British/American mix is fine (the brand has a UK vet on staff)

---

## What NOT to include

- A separate H1 — the page route handles the title; the body component doesn't render an H1
- Author byline — the `<ReviewedByDrAlex />` block (auto-included in Stage 6 for pet articles) covers attribution
- Generic disclaimers in every paragraph — one short "educational content only" line near the end is enough
- Affiliate-style language ("the best", "top-rated") — stays neutral and editorial
