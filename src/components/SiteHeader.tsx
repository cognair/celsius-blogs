import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@nanostores/react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { $shopifyCart, hydrateShopifyCart } from "@/lib/shopify/cart-store";
import { $cartOpen } from "@/components/CartDrawer";
import type { MenuItem } from "@/lib/shopify/storefront";

// Storefront base — when this framework runs on a subdomain (blog.celsiusherbs.com),
// relative URLs from Shopify menus (e.g. "/", "/shopify-collections") would resolve
// to the subdomain and break. Absolutify them to the main storefront.
const STOREFRONT_BASE = "https://celsiusherbs.com";

function absolutifyStorefront(url: string | undefined): string {
  if (!url) return STOREFRONT_BASE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) return url;
  if (url.startsWith("/")) return STOREFRONT_BASE + url;
  return STOREFRONT_BASE + "/" + url;
}

const FALLBACK_SHOP_ALL: MenuItem[] = [
  { id: "humans", title: "Humans", url: "https://celsiusherbs.myshopify.com/collections/humans", type: "COLLECTION", items: [] },
  { id: "pets", title: "Pets", url: "https://celsiusherbs.myshopify.com/collections/pets", type: "COLLECTION", items: [] },
];

const FALLBACK_POLICIES: MenuItem[] = [
  { id: "privacy", title: "Privacy Policy", url: "https://celsiusherbs.myshopify.com/policies/privacy-policy", type: "POLICY", items: [] },
  { id: "return", title: "Return Policy", url: "https://celsiusherbs.myshopify.com/policies/refund-policy", type: "POLICY", items: [] },
  { id: "shipping", title: "Shipping Policy", url: "https://celsiusherbs.myshopify.com/policies/shipping-policy", type: "POLICY", items: [] },
  { id: "terms", title: "Terms of Service", url: "https://celsiusherbs.myshopify.com/policies/terms-of-service", type: "POLICY", items: [] },
];


// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SiteHeaderProps {
  mainMenu?: MenuItem[];
  shopAllMenu?: MenuItem[];
  policiesMenu?: MenuItem[];
}

// ---------------------------------------------------------------------------
// Dropdown component
// ---------------------------------------------------------------------------

