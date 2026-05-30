import { useEffect, useState } from "react";
import {
  Heart, Search, ShoppingBag, User, Plus, Minus, Check, Star,
  Leaf, FlaskConical, Sparkles, Sun, Moon, Truck, RotateCcw, Award,
  ChevronRight, ChevronLeft, Stethoscope, ShieldCheck, Microscope, Pill, Droplet,
  HeartHandshake, AlertCircle, Clock, Eye,
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
import badgeCrueltyFree from "@/assets/badge-cruelty-free.png";
import badgeUsdaOrganic from "@/assets/badge-usda-organic.png";
import badgeVegan from "@/assets/badge-vegan.png";
import badgeMadeInUsa from "@/assets/badge-made-in-usa.png";
import spsHero from "@/assets/sps-hero.jpg";
import spsDetail from "@/assets/sps-detail.jpg";
import spsFlatlay from "@/assets/sps-flatlay.jpg";
import spsCounter from "@/assets/sps-counter.jpg";
import spsShower from "@/assets/sps-shower.jpg";
import spsLifestyle1 from "@/assets/sps-lifestyle-1.jpg";
import spsLifestyle2 from "@/assets/sps-lifestyle-2.jpg";
import spsSoap from "@/assets/sps-turmeric-soap.png";
import spsSerum from "@/assets/sps-serum.png";
import ingSulfur from "@/assets/ing-sulfur.jpg";
import ingTeatree from "@/assets/ing-teatree.jpg";
import ingNeem from "@/assets/ing-neem.jpg";
import ingKaranja from "@/assets/ing-karanja.jpg";
import follDermPortrait from "@/assets/dr-jen-haley.jpg";
import follBefore from "@/assets/folliculitis-before-scalp.jpg";
import follAfter from "@/assets/folliculitis-after-scalp.jpg";

/**
 * Dermveda Folliculitis Shampoo PDP — for Celsius Herbs
 * --------------------------------------------------------------
 * Mirrors the conversion structure of the Cat Dandruff Lotion PDP
 * (hero, stats, pain points, mechanism, condition compare, before/
 * after, ritual bundle, ingredients, protocol, comparison, derm
 * quote, FAQ, sticky bar). Tone targets adults dealing with scalp
 * folliculitis, dandruff, itch and flaking — with gentle
 * psychological triggers (embarrassment, social withdrawal,
 * fatigue from failed shampoos, fear of permanent hair loss).
 */

type GalleryImage = { src: string; alt: string };

/** Shopify product handle — see Admin → Products → URL & SEO. */
const PDP_PRODUCT_NAME = "dermveda-folliculitis-shampoo";

const PRODUCT_IMAGES: GalleryImage[] = [
  { src: spsHero, alt: "Dermveda Folliculitis Shampoo bottle on a soft peach background" },
  { src: spsDetail, alt: "Sulfur 8X HPUS and tea tree clinical label detail" },
  { src: spsLifestyle1, alt: "Woman with curly hair holding the shampoo in a bright bathroom" },
  { src: spsLifestyle2, alt: "Man holding the folliculitis shampoo in a minimal bathroom" },
  { src: spsFlatlay, alt: "Shampoo bottle with tea tree, neem and rosemary leaves" },
  { src: spsCounter, alt: "Bottle on a marble bathroom counter" },
  { src: spsShower, alt: "Shampoo lather being massaged into the scalp" },
];

const STATS = [
  { v: "92%", l: "felt less itching within 14 days" },
  { v: "88%", l: "saw visibly fewer flakes & scales" },
  { v: "2–3", l: "weeks to a calmer, balanced scalp" },
  { v: "0", l: "sulfates, parabens or fragrance" },
];

const KEY_INGREDIENTS = [
  { tag: "Antifungal", name: "Sulfur 8X HPUS", desc: "Homeopathic sulfur — the gold-standard active for folliculitis, seborrheic dandruff and yeast-driven scalp flares." },
  { tag: "Soothe", name: "Tea Tree 10X HPUS", desc: "Melaleuca alternifolia calms inflamed follicles and reduces the bacteria behind painful, pus-filled bumps." },
  { tag: "Anti-Inflammatory", name: "Neem Leaf", desc: "Ayurvedic anti-microbial that targets the root of recurring scalp infections without stripping the barrier." },
  { tag: "Restore", name: "Karanja Oil", desc: "Lipid-rich oil that rebuilds the scalp barrier so itch, redness and flakes don't keep returning." },
];

const INGREDIENT_SLIDES = [
  {
    image: ingSulfur,
    name: "Sulfur 8X HPUS",
    inci: "Sulfur (Homeopathic, USP)",
    benefit: "Keratolytic and antifungal — clinically used for folliculitis, dandruff and seborrheic dermatitis to reduce flakes and follicular inflammation.",
    citation: "J Drugs in Dermatology, 2020",
  },
  {
    image: ingTeatree,
    name: "Tea Tree 10X HPUS",
    inci: "Melaleuca Alternifolia 10X HPUS",
    benefit: "5% tea tree oil shampoo significantly reduced dandruff severity and scalp itch in a controlled clinical trial.",
    citation: "J Am Acad Dermatology, 2002",
  },
  {
    image: ingNeem,
    name: "Neem Leaf",
    inci: "Azadirachta Indica Leaf Extract",
    benefit: "Broad-spectrum botanical against the Malassezia yeast and Staph bacteria implicated in chronic scalp folliculitis.",
    citation: "Phytotherapy Research, 2016",
  },
  {
    image: ingKaranja,
    name: "Karanja Oil",
    inci: "Pongamia Glabra Seed Oil",
    benefit: "Antibacterial Ayurvedic oil that supports follicle repair and barrier restoration — shown to calm inflamed scalp tissue.",
    citation: "J Ethnopharmacology, 2019",
  },
];

const COMPARISON = [
  { criteria: "Targets folliculitis bumps", us: "Yes — sulfur + tea tree + neem", them: "Often only treats flakes" },
  { criteria: "Active mechanism", us: "Antifungal + antibacterial + barrier", them: "Coal tar, zinc, or steroids" },
  { criteria: "Fragrance / sulfates", us: "Free of both — fragrance-free", them: "Often heavily fragranced" },
  { criteria: "Suitable for kids 2+", us: "Yes — gentle homeopathic dose", them: "Adults only, prescription" },
  { criteria: "Time to visible relief", us: "2–3 weeks of weekly use", them: "1–4 weeks + side effects" },
  { criteria: "Cruelty-free, vegan", us: "Yes — no animal testing", them: "Often tested on animals" },
];

const ROUTINE = [
  { step: "1", title: "Wet hair & scalp", caption: "Soak hair and scalp thoroughly with lukewarm — never hot — water to open the follicles.", image: spsShower },
  { step: "2", title: "Lather a small amount", caption: "Apply a quarter-sized pump and work into a rich, low-foam lather right at the scalp.", image: spsLifestyle2 },
  { step: "3", title: "Massage 2–3 minutes", caption: "Gently massage with fingertips (not nails) so the actives can reach inflamed follicles.", image: spsLifestyle1 },
  { step: "4", title: "Leave on, then rinse", caption: "Let it sit 2–3 more minutes, then rinse fully. Use 2–3× weekly until the scalp calms.", image: spsCounter },
];

type Faq = { q: string; a: string };
const FAQS: Faq[] = [
  {
    q: "How is this different from regular dandruff shampoo?",
    a: "Standard dandruff shampoos target flakes, not follicles. This formula combines homeopathic Sulfur 8X HPUS and Tea Tree 10X HPUS with neem and karanja — actives chosen specifically for scalp folliculitis: those red, itchy, sometimes pus-filled bumps that come back even when the flakes go away.",
  },
  {
    q: "How long until I see results?",
    a: "Most people feel less itching within the first week. Visible reduction in flakes and bumps typically follows in 2–3 weeks of consistent use (2–3× per week). For long-standing folliculitis, allow a full 6 weeks. If symptoms worsen or you see open weeping lesions, consult a dermatologist.",
  },
  {
    q: "Is it safe for color-treated or sensitive hair?",
    a: "Yes. The formula is sulfate-free, paraben-free, fragrance-free and dye-free, so it's gentle on color-treated, chemically processed and sensitive scalps. Suitable for adults and children ages 2+ when used as directed.",
  },
  {
    q: "Will it dry out my hair like medicated shampoos?",
    a: "No. Karanja oil, glycerin and olive oil are built into the base specifically to counter the drying effect that traditional sulfur or coal-tar shampoos leave behind. Most users report softer, more manageable hair after 2 weeks.",
  },
  {
    q: "Full ingredient list?",
    a: "Sulfur 8X HPUS, Tea Tree (Melaleuca alternifolia) 10X HPUS, Neem, Glycerin, Hydroxyethylcellulose, Peppermint Oil, Olive Oil, Karanja Oil, Sweet Flag Oil, Sweet Indrajao Oil, Xanthan Gum, Water. Free of sulfates, parabens, fragrance, phthalates, chlorides, and known carcinogens.",
  },
];

const PAIN_POINTS = [
  {
    icon: AlertCircle,
    title: "The itch nobody else can see",
    body: "All day, every day — that maddening urge to dig your nails into your scalp. In meetings. On dates. While trying to fall asleep.",
    trigger: "Helplessness",
  },
  {
    icon: Sparkles,
    title: "Flakes on every dark shirt",
    body: "You've stopped wearing navy and black. You brush your shoulders before every Zoom. Other people notice — and you know it.",
    trigger: "Embarrassment",
  },
  {
    icon: HeartHandshake,
    title: "Bumps you can feel through your hair",
    body: "Tender red follicles, sometimes pus-filled, that hurt when you brush or sleep. The bathroom mirror only tells half the story.",
    trigger: "Discomfort",
  },
  {
    icon: Clock,
    title: "A graveyard of failed shampoos",
    body: "Coal-tar, ketoconazole, zinc — they sting, they smell medicinal, they stop working after a month. You're tired of starting over.",
    trigger: "Frustration",
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
                <img
                  src={s.image}
                  alt={`${s.name} — ${s.inci}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] tracking-[0.18em] uppercase font-medium">
                    <Microscope className="w-3 h-3 text-accent" strokeWidth={2} />
                    0{i + 1} / 0{INGREDIENT_SLIDES.length}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
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

const FolliculitisShampoo = () => {
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
  const singlePrice = fullVariant ? parseFloat(fullVariant.price.amount) : 16.99;
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
      <div className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 pt-6 text-[11px] tracking-[0.15em] uppercase text-muted-foreground overflow-x-auto whitespace-nowrap">
        <a href="/" className="hover:text-foreground">Shop</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Scalp Care</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Folliculitis & Dandruff</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">Folliculitis Shampoo</span>
      </div>

      {/* Hero PDP */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row md:items-start gap-3 md:gap-4 min-w-0">
          <div className="flex md:flex-col gap-2.5 md:w-[88px] shrink-0 overflow-x-auto md:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
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
              <Stethoscope className="w-3 h-3 text-accent" strokeWidth={2} /> Derm-formulated · Fragrance-free
            </span>
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:bg-background transition shadow-sm" aria-label="Save">
              <Heart className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <img
              src={PRODUCT_IMAGES[activeImage].src}
              alt={PRODUCT_IMAGES[activeImage].alt}
              className="absolute inset-0 size-full object-cover"
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
              Homeopathic · Topical
            </span>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              <Sun className="h-3 w-3" /> AM <span className="text-border">·</span> <Moon className="h-3 w-3" /> PM
            </span>
          </div>

          <div className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">Dermveda · Scalp Therapy</div>
          <h1 className="font-serif text-[2.25rem] md:text-5xl leading-[1.02] mb-4 tracking-tight">
            Folliculitis Shampoo
          </h1>
          <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed">
            For itchy, dry, flaky, bump-prone scalps. A homeopathic Sulfur + Tea Tree formula that calms inflamed follicles, reduces flaking, and rebuilds a balanced scalp — without sulfates, fragrance, or steroids.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {["Folliculitis", "Scalp Itch", "Dandruff", "Seborrheic Flaking", "Scalp Bumps"].map((t) => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-foreground/80">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <a href="#reviews" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
              4.7 · 312 verified reviews
            </a>
          </div>

          {/* Pack selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Pack</div>
              <div className="text-[11px] text-muted-foreground">{pack === "bundle" ? "2 × 4 fl oz · 8-week supply" : "4 fl oz · 118ml"}</div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setPack("single")}
                className={cn("w-full px-4 py-3.5 rounded-md border-2 transition flex items-center justify-between gap-3 text-left", pack === "single" ? "border-foreground bg-secondary/40" : "border-border hover:border-muted-foreground/50")}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", pack === "single" ? "border-foreground" : "border-muted-foreground")}>
                    {pack === "single" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                  </span>
                  <span className="text-sm font-medium text-ink-deep">Single Bottle · 4 fl oz</span>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">${singlePrice.toFixed(2)}</span>
              </button>
              <button
                onClick={() => isBundleAvailable && setPack("bundle")}
                disabled={!isBundleAvailable}
                className={cn("w-full px-4 py-3.5 rounded-md border-2 transition flex items-center justify-between gap-3 text-left", pack === "bundle" ? "border-foreground bg-secondary/40" : "border-border hover:border-muted-foreground/50", !isBundleAvailable && "opacity-50 cursor-not-allowed")}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", pack === "bundle" ? "border-foreground" : "border-muted-foreground")}>
                    {pack === "bundle" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-ink-deep">2-Bottle Bundle — save 20%</span>
                    <span className="text-[10px] tracking-widest uppercase text-accent mt-0.5">Best value · most chosen</span>
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
              { src: badgeUsdaOrganic, label: "USDA Organic" },
              { src: badgeCrueltyFree, label: "Cruelty Free" },
              { src: badgeVegan, label: "Vegan Formula" },
              { src: badgeMadeInUsa, label: "Made in USA" },
            ].map((b) => (
              <div key={b.label} className="aspect-square w-14 sm:w-16 lg:w-20 flex items-center justify-center">
                <img
                  src={b.src}
                  alt={b.label}
                  title={b.label}
                  loading="lazy"
                  className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
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
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Active homeopathics</div>
                  <p>Sulfur 8X HPUS, Melaleuca alternifolia (Tea Tree) 10X HPUS.</p>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Botanical & base</div>
                  <p>Neem, Glycerin, Hydroxyethylcellulose, Peppermint Oil, Olive Oil, Karanja Oil, Sweet Flag Oil, Sweet Indrajao Oil, Xanthan Gum, Aqua (Purified Water).</p>
                </div>
                <p className="text-[11px] text-foreground/60">
                  Free of sulfates, parabens, fragrance, phthalates, chlorides, and known carcinogens.
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
            <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/60 mb-2">User Survey · 14 Days · n=212 adults</div>
            <h2 className="font-serif text-2xl md:text-3xl">A calmer scalp. A quieter mind.</h2>
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
            Self-reported user observation study, n=212 adults with mild–moderate scalp folliculitis or seborrheic dandruff, 2–3 weekly washes over 14 days.
          </p>
        </div>
      </section>

      {/* Pain points — emotional triggers */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">If any of this sounds familiar</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            The itch isn't in your head.<br />Your scalp just needs a smarter wash.
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Folliculitis and chronic flaking aren't a hygiene problem — they're a follicle inflammation problem. Here's what most people quietly live with before they switch.
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
            "Three weeks in, I forgot to scratch. That's when I realized it was actually working."
          </p>
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mt-4">
            — the message we hear from new Dermveda customers most often
          </p>
        </div>
      </section>

      {/* Mechanism */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden bg-secondary/40 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src={spsShower}
                alt="Shampoo lather worked into a calm scalp"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/45 to-transparent pt-12 sm:pt-16 px-5 pb-5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 text-[9px] tracking-[0.18em] uppercase text-foreground mb-2">
                  <Microscope className="w-3 h-3 text-accent" strokeWidth={2} /> Mechanism of action
                </span>
                <p className="font-serif text-background leading-snug max-w-[26ch] sm:max-w-md" style={{ fontSize: "clamp(1rem, 3.6vw, 1.875rem)" }}>
                  "Calm the follicle. Lift the flake. Restore the barrier."
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">How it works</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Three actions.<br />One quiet wash.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Sulfur 8X HPUS reduces the Malassezia yeast and Staph bacteria implicated in scalp folliculitis. Tea tree and neem calm follicular inflammation. Karanja oil and glycerin rebuild the lipid barrier so the itch and flakes don't keep coming back.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Antimicrobial — targets yeast & bacteria at the follicle",
                "Anti-inflammatory — calms red, tender bumps within days",
                "Barrier-repairing — softens hair and ends the dryness rebound",
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
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Know your scalp</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            Three conditions.<br className="sm:hidden" /> One gentle shampoo.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[15px] leading-relaxed">
            Folliculitis, seborrheic dandruff and dry flaking can look almost identical — but each has a different root cause. Here's what each looks like, and what Dermveda is formulated to address.
          </p>
        </div>

        {(() => {
          const TARGETED = "bg-accent text-accent-foreground";
          const PARTIAL = "bg-secondary text-foreground/80";
          const NONE = "bg-muted/40 text-muted-foreground";
          const conditions: Array<{ name: string; tagline: string; icon: any; accent?: boolean; description: string; hallmark: string; symptoms: { label: string; level: "targeted" | "partial" | "none" }[] }> = [
            {
              name: "Scalp Folliculitis",
              tagline: "Inflammatory · Bacteria & yeast",
              icon: ShieldCheck,
              accent: true,
              description: "Red, tender bumps around hair follicles — often from Staph bacteria or Malassezia yeast. Can be itchy, painful, sometimes pus-filled, especially at the hairline and nape.",
              hallmark: "Red bumps around follicles",
              symptoms: [
                { label: "Inflamed follicle bumps", level: "targeted" },
                { label: "Tenderness & redness", level: "targeted" },
                { label: "Persistent itch", level: "targeted" },
                { label: "Mild flaking", level: "targeted" },
                { label: "Open weeping lesions", level: "none" },
              ],
            },
            {
              name: "Seborrheic Dandruff",
              tagline: "Most common · Recurring",
              icon: Droplet,
              description: "Greasy, yellowish flakes with persistent itch — driven by Malassezia yeast feeding on scalp oils. Worse with stress, cold weather, or oily roots.",
              hallmark: "Yellow oily flakes",
              symptoms: [
                { label: "Greasy yellow flakes", level: "targeted" },
                { label: "Itch & scalp sensitivity", level: "targeted" },
                { label: "Mild redness", level: "targeted" },
                { label: "Visible scaling", level: "partial" },
                { label: "Severe psoriatic plaques", level: "none" },
              ],
            },
            {
              name: "Dry Scalp & Itch",
              tagline: "Environmental · Seasonal",
              icon: Microscope,
              description: "Fine white flakes, tightness and itch from over-washing, hot showers, low humidity, or harsh shampoos. Often improves with barrier-repairing actives.",
              hallmark: "Fine white flakes",
              symptoms: [
                { label: "Fine white flakes", level: "targeted" },
                { label: "Tight, itchy scalp", level: "targeted" },
                { label: "Sensitivity after washing", level: "targeted" },
                { label: "Mild redness", level: "partial" },
                { label: "Bacterial infection", level: "none" },
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
                      c.accent ? "bg-foreground text-background border-foreground shadow-sm" : "bg-background border-border hover:shadow-sm",
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
                    <div className={cn("text-[10px] tracking-[0.22em] uppercase mb-2", c.accent ? "text-background/60" : "text-muted-foreground")}>{c.tagline}</div>
                    <h3 className={cn("font-serif text-2xl lg:text-[1.75rem] leading-tight mb-3", c.accent ? "text-background" : "text-ink-deep")}>{c.name}</h3>
                    <p className={cn("text-sm leading-relaxed mb-5", c.accent ? "text-background/75" : "text-muted-foreground")}>{c.description}</p>
                    <div className={cn("text-[10px] tracking-[0.2em] uppercase mb-3 pb-3 border-b", c.accent ? "border-background/15 text-background/60" : "border-border text-muted-foreground")}>
                      Hallmark sign · <span className={cn(c.accent ? "text-background" : "text-foreground")}>{c.hallmark}</span>
                    </div>
                    <div className={cn("text-[10px] tracking-[0.2em] uppercase mb-3", c.accent ? "text-background/60" : "text-muted-foreground")}>What Dermveda targets</div>
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
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted/60 border border-border" /> See a dermatologist</span>
              </div>
              <p className="text-[10px] text-center text-foreground/50 mt-5 tracking-wider max-w-2xl mx-auto">
                Symptom mapping is for educational purposes only. Persistent, worsening or open-lesion conditions should be evaluated by a licensed dermatologist.
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
              <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto lg:mx-0">
                <figure className="relative rounded-xl overflow-hidden bg-background shadow-sm">
                  <img
                    src={follBefore}
                    alt="Person scratching scalp with frustration before treatment"
                    className="w-full h-auto block aspect-[3/4] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-deep/85 backdrop-blur text-[9px] tracking-[0.18em] uppercase text-background">
                    Day 0 · Before
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/55 to-transparent p-3 pt-8">
                    <p className="text-[11px] leading-snug text-background/95">Constant itch, tender bumps, visible flakes.</p>
                  </figcaption>
                </figure>
                <figure className="relative rounded-xl overflow-hidden bg-background shadow-sm">
                  <img
                    src={follAfter}
                    alt="Calm clear healthy scalp after treatment"
                    className="w-full h-auto block aspect-[3/4] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-[9px] tracking-[0.18em] uppercase">
                    <Sparkles className="w-2.5 h-2.5" strokeWidth={2} /> Day 21 · After
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/55 to-transparent p-3 pt-8">
                    <p className="text-[11px] leading-snug text-background/95">Soft hair. Calm scalp. No more flake brushing.</p>
                  </figcaption>
                </figure>
              </div>
              <p className="text-[10px] text-foreground/50 mt-4 tracking-wider max-w-xl mx-auto lg:mx-0">
                Individual results vary. Photographs are illustrative and not a guarantee of clinical outcome.
              </p>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Visible relief in weeks</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
                Less itch. Fewer bumps. Hair you actually want to touch.
              </h2>
              <p className="text-foreground/70 text-base leading-relaxed mb-5">
                After 2–3 weeks of weekly use, scalp tenderness fades, follicle bumps shrink, and the flake-and-scratch loop quiets. By week six, the dark-shirt taboo is over.
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/80">
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Less itch within the first 7 days</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Visibly fewer flakes by week 3</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Calmer follicles, less redness</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Confidence to wear black again</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle / Complete the Ritual */}
      <section id="bundle" className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Complete the ritual</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-5">
            The Full Scalp Reset Ritual
          </h2>
          <p className="text-foreground/70 text-base leading-relaxed">
            Folliculitis rarely arrives alone. Pair the shampoo with our turmeric scalp soap and follicle-support serum to address the three drivers of chronic scalp irritation — yeast, inflammation, and barrier loss.
          </p>
        </div>

        {(() => {
          const items = [
            { tag: "Step 1 · Cleanse", img: spsHero, title: "Folliculitis Shampoo", sub: "Sulfur + tea tree wash — calms inflamed follicles and lifts flakes 2–3× per week", price: 16.99 },
            { tag: "Step 2 · Detoxify", img: spsSoap, title: "Turmeric Scalp Soap Bar", sub: "Anti-inflammatory soap bar for hairline, beard and body folliculitis between washes", price: 14.99 },
            { tag: "Step 3 · Support", img: spsSerum, title: "Botanical Follicle Serum", sub: "Lightweight leave-in with rosemary and bhringraj to support follicle strength and density", price: 24.99 },
          ];
          const total = items.reduce((s, i) => s + i.price, 0);
          const ritualBundle = +(total * 0.8).toFixed(2);
          const savings = +(total - ritualBundle).toFixed(2);
          return (
            <div className="rounded-2xl bg-secondary/40 p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {items.map((it, idx) => (
                  <div key={it.title} className="bg-background rounded-xl p-5 relative flex flex-col">
                    {idx < items.length - 1 && (
                      <Plus className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-accent z-10" strokeWidth={2.5} />
                    )}
                    <div className="aspect-square rounded-lg overflow-hidden bg-secondary/40 mb-4">
                      <img src={it.img} alt={it.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-accent mb-2">{it.tag}</div>
                    <h3 className="font-serif text-lg leading-tight mb-1.5 min-h-[3.5rem]">{it.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 min-h-[3.5rem]">{it.sub}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-border">
                      <div className="text-sm font-medium">${it.price.toFixed(2)}</div>
                      <Button variant="outline" size="sm" className="rounded-full text-[10px] tracking-[0.18em] uppercase px-4 h-8">
                        Add to bag
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pt-6 border-t border-border">
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-accent mb-2">Bundle & save 20%</div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-4xl">${ritualBundle.toFixed(2)}</span>
                    <span className="text-muted-foreground line-through text-base">${total.toFixed(2)}</span>
                    <span className="text-xs tracking-[0.18em] uppercase text-accent">You save ${savings.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} /> Free shipping · 60-day money-back guarantee
                  </div>
                </div>
                <Button size="lg" className="rounded-full px-8 text-xs tracking-[0.2em] uppercase w-full md:w-auto">
                  Add ritual bundle — ${ritualBundle.toFixed(2)}
                </Button>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Key ingredients */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">The active panel</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Four actives.<br />Derm-formulated for follicles.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every ingredient was chosen to do one of three jobs: kill the yeast and bacteria around the follicle, calm the inflammation, or rebuild the scalp barrier — without sulfates, fragrance or steroids.
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
            <h2 className="font-serif text-2xl md:text-3xl leading-tight">A 5-minute weekly ritual.</h2>
          </div>
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8">
            {ROUTINE.map((r) => (
              <li key={r.step} className="flex flex-col items-center text-center">
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-background shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.25)] ring-1 ring-border/50">
                  <img src={r.image} alt={r.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="mt-4 font-serif text-accent leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}>{r.step}.</div>
                <div className="mt-2 text-[13px] md:text-sm font-medium text-ink-deep leading-snug max-w-[22ch]">{r.title}</div>
                <p className="mt-1.5 text-[12px] md:text-[13px] text-foreground/65 leading-snug max-w-[26ch]">{r.caption}</p>
              </li>
            ))}
          </ol>
          <p className="text-[10px] text-center text-foreground/50 mt-10 tracking-wider max-w-2xl mx-auto">
            For external use only. Avoid contact with eyes. Discontinue if irritation worsens. Suitable for adults and children ages 2+.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-ink-deep text-primary-foreground py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Why people switch from drugstore brands</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-3">Dermveda vs. conventional medicated shampoos</h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto text-sm">
              The same relief — without the medicinal smell, the rebound dryness, or the "stops working at week four" cycle.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-primary-foreground/15 bg-primary-foreground/[0.02]">
            <div className="grid grid-cols-3 bg-primary-foreground/[0.06] text-[10px] tracking-[0.2em] uppercase">
              <div className="p-4 lg:p-5 text-primary-foreground/50"></div>
              <div className="p-4 lg:p-5 text-accent border-l border-primary-foreground/15 font-medium">Dermveda</div>
              <div className="p-4 lg:p-5 text-primary-foreground/50 border-l border-primary-foreground/15">Coal Tar / Ketoconazole</div>
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

      {/* Derm quote */}
      <section className="bg-peach">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px]">
                <img
                  src={follDermPortrait}
                  alt="Portrait of Dr. Jennifer Haley, Board Certified Dermatologist"
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover shadow-lg ring-4 ring-background"
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md text-center whitespace-nowrap border border-foreground/5">
                  <div className="font-serif text-sm md:text-base text-ink-deep leading-tight">Dr. Jennifer Haley</div>
                  <div className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-accent mt-0.5">Board Certified · Dermatology</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Dermatologist approved</div>
              <blockquote className="font-serif text-xl md:text-2xl leading-snug text-ink-deep">
                "For mild to moderate scalp folliculitis and recurring seborrheic dandruff, a sulfur and tea tree formula is one of the most under-used first-line options — and a sensible step before reaching for prescription antifungals or steroids."
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
                <img
                  src={spsFlatlay}
                  alt="Tea tree, neem and rosemary — Dermveda's botanical actives"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] tracking-[0.22em] uppercase text-foreground">
                  <Pill className="w-3 h-3 text-accent" strokeWidth={2} />
                  HPUS Active
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="text-[10px] tracking-[0.28em] uppercase text-accent mb-4">Modern dermatology, ancient roots</div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.05] mb-6 text-ink-deep">
                Where homeopathic actives<br />meet Ayurvedic botanicals.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-5 max-w-xl">
                Sulfur and tea tree have been used for inflamed scalp conditions for over a century — long before they showed up in modern dermatology. Dermveda combines those proven actives with neem, karanja and rosemary in a clean, fragrance-free base, dosed at HPUS clinical strengths.
              </p>
              <p className="text-foreground/75 leading-relaxed max-w-xl">
                The result is a fragrance-free, sulfate-free, dye-free shampoo gentle enough for kids 2+ — yet decisive enough to break the folliculitis cycle for adults who've tried everything.
              </p>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {[
              { title: "Antimicrobial", meaning: "Calms folliculitis bumps", how: "Sulfur 8X HPUS and tea tree target the Malassezia yeast and Staph bacteria around the follicle.", icon: ShieldCheck },
              { title: "Barrier repair", meaning: "Ends the itch loop", how: "Karanja oil, glycerin and olive oil rebuild the lipid layer that medicated shampoos strip away.", icon: Leaf },
              { title: "Fragrance-free", meaning: "Sensitive-scalp safe", how: "No sulfates, parabens, fragrance or dyes — gentle enough for daily use, kids 2+ and color-treated hair.", icon: Eye },
            ].map((p) => (
              <div key={p.title} className="bg-background rounded-2xl p-7 lg:p-8 border border-foreground/5 hover:shadow-sm transition">
                <p.icon className="w-5 h-5 text-accent mb-5" strokeWidth={1.5} />
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-2">{p.meaning}</div>
                <h3 className="font-serif text-2xl lg:text-3xl text-ink-deep mb-4">{p.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{p.how}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Customer questions</div>
          <h2 className="font-serif text-3xl md:text-5xl">Answers from our derm team</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left font-serif text-lg md:text-xl py-5">{f.q}</AccordionTrigger>
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
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Reviews</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-5">Trusted by 312 verified scalps.</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="font-serif text-5xl text-ink-deep">4.7</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Based on 312 verified reviews</div>
              </div>
            </div>
            <Button variant="outline" className="rounded-md text-xs tracking-[0.12em] uppercase">Write a Review</Button>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {[
              { title: "Finally — something that doesn't smell like tar.", body: "I'd been on coal tar shampoo for two years. Stinks, dries my hair, and my folliculitis came back every winter. Three weeks on this and the bumps along my hairline are gone. Hair feels soft, not stripped.", name: "Marcus R.", scalp: "Folliculitis · Oily" },
              { title: "Stopped scratching for the first time in months", body: "I didn't realize how much I was scratching until I stopped. Used it twice a week. By week two, the itch was gone. By week four, no more dandruff on my black work shirts. Worth every dollar.", name: "Priya K.", scalp: "Seborrheic dandruff" },
              { title: "Gentle enough for my sensitive scalp", body: "Other medicated shampoos burn my scalp. This one doesn't. No fragrance, no sting. The little bumps at my nape that I've had for years are flattening. I'm cautiously optimistic.", name: "Jordan T.", scalp: "Sensitive · Folliculitis" },
            ].map((r, i) => (
              <div key={i} className="bg-secondary/30 rounded-xl p-6 lg:p-8">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (<Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />))}
                </div>
                <h3 className="font-serif text-lg text-ink-deep mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{r.body}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground tracking-wider uppercase">
                  <span>— {r.name} · <span className="text-accent">verified buyer</span></span>
                  <span>{r.scalp}</span>
                </div>
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
            Always read and follow label directions. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a licensed dermatologist before starting any new treatment, particularly for children, during pregnancy, or alongside prescription medications.
          </p>
        </div>
      </section>

      {/* Mobile sticky purchase bar */}
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
          <div className="flex -space-x-2 shrink-0">
            <img src={spsHero} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
            <img src={spsSoap} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
            <img src={spsSerum} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-ink-deep/70 tracking-wide truncate">Shampoo + Soap + Serum</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-[16px] leading-none text-ink-deep">${(16.99 + 14.99 + 24.99 - (16.99+14.99+24.99)*0.2).toFixed(0)}</span>
              <span className="text-[11px] text-muted-foreground line-through leading-none">$56.97</span>
              <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-accent leading-none">Save 20%</span>
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

export default FolliculitisShampoo;
