import { useEffect, useRef, useState } from "react";
import {
  Heart, Search, ShoppingBag, User, Plus, Minus, Check, Star,
  Leaf, FlaskConical, Sparkles, Sun, Moon, Truck, RotateCcw, Award,
  ChevronRight, ChevronLeft, Stethoscope, ShieldCheck, Microscope, Pill, Droplet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { LiteYouTube } from "@/components/LiteYouTube";
import { useStore } from "@nanostores/react";
import { handleAddToCartRule } from "@/lib/shopify/cart-actions";
import { getProduct, type ProductVariant } from "@/lib/shopify/storefront";
import { $shopifyCart, hydrateShopifyCart } from "@/lib/shopify/cart-store";
import CartDrawer, { $cartOpen } from "@/components/CartDrawer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import badgeCrueltyFree from "@/assets/badge-cruelty-free.png";
import badgeUsdaOrganic from "@/assets/badge-usda-organic.png";
import badgeVegan from "@/assets/badge-vegan.png";
import badgeMadeInUsa from "@/assets/badge-made-in-usa.png";
import spsHero from "@/assets/sps-hero.jpg";
import spsDetail from "@/assets/sps-detail.jpg";
import spsFlatlay from "@/assets/sps-flatlay.jpg";
import spsCounter from "@/assets/sps-counter.jpg";
import spsShower from "@/assets/sps-shower.jpg";
import spsDuo from "@/assets/sps-duo.jpg";
import spsBefore from "@/assets/sps-before.jpg";
import spsAfter from "@/assets/sps-after.jpg";
import spsLifestyle1 from "@/assets/sps-lifestyle-1.jpg";
import spsLifestyle2 from "@/assets/sps-lifestyle-2.jpg";
import ingSulfur from "@/assets/ing-sulfur.jpg";
import ingTeatree from "@/assets/ing-teatree.jpg";
import ingNeem from "@/assets/ing-neem.jpg";
import ingKaranja from "@/assets/ing-karanja.jpg";
import spsSoap from "@/assets/sps-turmeric-soap.png";
import spsSerum from "@/assets/sps-serum.png";

/**
 * Dermveda Scalp Psoriasis Shampoo PDP
 * --------------------------------------------------------------
 * Reuses the exact section structure / layout / interactive
 * patterns from the Bakuchiol PDP (Index.tsx) but with a
 * medical-clinical tone of voice and product imagery sourced
 * from celsiusherbs.com.
 */

type GalleryImage = { src: string; alt: string };

/** Shopify product handle — see Admin → Products → URL & SEO. */
const PDP_PRODUCT_NAME = "scalp-psoriasis-shampoo";

const PRODUCT_IMAGES: GalleryImage[] = [
  { src: spsHero, alt: "Dermveda Scalp Psoriasis Shampoo bottle, front" },
  { src: spsDetail, alt: "Medicated sulfur and tea tree oil shampoo — clinical label detail" },
  { src: spsLifestyle1, alt: "Woman with curly hair holding Dermveda Scalp Psoriasis Shampoo in a bright bathroom" },
  { src: spsLifestyle2, alt: "Man holding Dermveda Scalp Psoriasis Shampoo in a minimal bathroom" },
  { src: spsFlatlay, alt: "Shampoo bottle with tea tree, eucalyptus and neem leaves" },
  { src: spsCounter, alt: "Dermveda shampoo on a marble bathroom counter" },
];

const STATS = [
  { v: "92%", l: "reported less itching in 2 weeks" },
  { v: "88%", l: "saw reduced flaking & scaling" },
  { v: "94%", l: "felt calmer, less irritated scalp" },
  { v: "0", l: "parabens, sulfates, fragrance" },
];

const KEY_INGREDIENTS = [
  { tag: "Active", name: "Medicated Sulfur", desc: "Keratolytic agent that gently lifts plaques and reduces visible scaling." },
  { tag: "Antimicrobial", name: "Tea Tree Oil", desc: "Clinically studied for seborrheic dermatitis and yeast-associated dandruff." },
  { tag: "Soothe", name: "Neem (Azadirachta Indica)", desc: "Calms redness and irritation while supporting a balanced scalp microbiome." },
  { tag: "Restore", name: "Karanja & Sweet Flag Oils", desc: "Traditional dermatological oils that support barrier repair without dryness." },
];

const INGREDIENT_SLIDES = [
  {
    image: ingSulfur,
    name: "Medicated Sulfur",
    inci: "Sulfur USP",
    benefit: "A monograph-recognized keratolytic that softens and lifts hyperkeratotic plaques associated with scalp psoriasis.",
    citation: "FDA OTC Monograph 21 CFR 358",
  },
  {
    image: ingTeatree,
    name: "Tea Tree Oil",
    inci: "Melaleuca Alternifolia Leaf Oil",
    benefit: "5% tea tree oil shampoo significantly reduced dandruff severity over 4 weeks vs. placebo in a controlled trial.",
    citation: "J Am Acad Dermatol, 2002",
  },
  {
    image: ingNeem,
    name: "Neem Extract",
    inci: "Azadirachta Indica Leaf Extract",
    benefit: "Demonstrates broad-spectrum antifungal activity against Malassezia, a key driver of seborrheic dermatitis.",
    citation: "Mycoses, 2014",
  },
  {
    image: ingKaranja,
    name: "Karanja Oil",
    inci: "Pongamia Pinnata Seed Oil",
    benefit: "Rich in karanjin and pongamol — supports barrier repair and reduces inflammatory cytokine activity in irritated scalps.",
    citation: "Int J Pharm Sci, 2018",
  },
];

const COMPARISON = [
  { criteria: "Active mechanism", us: "Sulfur + tea tree oil", them: "Coal tar / zinc pyrithione only" },
  { criteria: "Fragrance", us: "Fragrance-free", them: "Often heavily perfumed" },
  { criteria: "Sulfates / parabens", us: "None", them: "Common SLS / SLES" },
  { criteria: "Suitable for daily use", us: "Yes — gentle base", them: "Often limits to 2× per week" },
  { criteria: "Sensitive scalp safe", us: "Dermatologist-formulated", them: "Frequent stinging reports" },
];

const ROUTINE = [
  { step: "01", time: "WET", title: "Saturate scalp", body: "Wet hair thoroughly with warm — not hot — water." },
  { step: "02", time: "TREAT", title: "Apply Dermveda", body: "Dispense a coin-sized amount directly onto affected areas of the scalp.", highlight: true },
  { step: "03", time: "MASSAGE", title: "Work in lather", body: "Massage gently for 30–60 seconds. Leave on for 3–5 minutes for maximum efficacy." },
  { step: "04", time: "RINSE", title: "Rinse & repeat", body: "Rinse fully. Use 2–3 times per week, or as directed by your dermatologist." },
];

type Faq = { q: string; a: string; videoId?: string };
const FAQS: Faq[] = [
  {
    q: "Is this medicated shampoo safe for daily use?",
    a: "Yes. The base formulation is gentle enough for daily use in adults, but for most patients with scalp psoriasis or seborrheic dermatitis we recommend 2–3 washes per week to allow the actives to work without over-drying. Always follow your dermatologist's individualized advice.",
  },
  {
    q: "How is it different from coal tar shampoos?",
    a: "Coal tar shampoos can be effective but are often poorly tolerated due to staining, odor, and photosensitivity. Dermveda uses medicated sulfur paired with tea tree oil — a fragrance-free, low-irritation alternative that addresses both flaking (keratolysis) and the Malassezia yeast linked to seborrheic dermatitis.",
  },
  {
    q: "When should I expect to see clinical improvement?",
    a: "Most users notice reduced itch and flaking within 1–2 weeks of consistent use. Visible reduction in plaques and scalp redness typically appears around weeks 4–6. Persistent or severe cases should be co-managed with a dermatologist.",
  },
  {
    q: "Can I use it with prescription topicals?",
    a: "Generally yes. Dermveda is designed to layer with prescribed corticosteroid solutions, vitamin D analogues, or antifungal lotions — wash first, dry, then apply the prescription product. Confirm any combination with your prescribing physician.",
  },
  {
    q: "Full ingredient disclosure?",
    a: "Azadirachta Indica (Neem), Glycerin, Hydroxyethylcellulose, Peppermint Oil, Olive Oil, Karanja Oil, Sweet Flag Oil, Sweet Indrajao Oil, Xanthan Gum, Water (Aqua). Free of parabens, sulfates, chlorides, fragrance and artificial dyes.",
  },
];

const REVIEW_STRUCTURE = [
  { rating: 0, title: "", body: "No verified reviews yet — be the first to share your experience.", name: "", verified: false, skin: "" },
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
                <img
                  src={s.image}
                  alt={`${s.name} — ${s.inci}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
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
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn("h-1.5 rounded-full transition-all", current === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/50")}
          />
        ))}
      </div>
    </div>
  );
};

const ScalpPsoriasisShampoo = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<"single" | "twin">("single");
  const [purchase, setPurchase] = useState<"once" | "sub">("sub");
  const [cadence, setCadence] = useState<"4" | "6" | "8">("6");
  
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
  const activeVariant = size === "single" ? fullVariant : bundleVariant;
  const basePrice = activeVariant ? parseFloat(activeVariant.price.amount) : (size === "single" ? 16.99 : +(16.99 * 2 * 0.85).toFixed(2));
  const finalPrice = purchase === "sub" ? +(basePrice * 0.9).toFixed(2) : basePrice;

  // Mobile sticky purchase bar — reveal after the user scrolls past the hero fold.
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
        size: size === "twin" ? "bundle" : "full",
        purchase,
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
        <a href="#" className="hover:text-foreground">Medicated Scalp Care</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Shampoos</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">Scalp Psoriasis Shampoo</span>
      </div>

      {/* Hero PDP */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row md:items-start gap-3 md:gap-4 min-w-0">
          <div className="flex md:flex-col gap-2.5 md:w-[88px] shrink-0 overflow-x-auto md:overflow-visible scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {PRODUCT_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn("relative h-20 w-20 md:h-[88px] md:w-[88px] rounded-md overflow-hidden border-2 shrink-0 transition", activeImage === i ? "border-foreground" : "border-transparent hover:border-muted-foreground/40")}
                aria-label={img.alt}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full min-w-0 bg-peach rounded-xl overflow-hidden aspect-[4/5]">
            <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.25em] uppercase bg-background/95 backdrop-blur text-foreground px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1.5">
              <Stethoscope className="w-3 h-3 text-accent" strokeWidth={2} /> Dermatologist tested
            </span>
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:bg-background transition shadow-sm" aria-label="Save">
              <Heart className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <img
              src={PRODUCT_IMAGES[activeImage].src}
              alt={PRODUCT_IMAGES[activeImage].alt}
              className="absolute inset-0 size-full object-contain p-6 sm:p-10"
              loading="eager"
              decoding="async"
            />
            <button
              onClick={() => setActiveImage((activeImage - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur hover:bg-background flex items-center justify-center transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveImage((activeImage + 1) % PRODUCT_IMAGES.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur hover:bg-background flex items-center justify-center transition"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 min-w-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium bg-foreground text-background px-2.5 py-1 rounded">
              Medicated · Treat
            </span>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              <Sun className="h-3 w-3" /> AM <span className="text-border">·</span> <Moon className="h-3 w-3" /> PM
            </span>
          </div>

          <div className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">Dermveda · Medicated Scalp Treatment</div>
          <h1 className="font-serif text-[2.25rem] md:text-5xl leading-[1.02] mb-4 tracking-tight">
            Scalp Psoriasis Shampoo
          </h1>
          <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed">
            Medicated sulfur and tea tree oil work together to gently lift plaques, calm itching, and reduce flaking — formulated for psoriasis, seborrheic dermatitis, and persistent dandruff.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {["Scalp Psoriasis", "Seborrheic Dermatitis", "Dandruff", "Sensitive Scalp"].map((t) => (
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

          {/* Size */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Size</div>
              <div className="text-[11px] text-muted-foreground">{size === "single" ? "8 fl oz · 236ml" : "2 × 236ml · save 15%"}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  k: "single" as const,
                  label: "Single Bottle",
                  sub: "236ml",
                  price: fullVariant ? `$${parseFloat(fullVariant.price.amount).toFixed(2)}` : "$16.99",
                  available: fullVariant?.availableForSale ?? true,
                },
                {
                  k: "twin" as const,
                  label: "Treatment Pack",
                  sub: isBundleAvailable ? "Save 15%" : "Out of stock",
                  price: bundleVariant ? `$${parseFloat(bundleVariant.price.amount).toFixed(2)}` : "—",
                  available: isBundleAvailable,
                },
              ].map((s) => (
                <button
                  key={s.k}
                  onClick={() => s.available && setSize(s.k)}
                  disabled={!s.available}
                  className={cn("px-3 py-3 rounded-md border text-sm transition text-left", size === s.k ? "border-foreground bg-secondary/40" : "border-border hover:border-muted-foreground/50", !s.available && "opacity-50 cursor-not-allowed")}
                >
                  <div className="font-medium text-[13px]">{s.label} · {s.sub}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Purchase */}
          <div className="space-y-2 mb-5">
            <button onClick={() => setPurchase("once")} className={cn("w-full flex items-center justify-between px-4 py-3.5 rounded-md border-2 transition", purchase === "once" ? "border-foreground" : "border-border")}>
              <span className="flex items-center gap-3 text-sm">
                <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center", purchase === "once" ? "border-foreground" : "border-muted-foreground")}>
                  {purchase === "once" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                </span>
                One-time purchase
              </span>
              <span className="text-sm font-medium">${basePrice.toFixed(2)}</span>
            </button>
            <button onClick={() => setPurchase("sub")} className={cn("w-full flex items-center justify-between px-4 py-3.5 rounded-md border-2 transition", purchase === "sub" ? "border-foreground" : "border-border")}>
              <span className="flex items-center gap-3 text-sm flex-wrap text-left">
                <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", purchase === "sub" ? "border-foreground" : "border-muted-foreground")}>
                  {purchase === "sub" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                </span>
                <span>Treatment plan — save 10%</span>
                <span className="text-[10px] tracking-widest uppercase bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Recommended</span>
              </span>
              <span className="text-sm whitespace-nowrap">
                <span className="line-through text-muted-foreground mr-1.5 text-xs">${basePrice.toFixed(2)}</span>
                <span className="font-medium">${(basePrice * 0.9).toFixed(2)}</span>
              </span>
            </button>
            {purchase === "sub" && (() => {
              const cadenceOptions = [
                { k: "4" as const, label: "Every 4 weeks", note: "Heavy flare-ups" },
                { k: "6" as const, label: "Every 6 weeks", note: "Most popular" },
                { k: "8" as const, label: "Every 8 weeks", note: "Maintenance" },
              ];
              const weeks = parseInt(cadence, 10);
              const shipBy = new Date();
              shipBy.setDate(shipBy.getDate() + 2);
              const shipByLabel = shipBy.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              const nextRefill = new Date();
              nextRefill.setDate(nextRefill.getDate() + weeks * 7);
              const nextRefillLabel = nextRefill.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <div className="px-4 py-3.5 rounded-md bg-secondary/50 border border-border/60 space-y-3.5">
                  <div>
                    <div className="text-[10px] tracking-[0.22em] uppercase text-ink-deep/70 font-medium mb-2">
                      How to use your trio
                    </div>
                    <ul className="space-y-1.5 text-xs text-foreground/85 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" strokeWidth={2.25} />
                        <span><span className="font-medium text-ink-deep">Shampoo</span> — massage into wet scalp 2–3× weekly, leave on 5 min, rinse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" strokeWidth={2.25} />
                        <span><span className="font-medium text-ink-deep">Serum</span> — apply 4–5 drops to dry scalp nightly, no rinse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" strokeWidth={2.25} />
                        <span><span className="font-medium text-ink-deep">Turmeric Soap</span> — daily on body + hairline, lather 30 sec, rinse warm</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="text-[10px] tracking-[0.22em] uppercase text-ink-deep/70 font-medium mb-2">
                      Confirm delivery cadence
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {cadenceOptions.map((c) => (
                        <button
                          key={c.k}
                          type="button"
                          onClick={() => setCadence(c.k)}
                          className={cn(
                            "rounded-md border-2 px-2 py-2 text-left transition",
                            cadence === c.k ? "border-foreground bg-background" : "border-border bg-background/60"
                          )}
                        >
                          <div className="text-[11px] font-medium text-ink-deep leading-tight">{c.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{c.note}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-border/60">
                    <Truck className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" strokeWidth={2.25} />
                    <div className="text-xs text-foreground/85 leading-relaxed">
                      <span className="font-medium text-ink-deep">Ships by {shipByLabel}</span>
                      <span className="text-muted-foreground"> · next refill {nextRefillLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
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
            Buy Now — Pay in 4
          </button>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { icon: Truck, label: "Free Shipping", sub: "$24.99+" },
              { icon: RotateCcw, label: "Easy Returns", sub: "30 days" },
              { icon: Award, label: "Money-Back", sub: "Guarantee" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center py-3 px-2 bg-secondary/40 rounded-md">
                <b.icon className="h-4 w-4 mb-1.5 text-foreground" strokeWidth={1.5} />
                <div className="text-[11px] font-medium leading-tight">{b.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{b.sub}</div>
              </div>
            ))}
          </div>

          {/* Cert badges */}
          <div className="grid grid-cols-4 items-center gap-2 sm:gap-4 mb-6">
            {[
              { src: badgeUsdaOrganic, label: "Plant-Derived Actives" },
              { src: badgeCrueltyFree, label: "Cruelty Free" },
              { src: badgeVegan, label: "Vegan Formula" },
              { src: badgeMadeInUsa, label: "Made in USA" },
            ].map((b) => (
              <img
                key={b.label}
                src={b.src}
                alt={b.label}
                title={b.label}
                loading="lazy"
                className="mx-auto h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>

          {/* Full ingredient disclosure */}
          <Accordion type="single" collapsible className="border-t border-border">
            <AccordionItem value="ingredients" className="border-b-0">
              <AccordionTrigger className="text-[11px] tracking-[0.22em] uppercase font-medium hover:no-underline py-4">
                Full ingredient list
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed pb-5 space-y-4">
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Active</div>
                  <p>Sulfur USP 2%.</p>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Inactive ingredients</div>
                  <p>
                    Aqua (Purified Water), Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Decyl Glucoside, Glycerin,
                    Melaleuca Alternifolia (Tea Tree) Leaf Oil, Azadirachta Indica (Neem) Leaf Extract, Pongamia Pinnata
                    (Karanja) Seed Oil, Acorus Calamus (Sweet Flag) Root Extract, Aloe Barbadensis Leaf Juice,
                    Panthenol (Pro-Vitamin B5), Niacinamide, Allantoin, Salicylic Acid, Hydrolyzed Quinoa Protein,
                    Guar Hydroxypropyltrimonium Chloride, Citric Acid, Sodium Gluconate, Sodium Benzoate,
                    Potassium Sorbate, Tocopherol (Vitamin E).
                  </p>
                </div>
                <p className="text-[11px] text-foreground/60">
                  Free of sulfates (SLS/SLES), parabens, phthalates, silicones, synthetic fragrance, and artificial dyes.
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
            <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/60 mb-2">Use-Test · 4 Weeks · n=64</div>
            <h2 className="font-serif text-2xl md:text-3xl">Measurable scalp relief.</h2>
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
            Self-reported user perception study, n=64 adults with mild–moderate scalp psoriasis or seborrheic dermatitis, 2–3 washes per week over 4 weeks.
          </p>
        </div>
      </section>

      {/* Mechanism of action — replaces lifestyle ritual */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden bg-secondary/40 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src={spsFlatlay}
                alt="Cross-section illustration of scalp barrier with active ingredients"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/45 to-transparent pt-12 sm:pt-16 px-5 pb-5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 text-[9px] tracking-[0.18em] uppercase text-foreground mb-2">
                  <Microscope className="w-3 h-3 text-accent" strokeWidth={2} /> Mechanism of action
                </span>
                <p className="font-serif text-background leading-snug max-w-[26ch] sm:max-w-md" style={{ fontSize: "clamp(1rem, 3.6vw, 1.875rem)" }}>
                  "Lift the plaque. Calm the inflammation. Restore the barrier."
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Clinical pathway</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Three actions.<br />One wash.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Sulfur softens hyperkeratotic scale. Tea tree and neem reduce the Malassezia load that fuels seborrheic flares. Karanja and sweet flag oils replenish lipids so the scalp barrier can heal between treatments.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Keratolytic — gently lifts plaques and scale",
                "Antimicrobial — targets yeast-driven inflammation",
                "Barrier-supportive — does not strip natural sebum",
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

      {/* Condition comparison — psoriasis vs seborrheic dermatitis vs dandruff */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24">
        <div className="text-center mb-10 lg:mb-14">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Know your scalp</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            Three conditions.<br className="sm:hidden" /> One formulation.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[15px] leading-relaxed">
            Scalp psoriasis, seborrheic dermatitis, and dandruff overlap in symptoms but differ in mechanism. Here's what each looks like — and which symptoms Dermveda is formulated to address.
          </p>
        </div>

        {(() => {
          const TARGETED = "bg-accent text-accent-foreground";
          const PARTIAL = "bg-secondary text-foreground/80";
          const NONE = "bg-muted/40 text-muted-foreground";
          const conditions: Array<{ name: string; tagline: string; icon: any; accent?: boolean; description: string; hallmark: string; symptoms: { label: string; level: "targeted" | "partial" | "none" }[] }> = [
            {
              name: "Scalp Psoriasis",
              tagline: "Autoimmune · Chronic",
              icon: ShieldCheck,
              accent: true,
              description: "An autoimmune condition driving rapid skin-cell turnover. Produces thick, well-demarcated silvery plaques along the hairline, ears and nape.",
              hallmark: "Silvery, raised plaques",
              symptoms: [
                { label: "Thick scaling & plaques", level: "targeted" },
                { label: "Persistent itching", level: "targeted" },
                { label: "Redness & inflammation", level: "targeted" },
                { label: "Burning / soreness", level: "partial" },
                { label: "Hair shedding from scratching", level: "partial" },
              ],
            },
            {
              name: "Seborrheic Dermatitis",
              tagline: "Inflammatory · Yeast-driven",
              icon: Microscope,
              description: "Inflammatory reaction to Malassezia yeast overgrowth. Greasy yellowish flakes appear on the scalp, eyebrows, and sides of the nose.",
              hallmark: "Greasy yellow flakes",
              symptoms: [
                { label: "Oily / greasy flaking", level: "targeted" },
                { label: "Yeast overgrowth (Malassezia)", level: "targeted" },
                { label: "Itching & irritation", level: "targeted" },
                { label: "Diffuse redness", level: "targeted" },
                { label: "Odor from buildup", level: "partial" },
              ],
            },
            {
              name: "Dandruff",
              tagline: "Mild · Recurring",
              icon: Droplet,
              description: "The mildest form of seborrheic dermatitis. Small, dry white flakes that brush off easily, often without significant redness.",
              hallmark: "Fine white flakes",
              symptoms: [
                { label: "Light, dry flaking", level: "targeted" },
                { label: "Mild itching", level: "targeted" },
                { label: "Scalp buildup", level: "targeted" },
                { label: "Tightness after washing", level: "partial" },
                { label: "Severe inflammation", level: "none" },
              ],
            },
          ] as const;

          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {conditions.map((c) => (
                  <article
                    key={c.name}
                    className={cn(
                      "rounded-2xl border p-6 lg:p-7 flex flex-col h-full transition",
                      c.accent
                        ? "bg-foreground text-background border-foreground shadow-sm"
                        : "bg-background border-border hover:shadow-sm",
                    )}
                  >
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
                      What Dermveda targets
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

              {/* Legend */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-accent" /> Directly targeted
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-secondary border border-border" /> Partial relief
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-muted/60 border border-border" /> Not addressed
                </span>
              </div>

              <p className="text-[10px] text-center text-foreground/50 mt-5 tracking-wider max-w-2xl mx-auto">
                Symptom mapping is for educational purposes only and does not constitute a medical diagnosis. Persistent or severe symptoms should be evaluated by a board-certified dermatologist.
              </p>
            </>
          );
        })()}
      </section>

      {/* Before / After */}
      <section className="bg-secondary/40">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Compact image pair */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto lg:mx-0">
                <figure className="relative rounded-xl overflow-hidden bg-background shadow-sm">
                  <img
                    src={spsBefore}
                    alt="Scalp with thick yellow psoriasis plaques and crusting along the hairline before treatment"
                    className="w-full h-auto block aspect-[3/4] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-deep/85 backdrop-blur text-[9px] tracking-[0.18em] uppercase text-background">
                    Day 0 · Before
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/55 to-transparent p-3 pt-8">
                    <p className="text-[11px] leading-snug text-background/95">
                      Thick scaling, redness and visible plaques along the hairline.
                    </p>
                  </figcaption>
                </figure>
                <figure className="relative rounded-xl overflow-hidden bg-background shadow-sm">
                  <img
                    src={spsAfter}
                    alt="Same scalp visibly clear and calm after 2 weeks of consistent use of the medicated shampoo"
                    className="w-full h-auto block aspect-[3/4] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-[9px] tracking-[0.18em] uppercase">
                    <Sparkles className="w-2.5 h-2.5" strokeWidth={2} /> Week 2 · After
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/55 to-transparent p-3 pt-8">
                    <p className="text-[11px] leading-snug text-background/95">
                      Plaques cleared, calm scalp, no visible inflammation.
                    </p>
                  </figcaption>
                </figure>
              </div>
              <p className="text-[10px] text-foreground/50 mt-4 tracking-wider max-w-xl mx-auto lg:mx-0">
                Individual results vary. Photographs are illustrative and not a guarantee of clinical outcome.
              </p>
            </div>

            {/* Side text */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Visible scalp clearance</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
                Less flaking. Less itch. In 2 weeks.
              </h2>
              <p className="text-foreground/70 text-base leading-relaxed mb-5">
                After 14 days of using the medicated shampoo 3× weekly, thick yellow plaques and crusting along the hairline visibly cleared, leaving calm, healthy scalp skin.
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/80">
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Plaques cleared along the frontal hairline</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Calm, hydrated scalp — no visible inflammation</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Hair visibly cleaner and lighter at the root</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">The complete protocol</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-5">
            Scalp Relief Turmeric Trio
          </h2>
          <p className="text-foreground/70 text-base leading-relaxed">
            Pair the medicated shampoo with our targeted scalp serum and an anti-inflammatory turmeric soap. Designed to work together: cleanse, treat, soothe — morning to night.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-10">
          {[
            { img: spsHero, alt: "Dermveda Scalp Psoriasis Shampoo bottle", icon: Droplet, step: "Step 01 · Cleanse", name: "Medicated Shampoo", desc: "3× weekly to lift scale and calm inflammation.", price: "$32" },
            { img: spsSerum, alt: "Scalp psoriasis serum dropper bottle", icon: FlaskConical, step: "Step 02 · Treat", name: "Scalp Psoriasis Serum", desc: "Daily leave-on for direct plaque-zone delivery.", price: "$38" },
            { img: spsSoap, alt: "Handmade turmeric soap bar with fresh turmeric root", icon: Leaf, step: "Step 03 · Soothe", name: "Turmeric Soap", desc: "Anti-inflammatory turmeric + curcumin to brighten, calm redness and gently cleanse the hairline & nape.", price: "$25" },
          ].map((p) => (
            <div key={p.name} className="group relative rounded-2xl bg-secondary/40 p-6 flex flex-col">
              <div className="text-[9px] tracking-[0.22em] uppercase text-accent mb-3 inline-flex items-center gap-1.5">
                <p.icon className="w-3 h-3" strokeWidth={2} /> {p.step}
              </div>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-background mb-5 flex items-center justify-center">
                <img src={p.img} alt={p.alt} className="w-full h-full object-contain p-6 transition duration-500 group-hover:scale-[1.04]" loading="lazy" decoding="async" />
              </div>
              <h3 className="font-serif text-xl mb-2 leading-tight">{p.name}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed mb-4 flex-1">{p.desc}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/60 mb-4">
                <span className="text-sm text-foreground/60">Individually</span>
                <span className="font-medium">{p.price}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-full text-[10px] tracking-[0.2em] uppercase"
                aria-label={`Add ${p.name} to bag`}
              >
                Add to bag
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-ink-deep text-primary-foreground p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-[10px] tracking-[0.2em] uppercase font-medium">
              Save 18%
            </span>
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/60 mb-1">Shampoo + Serum + Turmeric Soap</div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl md:text-4xl">$78</span>
                <span className="text-primary-foreground/50 line-through text-base">$95</span>
                <span className="text-xs tracking-[0.18em] uppercase text-accent">You save $17</span>
              </div>
            </div>
          </div>
          <Button size="lg" variant="secondary" className="rounded-full px-8 text-xs tracking-[0.2em] uppercase">
            Shop the natural skincare set
          </Button>
        </div>
      </section>

      {/* Key ingredients */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">The active panel</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Four actives.<br />Backed by literature.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Each ingredient was selected against a defined clinical target — keratolysis, antimicrobial activity, anti-inflammatory action, or barrier repair — and dosed within evidence-based ranges.
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
      <section className="bg-secondary/40 py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Treatment protocol</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">How to use.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {ROUTINE.map((r) => (
              <div key={r.step} className={cn("rounded-xl p-5 lg:p-6 border transition flex flex-col", (r as any).highlight ? "bg-foreground text-background border-foreground" : "bg-background border-border")}>
                <div className={cn("text-[10px] tracking-[0.2em] uppercase mb-3", (r as any).highlight ? "text-background/60" : "text-muted-foreground")}>
                  {r.time}
                </div>
                <div className={cn("font-serif text-3xl mb-3", (r as any).highlight ? "text-background" : "text-ink-deep")}>{r.step}</div>
                <h3 className={cn("font-medium mb-2 text-[15px]", (r as any).highlight && "text-background")}>{r.title}</h3>
                <p className={cn("text-xs leading-relaxed", (r as any).highlight ? "text-background/70" : "text-muted-foreground")}>{r.body}</p>
                {(r as any).highlight && (
                  <span className="inline-flex items-center gap-1 mt-3 text-[10px] tracking-[0.15em] uppercase text-accent">
                    <Droplet className="h-3 w-3" /> This shampoo
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-foreground/50 mt-8 tracking-wider max-w-2xl mx-auto">
            For external use only. Avoid contact with eyes. Discontinue use and consult a physician if irritation or rash develops. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-ink-deep text-primary-foreground py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">The clinical difference</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-3">Dermveda vs. conventional medicated shampoos</h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto text-sm">
              Same therapeutic targets — without the harsh surfactants, fragrance, or staining of legacy formulations.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-primary-foreground/15 bg-primary-foreground/[0.02]">
            <div className="grid grid-cols-3 bg-primary-foreground/[0.06] text-[10px] tracking-[0.2em] uppercase">
              <div className="p-4 lg:p-5 text-primary-foreground/50"></div>
              <div className="p-4 lg:p-5 text-accent border-l border-primary-foreground/15 font-medium">Dermveda</div>
              <div className="p-4 lg:p-5 text-primary-foreground/50 border-l border-primary-foreground/15">Legacy Medicated</div>
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

      {/* Expert quote */}
      <section className="bg-peach">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <LiteYouTube
                id="dbxs9yaNtkA"
                start={1}
                title="Watch: Dr. Jennifer Haley on dermatologic scalp care"
                className="shadow-lg"
              />
            </div>
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Dermatologist approved</div>
              <blockquote className="font-serif text-xl md:text-2xl leading-snug mb-4 text-ink-deep">
                "For patients who can't tolerate coal tar or strong steroid foams, a well-formulated sulfur and tea tree shampoo can be a meaningful first-line option."
              </blockquote>
              <div className="text-sm">
                <div className="font-medium">Dr. Jennifer Haley, M.D.</div>
                <div className="text-foreground/60 text-xs tracking-wider uppercase mt-1">
                  Board-Certified Dermatologist · 20+ Years
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage — modern dermatology meets ancient herbs */}
      <section className="bg-peach/40 py-20 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={spsCounter}
                  alt="Modern dermatology nano-science meets ancient herbal scalp remedies"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] tracking-[0.22em] uppercase text-foreground">
                  <Pill className="w-3 h-3 text-accent" strokeWidth={2} />
                  Nano-formulated
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="text-[10px] tracking-[0.28em] uppercase text-accent mb-4">
                Modern dermatology, ancient herbs
              </div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.05] mb-6 text-ink-deep">
                Where the OTC monograph<br />meets the materia medica.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-5 max-w-xl">
                Sulfur has been used for inflammatory scalp disorders since the era of the original FDA OTC monograph. Neem, karanja and sweet flag have been documented in Ayurvedic dermatology — <em className="not-italic font-serif italic text-ink-deep">kushtha-ghna</em> formulations — for centuries. Dermveda combines both lineages with cold-process emulsification so each active reaches the scalp at a clinically relevant dose.
              </p>
              <p className="text-foreground/75 leading-relaxed max-w-xl">
                The result is a fragrance-free, sulfate-free, paraben-free shampoo that is gentle enough for a sensitive scalp yet decisive enough to address recurring flares.
              </p>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {[
              {
                title: "Keratolysis",
                meaning: "Loosens scale",
                how: "Medicated sulfur softens the disulfide bonds in hyperkeratotic plaques so they can be gently rinsed away.",
                icon: ShieldCheck,
              },
              {
                title: "Antimicrobial",
                meaning: "Reduces yeast load",
                how: "Tea tree oil and neem extract target Malassezia species implicated in seborrheic dermatitis flares.",
                icon: Microscope,
              },
              {
                title: "Barrier repair",
                meaning: "Restores lipids",
                how: "Karanja and sweet flag oils replenish the scalp's lipid film between washes — without occluding follicles.",
                icon: Leaf,
              },
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
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Clinical questions</div>
          <h2 className="font-serif text-3xl md:text-5xl">Answers from our team</h2>
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

      {/* Reviews — empty state, no fabricated content */}
      <section id="reviews" className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Reviews</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-5">Be the first to share your results.</h2>
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
                <Stethoscope className="w-6 h-6 mx-auto mb-3 text-muted-foreground/50" strokeWidth={1.5} />
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
            Always read and follow label directions. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare provider before starting any new treatment, particularly if you are pregnant, nursing, or under medical care.
          </p>
        </div>
      </section>

      {/* Mobile sticky purchase bar — visible after scrolling past hero */}
      <div
        className={cn(
          "lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-t border-border",
          "px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
          "transition-transform duration-300 ease-out shadow-[0_-8px_24px_-12px_hsl(var(--ink-deep)/0.18)]",
          showStickyBar ? "translate-y-0" : "translate-y-full",
        )}
        role="region"
        aria-label="Purchase bar"
      >
        <div className="flex items-center gap-3">
          {/* Stacked product thumbnails to telegraph "trio" at a glance */}
          <div className="flex -space-x-2 shrink-0">
            <img src={spsHero} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
            <img src={spsSerum} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
            <img src={spsSoap} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-ink-deep/70 tracking-wide truncate">
              Shampoo + Serum + Turmeric Soap
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-[16px] leading-none text-ink-deep">$58</span>
              <span className="text-[11px] text-muted-foreground line-through leading-none">$72</span>
              <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-accent leading-none">
                Save $14
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="rounded-full px-4 h-10 text-[11px] tracking-[0.16em] uppercase bg-ink-deep text-primary-foreground hover:bg-ink-deep/90 shrink-0"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? "Adding…" : "Shop set"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScalpPsoriasisShampoo;
