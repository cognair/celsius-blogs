# Loom Walkthrough Script

> ~7-minute screen recording. Read this aloud while doing the actions on screen. The goal: a non-technical team member should be able to publish a new blog post after watching this.

---

## Setup before recording

- Have these tabs open in Chrome:
  1. https://blog.celsiusherbs.com/cat-ear-infection (the live blog post)
  2. https://github.com/Etherwise/celcius-herbs-blogs (the GitHub repo)
  3. https://github.com/Etherwise/celcius-herbs-blogs/actions (the deploy logs)
- Have the `celsius-astrolovable` folder open in Finder
- Have VS Code (or any editor) open with the folder loaded
- Have a Terminal window open in the folder
- Make sure the dev server is NOT currently running (we'll start it during recording)

Record in 1080p, 16:9, with mic on. Test audio briefly before starting.

---

## Section 1 · What this is (45 seconds)

> "Hi team — this is a quick walkthrough of the Celsius Herbs blog tool. It's what publishes posts to blog.celsiusherbs.com. By the end of this video you'll know how to set it up on your computer, write a new post, and push it live. Should take about 7 minutes."

**[Show the live site]** — switch to the cat-ear-infection page tab.

> "This page you're looking at right now — Cat Ear Infection — was published using this tool. It has the same header and footer as the main celsiusherbs.com site, full SEO meta tags, and structured data for Google. Everything's automated — once you write the post and push to GitHub, it goes live in about 90 seconds."

---

## Section 2 · The folder you'll be working in (60 seconds)

**[Switch to Finder / VS Code, show the folder structure]**

> "Here's the project folder you'll be working in. Most of it you'll never touch — the only things you'll ever edit live in five places, and I've written them down at the bottom of the QUICKSTART file."

**[Open QUICKSTART.md, scroll to "Files you'll actually touch"]**

> "These five folders: pages, views/blog, islands/blog, lib/blog, and assets/blog. That's it. Every blog post creates exactly four files plus a few images. Everything else — configuration, deployment, the framework code — leave it alone."

**[Show README.md]**

> "If you want the full architecture explanation, it's all in the main README. For day-to-day work, you only need the QUICKSTART and the ADDING-A-BLOG-POST guide in the docs folder."

---

## Section 3 · One-time setup (90 seconds)

**[Switch to Terminal]**

> "Let me walk through the one-time setup. If you've already done this, skip ahead."

> "First, you need Node.js 22. If you don't have it, go to nodejs.org and download the LTS version. Once installed, you can confirm by typing:"

```
node --version
```

> "Should show v22 something."

> "Next, unzip the project folder I sent you, and open Terminal inside that folder. You can right-click the folder in Finder → New Terminal at Folder."

> "Copy the env template by typing:"

```
cp .env.example .env
```

**[Show .env in the editor]**

> "Open the .env file in any editor and fill in the Shopify store domain and storefront token. These come from Shopify Admin — there's a link in the comments inside the file. If you don't know what these are, ask your developer to fill them in once."

> "Then install dependencies:"

```
npm install
```

> "This takes about 30 seconds. While it runs, the next step is starting the local preview."

---

## Section 4 · Running the local preview (60 seconds)

```
npm run dev
```

**[Wait for Astro to print the localhost URL]**

> "Once you see this URL, open it in your browser."

**[Open localhost:4321/cat-ear-infection]**

> "This is your local preview. It looks exactly like the live site, but it's running on your computer. Anything you change in the source files updates here automatically."

> "Important: this preview is private to your computer. Nothing you do here affects the live site until you push to GitHub. So you can experiment freely."

> "Press Control-C in Terminal to stop the preview when you're done."

---

## Section 5 · Writing a new blog post (3 minutes)

**[Open ADDING-A-BLOG-POST.md, scroll through it slowly]**

> "The detailed playbook is here. Read it once end-to-end before you write your first post — it explains every step. I'll do a quick demo."

> "Every blog post is 4 files. Use the cat-ear-infection post as the template. Let's say I want to add a post called 'Dog Ear Infection'."

**[In VS Code, navigate to src/pages/]**

> "Step 1: copy `src/pages/cat-ear-infection.astro` and rename it `dog-ear-infection.astro`."

**[Show the file, edit the title and description]**

> "Inside, change the title to 'Dog Ear Infection: ...', description, and canonical URL. Match the new slug everywhere — `dog-ear-infection`."

**[Navigate to src/lib/blog/]**

> "Step 2: same with the FAQ file. Copy `cat-ear-infection-faqs.ts`, rename to `dog-ear-infection-faqs.ts`, and inside, rename the exported function and the FAQ array. Update the `@id` URL to match your new slug."

**[Navigate to src/views/blog/]**

> "Step 3: copy the view component, `CatEarInfectionGuide.tsx` becomes `DogEarInfectionGuide.tsx`. This is where the actual blog content lives — the headings, paragraphs, images. This is what you'll spend the most time editing."

**[Navigate to src/islands/blog/]**

> "Step 4: copy the island wrapper. It's only 5 lines — change the import path."

**[Show src/assets/blog/]**

> "Step 5: add your images here. Name them descriptively — `dog-ear-hero.webp`, `dog-ear-symptoms.webp`, and so on. Keep each one under 250KB. Use squoosh.app to compress them first."

**[Refresh the local preview at localhost:4321/dog-ear-infection]**

> "Once all 4 files exist, your new post is at localhost:4321/dog-ear-infection. Refresh — it should show up. If it errors, the dev server console shows what went wrong."

---

## Section 6 · Pushing to live (90 seconds)

**[Open Terminal again]**

> "Once your post looks right locally, you push it to GitHub and it auto-deploys."

```
git add .
git commit -m "Add dog ear infection blog post"
git push origin main
```

**[Switch to GitHub Actions tab]**

> "Watch this page — every push triggers a build. You'll see a yellow circle while it's running. About 90 seconds later it turns into a green check, and your post is live."

**[Once green, click through]**

> "If it ever turns into a red X, click into it — there's an error message that tells you what broke. Most of the time it's a typo or a missing file. The DEPLOYMENT.md doc has solutions for the most common errors."

> "After the green check, your post is live at blog.celsiusherbs.com/your-new-slug."

---

## Section 7 · Closing (30 seconds)

> "Three things to remember:"

> "**One** — only edit files in those five folders. Everything else, leave alone."

> "**Two** — `npm run dev` is your private preview. Push to GitHub when ready, and you'll see the green check in Actions in about 90 seconds."

> "**Three** — when you hit a wall, check `DEPLOYMENT.md → Common CI failures` first. 90% of issues are covered there."

> "Any questions, send me a Slack. Good luck — happy publishing."

**[End recording]**

---

## Post-recording

- Trim any awkward starts/ends
- Add a callout box at the top with the title "Celsius Herbs Blog Tool — Full Walkthrough"
- Generate the Loom shareable link
- Drop the link in:
  - The repo README under a "Walkthrough Video" section
  - The Slack channel where the team will operate this
  - The email reply to Rick
