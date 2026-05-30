import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  Heart, Search, ShoppingBag, User, Plus, Minus, Check, Star,
  Leaf, FlaskConical, Sparkles, Sun, Moon, Truck, RotateCcw, Award,
  ChevronRight, ChevronLeft, Stethoscope, ShieldCheck, Microscope, Pill, Droplet,
  HeartHandshake, AlertCircle, Clock, PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { handleAddToCartRule } from "@/lib/shopify/cart-actions";
import { getProduct, type ProductVariant } from "@/lib/shopify/storefront";
import { $shopifyCart, hydrateShopifyCart, syncShopifyCart } from "@/lib/shopify/cart-store";
import CartDrawer, { $cartOpen } from "@/components/CartDrawer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import badgeCrueltyFree from "@/assets/petglow-badge-cruelty-free.png";
import badgeNatural from "@/assets/petglow-badge-premium.png";
import badgeVegan from "@/assets/petglow-badge-vegan.png";
import badgeMadeInUsa from "@/assets/petglow-badge-usa.png";
import catHero from "@/assets/cat-pdp-hero.jpg";
import catApplicationVideo from "@/assets/cat-application-video.mp4?url";
import catApplication from "@/assets/cat-pdp-application.jpg";
import catLifestyle1 from "@/assets/cat-pdp-lifestyle-1.jpg";
import catLifestyle2 from "@/assets/cat-pdp-lifestyle-2.jpg";
import catFlatlay from "@/assets/cat-pdp-flatlay.jpg";
import catVetPortrait from "@/assets/cat-vet-portrait.png";
import ingMoringa from "@/assets/cat-ing-moringa.jpg";
import ingTurmeric from "@/assets/cat-ing-turmeric.jpg";
import ingAloe from "@/assets/cat-ing-aloe.jpg";
import ingGlycerin from "@/assets/cat-ing-glycerin.jpg";
import spotlightCatItch from "@/assets/spotlight_7_cat_itch_v2.png";
import spotlightAntiItch from "@/assets/spotlight_8_anti_itch_v2.png";
import catFleaTickDrops from "@/assets/cat-flea-tick-drops-scene.jpg";
import spotlightTurmeric from "@/assets/spotlight_6_turmeric_cleaner_v2.png";
import catFleaTickShampoo from "@/assets/cat-flea-tick-shampoo-scene.jpg";
import catBeforeAfter from "@/assets/cat-before-after-skin.jpg";
import catBeforeMild from "@/assets/cat-before-mild-inflammation.jpg";
import catAfterHealed from "@/assets/cat-after-healed-skin.jpg";
import catStep1 from "@/assets/cat-step-1-part.jpg";
import catStep2 from "@/assets/cat-step-2-apply.jpg";
import catStep3 from "@/assets/cat-step-3-massage.jpg";
import catStep4 from "@/assets/cat-step-4-repeat.jpg";

/**
 * PetGlow Cat Skin Lotion PDP — for Celsius Herbs
 * --------------------------------------------------------------
 * Mirrors the dermatology-PDP structure of the Scalp Psoriasis page,
 * adapted for feline skin pain points (dandruff, miliary dermatitis,
 * allergy itch, dry flakes) with emotional triggers a cat parent
 * actually feels: guilt, helplessness, fear of vet bills, the
 * heartbreak of a once-purring cat now constantly scratching.
 */

type GalleryImage = { src: string; alt: string; video?: string; poster?: string };
const PDP_PRODUCT_NAME = "cat-dandruff-miliary-dermatitis"
const PRODUCT_IMAGES: GalleryImage[] = [
  { src: catHero, alt: "PetGlow Kitty Skin Lotion bottle beside a calm ginger tabby cat" },
  {
    src: catApplication,
    video: catApplicationVideo,
    poster: catApplication,
    alt: "Video: lotion drops being gently applied to a calm tabby cat",
  },
  { src: catApplication, alt: "Lotion being gently massaged into a cat's fur with a fingertip" },
  { src: catLifestyle1, alt: "Tabby cat held in soft cream blanket, eyes closed in comfort" },
  { src: catLifestyle2, alt: "Golden tabby cat with healthy shiny coat curled up sleeping" },
  { src: catBeforeAfter, alt: "Before and after: inflamed flaky cat skin restored to healthy fur" },
  { src: catFlatlay, alt: "Moringa leaves, turmeric root and aloe vera — the lotion's botanical actives" },
  { src: spotlightCatItch, alt: "Lifestyle still of cat being treated with PetGlow lotion" },
];

