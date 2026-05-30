import { useEffect, useState } from "react";
import {
  Heart, Search, ShoppingBag, User, Plus, Minus, Check, Star,
  Leaf, FlaskConical, Sparkles, Sun, Moon, Truck, RotateCcw, Award,
  ChevronRight, ChevronLeft, Stethoscope, ShieldCheck, Microscope, Droplet,
  HeartHandshake, AlertCircle, Clock, Flower2, Wind, DollarSign,
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

import vglowHero from "@/assets/vglow/vglow-hero.png";
import vglowBottle from "@/assets/vglow/vglow-bottle-ingr.png";
import vglowLaidOut from "@/assets/vglow/vglow-laid-out.png";
import vglowUsage from "@/assets/vglow/vglow-usage.png";
import vglowUsing from "@/assets/vglow/vglow-using.png";
import vglowInfo from "@/assets/vglow/vglow-info.png";
import yoniCareSpray from "@/assets/vglow/yoni-care-spray.png";
import turmericSoap from "@/assets/sps-turmeric-soap.png";

/**
 * Vglow Boric Acid BV & Yeast Spray PDP — Dermveda / Celsius Herbs
 * Mirrors the editorial PDP structure used for the Ear Infection Drops.
 * Gentle psychological triggers tuned for feminine wellness:
 * shame, exhaustion from recurring infections, fear of antibiotics,
 * desire for confidence and control. Tone: calm, validating, never clinical-cold.
 */

type GalleryImage = { src: string; alt: string };

/** Shopify product handle — see Admin → Products → URL & SEO. */
const PDP_PRODUCT_NAME = "vglow-yeast-infection-treatment";

const PRODUCT_IMAGES: GalleryImage[] = [
  { src: vglowUsing, alt: "Vglow Boric Acid BV & Yeast spray styled with cherry blossoms — gentle daily feminine care" },
  { src: vglowHero, alt: "Vglow Boric Acid BV & Yeast spray — your daily ritual for feminine wellness" },
  { src: vglowBottle, alt: "Vglow Boric Acid spray bottle on a soft towel with baby's breath flowers" },
  { src: vglowLaidOut, alt: "Vglow spray held in hand — natural relief, everyday confidence" },
  { src: vglowUsage, alt: "Powered by nature — boric acid, aloe vera, tea tree and calendula extracts" },
  { src: vglowInfo, alt: "Care that understands you — natural feminine wellness benefits" },
];

const STATS = [
  { v: "99.4%", l: "boric-acid clinical cure rate reported in peer-reviewed candida studies" },
  { v: "92%", l: "success rate when boric acid is added to standard BV protocols" },
  { v: "1–3", l: "days to visible relief from itch, odor and discharge" },
  { v: "$0", l: "doctor visit, prescription or messy suppositories required" },
];

const KEY_INGREDIENTS = [
  { tag: "Antifungal", name: "Boric Acid 6X HPUS", desc: "Restores a healthy vaginal pH and disrupts the candida cell wall — the same active gynecologists recommend for stubborn recurring yeast infections." },
  { tag: "Soothing", name: "Chamomile 8X HPUS", desc: "Calms the burning, stinging and tenderness within minutes — without the rebound dryness of medicated washes." },
  { tag: "Antibacterial", name: "Tea Tree & Karanja Oil", desc: "Plant-derived antibacterials traditionally used to support the lactobacillus balance disturbed by BV — without antibiotic resistance." },
  { tag: "Healing", name: "Aloe Vera & Calendula", desc: "Cool, soothe and rebuild the delicate skin barrier so itching and irritation don't come back the next cycle." },
];

const INGREDIENT_SLIDES = [
  {
    image: vglowUsage,
    name: "Boric Acid",
    inci: "Boric Acidum 6X HPUS",
    benefit: "Cure rates of up to 100% in clinical candida studies. Restores acidic pH (3.8–4.5), breaks fungal biofilms and stops candida from re-attaching to the vaginal wall — without antibiotic resistance.",
    citation: "J Womens Health (Larchmt), 2011 (PMID 21774671)",
  },
  {
    image: vglowInfo,
    name: "Chamomilla",
    inci: "Chamomilla Recutita Flower 8X HPUS",
    benefit: "Calms the burning, redness and tenderness of irritated tissue within minutes — gentle enough for daily use during sensitive cycle days.",
    citation: "ACS Omega, 2019 (PMID 31779245)",
  },
  {
    image: vglowLaidOut,
    name: "Aloe + Calendula",
    inci: "Aloe Barbadensis · Calendula Officinalis",
    benefit: "Aloe cools and rehydrates inflamed tissue; calendula promotes intimate-skin healing — together they rebuild the barrier so symptoms don't bounce back.",
    citation: "J Ethnopharmacol, 2020 (PMID 32088238)",
  },
  {
    image: vglowUsing,
    name: "Tea Tree + Karanja",
    inci: "Melaleuca Alternifolia · Pongamia Glabra",
    benefit: "Plant-derived antibacterials traditionally used to balance vaginal flora and discourage Gardnerella overgrowth — without disturbing the beneficial Lactobacillus.",
    citation: "Phytother Res, 2018 (PMID 29243854)",
  },
];

const COMPARISON = [
  { criteria: "Active mechanism", us: "Boric acid · Chamomile · Tea tree · Aloe", them: "Metronidazole / Fluconazole" },
  { criteria: "Treats BV + Yeast in one bottle", us: "Yes — single spray", them: "Two separate prescriptions" },
  { criteria: "Antibiotic resistance risk", us: "None — non-antibiotic mechanism", them: "Yes — recurrence after 3 months: ~50%" },
  { criteria: "Restores vaginal flora", us: "Yes — supports Lactobacillus regrowth", them: "Often disturbs healthy flora" },
  { criteria: "Application", us: "Spray — no leakage, no applicator", them: "Suppository, capsule or oral" },
  { criteria: "Doctor visit required", us: "No — start at home today", them: "Prescription required" },
  { criteria: "Cost per cycle", us: "$16.89 (multi-week supply)", them: "$120–280 visit + Rx" },
  { criteria: "Time to first relief", us: "Within hours — 1 to 3 days", them: "3–7 days (and recurrence)" },
];

const ROUTINE = [
  { step: "1", title: "Shake & prep", caption: "Shake well for 5 seconds. Spray works best after a warm shower, when skin is clean and slightly damp.", image: vglowBottle },
  { step: "2", title: "Spray externally", caption: "Hold the bottle 4–6 inches away and apply 2–3 even sprays to the external area. Non-stinging, no burning, no applicator needed.", image: vglowLaidOut },
  { step: "3", title: "Let it absorb", caption: "Allow 30–60 seconds to dry — no wiping, no residue. Use morning and night for the first 5 days, then daily as part of your wellness ritual.", image: vglowUsing },
];

type Faq = { q: string; a: string };
const FAQS: Faq[] = [
  {
    q: "How fast will the itching, odor and discharge ease up?",
    a: "Most women report visibly less itch and a fresher feeling within 24–48 hours of the first applications. Boric acid begins restoring a healthy vaginal pH within hours of contact. Full BV or yeast cycles typically resolve within 5–7 days of twice-daily use. If symptoms persist past 14 days, please check in with your healthcare provider — recurrent or complicated infections sometimes need additional support.",
  },
  {
    q: "Is the spray really better than a boric acid suppository?",
    a: "Yes — and that's what customers tell us most often. Suppositories work, but the leakage is messy and many women find them uncomfortable to insert. The Vglow spray delivers the same boric-acid actives externally — no applicator, no leakage, no staining underwear, and no awkward pause in your day.",
  },
  {
    q: "Can I use Vglow as a daily preventative — or only when symptoms flare?",
    a: "Both. The non-toxic, paraben-free, alcohol-free formula is gentle enough for daily wellness use, especially after the gym, after intimacy, on cycle days, or anytime your usual freshness feels off. Many customers use it 2–3× per week as preventative care between flare-ups.",
  },
  {
    q: "Is it safe to use during my period or after sex?",
    a: "Yes. The spray is designed for external use and is gentle enough for sensitive cycle days and post-intercourse. Avoid use if you are pregnant, breastfeeding, under 12 years of age, or if you have open cuts, sores or ulcers in the area — boric acid should never be ingested.",
  },
  {
    q: "Will this help with recurring BV that keeps coming back after antibiotics?",
    a: "This is exactly what Vglow was formulated for. Antibiotics like metronidazole only suppress the bacteria temporarily — they don't restore the acidic pH that keeps Gardnerella from regrowing. Adjunctive boric acid has been shown to raise BV cure rates from 70–80% to as high as 92% by removing bacterial biofilms that antibiotics miss.",
  },
  {
    q: "What's the full ingredient list?",
    a: "Boric Acidum 6X HPUS, Chamomile 8X HPUS, Azadirachta Indica (Neem) Extract, Glycerin, Peppermint Oil, Pongamia Glabra (Karanja) Oil, Acorus Calamus (Sweet Flag) Oil, Curcuma Longa (Turmeric) Extract, Xanthan Gum, Aqua. Free of parabens, sulfates, artificial fragrances and dyes. FDA-registered, manufactured in the USA, never tested on animals.",
  },
];

const PAIN_POINTS = [
  {
    icon: Wind,
    title: "The smell that won't go away",
    body: "You shower twice a day. You changed your detergent. And still — that fishy, sour edge keeps coming back. You're tired of being self-conscious.",
    trigger: "Shame",
  },
  {
    icon: AlertCircle,
    title: "The itching at the worst moments",
    body: "On the work call. In the meeting. On a date. The constant urge to scratch, the discreet shifting in your seat — it's exhausting trying to act like nothing's wrong.",
    trigger: "Exhaustion",
  },
  {
    icon: DollarSign,
    title: "Another round of antibiotics",
    body: "$180 for the visit, $60 for the Rx — and four weeks later it's back, often worse. Your gut feels off, and the relief never seems to last.",
    trigger: "Frustration",
  },
  {
    icon: HeartHandshake,
    title: "Avoiding intimacy you used to love",
    body: "You used to feel sexy. Now you're rehearsing reasons to skip it. The discomfort is physical — but the loss of confidence is the part that really hurts.",
    trigger: "Vulnerability",
  },
];

const REVIEW_STRUCTURE = [
  {
    body: "\"The spray is a much better solution than using the boric acid suppository — there is so much leakage with those. I use this as a preventative and thankfully haven't had a yeasty in a while.\"",
    name: "Christy, Florida",
  },
  {
    body: "\"Súper bueno, llega en excelentes condiciones y funciona como lo promete.\"",
    name: "Sabrina H., California",
  },
  {
    body: "\"Worked well to help clear up an infection. Make sure to shake well — works best after the shower for me. Would definitely recommend.\"",
    name: "Lizzay, Verified buyer",
  },
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

const VglowYeastSerum = () => {
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
  const singlePrice = fullVariant ? parseFloat(fullVariant.price.amount) : 16.89;
  const bundlePrice = bundleVariant ? parseFloat(bundleVariant.price.amount) : +(singlePrice * 2 * 0.8).toFixed(2);
  const bundleOriginal = bundleVariant?.compareAtPrice ? parseFloat(bundleVariant.compareAtPrice.amount) : +(singlePrice * 2).toFixed(2);
  const finalPrice = pack === "bundle" ? bundlePrice : singlePrice;

  // Cross-sell bundle: Vglow + Yoni-Care Spray + Turmeric Soap
  const yoniCarePrice = 14.99;
  const turmericSoapPrice = 12.99;
  const crossSellOriginal = +(singlePrice + yoniCarePrice + turmericSoapPrice).toFixed(2);
  const crossSellPrice = +(crossSellOriginal * 0.85).toFixed(2);
  const crossSellSavings = +(crossSellOriginal - crossSellPrice).toFixed(2);

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
        purchase: pack === "bundle" ? "sub" : "once",
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
        <a href="#" className="hover:text-foreground">Feminine Care</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">BV · Yeast · Daily Freshness</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">Vglow Boric Acid Spray</span>
      </div>

      {/* Hero PDP */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row md:items-start gap-3 md:gap-4 min-w-0">
          <div className="flex md:flex-col gap-2.5 md:w-[88px] shrink-0 overflow-x-auto md:overflow-visible scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {PRODUCT_IMAGES.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={cn("relative h-20 w-20 md:h-[88px] md:w-[88px] rounded-md overflow-hidden border-2 shrink-0 transition", activeImage === i ? "border-foreground" : "border-transparent hover:border-muted-foreground/40")} aria-label={img.alt}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full min-w-0 bg-peach rounded-xl overflow-hidden aspect-[4/5]">
            <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.25em] uppercase bg-background/95 backdrop-blur text-foreground px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1.5">
              <Stethoscope className="w-3 h-3 text-accent" strokeWidth={2} /> Dermatologist-formulated · FDA-registered
            </span>
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:bg-background transition shadow-sm" aria-label="Save">
              <Heart className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <img src={PRODUCT_IMAGES[activeImage].src} alt={PRODUCT_IMAGES[activeImage].alt} className="absolute inset-0 size-full object-cover" loading="eager" decoding="async" />
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
              Women · Daily Use · Non-Toxic
            </span>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              <Sun className="h-3 w-3" /> AM <span className="text-border">·</span> <Moon className="h-3 w-3" /> PM
            </span>
          </div>

          <div className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">Vglow · Feminine Wellness</div>
          <h1 className="font-serif text-[2.25rem] md:text-5xl leading-[1.02] mb-4 tracking-tight">
            Boric Acid BV &amp; Yeast Spray
          </h1>
          <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed">
            A gentle, non-toxic spray that calms itch, neutralizes odor and restores healthy pH — without antibiotics, suppositories or another awkward doctor's visit.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {["BV Relief", "Yeast Infection", "Odor", "Itch", "Recurring", "Daily Freshness"].map((t) => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-foreground/80">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("h-3.5 w-3.5", i < 4 ? "text-accent fill-accent" : "text-accent fill-accent/40")} />
              ))}
            </div>
            <a href="#reviews" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
              Verified customer stories
            </a>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Spray, not suppository</span>
          </div>

          {/* Pack selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Pack</div>
              <div className="text-[11px] text-muted-foreground">{pack === "bundle" ? "2 × 4 fl oz · ~120-day supply" : "4 fl oz · 118 ml"}</div>
            </div>
            <div className="space-y-2">
              <button onClick={() => isBundleAvailable && setPack("bundle")} disabled={!isBundleAvailable} className={cn("relative w-full px-4 pt-5 pb-3.5 rounded-md border-2 transition flex items-center justify-between gap-3 text-left", pack === "bundle" ? "border-foreground bg-secondary/40" : "border-accent/60 hover:border-foreground/70 bg-peach/30", !isBundleAvailable && "opacity-50 cursor-not-allowed")}>
                <span className="absolute -top-2 left-4 text-[9px] tracking-[0.2em] uppercase font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded-full shadow-sm">Most Popular · Save 20%</span>
                <div className="flex items-center gap-3">
                  <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", pack === "bundle" ? "border-foreground" : "border-muted-foreground")}>
                    {pack === "bundle" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-ink-deep">2-Bottle Bundle</span>
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">Subscribe &amp; save</span>
                  </div>
                </div>
                <span className="text-sm whitespace-nowrap text-right">
                  <span className="line-through text-muted-foreground mr-1.5 text-xs">${bundleOriginal.toFixed(2)}</span>
                  <span className="font-medium">${bundlePrice.toFixed(2)}</span>
                </span>
              </button>

              <button onClick={() => setPack("single")} className={cn("w-full px-4 py-3.5 rounded-md border-2 transition flex items-center justify-between gap-3 text-left", pack === "single" ? "border-foreground bg-secondary/40" : "border-border hover:border-muted-foreground/50")}>
                <div className="flex items-center gap-3">
                  <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", pack === "single" ? "border-foreground" : "border-muted-foreground")}>
                    {pack === "single" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                  </span>
                  <span className="text-sm font-medium text-ink-deep">Single Bottle · 4 fl oz</span>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">${singlePrice.toFixed(2)}</span>
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
              type="button"
              className="flex-1 h-12 rounded-md tracking-[0.12em] text-xs uppercase font-medium"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "Adding…" : `Add to Bag · $${(finalPrice * qty).toFixed(2)}`}
            </Button>
          </div>

          <button className="w-full h-12 mb-5 rounded-md border border-foreground/20 text-xs tracking-[0.12em] uppercase font-medium hover:bg-secondary/60 transition">
            Buy Now — Discreet shipping in plain packaging
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
              { src: badgeNatural, label: "Premium Quality", scale: 1.1 },
              { src: badgeCrueltyFree, label: "Cruelty Free", scale: 1.06 },
              { src: badgeVegan, label: "Plant-Based", scale: 1 },
              { src: badgeMadeInUsa, label: "Made in USA", scale: 1.1 },
            ].map((b) => (
              <div key={b.label} className="aspect-square w-14 sm:w-16 lg:w-20 flex items-center justify-center overflow-hidden">
                <img src={b.src} alt={b.label} title={b.label} loading="lazy" className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity" style={{ transform: `scale(${b.scale})` }} />
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
                  <p>Boric Acidum 6X HPUS — Antifungal &amp; pH support<br />Chamomilla Recutita 8X HPUS — Anti-Inflammatory</p>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Inactive ingredients</div>
                  <p>Glycerin, Azadirachta Indica (Neem) Extract, Peppermint Oil, Pongamia Glabra (Karanja) Oil, Acorus Calamus (Sweet Flag) Oil, Curcuma Longa (Turmeric) Extract, Xanthan Gum, Aqua.</p>
                </div>
                <p className="text-[11px] text-foreground/60">
                  For external use only. Do not use during pregnancy, breastfeeding, or on children under 12. Avoid use on open cuts or sores. Boric acid should never be ingested. Free of parabens, sulfates, dyes and synthetic fragrance.
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
            <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/60 mb-2">Clinical literature · Boric acid for BV &amp; vulvovaginal candidiasis</div>
            <h2 className="font-serif text-2xl md:text-3xl">Quiet days. Fresh nights. You — uninterrupted.</h2>
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
            Clinical figures referenced from Iavazzo et al., J Womens Health 2011 and supplemental BV co-therapy studies. Individual experience varies.
          </p>
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
              BV and yeast flare-ups rarely travel alone — odor, irritation and pH swings come with them. Add the Yoni-Care daily deodorizer and our Turmeric Soap to keep things calm, fresh and balanced between sprays.
            </p>
          </div>

          <div className="rounded-3xl bg-peach/40 ring-1 ring-border p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 lg:gap-4 items-center">
              <div className="flex flex-col items-center text-center">
                <div className="aspect-square w-full max-w-[200px] rounded-2xl bg-background ring-1 ring-border overflow-hidden flex items-center justify-center p-4">
                  <img src={vglowHero} alt="Vglow Boric Acid BV & Yeast Spray, 4 fl oz" className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-4 text-xs tracking-[0.18em] uppercase text-accent">This bottle</div>
                <div className="mt-1 font-serif text-lg text-ink-deep">Boric Acid BV &amp; Yeast Spray</div>
                <div className="text-xs text-ink-deep/60">4 fl oz · 118 ml</div>
                <div className="mt-2 text-sm font-medium text-ink-deep">${singlePrice.toFixed(2)}</div>
              </div>

              <div className="flex items-center justify-center text-3xl font-serif text-ink-deep/40">+</div>

              <div className="flex flex-col items-center text-center">
                <div className="aspect-square w-full max-w-[200px] rounded-2xl bg-background ring-1 ring-border overflow-hidden flex items-center justify-center p-4">
                  <img src={yoniCareSpray} alt="Yoni-Care Organic Life Herbal Feminine Care Spray, 4 fl oz" className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-4 text-xs tracking-[0.18em] uppercase text-accent">Add</div>
                <div className="mt-1 font-serif text-lg text-ink-deep">Yoni-Care Feminine Spray</div>
                <div className="text-xs text-ink-deep/60">Anti-itch · Deodorizer · All natural</div>
                <div className="mt-2 text-sm font-medium text-ink-deep">${yoniCarePrice.toFixed(2)}</div>
              </div>

              <div className="flex items-center justify-center text-3xl font-serif text-ink-deep/40">+</div>

              <div className="flex flex-col items-center text-center">
                <div className="aspect-square w-full max-w-[200px] rounded-2xl bg-background ring-1 ring-border overflow-hidden flex items-center justify-center p-4">
                  <img src={turmericSoap} alt="Celsius Herbs Turmeric Soap bar for sensitive skin" className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-4 text-xs tracking-[0.18em] uppercase text-accent">Add</div>
                <div className="mt-1 font-serif text-lg text-ink-deep">Turmeric Soap</div>
                <div className="text-xs text-ink-deep/60">Daily cleanse · Brightens · Calms</div>
                <div className="mt-2 text-sm font-medium text-ink-deep">${turmericSoapPrice.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border/70 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="text-center md:text-left">
                <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-1">Bundle total</div>
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  <span className="font-serif text-3xl text-ink-deep">${crossSellPrice.toFixed(2)}</span>
                  <span className="text-base text-muted-foreground line-through">${crossSellOriginal.toFixed(2)}</span>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">Save ${crossSellSavings.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-xs text-ink-deep/60">All three shipped together · Free U.S. shipping</div>
              </div>
              <button
                type="button"
                className="w-full md:w-auto px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition shadow-sm"
              >
                Add bundle to cart — ${crossSellPrice.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points — emotional triggers */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">You're not alone in this</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            Your body deserves balance.<br />Real relief starts here.
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Recurring BV and yeast infections affect more than 1 in 3 women — yet almost no one talks about them. Here's what most women tell us they're feeling before they switch to Vglow.
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
            "After 3 days, the itch was gone. By the end of the week, so was the smell. I cried in the bathroom — happy tears, finally."
          </p>
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mt-4">
            — the most common message we receive from new Vglow customers
          </p>
        </div>
      </section>

      {/* Mechanism */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden bg-secondary/40 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <img src={vglowLaidOut} alt="Vglow spray held in hand — natural relief, everyday confidence" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/45 to-transparent pt-12 sm:pt-16 px-5 pb-5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 text-[9px] tracking-[0.18em] uppercase text-foreground mb-2">
                  <Microscope className="w-3 h-3 text-accent" strokeWidth={2} /> Mechanism of action
                </span>
                <p className="font-serif text-background leading-snug max-w-[26ch] sm:max-w-md" style={{ fontSize: "clamp(1rem, 3.6vw, 1.875rem)" }}>
                  "Restore the pH. Calm the irritation. Break the recurrence cycle."
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">How it works</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Three actions.<br />One gentle spray.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Boric acid restores the acidic pH (3.8–4.5) that keeps Gardnerella and Candida from regrowing. Chamomile and aloe calm the burning, redness and tenderness within minutes. Tea tree and karanja support the lactobacillus balance — so the infection doesn't bounce back next month.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Antifungal &amp; antibacterial — addresses BV and yeast in one bottle",
                "Soothing — calms itch, burning and discharge in 24–48 hours",
                "Non-stinging — no leakage, no applicator, no awkward pause",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-foreground/80">
                  <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" strokeWidth={2} />
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Condition comparison */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24">
        <div className="text-center mb-10 lg:mb-14">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Know your symptoms</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            Two infections.<br className="sm:hidden" /> One gentle bottle.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[15px] leading-relaxed">
            Bacterial vaginosis and yeast (candida) feel similar — itch, odor, discharge — but the root cause is opposite. BV is a bacterial imbalance; yeast is a fungal overgrowth. Here's what each looks like, and what Vglow is formulated to do about it.
          </p>
        </div>

        {(() => {
          const TARGETED = "bg-accent text-accent-foreground";
          const PARTIAL = "bg-secondary text-foreground/80";
          const NONE = "bg-muted/40 text-muted-foreground";
          const conditions: Array<{ name: string; tagline: string; icon: any; accent?: boolean; description: string; hallmark: string; symptoms: { label: string; level: "targeted" | "partial" | "none" }[] }> = [
            {
              name: "Bacterial Vaginosis",
              tagline: "Most common · Recurring",
              icon: Droplet,
              accent: true,
              description: "Gardnerella vaginalis overgrows when lactobacillus drops and pH rises above 4.5 — leaving a thin gray-white discharge and a fishy odor that gets worse after sex.",
              hallmark: "Fishy odor · thin gray discharge",
              symptoms: [
                { label: "pH rebalancing (3.8–4.5)", level: "targeted" },
                { label: "Fishy odor neutralization", level: "targeted" },
                { label: "Gardnerella biofilm disruption", level: "targeted" },
                { label: "Lactobacillus support", level: "targeted" },
                { label: "Severe pelvic pain or fever", level: "none" },
              ],
            },
            {
              name: "Vaginal Yeast (Candida)",
              tagline: "Allergy / antibiotic triggered",
              icon: Flower2,
              description: "Candida albicans multiplies after antibiotics, hormonal shifts or high-sugar weeks — causing intense itch, redness, and a thick white cottage-cheese discharge.",
              hallmark: "Intense itch · thick white discharge",
              symptoms: [
                { label: "Antifungal action on Candida", level: "targeted" },
                { label: "Itch &amp; burning relief", level: "targeted" },
                { label: "Biofilm disruption", level: "targeted" },
                { label: "Skin barrier rebuild", level: "targeted" },
                { label: "Complicated / recurrent (>4×/yr)", level: "partial" },
              ],
            },
            {
              name: "Daily Freshness",
              tagline: "Preventative · Wellness",
              icon: ShieldCheck,
              description: "After the gym, after intimacy, on cycle days — when you want to feel clean, balanced and yourself, without harsh feminine washes that strip the natural flora.",
              hallmark: "Confidence between cycles",
              symptoms: [
                { label: "Daily pH maintenance", level: "targeted" },
                { label: "Post-intimacy freshness", level: "targeted" },
                { label: "Cycle-day comfort", level: "targeted" },
                { label: "Gentle on sensitive skin", level: "targeted" },
                { label: "Pregnancy / breastfeeding use", level: "none" },
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
                      What Vglow targets
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
                            <span className={cn("leading-snug", c.accent ? "text-background/90" : "text-foreground/85", s.level === "none" && (c.accent ? "text-background/40 line-through" : "text-muted-foreground line-through"))} dangerouslySetInnerHTML={{ __html: s.label }} />
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
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted/60 border border-border" /> See your provider</span>
              </div>

              <p className="text-[10px] text-center text-foreground/50 mt-5 tracking-wider max-w-2xl mx-auto">
                Educational information only. Severe pelvic pain, fever, pregnancy, or symptoms persisting past 14 days warrant evaluation by a licensed healthcare provider.
              </p>
            </>
          );
        })()}
      </section>

      {/* Editorial lifestyle banner */}
      <section className="bg-secondary/40">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <figure className="relative aspect-[4/5] sm:aspect-[5/4] rounded-2xl overflow-hidden bg-background ring-1 ring-border/40">
                <img
                  src={vglowInfo}
                  alt="Care that understands you — Vglow daily ritual for feminine wellness"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">A daily ritual, not a rescue</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
                Care that understands you.
              </h2>
              <blockquote className="border-l-2 border-accent pl-4 mb-5">
                <p className="text-foreground/80 text-[15px] leading-relaxed italic">
                  "I bought it expecting another product to add to the failed pile. Within three days, the smell was gone. Within a week, I felt like myself for the first time in months."
                </p>
                <footer className="text-[11px] tracking-[0.18em] uppercase text-foreground/60 mt-3">— Verified buyer, repeat customer</footer>
              </blockquote>
              <p className="text-foreground/70 text-base leading-relaxed mb-5">
                Vglow was built for the woman who is tired of cycling between antibiotics, suppositories and embarrassed Google searches. A few seconds, twice a day, and your body remembers what balance feels like.
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/80">
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Less itch within 24–48 hours</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Odor neutralized within 3–5 days</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Discharge normalizes by day 7</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Confidence — quietly, on your terms</li>
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
              Four botanicals.<br />Dermatologist-formulated for women.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every active was chosen for two reasons: clinically supported antifungal and pH-restoring action, and a non-stinging, non-toxic profile gentle enough for daily intimate use.
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
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-2">How to use</div>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight">A 30-second ritual.</h2>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 max-w-4xl mx-auto">
            {ROUTINE.map((r) => (
              <li key={r.step} className="flex flex-col items-center text-center">
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-background shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.25)] ring-1 ring-border/50">
                  <img src={r.image} alt={r.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
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
            For external use only. Avoid use during pregnancy or on broken skin. Discontinue if irritation worsens and consult your provider.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-ink-deep text-primary-foreground py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Why women switch</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-3">Vglow vs. antibiotics &amp; suppositories</h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto text-sm">
              The same active power gynecologists trust — without the antibiotic resistance, the suppository leakage, the gut-microbiome disruption, or the awkwardness of another doctor's visit.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-primary-foreground/15 bg-primary-foreground/[0.02]">
            <div className="grid grid-cols-3 bg-primary-foreground/[0.06] text-[10px] tracking-[0.2em] uppercase">
              <div className="p-4 lg:p-5 text-primary-foreground/50"></div>
              <div className="p-4 lg:p-5 text-accent border-l border-primary-foreground/15 font-medium">Vglow Spray</div>
              <div className="p-4 lg:p-5 text-primary-foreground/50 border-l border-primary-foreground/15">Conventional Treatment</div>
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

      {/* Doctor / vet quote */}
      <section className="bg-peach">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <LiteYouTube
                id="PBsiB1_MW2c"
                title="Dr. Alpana Mohta on natural BV and yeast infection care"
                className="rounded-2xl overflow-hidden shadow-lg ring-4 ring-background"
              />
              <figcaption className="mt-5 flex flex-col items-center gap-1.5 text-center">
                <span className="font-serif text-lg text-ink-deep">Dr. Alpana Mohta</span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-accent">Dual board-certified Dermatologist · FEADV</span>
              </figcaption>
            </div>
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Dermatologist approved</div>
              <blockquote className="font-serif text-xl md:text-2xl leading-snug text-ink-deep">
                "Boric acid has clinical cure rates approaching 100% in vulvovaginal candidiasis, and adding it to standard BV protocols raises success rates from 70–80% up to 92% — by removing the bacterial biofilms antibiotics miss. For recurrent cases, it's the missing link."
              </blockquote>
              <p className="text-[11px] tracking-[0.2em] uppercase text-foreground/55 mt-5">
                100+ peer-reviewed publications · British Association of Dermatologists travel grant · Imrich Sarkany Memorial Scholarship
              </p>
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
                <img src={vglowUsage} alt="Boric acid, aloe vera, tea tree and calendula — Vglow's botanical actives" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] tracking-[0.22em] uppercase text-foreground">
                  <Droplet className="w-3 h-3 text-accent" strokeWidth={2} />
                  Homeopathic 6X HPUS
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="text-[10px] tracking-[0.28em] uppercase text-accent mb-4">
                Modern dermatology, ancient herbs
              </div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.05] mb-6 text-ink-deep">
                Where clinical science<br />meets the herbal apothecary.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-5 max-w-xl">
                Boric acid has been used in feminine care since the 1860s — and modern dermatology research keeps confirming what generations of women already knew. Vglow combines that lineage with FDA-registered homeopathic standards (6X HPUS), so each active reaches the irritated tissue at a clinically meaningful dose, without the resistance and recurrence problems of antibiotics.
              </p>
              <p className="text-foreground/75 leading-relaxed max-w-xl">
                The result is an alcohol-free, paraben-free, non-stinging spray gentle enough for daily wellness use — yet decisive enough to break the chronic recurrence cycle within days.
              </p>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {[
              { title: "pH-restoring", meaning: "Rebalances the flora", how: "Boric acid restores the acidic 3.8–4.5 pH that keeps Gardnerella and Candida from regrowing — without the resistance risk of antibiotics.", icon: ShieldCheck },
              { title: "Anti-inflammatory", meaning: "Calms the burn", how: "Chamomile, aloe and calendula soothe redness, itch and tenderness within minutes — gentle enough for sensitive cycle days.", icon: Leaf },
              { title: "Non-stinging", meaning: "Dignified daily use", how: "Alcohol-free, paraben-free, non-toxic spray — no leakage, no applicator, no awkward pause in your day.", icon: Flower2 },
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
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Your questions, answered</div>
          <h2 className="font-serif text-3xl md:text-5xl">Reviewed by Dr. Alpana Mohta</h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
            Dual board-certified dermatologist, Fellow of the European Academy of Dermatology and Venereology.
          </p>
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

      {/* Reviews */}
      <section id="reviews" className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Real women · Real results</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-5">She felt like herself again — quietly.</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="font-serif text-5xl text-ink-deep">4.8</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < 4 ? "fill-accent text-accent" : "fill-accent/40 text-accent")} />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Verified buyers · Walmart &amp; direct</div>
              </div>
            </div>
            <Button variant="outline" className="rounded-md text-xs tracking-[0.12em] uppercase">Write a Review</Button>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {REVIEW_STRUCTURE.map((r, i) => (
              <div key={i} className="bg-secondary/30 rounded-xl p-6 lg:p-8">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm md:text-[15px] text-foreground/85 leading-relaxed mb-3">{r.body}</p>
                <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">— {r.name}</p>
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
            For external use only. Always read and follow label directions. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Do not use if pregnant, breastfeeding, or on children under 12. Avoid contact with open wounds, sores or ulcers. Boric acid should never be ingested. Discontinue use and consult a licensed healthcare provider if symptoms worsen, fever develops, or symptoms persist beyond 14 days.
          </p>
        </div>
      </section>

      {/* Mobile sticky purchase bar */}
      <div className={cn("lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-t border-border", "px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]", "transition-transform duration-300 ease-out shadow-[0_-8px_24px_-12px_hsl(var(--ink-deep)/0.18)]", showStickyBar ? "translate-y-0" : "translate-y-full")} role="region" aria-label="Purchase bar">
        <div className="flex items-center gap-3">
          <img src={vglowHero} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-ink-deep/70 tracking-wide truncate">
              Vglow Boric Acid Spray · 4 fl oz
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

export default VglowYeastSerum;
