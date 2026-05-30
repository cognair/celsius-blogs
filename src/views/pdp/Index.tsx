import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  Heart, Plus, Minus, Check, Star,
  Leaf, ShieldCheck, FlaskConical, Sparkles, Sun, Moon, Truck, RotateCcw, Award,
  ChevronRight, ChevronLeft, Zap, Rabbit, Sprout, Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { LiteYouTube } from "@/components/LiteYouTube";
import { ZoomIn, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { $shopifyCart, hydrateShopifyCart } from "@/lib/shopify/cart-store";
import { handleAddToCartRule } from "@/lib/shopify/cart-actions";
import { getProduct, type ProductVariant } from "@/lib/shopify/storefront";
import CartDrawer, { $cartOpen } from "@/components/CartDrawer";
import { toast } from "sonner";
import serumHero from "@/assets/serum-hero.jpg";
import serumSwatch from "@/assets/serum-swatch.jpg";
import serumSkin from "@/assets/serum-skin.jpg";
import serumBotanicals from "@/assets/serum-botanicals.jpg";
// Responsive WebP variants — original PNGs were ~2MB each, these are 95% smaller.
import ingredientsInfographic from "@/assets/serum-ingredients-infographic.webp";
import ingredientsInfographicSm from "@/assets/serum-ingredients-infographic-sm.webp";
import serumApplication from "@/assets/serum-application-lifestyle.webp";
import serumApplicationSm from "@/assets/serum-application-lifestyle-sm.webp";
import serumBeforeAfter from "@/assets/serum-before-after.webp";
import serumBeforeAfterSm from "@/assets/serum-before-after-sm.webp";
import serumProductVideo from "@/assets/serum-product-video.mp4";
import serumProductVideoMd from "@/assets/serum-product-video-md.mp4";
import serumProductVideoSm from "@/assets/serum-product-video-sm.mp4";
import serumVideoPoster from "@/assets/serum-video-poster.jpg";
import { usePrefersLightMedia } from "@/hooks/use-prefers-light-media";
import { useIsMobile } from "@/hooks/use-mobile";
import ingredientBakuchiol from "@/assets/ingredient-bakuchiol.jpg";
import ingredientTurmeric from "@/assets/ingredient-turmeric.jpg";
import ingredientQuinoa from "@/assets/ingredient-quinoa.jpg";
import ingredientNiacinamide from "@/assets/ingredient-niacinamide.jpg";
import ayurvedaHeritage from "@/assets/ayurveda-heritage.jpg";
import ugcPriya from "@/assets/ugc-priya.jpg";
import ugcMaya from "@/assets/ugc-maya.jpg";
import ugcFlatlay from "@/assets/ugc-flatlay.jpg";
import ugcSara from "@/assets/ugc-sara.jpg";
import badgeCrueltyFree from "@/assets/badge-cruelty-free.png";
import badgeUsdaOrganic from "@/assets/badge-usda-organic.png";
import badgeVegan from "@/assets/badge-vegan.png";
import badgeMadeInUsa from "@/assets/badge-made-in-usa.png";


const PDP_PRODUCT_NAME = "organic-bakuchiol-booster-serum";

type GalleryItem = {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
};


const PRODUCT_IMAGES: GalleryItem[] = [
  { type: "video", src: serumProductVideo, alt: "Bakuchiol Booster Serum in motion", poster: serumHero },
  { type: "image", src: serumHero, alt: "Bakuchiol Booster Serum bottle" },
  { type: "image", src: serumSwatch, alt: "Golden serum texture swatch" },
  { type: "image", src: serumSkin, alt: "Glowing radiant skin after serum" },
  { type: "image", src: serumBotanicals, alt: "Bakuchi seeds and turmeric root" },
];

const STATS = [
  { v: "94%", l: "saw smoother texture" },
  { v: "89%", l: "noticed brighter tone" },
  { v: "92%", l: "felt firmer skin" },
  { v: "0", l: "irritation reports" },
];

const KEY_INGREDIENTS = [
  { tag: "Hero", name: "Bakuchiol 4%", desc: "Plant-derived retinol alternative — smooths fine lines without irritation." },
  { tag: "Brighten", name: "Turmeric", desc: "Antioxidant that fades dark spots and calms inflammation." },
  { tag: "Firm", name: "Quinoa Peptides", desc: "Boost collagen and reinforce the skin barrier." },
  { tag: "Refine", name: "Niacinamide", desc: "Regulates oil and refines pore appearance." },
];

/**
 * Ingredient slider — pairs each macro photograph with a peer-reviewed
 * scientific benefit caption rendered as an overlay on the image.
 */
const INGREDIENT_SLIDES = [
  {
    image: ingredientBakuchiol,
    name: "Bakuchiol 4%",
    inci: "Psoralea Corylifolia Seed Extract",
    benefit: "Clinically shown to reduce wrinkle surface area by 20% in 12 weeks — without retinol's irritation.",
    citation: "Br J Dermatol, 2019",
  },
  {
    image: ingredientTurmeric,
    name: "Turmeric Root",
    inci: "Curcuma Longa Extract",
    benefit: "Curcuminoids inhibit tyrosinase activity, fading hyperpigmentation and calming inflammatory pathways.",
    citation: "Phytotherapy Research, 2016",
  },
  {
    image: ingredientQuinoa,
    name: "Quinoa Peptides",
    inci: "Hydrolyzed Quinoa Protein",
    benefit: "Plant peptides stimulate type I collagen synthesis and reinforce the skin's lipid barrier.",
    citation: "Int J Cosmetic Sci, 2020",
  },
  {
    image: ingredientNiacinamide,
    name: "Niacinamide 5%",
    inci: "Vitamin B3",
    benefit: "Strengthens the ceramide barrier, regulates sebum, and visibly refines pore size in 8 weeks.",
    citation: "J Cosmet Dermatol, 2014",
  },
];

const COMPARISON = [
  { criteria: "Active class", us: "Plant bakuchiol", them: "Synthetic vitamin A" },
  { criteria: "Sensitivity", us: "Gentle, no flaking", them: "Common irritation" },
  { criteria: "Pregnancy safe", us: "Yes (consult OB)", them: "No" },
  { criteria: "Sun sensitivity", us: "AM + PM safe", them: "Increases UV risk" },
  { criteria: "Visible results", us: "7–9 weeks", them: "8–12 weeks" },
];

const ROUTINE = [
  { step: "01", time: "AM", title: "Cleanse", body: "Gentle wash, leave skin slightly damp." },
  { step: "02", time: "AM + PM", title: "Bakuchiol Serum", body: "Press 4–5 drops into face and neck.", highlight: true },
  { step: "03", time: "AM", title: "Moisturize", body: "Lightweight day cream to seal hydration." },
  { step: "04", time: "AM", title: "SPF 30+", body: "Always finish daytime with broad-spectrum sun protection." },
];

/**
 * UGC carousel data — community posts framed as before/after style captions
 * with a consistent brand chip + handle overlay so the section stays cohesive.
 */
const UGC_POSTS = [
  {
    image: ugcPriya,
    handle: "@priya.skin",
    quote: "9 weeks in, my fine lines actually softened.",
    before: "Day 1 · uneven tone",
    after: "Day 63 · brighter, smoother",
    tag: "Sensitive · 30s",
    likes: "12.4k",
  },
  {
    image: ugcMaya,
    handle: "@maya.glows",
    quote: "Lit-from-within in two weeks. Not exaggerating.",
    before: "Day 1 · dull, tired",
    after: "Day 14 · dewy glow",
    tag: "Combination · 40s",
    likes: "8.9k",
  },
  {
    image: ugcFlatlay,
    handle: "@thequietshelf",
    quote: "The only bottle that's stayed on my shelf this year.",
    before: "Replaced 3 retinols",
    after: "1 ritual, every night",
    tag: "Editor's pick",
    likes: "5.2k",
  },
  {
    image: ugcSara,
    handle: "@sara.naturally",
    quote: "OB-approved and my skin's never looked calmer.",
    before: "Day 1 · breakouts",
    after: "Day 42 · clear & even",
    tag: "Pregnancy safe",
    likes: "6.7k",
  },
];

const REVIEWS = [
  { name: "Priya S.", verified: true, rating: 5, title: "Replaced my retinol", body: "Nine weeks in, my forehead lines softened and dark spots faded — without a single day of peeling. Genuinely impressed.", skin: "Sensitive · 30s" },
  { name: "Maya K.", verified: true, rating: 5, title: "Glow is real", body: "I noticed a difference in two weeks. My skin looks lit-from-within and my fine lines are visibly softer.", skin: "Combination · 40s" },
  { name: "Sara L.", verified: true, rating: 4, title: "Pregnancy approved", body: "My OB cleared this and it's been a lifesaver while I can't use retinol. Skin is calm and even-toned.", skin: "Normal · 30s" },
];

type Faq = { q: string; a: string; videoId?: string };
const FAQS: Faq[] = [
  {
    q: "How is Bakuchiol different from retinol?",
    a: "Bakuchiol is a plant-derived compound from the babchi seed that delivers retinol-like benefits — smoother texture, softened fine lines, brighter tone — without the irritation, flaking, or sun sensitivity. It's safe for AM and PM use.",
    videoId: "dbxs9yaNtkA",
  },
  { q: "Can I use it during pregnancy?", a: "Bakuchiol is widely considered a safer alternative to retinol for expectant mothers, but please consult your OB/GYN before adding any new active to your routine during pregnancy or while breastfeeding." },
  { q: "When will I see results?", a: "Most users notice softer, more radiant skin within 2–3 weeks. Visible reduction in fine lines, dark spots, and uneven tone typically appears around week 7–9 of consistent twice-daily use." },
  { q: "How do I layer it?", a: "Cleanse, mist or tone, then press 4–5 drops into damp skin morning and night. Follow with moisturizer. SPF in the morning is always recommended." },
  { q: "What's the full ingredient list?", a: "Organic Bakuchiol extract 4%, Turmeric extract, Quinoa extract, Niacinamide, Glycerin, Xanthan Gum, Aqua. That's it — no fillers, no fragrance, no parabens." },
];



/**
 * Reusable Instagram-style caption overlay for the lifestyle application image.
 * Renders identically inline and inside the zoom dialog so safe-area padding,
 * fluid type and gradient legibility scale with the container.
 */
const LifestyleCaptionOverlay = () => (
  <>
    <div
      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/45 to-transparent pt-12 sm:pt-16"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 text-[9px] tracking-[0.18em] uppercase text-foreground">
          <Sparkles className="w-3 h-3 text-accent" strokeWidth={2} /> Daily glow
        </span>
        <span className="text-[10px] tracking-[0.2em] uppercase text-background/80 truncate max-w-[40%]">
          @celsiusherbs
        </span>
      </div>
      <p
        className="font-serif text-background leading-snug max-w-[26ch] sm:max-w-md"
        style={{ fontSize: "clamp(1rem, 3.6vw, 1.875rem)" }}
      >
        "Two drops. That's the whole ritual."
      </p>
    </div>
    <span
      className="absolute inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur text-[9px] tracking-[0.2em] uppercase text-foreground"
      style={{
        top: "max(0.75rem, env(safe-area-inset-top))",
        left: "max(0.75rem, env(safe-area-inset-left))",
      }}
    >
      <Heart className="w-3 h-3 text-accent fill-accent" strokeWidth={0} /> 12.4k
    </span>
  </>
);

/**
 * Reusable IG-style chip overlay for the before/after comparison.
 * The centered "loved by" pill stays hidden on small screens to avoid covering
 * the central product bottle in the comparison.
 */
const BeforeAfterChipsOverlay = () => (
  <>
    <span
      className="absolute inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-ink-deep/85 backdrop-blur tracking-[0.18em] uppercase text-background"
      style={{
        top: "max(0.5rem, env(safe-area-inset-top))",
        left: "max(0.5rem, env(safe-area-inset-left))",
        fontSize: "clamp(0.625rem, 1.6vw, 0.75rem)",
      }}
    >
      Day 1
    </span>
    <span
      className="absolute inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent tracking-[0.18em] uppercase text-accent-foreground"
      style={{
        top: "max(0.5rem, env(safe-area-inset-top))",
        right: "max(0.5rem, env(safe-area-inset-right))",
        fontSize: "clamp(0.625rem, 1.6vw, 0.75rem)",
      }}
    >
      <Sparkles className="w-3 h-3" strokeWidth={2} /> Day 28
    </span>
    <div
      className="hidden sm:inline-flex absolute left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-xs tracking-[0.18em] uppercase text-foreground shadow-sm whitespace-nowrap"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <Heart className="w-3 h-3 text-accent fill-accent" strokeWidth={0} />
      Loved by 8.2k · #PlantRetinol
    </div>
  </>
);

/**
 * Ingredient slider with overlay captions explaining each active's
 * scientific benefit. Auto-syncs dot pagination to the current slide.
 */
const IngredientSlider = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 lg:-ml-4">
          {INGREDIENT_SLIDES.map((s, i) => (
            <CarouselItem
              key={s.name}
              className="pl-3 lg:pl-4 basis-full sm:basis-1/2 lg:basis-1/2"
            >
              <div className="group relative aspect-[4/5] sm:aspect-[5/6] rounded-xl overflow-hidden bg-secondary">
                <img
                  src={s.image}
                  alt={`${s.name} — ${s.inci}`}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                {/* Soft white scrim — keeps captions legible against the
                    bright product photography without darkening the image. */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                {/* Top-left slide counter */}
                <div
                  className="absolute top-0 left-0"
                  style={{
                    paddingTop: "max(1rem, env(safe-area-inset-top))",
                    paddingLeft: "max(1rem, env(safe-area-inset-left))",
                  }}
                >
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] tracking-[0.18em] uppercase font-medium">
                    <Leaf className="w-3 h-3 text-accent" strokeWidth={2} />
                    0{i + 1} / 0{INGREDIENT_SLIDES.length}
                  </span>
                </div>
                {/* Caption — dark text on light scrim */}
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
                    paddingRight: "max(1.25rem, env(safe-area-inset-right))",
                    paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
                  }}
                >
                  <div className="text-[9px] tracking-[0.22em] uppercase text-accent mb-1.5">
                    {s.inci}
                  </div>
                  <h3
                    className="font-serif text-foreground leading-[1.05] mb-2"
                    style={{ fontSize: "clamp(1.5rem, 3.6vw, 2.25rem)" }}
                  >
                    {s.name}
                  </h3>
                  <p
                    className="text-foreground/75 leading-snug max-w-[40ch]"
                    style={{ fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)" }}
                  >
                    {s.benefit}
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                    <FlaskConical className="w-3 h-3" />
                    {s.citation}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Desktop arrows */}
        <CarouselPrevious className="hidden lg:flex -left-5 bg-background border-border" />
        <CarouselNext className="hidden lg:flex -right-5 bg-background border-border" />
      </Carousel>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {INGREDIENT_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              current === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/50",
            )}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * UGC carousel — community posts presented as polaroid-style tiles with a
 * consistent brand chip + before/after caption strip so the feed feels
 * cohesive instead of a random social grab. Two slides on desktop, one on
 * mobile, with synced dot pagination.
 */
type BundleItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  href: string;
};

