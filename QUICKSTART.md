# Quick Start — Celsius Herbs Blog Tool

> **For non-technical team members.** Get up and running in 10 minutes. No prior coding experience required.

---

## What this tool does

This is the engine that publishes blog posts to **https://blog.celsiusherbs.com**.

Every blog post you publish becomes a page on that subdomain — fully styled, SEO-ready, and with the same header/footer as the rest of celsiusherbs.com.

---

## One-time setup (do this once on your computer)

### 1. Install Node.js

Download and install **Node.js 22 LTS** from https://nodejs.org/ (the big green "LTS" button).

After installing, open Terminal (Mac) or Command Prompt (Windows) and type:
```
node --version
```
It should print something like `v22.16.0`. If it does, you're good.

### 2. Unzip the project

You should have received a file called `celsiusherbs-blog-framework.zip`.

1. Double-click to unzip it.
2. You'll get a folder called `celsius-astrolovable`.
3. Put this folder somewhere easy to find — e.g. your Desktop.

### 3. Open Terminal in that folder

- **Mac**: right-click the `celsius-astrolovable` folder in Finder → "New Terminal at Folder"
- **Windows**: Shift+right-click → "Open PowerShell window here"

### 4. Set up your Shopify connection

In Terminal, type:
```
cp .env.example .env
```

This makes a copy of the template settings file.

Now open the new `.env` file in any text editor (TextEdit, Notepad, VS Code) and fill in the two real values from Shopify Admin:

```
PUBLIC_SHOPIFY_STORE_DOMAIN=celsiusherbs.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=<the_real_token_from_shopify_admin>
```

Save and close.

### 5. Install dependencies (one time, ~30 seconds)

Back in Terminal:
```
npm install
```

You'll see lots of text scroll by. When it stops and shows your prompt again, you're done.

### 6. Run the site locally

```
npm run dev
```

After a few seconds you'll see:
```
┃ Local    http://localhost:4321/
```

Open that URL in your browser. **You should see the Celsius Herbs storefront.** The blog post lives at http://localhost:4321/cat-ear-infection

Press `Ctrl+C` in Terminal when you want to stop the dev server.

---

## How to publish a new blog post

The full step-by-step is in **`docs/ADDING-A-BLOG-POST.md`**, but here's the TL;DR:

1. **Copy** the cat-ear post as your template. You need to copy 4 files (the playbook tells you exactly which).
2. **Rename** the new files to your blog slug (e.g. `dog-ear-infection`).
3. **Replace** the content inside — heading, paragraphs, images, FAQs.
4. **Test locally** — `npm run dev` and visit http://localhost:4321/your-new-slug
5. **Push to GitHub** — commit + push (one of your developers or the doc shows how).
6. **Wait ~90 seconds** — it auto-deploys to https://blog.celsiusherbs.com/your-new-slug

**That's it.** No manual upload, no FTP, no Shopify dashboard. Push to GitHub = live.

---

## Most common questions

### "How do I see what I'm changing without breaking the live site?"

When you run `npm run dev` on your computer, that's a *local* preview only. Nothing you do affects the live site at https://blog.celsiusherbs.com until you `git push`. So play around freely — you can't break anything until you push.

### "How do I add an image?"

1. Put the image file in `src/assets/blog/` — name it descriptively (e.g. `dog-ear-hero.webp`).
2. In your post's View file, import it: `import heroImage from "@/assets/blog/dog-ear-hero.webp";`
3. Use it: `<img src={heroImage} alt="A descriptive caption" />`

**Image size tip**: keep each image under 250KB. Use https://squoosh.app/ to compress before saving.

### "I changed something and the dev preview isn't updating"

Press `Ctrl+C` in the Terminal where dev is running, then re-run `npm run dev`. That clears the cache.

### "I pushed to GitHub but the live site didn't update"

Open https://github.com/Etherwise/celcius-herbs-blogs/actions in your browser. If you see a red X, the deploy failed — click into it for the error message. If you see a yellow circle, it's still running. Green checkmark = deployed.

### "The instructions in `docs/ADDING-A-BLOG-POST.md` are too technical"

Watch the Loom walkthrough first — that shows everything visually. Once you've seen it once, the doc makes more sense.

### "Something's broken, please help"

Look at **`docs/DEPLOYMENT.md` → Common CI failures** section. 90% of issues are covered there. If still stuck, send a Slack/email to the developer.

---

## Files you'll actually touch

You only ever need to edit files in **one of these places**:

```
src/pages/             ← create a new .astro file here per blog post
src/views/blog/        ← create the post's main React component here
src/islands/blog/      ← create the 5-line wrapper here
src/lib/blog/          ← create the FAQ data file here
src/assets/blog/       ← put images here
```

Everything else (config files, helpers, etc.) — **don't touch.** If you think you need to, ask the developer first.

---

## What to do next

1. Read **`docs/ADDING-A-BLOG-POST.md`** for the full playbook
2. Watch the Loom walkthrough (link in the email)
3. Try creating a test post locally — don't push it, just see if you can make it work in `npm run dev`
4. When you're comfortable, write your first real post and push to GitHub

That's it. Welcome to the tool.

---

## Setting up the AI blog skill (recommended workflow)

The framework includes a **Claude Code skill** that automates the whole blog creation pipeline. Open this folder in Claude Code, then say something like:

> "Use create-blog-post to write a post about cat ear mites"

…and the skill runs through 7 stages: keyword research → content research → drafting → SurferSEO pause → image generation → file scaffolding → preview deploy. The only thing you do by hand is the Surfer optimization step.

### One-time setup (5 minutes)

You need 2 API keys (Ahrefs is already configured from the existing setup).

**1. OpenRouter API key** — content research
- Sign up: https://openrouter.ai/keys
- Pay-as-you-go, ~$0.01–0.05 per blog post
- The skill calls `perplexity/sonar-pro` through OpenRouter

**2. Gemini API key** — image generation
- Get one: https://aistudio.google.com/apikey
- Pay-as-you-go, ~$0.10–0.20 per blog post (5 images)
- The skill uses `gemini-3.1-flash-image-preview` (a.k.a. NanoBanana)

**3. Add them to `.env`** (next to the existing Shopify keys):
```
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=AIza...
```

**4. Install Pillow** (Python library — used for JPEG→WebP conversion in Stage 5):
```bash
python3 -m pip install Pillow
```

That's it. Restart Claude Code if it was open, then trigger the skill.

### How long does one post take?

| Stage | Who | Time |
|---|---|---|
| Stages 1–3 (research + draft) | Skill | ~3–5 min |
| Stage 4 (Surfer pass) | You | ~10–15 min |
| Stages 5–7 (images + scaffold + preview deploy) | Skill | ~5–8 min |
| **Total per post** | | **~25 minutes** |

Compare to the ~13 hours the first cat-ear-infection post took manually.

### When something goes wrong

- The skill saves every intermediate output to `/tmp/celsius-skill/<your-slug>/` — research, draft, images, build logs. Inspect anything there.
- Build failures at Stage 6 always halt the pipeline (the skill won't deploy a broken post).
- If Stage 5 generates a weird image, just tell Claude *"regenerate the hero image"* — it'll re-roll only that one.
- The preview branch (`preview/<slug>`) is throwaway. If you abandon a post, delete the branch on GitHub. Nothing's published until you merge to main.
