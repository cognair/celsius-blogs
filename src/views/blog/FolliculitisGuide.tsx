import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  Bug,
  Clock,
  Droplets,
  FlaskConical,
  Heart,
  Microscope,
  Scissors,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Thermometer,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import hero from "@/assets/blog/hero.jpg";
import bacterial from "@/assets/blog/bacterial.jpg";
import yeast from "@/assets/blog/yeast.jpg";
import virus from "@/assets/blog/virus.jpg";
import shave from "@/assets/blog/shave.jpg";
import hottub from "@/assets/blog/hottub.jpg";
import microscope from "@/assets/blog/microscope.jpg";
import doctor from "@/assets/blog/doctor.jpg";
import swim from "@/assets/blog/swim.jpg";
import skincare from "@/assets/blog/skincare.jpg";
import follicleAnatomy from "@/assets/blog/follicle-anatomy.png";
import follicleBlocked from "@/assets/blog/follicle-blocked.png";
import follicleInflammation from "@/assets/blog/follicle-inflammation.png";
import skinBumps from "@/assets/blog/skin-bumps.png";
import armItch from "@/assets/blog/arm-itch.png";
import scalpCloseup from "@/assets/blog/scalp-closeup.png";
import scalpBack from "@/assets/blog/scalp-back.png";

/** ----------------------------------------------------------------
 * Folliculitis Educational Long-Form Article
 * Editorial layout: sticky TOC, magazine intro, type cards,
 * comparison tables, prevention checklist, references.
 * Imagery sourced from Unsplash & Pexels (free-to-use license).
 * ---------------------------------------------------------------- */

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "intro", label: "What it is" },
  { id: "looks", label: "What it looks like" },
  { id: "vs-acne", label: "Folliculitis vs. acne" },
  { id: "types", label: "The major types" },
  { id: "compare", label: "Comparison table" },
  { id: "triggers", label: "Risk factors" },
  { id: "treatment", label: "Treatment principles" },
  { id: "mimics", label: "Common mimics" },
  { id: "prevention", label: "Prevention" },
  { id: "care", label: "When to see a doctor" },
  { id: "checklist", label: "Pattern checklist" },
  { id: "references", label: "References" },
];

