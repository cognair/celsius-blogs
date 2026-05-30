import { useState } from "react";
import type { MenuItem } from "@/lib/shopify/storefront";

// ---------------------------------------------------------------------------
// Static fallbacks
// ---------------------------------------------------------------------------

const FALLBACK_QUICK_LINKS: MenuItem[] = [
  { id: "faqs", title: "FAQs", url: "https://celsiusherbs.myshopify.com/pages/faqs", type: "PAGE", items: [] },
  { id: "about", title: "About Us", url: "https://celsiusherbs.myshopify.com/pages/about-us", type: "PAGE", items: [] },
  { id: "contact", title: "Contact Us", url: "https://celsiusherbs.myshopify.com/pages/contact-us", type: "PAGE", items: [] },
  { id: "ayurveda", title: "Ayurveda", url: "https://celsiusherbs.myshopify.com/pages/ayurveda", type: "PAGE", items: [] },
  { id: "why-ayurveda", title: "Why Ayurveda", url: "https://celsiusherbs.myshopify.com/pages/why-ayurveda", type: "PAGE", items: [] },
];

const FALLBACK_SUPPORT_POLICIES: MenuItem[] = [
  { id: "refund", title: "Refund policy", url: "https://celsiusherbs.myshopify.com/policies/refund-policy", type: "POLICY", items: [] },
  { id: "privacy", title: "Privacy Policy", url: "https://celsiusherbs.myshopify.com/policies/privacy-policy", type: "POLICY", items: [] },
  { id: "terms", title: "Terms of Service", url: "https://celsiusherbs.myshopify.com/policies/terms-of-service", type: "POLICY", items: [] },
  { id: "shipping", title: "Shipping Policy", url: "https://celsiusherbs.myshopify.com/policies/shipping-policy", type: "POLICY", items: [] },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/celsiusherbs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://www.pinterest.com/celsiusherbs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/celsiusherbs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@celsiusherbs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SiteFooterProps {
  quickLinks?: MenuItem[];
  supportPolicies?: MenuItem[];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SiteFooter({ quickLinks = [], supportPolicies = [] }: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const resolvedQuickLinks = quickLinks.length > 0 ? quickLinks : FALLBACK_QUICK_LINKS;
  const resolvedPolicies = supportPolicies.length > 0 ? supportPolicies : FALLBACK_SUPPORT_POLICIES;

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* 5-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">

          {/* Column 1 — Quick Link */}
          <div>
            <h3 className="footer-heading">Quick Link</h3>
            <ul className="flex flex-col gap-2.5">
              {resolvedQuickLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    className="footer-link"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Support & Policies */}
          <div>
            <h3 className="footer-heading">Support &amp; Policies</h3>
            <ul className="flex flex-col gap-2.5">
              {resolvedPolicies.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    className="footer-link"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Stay Connected */}
          <div>
            <h3 className="footer-heading">Stay Connected</h3>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link flex items-center gap-2.5"
                  >
                    {social.icon}
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Join Us */}
          <div>
            <h3 className="footer-heading mb-2">Join Us</h3>
            <p className="text-sm text-gray-600 mb-4 leading-snug">
              Enter your email to receive daily latest new with us
            </p>
            {subscribed ? (
              <p className="text-sm text-green-600 font-medium">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3a8ec0] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#1C3A5C] text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 hover:bg-[#3a8ec0] transition-colors rounded"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Column 5 — Celsius Herbs */}
          <div>
            <h3 className="footer-heading">Celsius Herbs</h3>
              <img src="/Logo/Logo.avif" alt="Celsius Organic Herbs" className="h-16 w-auto" />
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              34405 W 12 Mile Rd, Farmington MI 48331
              <br />
              Ph:{" "}
              <a href="tel:+17347260148" className="hover:text-[#3a8ec0] transition-colors">
                +17347260148
              </a>
              <br />
              email:{" "}
              <a href="mailto:info@celsiusherbs.com" className="hover:text-[#3a8ec0] transition-colors">
                info@celsiusherbs.com
              </a>
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h4 className="font-bold text-[#1C3A5C] text-sm mb-2">Legal Disclaimer</h4>
          <p className="text-xs text-gray-500 leading-relaxed max-w-5xl">
            Always read and follow label directions.* Claims based on traditional homeopathic practice, not accepted
            medical evidence. Not FDA evaluated. C, K, CK and X are homeopathic dilutions. These statements have not
            been evaluated by the Food and Drug Administration. The products on the website are not approved by the
            FDA and are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Celsius Herbs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
