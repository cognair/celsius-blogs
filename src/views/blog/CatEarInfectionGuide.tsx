import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  Clock,
  Droplets,
  Ear,
  FlaskConical,
  Leaf,
  Microscope,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CAT_EAR_INFECTION_FAQS as FAQS } from "@/lib/blog/cat-ear-infection-faqs";
import { ReviewedByDrAlex } from "@/components/blog/ReviewedByDrAlex";

// Cohesive image set generated via Gemini 3.1 Flash Image Preview ("nano banana")
// against the brand image style guide at:
//   clients/celciusherbs/keyword-research/image-style-guide.md
// All five share the same apothecary/editorial register — warm peach cream palette,
// natural window light, 35mm film grain, off-center composition. WebP format.
import hero from "@/assets/blog/cat-ear-hero.webp";
import imgSymptoms from "@/assets/blog/cat-ear-symptoms.webp";
import imgCauses from "@/assets/blog/cat-ear-causes.webp";
import imgHome from "@/assets/blog/cat-ear-home.webp";
import imgVet from "@/assets/blog/cat-ear-vet.webp";

/** ----------------------------------------------------------------
 * Cat Ear Infection — A Pet Parent's Field Guide
 *
 * Primary keyword: "cat ear infection" (Ahrefs US — vol 6,600 / KD 3 / TP 11k).
 * Secondary keywords woven into H2/H3s and copy:
 *   - cat ear infection symptoms (1,100 / KD 0)
 *   - cat ear infection treatment (2,100 / KD 5)
 *   - cat ear yeast infection (900 / KD 0)
 *   - how to treat cat ear infection at home (400 / KD 0)
 *   - cat ear infection home remedy (350 / KD 0)
 *   - ear infection in cats (1,500 / KD 10)
 *   - how to tell if cat has ear infection (300 / KD 3)
 *   - cat ear mites (positioned as a related-but-distinct topic)
 *
 * Editorial structure mirrors `FolliculitisGuide.tsx` (sticky TOC,
 * scroll spy, reading progress, magazine intro) but slimmer — no
 * per-section imagery, lucide icons used as visual accents instead.
 * ---------------------------------------------------------------- */

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "intro", label: "What it is" },
  { id: "symptoms", label: "Symptoms" },
  { id: "causes", label: "Causes" },
  { id: "vs-mites", label: "Infection vs. mites" },
  { id: "home", label: "Home treatment" },
  { id: "vet", label: "When to see a vet" },
  { id: "prevention", label: "Prevention" },
  { id: "faq", label: "FAQs" },
  { id: "references", label: "References" },
];

// FAQ copy lives in `@/lib/blog/cat-ear-infection-faqs` so the rendered
// accordion below and the FAQPage JSON-LD emitted by the route can never
// drift apart. Edit FAQ text in that one file.

const SYMPTOMS = [
  {
    icon: Wind,
    title: "Persistent head-shaking",
    desc: "More than a quick scratch — repeated, vigorous head-shaking, especially at night or after rest, is the single most reliable early sign.",
  },
  {
    icon: Droplets,
    title: "Dark or pus-like discharge",
    desc: "Brown waxy buildup suggests yeast (Malassezia). Yellow-green pus with a sharp odor suggests bacterial. A mix is common in chronic cases.",
  },
  {
    icon: Bug,
    title: "Strong odor from the ear",
    desc: "Sour, yeasty, or sharply foul. A healthy cat ear should be almost odorless inside the visible canal opening.",
  },
  {
    icon: AlertTriangle,
    title: "Redness, swelling, or scabbing",
    desc: "The canal opening looks pink-red rather than soft pink. The ear flap may show scabs from over-scratching.",
  },
  {
    icon: Ear,
    title: "Head tilt to one side",
    desc: "A consistent lean toward the affected ear, especially while walking or stationary. This signals deeper canal or middle-ear involvement.",
  },
  {
    icon: PawPrint,
    title: "Sensitivity when touched",
    desc: "Pulling away, flinching, or hissing when you handle the ear or jaw — a sign that inflammation has reached the deeper canal.",
  },
];