export default function FolliculitisGuide() {
  const [active, setActive] = useState<string>("intro");
  const [progress, setProgress] = useState(0);

  /* SEO --------------------------------------------------------- */
  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      "Folliculitis Explained: Causes, Types & Treatments | Field Guide";

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta(
      "description",
      "An evidence-informed visual guide to folliculitis: what it is, what causes it, how to tell it apart from acne, and how to treat and prevent every major type.",
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);

    return () => {
      document.title = prevTitle;
    };
  }, []);

  /* Scroll spy + reading progress ------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);

      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const types = useMemo(
    () => [
      {
        id: "bacterial",
        icon: Bug,
        name: "Bacterial",
        sub: "S. aureus & friends",
        color: "from-rose-100 to-rose-50",
        accent: "text-rose-700",
        image: bacterial,
        clue:
          "Tender pustule sitting on a hair follicle, ringed by a halo of redness. Can deepen into a boil if ignored.",
        treat: "Antiseptics, topical or oral antibiotics, drainage for boils.",
      },
      {
        id: "hottub",
        icon: Waves,
        name: "Hot-tub",
        sub: "Pseudomonas aeruginosa",
        color: "from-sky-100 to-sky-50",
        accent: "text-sky-700",
        image: hottub,
        clue:
          "Itchy bumps appearing 1–2 days after a soak — concentrated under swimwear, on hips, back, or buttocks.",
        treat:
          "Usually self-resolves in 7–14 days. Antipseudomonal therapy if severe.",
      },
      {
        id: "malassezia",
        icon: FlaskConical,
        name: "Malassezia",
        sub: "Yeast overgrowth",
        color: "from-amber-100 to-amber-50",
        accent: "text-amber-700",
        image: yeast,
        clue:
          "Itchy, uniform tiny papules on chest, back, shoulders, hairline. Crucially: no comedones (blackheads/whiteheads).",
        treat: "Topical or oral antifungals — antibiotics make it worse.",
      },
      {
        id: "viral",
        icon: Microscope,
        name: "Viral (HSV / VZV)",
        sub: "Herpes-family",
        color: "from-violet-100 to-violet-50",
        accent: "text-violet-700",
        image: virus,
        clue:
          "Acute, painful, sometimes dermatomal lesions. Classic vesicles may be missing — diagnosis often needs PCR.",
        treat: "Clinician-directed antivirals, urgent if near the eye.",
      },
      {
        id: "pfb",
        icon: Scissors,
        name: "Pseudofolliculitis barbae",
        sub: "Ingrown-hair inflammation",
        color: "from-emerald-100 to-emerald-50",
        accent: "text-emerald-700",
        image: shave,
        clue:
          "Bumps, dark spots, and tenderness in shaved areas — especially in coarse or curly hair after close shaves.",
        treat: "Change the shave: clippers, with-the-grain, no skin-stretch.",
      },
      {
        id: "sterile",
        icon: ShieldCheck,
        name: "Sterile / drug-related",
        sub: "Inflammatory mimics",
        color: "from-stone-100 to-stone-50",
        accent: "text-stone-700",
        image: skincare,
        clue:
          "Eosinophilic, keloidal, actinic, or medication-triggered eruptions that defy antibiotics & antifungals.",
        treat:
          "Identify the trigger, treat the underlying disorder, dermatology referral.",
      },
    ],
    [],
  );

  const compare = [
    {
      type: "Bacterial",
      cause: "Usually S. aureus",
      clue: "Tender follicular pustules, perifollicular redness, may form boils",
      trigger: "Shaving, friction, trauma, S. aureus carriage",
      treatment:
        "Antiseptics, topical/oral antibiotics, culture, incision & drainage",
    },
    {
      type: "Hot-tub",
      cause: "Pseudomonas aeruginosa",
      clue: "Pustules in swimwear distribution after warm-water exposure",
      trigger: "Hot tubs, whirlpools, biofilms, prolonged wet occlusion",
      treatment:
        "Self-limited; antipseudomonal antibiotics for severe / immunocompromised",
    },
    {
      type: "Malassezia",
      cause: "Malassezia yeast overgrowth",
      clue:
        "Itchy, uniform follicular papules on chest, back, hairline — no comedones",
      trigger: "Heat, sweat, occlusion, antibiotics, steroids",
      treatment: "Topical antifungals, antifungal washes, oral antifungals",
    },
    {
      type: "Viral (HSV / VZV)",
      cause: "Herpes simplex or varicella-zoster",
      clue: "Painful, acute, dermatomal — vesicles may be absent",
      trigger: "Reactivation, immunosuppression, atypical presentations",
      treatment: "Viral testing + clinician-directed antiviral therapy",
    },
    {
      type: "Pseudofolliculitis barbae",
      cause: "Ingrown hairs after shaving",
      clue: "Papules, pustules, hyperpigmentation in shaved areas",
      trigger: "Curly/coarse hair, close shaves, blunt blades, against grain",
      treatment:
        "Modify shaving, clippers, keratolytics, retinoids, laser hair reduction",
    },
  ];

  const triggers = [
    {
      icon: Scissors,
      title: "Shaving, waxing, plucking",
      why: "Hair removal injures follicles, spreads bacteria, and traps regrowing hairs.",
      tip: "Pause hair removal during flares. Use clippers. Shave with the grain — never stretch the skin.",
    },
    {
      icon: Thermometer,
      title: "Sweat, humidity, heat",
      why: "Creates the warm, occluded environment Malassezia thrives in.",
      tip: "Shower after heavy sweating. Change out of damp clothes promptly.",
    },
    {
      icon: FlaskConical,
      title: "Antibiotic exposure",
      why: "Disrupts the skin microbiome and is repeatedly linked to yeast folliculitis.",
      tip: "If acne worsens after antibiotics, suspect Malassezia and rethink the diagnosis.",
    },
    {
      icon: Sun,
      title: "Tight clothing & occlusion",
      why: "Heavy oils and synthetic fabrics seal in heat and irritate follicles.",
      tip: "Choose breathable cotton or linen. Skip heavy occlusive products on prone zones.",
    },
    {
      icon: Waves,
      title: "Hot tubs & wet swimwear",
      why: "Warm water + biofilm = Pseudomonas territory.",
      tip: "Shower & change immediately after a soak. Wash swimwear after every use.",
    },
    {
      icon: ShieldCheck,
      title: "Steroids & immunosuppression",
      why: "Increases risk of atypical, viral, eosinophilic, or drug-related eruptions.",
      tip: "Seek earlier evaluation when lesions are unusual, recurrent, or treatment-resistant.",
    },
  ];

  const mimics = [
    {
      name: "Acne vulgaris",
      clue: "Comedones (blackheads/whiteheads) plus inflammatory bumps.",
      sets_apart:
        "The presence of comedones strongly favors acne over folliculitis.",
    },
    {
      name: "Rosacea",
      clue:
        "Central facial redness, flushing, telangiectasias, papules — no comedones.",
      sets_apart: "Background flushing is more typical than follicle-centered pustules.",
    },
    {
      name: "Keratosis pilaris",
      clue: "Tiny rough keratotic bumps, usually painless.",
      sets_apart:
        "Chronic, rough, sandpaper-like — not pustular or infectious-looking.",
    },
    {
      name: "Molluscum contagiosum",
      clue: "Smooth, dome-shaped papules with a central dimple (umbilication).",
      sets_apart:
        "The umbilication is the giveaway — bacterial / yeast folliculitis lacks it.",
    },
  ];

  const checklist = [
    {
      icon: Bug,
      think: "Bacterial",
      when: "tender, hair-centered pustules — often after shaving, sometimes progressing to boils.",
    },
    {
      icon: FlaskConical,
      think: "Malassezia",
      when:
        "itchy, uniform, comedone-free bumps on chest/back/hairline that don't improve with antibiotics.",
    },
    {
      icon: Waves,
      think: "Hot-tub",
      when:
        "papulopustules appearing days after a hot tub, spa, or pool, usually under swimwear.",
    },
    {
      icon: Microscope,
      think: "Viral",
      when:
        "acute, painful, facial or dermatomal lesions resistant to antibacterials and antifungals.",
    },
    {
      icon: Scissors,
      think: "Pseudofolliculitis barbae",
      when:
        "bumps, ingrown hairs, and dark spots that follow shaving or plucking.",
    },
    {
      icon: ShieldCheck,
      think: "Sterile / drug-related",
      when:
        "lesions that start after a new medication, scar the scalp, or culture negative.",
    },
  ];

  const references = [
    "Chiriac A, et al. Folliculitis: recognition and management. PubMed.",
    "Nomura T, et al. Special types of folliculitis which should be differentiated from acne. PubMed Central.",
    "Leung AKC, et al. Dermatology: how to manage acne vulgaris. PubMed Central.",
    "Del Giudice P. Skin Infections Caused by Staphylococcus aureus. PubMed Central.",
    "Chi CC, et al. Interventions for bacterial folliculitis and boils. PubMed Central.",
    "Chalupczak E, Lipner SR. Malassezia Folliculitis: An Underdiagnosed Mimicker of Acneiform Eruptions. PubMed Central.",
    "Saunte DML, et al. Position statement: recommendations for the diagnosis and treatment of Malassezia folliculitis. PubMed.",
    "Feschuk AM, et al. Clinical characteristics and treatment outcomes of Pityrosporum folliculitis in immunocompetent patients. PubMed Central.",
    "Jacob JS, Tschen JA. Hot Tub-Associated Pseudomonas Folliculitis. PubMed Central.",
    "Berger RS, Seifert MR. Whirlpool folliculitis: a review of its cause, treatment, and prevention. PubMed.",
    "Silverman AR, Nieland ML. Hot tub dermatitis: a familial outbreak of Pseudomonas folliculitis. PubMed.",
    "Ratnam S, et al. Pseudomonas folliculitis: a complication of the recreational use of contaminated waters. PubMed.",
    "Ogunbiyi A. Pseudofolliculitis barbae; current treatment options. PubMed Central.",
    "Alexis AF, et al. A Review of the Current Literature of Therapeutic Options for Pseudofolliculitis Barbae. PubMed.",
    "Cao X, et al. Facial Herpetic Folliculitis Should Be Concerned in the Clinic. PubMed Central.",
    "Boer A, et al. Herpes folliculitis: clinical, histopathological, and molecular pathologic observations. PubMed.",
    "Rogers RS, et al. Herpetic zoster folliculitis in the immunocompromised host. PubMed Central.",
    "Dodiuk-Gad RP, et al. Herpes folliculitis. PubMed.",
    "Kim JE, et al. Comparison between Malassezia folliculitis and non-Malassezia folliculitis. PubMed Central.",
    "Ogawa M, et al. Eosinophilic Pustular Folliculitis Associated with Herpes Zoster. PubMed.",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Reading progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-ink-deep transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
          <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Field Guide · Skin Health
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: document.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      {/* HERO ===================================================== */}
      <section className="relative overflow-hidden border-b border-border bg-peach">
        <div className="container grid lg:grid-cols-12 gap-10 py-16 lg:py-24 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink-deep/70">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" /> Dermatology
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 12 min read
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-ink-deep">
              Folliculitis,
              <br />
              <span className="italic text-gold">decoded.</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-deep/80 max-w-xl leading-relaxed">
              Not every red bump on your skin is acne. This evidence-informed
              field guide unpacks the six main types of folliculitis — what
              they look like, what they mean, and how each one is actually
              treated.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="rounded-full bg-ink-deep text-primary-foreground hover:bg-ink-deep/90"
                onClick={() =>
                  document
                    .getElementById("intro")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start reading
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-ink-deep/20"
                onClick={() =>
                  document
                    .getElementById("compare")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Jump to comparison
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src={hero}
                alt="Close-up portrait highlighting healthy skin texture"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-ink-deep/80 to-transparent">
                <p className="font-serif text-lg text-primary-foreground italic">
                  “Folliculitis is a pattern, not a single disease.”
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block bg-card border border-border rounded-2xl px-5 py-4 shadow-lg max-w-[220px]">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Most-mistaken-for
              </div>
              <div className="font-serif text-2xl text-ink-deep mt-1">Acne vulgaris</div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY ====================================================== */}
      <div className="container grid lg:grid-cols-12 gap-12 py-16">
        {/* Sticky TOC */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              In this guide
            </div>
            <nav className="space-y-1 border-l border-border">
              {SECTIONS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block pl-4 -ml-px py-2 text-sm transition-colors border-l ${
                    active === s.id
                      ? "border-ink-deep text-ink-deep font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-xs text-muted-foreground/70 mr-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 p-4 rounded-xl bg-secondary/60 text-xs text-muted-foreground leading-relaxed">
              <AlertTriangle className="h-4 w-4 mb-2 text-gold" />
              Educational only — not a substitute for diagnosis. Painful,
              spreading, or scarring lesions need a clinician.
            </div>
          </div>
        </aside>

        <article className="lg:col-span-9 space-y-24 max-w-3xl">
          {/* Intro */}
          <section id="intro" className="scroll-mt-24">
            <SectionLabel n="01" title="What it is" />
            <p className="font-serif text-3xl md:text-4xl leading-[1.25] text-ink-deep first-letter:font-serif first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
              Folliculitis is inflammation that centers on a hair follicle. It
              can be bacterial, fungal, viral — or have nothing to do with
              infection at all.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-foreground/80">
              That's why a breakout that looks like acne might need antibiotics,
              antifungals, antivirals, a change in how you shave, or no
              antimicrobial treatment whatsoever. The cause dictates the cure —
              and that cause is often invisible without paying close attention
              to <em>where</em>, <em>when</em>, and <em>how</em> the bumps
              appeared.
            </p>

            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              <KeyStat
                icon={Bug}
                value="6+"
                label="distinct types of folliculitis"
              />
              <KeyStat
                icon={Heart}
                value="7–14"
                label="days for hot-tub cases to resolve"
              />
              <KeyStat
                icon={Microscope}
                value="No.1"
                label="acne look-alike: Malassezia"
              />
            </div>

            <figure className="mt-12 grid md:grid-cols-2 gap-6 items-center bg-secondary/40 rounded-2xl p-6">
              <img
                src={follicleAnatomy}
                alt="Cross-section anatomy of a healthy hair follicle in the skin"
                className="w-full max-h-80 object-contain"
              />
              <figcaption className="text-sm text-foreground/80 leading-relaxed">
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  Anatomy at a glance
                </span>
                Every hair grows from a follicle anchored in the dermis,
                surrounded by sebaceous glands, blood vessels, and nerves.
                Folliculitis is what happens when that tiny ecosystem becomes
                inflamed — by bacteria, yeast, virus, or simple mechanical
                injury.
              </figcaption>
            </figure>

          </section>

          {/* Looks like */}
          <section id="looks" className="scroll-mt-24">
            <SectionLabel n="02" title="What folliculitis looks like" />
            <p className="text-lg leading-relaxed text-foreground/80">
              The classic lesion is a small bump or pustule sitting right at the
              base of a hair, often with a faint ring of redness around it.
              Bacterial cases tend to be tender; yeast cases tend to be itchy;
              viral cases can hurt before they ever blister.
            </p>

            <div className="my-10 grid md:grid-cols-2 gap-6">
              <figure className="rounded-2xl overflow-hidden bg-peach/40 p-6 flex flex-col items-center">
                <img
                  src={follicleBlocked}
                  alt="Diagram of a blocked, inflamed hair follicle"
                  className="w-full max-h-72 object-contain"
                />
                <figcaption className="text-xs text-muted-foreground mt-3 italic text-center">
                  A follicle plugged with keratin and sebum — the entry point
                  for inflammation.
                </figcaption>
              </figure>
              <figure className="rounded-2xl overflow-hidden">
                <img
                  src={skinBumps}
                  alt="Close-up of red inflammatory bumps scattered across the skin"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
                <figcaption className="text-xs text-muted-foreground mt-2 italic">
                  Scattered, hair-centered bumps — the signature pattern.
                </figcaption>
              </figure>
            </div>

            <figure className="my-10">
              <img
                src={microscope}
                alt="Scientist examining samples under a microscope"
                className="rounded-2xl w-full aspect-[16/10] object-cover"
              />
              <figcaption className="text-xs text-muted-foreground mt-2 italic">
                Beyond appearance, lab work — KOH prep, culture, PCR — often
                separates one type from another. Photo: Unsplash.
              </figcaption>
            </figure>
            <p className="text-lg leading-relaxed text-foreground/80">
              Location is a powerful clue. Beard-area bumps after shaving point
              one direction; itchy, uniform bumps across the upper back point
              somewhere else entirely; pustules confined to the swimwear zone
              after a hot tub point at a third diagnosis altogether.
            </p>

            <figure className="mt-10 rounded-2xl overflow-hidden">
              <img
                src={armItch}
                alt="Person scratching an irritated arm with visible red marks"
                className="w-full aspect-[16/9] object-cover"
              />
              <figcaption className="text-xs text-muted-foreground mt-2 italic">
                Itch is one of the body's earliest warnings — especially in
                yeast-driven folliculitis.
              </figcaption>
            </figure>
          </section>

          {/* Vs acne */}
          <section id="vs-acne" className="scroll-mt-24">
            <SectionLabel n="03" title="Why it gets confused with acne" />
            <div className="grid md:grid-cols-2 gap-6">
              <ComparisonCard
                title="Acne vulgaris"
                points={[
                  "Comedones (blackheads & whiteheads)",
                  "Mixed papules, pustules, nodules",
                  "Pilosebaceous-unit disorder",
                ]}
                tone="warm"
              />
              <ComparisonCard
                title="Folliculitis"
                points={[
                  "No comedones (usually)",
                  "Uniform, hair-centered bumps",
                  "Often itchy or tender",
                ]}
                tone="cool"
              />
            </div>
            <p className="mt-8 text-lg leading-relaxed text-foreground/80">
              The single most useful question is: <strong>are there
              comedones?</strong> If yes, acne is far more likely. If no — and
              especially if antibiotics have already failed — yeast or another
              folliculitis enters the running.
            </p>
          </section>

          {/* Types */}
          <section id="types" className="scroll-mt-24">
            <SectionLabel n="04" title="The major types" />
            <p className="text-lg leading-relaxed text-foreground/80 mb-10">
              Each one has a signature presentation and a different treatment
              path. Recognizing the pattern saves weeks of trial-and-error.
            </p>

            <figure className="mb-12 grid md:grid-cols-2 gap-6 items-center bg-peach/30 rounded-2xl p-6">
              <img
                src={follicleInflammation}
                alt="Illustration of inflammation around a hair follicle in the skin layers"
                className="w-full max-h-72 object-contain"
              />
              <figcaption className="text-sm text-foreground/80 leading-relaxed">
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  Inflammation of the hair follicle
                </span>
                Whatever the trigger, the end result looks similar under the
                skin: an immune response concentrated around a single follicle.
                What changes is the cause — and that's what dictates the right
                treatment.
              </figcaption>
            </figure>

            <div className="space-y-8">
              {types.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.id}
                    className="grid md:grid-cols-5 gap-6 items-stretch group"
                  >
                    <div
                      className={`md:col-span-2 relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto md:min-h-[280px]`}
                    >
                      <img
                        src={t.image}
                        alt={`Visual reference for ${t.name} folliculitis`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-tr ${t.color} mix-blend-multiply opacity-60`}
                      />
                      <div className="absolute top-4 left-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-background/90 backdrop-blur">
                        <Icon className={`h-5 w-5 ${t.accent}`} />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-xs uppercase tracking-wider text-primary-foreground/90">
                          Type 0{i + 1}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-3 flex flex-col justify-center">
                      <div className="text-sm uppercase tracking-wider text-muted-foreground">
                        {t.sub}
                      </div>
                      <h3 className="font-serif text-3xl md:text-4xl text-ink-deep mt-1">
                        {t.name}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed text-foreground/80">
                        <span className="font-medium text-ink-deep">Tell-tale clue:</span>{" "}
                        {t.clue}
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-foreground/80">
                        <span className="font-medium text-ink-deep">Direction of treatment:</span>{" "}
                        {t.treat}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scalp folliculitis spotlight */}
            <div className="mt-14 rounded-2xl border border-border overflow-hidden">
              <div className="bg-ink-deep text-primary-foreground px-6 py-4">
                <div className="text-xs uppercase tracking-[0.2em] opacity-80">
                  Spotlight
                </div>
                <h3 className="font-serif text-2xl mt-1">
                  Folliculitis on the scalp
                </h3>
              </div>
              <div className="grid md:grid-cols-2">
                <figure>
                  <img
                    src={scalpCloseup}
                    alt="Close-up of inflamed pustules on a scalp between hairs"
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                  <figcaption className="text-xs text-muted-foreground italic px-4 py-2">
                    Close-up: tender pustules nesting between hairs.
                  </figcaption>
                </figure>
                <figure>
                  <img
                    src={scalpBack}
                    alt="Back of a closely-shaved head showing scattered red folliculitis bumps"
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                  <figcaption className="text-xs text-muted-foreground italic px-4 py-2">
                    Pattern view: scattered bumps along the nape after a close
                    shave — a classic mechanical-plus-bacterial picture.
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section id="compare" className="scroll-mt-24">
            <SectionLabel n="05" title="At-a-glance comparison" />
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-ink-deep">
                  <tr>
                    {["Type", "Cause", "Typical clue", "Triggers", "Treatment"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left font-medium px-4 py-3 uppercase tracking-wider text-xs"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {compare.map((row, i) => (
                    <tr
                      key={row.type}
                      className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}
                    >
                      <td className="px-4 py-4 font-serif text-base text-ink-deep align-top">
                        {row.type}
                      </td>
                      <td className="px-4 py-4 text-foreground/80 align-top">
                        {row.cause}
                      </td>
                      <td className="px-4 py-4 text-foreground/80 align-top">
                        {row.clue}
                      </td>
                      <td className="px-4 py-4 text-foreground/80 align-top">
                        {row.trigger}
                      </td>
                      <td className="px-4 py-4 text-foreground/80 align-top">
                        {row.treatment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Triggers */}
          <section id="triggers" className="scroll-mt-24">
            <SectionLabel n="06" title="Risk factors & triggers" />
            <figure className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={swim}
                alt="Person at the edge of a swimming pool"
                className="w-full aspect-[21/9] object-cover"
              />
            </figure>
            <div className="grid md:grid-cols-2 gap-4">
              {triggers.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-peach mb-4">
                      <Icon className="h-5 w-5 text-ink-deep" />
                    </div>
                    <h4 className="font-serif text-xl text-ink-deep">{t.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t.why}
                    </p>
                    <p className="mt-3 text-sm text-foreground/80 leading-relaxed border-t border-border pt-3">
                      <span className="text-xs uppercase tracking-wider text-gold font-medium">
                        Try this →
                      </span>{" "}
                      {t.tip}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Treatment principles */}
          <section id="treatment" className="scroll-mt-24">
            <SectionLabel n="07" title="Treatment principles" />
            <div className="space-y-8">
              <TreatmentBlock
                title="Bacterial folliculitis"
                body="Mild superficial cases may resolve on their own in 7–10 days. Topical antibiotics like clindamycin or mupirocin and antiseptics like benzoyl peroxide are common first steps. Systemic antibiotics are reserved for extensive disease or systemic signs. Boils and abscesses often need drainage — not just antibiotics."
              />
              <TreatmentBlock
                title="Antifungal direction"
                body="Malassezia folliculitis usually needs antifungals — the very thing acne antibiotics don't provide. Topical antifungals, ketoconazole washes, or oral antifungals are typical, with maintenance therapy because relapse is common."
              />
              <TreatmentBlock
                title="Viral direction"
                body="Suspect HSV or VZV when lesions are acute, painful, dermatomal, or unresponsive to antibacterials and antifungals. PCR or biopsy may be needed. Antiviral therapy is critical when the eye is involved or the patient is immunocompromised."
              />
              <TreatmentBlock
                title="Pseudofolliculitis barbae"
                body="The cure is mechanical, not pharmaceutical. Use clippers leaving 1+ mm of hair, hydrate before shaving, shave with the grain, and don't stretch the skin. Keratolytics or laser hair reduction help in stubborn cases."
              />
            </div>
          </section>

          {/* Mimics */}
          <section id="mimics" className="scroll-mt-24">
            <SectionLabel n="08" title="Common mimics" />
            <p className="text-lg leading-relaxed text-foreground/80 mb-8">
              Several conditions share the same general look. These are the
              ones most likely to throw off a quick visual diagnosis.
            </p>
            <div className="space-y-3">
              {mimics.map((m) => (
                <details
                  key={m.name}
                  className="group rounded-xl border border-border bg-card overflow-hidden"
                >
                  <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between">
                    <span className="font-serif text-xl text-ink-deep">
                      {m.name}
                    </span>
                    <span className="text-2xl text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 space-y-2 text-sm text-foreground/80 leading-relaxed">
                    <p>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Clue · </span>
                      {m.clue}
                    </p>
                    <p>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">What sets it apart · </span>
                      {m.sets_apart}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Prevention */}
          <section id="prevention" className="scroll-mt-24">
            <SectionLabel n="09" title="Prevention strategies" />
            <figure className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={skincare}
                alt="Calm skincare ritual"
                className="w-full aspect-[21/9] object-cover"
              />
            </figure>
            <div className="grid md:grid-cols-2 gap-6">
              <PreventionCard
                icon={Scissors}
                title="If shaving triggers it"
                items={[
                  "Switch to electric clippers leaving 1mm of stubble",
                  "Hydrate the area with warm water first",
                  "Always shave with the grain",
                  "Replace blades often — sharpness matters",
                ]}
              />
              <PreventionCard
                icon={Droplets}
                title="If sweat & heat trigger it"
                items={[
                  "Shower promptly after exercise",
                  "Skip heavy occlusive products on prone zones",
                  "Choose breathable fabrics",
                  "Discuss antifungal washes with a clinician",
                ]}
              />
              <PreventionCard
                icon={Waves}
                title="If hot tubs trigger it"
                items={[
                  "Shower & change immediately after a soak",
                  "Wash swimwear after every use",
                  "Avoid poorly maintained spas",
                  "Skip warm water entirely during a flare",
                ]}
              />
              <PreventionCard
                icon={FlaskConical}
                title="If antibiotics keep failing"
                items={[
                  "Reconsider the diagnosis — likely Malassezia",
                  "Stop empiric antibiotic cycles",
                  "Ask for KOH or microscopy",
                  "Try an antifungal trial under clinician guidance",
                ]}
              />
            </div>
          </section>

          {/* When to see doctor */}
          <section id="care" className="scroll-mt-24">
            <SectionLabel n="10" title="When to see a doctor" />
            <div className="rounded-2xl border-2 border-gold/40 bg-peach/40 p-8">
              <div className="flex items-start gap-4">
                <Stethoscope className="h-8 w-8 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-2xl text-ink-deep">
                    Don't wait it out if…
                  </h3>
                  <ul className="mt-4 space-y-2 text-foreground/80">
                    {[
                      "lesions are spreading rapidly or very painful",
                      "you have fever, chills, or expanding redness",
                      "a bump turns into a boil or abscess",
                      "the eruption is near the eye",
                      "lesions scar or cause hair loss",
                      "you're immunocompromised, diabetic, or on cancer therapy",
                      "the rash keeps coming back despite treatment",
                    ].map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <figure className="mt-10 rounded-2xl overflow-hidden">
              <img
                src={doctor}
                alt="Clinician examining a patient's skin"
                className="w-full aspect-[21/9] object-cover"
              />
              <figcaption className="text-xs text-muted-foreground mt-2 italic">
                Photo: Unsplash. Used under the Unsplash license.
              </figcaption>
            </figure>
          </section>

          {/* Pattern checklist */}
          <section id="checklist" className="scroll-mt-24">
            <SectionLabel n="11" title="Quick pattern checklist" />
            <div className="space-y-3">
              {checklist.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.think}
                    className="flex items-start gap-4 p-5 rounded-xl bg-secondary/40 hover:bg-secondary transition-colors"
                  >
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-background shrink-0">
                      <Icon className="h-5 w-5 text-ink-deep" />
                    </div>
                    <div>
                      <span className="font-serif text-lg text-ink-deep">
                        Think {c.think}
                      </span>
                      <span className="text-foreground/80"> when {c.when}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* References */}
          <section id="references" className="scroll-mt-24">
            <SectionLabel n="12" title="References" />
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal pl-5">
              {references.map((r) => (
                <li key={r} className="leading-relaxed">
                  {r}
                </li>
              ))}
            </ol>
            <p className="mt-8 text-xs text-muted-foreground italic">
              Imagery in this article is sourced from Unsplash and Pexels and
              used under their respective free-use licenses. Photographs are
              illustrative; they do not depict diagnostic specimens.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="rounded-2xl bg-ink-deep text-primary-foreground p-8 md:p-12">
            <div className="font-serif text-2xl mb-3">A note from us</div>
            <p className="text-primary-foreground/80 leading-relaxed">
              This guide is for education. It cannot replace an in-person exam,
              culture, biopsy, or prescription. If something on your skin is
              painful, spreading, recurrent, or simply not improving — please
              talk to a clinician.
            </p>
          </section>
        </article>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-deep text-primary-foreground shadow-lg hover:scale-105 transition-transform"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */
function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
        Chapter {n}
      </div>
      <h2 className="font-serif text-4xl md:text-5xl text-ink-deep">{title}</h2>
      <div className="mt-4 h-px w-16 bg-ink-deep" />
    </div>
  );
}

function KeyStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-5 bg-card">
      <Icon className="h-5 w-5 text-gold mb-2" />
      <div className="font-serif text-3xl text-ink-deep">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}

function ComparisonCard({
  title,
  points,
  tone,
}: {
  title: string;
  points: string[];
  tone: "warm" | "cool";
}) {
  return (
    <div
      className={`rounded-2xl p-6 border ${
        tone === "warm"
          ? "bg-peach/60 border-peach-deep"
          : "bg-secondary border-border"
      }`}
    >
      <div className="font-serif text-2xl text-ink-deep">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-foreground/80">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ink-deep shrink-0" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TreatmentBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l-2 border-gold pl-6 py-1">
      <h3 className="font-serif text-2xl text-ink-deep">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-foreground/80">{body}</p>
    </div>
  );
}

function PreventionCard({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border p-6 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-peach">
          <Icon className="h-5 w-5 text-ink-deep" />
        </div>
        <h4 className="font-serif text-xl text-ink-deep">{title}</h4>
      </div>
      <ul className="space-y-2 text-sm text-foreground/80">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