const BUNDLE_ITEMS: BundleItem[] = [
  {
    id: "serum",
    name: "Bakuchiol Booster Serum",
    tagline: "This product",
    price: 19.89,
    image: serumHero,
    href: "#",
  },
  {
    id: "moisturizer",
    name: "Dermveda Ultra Moisturizer",
    tagline: "Lock in hydration",
    price: 19.90,
    image: "https://celsiusherbs.com/cdn/shop/files/9_5f1c4e5f-0380-416c-a911-2ad4c65060ce_1024x1024.jpg?v=1763571089",
    href: "https://celsiusherbs.com/products/anti-aging-cream",
  },
  {
    id: "soap",
    name: "Turmeric Honey Soap",
    tagline: "Prep & brighten · Handcrafted",
    price: 16.89,
    image: "https://celsiusherbs.com/cdn/shop/files/turmeric-soap-in-hand_1024x1024.png?v=1746152254",
    href: "https://celsiusherbs.com/products/turmeric-soap",
  },
];

const FrequentlyBoughtTogether = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    serum: true,
    moisturizer: true,
    soap: true,
  });

  const toggle = (id: string) => {
    if (id === "serum") return; // hero product locked
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const subtotal = BUNDLE_ITEMS.reduce((sum, it) => sum + (selected[it.id] ? it.price : 0), 0);
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const discount = selectedCount === 3 ? 0.15 : selectedCount === 2 ? 0.1 : 0;
  const total = subtotal * (1 - discount);
  const savings = subtotal - total;

  return (
    <section className="bg-secondary/40 border-y border-border">
      <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10 lg:mb-14">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Complete the ritual</div>
          <h2 className="font-serif text-3xl md:text-5xl mb-3">Frequently bought together</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">
            Customers who choose the serum complete their routine with these. Bundle all three and save up to 15%.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Products with plus signs */}
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2">
              {BUNDLE_ITEMS.map((item, idx) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2 flex-1">
                  <button
                    onClick={() => toggle(item.id)}
                    disabled={item.id === "serum"}
                    className={cn(
                      "group relative w-full bg-background rounded-lg border-2 transition-all overflow-hidden text-left flex flex-col",
                      selected[item.id]
                        ? "border-foreground shadow-sm"
                        : "border-border opacity-60 hover:opacity-100",
                      item.id === "serum" && "cursor-default",
                    )}
                  >
                    <div className="relative aspect-square w-full bg-gradient-to-b from-secondary/30 to-secondary/60 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-contain p-6"
                      />
                    </div>
                    <div className="absolute top-2 left-2 z-10">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          selected[item.id]
                            ? "bg-foreground border-foreground text-background"
                            : "bg-background border-border",
                        )}
                      >
                        {selected[item.id] && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground line-clamp-1 min-h-[1.2em] leading-[1.2]">
                        {item.tagline}
                      </div>
                      <div className="font-serif text-base md:text-lg leading-[1.25] line-clamp-2 min-h-[2.5em]">
                        {item.name}
                      </div>
                      <div className="text-sm font-medium leading-none mt-auto pt-1">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </button>
                  {idx < BUNDLE_ITEMS.length - 1 && (
                    <div className="flex items-center justify-center w-8 sm:h-auto h-8 shrink-0 text-muted-foreground self-center" aria-hidden>
                      <Plus className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-background border border-border rounded-lg p-6 lg:p-7">
              <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-4">
                Your bundle · {selectedCount} {selectedCount === 1 ? "item" : "items"}
              </div>
              <div className="space-y-2.5 mb-5 text-sm">
                {BUNDLE_ITEMS.filter((i) => selected[i.id]).map((i) => (
                  <div key={i.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground line-clamp-1">{i.name}</span>
                    <span>${i.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm pb-3 mb-3 border-b border-dashed border-border">
                  <span className="text-accent font-medium">Bundle discount</span>
                  <span className="text-accent font-medium">−${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-end justify-between mb-5">
                <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Total</span>
                <div className="text-right">
                  {discount > 0 && (
                    <div className="text-xs text-muted-foreground line-through">${subtotal.toFixed(2)}</div>
                  )}
                  <div className="font-serif text-3xl">${total.toFixed(2)}</div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 text-[13px] tracking-[0.18em] uppercase"
                disabled={selectedCount === 0}
              >
                Add bundle to bag
              </Button>
              <p className="text-[11px] text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
                <Truck className="h-3 w-3" /> Free 3-day delivery in the USA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const UgcCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        // `dragFree: false` + `containScroll: trimSnaps` keeps each card snapping
        // crisply to the start on touch devices, while `align: center` on mobile
        // would clip the first card — start alignment with a peek looks better.
        opts={{ align: "start", loop: true, containScroll: "trimSnaps", dragFree: false }}
        className="w-full"
      >
        {/* Negative right margin lets the last slide bleed to the screen edge on
            mobile, signalling more content to swipe through. */}
        <CarouselContent className="-ml-3 lg:-ml-4 -mr-5 sm:mr-0 lg:px-1">
          {UGC_POSTS.map((p, i) => (
            <CarouselItem
              key={p.handle}
              // Mobile: ~88% width so a sliver of the next card peeks in.
              // Tablet: 2-up. Desktop: 3-up.
              className="pl-3 lg:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/3"
            >
              <figure className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-secondary touch-pan-y select-none">
                <img
                  src={p.image}
                  alt={`Customer post by ${p.handle}: ${p.quote}`}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03] pointer-events-none"
                />

                {/* Top brand chip — consistent across every slide */}
                <div
                  className="absolute top-0 left-0 right-0 flex items-center justify-between"
                  style={{
                    paddingTop: "max(0.875rem, env(safe-area-inset-top))",
                    paddingLeft: "max(0.875rem, env(safe-area-inset-left))",
                    paddingRight: "max(0.875rem, env(safe-area-inset-right))",
                  }}
                >
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/95 backdrop-blur text-[10px] sm:text-[9px] tracking-[0.22em] uppercase text-foreground shadow-sm">
                    <Sparkles className="w-3 h-3 text-accent" strokeWidth={2} />
                    Real customer
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-deep/75 backdrop-blur text-[11px] sm:text-[10px] text-background">
                    <Heart className="w-3 h-3 text-accent fill-accent" strokeWidth={0} />
                    {p.likes}
                  </span>
                </div>

                {/* Bottom caption — stronger gradient + bigger type on mobile
                    so the quote is readable at arm's length without zoom. */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep via-ink-deep/75 to-transparent pt-20 sm:pt-14">
                  <div
                    style={{
                      paddingLeft: "max(1.125rem, env(safe-area-inset-left))",
                      paddingRight: "max(1.125rem, env(safe-area-inset-right))",
                      paddingBottom: "max(1.125rem, env(safe-area-inset-bottom))",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2.5 text-[11px] sm:text-[10px] tracking-[0.2em] uppercase text-background/90">
                      <span className="truncate font-medium">{p.handle}</span>
                      <span className="opacity-50">·</span>
                      <span className="truncate">{p.tag}</span>
                    </div>
                    <blockquote
                      className="font-serif text-background leading-[1.2] mb-3.5"
                      style={{ fontSize: "clamp(1.125rem, 4.4vw, 1.375rem)" }}
                    >
                      "{p.quote}"
                    </blockquote>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/20 backdrop-blur text-[10px] sm:text-[9px] tracking-[0.18em] uppercase text-background border border-background/25">
                        {p.before}
                      </span>
                      <span className="text-background/60 text-[11px]">→</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] sm:text-[9px] tracking-[0.18em] uppercase font-medium">
                        <Sparkles className="w-2.5 h-2.5" strokeWidth={2} />
                        {p.after}
                      </span>
                    </div>
                  </div>
                </div>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex -left-5 bg-background border-border" />
        <CarouselNext className="hidden lg:flex -right-5 bg-background border-border" />
      </Carousel>

      {/* Pagination — larger 44px tap targets on mobile per WCAG, with a
          slim visual rail inside. Counter sits alongside for context. */}
      <div className="mt-6 flex items-center justify-between sm:justify-center gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {UGC_POSTS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to post ${i + 1}`}
              aria-current={current === i ? "true" : undefined}
              onClick={() => api?.scrollTo(i)}
              className="group relative h-11 w-7 sm:w-8 flex items-center justify-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all",
                  current === i ? "w-7 bg-foreground" : "w-1.5 bg-foreground/25 group-hover:bg-foreground/50",
                )}
              />
            </button>
          ))}
        </div>
        <span className="sm:hidden text-[11px] tracking-[0.2em] uppercase text-muted-foreground tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(UGC_POSTS.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
const Index = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<"full" | "bundle">("full");
  const [purchase, setPurchase] = useState<"once" | "sub">("sub");
  const [qty, setQty] = useState(1);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  // Stays false until the hero gallery scrolls into view — gates the heavy
  // mp4 download so first paint only pays for the poster image.
  const [heroInView, setHeroInView] = useState(false);
  // Flips true once the upgraded <video> has buffered enough to play —
  // until then we keep a shimmer overlay over the poster so the swap
  // feels seamless instead of janky.
  const [videoReady, setVideoReady] = useState(false);
  const setCartOpen = (v: boolean) => $cartOpen.set(v);
  const cart = useStore($shopifyCart);
  const [isAdding, setIsAdding] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Rehydrate full cart from persisted cart ID.
  useEffect(() => {
    void hydrateShopifyCart();
  }, []);

  useEffect(() => {
    getProduct(PDP_PRODUCT_NAME).then((p) => {
      if (p) setVariants(p.variants);
    });
  }, []);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await handleAddToCartRule({
        productName: PDP_PRODUCT_NAME,
        size,
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

  // Mobile / low-data clients get a static poster instead of an autoplaying
  // video, and the smaller WebP variants for hero imagery.
  const isMobile = useIsMobile();
  const lightMedia = usePrefersLightMedia();
  const useStaticFallback = isMobile && lightMedia;

  // Observe the gallery and flip `heroInView` true the first time it
  // intersects the viewport (with a small rootMargin so we start fetching
  // just before it enters). Once true we disconnect — no need to keep
  // observing.
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) {
      // Element not mounted yet (shouldn't happen — effect runs post-mount)
      // — fall back to upgrading immediately so the video still loads.
      setHeroInView(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setHeroInView(true);
      return;
    }
    // Synchronous fast-path: the hero is above the fold, so on initial
    // load it's almost always already on-screen. Skip waiting for the
    // observer's first async callback (which some browsers delay).
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh + 200 && rect.bottom > -200) {
      setHeroInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setHeroInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Force-trigger autoplay for the hero video — Safari iOS sometimes
  // declines the declarative `autoplay` attribute even when muted, so we
  // call play() once the element mounts and whenever the active slide
  // returns to the video.

  
  useEffect(() => {
    setVideoReady(false);
    if (!heroInView) return;
    const v = heroVideoRef.current;
    if (!v) return;
    if (PRODUCT_IMAGES[activeImage].type !== "video") return;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    const markReady = () => setVideoReady(true);
    tryPlay();
    v.addEventListener("loadedmetadata", tryPlay, { once: true });
    v.addEventListener("canplay", markReady);
    v.addEventListener("playing", markReady);
    // If the video is already buffered (e.g., back-button restore) flip
    // ready immediately so we don't show the shimmer for nothing.
    if (v.readyState >= 3) setVideoReady(true);
    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("canplay", markReady);
      v.removeEventListener("playing", markReady);
    };
  }, [activeImage, useStaticFallback, heroInView]);

  const fullVariant = variants[0];
  const bundleVariant = variants.find((v) => {
    const packOpt = v.selectedOptions.find((o) =>
      o.name.toLowerCase() === "pack" || o.name.toLowerCase() === "size"
    );
    if (!packOpt) return false;
    const val = packOpt.value.toLowerCase();
    return val.startsWith("2") || val.includes("bundle") || val.includes("2-pack") || val.includes("twin");
  });
  const isBundleAvailable = !!bundleVariant?.availableForSale;
  const activeVariant = size === "full" ? fullVariant : bundleVariant;
  const basePrice = activeVariant ? parseFloat(activeVariant.price.amount) : (size === "full" ? 19.89 : 27.82);
  const finalPrice = purchase === "sub" ? +(basePrice * 0.9).toFixed(2) : basePrice;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CartDrawer />

      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 pt-6 text-[11px] tracking-[0.15em] uppercase text-muted-foreground overflow-x-auto scrollbar-hide whitespace-nowrap">
        <a href="#" className="hover:text-foreground">Shop</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Skincare</a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-foreground">Serums</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">Bakuchiol Booster</span>
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
                className={cn(
                  "relative h-20 w-20 md:h-[88px] md:w-[88px] rounded-md overflow-hidden border-2 shrink-0 transition",
                  activeImage === i ? "border-foreground" : "border-transparent hover:border-muted-foreground/40",
                )}
                aria-label={img.alt}
              >
                <img
                  src={img.type === "video" ? (img.poster ?? serumHero) : img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {img.type === "video" && (
                  <span className="absolute bottom-1 right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-background/90 text-foreground shadow">
                    <Play className="h-2.5 w-2.5 fill-current" strokeWidth={0} />
                  </span>
                )}
              </button>
            ))}
          </div>
          <div ref={galleryRef} className="relative flex-1 bg-peach rounded-xl overflow-hidden aspect-[4/5] min-w-0">
            <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.25em] uppercase bg-background/95 backdrop-blur text-foreground px-3 py-1.5 rounded-full font-medium shadow-sm">
              ✦ Bestseller
            </span>
            <button className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:bg-background transition shadow-sm" aria-label="Save">
              <Heart className="h-4 w-4" strokeWidth={1.75} />
            </button>
            {PRODUCT_IMAGES[activeImage].type === "video" ? (
              useStaticFallback || !heroInView ? (
                // Poster-first: until the gallery is in view we render the
                // lightweight poster image, deferring the multi-MB mp4
                // download. The <img> is swapped for the <video> on the
                // very next render once `heroInView` flips true.
                <img
                  src={PRODUCT_IMAGES[activeImage].poster ?? serumVideoPoster}
                  alt={PRODUCT_IMAGES[activeImage].alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              ) : (
                <>
                  <video
                    ref={heroVideoRef}
                    key={PRODUCT_IMAGES[activeImage].src}
                    poster={PRODUCT_IMAGES[activeImage].poster ?? serumVideoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    className="w-full h-full object-cover"
                    aria-label={PRODUCT_IMAGES[activeImage].alt}
                  >
                    {/* iOS Safari ignores `media` on <source>, so list the
                        smallest file first as a sane default and let the
                        browser pick the first decodable mp4. */}
                    <source src={serumProductVideoSm} type="video/mp4" media="(max-width: 768px)" />
                    <source src={serumProductVideoMd} type="video/mp4" media="(max-width: 1280px)" />
                    <source src={serumProductVideo} type="video/mp4" />
                  </video>
                  {/* Shimmer placeholder — fades out the moment the
                      <video> reports it can play. Pointer-events disabled
                      so it never blocks the prev/next controls. */}
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-0 shimmer-overlay transition-opacity duration-500",
                      videoReady ? "opacity-0" : "opacity-100",
                    )}
                  />
                </>
              )
            ) : (
              <img
                src={PRODUCT_IMAGES[activeImage].src}
                alt={PRODUCT_IMAGES[activeImage].alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            {/* Prev / Next */}
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
          {/* Routine step pill */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium bg-foreground text-background px-2.5 py-1 rounded">
              Step 02 · Treat
            </span>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              <Sun className="h-3 w-3" /> AM <span className="text-border">·</span> <Moon className="h-3 w-3" /> PM
            </span>
          </div>

          <div className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">Dermveda · Face Serum</div>
          <h1 className="font-serif text-[2.25rem] md:text-5xl leading-[1.02] mb-4 tracking-tight">
            Bakuchiol Booster Serum
          </h1>
          <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed">
            Plant retinol alternative with turmeric and quinoa peptides. Visibly smoother, brighter, firmer — without irritation.
          </p>

          {/* Concern tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {["Fine Lines", "Dark Spots", "Sensitive Skin", "Pregnancy Safe"].map((t) => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-foreground/80">
                {t}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
              ))}
            </div>
            <span className="text-sm font-medium">4.6</span>
            <a href="#reviews" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
              145 reviews
            </a>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">98% would repurchase</span>
          </div>

          {/* Size */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Size</div>
              <div className="text-[11px] text-muted-foreground">{size === "full" ? "2 fl oz · 60ml" : "2 × 60ml · save 30%"}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  k: "full" as const,
                  label: "Full Size",
                  sub: "60ml",
                  price: fullVariant ? `$${parseFloat(fullVariant.price.amount).toFixed(2)}` : "—",
                  available: fullVariant?.availableForSale ?? true,
                },
                {
                  k: "bundle" as const,
                  label: "Bundle of 2",
                  sub: isBundleAvailable ? "Save more" : "Out of stock",
                  price: bundleVariant ? `$${parseFloat(bundleVariant.price.amount).toFixed(2)}` : "—",
                  available: isBundleAvailable,
                },
              ].map((s) => (
                <button
                  key={s.k}
                  onClick={() => s.available && setSize(s.k)}
                  disabled={!s.available}
                  className={cn(
                    "px-3 py-3 rounded-md border text-sm transition text-left",
                    size === s.k ? "border-foreground bg-secondary/40" : "border-border hover:border-muted-foreground/50",
                    !s.available && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="font-medium text-[13px]">{s.label} · {s.sub}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Purchase */}
          <div className="space-y-2 mb-5">
            <button
              onClick={() => setPurchase("once")}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-md border-2 transition",
                purchase === "once" ? "border-foreground" : "border-border",
              )}
            >
              <span className="flex items-center gap-3 text-sm">
                <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center", purchase === "once" ? "border-foreground" : "border-muted-foreground")}>
                  {purchase === "once" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                </span>
                One-time purchase
              </span>
              <span className="text-sm font-medium">${basePrice.toFixed(2)}</span>
            </button>
            <button
              onClick={() => setPurchase("sub")}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-md border-2 transition",
                purchase === "sub" ? "border-foreground" : "border-border",
              )}
            >
              <span className="flex items-center gap-3 text-sm flex-wrap text-left">
                <span className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0", purchase === "sub" ? "border-foreground" : "border-muted-foreground")}>
                  {purchase === "sub" && <span className="h-2 w-2 rounded-full bg-foreground" />}
                </span>
                <span>Subscribe & save 10%</span>
                <span className="text-[10px] tracking-widest uppercase bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Best Value</span>
              </span>
              <span className="text-sm whitespace-nowrap">
                <span className="line-through text-muted-foreground mr-1.5 text-xs">${basePrice.toFixed(2)}</span>
                <span className="font-medium">${(basePrice * 0.9).toFixed(2)}</span>
              </span>
            </button>
            {purchase === "sub" && (
              <div className="text-xs text-muted-foreground px-1 leading-relaxed">
                Delivered every <span className="underline">8 weeks</span>. Skip, swap, or cancel anytime.
              </div>
            )}
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
              { icon: Award, label: "Money-Back", sub: "Guarantee" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center py-3 px-2 bg-secondary/40 rounded-md">
                <b.icon className="h-4 w-4 mb-1.5 text-foreground" strokeWidth={1.5} />
                <div className="text-[11px] font-medium leading-tight">{b.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{b.sub}</div>
              </div>
            ))}
          </div>

          {/* Cert badges — stamp-style seals, responsive sizing */}
          <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
            {[
              { src: badgeUsdaOrganic, label: "USDA Organic" },
              { src: badgeCrueltyFree, label: "Cruelty Free" },
              { src: badgeVegan, label: "100% Vegan" },
              { src: badgeMadeInUsa, label: "Made in USA" },
            ].map((b) => (
              <img
                key={b.label}
                src={b.src}
                alt={b.label}
                title={b.label}
                width={1024}
                height={1024}
                loading="lazy"
                className="mx-auto h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-peach">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-10 lg:py-14">
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/60 mb-2">Clinical Study · 8 Weeks</div>
            <h2 className="font-serif text-2xl md:text-3xl">Real results, measured.</h2>
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
            Based on consumer perception study, n=82, 8 weeks of twice-daily use.
          </p>
        </div>
      </section>

      {/* Lifestyle ritual — application moment */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Zoom into lifestyle image with caption"
                  className="group relative rounded-2xl overflow-hidden bg-secondary/40 aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] block w-full focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {useStaticFallback ? (
                    <picture>
                      <source media="(max-width: 768px)" srcSet={serumApplicationSm} type="image/webp" />
                      <img
                        src={serumApplication}
                        alt="Bakuchiol Plant Retinol Serum — application moment"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition group-hover:scale-[1.02]"
                      />
                    </picture>
                  ) : (
                    <video
                      poster={serumVideoPoster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition group-hover:scale-[1.02]"
                      aria-label="Bakuchiol Plant Retinol Serum — application moment"
                    >
                      <source src={serumProductVideoSm} type="video/mp4" media="(max-width: 768px)" />
                      <source src={serumProductVideoMd} type="video/mp4" media="(max-width: 1280px)" />
                      <source src={serumProductVideo} type="video/mp4" />
                    </video>
                  )}
                  <LifestyleCaptionOverlay />
                  <span
                    className="absolute inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase text-foreground border border-border shadow-sm"
                    style={{
                      bottom: "max(0.75rem, env(safe-area-inset-bottom))",
                      right: "max(0.75rem, env(safe-area-inset-right))",
                    }}
                  >
                    <ZoomIn className="w-3 h-3" /> Zoom
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[96vw] sm:max-w-3xl p-0 overflow-hidden">
                <DialogTitle className="sr-only">Product video — zoomed view</DialogTitle>
                <DialogDescription className="sr-only">Full-screen playback of the Bakuchiol Booster Serum application video.</DialogDescription>
                <div className="relative w-full max-h-[88vh] overflow-auto bg-ink-deep">
                  <video
                    poster={serumVideoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    className="w-full h-auto object-contain block"
                    aria-label="Bakuchiol Plant Retinol Serum — zoomed application moment"
                  >
                    <source src={serumProductVideoMd} type="video/mp4" media="(max-width: 1024px)" />
                    <source src={serumProductVideo} type="video/mp4" />
                  </video>
                  <LifestyleCaptionOverlay />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">A quiet ritual</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Two drops.<br />Morning and night.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Press a half dropper into clean palms, warm between hands, and gently
              press into skin. No tugging, no sting — just a soft botanical glow that
              builds with every use.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Lightweight, fast-absorbing finish",
                "Layers under moisturizer or SPF",
                "Pregnancy & sensitive-skin friendly",
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

      {/* Before / After — visible transformation */}
      <section className="bg-secondary/40">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Real results, naturally</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">Visible transformation in 4 weeks.</h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="Zoom into before and after comparison"
                className="group relative rounded-2xl overflow-hidden bg-background shadow-sm block w-full focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <picture>
                  <source media="(max-width: 768px)" srcSet={serumBeforeAfterSm} type="image/webp" />
                  <img
                    src={serumBeforeAfter}
                    alt="Before and after 4 weeks of use: brighter even tone, reduced blemishes and spots, smoother texture and refined pores"
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <BeforeAfterChipsOverlay />
                <span
                  className="absolute hidden sm:inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase text-foreground border border-border shadow-sm"
                  style={{
                    bottom: "max(0.75rem, env(safe-area-inset-bottom))",
                    right: "max(0.75rem, env(safe-area-inset-right))",
                  }}
                >
                  <ZoomIn className="w-3 h-3" /> Zoom
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[96vw] sm:max-w-4xl p-0 overflow-hidden">
                <DialogTitle className="sr-only">Before and after — zoomed view</DialogTitle>
                <DialogDescription className="sr-only">Zoomed before and after comparison showing skin improvement after 4 weeks of use.</DialogDescription>
              <div className="relative w-full max-h-[88vh] overflow-auto bg-background">
                <img
                  src={serumBeforeAfter}
                  alt="Before and after comparison, zoomed view"
                  className="w-full h-auto object-contain block"
                />
                <BeforeAfterChipsOverlay />
              </div>
            </DialogContent>
          </Dialog>
          {/* Mobile fallback: render the social proof chip below the image to avoid
              covering the bottle in the comparison */}
          <div className="sm:hidden flex justify-center mt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-[10px] tracking-[0.18em] uppercase text-foreground shadow-sm">
              <Heart className="w-3 h-3 text-accent fill-accent" strokeWidth={0} />
              Loved by 8.2k · #PlantRetinol
            </span>
          </div>
          <p className="text-[10px] text-center text-foreground/50 mt-6 tracking-wider">
            Individual results may vary. Based on twice-daily use over 4 weeks.
          </p>
        </div>
      </section>

      {/* Key ingredients — modern card grid */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">What's inside</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] mb-5">
              Four actives.<br />Zero compromises.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every ingredient is plant-derived, clinically supported, and chosen for one job — to renew your skin without the irritation of conventional retinol.
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

        {/* Ingredient slider — macro photography with peer-reviewed benefits */}
        <IngredientSlider />
      </section>

      {/* How to use — routine builder */}
      <section className="bg-secondary/40 py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Your routine</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">Where it fits.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {ROUTINE.map((r) => (
              <div
                key={r.step}
                className={cn(
                  "rounded-xl p-5 lg:p-6 border transition flex flex-col",
                  r.highlight ? "bg-foreground text-background border-foreground" : "bg-background border-border",
                )}
              >
                <div className={cn("text-[10px] tracking-[0.2em] uppercase mb-3", r.highlight ? "text-background/60" : "text-muted-foreground")}>
                  {r.time}
                </div>
                <div className={cn("font-serif text-3xl mb-3", r.highlight ? "text-background" : "text-ink-deep")}>{r.step}</div>
                <h3 className={cn("font-medium mb-2 text-[15px]", r.highlight && "text-background")}>{r.title}</h3>
                <p className={cn("text-xs leading-relaxed", r.highlight ? "text-background/70" : "text-muted-foreground")}>{r.body}</p>
                {r.highlight && (
                  <span className="inline-flex items-center gap-1 mt-3 text-[10px] tracking-[0.15em] uppercase text-accent">
                    <Sparkles className="h-3 w-3" /> This serum
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Bought Together — bundle upsell */}
      <FrequentlyBoughtTogether />

      {/* Comparison */}
      <section className="bg-ink-deep text-primary-foreground py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">The difference</div>
            <h2 className="font-serif text-3xl md:text-5xl mb-3">Bakuchiol vs. retinol</h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto text-sm">
              Same renewal benefits — without redness, peeling, or sun sensitivity.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-primary-foreground/15 bg-primary-foreground/[0.02]">
            <div className="grid grid-cols-3 bg-primary-foreground/[0.06] text-[10px] tracking-[0.2em] uppercase">
              <div className="p-4 lg:p-5 text-primary-foreground/50"></div>
              <div className="p-4 lg:p-5 text-accent border-l border-primary-foreground/15 font-medium">Our Bakuchiol</div>
              <div className="p-4 lg:p-5 text-primary-foreground/50 border-l border-primary-foreground/15">Conventional Retinol</div>
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
            {/* Click-to-load YouTube embed — Dr. Haley explains bakuchiol */}
            <div className="lg:col-span-7">
              <LiteYouTube
                id="dbxs9yaNtkA"
                start={1}
                title="Watch: Dr. Jennifer Haley on plant retinol"
                className="shadow-lg"
              />
            </div>
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Dermatologist approved</div>
              <blockquote className="font-serif text-xl md:text-2xl leading-snug mb-4 text-ink-deep">
                "Bakuchiol delivers retinol-like results without the irritation. This formulation is one I trust for my most sensitive patients."
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

      {/* Ayurveda heritage — editorial story section, Tatcha-inspired */}
      <section className="bg-peach/40 py-20 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="lg:col-span-6 order-1 lg:order-1">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={ayurvedaHeritage}
                  alt="A handcrafted brass kansa bowl of turmeric-infused oil with tulsi leaves and bakuchi seeds, evoking traditional Ayurvedic ritual"
                  width={1080}
                  height={1350}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] tracking-[0.22em] uppercase text-foreground">
                  <Sprout className="w-3 h-3 text-accent" strokeWidth={2} />
                  Est. 1500 BCE
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="lg:col-span-6 order-2 lg:order-2">
              <div className="text-[10px] tracking-[0.28em] uppercase text-accent mb-4">
                Inspired by Ayurveda
              </div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.05] mb-6 text-ink-deep">
                A 5,000-year-old<br />
                ritual of radiance.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-5 max-w-xl">
                Long before "clean beauty," the sages of Ayurveda recorded an entire science of skin in the Charaka Samhita — herbs pressed at dawn, infused into warm oils, and applied with intention. Bakuchi (बाकुची), turmeric (हरिद्रा) and tulsi were prescribed not as cosmetics, but as <em className="not-italic font-serif italic text-ink-deep">rasayana</em> — formulas to renew the body from within.
              </p>
              <p className="text-foreground/75 leading-relaxed max-w-xl">
                We honor that lineage. Every active in this serum is sourced from the same plants Ayurvedic vaidyas have used for centuries — now stabilized with modern cold-press extraction so each drop delivers exactly what your skin needs, nothing it doesn't.
              </p>

              <div className="mt-8 pt-8 border-t border-foreground/10 inline-flex items-center gap-3">
                <span className="font-serif italic text-2xl text-ink-deep">"yatha pinde tatha brahmande"</span>
              </div>
              <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mt-2">
                As is the body, so is the cosmos · Ancient Sanskrit verse
              </p>
            </div>
          </div>

          {/* Three Ayurvedic principles → how it shows up in the formula */}
          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {[
              {
                sanskrit: "Rasayana",
                meaning: "The art of rejuvenation",
                how: "Bakuchi seed — used in Ayurveda for centuries to renew skin cells — is the modern bakuchiol that replaces irritating retinol.",
                icon: Sparkles,
              },
              {
                sanskrit: "Haridra",
                meaning: "The golden healer",
                how: "Turmeric, ground fresh into temple offerings, is cold-pressed here to brighten tone and calm inflammation at the source.",
                icon: Sun,
              },
              {
                sanskrit: "Abhyanga",
                meaning: "The daily oil ritual",
                how: "Press 4–5 drops between warm palms and massage in upward strokes — the same method prescribed in Ayurvedic dinacharya.",
                icon: Leaf,
              },
            ].map((p) => (
              <div
                key={p.sanskrit}
                className="bg-background rounded-2xl p-7 lg:p-8 border border-foreground/5 hover:shadow-sm transition"
              >
                <p.icon className="w-5 h-5 text-accent mb-5" strokeWidth={1.5} />
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-2">
                  {p.meaning}
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl text-ink-deep mb-4">
                  {p.sanskrit}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {p.how}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UGC carousel — community posts with consistent brand overlay */}
      <section className="bg-secondary/40 py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-12">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">
                #PlantRetinol · 8.2k posts
              </div>
              <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] text-ink-deep">
                The community<br className="hidden sm:block" /> that swore off retinol.
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm sm:text-right">
              Real customers, real timelines. Tag <span className="text-foreground">@celsiusherbs</span> to be featured.
            </p>
          </div>

          <UgcCarousel />
        </div>
      </section>



      <section className="max-w-3xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-10">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">Good to know</div>
          <h2 className="font-serif text-3xl md:text-5xl">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left font-serif text-lg md:text-xl py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-5 space-y-4">
                <p>{f.a}</p>
                {f.videoId && (
                  <LiteYouTube
                    id={f.videoId}
                    title="Watch the science: Bakuchiol vs. Retinol"
                  />
                )}
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
            <h2 className="font-serif text-3xl md:text-5xl mb-5">Loved by 145 reviewers.</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="font-serif text-5xl">4.6</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Based on 145 verified reviews</div>
              </div>
            </div>
            {/* Rating bars */}
            <div className="space-y-1.5 mb-6">
              {[
                { stars: 5, pct: 78 },
                { stars: 4, pct: 15 },
                { stars: 3, pct: 5 },
                { stars: 2, pct: 1 },
                { stars: 1, pct: 1 },
              ].map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-muted-foreground">{r.stars}</span>
                  <Star className="h-3 w-3 fill-foreground text-foreground" />
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-foreground" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="w-8 text-muted-foreground text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-md text-xs tracking-[0.12em] uppercase">Write a Review</Button>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-secondary/40 rounded-xl p-5 lg:p-6">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{r.name}</span>
                    {r.verified && (
                      <span className="text-[10px] tracking-wider uppercase text-accent flex items-center gap-1">
                        <Check className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{r.skin}</span>
                </div>
                <h3 className="font-medium mb-1.5">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