const CAUSES = [
  {
    icon: FlaskConical,
    title: "Yeast overgrowth (Malassezia)",
    body: "By far the most common cause of feline otitis externa. Malassezia is a normal skin yeast that overgrows in warm, moist, sugar-rich canal environments — especially when allergies, antibiotics, or steroids have shifted the microbiome.",
  },
  {
    icon: Bug,
    title: "Bacterial infection",
    body: "Usually Staphylococcus or Pseudomonas, often secondary to yeast or to a foreign body lodged in the canal. More likely to cause visible pain and discharge.",
  },
  {
    icon: Microscope,
    title: "Ear mites (Otodectes cynotis)",
    body: "Highly contagious between cats and from cats to dogs. Produces dry coffee-ground-like debris and intense itching. Often misdiagnosed as a yeast infection — and vice versa.",
  },
  {
    icon: Leaf,
    title: "Underlying allergies",
    body: "Environmental or food allergies are the #1 driver of recurring cat ear infections. The infection itself is the symptom; the allergy is the cause. If your cat has had three or more infections in a year, an elimination diet or vet allergy workup is warranted.",
  },
  {
    icon: Thermometer,
    title: "Foreign material or water",
    body: "Grass seeds, plant matter, or post-bath water trapped in the canal create an immediate infection-friendly environment. More common in indoor-outdoor cats.",
  },
  {
    icon: ShieldCheck,
    title: "Polyps or anatomical issues",
    body: "Inflammatory polyps and stenotic canals (more common in Persians, Himalayans, Scottish Folds) can drive chronic, recurring infections that don't respond to standard treatment.",
  },
];

const COMPARE = [
  {
    label: "Ear infection (yeast or bacterial)",
    discharge: "Waxy brown (yeast) or pus-like yellow-green (bacterial)",
    odor: "Sour/yeasty (yeast) or sharply foul (bacterial)",
    itch: "Steady; worse at night",
    onset: "Gradual over days",
    pets_affected: "Just the affected cat — not contagious",
  },
  {
    label: "Ear mites (Otodectes cynotis)",
    discharge: "Dry, dark, granular — like coffee grounds",
    odor: "Mild or none",
    itch: "Severe, frantic — cat scratches until raw",
    onset: "Onset can be sudden",
    pets_affected: "Multiple pets in the household — highly contagious",
  },
  {
    label: "Allergic flare without infection",
    discharge: "Minimal — clear canal but red-pink lining",
    odor: "None",
    itch: "Comes and goes with allergy triggers",
    onset: "Recurrent / seasonal",
    pets_affected: "Just the affected cat",
  },
];

const HOME_RULES = [
  {
    do: true,
    text: "Use a cat-safe broad-spectrum botanical drop (olive leaf, chamomile, neem) twice daily for 5–7 days.",
  },
  {
    do: true,
    text: "Patch-test on the outer ear flap first if it's a new product.",
  },
  {
    do: true,
    text: "Wipe visible discharge with cotton — never push a swab into the canal.",
  },
  {
    do: true,
    text: "Keep the ear dry between treatments; pat after baths.",
  },
  {
    do: false,
    text: "Don't use hydrogen peroxide, alcohol, or undiluted vinegar — all are irritating to inflamed cat ear tissue.",
  },
  {
    do: false,
    text: "Don't use tea tree oil or eucalyptus oil — both are toxic to cats even in small amounts.",
  },
  {
    do: false,
    text: "Don't reuse a leftover prescription from another pet (especially a dog) — many canine ear formulations contain ingredients unsafe for cats.",
  },
  {
    do: false,
    text: "Don't continue past 7–10 days without improvement — that signals deeper involvement or wrong cause.",
  },
];