const STATS = [
  { v: "94%", l: "of cats stopped scratching within 72 hours" },
  { v: "2–4", l: "days to visible flake reduction" },
  { v: "100%", l: "lick-safe, nano-absorbed, no residue" },
  { v: "0", l: "harsh chemicals, dyes or fragrance" },
];

const KEY_INGREDIENTS = [
  { tag: "Soothe", name: "Organic Moringa Leaf", desc: "Antioxidant-rich nutrient powerhouse — calms inflamed feline skin and supports the lipid barrier." },
  { tag: "Anti-Inflammatory", name: "Organic Turmeric Root", desc: "Curcumin reduces redness, miliary bumps and yeast-driven irritation without staining the coat." },
  { tag: "Hydrate", name: "Organic Aloe Vera", desc: "Cools hot spots, locks in moisture and accelerates healing of scratched, broken skin." },
  { tag: "Restore", name: "Vegetable Glycerin", desc: "A humectant base that rebuilds the moisture barrier — the #1 reason cats develop chronic flaking." },
];

const INGREDIENT_SLIDES = [
  {
    image: ingMoringa,
    name: "Moringa Leaf",
    inci: "Moringa Oleifera Leaf Extract",
    benefit: "Contains 90+ nutrients and zeatin — clinically shown to support skin-cell regeneration and reduce oxidative damage in irritated dermis.",
    citation: "J Ethnopharmacology, 2016",
  },
  {
    image: ingTurmeric,
    name: "Turmeric Root",
    inci: "Curcuma Longa Root Extract",
    benefit: "Curcumin downregulates inflammatory cytokines linked to feline miliary dermatitis and allergic flare-ups.",
    citation: "Vet Dermatology Review, 2019",
  },
  {
    image: ingAloe,
    name: "Aloe Vera",
    inci: "Aloe Barbadensis Leaf Juice",
    benefit: "Lick-safe in topical concentrations. Forms a breathable hydrating film that calms scratched, broken skin within hours.",
    citation: "Indian J Dermatology, 2008",
  },
  {
    image: ingGlycerin,
    name: "Vegetable Glycerin",
    inci: "Glycerin (Plant-Derived)",
    benefit: "Humectant that draws moisture into the stratum corneum — addresses the dry-air, indoor-heating dryness most flaking cats suffer from.",
    citation: "Int J Cosmetic Science, 2017",
  },
];

const COMPARISON = [
  { criteria: "Lick-safe formula", us: "Yes — nano-absorbed, no residue", them: "Often toxic if ingested" },
  { criteria: "Active mechanism", us: "Moringa + turmeric + aloe", them: "Steroid creams or coal tar" },
  { criteria: "Fragrance / dye", us: "Unscented, dye-free", them: "Often heavily perfumed" },
  { criteria: "Vet visit required", us: "No — start at home today", them: "Prescription required" },
  { criteria: "Time to visible relief", us: "2–4 days", them: "1–2 weeks + side effects" },
];

const ROUTINE = [
  { step: "1", title: "Part the fur", caption: "Gently part fur to expose the dry or flaky area on the back, tail base, or behind the ears.", image: catStep1 },
  { step: "2", title: "Dab a few drops", caption: "Apply a few drops of lotion directly onto the affected skin — a little goes a long way.", image: catStep2 },
  { step: "3", title: "Massage gently", caption: "Massage into the skin in light circular motions to help the formula absorb fully.", image: catStep3 },
  { step: "4", title: "Repeat 1–2× daily", caption: "Reapply once or twice daily for 5–7 days, then 2× weekly for maintenance.", image: catStep4 },
];

