import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Droplets,
  FlaskConical,
  Leaf,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DOG_COLITIS_TREATMENT_AT_HOME_FAQS as FAQS } from "@/lib/blog/dog-colitis-treatment-at-home-faqs";
import { ReviewedByDrAlex } from "@/components/blog/ReviewedByDrAlex";

import hero from "@/assets/blog/dog-colitis-treatment-at-home-hero.webp";
import imgTypes from "@/assets/blog/dog-colitis-treatment-at-home-types.webp";
import imgRedflags from "@/assets/blog/dog-colitis-treatment-at-home-redflags.webp";
import imgTreatments from "@/assets/blog/dog-colitis-treatment-at-home-treatments.webp";
import imgBonebroth from "@/assets/blog/dog-colitis-treatment-at-home-bonebroth.webp";

/** ----------------------------------------------------------------
 * Dog Colitis Treatment at Home — A Pet Parent's Field Guide
 *
 * Primary keyword: "dog colitis treatment at home" (vol 2,400 / KD 14).
 * Secondary keywords woven into H2/H3s and copy:
 *   - colitis in dogs home remedy
 *   - dog colitis symptoms
 *   - what to feed a dog with colitis
 *   - dog colitis bland diet
 *   - slippery elm for dogs colitis
 *   - probiotics for dog colitis
 *   - pumpkin for dog colitis
 *   - acute colitis in dogs / chronic colitis in dogs treatment
 *   - bone broth for dogs with colitis
 * ---------------------------------------------------------------- */

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "intro", label: "What is colitis" },
  { id: "types", label: "Acute vs. chronic" },
  { id: "redflags", label: "Emergency red flags" },
  { id: "treatments", label: "7 home treatments" },
  { id: "stop", label: "When to stop" },
  { id: "prevention", label: "Prevention" },
  { id: "faq", label: "FAQs" },
  { id: "references", label: "References" },
];

const TREATMENTS = [
  {
    icon: Leaf,
    title: "Bland Diet — 48-Hour Protocol",
    body: "Boiled skinless chicken breast + plain white rice (1:2 ratio). Short food rest of 12 hours first, then 3–4 small meals per day at roughly ⅓–½ cup per 10 lb. Transition back over 3–5 days. Evidence: moderate. Avoid seasoning, garlic, onion, and fat.",
  },
  {
    icon: FlaskConical,
    title: "Probiotics — Strain Guide",
    body: "Strains with the best evidence in dogs: Enterococcus faecium SF68, Bifidobacterium animalis AHC7, Lactobacillus acidophilus. Follow the label on vet-formulated products. Continue 5–7 days after symptoms resolve.",
  },
  {
    icon: Droplets,
    title: "Slippery Elm — Dosage by Weight",
    body: "Mix ¼–2 tsp powder (by weight — see table below) in warm water to form a gel; add to food before meals, twice daily. Coats and soothes the inflamed colon lining. Use for up to 7 days; longer courses need vet supervision.",
  },
  {
    icon: PawPrint,
    title: "Pumpkin Fiber",
    body: "Plain canned pumpkin only — no pie filling. Dose: 1–2 tsp (under 10 lb), 1–2 tbsp (10–30 lb), 2–3 tbsp (30–60 lb), 3–4 tbsp (over 60 lb). Soluble fibre absorbs excess colon water and firms stool.",
  },
  {
    icon: Thermometer,
    title: "Bone Broth",
    body: "Homemade: plain chicken carcass or beef knuckle, cold water, 2 tbsp apple cider vinegar. Simmer 12–24 hours. Skim foam, cool, remove fat, strain. Serve plain at room temperature. Avoid onion, garlic, and salt — all toxic to dogs.",
  },
  {
    icon: Zap,
    title: "Controlled Fasting",
    body: "12–24 hours of food withdrawal (water always available) at the start of an acute episode lets the gut's motility reset. Not appropriate for puppies, toy breeds, diabetic dogs, or pregnant dogs.",
  },
  {
    icon: ShieldCheck,
    title: "Hydration Support",
    body: "Offer cool fresh water frequently. Add a splash of low-sodium bone broth to the bowl to encourage drinking. Unflavoured Pedialyte at 25% concentration is sometimes used for electrolytes. Check gums every few hours — slick and pink is good; tacky = call the vet.",
  },
];

