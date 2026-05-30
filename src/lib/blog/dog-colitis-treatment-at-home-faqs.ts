/**
 * Single source of truth for Dog Colitis Treatment at Home blog FAQs.
 *
 * Imported in two places:
 *  - `src/views/blog/DogColitisTreatmentAtHomeGuide.tsx` — renders the visual accordion.
 *  - `src/pages/dog-colitis-treatment-at-home.astro` — builds Schema.org FAQPage JSON-LD.
 */
export type Faq = { q: string; a: string };

export const DOG_COLITIS_TREATMENT_AT_HOME_FAQS: Faq[] = [
  {
    q: "How long does dog colitis treatment at home usually take to work?",
    a: "Most mild, acute colitis episodes in otherwise healthy adult dogs improve noticeably within 24–48 hours on the bland diet protocol with supportive treatments. Mild acute cases often settle within a few days, but chronic diarrhea or recurrent signs last longer and need a veterinary workup. Full return to normal stools often takes 3–5 days as you transition back to regular food. If you see no improvement after 48 hours, contact your vet.",
  },
  {
    q: "Can I give my dog Pepto-Bismol or Imodium for colitis?",
    a: "Neither is recommended without veterinary guidance. Pepto-Bismol contains salicylate, which can cause side effects in dogs. Imodium (loperamide) can mask symptoms, cause severe reactions in certain breeds with the MDR1 gene mutation (Collies, Australian Shepherds, Shetland Sheepdogs), and delay diagnosis of a serious underlying condition.",
  },
  {
    q: "What can I feed a dog with colitis besides chicken and rice?",
    a: "Plain boiled turkey breast, low-fat cottage cheese, and scrambled eggs (no butter or oil) are alternatives that many vets use as bland diet options. Plain white potato or sweet potato (cooked, plain) can substitute for rice. For a dog dealing with chronic colitis, an easily digestible novel protein diet may be a better long-term option than repeating chicken-and-rice cycles. Avoid anything high in fat or fibre during the acute phase.",
  },
  {
    q: "Is pumpkin or slippery elm better for dog colitis?",
    a: "They work differently. Pumpkin's soluble fibre absorbs excess water in the colon, helps regulate movement through the intestinal tract, and bulks stool. Slippery elm coats and soothes the gut lining; its mucilaginous properties are the main mechanism rather than strict pharmacological anti-inflammatory action. Both can be used together safely — there is no known interaction between them.",
  },
  {
    q: "Can stress alone cause colitis in dogs?",
    a: "Yes. Stress colitis is well-recognised in veterinary medicine. Events like boarding, rehoming, travel, household changes, or loud events (fireworks, construction) can trigger transient inflammation of the colon without any dietary trigger. The mechanism involves stress hormones altering gut motility and mucosal immune defenses.",
  },
  {
    q: "How do I know if my dog's colitis is chronic rather than acute?",
    a: "The standard veterinary definition is symptoms lasting three weeks or longer, or symptoms that recur regularly — more than three to four episodes per year. Chronic colitis should always be investigated. Common causes include food intolerance, inflammatory bowel disease, parasites, and bacterial infections, all of which require specific treatment beyond home supportive care.",
  },
  {
    q: "My dog had blood in his stool. Do I need to go to the vet today?",
    a: "A small streak of fresh red blood alongside mucus in an otherwise bright dog with a clear dietary trigger can be monitored at home for 12–24 hours with the protocols in this guide. However, any of the following means call today: more than a streak of blood, dark or tarry blood, blood combined with vomiting, lethargy, severe abdominal discomfort, loss of appetite, or a high-risk dog (puppy, senior, small breed, immunocompromised).",
  },
];

/**
 * Build Schema.org FAQPage JSON-LD from the blog FAQ array.
 */
export function buildDogColitisTreatmentAtHomeFaqJsonLd(
  faqs: Faq[] = DOG_COLITIS_TREATMENT_AT_HOME_FAQS,
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
 * Schema.org Article JSON-LD for the dog colitis blog page.
 */
export function buildDogColitisTreatmentAtHomeArticleJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dog Colitis Treatment at Home: 7 Vet-Backed Protocols",
    description:
      "Dog colitis treatment at home — bland diet, probiotics, slippery elm and more. Learn when to manage at home and when to call your vet.",
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
      "@id": "https://blog.celsiusherbs.com/dog-colitis-treatment-at-home",
    },
  };
}