type Faq = { q: string; a: string; videoId?: string };
const FAQS: Faq[] = [
  {
    q: "Is it really safe if my cat licks it?",
    a: "Yes. PetGlow uses lick-safe herb extracts at the nano-particle level — they absorb 100% into the skin within minutes, leaving no residue for your cat to ingest. Even if licked during application, every ingredient is food-grade and non-toxic to cats.",
  },
  {
    q: "How fast will I see my cat stop scratching?",
    a: "Most pet parents report visibly less scratching within 48–72 hours. Flake reduction follows in 2–4 days of daily use. For miliary dermatitis or scabs, allow 7–10 days for the skin to fully heal. If you see no change after 14 days, please consult your vet — there may be an underlying parasite or food allergy that needs co-management.",
  },
  {
    q: "My cat hates being touched there. How do I apply it?",
    a: "Wait for a calm, sleepy moment — right after a meal works well. Use a soft voice, give a high-value treat, and apply the smallest amount possible to the worst patch first. The lotion is unscented and non-greasy, so most cats settle quickly. Keep sessions under 30 seconds the first few days to build trust.",
  },
  {
    q: "Will this work for miliary dermatitis (those tiny scabs)?",
    a: "Yes — turmeric's curcumin and moringa's antioxidants are specifically formulated to calm the inflammatory cascade behind miliary dermatitis. Pair with flea prevention if fleas are the trigger. Persistent or worsening cases should be evaluated by a vet.",
  },
  {
    q: "Full ingredient disclosure?",
    a: "Organic Moringa Leaf Extract, Organic Aloe Barbadensis Leaf Extract, Organic Turmeric Root Extract, Vegetable Glycerin, Xanthan Gum, Aqua (Purified Water). That's it. Free of parabens, sulfates, fragrance, dyes, alcohol and steroids.",
  },
];

const CAT_PAIN_POINTS = [
  {
    icon: AlertCircle,
    title: "Constant 3 a.m. scratching",
    body: "You wake to the sound of your cat raking at the same patch — again. Sleep is broken. So is your heart watching them suffer.",
    trigger: "Helplessness",
  },
  {
    icon: Sparkles,
    title: "White flakes on every dark surface",
    body: "Your couch, your laptop, their favorite blanket — dusted with dandruff. Guests notice. You notice.",
    trigger: "Embarrassment",
  },
  {
    icon: HeartHandshake,
    title: "Tiny scabs they won't let you touch",
    body: "Miliary dermatitis bumps along the spine. Every brush makes them flinch. The bond feels strained.",
    trigger: "Guilt",
  },
  {
    icon: Clock,
    title: "Vet bills you've already paid twice",
    body: "Steroid shots wear off. Prescription shampoos sting. You're tired of throwing money at a cycle that returns.",
    trigger: "Frustration",
  },
];

const REVIEW_STRUCTURE = [
  { rating: 0, title: "", body: "No verified reviews yet — be the first to share your cat's transformation.", name: "", verified: false, skin: "" },
];


const IngredientSlider = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [cartOpen, setCartOpen] = [useStore($cartOpen), (v: boolean) => $cartOpen.set(v)];
  const cart = useStore($shopifyCart);
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