function NavDropdown({ label, items, href }: { label: string; items: MenuItem[]; href?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 300);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        className="nav-link-blue flex items-center gap-1 whitespace-nowrap"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {href ? <a href={href}>{label}</a> : label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && items.length > 0 && (
        <div className="absolute top-full left-0 pt-2 min-w-[160px] z-50">
        <div className="bg-white border border-gray-200 shadow-md rounded">
          {items.map((item) => (
            <a
              key={item.id}
              href={absolutifyStorefront(item.url)}
              className="nav-link-blue block px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              {item.title}
            </a>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SiteHeader({ mainMenu = [], shopAllMenu = [], policiesMenu = [] }: SiteHeaderProps) {
  const cart = useStore($shopifyCart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopAllOpen, setMobileShopAllOpen] = useState(false);
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false);

  useEffect(() => {
    void hydrateShopifyCart();
  }, []);

  // Core nav items — always displayed. URLs come from Shopify when available,
  // otherwise fall back to hardcoded defaults. Wrapped in absolutifyStorefront()
  // so relative paths from Shopify (e.g. "Home" → "/") resolve to the main
  // storefront when this framework runs on a subdomain.
  const shopifyUrl = (title: string, fallback: string) =>
    absolutifyStorefront(mainMenu.find((i) => i.title === title)?.url ?? fallback);

  const coreNavLinks = [
    { id: "home",    title: "Home",                 url: shopifyUrl("Home",                 "/") },
    { id: "about",   title: "About Us",             url: shopifyUrl("About Us",             "https://celsiusherbs.myshopify.com/pages/about-us") },
    { id: "contact", title: "Contact Us",           url: shopifyUrl("Contact Us",           "https://celsiusherbs.myshopify.com/pages/contact-us") },
    { id: "blog",    title: "Blog",                 url: shopifyUrl("Blog",                 "https://celsiusherbs.com/blogs/news") },
    { id: "sale",    title: "Shop Now And Save Big", url: shopifyUrl("Shop Now And Save Big", "https://celsiusherbs.myshopify.com/collections") },
  ];

  const resolvedShopAll    = shopAllMenu.length > 0    ? shopAllMenu    : FALLBACK_SHOP_ALL;
  const resolvedPolicies   = policiesMenu.length > 0   ? policiesMenu   : FALLBACK_POLICIES;

  const cartCount = cart?.totalQuantity ?? 0;

  function handleCartClick() {
    $cartOpen.set(true);
  }

  function closeMobile() {
    setMobileOpen(false);
    setMobileShopAllOpen(false);
    setMobilePoliciesOpen(false);
  }

  return (
    <div className="sticky top-0 z-50">
      {/* ------------------------------------------------------------------ */}
      {/* Top support bar                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-[#3a8ec0] text-white text-center text-sm font-semibold py-2 px-4">
        Need support? Contact us:{" "}
        <a href="tel:+17347260148" className="hover:underline">
          +1(734) 726 0148
        </a>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main header bar                                                      */}
      {/* ------------------------------------------------------------------ */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-18 lg:h-[84px] flex items-center justify-between gap-4">
          {/* Logo — points to the main storefront, not the current subdomain. */}
          <a href={STOREFRONT_BASE} className="flex-shrink-0">
            <img src="/Logo/Logo.avif" alt="Celsius Organic Herbs" className="h-10 w-auto sm:h-12 lg:h-16" />
          </a>

          {/* Desktop navigation — order: Home · Shop All ▾ · About Us · Contact Us · Blog · Shop Now And Save Big · Policies ▾ */}
          <nav className="nav-header-grid hidden lg:flex flex-1 justify-center">
            {/* Home */}
            <a href={coreNavLinks[0].url} className="nav-link-blue whitespace-nowrap">
              Home
            </a>

            {/* Shop All dropdown */}
            <NavDropdown
              label="Shop All"
              href={shopifyUrl("Shop All", "https://celsiusherbs.com/collections/all")}
              items={resolvedShopAll}
            />

            {/* About Us · Contact Us · Blog · Shop Now And Save Big */}
            {coreNavLinks.slice(1).map((item) => (
              <a key={item.id} href={item.url} className="nav-link-blue whitespace-nowrap">
                {item.title}
              </a>
            ))}

            {/* Policies dropdown */}
            <NavDropdown
              label="Policies"
              items={resolvedPolicies}
            />
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button aria-label="Search" className="text-[#1C3A5C] hover:text-[#3a8ec0] transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <a href="https://celsiusherbs.myshopify.com/account" aria-label="Account" className="hidden md:block text-[#1C3A5C] hover:text-[#3a8ec0] transition-colors">
              <User className="h-5 w-5" />
            </a>
            <button
              aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
              onClick={handleCartClick}
              className="relative text-[#1C3A5C] hover:text-[#3a8ec0] transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#1C3A5C] text-white text-[9px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="lg:hidden text-[#1C3A5C] hover:text-[#3a8ec0] transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Mobile menu                                                       */}
        {/* ---------------------------------------------------------------- */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="max-w-[1320px] mx-auto px-4 py-4 flex flex-col gap-0">
              {/* Home */}
              <a
                href={coreNavLinks[0].url}
                onClick={closeMobile}
                className="nav-link-black py-3 border-b border-gray-100 block"
              >
                Home
              </a>

              {/* Shop All accordion */}
              <div className="border-b border-gray-100">
                <button
                  className="nav-link-black w-full py-3 flex items-center justify-between"
                  onClick={() => setMobileShopAllOpen((v) => !v)}
                >
                  Shop All
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileShopAllOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileShopAllOpen && (
                  <div className="pb-2 pl-4 flex flex-col gap-1">
                    {resolvedShopAll.map((item) => (
                      <a
                        key={item.id}
                        href={absolutifyStorefront(item.url)}
                        onClick={closeMobile}
                        className="nav-link-blue py-2 text-sm"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* About Us · Contact Us · Blog · Shop Now And Save Big */}
              {coreNavLinks.slice(1).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={closeMobile}
                  className="nav-link-black py-3 border-b border-gray-100 block"
                >
                  {item.title}
                </a>
              ))}

              {/* Policies accordion */}
              <div className="border-b border-gray-100">
                <button
                  className="nav-link-black w-full py-3 flex items-center justify-between"
                  onClick={() => setMobilePoliciesOpen((v) => !v)}
                >
                  Policies
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobilePoliciesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobilePoliciesOpen && (
                  <div className="pb-2 pl-4 flex flex-col gap-1">
                    {resolvedPolicies.map((item) => (
                      <a
                        key={item.id}
                        href={absolutifyStorefront(item.url)}
                        onClick={closeMobile}
                        className="nav-link-blue py-2 text-sm"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Account link (mobile) */}
              <a
                href="https://celsiusherbs.myshopify.com/account"
                onClick={closeMobile}
                className="py-3 font-semibold text-[#1C3A5C] text-sm flex items-center gap-2"
              >
                <User className="h-4 w-4" /> My Account
              </a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
