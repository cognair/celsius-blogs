/**
 * Single source of truth for Cat Ear Infection blog FAQs.
 *
 * Imported in two places:
 *  - `src/views/blog/CatEarInfectionGuide.tsx` — renders the visual accordion.
 *  - `src/pages/blog/cat-ear-infection.astro` — builds Schema.org FAQPage JSON-LD.
 *
 * Mirrors the PDP pattern in `@/lib/pdp/ear-infection-faqs`.
 */
export type Faq = { q: string; a: string };

export const CAT_EAR_INFECTION_FAQS: Faq[] = [
  {
    q: "How can I tell if my cat has an ear infection at home?",
    a: "The clearest signs are persistent head-shaking, scratching at one ear, a sour or yeasty odor, dark waxy or pus-like discharge, redness or swelling inside the canal, and a head tilt toward the affected side. A healthy cat ear is light pink, dry, and almost odorless inside the visible canal opening. If you see two or more of those signs lasting more than 48 hours, treat it as a likely infection and start a gentle natural cleaner. If your cat resists touch or shows balance problems, see a vet — that points to deeper canal or middle-ear involvement.",
  },
  {
    q: "Can a cat ear infection clear up on its own?",
    a: "Mild cases caught in the first day or two sometimes resolve, especially if the trigger (allergy flare, foreign material, water exposure) is removed. But the warm, moist, hair-lined cat ear canal is also a near-perfect environment for yeast and bacteria, and untreated infections frequently progress to chronic otitis or migrate deeper into the ear. The conservative recommendation is to start treatment within 48 hours of clear symptoms — either at-home with a gentle herbal antimicrobial, or with a vet if symptoms are moderate to severe.",
  },
  {
    q: "What is the safest home remedy for a cat ear infection?",
    a: "Plant-based antimicrobials with a long history of veterinary use — particularly olive leaf extract (oleuropein), chamomile, neem, and karanja oil — are the safest at-home options. Avoid hydrogen peroxide, alcohol, vinegar concentrates, and tea tree oil: each is widely used in dog forums but is either irritating or toxic to cats. Cats are uniquely sensitive to phenols and essential oils, so any product applied near the ear canal must be cat-safe. Always patch-test on the outer ear flap first.",
  },
  {
    q: "How is a cat ear yeast infection different from a bacterial one?",
    a: "Yeast infections (most often Malassezia pachydermatis) typically produce dark brown waxy buildup, a sweet musty odor, and steady itching without much pain. Bacterial infections (commonly Staphylococcus or Pseudomonas) produce yellow-green pus, a sharper foul odor, and visible pain when the ear is touched. Many chronic cases are mixed — yeast and bacteria both — which is why a broad-spectrum botanical formula tends to outperform a single-target prescription drop in recurring cases.",
  },
  {
    q: "Are cat ear infections contagious to other cats or dogs?",
    a: "Standard yeast and bacterial ear infections aren't directly contagious. Ear mites — sometimes confused with infections — are highly contagious between cats, and to dogs through close contact. If multiple pets in the home are scratching their ears, treat it as ear mites until proven otherwise and isolate the most affected animal until you've started treatment.",
  },
  {
    q: "When should I stop treating at home and call the vet?",
    a: "Call a vet within 24 hours if you see any of: blood or active bleeding, your cat losing balance or tilting hard to one side, swelling that closes the canal opening, lethargy or loss of appetite, fever (warm dry nose, ears hot to touch), or any sign of pain when chewing. Also call if you've used a home treatment consistently for 7–10 days without clear improvement — persistent infection often means the eardrum is involved or there's an underlying allergy/polyp driving recurrences.",
  },
];

/**
 * Build Schema.org FAQPage JSON-LD from the blog FAQ array.
 * Reference: https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function buildCatEarInfectionFaqJsonLd(
  faqs: Faq[] = CAT_EAR_INFECTION_FAQS,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/**
 * Schema.org Article JSON-LD for the cat ear infection blog page.
 * Helps the page surface in news/article SERP features.
 */
export function buildCatEarInfectionArticleJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cat Ear Infection: Symptoms, Causes & Natural Treatment",
    description:
      "Field guide to cat ear infections: symptoms, yeast vs bacterial vs mites, safe home treatment with natural ingredients, and when to see a vet.",
    author: {
      "@type": "Organization",
      name: "Celsius Herbs Veterinary Advisory Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Celsius Herbs",
      logo: {
        "@type": "ImageObject",
        url: "https://celsiusherbs.com/cdn/shop/files/celsius-herbs-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://blog.celsiusherbs.com/cat-ear-infection",
    },
  };
}
