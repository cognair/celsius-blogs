# AI Blog Skill — How to Use

> One-instruction blog publishing for the Celsius Herbs Astro framework. This doc is for your content team — non-technical-friendly.

---

## What this is

A Claude Code skill (`.claude/skills/create-blog-post/`) that automates the entire blog-publishing pipeline.

Your team opens the framework folder in Claude Code, says something like:

> "Create a new blog post about cat ear mites"

…and a 7-stage pipeline runs:

1. **Keyword research** (Ahrefs — finds the best target keyword, related terms, word count)
2. **Content research** (Perplexity — pulls sourced facts with citations from vet/medical sources)
3. **Drafting** (Claude writes the full ~2,000-word article in markdown)
4. **PAUSE for SurferSEO** (the only manual step — you optimize the draft, paste it back)
5. **Image generation** (Gemini generates 5 brand-consistent images)
6. **File scaffolding** (all 4 framework files created, build validated)
7. **Preview deploy** (pushes a preview branch, gives you a shareable Cloudflare URL)

**Total time per post:** ~25–30 minutes (most of that is the manual Surfer pass).
**Cost per post:** ~$0.25 in API spend.

The skill **never auto-publishes**. Stage 7 stops at a preview URL for human review. You (or Dr. Alex) review, approve, then merge the preview branch to production.

---

## One-time setup (5 minutes)

You need 3 API keys total. **One is already configured** (Ahrefs). The other two you'll provide.

### 1. Open the framework folder in Claude Code

Whatever way you usually launch Claude Code — make sure it's pointed at this folder:

```
/path/to/celsius-astrolovable/
```

### 2. Get the two API keys

**OpenRouter** (for the Perplexity research call):
- Sign up: <https://openrouter.ai/keys>
- Pay-as-you-go billing, no monthly minimum
- Cost: ~$0.01–0.05 per blog post

**Gemini** (for the image generation):
- Get one here: <https://aistudio.google.com/apikey>
- Pay-as-you-go billing
- Cost: ~$0.10–0.20 per blog post (5 images each)

### 3. Add the keys to `.env`