const RED_FLAGS = [
  "Large amounts of blood in stool, or stool resembling raspberry jam",
  "Dark or tarry stools — points to upper GI bleeding, needs urgent assessment",
  "Repeated vomiting alongside diarrhoea (dog cannot retain water)",
  "Dry or tacky gums, skin that stays tented, sunken eyes (dehydration)",
  "Lethargy, collapse, pale gums, rapid breathing or rapid heart rate",
  "Puppies under 6 months, very small breeds, senior dogs, or dogs on immunosuppressants showing any bloody stool",
  "Symptoms not improving after 72 hours despite home treatment",
];

const REFERENCES = [
  "VCA Animal Hospitals (2020). Colitis in Dogs. VCA Animal Hospitals.",
  "Cornell University College of Veterinary Medicine (2020). Inflammatory Bowel Disease in Dogs and Cats. Cornell Feline Health Center.",
  "Crysler Animal Hospital (2022). Stress Colitis in Dogs.",
  "True Animal Care (2023). Food Intolerance and Colitis in Dogs.",
  "MSD Veterinary Manual (2022). Probiotics and Gastrointestinal Disease in Small Animals. Merck Veterinary Manual.",
  "Journal of Veterinary Internal Medicine (2020). Randomised controlled trial of a probiotic in dogs with acute diarrhoea. JVIM.",
  "Plumb's Veterinary Drug Handbook (2023). Slippery Elm (Ulmus rubra). 10th edition.",
];

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

