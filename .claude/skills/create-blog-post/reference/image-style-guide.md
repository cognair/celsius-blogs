# Celsius Herbs — Image Style Guide

> Used by NanoBanana / Gemini 3.1 Flash Image Preview to generate cohesive brand imagery. Per Video 1 of Rick's reference workflow ("without an image style guide, the images will look crap"). Reference this doc in every image-generation prompt so the output stays on-brand across pages.

## Brand identity in one line

**Apothecary-meets-veterinary** — herbal wellness for pets, presented with the visual quietness of a luxury skincare brand. Calm, considered, never cartoonish or stocky. The pet is the patient, not the product.

## Reference: existing PDP visual language

Lovable-built imagery already on the Astro repo establishes the look:
- `ear-product-bottle.png` — product on warm cream backdrop, soft directional light
- `ear-pdp-flatlay.jpg` — botanical ingredients (olive leaf, chamomile) artfully arranged
- `ear-pdp-application.jpg` — calm pet, gentle hand interaction, natural light
- `ear-vet-portrait.jpg` — editorial portrait, shallow DOF, warm tones
- `ing-olive.jpg` / `ing-chamomile.jpg` / `ing-turmeric.jpg` / `ing-neem.jpg` — single ingredient, macro composition

New images must match this register exactly.

## Photography prompt parameters

When writing a NanoBanana prompt, include these specifics:

| Parameter | Value |
|---|---|
| Camera | Imitating a 35mm film camera (e.g. Leica M6 or Pentax 67) |
| Lens | 50mm or 85mm prime — never wide-angle |
| Aperture | f/2.0–f/2.8 — shallow DOF, soft background blur |
| Lighting | Natural window light, golden hour, indirect — never flash, never overhead fluorescent |
| Color grade | Warm cream, soft peach (#F4E4D1 family), muted sage, ink-deep brown for shadows |
| Background | Cream linen, unfinished wood, raw plaster, or out-of-focus botanical |
| Composition | Negative space-forward, off-center subject, editorial-magazine style |
| Subject focus | The pet's calm presence, OR a single ingredient in macro, OR a hand-with-pet interaction |

## Color palette (required — feed into every prompt)

- **Peach cream**: warm, soft `#F4E4D1` — primary background tone
- **Ink deep**: rich warm brown `#3A2F26` — text/shadow
- **Accent gold**: muted ochre `#B89B6A` — highlights
- **Sage**: dusty green `#A6B59A` — botanical accents
- **Cream white**: paper-white `#FAF6EE` — backdrops

Never: bright synthetic blues, neon greens, primary red. No saturated stock-photo colors.

## What to ALWAYS include

- Natural light, single source
- Calm subject — the pet looks healthy, content, not in distress
- Ingredient/botanical present somewhere in frame (olive leaf, chamomile, turmeric root, neem)
- Soft focus or warm grain to avoid the AI-generated digital sharpness

## What to NEVER include

- The product bottle in body images (only on PDP hero)
- Multiple pets in the same frame
- Stock-photo-clean perfection — we want editorial naturalism
- Overt branding, packaging text, logos
- Aggressive close-ups of infected ears, discharge, blood (the topic is medical but the imagery stays serene — readers are in a stressful state and the visuals should calm, not intensify)
- Any human face fully visible — hands and torsos OK, prevents identifiability issues
- Tea tree oil, eucalyptus, or other phenolic plants known to be cat-toxic
- Cartoon, illustration, or 3D-rendered styles

## Output format (required)

- **WebP** format only — never PNG or JPG (per Video 1: "WebP is just as good in terms of quality, but like 10 times lighter… loading time speed is a core component of SEO")
- 1024×1024 for hero / square cards
- 1024×1536 for portrait
- 1536×1024 for landscape body images

## Per-page guidance

### Cat Ear Infection blog
- Hero: tabby or shorthair cat resting peacefully on cream linen, soft afternoon light, suggesting calm relief — not in distress
- Symptoms section: macro of a cat's ear from a respectful distance (canal not visible), warm tones
- Causes section: botanical flatlay — chamomile flower, olive leaf, neem sprig on raw wood
- Home treatment section: hand placing a single drop near (not in) cat's ear, soft focus on the cat's eye expression
- Vet warning section: stethoscope on cream textile, no human face

### Future PDP imagery (when Rick's team scales)
- Hero: product bottle, cream backdrop, single olive leaf in soft focus
- Application: hand-pet interaction, no anxiety on pet's face
- Ingredients: macro botanicals, single subject, generous negative space

## Prompt template

```
Editorial photograph in the style of a modern apothecary brand. [SUBJECT] photographed with a 50mm prime lens at f/2.2, shot on 35mm film with warm Kodak Portra grain. Natural window light from the left, golden hour, no flash. Background: [BACKGROUND from palette above]. Color palette: warm peach cream (#F4E4D1), ink deep brown (#3A2F26), muted sage. Composition: off-center subject, generous negative space, magazine spread feel. Mood: calm, considered, premium wellness — never clinical, never cartoonish, never stocky. WebP format, 1024×[H]. No text, no logos, no packaging visible.
```

Replace `[SUBJECT]` and `[BACKGROUND]` per image.