The framework root has a `.env` file (it's gitignored — never committed). Open it and add:

```
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=AIza...
```

Save. That's the API setup done.

### 4. Install Pillow (one Python library — required for image conversion)

In Terminal at the framework root:

```bash
python3 -m pip install Pillow
```

If you see `Successfully installed Pillow-...`, you're good.

### 5. Make sure your existing Shopify keys are still in `.env`

The skill leans on the framework's Shopify Storefront integration for header/footer. The `.env` should already have these from the original handoff:

```
PUBLIC_SHOPIFY_STORE_DOMAIN=celsiusherbs.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=...
```

If they're missing, copy them from `.env.example` and fill in real values.

---

## Using the skill — your first post

### Step 1: Open Claude Code in this folder

Start a new Claude Code session in the framework folder.

### Step 2: Type the prompt

In the chat, type something like:

```
Use the create-blog-post skill to write a post about [topic]
```

Or even simpler — Claude will auto-trigger the skill if you say:

- "Create a new blog post about probiotics for dogs"
- "Write a blog about dog acid reflux home remedies"
- "Add a post on cat dental care"

The skill will activate. Claude will announce "Using the create-blog-post skill" and start Stage 0.

### Step 3: Walk through the stages

You'll see Claude work through each stage with status messages. Most stages run on their own. **The one stage you have to do is Stage 4** — SurferSEO optimization.

When Stage 4 hits, Claude pauses and prints something like this:

```
─────────────────────────────────────────────
SURFERSEO STEP — MANUAL

The draft is ready at:
  /tmp/celsius-skill/probiotics-for-dogs/draft.md

Steps:
  1. Open SurferSEO Content Editor: https://app.surferseo.com
  2. Create a new Content Editor query targeting: "probiotics for dogs"
  3. Open draft.md, copy its full contents
  4. Paste into Surfer's editor
  5. Optimize until score ≥80
  6. Copy the optimized text
  7. Paste it back here as your next message
─────────────────────────────────────────────
```

What you actually do:

1. **Open Terminal**, run: `open /tmp/celsius-skill/[your-slug]/draft.md`
   (Or just paste the path into your file browser.)
2. **Copy** the whole file (Cmd+A, Cmd+C).
3. **Go to SurferSEO Content Editor** in your browser.
4. **Create a new query** for the keyword Claude mentioned (e.g. "probiotics for dogs").
5. **Paste your draft** into Surfer's editor.
6. **Apply Surfer's suggestions** — add missing terms where they fit naturally. Aim for a score of 80+.
7. **Copy the optimized text** out of Surfer.
8. **Paste it back into Claude Code** as your next message.

Claude saves your paste and continues to Stage 5 (image generation).

### Step 4: Review the preview URL

When the skill finishes, you'll get a message like:

```
─────────────────────────────────────────────
✓ STAGE 7 COMPLETE — PREVIEW LIVE

Preview URL: https://preview-probiotics-for-dogs.deploy-celsius-herbs-dev.pages.dev/probiotics-for-dogs
Branch:      preview/probiotics-for-dogs

NEXT STEPS (human):
  1. Open the preview URL above in a browser
  2. Share with Dr. Alex for clinical review
  3. If approved → merge to main → production deploys
─────────────────────────────────────────────
```

The URL is real, public, and shareable. Send it to Dr. Alex. Pull it up on your phone. Have your team click around.

### Step 5: Publish (or iterate)

**If it looks good:**
- Merge `preview/[slug]` to `main` on GitHub (one-click in the GitHub UI, or via Terminal: `git checkout main && git merge preview/[slug] && git push`)
- Auto-deploy ships it to `https://blog.celsiusherbs.com/[slug]` in about 90 seconds

**If you want changes:**
- Edit the source files on the preview branch
- Push — the *same* preview URL re-deploys
- No need to re-run the skill from the start

**If you want a completely fresh attempt:**
- Delete the preview branch (`git push origin --delete preview/[slug]`)
- Re-run the skill from the start

---

## What the skill does NOT do

Setting expectations:

- **Does NOT auto-publish.** The skill stops at the preview URL. Going live requires you to manually merge the preview branch to `main`.
- **Does NOT generate the SurferSEO score.** Surfer's content editor is browser-only — no API. You optimize in the browser, paste back. This is the one manual step in the pipeline.
- **Does NOT replace Dr. Alex's review.** For pet articles, the `<ReviewedByDrAlex />` block is auto-included, but his actual sign-off on the content is human work.
- **Does NOT touch the existing live posts** (e.g. cat-ear-infection). New posts only.
- **Does NOT modify framework configuration files** (`astro.config.mjs`, `package.json`, etc.).
- **Does NOT auto-pick the topic.** You tell it what to write about.

---

## Common questions

### "How long does it take?"

| Stage | Time |
|---|---|
| Stages 1–3 (research + draft) | ~5 minutes (skill runs on its own) |
| Stage 4 (Surfer pass) | ~10–15 minutes (manual) |
| Stages 5–7 (images + scaffold + preview) | ~5–8 minutes (skill runs on its own) |
| **Total** | **~25–30 minutes per post** |

For reference: the original cat-ear-infection post took ~13 hours to produce manually.

### "How much does it cost?"

Per post: **~$0.25 in API spend** (OpenRouter + Gemini, billed to your accounts). Ahrefs usage counts against your existing subscription (~100 units per post, negligible).

### "What if an image looks wrong?"

Tell Claude: *"Regenerate the hero image with a softer background"* (or any other description). It will re-roll only that one image, keep the rest, and continue.

### "What if Claude makes a content mistake?"

Two options:
- **Small fix:** edit the generated file directly (`src/views/blog/[YourTopic]Guide.tsx`), commit, push — the preview URL re-deploys.
- **Big rewrite:** delete the preview branch, re-run the skill with more specific guidance in your prompt.

### "What if the skill fails partway through?"

Every stage saves its output to `/tmp/celsius-skill/[your-slug]/`. If something breaks, the files from earlier stages are still there. Tell Claude *"continue the skill from where it stopped"* and it can resume.

### "What if I don't want to use SurferSEO?"

You can skip it — tell Claude *"skip the Surfer stage"* at the Stage 4 pause. The skill copies the un-optimized draft forward. You'll lose the SEO score boost but the post still ships. (We recommend using Surfer — the score improvements are real.)

### "Can I do multiple posts in parallel?"

Yes — each post gets its own preview branch (`preview/[slug]`). They don't conflict. You can have 3 preview URLs live at once for the team to review side-by-side.

### "How do I delete a post I started but don't want to publish?"

```bash
git push origin --delete preview/[the-slug]
git branch -D preview/[the-slug]
```

The Cloudflare preview URL goes away within ~5 minutes.

---

## When the skill is the wrong tool

The skill is built for **net-new blog posts** in the existing Astro framework. It's not the right tool for:

- **Editing an existing live post** → just edit the file directly in `src/views/blog/[Topic]Guide.tsx`, push, deploys.
- **Non-blog pages** (product pages, About, Contact) → those have their own templates in `src/views/pdp/` and aren't part of this skill.
- **Migrating content from elsewhere** → the skill researches and writes new content, not import.

---

## What to do if you get stuck

1. **Check `/tmp/celsius-skill/[your-slug]/`** — every intermediate output is saved there. The `build.log` file shows exactly what failed if Stage 6 broke.
2. **Read the error message** — the skill prints clear errors with pointers (e.g. "missing PERPLEXITY_API_KEY → check .env").
3. **Ask Claude in the same conversation** — Claude can usually diagnose and fix from context.
4. **Last resort:** delete the preview branch and re-run from scratch.

---

## Pipeline architecture (for the technically-curious)

The skill is a single markdown file (`SKILL.md`) plus 3 reference files (style guide, article structure, research prompts). All API calls are inline `Bash` commands — no separate scripts to maintain.

| Stage | Tool | What it does |
|---|---|---|
| 0 | (none) | Validates `.env`, Ahrefs MCP, git tree |
| 1 | Ahrefs MCP | Keyword overview + matching terms → `research.json` |
| 2 | OpenRouter (Perplexity sonar-pro) | Sourced research with citations → `perplexity-research.md` |
| 3 | Claude itself | Drafts the article using research + structure template → `draft.md` |
| 4 | Manual / SurferSEO | User optimizes draft externally → `draft-optimized.md` |
| 5 | Gemini 3.1 Flash Image Preview | Generates 5 brand-styled WebP images → `src/assets/blog/[slug]-*.webp` |
| 6 | Claude with templates | Scaffolds 4 framework files mirroring cat-ear-infection structure |
| 7 | GitHub Actions + Cloudflare Pages | Pushes preview branch → preview URL |

Each stage's output feeds the next. The 8 hard guarantees at Stage 6 (slug consistency, image-imports parity, build validation, etc.) prevent broken builds from ever reaching the preview deploy.

---

## Quick reference card

```
SETUP (once)
  ☐ Add OPENROUTER_API_KEY to .env
  ☐ Add GEMINI_API_KEY to .env
  ☐ python3 -m pip install Pillow

NEW POST
  1. Open Claude Code in framework folder
  2. "Create a blog post about [topic]"
  3. Wait for Stage 4 SURFERSEO STEP
  4. Optimize in Surfer, paste back
  5. Wait for preview URL
  6. Review → share with Dr. Alex → approve → merge to main
```

That's the whole loop. Good luck — and ship.