const REFERENCES = [
  "American Veterinary Medical Association. Otitis externa in dogs and cats: diagnosis and management.",
  "Cornell Feline Health Center. Ear disorders. Cornell University College of Veterinary Medicine.",
  "Feline otitis externa epidemiology and aetiology — UK and European cohort prevalence (~19% in pet cats). PMC11112181.",
  "Sudano Rocchi et al. Antimicrobial activity of olive leaf extract against Staphylococcus aureus and Pseudomonas aeruginosa. BMC Complement Altern Med, 2015. PMID 26462516.",
  "Abu-Shanab et al. Anti-inflammatory and antimicrobial activity of chamomile extract in dermatological models. BMC Complement Med Ther, 2018. PMID 29943702.",
  "Peer et al. Chamomile-based topical formulation for canine otitis externa. Veterinary Sciences, 2024. PMC12655140.",
  "Vassallo et al. Topical curcumin reduces pro-inflammatory cytokines in skin inflammation. Molecules, 2017. PMID 28987085.",
  "Dua et al. Antifungal activity of Azadirachta indica (neem) against Malassezia and other fungi. Parasitology Research, 2015. PMID 25617543.",
  "Abdel-Ghaffar et al. Antimite activity of neem in veterinary skin applications. Parasites & Vectors, 2019. PMID 31552852.",
  "Six R, Cherni JA, Chesebrough R et al. Efficacy and safety of selamectin against Otodectes cynotis (ear mite) infestations in dogs and cats. Vet Parasitol.",
  "Saridomichelakis MN, Farmaki R, Leontides LS, Koutinas AF. Aetiology of canine otitis externa: a retrospective study of 100 cases. Vet Dermatol.",
];

// Editorial section header — stacked left-aligned pattern matching
// FolliculitisGuide.tsx. Was previously a horizontal flex layout that
// pushed the title to the right of a long rule, which looked off.
function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
        Chapter {n}
      </div>
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink-deep leading-[1.1]">
        {title}
      </h2>
      <div className="mt-4 h-px w-16 bg-ink-deep" />
    </div>
  );
}

