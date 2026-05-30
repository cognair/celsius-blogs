import { createStorefrontApiClient, type StorefrontApiClient } from "@shopify/storefront-api-client";

let cached: StorefrontApiClient | null | undefined;

function normalizeStoreDomain(rawDomain: string): string | null {
  const trimmedDomain = rawDomain.trim();
  const withoutProtocol = trimmedDomain.replace(/^https?:\/\//i, "");
  const sanitizedDomain = withoutProtocol.replace(/^\/+|\/+$/g, "");

  if (!sanitizedDomain || sanitizedDomain.includes("/")) {
    console.error(
      "[shopify] PUBLIC_SHOPIFY_STORE_DOMAIN is invalid. Use only the store domain without 'https://' or extra slashes.",
    );
    return null;
  }

  return sanitizedDomain;
}

export function getStorefrontClient(): StorefrontApiClient | null {
  if (cached !== undefined) return cached;
  const domainEnv = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  const tokenEnv = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN?.trim();

  if (!domainEnv || !tokenEnv) {
    console.error(
      "[shopify] Missing environment variables: PUBLIC_SHOPIFY_STORE_DOMAIN and/or PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN.",
    );
    cached = null;
    return null;
  }

  const storeDomain = normalizeStoreDomain(domainEnv);
  if (!storeDomain) {
    cached = null;
    return null;
  }

  const apiVersion = import.meta.env.PUBLIC_SHOPIFY_API_VERSION?.trim() || "2026-01";
  const publicAccessToken = tokenEnv;

  cached = createStorefrontApiClient({
    storeDomain,
    apiVersion,
    publicAccessToken,
  });
  return cached;
}
