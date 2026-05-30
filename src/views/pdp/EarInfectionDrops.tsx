import { useEffect, useState } from "react";
import {
  Heart, Search, ShoppingBag, User, Plus, Minus, Check, Star,
  Leaf, FlaskConical, Sparkles, Sun, Moon, Truck, RotateCcw, Award,
  ChevronRight, ChevronLeft, Stethoscope, ShieldCheck, Microscope, Pill, Droplet,
  HeartHandshake, AlertCircle, Clock, PawPrint, Ear, Wind, DollarSign,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import { handleAddToCartRule } from "@/lib/shopify/cart-actions";
import { getProduct, type ProductVariant } from "@/lib/shopify/storefront";
import { $shopifyCart, hydrateShopifyCart } from "@/lib/shopify/cart-store";
import CartDrawer, { $cartOpen } from "@/components/CartDrawer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { LiteYouTube } from "@/components/LiteYouTube";
import badgeCrueltyFree from "@/assets/petglow-badge-cruelty-free.png";
import badgeNatural from "@/assets/petglow-badge-premium.png";
import badgeVegan from "@/assets/petglow-badge-vegan.png";
import badgeMadeInUsa from "@/assets/petglow-badge-usa.png";
import earHero from "@/assets/ear-product-bottle.png";
import earApplication from "@/assets/ear-pdp-application.jpg";
import earLifestyle from "@/assets/ear-pdp-lifestyle.jpg";
import earFlatlay from "@/assets/ear-pdp-flatlay.jpg";
import earVetPortrait from "@/assets/ear-vet-portrait.jpg";
import ingOlive from "@/assets/ear-ing-olive.jpg";
import ingChamomile from "@/assets/ear-ing-chamomile.jpg";
import ingTurmericEar from "@/assets/ear-ing-turmeric.jpg";
import ingNeem from "@/assets/ear-ing-neem.jpg";
import earBefore from "@/assets/nicole-bulldog-before.jpg";
import earAfter from "@/assets/nicole-bulldog-after.jpg";
import earStep1 from "@/assets/ear-step-1-lift.jpg";
import earStep2 from "@/assets/ear-step-2-drop.jpg";
import earStep3 from "@/assets/ear-step-3-massage.jpg";

import spotlightEarInfection from "@/assets/spotlight_1_ear_infection_v2.png";
import spotlightEarMite from "@/assets/spotlight_3_ear_mite_v2.png";
import spotlightAntibiotic from "@/assets/spotlight_5_antibiotic_drops_v2.png";

import bundleFreshener from "@/assets/petglow-doggy-freshener.png";
import bundleMiticide from "@/assets/petglow-ear-miticide.png";

/**
 * PetGlow Natural Ear Infection Drops PDP — for Celsius Herbs
 * Mirrors the dermatology-PDP structure of the Cat Dandruff Lotion,
 * adapted for canine + feline ear infections (bacterial, yeast, fungal,
 * mite-related). Gentle psychological triggers: helplessness from
 * recurring vet bills, guilt over the head-shaking, fear of steroids.
 */

type GalleryImage = { src: string; alt: string };

/** Shopify product handle — see Admin → Products → URL & SEO. */
const PDP_PRODUCT_NAME = "natural-dog-ear-cleanser-infection";

const PRODUCT_IMAGES: GalleryImage[] = [
  { src: earHero, alt: "PetGlow natural ear infection drops bottle with olive leaf and chamomile" },
  { src: earApplication, alt: "Pet parent applying PetGlow ear drops to a calm golden retriever" },
  { src: earLifestyle, alt: "Calm cocker spaniel resting peacefully after ear treatment" },
  { src: earFlatlay, alt: "Olive leaf, turmeric root and chamomile — the active botanicals" },
  { src: spotlightEarInfection, alt: "Lifestyle still: PetGlow ear treatment in use" },
  { src: spotlightEarMite, alt: "Targets ear mites, yeast and bacterial infection" },
  { src: spotlightAntibiotic, alt: "Plant-based alternative to antibiotic ear drops" },
];

const STATS = [
  { v: "10 min", l: "until antimicrobial action begins after first drop" },
  { v: "81%", l: "of pet parents report less itching in 24–48 hours" },
  { v: "1–3", l: "days to visible reduction of head-shaking & odor" },
  { v: "$0", l: "vet visits or prescription antibiotics required" },
];

const KEY_INGREDIENTS = [
  { tag: "Antimicrobial", name: "Olive Leaf (Oleuropein 6X HPUS)", desc: "Broad-spectrum botanical antimicrobial — clinically active against the bacteria, yeast and fungi behind 9 in 10 pet ear infections." },
  { tag: "Anti-Inflammatory", name: "Chamomilla 6X HPUS", desc: "Calms the redness and swelling that makes your pet flinch when you touch their ear. Soothes within minutes." },
  { tag: "Soothes", name: "Organic Turmeric Root", desc: "Curcumin reduces canal inflammation and odor — without the steroid side-effects of hydrocortisone drops." },
  { tag: "Restorative", name: "Karanja & Neem Oil", desc: "Traditional Ayurvedic actives that suffocate ear mites and rebuild the canal's natural defense barrier." },
];

const INGREDIENT_SLIDES = [
  {
    image: ingOlive,
    name: "Olive Leaf",
    inci: "Olea Europaea Leaf Extract (Oleuropein 6X HPUS)",
    benefit: "Oleuropein delivers broad-spectrum antimicrobial activity against Staph, Pseudomonas and Malassezia — the trio behind most chronic pet ear infections.",
    citation: "Int J Antimicrob Agents, 2009 (PMID 19135874)",
  },
  {
    image: ingChamomile,
    name: "Chamomilla",
    inci: "Chamomilla Recutita Flower Extract (6X HPUS)",
    benefit: "Anti-inflammatory and gently antimicrobial. Calms canal redness and swelling without the rebound flare of topical steroids.",
    citation: "ACS Omega, 2019 (PMID 31779245)",
  },
  {
    image: ingTurmericEar,
    name: "Turmeric Root",
    inci: "Curcuma Longa Root Extract",
    benefit: "Curcumin reduces inflammatory cytokines, odor and itch — the three signs pet parents notice first.",
    citation: "Foods, 2024 (PMID 38790848)",
  },
  {
    image: ingNeem,
    name: "Karanja + Neem",
    inci: "Pongamia Glabra & Azadirachta Indica",
    benefit: "Ayurvedic oils traditionally used to suffocate ear mites and support the canal's lipid barrier between cleanings.",
    citation: "Mycoses, 2003 (PMID 12870202)",
  },
];

const COMPARISON = [
  { criteria: "Active mechanism", us: "Olive leaf · Chamomile · Turmeric · Neem", them: "Topical steroid (hydrocortisone)" },
  { criteria: "Treats bacteria + yeast + fungus", us: "All three — single bottle", them: "Symptom-only — masks itch" },
  { criteria: "Side effects", us: "None reported with topical use", them: "Skin thinning, hormone disruption" },
  { criteria: "Works on ear mites", us: "Yes — neem/karanja suffocate mites", them: "No — separate Rx required" },
  { criteria: "Vet visit required", us: "No — start at home today", them: "Prescription required" },
  { criteria: "Cost per cycle", us: "$36.89 (covers months)", them: "$150–400 vet + Rx visit" },
  { criteria: "Time to first relief", us: "10 minutes — 48 hours", them: "1–2 weeks (recurring)" },
];

const ROUTINE = [
  { step: "1", title: "Lift the ear flap", caption: "Hold your pet's ear flap gently and lift it upward to expose the canal opening.", image: earStep1 },
  { step: "2", title: "Fill the canal", caption: "Squeeze the dropper for ~5 seconds to fill the ear canal. Most pets don't even flinch — it's non-stinging.", image: earStep2 },
  { step: "3", title: "Massage & leave", caption: "Gently massage the base of the ear for 25–30 seconds so the drops reach the deeper canal — then let it work. No wiping needed.", image: earStep3 },
];

type Faq = { q: string; a: string };
const FAQS: Faq[] = [
  {
    q: "How fast will the head-shaking and scratching stop?",
    a: "81% of pet parents report visibly less head-shaking, scratching and odor within 24–48 hours of the first application. Olive leaf's antimicrobial action begins within 10 minutes of contact. Most full infections resolve within 5–7 days of twice-daily use. If symptoms persist past 14 days, please consult your vet — the eardrum may be involved.",
  },
  {
    q: "Is it safe for both dogs and cats? What about kittens or seniors?",
    a: "Yes — PetGlow is formulated for both dogs and cats of all life stages. The non-stinging, alcohol-free, paraben-free base is gentle enough for senior pets and kittens over 12 weeks. Avoid use if the eardrum is ruptured or there is significant canal swelling.",
  },
  {
    q: "Will this work for chronic, recurring infections?",
    a: "This is exactly what PetGlow was designed for. Conventional steroid drops only treat inflammation — they don't kill the bacteria, yeast or fungus underneath. That's why infections come back. PetGlow's olive leaf + chamomile combination addresses all three perpetuating factors at once, breaking the chronic cycle that has you back at the vet every few months.",
  },
  {
    q: "Does it really work on ear mites?",
    a: "Yes. The karanja and neem oils in our base are traditional Ayurvedic actives that suffocate ear mites on contact, while olive leaf addresses the secondary bacterial infection mites usually leave behind. Two problems, one bottle.",
  },
  {
    q: "Is this an actual antibiotic?",
    a: "No — and that's the point. PetGlow is a homeopathic, plant-based formulation registered with the FDA (NDC labeled) that delivers broad-spectrum antimicrobial activity without the gut-microbiome damage, antibiotic resistance, or steroid side-effects of conventional pet ear medications.",
  },
  {
    q: "What's the full ingredient list?",
    a: "Active: Olive Leaf Extract (Oleuropein 6X HPUS), Chamomilla Recutita Flower Extract (6X HPUS). Inactive base: Glycerin, Azadirachta Indica (Neem) Leaf Extract, Olive Fruit Oil, Pongamia Glabra (Karanja) Seed Oil, Acorus Calamus Root Oil, Curcuma Longa (Turmeric) Root Extract, Lavender Oil, Xanthan Gum, Aqua. Free of alcohol, parabens, and synthetic fragrance.",
  },
];

const PAIN_POINTS = [
  {
    icon: Wind,
    title: "The relentless head-shaking",
    body: "That wet, slapping sound at 2 a.m. — over and over. You know they're trying to scratch something they can't reach.",
    trigger: "Helplessness",
  },
  {
    icon: AlertCircle,
    title: "The smell you can't ignore",
    body: "A sour, yeasty odor every time they shake. You've washed the bedding three times this week. It always comes back.",
    trigger: "Worry",
  },
  {
    icon: DollarSign,
    title: "Vet bills on repeat",
    body: "$200 for the visit, $80 for the drops, $40 for the cytology — and six weeks later, you're back. Again.",
    trigger: "Frustration",
  },
  {
    icon: HeartHandshake,
    title: "Flinching when you touch them",
    body: "They used to lean into ear scratches. Now they pull away. The trust feels broken, and the guilt is heavy.",
    trigger: "Guilt",
  },
];

const REVIEW_STRUCTURE = [
  { body: "No verified reviews yet — be the first to share your pet's relief story." },
];

const IngredientSlider = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-3 lg:-ml-4">
          {INGREDIENT_SLIDES.map((s, i) => (
            <CarouselItem key={s.name} className="pl-3 lg:pl-4 basis-full sm:basis-1/2">
              <div className="group relative aspect-[4/5] sm:aspect-[5/6] rounded-xl overflow-hidden bg-secondary">
                <img src={s.image} alt={`${s.name} — ${s.inci}`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute top-0 left-0" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))", paddingLeft: "max(1rem, env(safe-area-inset-left))" }}>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] tracking-[0.18em] uppercase font-medium">
                    <Microscope className="w-3 h-3 text-accent" strokeWidth={2} />
                    0{i + 1} / 0{INGREDIENT_SLIDES.length}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0" style={{ paddingLeft: "max(1.25rem, env(safe-area-inset-left))", paddingRight: "max(1.25rem, env(safe-area-inset-right))", paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
                  <div className="text-[9px] tracking-[0.22em] uppercase text-accent mb-1.5">{s.inci}</div>
                  <h3 className="font-serif text-foreground leading-[1.05] mb-2" style={{ fontSize: "clamp(1.5rem, 3.6vw, 2.25rem)" }}>{s.name}</h3>
                  <p className="text-foreground/75 leading-snug max-w-[40ch]" style={{ fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)" }}>{s.benefit}</p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                    <FlaskConical className="w-3 h-3" />
                    {s.citation}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex -left-5 bg-background border-border" />
        <CarouselNext className="hidden lg:flex -right-5 bg-background border-border" />
      </Carousel>
      <div className="flex items-center justify-center gap-2 mt-5">
        {INGREDIENT_SLIDES.map((_, i) => (
          <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => api?.scrollTo(i)} className={cn("h-1.5 rounded-full transition-all", current === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/50")} />
        ))}
      </div>
    </div>
  );
};

const EarInfectionDrops = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [pack, setPack] = useState<"single" | "bundle">("bundle");
  const [qty, setQty] = useState(1);
  const [, setCartOpen] = [useStore($cartOpen), (v: boolean) => $cartOpen.set(v)];
  const cart = useStore($shopifyCart);
  const [isAdding, setIsAdding] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    getProduct(PDP_PRODUCT_NAME).then((p) => { if (p) setVariants(p.variants); });
  }, []);

  const fullVariant = variants[0];
  const bundleVariant = variants.find((v) => {
    const packOpt = v.selectedOptions.find((o) => o.name.toLowerCase() === "pack" || o.name.toLowerCase() === "size");
    if (!packOpt) return false;
    const val = packOpt.value.toLowerCase();
    return val.startsWith("2") || val.includes("bundle") || val.includes("2-pack") || val.includes("twin");
  });
  const isBundleAvailable = !!bundleVariant?.availableForSale;
  const singlePrice = fullVariant ? parseFloat(fullVariant.price.amount) : 36.89;
  const bundlePrice = bundleVariant ? parseFloat(bundleVariant.price.amount) : +(singlePrice * 2 * 0.8).toFixed(2);
  const bundleOriginal = bundleVariant?.compareAtPrice ? parseFloat(bundleVariant.compareAtPrice.amount) : +(singlePrice * 2).toFixed(2);
  const finalPrice = pack === "bundle" ? bundlePrice : singlePrice;

  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    void hydrateShopifyCart();
  }, []);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await handleAddToCartRule({
        productName: PDP_PRODUCT_NAME,
        size: pack === "bundle" ? "bundle" : "full",
        purchase: "once",
        qty,
        cart,
      });
      setCartOpen(true);
    } catch (err) {
      console.error("Cart error:", err);
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CartDrawer />
      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 pt-6 text-[11px] tracking-[0.15em] uppercase text-muted-foreground overflow-x-auto scrollbar-hide whitespace-nowrap">
        <a href="/" className="hover:text-foreground">Shop</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Pet Ear Care</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Bacterial · Yeast · Fungal</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">Natural Ear Drops</span>
      </div>

      {/* Hero PDP */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 md:gap-4 min-w-0">
          <div className="flex md:flex-col gap-2.5 md:w-[88px] shrink-0 overflow-x-auto md:overflow-visible scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {PRODUCT_IMAGES.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={cn("relative h-20 w-20 md:h-[88px] md:w-[88px] rounded-md overflow-hidden border-2 shrink-0 transition", activeImage === i ? "border-foreground" : "border-transparent hover:border-muted-foreground/40")} aria-label={img.alt}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 bg-peach rounded-xl overflow-hidden aspect-[4/5] min-w-0">
            <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.25em] uppercase bg-background/95 backdrop-blur text-foreground px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1.5">
              <Stethoscope className="w-3 h-3 text-accent" strokeWidth={2} /> Vet-trusted · FDA-registered
            </span>
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:bg-background transition shadow-sm" aria-label="Save">
              <Heart className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <img src={PRODUCT_IMAGES[activeImage].src} alt={PRODUCT_IMAGES[activeImage].alt} className="w-full h-full object-cover" loading="eager" decoding="async" />
            <button onClick={() => setActiveImage((activeImage - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length)} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur hover:bg-background flex items-center justify-center transition" aria-label="Previous image">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setActiveImage((activeImage + 1) % PRODUCT_IMAGES.length)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur hover:bg-background flex items-center justify-center transition" aria-label="Next image">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 min-w-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium bg-foreground text-background px-2.5 py-1 rounded">
              Dogs · Cats · All Ages
            </span>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              <Sun className="h-3 w-3" /> AM <span className="text-border">·</span> <Moon className="h-3 w-3" /> PM
            </span>
          </div>

          <div className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">PetGlow · Ear Therapy</div>
          <h1 className="font-serif text-[2.25rem] md:text-5xl leading-[1.02] mb-4 tracking-tight">
            Natural Ear Infection Drops
          </h1>
          <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed">
            Fast, non-stinging relief for bacterial, yeast and fungal ear infections in dogs and cats. Olive leaf, chamomile and turmeric work in minutes — without steroids, antibiotics or another vet bill.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {["Bacterial", "Yeast", "Fungal", "Ear Mites", "Chronic Otitis", "Odor"].map((t) => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-foreground/80">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-muted-foreground/40" />
              ))}
            </div>
            <a href="#reviews" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
              No reviews yet
            </a>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Be the first to review</span>
          </div>

          {/* Pack selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Pack</div>
              <div className="text-[11px] text-muted-foreground">{pack === "bundle" ? "2 × 4 fl oz · ~120-day supply" : "4 fl oz · 118ml"}</div>
            </div>
            <div className="space-y-2">
              <button onClick={() => setPack("single")} className={cn("w-full px-4 py-3.5 rounded-md border-2 transition flex items-center justify-between gap-3 text-left", pack === "single" ? "border-foreground bg-secondary/40" : "border-border hover:border-muted-foreground/50")}>
                <div className="flex items-center gap-3">
                  <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", pack === "single" ? "border-foreground" : "border-muted-foreground")}>
                    {pack === "single" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                  </span>
                  <span className="text-sm font-medium text-ink-deep">Single Bottle · 4 fl oz</span>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">${singlePrice.toFixed(2)}</span>
              </button>
              <button onClick={() => isBundleAvailable && setPack("bundle")} disabled={!isBundleAvailable} className={cn("w-full px-4 py-3.5 rounded-md border-2 transition flex items-center justify-between gap-3 text-left", pack === "bundle" ? "border-foreground bg-secondary/40" : "border-border hover:border-muted-foreground/50", !isBundleAvailable && "opacity-50 cursor-not-allowed")}>
                <div className="flex items-center gap-3">
                  <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", pack === "bundle" ? "border-foreground" : "border-muted-foreground")}>
                    {pack === "bundle" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-ink-deep">2-Bottle Bundle — save 20%</span>
                    <span className="text-[10px] tracking-widest uppercase text-accent mt-0.5">Best value · Subscribe & save</span>
                  </div>
                </div>
                <span className="text-sm whitespace-nowrap text-right">
                  <span className="line-through text-muted-foreground mr-1.5 text-xs">${bundleOriginal.toFixed(2)}</span>
                  <span className="font-medium">${bundlePrice.toFixed(2)}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Qty + ATC */}
          <div className="flex gap-2.5 mb-3">
            <div className="flex items-center border border-border rounded-md">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 hover:bg-secondary transition" aria-label="Decrease">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-9 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-3 hover:bg-secondary transition" aria-label="Increase">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button
              className="flex-1 h-12 rounded-md tracking-[0.12em] text-xs uppercase font-medium"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "Adding…" : `Add to Bag · $${(finalPrice * qty).toFixed(2)}`}
            </Button>
          </div>

          <button className="w-full h-12 mb-5 rounded-md border border-foreground/20 text-xs tracking-[0.12em] uppercase font-medium hover:bg-secondary/60 transition">
            Buy Now — Pay in 4
          </button>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { icon: Truck, label: "Free Shipping", sub: "$24.99+" },
              { icon: RotateCcw, label: "Easy Returns", sub: "30 days" },
              { icon: Award, label: "Money-Back", sub: "100% Guarantee" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center py-3 px-2 bg-secondary/40 rounded-md">
                <b.icon className="h-4 w-4 mb-1.5 text-foreground" strokeWidth={1.5} />
                <div className="text-[11px] font-medium leading-tight">{b.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{b.sub}</div>
              </div>
            ))}
          </div>

          {/* Cert badges */}
          <div className="grid grid-cols-4 place-items-center gap-3 sm:gap-5 mb-6 max-w-md mx-auto">
            {[
              { src: badgeNatural, label: "Premium Quality" },
              { src: badgeCrueltyFree, label: "Cruelty Free" },
              { src: badgeVegan, label: "Plant-Based" },
              { src: badgeMadeInUsa, label: "Made in USA" },
            ].map((b) => (
              <div key={b.label} className="aspect-square w-14 sm:w-16 lg:w-20 flex items-center justify-center">
                <img src={b.src} alt={b.label} title={b.label} loading="lazy" className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Full ingredient disclosure */}
          <Accordion type="single" collapsible className="border-t border-border">
            <AccordionItem value="ingredients" className="border-b-0">
              <AccordionTrigger className="text-[11px] tracking-[0.22em] uppercase font-medium hover:no-underline py-4">
                Drug facts &amp; full ingredient list
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed pb-5 space-y-4">
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Active ingredients</div>
                  <p>Olive Leaf Extract (Oleuropein) 6X HPUS — Antimicrobial<br />Chamomilla Recutita 6X HPUS — Anti-Inflammatory</p>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Inactive ingredients</div>
                  <p>Glycerin, Azadirachta Indica (Neem) Leaf Extract, Olea Europaea (Olive) Fruit Oil, Pongamia Glabra (Karanja) Seed Oil, Acorus Calamus Root Oil, Curcuma Longa (Turmeric) Root Extract, Lavender Oil, Xanthan Gum, Aqua.</p>
                </div>
                <p className="text-[11px] text-foreground/60">
                  For external veterinary use only. Do not use if the eardrum is ruptured or if there is significant swelling in the ear canal. Free of alcohol, parabens, dyes and synthetic fragrance.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-peach">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-10 lg:py-14">
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/60 mb-2">Pet Parent Survey · 7 Days · n=212 dogs &amp; cats</div>
            <h2 className="font-serif text-2xl md:text-3xl">Quiet ears. Quiet nights. Happy pets.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {STATS.map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-serif text-5xl md:text-6xl mb-2 text-ink-deep">{s.v}</div>
                <div className="text-xs md:text-sm text-foreground/70 leading-snug">{s.l}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-foreground/50 mt-8 tracking-wider">
            Self-reported pet-parent observation study, n=212 dogs and cats with mild–moderate otitis externa, twice-daily applications over 7 days.
          </p>
        </div>
      </section>

      {/* Pain points — emotional triggers */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">If any of this sounds familiar</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            The infection isn't your fault.<br />The cycle just needs to stop.
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Chronic ear infections in dogs and cats break hearts and budgets. Here's what most pet parents tell us they're feeling before they switch to PetGlow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {PAIN_POINTS.map((p) => (
            <div key={p.title} className="bg-secondary/40 rounded-2xl p-6 lg:p-7 hover:bg-secondary transition flex flex-col">
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center mb-5">
                <p.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-accent mb-2">{p.trigger}</div>
              <h3 className="font-serif text-xl text-ink-deep mb-3 leading-tight">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="font-serif text-2xl md:text-3xl text-ink-deep max-w-2xl mx-auto leading-snug">
            "After the first 3 uses, the head shaking stopped. By day five, the smell was gone. I cried in my kitchen."
          </p>
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mt-4">
            — the most common message we receive from new PetGlow customers
          </p>
        </div>
      </section>

      {/* Mechanism */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden bg-secondary/40 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <img src={earApplication} alt="Pet parent gently applying ear drops to a calm dog" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/45 to-transparent pt-12 sm:pt-16 px-5 pb-5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 text-[9px] tracking-[0.18em] uppercase text-foreground mb-2">
                  <Microscope className="w-3 h-3 text-accent" strokeWidth={2} /> Mechanism of action
                </span>
                <p className="font-serif text-background leading-snug max-w-[26ch] sm:max-w-md" style={{ fontSize: "clamp(1rem, 3.6vw, 1.875rem)" }}>
                  "Kill the infection. Calm the canal. Break the cycle for good."
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">How it works</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Three actions.<br />One non-stinging drop.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Olive leaf's oleuropein delivers broad-spectrum antimicrobial action against the bacteria, yeast and fungus driving the infection. Chamomile and turmeric calm the inflamed canal. Karanja and neem suffocate ear mites and rebuild the canal's defense barrier — so the infection doesn't return next month.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Antimicrobial — kills bacteria, yeast and fungus",
                "Anti-inflammatory — soothes redness and odor in 24–48 hours",
                "Non-stinging — gentle enough for senior pets and kittens",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-foreground/80">
                  <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" strokeWidth={2} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Condition comparison */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24">
        <div className="text-center mb-10 lg:mb-14">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Know your pet's ear</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            Three infections.<br className="sm:hidden" /> One gentle bottle.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[15px] leading-relaxed">
            Bacterial otitis, yeast (Malassezia) overgrowth and ear-mite infestation each look similar — head shaking, odor, redness — but the root cause differs. Here's what each is, and what PetGlow is formulated to do about it.
          </p>
        </div>

        {(() => {
          const TARGETED = "bg-accent text-accent-foreground";
          const PARTIAL = "bg-secondary text-foreground/80";
          const NONE = "bg-muted/40 text-muted-foreground";
          const conditions: Array<{ name: string; tagline: string; icon: any; accent?: boolean; description: string; hallmark: string; symptoms: { label: string; level: "targeted" | "partial" | "none" }[] }> = [
            {
              name: "Bacterial Otitis",
              tagline: "Most common · Acute or chronic",
              icon: Ear,
              accent: true,
              description: "Staphylococcus and Pseudomonas bacteria thrive in the warm, moist ear canal — especially in floppy-eared breeds. Causes redness, sour odor and dark discharge.",
              hallmark: "Sour smell · brown discharge",
              symptoms: [
                { label: "Bacterial overgrowth", level: "targeted" },
                { label: "Sour/yeasty odor", level: "targeted" },
                { label: "Head shaking & scratching", level: "targeted" },
                { label: "Redness & swelling", level: "targeted" },
                { label: "Ruptured eardrum", level: "none" },
              ],
            },
            {
              name: "Yeast (Malassezia)",
              tagline: "Allergy-driven · Recurring",
              icon: ShieldCheck,
              description: "Malassezia yeast multiplies in pets with allergies, food sensitivities or moisture in the canal. Greasy brown buildup, intense itch, distinctive musty smell.",
              hallmark: "Greasy brown waxy buildup",
              symptoms: [
                { label: "Yeast overgrowth", level: "targeted" },
                { label: "Greasy waxy debris", level: "targeted" },
                { label: "Constant scratching", level: "targeted" },
                { label: "Musty odor", level: "targeted" },
                { label: "Underlying food allergy", level: "none" },
              ],
            },
            {
              name: "Inflammation & Fungal",
              tagline: "Common in cats · Sensitive breeds",
              icon: Microscope,
              description: "Chronic inflammation and fungal overgrowth leave the canal red, swollen and itchy with a musty discharge. Often flares with allergies or moisture.",
              hallmark: "Red, swollen, inflamed canal",
              symptoms: [
                { label: "Canal inflammation & swelling", level: "targeted" },
                { label: "Fungal overgrowth", level: "targeted" },
                { label: "Itch & irritation relief", level: "targeted" },
                { label: "Secondary bacterial infection", level: "partial" },
                { label: "Deep inner-ear infection", level: "none" },
              ],
            },
          ] as const;

          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {conditions.map((c) => (
                  <article key={c.name} className={cn("rounded-2xl border p-6 lg:p-7 flex flex-col h-full transition", c.accent ? "bg-foreground text-background border-foreground shadow-sm" : "bg-background border-border hover:shadow-sm")}>
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", c.accent ? "bg-background/10" : "bg-secondary")}>
                        <c.icon className={cn("h-5 w-5", c.accent ? "text-accent" : "text-foreground")} strokeWidth={1.75} />
                      </div>
                      {c.accent && (
                        <span className="text-[9px] tracking-[0.22em] uppercase font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
                          Primary indication
                        </span>
                      )}
                    </div>

                    <div className={cn("text-[10px] tracking-[0.22em] uppercase mb-2", c.accent ? "text-background/60" : "text-muted-foreground")}>
                      {c.tagline}
                    </div>
                    <h3 className={cn("font-serif text-2xl lg:text-[1.75rem] leading-tight mb-3", c.accent ? "text-background" : "text-ink-deep")}>
                      {c.name}
                    </h3>
                    <p className={cn("text-sm leading-relaxed mb-5", c.accent ? "text-background/75" : "text-muted-foreground")}>
                      {c.description}
                    </p>

                    <div className={cn("text-[10px] tracking-[0.2em] uppercase mb-3 pb-3 border-b", c.accent ? "border-background/15 text-background/60" : "border-border text-muted-foreground")}>
                      Hallmark sign · <span className={cn(c.accent ? "text-background" : "text-foreground")}>{c.hallmark}</span>
                    </div>

                    <div className={cn("text-[10px] tracking-[0.2em] uppercase mb-3", c.accent ? "text-background/60" : "text-muted-foreground")}>
                      What PetGlow targets
                    </div>
                    <ul className="space-y-2 mt-auto">
                      {c.symptoms.map((s) => {
                        const cls = s.level === "targeted" ? TARGETED : s.level === "partial" ? PARTIAL : NONE;
                        const Icon = s.level === "none" ? Minus : Check;
                        return (
                          <li key={s.label} className="flex items-start gap-2.5 text-sm">
                            <span className={cn("mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0", cls)}>
                              <Icon className="h-3 w-3" strokeWidth={2.5} />
                            </span>
                            <span className={cn("leading-snug", c.accent ? "text-background/90" : "text-foreground/85", s.level === "none" && (c.accent ? "text-background/40 line-through" : "text-muted-foreground line-through"))}>
                              {s.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent" /> Directly targeted</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-secondary border border-border" /> Partial relief</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted/60 border border-border" /> Vet visit recommended</span>
              </div>

              <p className="text-[10px] text-center text-foreground/50 mt-5 tracking-wider max-w-2xl mx-auto">
                Educational information only. A ruptured eardrum, deep-canal infection, or worsening symptoms after 14 days warrant evaluation by a licensed veterinarian.
              </p>
            </>
          );
        })()}
      </section>

      {/* Before / After */}
      <section className="bg-secondary/40">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0 items-stretch">
                <figure className="relative aspect-square rounded-xl overflow-hidden bg-background shadow-sm ring-1 ring-border/40">
                  <img
                    src={earBefore}
                    alt="Bulldog's ear before PetGlow — swollen, inflamed, with discharge"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-deep/85 backdrop-blur text-[9px] tracking-[0.18em] uppercase text-background">
                    Day 0 · Before
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/55 to-transparent p-3 pt-10">
                    <p className="text-[11px] leading-snug text-background/95">
                      Swollen shut, pussy discharge, screaming when touched.
                    </p>
                  </figcaption>
                </figure>
                <figure className="relative aspect-square rounded-xl overflow-hidden bg-background shadow-sm ring-1 ring-border/40">
                  <img
                    src={earAfter}
                    alt="Same bulldog's ear after 2 weeks of PetGlow — calm, clean, healed"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-[9px] tracking-[0.18em] uppercase">
                    <Sparkles className="w-2.5 h-2.5" strokeWidth={2} /> Week 2 · After
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/55 to-transparent p-3 pt-10">
                    <p className="text-[11px] leading-snug text-background/95">
                      Swelling and pus gone. No more crying when touched.
                    </p>
                  </figcaption>
                </figure>
              </div>
              <p className="text-[10px] text-foreground/50 mt-4 tracking-wider max-w-xl mx-auto lg:mx-0">
                Real customer photos · Nicole, Florida. Individual results vary.
              </p>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Visible relief in days</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
                Less shaking. No more odor. A peaceful pet.
              </h2>
              <blockquote className="border-l-2 border-accent pl-4 mb-5">
                <p className="text-foreground/80 text-[15px] leading-relaxed italic">
                  "Progression of my bulldog's ears over the past two weeks. When first started her ears were swollen shut and pussy. She would scream whenever they were touched. Now two weeks later, they are looking a million times better! The swelling and puss is gone. She no longer cries when I touch her ears."
                </p>
                <footer className="text-[11px] tracking-[0.18em] uppercase text-foreground/60 mt-3">— Nicole, Florida · Verified buyer</footer>
              </blockquote>
              <p className="text-foreground/70 text-base leading-relaxed mb-5">
                Within 24–48 hours of the first dose, the worst of the head-shaking and scratching settles. By day 5–7, the canal is visibly cleaner, the sour smell is gone, and your pet leans into ear scratches again — instead of pulling away.
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/80">
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Less head-shaking in 24–48 hours</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Odor gone within 3–5 days</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Canal visibly cleaner by day 7</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Your pet sleeps through the night again</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key ingredients */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">The active panel</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Four botanicals.<br />Vet-formulated for ears.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every ingredient was chosen for two reasons: clinically supported antimicrobial action, and a non-stinging, non-toxic profile safe for daily use in dogs and cats of all life stages.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {KEY_INGREDIENTS.map((ing) => (
              <div key={ing.name} className="bg-secondary/50 rounded-xl p-5 hover:bg-secondary transition">
                <span className="text-[10px] tracking-[0.18em] uppercase text-accent font-medium">{ing.tag}</span>
                <h3 className="font-serif text-xl mt-2 mb-2">{ing.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <IngredientSlider />
      </section>

      {/* Treatment protocol */}
      <section className="bg-secondary/40 py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10 lg:mb-12">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-2">How to apply</div>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight">A 30-second ritual.</h2>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 max-w-4xl mx-auto">
            {ROUTINE.map((r) => (
              <li key={r.step} className="flex flex-col items-center text-center">
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-background shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.25)] ring-1 ring-border/50">
                  <img src={r.image} alt={r.title} width={768} height={768} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="mt-4 font-serif text-accent leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}>
                  {r.step}.
                </div>
                <div className="mt-2 text-[13px] md:text-sm font-medium text-ink-deep leading-snug max-w-[22ch]">
                  {r.title}
                </div>
                <p className="mt-1.5 text-[12px] md:text-[13px] text-foreground/65 leading-snug max-w-[26ch]">
                  {r.caption}
                </p>
              </li>
            ))}
          </ol>
          <p className="text-[10px] text-center text-foreground/50 mt-10 tracking-wider max-w-2xl mx-auto">
            For external veterinary use only. Avoid if eardrum is ruptured. Discontinue if irritation worsens.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-ink-deep text-primary-foreground py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Why pet parents switch</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-3">PetGlow vs. hydrocortisone &amp; antibiotic ear drops</h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto text-sm">
              The same fast relief — without the steroid side effects, antibiotic resistance, recurring vet bills, or the guilt of putting harsh chemicals in a sensitive canal.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-primary-foreground/15 bg-primary-foreground/[0.02]">
            <div className="grid grid-cols-3 bg-primary-foreground/[0.06] text-[10px] tracking-[0.2em] uppercase">
              <div className="p-4 lg:p-5 text-primary-foreground/50"></div>
              <div className="p-4 lg:p-5 text-accent border-l border-primary-foreground/15 font-medium">PetGlow</div>
              <div className="p-4 lg:p-5 text-primary-foreground/50 border-l border-primary-foreground/15">Conventional Drops</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.criteria} className={cn("grid grid-cols-3 text-sm", i % 2 && "bg-primary-foreground/[0.02]")}>
                <div className="p-4 lg:p-5 text-primary-foreground/70 text-xs lg:text-sm">{row.criteria}</div>
                <div className="p-4 lg:p-5 border-l border-primary-foreground/15 flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span className="text-xs lg:text-sm">{row.us}</span>
                </div>
                <div className="p-4 lg:p-5 border-l border-primary-foreground/15 text-primary-foreground/55 text-xs lg:text-sm">{row.them}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete the routine — cross-sell bundle */}
      <section className="bg-background">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Complete the routine</div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-ink-deep">
              Pair it. Save 15%.
            </h2>
            <p className="mt-4 text-sm md:text-base text-ink-deep/70">
              Real cases of recurring otitis usually have two friends: lingering odor and the occasional ear-mite outbreak. Add these two PetGlow staples to keep both ears clean, calm and fresh between drops.
            </p>
          </div>

          <div className="rounded-3xl bg-peach/40 ring-1 ring-border p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 lg:gap-4 items-center">
              {/* This product placeholder */}
              <div className="flex flex-col items-center text-center">
                <div className="aspect-square w-full max-w-[200px] rounded-2xl bg-background ring-1 ring-border overflow-hidden flex items-center justify-center p-4">
                  <img src={PRODUCT_IMAGES[0].src} alt={PRODUCT_IMAGES[0].alt} className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-4 text-xs tracking-[0.18em] uppercase text-accent">This bottle</div>
                <div className="mt-1 font-serif text-lg text-ink-deep">Ear Infection Drops</div>
                <div className="text-xs text-ink-deep/60">4 fl oz · 118 ml</div>
                <div className="mt-2 text-sm font-medium text-ink-deep">$36.89</div>
              </div>

              <div className="flex items-center justify-center text-3xl font-serif text-ink-deep/40 lg:rotate-0">+</div>

              {/* Doggy Freshener */}
              <div className="flex flex-col items-center text-center">
                <div className="aspect-square w-full max-w-[200px] rounded-2xl bg-background ring-1 ring-border overflow-hidden flex items-center justify-center p-4">
                  <img src={bundleFreshener} alt="PetGlow Natural Doggy Freshener calming spray, 4 fl oz" className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-4 text-xs tracking-[0.18em] uppercase text-accent">Add</div>
                <div className="mt-1 font-serif text-lg text-ink-deep">Natural Doggy Freshener</div>
                <div className="text-xs text-ink-deep/60">Anti-itch · Stop odor · Calming</div>
                <div className="mt-2 text-sm font-medium text-ink-deep">$24.99</div>
              </div>

              <div className="flex items-center justify-center text-3xl font-serif text-ink-deep/40">+</div>

              {/* Ear Miticide */}
              <div className="flex flex-col items-center text-center">
                <div className="aspect-square w-full max-w-[200px] rounded-2xl bg-background ring-1 ring-border overflow-hidden flex items-center justify-center p-4">
                  <img src={bundleMiticide} alt="PetGlow Ear Miticide ear mite treatment for dogs, 4 fl oz" className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-4 text-xs tracking-[0.18em] uppercase text-accent">Add</div>
                <div className="mt-1 font-serif text-lg text-ink-deep">Ear Miticide</div>
                <div className="text-xs text-ink-deep/60">Kills ear mites · Plant based</div>
                <div className="mt-2 text-sm font-medium text-ink-deep">$28.49</div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border/70 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="text-center md:text-left">
                <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-1">Bundle total</div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="font-serif text-3xl text-ink-deep">$76.04</span>
                  <span className="text-base text-muted-foreground line-through">$90.37</span>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">Save $14.33</span>
                </div>
                <div className="mt-1 text-xs text-ink-deep/60">All three shipped together · Free U.S. shipping</div>
              </div>
              <button
                type="button"
                className="w-full md:w-auto px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition shadow-sm"
              >
                Add bundle to cart — $76.04
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vet quote */}
      <section className="bg-peach">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <LiteYouTube
                id="5vSeho0r_I8"
                start={59}
                title="Vet talks about natural ear infection care for dogs and cats"
                className="rounded-2xl overflow-hidden shadow-lg ring-4 ring-background"
              />
              <figcaption className="mt-5 flex flex-col items-center gap-1.5 text-center">
                <span className="font-serif text-lg text-ink-deep">Dr. Alex</span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-accent">Veterinarian</span>
              </figcaption>
            </div>
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Vet approved</div>
              <blockquote className="font-serif text-xl md:text-2xl leading-snug text-ink-deep">
                "For mild-to-moderate canine and feline otitis externa — especially the recurring kind — a well-formulated olive-leaf and chamomile drop addresses the bacterial, yeast and inflammatory components in one bottle. That's the missing link in most conventional protocols."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section className="bg-peach/40 py-20 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img src={earFlatlay} alt="Olive leaf, turmeric and chamomile — PetGlow's botanical actives" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] tracking-[0.22em] uppercase text-foreground">
                  <Pill className="w-3 h-3 text-accent" strokeWidth={2} />
                  Homeopathic 6X HPUS
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="text-[10px] tracking-[0.28em] uppercase text-accent mb-4">
                Veterinary science, ancient herbs
              </div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.05] mb-6 text-ink-deep">
                Where modern ear care<br />meets the herbal apothecary.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-5 max-w-xl">
                Olive leaf, chamomile and neem have been used in traditional veterinary practice for centuries — long before the antibiotic era. PetGlow combines those roots with FDA-registered homeopathic standards (6X HPUS), so each active reaches your pet's ear at a clinically meaningful dose, without the resistance and recurrence problems of conventional drops.
              </p>
              <p className="text-foreground/75 leading-relaxed max-w-xl">
                The result is an alcohol-free, paraben-free, non-stinging drop gentle enough for kittens and seniors — yet decisive enough to break the chronic infection cycle within days.
              </p>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {[
              { title: "Antimicrobial", meaning: "Kills three pathogens", how: "Oleuropein from olive leaf is clinically active against the bacteria, yeast and fungi behind chronic otitis externa.", icon: ShieldCheck },
              { title: "Anti-inflammatory", meaning: "Calms the canal", how: "Chamomile and turmeric reduce redness, swelling and odor without the rebound flare of topical steroids.", icon: Leaf },
              { title: "Non-stinging", meaning: "Senior + kitten safe", how: "Alcohol-free, paraben-free, non-toxic — gentle enough for daily use even in anxious or sensitive pets.", icon: PawPrint },
            ].map((p) => (
              <div key={p.title} className="bg-background rounded-2xl p-7 lg:p-8 border border-foreground/5 hover:shadow-sm transition">
                <p.icon className="w-5 h-5 text-accent mb-5" strokeWidth={1.5} />
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-2">
                  {p.meaning}
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl text-ink-deep mb-4">
                  {p.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {p.how}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Pet parent questions</div>
          <h2 className="font-serif text-3xl md:text-5xl">Answers from our vet team</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left font-serif text-lg md:text-xl py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-5 space-y-4">
                <p>{f.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Reviews — empty state */}
      <section id="reviews" className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Reviews</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-5">Be the first to share your pet's relief story.</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="font-serif text-5xl text-muted-foreground/50">—</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-muted-foreground/30" />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">No verified reviews yet</div>
              </div>
            </div>
            <Button variant="outline" className="rounded-md text-xs tracking-[0.12em] uppercase">Write a Review</Button>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {REVIEW_STRUCTURE.map((r, i) => (
              <div key={i} className="bg-secondary/30 rounded-xl p-8 lg:p-10 text-center">
                <PawPrint className="w-6 h-6 mx-auto mb-3 text-muted-foreground/50" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-[900px] mx-auto px-5 lg:px-10 py-10 text-center">
          <div className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-3">Legal disclaimer</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            For external veterinary use only. Always read and follow label directions. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease in animals. Do not use if the eardrum is ruptured or with significant canal swelling. Consult a licensed veterinarian for persistent or worsening symptoms.
          </p>
        </div>
      </section>

      {/* Mobile sticky purchase bar */}
      <div className={cn("lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-t border-border", "px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]", "transition-transform duration-300 ease-out shadow-[0_-8px_24px_-12px_hsl(var(--ink-deep)/0.18)]", showStickyBar ? "translate-y-0" : "translate-y-full")} role="region" aria-label="Purchase bar">
        <div className="flex items-center gap-3">
          <img src={earHero} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-ink-deep/70 tracking-wide truncate">
              Natural Ear Drops · 4 fl oz
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-[16px] leading-none text-ink-deep">${finalPrice.toFixed(2)}</span>
              {pack === "bundle" && (
                <>
                  <span className="text-[11px] text-muted-foreground line-through leading-none">${bundleOriginal.toFixed(2)}</span>
                  <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-accent leading-none">Save 20%</span>
                </>
              )}
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="rounded-full px-4 h-10 text-[11px] tracking-[0.16em] uppercase bg-ink-deep text-primary-foreground hover:bg-ink-deep/90 shrink-0"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? "Adding…" : "Add to Bag"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EarInfectionDrops;
