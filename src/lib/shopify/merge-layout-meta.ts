import { fetchProductByHandle } from "./fetch-product-seo";

export type StaticLayoutMeta = {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
};

export type MergedLayoutMeta = StaticLayoutMeta & {
  jsonLd?: Record<string, unknown> | null;
};

function truncate(s: string, max: number) {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function productJsonLd(input: {
  name: string;
  description: string;
  url?: string;
  image?: string;
}): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: truncate(input.description, 5000),
  };
  if (input.url) node.url = input.url;
  if (input.image) node.image = input.image;
  return node;
}

/**
 * At build time, optionally overlays Shopify product SEO onto static `.astro` defaults.
 */
export async function mergeShopifyProductSeo(
  handle: string | null | undefined,
  fallback: StaticLayoutMeta,
): Promise<MergedLayoutMeta> {
  const h = handle?.trim();
  if (!h) return { ...fallback };

  try {
    const product = await fetchProductByHandle(h);
    if (!product) return { ...fallback };

    const descFromShopify =
      product.seo.description?.trim() ||
      product.description?.trim() ||
      fallback.description ||
      "";
    const titleFromShopify = product.seo.title?.trim() || product.title?.trim() || fallback.title;
    const ogDesc = truncate(descFromShopify, 300) || fallback.ogDescription || fallback.description;
    const canonical = product.onlineStoreUrl?.trim() || fallback.canonical;
    const ogImage = product.featuredImage?.url || fallback.ogImage;

    return {
      ...fallback,
      title: titleFromShopify,
      description: truncate(descFromShopify, 320) || fallback.description,
      canonical,
      ogTitle: titleFromShopify,
      ogDescription: ogDesc,
      ogImage,
      jsonLd: productJsonLd({
        name: product.title,
        description: descFromShopify || titleFromShopify,
        url: canonical,
        image: product.featuredImage?.url ?? undefined,
      }),
    };
  } catch {
    return { ...fallback };
  }
}