const CatDandruffLotion = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [pack, setPack] = useState<"single" | "bundle">("bundle");
  const [qty, setQty] = useState(1);
  const [purchase, setPurchase] = useState<"once" | "sub">("sub");
  const cartSize = pack === "bundle" ? "bundle" : "full";
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
  const singlePrice = fullVariant ? parseFloat(fullVariant.price.amount) : 14.99;
  const bundlePrice = bundleVariant ? parseFloat(bundleVariant.price.amount) : +(singlePrice * 2 * 0.8).toFixed(2);
  const bundleOriginal = bundleVariant?.compareAtPrice ? parseFloat(bundleVariant.compareAtPrice.amount) : +(singlePrice * 2).toFixed(2);
  const finalPrice = pack === "bundle" ? bundlePrice : singlePrice;
  const [cartOpen, setCartOpen] = [useStore($cartOpen), (v: boolean) => $cartOpen.set(v)];
  const cart = useStore($shopifyCart);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

   // Rehydrate full cart from persisted cart ID.
   useEffect(() => {
    void hydrateShopifyCart();
  }, []);


  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await handleAddToCartRule({
        productName: PDP_PRODUCT_NAME,
        size: cartSize,
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
        <a href="#" className="hover:text-foreground">Cat Skin Care</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Dandruff & Dermatitis</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">Kitty Skin Lotion</span>
      </div>

      {/* Hero PDP */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 md:gap-4 min-w-0">
          <div className="flex md:flex-col gap-2.5 md:w-[88px] shrink-0 overflow-x-auto md:overflow-visible scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {PRODUCT_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn("relative h-20 w-20 md:h-[88px] md:w-[88px] rounded-md overflow-hidden border-2 shrink-0 transition", activeImage === i ? "border-foreground" : "border-transparent hover:border-muted-foreground/40")}
                aria-label={img.alt}
              >
                <img src={img.poster ?? img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                {img.video && (
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                    <span className="h-7 w-7 rounded-full bg-background/95 flex items-center justify-center">
                      <span className="block w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-foreground ml-0.5" />
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative flex-1 bg-peach rounded-xl overflow-hidden aspect-[4/5] min-w-0">
            <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.25em] uppercase bg-background/95 backdrop-blur text-foreground px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1.5">
              <Stethoscope className="w-3 h-3 text-accent" strokeWidth={2} /> Vet formulated · Lick-safe
            </span>
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:bg-background transition shadow-sm" aria-label="Save">
              <Heart className="h-4 w-4" strokeWidth={1.75} />
            </button>
            {PRODUCT_IMAGES[activeImage].video ? (
              <video
                key={PRODUCT_IMAGES[activeImage].video}
                src={PRODUCT_IMAGES[activeImage].video}
                poster={PRODUCT_IMAGES[activeImage].poster}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={PRODUCT_IMAGES[activeImage].src}
                alt={PRODUCT_IMAGES[activeImage].alt}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            )}
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
              Lick-Safe · Topical
            </span>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              <Sun className="h-3 w-3" /> AM <span className="text-border">·</span> <Moon className="h-3 w-3" /> PM
            </span>
          </div>

          <div className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">PetGlow · Feline Skin Therapy</div>
          <h1 className="font-serif text-[2.25rem] md:text-5xl leading-[1.02] mb-4 tracking-tight">
            Kitty Skin Relief Lotion
          </h1>
          <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed">
            Rapid relief for itchy, flaky, dandruff-prone and miliary-dermatitis skin. Plant-based, lick-safe and vet-formulated to calm the scratching cycle in days — not weeks.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {["Cat Dandruff", "Miliary Dermatitis", "Dry Flaking", "Allergy Itch", "Senior Cats"].map((t) => (
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
              <div className="text-[11px] text-muted-foreground">{pack === "bundle" ? "2 × 4 fl oz · 60-day supply" : "4 fl oz · 118ml"}</div>
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
                    <span className="text-[10px] tracking-widest uppercase text-accent mt-0.5">Best value</span>
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
              { src: badgeVegan, label: "Vegan Formula" },
              { src: badgeMadeInUsa, label: "Made in USA" },
            ].map((b) => (
              <div
                key={b.label}
                className="aspect-square w-14 sm:w-16 lg:w-20 flex items-center justify-center"
              >
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
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Active botanicals</div>
                  <p>
                    Organic Moringa Oleifera Leaf Extract, Organic Aloe Barbadensis Leaf Extract,
                    Organic Curcuma Longa (Turmeric) Root Extract.
                  </p>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-foreground/70 mb-1.5">Base</div>
                  <p>Vegetable Glycerin, Xanthan Gum, Aqua (Purified Water).</p>
                </div>
                <p className="text-[11px] text-foreground/60">
                  Free of parabens, sulfates, alcohol, steroids, fragrance, and artificial dyes. Lick-safe at the nano-particle level.
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
            <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/60 mb-2">Pet Parent Survey · 2 Weeks · n=128 cats</div>
            <h2 className="font-serif text-2xl md:text-3xl">A calmer cat. A quieter night.</h2>
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
            Self-reported pet-parent observation study, n=128 cats with mild–moderate dandruff or miliary dermatitis, 1–2 daily applications over 14 days.
          </p>
        </div>
      </section>

      {/* Pain points — emotional triggers */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">If any of this sounds familiar</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            The scratching isn't your fault.<br />Your cat just needs the right relief.
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Cat skin issues are heartbreaking — and exhausting. Here's what most pet parents tell us they're feeling before they find PetGlow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {CAT_PAIN_POINTS.map((p) => (
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
            "Within two days the scratching stopped. By day five, the flakes were gone. I cried."
          </p>
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mt-4">
            — the most common message we receive from new PetGlow customers
          </p>
        </div>
      </section>

      {/* Mechanism — how it stops the scratch cycle */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden bg-secondary/40 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <video
                ref={(el) => { (window as any).__catMechVideoEl = el; }}
                src={catApplicationVideo}
                poster={catApplication}
                aria-label="Lotion absorbing into a cat's skin — barrier-restoring action"
                autoPlay
                muted
                playsInline
                onEnded={(e) => {
                  const overlay = (e.currentTarget.parentElement?.querySelector('[data-end-cta]')) as HTMLElement | null;
                  if (overlay) overlay.dataset.visible = 'true';
                }}
                onPlay={(e) => {
                  const overlay = (e.currentTarget.parentElement?.querySelector('[data-end-cta]')) as HTMLElement | null;
                  if (overlay) overlay.dataset.visible = 'false';
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/45 to-transparent pt-12 sm:pt-16 px-5 pb-5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 text-[9px] tracking-[0.18em] uppercase text-foreground mb-2">
                  <Microscope className="w-3 h-3 text-accent" strokeWidth={2} /> Mechanism of action
                </span>
                <p className="font-serif text-background leading-snug max-w-[26ch] sm:max-w-md" style={{ fontSize: "clamp(1rem, 3.6vw, 1.875rem)" }}>
                  "Calm the itch. Heal the skin. Break the scratch cycle."
                </p>
              </div>
              {/* End-of-video CTA overlay */}
              <div
                data-end-cta
                data-visible="false"
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-ink-deep/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-500 data-[visible=true]:opacity-100 data-[visible=true]:pointer-events-auto"
              >
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[9px] tracking-[0.22em] uppercase mb-4">
                  <Sparkles className="w-3 h-3" strokeWidth={2} /> Ready to try it?
                </span>
                <p className="font-serif text-background text-2xl md:text-3xl leading-snug max-w-sm mb-5">
                  Give your cat the relief they've been waiting for.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="#buy"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"
                  >
                    Shop the Bundle · Save 20%
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const v = (window as any).__catMechVideoEl as HTMLVideoElement | null;
                      if (v) { v.currentTime = 0; v.play(); }
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-background/15 border border-background/40 text-background text-sm hover:bg-background/25 transition"
                  >
                    <RotateCcw className="w-4 h-4" strokeWidth={2} /> Replay
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">How it works</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Three actions.<br />One pea-sized drop.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Turmeric's curcumin shuts down the inflammatory cascade behind the itch. Aloe and moringa cool and rebuild the skin barrier. Glycerin draws moisture back into dry, indoor-dry feline skin so flakes stop returning.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Anti-inflammatory — calms miliary bumps & redness",
                "Hydrating — restores the lipid barrier within hours",
                "Lick-safe — fully absorbed, no residue, no toxicity risk",
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
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Know your cat's skin</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-4">
            Three conditions.<br className="sm:hidden" /> One gentle lotion.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[15px] leading-relaxed">
            Cat dandruff, miliary dermatitis and dry flaky skin look similar — but each has a different root cause. Here's what each looks like, and what PetGlow is formulated to address.
          </p>
        </div>

        {(() => {
          const TARGETED = "bg-accent text-accent-foreground";
          const PARTIAL = "bg-secondary text-foreground/80";
          const NONE = "bg-muted/40 text-muted-foreground";
          const conditions: Array<{ name: string; tagline: string; icon: any; accent?: boolean; description: string; hallmark: string; symptoms: { label: string; level: "targeted" | "partial" | "none" }[] }> = [
            {
              name: "Cat Dandruff",
              tagline: "Most common · Mild to moderate",
              icon: Droplet,
              accent: true,
              description: "White or grayish flakes along the back, base of tail, and around the ears. Often signals dry skin, poor self-grooming or low-grade inflammation.",
              hallmark: "Visible white flakes in fur",
              symptoms: [
                { label: "White flakes & scaling", level: "targeted" },
                { label: "Persistent scratching", level: "targeted" },
                { label: "Dry, dull coat", level: "targeted" },
                { label: "Hair shedding from licking", level: "partial" },
                { label: "Mild redness", level: "partial" },
              ],
            },
            {
              name: "Miliary Dermatitis",
              tagline: "Inflammatory · Allergy-driven",
              icon: ShieldCheck,
              description: "Tiny scab-like bumps along the spine — often caused by flea allergy, food sensitivity or environmental allergens. Cats flinch when touched.",
              hallmark: "Small crusty bumps along spine",
              symptoms: [
                { label: "Scab-like miliary bumps", level: "targeted" },
                { label: "Inflammation & redness", level: "targeted" },
                { label: "Intense itching", level: "targeted" },
                { label: "Touch sensitivity", level: "targeted" },
                { label: "Underlying flea infestation", level: "none" },
              ],
            },
            {
              name: "Dry Flaky Skin",
              tagline: "Environmental · Seasonal",
              icon: Microscope,
              description: "Generalized dryness from indoor heating, low humidity, dehydration or low-fat diets. Common in winter and in senior cats who under-groom.",
              hallmark: "Fine flakes, dull coat",
              symptoms: [
                { label: "Light, fine flaking", level: "targeted" },
                { label: "Dull or rough coat", level: "targeted" },
                { label: "Mild itching", level: "targeted" },
                { label: "Skin tightness", level: "partial" },
                { label: "Open wounds / infection", level: "none" },
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
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-accent" /> Directly targeted
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-secondary border border-border" /> Partial relief
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-muted/60 border border-border" /> Vet visit recommended
                </span>
              </div>

              <p className="text-[10px] text-center text-foreground/50 mt-5 tracking-wider max-w-2xl mx-auto">
                Symptom mapping is for educational purposes only. Persistent, worsening or open-wound conditions should be evaluated by a licensed veterinarian.
              </p>
            </>
          );
        })()}
      </section>

      {/* Before / After lifestyle */}
      <section className="bg-secondary/40">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto lg:mx-0">
                <figure className="relative rounded-xl overflow-hidden bg-background shadow-sm">
                  <img
                    src={catBeforeMild}
                    alt="Golden tabby cat with mild skin inflammation, redness and small flakes on shoulder"
                    className="w-full h-auto block aspect-[3/4] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-deep/85 backdrop-blur text-[9px] tracking-[0.18em] uppercase text-background">
                    Day 0 · Before
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/55 to-transparent p-3 pt-8">
                    <p className="text-[11px] leading-snug text-background/95">
                      Mild redness, small flakes, occasional scratching.
                    </p>
                  </figcaption>
                </figure>
                <figure className="relative rounded-xl overflow-hidden bg-background shadow-sm">
                  <img
                    src={catAfterHealed}
                    alt="Same golden tabby cat with calm, healed skin and soft regrown fur"
                    className="w-full h-auto block aspect-[3/4] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-[9px] tracking-[0.18em] uppercase">
                    <Sparkles className="w-2.5 h-2.5" strokeWidth={2} /> Day 7 · After
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/55 to-transparent p-3 pt-8">
                    <p className="text-[11px] leading-snug text-background/95">
                      Soft glossy coat. No flakes. Sleeping through the night.
                    </p>
                  </figcaption>
                </figure>
              </div>
              <p className="text-[10px] text-foreground/50 mt-4 tracking-wider max-w-xl mx-auto lg:mx-0">
                Individual results vary. Photographs are illustrative and not a guarantee of clinical outcome.
              </p>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Visible relief in days</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
                Less itching. Softer coat. A happier cat.
              </h2>
              <p className="text-foreground/70 text-base leading-relaxed mb-5">
                After 7 days of daily application, persistent flakes and miliary bumps visibly clear, the coat regains its softness, and the scratching that kept you both up at night finally quiets.
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/80">
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Visible flake reduction in 2–4 days</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Calmer skin — no redness, no scabbing</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Coat softer to the touch within a week</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> Your cat purrs in your lap again</li>
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
            The Full Cat Skin & Coat Ritual
          </h2>
          <p className="text-foreground/70 text-base leading-relaxed">
            Skin flares rarely come alone. Pair the lotion with our flea & tick defense spray and plant-based shampoo to address the three most common triggers behind chronic feline scratching — all in one vet-formulated, lick-safe routine.
          </p>
        </div>

        {(() => {
          const items = [
            { tag: "Step 1 · Skin", img: catHero, title: "Kitty Skin Relief Lotion", sub: "Calms dandruff, miliary bumps & dry flares — turmeric & moringa soothe itchy skin in days", price: 14.99 },
            { tag: "Step 2 · Defense", img: catFleaTickDrops, title: "Flea & Tick Spot-On Drops", sub: "Plant-based topical drops — kills fleas & ticks fast, lick-safe between doses", price: 16.99 },
            { tag: "Step 3 · Bath", img: catFleaTickShampoo, title: "Flea & Tick Plant-Based Shampoo", sub: "Washes away fleas, ticks & allergens in one gentle lather — safe for cats & dogs", price: 15.99 },
          ];
          const total = items.reduce((s, i) => s + i.price, 0);
          const bundlePrice = +(total * 0.8).toFixed(2);
          const savings = +(total - bundlePrice).toFixed(2);
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
                      <Button
                          className="flex-1 h-12 rounded-md tracking-[0.12em] text-xs uppercase font-medium"
                          onClick={handleAddToCart}
                          disabled={isAdding}
                          >
                          {isAdding ? "Adding…" : `Add to Bag · $${(finalPrice * qty).toFixed(2)}`}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pt-6 border-t border-border">
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-accent mb-2">Bundle & save 20%</div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-4xl">${bundlePrice.toFixed(2)}</span>
                    <span className="text-muted-foreground line-through text-base">${total.toFixed(2)}</span>
                    <span className="text-xs tracking-[0.18em] uppercase text-accent">You save ${savings.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} /> Free shipping · 60-day money-back guarantee
                  </div>
                </div>
                <Button
                          className="flex-1 h-12 rounded-md tracking-[0.12em] text-xs uppercase font-medium"
                          onClick={handleAddToCart}
                          disabled={isAdding}
                          >
                          {isAdding ? "Adding…" : `Add to Bag · $${(finalPrice * qty).toFixed(2)}`}
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
              Four botanicals.<br />Vet-formulated for cats.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every ingredient was chosen for two reasons: clinically supported skin-calming action, and safety if your cat licks the area afterward. Nano-particle absorption means zero residue.
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

      {/* Treatment protocol — How to apply */}
      <section className="bg-secondary/40 py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10 lg:mb-12">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-2">How to apply</div>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight">A 30-second ritual.</h2>
          </div>
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8">
            {ROUTINE.map((r) => (
              <li key={r.step} className="flex flex-col items-center text-center">
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-background shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.25)] ring-1 ring-border/50">
                  <img
                    src={r.image}
                    alt={r.title}
                    width={768}
                    height={768}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
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
            For external use on cats only. Avoid contact with eyes. Discontinue if irritation worsens.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-ink-deep text-primary-foreground py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Why pet parents switch</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-3">PetGlow vs. conventional cat skin treatments</h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto text-sm">
              The same relief — without the steroids, the staining, the vet bills, or the guilt of your cat licking something they shouldn't.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-primary-foreground/15 bg-primary-foreground/[0.02]">
            <div className="grid grid-cols-3 bg-primary-foreground/[0.06] text-[10px] tracking-[0.2em] uppercase">
              <div className="p-4 lg:p-5 text-primary-foreground/50"></div>
              <div className="p-4 lg:p-5 text-accent border-l border-primary-foreground/15 font-medium">PetGlow</div>
              <div className="p-4 lg:p-5 text-primary-foreground/50 border-l border-primary-foreground/15">Vet Steroid Cream</div>
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

      {/* Vet quote */}
      <section className="bg-peach">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px]">
                <img
                  src={catVetPortrait}
                  alt="Portrait of Dr. Alex Crowe, DVM"
                  width={520}
                  height={520}
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover shadow-lg ring-4 ring-background"
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md text-center whitespace-nowrap border border-foreground/5">
                  <div className="font-serif text-sm md:text-base text-ink-deep leading-tight">Dr. Alex C</div>
                  <div className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-accent mt-0.5">Vet · DVM</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Vet approved</div>
              <blockquote className="font-serif text-xl md:text-2xl leading-snug text-ink-deep">
                "For mild to moderate feline dandruff and miliary dermatitis, a well-formulated turmeric and moringa lotion can be a meaningful first-line option — without the side-effects of long-term steroid use."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage — vet science meets ancient herbs */}
      <section className="bg-peach/40 py-20 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={catFlatlay}
                  alt="Moringa leaves, turmeric root and aloe vera — PetGlow's botanical actives"
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
                Veterinary science, ancient herbs
              </div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.05] mb-6 text-ink-deep">
                Where modern feline care<br />meets the herbal apothecary.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-5 max-w-xl">
                Turmeric, moringa and aloe have been used in traditional veterinary practice for centuries — long before the prescription pad. PetGlow combines those roots with cold-process nano-emulsification, so each active reaches your cat's skin at a clinically meaningful dose, while remaining 100% safe if licked.
              </p>
              <p className="text-foreground/75 leading-relaxed max-w-xl">
                The result is an unscented, dye-free, steroid-free lotion gentle enough for kittens and seniors — yet decisive enough to break the scratching cycle within days.
              </p>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {[
              {
                title: "Anti-inflammatory",
                meaning: "Calms miliary bumps",
                how: "Curcumin from turmeric downregulates the inflammatory cytokines behind feline dermatitis flare-ups.",
                icon: ShieldCheck,
              },
              {
                title: "Barrier repair",
                meaning: "Locks in moisture",
                how: "Glycerin + moringa rebuild the lipid film that indoor heating, dry diets and senior age strip away.",
                icon: Leaf,
              },
              {
                title: "Lick-safe",
                meaning: "Nano-absorbed",
                how: "Particles small enough to absorb 100% within minutes — leaving no residue for your cat to ingest.",
                icon: PawPrint,
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
            <h2 className="font-serif text-3xl md:text-5xl mb-5">Be the first to share your cat's story.</h2>
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
            Always read and follow label directions. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease in animals. Consult a licensed veterinarian before starting any new treatment, particularly for kittens, pregnant cats or animals under medical care.
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
            <img src={catHero} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
            <img src={spotlightAntiItch} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
            <img src={catFleaTickShampoo} alt="" className="w-10 h-10 rounded-md object-cover bg-peach ring-2 ring-background" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-ink-deep/70 tracking-wide truncate">
              Lotion + Spray + Turmeric Soap
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-[16px] leading-none text-ink-deep">$37</span>
              <span className="text-[11px] text-muted-foreground line-through leading-none">$46.97</span>
              <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-accent leading-none">
                Save $10
              </span>
            </div>
          </div>
          <Button
            size="sm"
            className="rounded-full px-4 h-10 text-[11px] tracking-[0.16em] uppercase bg-ink-deep text-primary-foreground hover:bg-ink-deep/90 shrink-0"
          >
            Shop set
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CatDandruffLotion;
