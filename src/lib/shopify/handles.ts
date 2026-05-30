/**
 * Map each PDP route to a Shopify product **handle** (from Admin → product URL slug).
 * Leave as `null` to keep the static title/description in the `.astro` file only.
 */
export const SHOPIFY_PRODUCT_HANDLES = {
  index: null as string | null,
  scalpPsoriasisShampoo: null as string | null,
  catDandruffLotion: null as string | null,
  folliculitisShampoo: null as string | null,
  dermvedaFolliculitisShampoo: null as string | null,
  earInfectionDrops: null as string | null,
  vglowYeastSerum: null as string | null,
} as const;
