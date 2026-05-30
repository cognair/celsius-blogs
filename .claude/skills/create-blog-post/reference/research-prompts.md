# Perplexity Research Prompts

Templates for Stage 2 content research. The skill substitutes `<USER_TOPIC>`, `<PRIMARY_KEYWORD>`, and `<SECONDARY_KEYWORDS>` at runtime.

---

## System prompt

```
You are a veterinary research assistant for the Celsius Herbs blog. Your job is to produce sourced, evidence-based research notes that will become a blog article for pet owners.

Rules:
- Every factual claim must include an inline citation in the format [Source: <publication>, <year>]
- Prioritize authoritative veterinary sources: AVMA, AAHA, vet schools (Cornell, UC Davis, RVC, Purdue), peer-reviewed journals (JAVMA, JFMS), established pet health publications (VCA Hospitals, PetMD, MSD Veterinary Manual)
- Prefer sources from 2020 or later where available
- If evidence for a claim is weak, anecdotal, or contested, state that explicitly — never present weak claims as settled fact
- Stay neutral on commercial products — do not recommend or disparage brands unless citing specific clinical evidence
- Format your output as well-structured Markdown
```

---

## User prompt (substituted at runtime)

```
I'm writing a blog post titled "<USER_TOPIC>" targeting the primary keyword "<PRIMARY_KEYWORD>" (related secondary keywords: <SECONDARY_KEYWORDS>).

Please research and return the following sections in Markdown format, with citations on every factual claim:

## 1. Symptoms
What visible signs can a pet owner recognize at home? Include severity gradient (mild → urgent).

## 2. Causes
Common underlying causes ranked by prevalence. Include risk factors, breed predispositions if relevant, and any environmental triggers.

## 3. Home remedies / at-home management
Evidence-based at-home options. For each, state the strength of evidence (strong / moderate / weak / anecdotal). Flag anything that has known safety concerns.

## 4. When to see a vet
Clear red-flag list. Specific symptoms or escalations that require professional veterinary care, not home treatment.

## 5. Prevention
Practical preventive measures owners can take.

## 6. Common myths
Debunk 2-4 common misconceptions about this topic, with citations to the actual evidence.

## 7. FAQs
List 5-8 frequently asked questions pet owners ask about this topic. For each, give a concise sourced answer (2-4 sentences).

## 8. Authoritative sources used
At the end, list all sources cited above with full citations.

Be thorough but concise. Target ~1500-2500 words of research notes total. Quality of sourcing matters more than length.
```

---

## Notes on use

- The skill loads this file at Stage 2, extracts both prompts, substitutes the placeholders, and sends to OpenRouter's chat-completions endpoint with `perplexity/sonar-pro` as the model.
- The response is saved verbatim to `/tmp/celsius-skill/<slug>/perplexity-research.md` for use in Stage 3 (drafting).
- The drafter (Stage 3) reads these research notes as its primary input, weaves the cited facts into the article naturally, and reproduces citations in the article's References section.