export default function DogColitisTreatmentAtHomeGuide() {
  const [progress, setProgress] = useState(0);

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
            Field Guide · Canine Health
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
                <Stethoscope className="h-3.5 w-3.5" /> Canine Gastroenterology
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 12 min read
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.02] text-ink-deep">
              Dog colitis,
              <br />
              <span className="italic text-accent">treated at home.</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-deep/80 max-w-xl leading-relaxed">
              Mucus-streaked stool. Urgent, repeated trips outside. This guide
              walks you through seven vet-backed home treatments — with real
              dosage numbers — and tells you exactly when to stop and call your
              vet instead.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="rounded-full bg-ink-deep text-primary-foreground hover:bg-ink-deep/90"
                onClick={() =>
                  document
                    .getElementById("treatments")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See the 7 treatments
              </Button>
              <a href="/gut-health-dogs">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-ink-deep/20"
                >
                  Gut support for dogs
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src={hero}
                alt="Dog resting comfortably — illustrative imagery for colitis home treatment guide"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-ink-deep/80 to-transparent">
                <p className="font-serif text-lg text-primary-foreground italic">
                  "Most mild cases resolve within 48–72 hours with the right home protocol."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="container py-16">
        <article className="space-y-20 max-w-3xl mx-auto">

          {/* Static TOC */}
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
              <span>Educational only — not a substitute for veterinary diagnosis. Pain, blood, or systemic illness need a clinician.</span>
            </div>
          </nav>

          {/* Chapter 01 — What is colitis */}
          <section id="intro" className="scroll-mt-24">
            <SectionLabel n="01" title="What is colitis in dogs?" />
            <p className="font-serif text-2xl md:text-3xl leading-[1.3] text-ink-deep first-letter:font-serif first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
              Colitis means inflammation of the colon — the large intestine —
              and it's one of the most common reasons dogs produce
              mucus-streaked or bloody diarrhea with straining.
            </p>
            <p className="mt-6 text-base leading-relaxed text-foreground/80">
              Unlike small-intestine diarrhea, which tends to be high-volume and
              watery, large-bowel diarrhea is characterised by frequent
              small-volume attempts, urgency, straining (tenesmus), and a
              jelly-like mucus coating on the stool. Fresh red blood in the
              stool — hematochezia — is common because the inflamed colon lining
              is fragile. In the context of an otherwise bright dog with a clear
              dietary trigger, a small amount of blood is not automatically an
              emergency. Volume, frequency, and your dog's overall demeanour are
              the deciding factors.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              Other recognisable signs at home include frequent urgent trips
              outside with little stool produced, mucus or jelly coating on
              stool, straining sometimes mistaken for constipation, gas and
              audible gut gurgling (borborygmi), and accidents indoors in a
              previously reliable dog. Mild cases often resolve within 48 to 72
              hours with conservative home management. The trouble is knowing
              when mild tips into something more serious.
            </p>
          </section>

          {/* Chapter 02 — Acute vs chronic */}
          <section id="types" className="scroll-mt-24">
            <SectionLabel n="02" title="Acute vs. chronic colitis" />
            <figure className="mb-8 -mx-2 sm:mx-0">
              <img
                src={imgTypes}
                alt="A dog's bland diet meal beside herbal supplements — illustrating acute versus chronic colitis management approaches"
                className="w-full rounded-2xl shadow-md aspect-[3/2] object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              <strong className="text-ink-deep">Acute colitis</strong> comes on
              suddenly — usually within hours — and may resolve within a few
              days when there is a clear trigger: a bin-raiding session, a new
              bag of food, a stressful boarding stay, or fireworks. The dog is
              typically otherwise normal: eating, alert, willing to walk. Acute
              stress colitis and dietary-indiscretion colitis are the two most
              common forms in general practice, and both respond well to
              conservative management.
            </p>
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              <strong className="text-ink-deep">Chronic colitis</strong> is
              defined as symptoms lasting more than three weeks, or symptoms that
              recur regularly. Common underlying drivers include food
              intolerance, inflammatory bowel disease (IBD), intestinal
              parasites (especially whipworms), and bacterial infections — plus,
              less commonly in younger dogs, neoplasia. Certain breeds appear
              in chronic colitis and IBD case series more often than others,
              including Boxers and German Shepherds.
            </p>
            <div className="p-5 rounded-xl bg-secondary/40 border border-border">
              <p className="text-sm leading-relaxed text-foreground/85">
                <strong className="text-ink-deep">The practical line:</strong>{" "}
                Acute colitis with a known trigger in an otherwise healthy adult
                dog is a reasonable candidate for 48-hour home management.
                Chronic, recurrent, or unexplained colitis needs a veterinary
                diagnosis first — the treatments below soothe symptoms but
                don't fix parasites, IBD, or food allergy.
              </p>
            </div>
          </section>

          {/* Chapter 03 — Red flags */}
          <section id="redflags" className="scroll-mt-24">
            <SectionLabel n="03" title="Emergency red flags ⚠️" />
            <figure className="mb-8 -mx-2 sm:mx-0">
              <img
                src={imgRedflags}
                alt="Veterinarian examining a dog gently — knowing when colitis requires professional care"
                className="w-full rounded-2xl shadow-md aspect-[3/2] object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              Stop home treatment and contact your vet or an emergency clinic
              immediately if your dog shows any of the following:
            </p>
            <ul className="space-y-3 text-base leading-relaxed text-foreground/85">
              {RED_FLAGS.map((flag, i) => (
                <li key={i} className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-5 rounded-xl bg-ink-deep text-primary-foreground">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-2">
                Lower your threshold for these dogs
              </div>
              <p className="text-sm leading-relaxed">
                Puppies under 6 months, very small breeds (under 5 kg), senior
                dogs (over 9 years), and dogs with chronic disease or on
                immunosuppressants dehydrate and deteriorate faster than healthy
                adults. A case that looks mild in a large adult dog can become
                critical in these patients within hours. When in doubt, call.
              </p>
            </div>
          </section>

          {/* Chapter 04 — 7 treatments */}
          <section id="treatments" className="scroll-mt-24">
            <SectionLabel n="04" title="7 home treatments with protocols" />
            <p className="text-base leading-relaxed text-foreground/80 mb-8">
              These protocols apply to mild, acute colitis in an otherwise
              healthy adult dog with no red flags. Start with Treatment 1 and
              layer in 2 and 3 within the first 24 hours. Treatments 4 through
              7 are supportive additions.
            </p>
            <figure className="mb-10 -mx-2 sm:mx-0">
              <img
                src={imgTreatments}
                alt="Home colitis treatment ingredients — chicken, rice, slippery elm, pumpkin, and probiotics laid out on linen"
                className="w-full rounded-2xl shadow-md aspect-[3/2] object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>

            {/* Treatment cards */}
            <div className="space-y-6">
              {TREATMENTS.map((t, i) => (
                <div key={t.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground tabular-nums font-medium">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <t.icon className="h-5 w-5 text-accent shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-ink-deep mb-1.5">{t.title}</h3>
                    <p className="text-sm text-foreground/75 leading-relaxed">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slippery elm dosage table */}
            <div className="mt-10">
              <h3 className="font-serif text-xl text-ink-deep mb-4">
                Slippery elm dosage by weight
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium text-ink-deep">Dog weight</th>
                      <th className="px-4 py-3 font-medium text-ink-deep">Powder dose</th>
                      <th className="px-4 py-3 font-medium text-ink-deep">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Under 10 lb", "¼ tsp", "2× daily before meals"],
                      ["10–25 lb", "½ tsp", "2× daily before meals"],
                      ["25–50 lb", "1 tsp", "2× daily before meals"],
                      ["Over 50 lb", "1½–2 tsp", "2× daily before meals"],
                    ].map(([weight, dose, freq], i) => (
                      <tr key={weight} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                        <td className="px-4 py-3 font-medium text-ink-deep">{weight}</td>
                        <td className="px-4 py-3 text-foreground/75">{dose}</td>
                        <td className="px-4 py-3 text-foreground/75">{freq}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bone broth */}
            <div className="mt-10">
              <h3 className="font-serif text-xl text-ink-deep mb-4">
                Safe bone broth recipe
              </h3>
              <figure className="mb-6 -mx-2 sm:mx-0">
                <img
                  src={imgBonebroth}
                  alt="A ceramic bowl of golden bone broth for dogs — safe homemade recipe for colitis recovery"
                  className="w-full rounded-2xl shadow-md aspect-[3/2] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <ol className="space-y-3 text-sm leading-relaxed text-foreground/85 list-decimal pl-5 marker:text-accent marker:font-medium">
                <li>Use plain chicken carcass or beef knuckle (or 500 g chicken feet for extra gelatin).</li>
                <li>Cover with cold water. Add 2 tbsp apple cider vinegar to draw out minerals.</li>
                <li>Simmer on very low heat for 12–24 hours. Skim foam in the first hour.</li>
                <li>Cool completely. Skim off and discard the fat layer.</li>
                <li>Strain and refrigerate. The broth should gel when cold — that's the collagen.</li>
                <li>Serve plain at room temperature: 2–4 tbsp for small dogs, ½ cup for large dogs.</li>
              </ol>
              <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-foreground/80 leading-relaxed">
                <strong className="text-destructive">Avoid without exception:</strong>{" "}
                Onion, garlic, leeks, chives, salt, any seasoning, and onion powder — all toxic to dogs.
              </div>
            </div>

            {/* Bland diet protocol table */}
            <div className="mt-10">
              <h3 className="font-serif text-xl text-ink-deep mb-4">
                Bland diet 48-hour protocol
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium text-ink-deep">Phase</th>
                      <th className="px-4 py-3 font-medium text-ink-deep">Duration</th>
                      <th className="px-4 py-3 font-medium text-ink-deep">What to do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Food rest", "0–12 hours", "Withhold food; keep fresh water available at all times"],
                      ["Introduction", "12–24 hours", "1 part boiled chicken to 2 parts cooked white rice; small frequent meals"],
                      ["Bland diet", "24–48 hours", "3–4 small meals/day; ~⅓–½ cup cooked food per 10 lb body weight per day"],
                      ["Transition", "Day 3–5", "25% regular food + 75% bland, then increase the ratio over 3–4 more days"],
                    ].map(([phase, dur, what], i) => (
                      <tr key={phase} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                        <td className="px-4 py-3 font-medium text-ink-deep">{phase}</td>
                        <td className="px-4 py-3 text-foreground/75">{dur}</td>
                        <td className="px-4 py-3 text-foreground/75">{what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Chapter 05 — When to stop */}
          <section id="stop" className="scroll-mt-24">
            <SectionLabel n="05" title="When home treatment stops working" />
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              Return to or contact your vet if any of these apply:
            </p>
            <ul className="space-y-3 text-base leading-relaxed text-foreground/85">
              {[
                "No improvement in stool consistency after 48 hours on the bland diet",
                "Blood in stool increases rather than decreases",
                "Your dog stops drinking voluntarily",
                "Your dog becomes lethargic, stops eating, or seems painful",
                "Symptoms resolve then return within a week — recurrence points to an underlying cause",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base leading-relaxed text-foreground/80">
              Repeated colitis episodes are one of the most common reasons to
              pursue a dietary elimination trial, fecal parasite testing, and
              in some cases endoscopy and biopsy. Recurring symptoms often point
              to the need for diet changes and a formal diet trial rather than
              repeated short-term home treatment.
            </p>
          </section>

          {/* Chapter 06 — Prevention */}
          <section id="prevention" className="scroll-mt-24">
            <SectionLabel n="06" title="Prevention" />
            <p className="text-base leading-relaxed text-foreground/80 mb-6">
              Most acute colitis episodes are preventable. These five habits
              address the most common triggers:
            </p>
            <ol className="space-y-4 text-base leading-relaxed text-foreground/85 list-decimal pl-5 marker:text-accent marker:font-medium">
              <li>
                <strong>Transition food slowly.</strong> Move to any new food
                over 7–10 days (25% → 50% → 75% → 100%). Sudden diet shifts
                are the single most common cause of acute colitis.
              </li>
              <li>
                <strong>Restrict access to rubbish, compost, and table scraps.</strong>{" "}
                Dietary indiscretion — eating garbage, bones, or high-fat
                scavenged food — is the other major trigger in otherwise healthy
                dogs.
              </li>
              <li>
                <strong>Manage stress events proactively.</strong> Before
                boarding, travel, or fireworks, start a probiotic 5–7 days
                ahead. For known stress-reactive dogs, ask your vet about
                anxiolytics or pheromone products.
              </li>
              <li>
                <strong>Keep parasite prevention current.</strong> Whipworms
                require specific anthelminthics and are a commonly overlooked
                cause of recurrent large-bowel diarrhoea.
              </li>
              <li>
                <strong>Annual fecal testing</strong> even in dogs on
                preventatives — giardia and whipworms can evade some standard
                products.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24">
            <SectionLabel n="07" title="Frequently asked questions" />
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
            <SectionLabel n="08" title="References & further reading" />
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5 leading-relaxed">
              {REFERENCES.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-muted-foreground/80">
              Educational content only — does not replace individualised
              veterinary diagnosis or treatment.
            </p>
          </section>

          {/* Reviewer attribution */}
          <ReviewedByDrAlex />

          {/* Final CTA */}
          <section className="scroll-mt-24 bg-ink-deep text-primary-foreground rounded-3xl p-10 lg:p-14">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">
              Ready to support your dog's gut?
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">
              Calm gut. Better days. Without another vet bill.
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed max-w-xl mb-7">
              For mild colitis, home treatment buys you 48 hours. If your dog
              needs longer-term support — recurring soft stools, sensitive
              digestion, or post-colitis recovery — a daily herbal supplement
              formulated for canine gut health can help maintain the microbiome
              between flare-ups.
            </p>
          </section>

        </article>
      </div>
    </div>
  );
}