export default function CatEarInfectionGuide() {
  const [progress, setProgress] = useState(0);

  // Reading progress bar (top of page). The sticky scroll-spy TOC was removed
  // per Rick's May 15 feedback ("we don't need a sticky table of contents");
  // the static TOC inside the article body uses native anchor links instead.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Field Guide · Feline Health
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">
            Reviewed by Celsius Herbs vet team
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-peach">
        <div className="container grid lg:grid-cols-12 gap-10 py-16 lg:py-24 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink-deep/70">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" /> Feline Otology
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 9 min read
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.02] text-ink-deep">
              Cat ear infection,
              <br />
              <span className="italic text-accent">decoded.</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-deep/80 max-w-xl leading-relaxed">
              Persistent head-shaking. A musty smell. Dark waxy buildup. This
              guide walks you through every cat ear infection symptom, sorts
              out yeast vs. bacterial vs. ear mites, and covers safe at-home
              treatment — plus the seven warning signs that mean a vet visit.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="rounded-full bg-ink-deep text-primary-foreground hover:bg-ink-deep/90"
                onClick={() =>
                  document
                    .getElementById("symptoms")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Identify the symptoms
              </Button>
              <a href="/ear-infection-drops">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-ink-deep/20"
                >
                  See natural ear drops
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src={hero}
                alt="Calm tabby cat resting — illustrative imagery for ear health field guide"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-ink-deep/80 to-transparent">
                <p className="font-serif text-lg text-primary-foreground italic">
                  "Roughly 1 in 5 cats will have an ear infection this year."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY — full-width centered article (sticky left-rail TOC removed
          per Rick's May 15 feedback; replaced with a static TOC inside the
          article body at the top, below). */}
      <div className="container py-16">
        <article className="space-y-20 max-w-3xl mx-auto">
          {/* Static Table of Contents — non-sticky, top of article.
              2-column on tablet+, single column on mobile. Includes the
              educational-only disclaimer at the bottom of the same card. */}
          <nav className="mb-4 rounded-2xl border border-border bg-card/60 px-6 sm:px-8 py-6">
            <div className="text-[10px] tracking-[0.28em] uppercase text-accent mb-4">
              In this guide
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 list-none p-0 m-0">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="m-0">
                  <a
                    href={`#${s.id}`}
                    className="group flex items-baseline gap-3 py-1.5 text-foreground hover:text-accent transition-colors"
                  >
                    <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-snug group-hover:underline underline-offset-4">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-5 pt-5 border-t border-border/60 flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
              <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>Educational only — not a substitute for veterinary diagnosis. Pain, balance issues, or scarring lesions need a clinician.</span>
            </div>
          </nav>

          {/* Intro */}
          <section id="intro" className="scroll-mt-24">
            <SectionLabel n="01" title="What a cat ear infection actually is" />
            <p className="font-serif text-2xl md:text-3xl leading-[1.3] text-ink-deep first-letter:font-serif first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
              An ear infection in cats is inflammation and microbial overgrowth
              inside the ear canal — most often driven by yeast, sometimes by
              bacteria, and frequently by both at once.
            </p>
            <p className="mt-6 text-base leading-relaxed text-foreground/80">
              The medical term is <em>otitis</em>, and depending on how deep
              the inflammation reaches it's classified as{" "}
              <em>otitis externa</em> (the outer canal — by far the most
              common), <em>otitis media</em> (middle ear), or{" "}
              <em>otitis interna</em> (inner ear, with balance involvement).
              Almost every case starts in the outer canal. The mistake pet
              parents make is assuming any ear infection in cats is "just a
              little wax buildup" — by the time you smell odor or see dark
              discharge, microbial overgrowth is already established.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              Ear infections in cats are also less common than in dogs but
              tend to be more chronic when they do occur, partly because cats
              hide pain longer and partly because feline ear canals are more
              vertical and harder to clean. Catching the early signs and
              starting a gentle, broad-spectrum antimicrobial treatment within
              48 hours is the single biggest predictor of a fast recovery.
            </p>
          </section>

          {/* Symptoms */}
          <section id="symptoms" className="scroll-mt-24">
            <SectionLabel n="02" title="Cat ear infection symptoms — 6 signs that matter" />
            <figure className="mb-8 -mx-2 sm:mx-0">
              <img
                src={imgSymptoms}
                alt="Close-up of a healthy calm cat's ear in warm afternoon light — illustrative imagery for cat ear infection symptoms guide"
                className="w-full rounded-2xl shadow-md aspect-[3/2] object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <p className="text-base leading-relaxed text-foreground/80 mb-8">
              The challenge with cat ear infection symptoms is that cats are
              experts at hiding discomfort. Most pet parents notice the
              behavioral signs (head-shaking, scratching) days before the
              physical signs (discharge, swelling). If you see two or more of
              these for longer than 48 hours, treat it as a likely infection
              and start gentle treatment.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {SYMPTOMS.map((s) => (
                <div key={s.title} className="rounded-xl border border-border bg-secondary/40 p-5">
                  <s.icon className="h-5 w-5 text-accent mb-3" />
                  <h3 className="font-serif text-lg text-ink-deep mb-1.5">{s.title}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 rounded-xl bg-ink-deep text-primary-foreground">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-2">
                Quick check at home
              </div>
              <p className="text-sm leading-relaxed">
                A healthy cat ear is light pink, dry, and almost odorless inside
                the visible canal opening. Compare both ears side by side under
                a bright light — asymmetry between the two is a strong
                indicator that one ear is infected.
              </p>
            </div>
          </section>

          {/* Causes */}
          <section id="causes" className="scroll-mt-24">
            <SectionLabel n="03" title="What causes ear infection in cats" />
            <figure className="mb-8 -mx-2 sm:mx-0">
              <img
                src={imgCauses}
                alt="Botanical flatlay of olive leaf, chamomile, turmeric root, and neem on raw wood — the four key herbal antimicrobials for cat ear care"
                className="w-full rounded-2xl shadow-md aspect-[3/2] object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <p className="text-base leading-relaxed text-foreground/80 mb-8">
              Unlike dogs — where breed-specific anatomy (long, floppy ears)
              is the dominant risk factor — feline ear infections are usually
              driven by an immune trigger. Identify the trigger and you stop
              the cycle of recurrence.
            </p>
            <div className="space-y-4">
              {CAUSES.map((c) => (
                <div key={c.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                  <c.icon className="h-5 w-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg text-ink-deep mb-1">{c.title}</h3>
                    <p className="text-sm text-foreground/75 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vs mites */}
          <section id="vs-mites" className="scroll-mt-24">
            <SectionLabel n="04" title="Cat ear infection vs. ear mites — how to tell" />
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              The single most common at-home misdiagnosis is treating an ear
              mite infestation as a yeast infection (or vice versa). The
              treatment for each is different, and using the wrong one can
              prolong both.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-ink-deep">Type</th>
                    <th className="px-4 py-3 font-medium text-ink-deep">Discharge</th>
                    <th className="px-4 py-3 font-medium text-ink-deep">Odor</th>
                    <th className="px-4 py-3 font-medium text-ink-deep">Itch pattern</th>
                    <th className="px-4 py-3 font-medium text-ink-deep">Onset</th>
                    <th className="px-4 py-3 font-medium text-ink-deep">Other pets</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((c, i) => (
                    <tr key={c.label} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                      <td className="px-4 py-3 font-medium text-ink-deep">{c.label}</td>
                      <td className="px-4 py-3 text-foreground/75">{c.discharge}</td>
                      <td className="px-4 py-3 text-foreground/75">{c.odor}</td>
                      <td className="px-4 py-3 text-foreground/75">{c.itch}</td>
                      <td className="px-4 py-3 text-foreground/75">{c.onset}</td>
                      <td className="px-4 py-3 text-foreground/75">{c.pets_affected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-muted-foreground italic">
              Definitive diagnosis still requires ear cytology — but the
              behavioral pattern + discharge appearance gets the right
              category in 8 out of 10 cases.
            </p>
          </section>

          {/* Home treatment */}
          <section id="home" className="scroll-mt-24">
            <SectionLabel n="05" title="How to treat a cat ear infection at home — safely" />
            <figure className="mb-8 -mx-2 sm:mx-0">
              <img
                src={imgHome}
                alt="A gentle hand tending to a calm cream-colored cat's ear at home — careful handling is the first step in safe cat ear infection home treatment"
                className="w-full rounded-2xl shadow-md aspect-square sm:aspect-[3/2] object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              For mild to moderate yeast or early bacterial cases caught
              within the first few days, a cat-safe broad-spectrum botanical
              drop is the conservative first move. Cats are uniquely
              sensitive to phenols and essential oils — many remedies that
              work for dogs are unsafe here. Stick to ingredients with a
              veterinary safety record in cats:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl border border-border bg-card p-5">
                <Leaf className="h-5 w-5 text-accent mb-3" />
                <h3 className="font-serif text-lg text-ink-deep mb-1.5">Olive leaf extract</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  Oleuropein has documented antimicrobial activity against
                  Staphylococcus and Pseudomonas — the bacterial drivers
                  behind most feline ear infections.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <Droplets className="h-5 w-5 text-accent mb-3" />
                <h3 className="font-serif text-lg text-ink-deep mb-1.5">Chamomile</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  Anti-inflammatory and gently antimicrobial. Calms the canal
                  redness and swelling that drives the head-shaking.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <FlaskConical className="h-5 w-5 text-accent mb-3" />
                <h3 className="font-serif text-lg text-ink-deep mb-1.5">Turmeric (curcumin)</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  Reduces inflammatory markers and odor without the rebound
                  flare of topical hydrocortisone.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <ShieldCheck className="h-5 w-5 text-accent mb-3" />
                <h3 className="font-serif text-lg text-ink-deep mb-1.5">Karanja & neem oils</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  Traditional Ayurvedic actives that suffocate ear mites and
                  rebuild the canal's natural defense barrier.
                </p>
              </div>
            </div>
            <h3 className="font-serif text-xl text-ink-deep mb-4">The do / don't list</h3>
            <ul className="space-y-2.5">
              {HOME_RULES.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      r.do
                        ? "bg-accent/20 text-accent"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {r.do ? "✓" : "✕"}
                  </span>
                  <span className="text-foreground/85">{r.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 p-6 rounded-2xl bg-peach border border-accent/20">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">
                Try the Celsius Herbs approach
              </div>
              <h3 className="font-serif text-2xl text-ink-deep mb-3">
                A natural ear infection drop that's safe for cats &amp; dogs
              </h3>
              <p className="text-sm text-ink-deep/80 leading-relaxed mb-5">
                Olive leaf, chamomile, turmeric, karanja and neem in a
                non-stinging glycerin base. FDA-registered (NDC), formulated
                for both cats and dogs from 12 weeks old.
              </p>
              <a href="/ear-infection-drops">
                <Button className="rounded-full bg-ink-deep text-primary-foreground hover:bg-ink-deep/90">
                  See PetGlow Ear Infection Drops →
                </Button>
              </a>
            </div>
          </section>

          {/* Vet */}
          <section id="vet" className="scroll-mt-24">
            <SectionLabel n="06" title="When to see the vet (don't wait if any of these)" />
            <figure className="mb-8 -mx-2 sm:mx-0">
              <img
                src={imgVet}
                alt="Stethoscope and clipboard resting on cream linen with chamomile sprig — knowing when to seek veterinary care for a cat ear infection"
                className="w-full rounded-2xl shadow-md aspect-square sm:aspect-[3/2] object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <ul className="space-y-3 text-base leading-relaxed text-foreground/85">
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Visible blood</strong> in the canal or on the ear flap.
                </span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Loss of balance</strong>, walking in circles, or a
                  consistent strong head tilt — points to middle/inner ear
                  involvement.
                </span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Swelling that closes the canal</strong> opening or
                  visible swelling of the ear flap (an aural hematoma).
                </span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Lethargy or appetite loss</strong> — systemic signs
                  of a deeper infection.
                </span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Pain when chewing</strong> or yawning.
                </span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>No improvement after 7–10 days</strong> of consistent
                  home treatment — likely indicates the wrong cause or
                  eardrum involvement.
                </span>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>Three or more ear infections in 12 months</strong> —
                  warrants an allergy workup or referral to a veterinary
                  dermatologist.
                </span>
              </li>
            </ul>
          </section>

          {/* Prevention */}
          <section id="prevention" className="scroll-mt-24">
            <SectionLabel n="07" title="Preventing recurring cat ear infections" />
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              The most chronic feline ear infections are downstream of an
              underlying allergy or microbiome disruption. These five habits
              cut recurrence rates dramatically:
            </p>
            <ol className="space-y-4 text-base leading-relaxed text-foreground/85 list-decimal pl-5 marker:text-accent marker:font-medium">
              <li>
                <strong>Weekly visual check.</strong> Compare both ears side by
                side under bright light. Catch asymmetry, redness, or odor in
                the first 48 hours when treatment is most effective.
              </li>
              <li>
                <strong>Gentle monthly cleaning</strong> with a cat-safe ear
                cleanser if your cat is prone to wax buildup. Skip cleaning
                healthy ears — over-cleaning disrupts the natural canal flora.
              </li>
              <li>
                <strong>Dry the canal after baths or rain.</strong> Trapped
                moisture is the single biggest preventable trigger.
              </li>
              <li>
                <strong>Address underlying allergies.</strong> If your cat has
                three infections in a year, work with your vet on an
                elimination diet or environmental allergy plan.
              </li>
              <li>
                <strong>Treat ear mites in all household pets.</strong> Mites
                ping-pong between cats and dogs — treating one without the
                others guarantees reinfestation.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24">
            <SectionLabel n="08" title="Frequently asked questions" />
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`q${i}`}>
                  <AccordionTrigger className="text-left font-serif text-lg py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 leading-relaxed text-[15px] pb-5">
                    <p>{f.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* References */}
          <section id="references" className="scroll-mt-24">
            <SectionLabel n="09" title="References & further reading" />
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5 leading-relaxed">
              {REFERENCES.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-muted-foreground/80">
              Educational content only — does not replace individualized
              veterinary diagnosis or treatment.
            </p>
          </section>

          {/* Reviewer attribution (pet articles) */}
          <ReviewedByDrAlex />

          {/* Final CTA back to PDP */}
          <section className="scroll-mt-24 bg-ink-deep text-primary-foreground rounded-3xl p-10 lg:p-14">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">
              Ready to start treatment?
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">
              Quiet ears. Quiet nights. Without another vet bill.
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed max-w-xl mb-7">
              PetGlow Natural Ear Infection Drops — olive leaf, chamomile,
              turmeric, karanja and neem in a non-stinging glycerin base.
              Safe for cats and dogs of all ages, FDA-registered (NDC), and
              formulated to address bacterial, yeast, fungal, and ear mite
              infections in a single bottle.
            </p>
            <a href="/ear-infection-drops">
              <Button
                size="lg"
                className="rounded-full bg-primary-foreground text-ink-deep hover:bg-primary-foreground/90"
              >
                See the natural ear drops →
              </Button>
            </a>
          </section>
        </article>
      </div>
    </div>
  );
}
