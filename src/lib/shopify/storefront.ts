/**
 * Shopify Storefront API — main entry for GraphQL operations.
 *
 * Centralizes product, variant, cart, and collection calls. Uses the singleton client from `client.ts`.
 */


import { getStorefrontClient } from "./client";

// ---------------------------------------------------------------------------
// Base types
// ---------------------------------------------------------------------------

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  image: Image | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  vendor: string;
  productType: string;
  onlineStoreUrl: string | null;
  seo: { title: string | null; description: string | null };
  featuredImage: Image | null;
  images: Image[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  products: Product[];
}

/** Lightweight collection + product handles — used by `listCollections` for debug / inventory. */
export interface CollectionListEntry {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: Array<{ handle: string; title: string }>;
}

export interface CartLine {
  id: string;
  quantity: number;
  attributes: Array<{ key: string; value: string }>;
  merchandise: {
    id: string;
    title: string;
    product: Pick<Product, "id" | "handle" | "title" | "featuredImage">;
    selectedOptions: SelectedOption[];
    price: Money;
  };
  cost: {
    totalAmount: Money;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
}

// ---------------------------------------------------------------------------
// Reusable GraphQL fragments
// ---------------------------------------------------------------------------

const MONEY_FRAGMENT = `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

const IMAGE_FRAGMENT = `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const VARIANT_FRAGMENT = `
  ${MONEY_FRAGMENT}
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    price { ...MoneyFields }
    compareAtPrice { ...MoneyFields }
    selectedOptions { name value }
    image { ...ImageFields }
  }
  ${IMAGE_FRAGMENT}
`;

const PRODUCT_FRAGMENT = `
  ${VARIANT_FRAGMENT}
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    vendor
    productType
    onlineStoreUrl
    seo { title description }
    featuredImage { ...ImageFields }
    images(first: 20) { nodes { ...ImageFields } }
    variants(first: 50) { nodes { ...VariantFields } }
    priceRange {
      minVariantPrice { ...MoneyFields }
      maxVariantPrice { ...MoneyFields }
    }
  }
`;

const CART_FRAGMENT = `
  ${MONEY_FRAGMENT}
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes { key value }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions { name value }
            price { ...MoneyFields }
            product {
              id
              handle
              title
              featuredImage { url altText width height }
            }
          }
        }
        cost {
          totalAmount { ...MoneyFields }
        }
      }
    }
    cost {
      subtotalAmount { ...MoneyFields }
      totalAmount { ...MoneyFields }
      totalTaxAmount { ...MoneyFields }
    }
  }
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`;

const PRODUCTS_BY_HANDLES_QUERY = `
  ${PRODUCT_FRAGMENT}
  query ProductsByHandles($handles: [String!]!) {
    nodes: products(first: 20, query: $handles) {
      nodes { ...ProductFields }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  query CollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { ...ImageFields }
      products(first: $first) {
        nodes { ...ProductFields }
      }
    }
  }
`;

const COLLECTIONS_LIST_QUERY = `
  query CollectionsList($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        products(first: 24) {
          nodes {
            handle
            title
          }
        }
      }
    }
  }
`;

const SEARCH_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: PRODUCT) {
      nodes {
        ... on Product { ...ProductFields }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations (cart)
// ---------------------------------------------------------------------------

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function mapProduct(raw: Record<string, unknown>): Product {
  
  return {
    id: raw.id as string,
    handle: raw.handle as string,
    title: raw.title as string,
    description: raw.description as string,
    descriptionHtml: raw.descriptionHtml as string,
    availableForSale: raw.availableForSale as boolean,
    tags: (raw.tags as string[]) ?? [],
    vendor: raw.vendor as string,
    productType: raw.productType as string,
    onlineStoreUrl: (raw.onlineStoreUrl as string) ?? null,
    seo: raw.seo as Product["seo"],
    featuredImage: (raw.featuredImage as Image) ?? null,
    images: ((raw.images as { nodes: Image[] })?.nodes) ?? [],
    variants: ((raw.variants as { nodes: ProductVariant[] })?.nodes) ?? [],
    priceRange: raw.priceRange as Product["priceRange"],
  };
}

function mapCart(raw: Record<string, unknown>): Cart {
  return {
    id: raw.id as string,
    checkoutUrl: raw.checkoutUrl as string,
    totalQuantity: raw.totalQuantity as number,
    lines: ((raw.lines as { nodes: CartLine[] })?.nodes) ?? [],
    cost: raw.cost as Cart["cost"],
  };
}

// ---------------------------------------------------------------------------
// Public API — Products
// ---------------------------------------------------------------------------

/** Fetches a full product by handle (slug). Returns null if not found. */
export async function getProduct(handle: string): Promise<Product | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{ product: Record<string, unknown> | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { variables: { handle } },
    );
    if (errors || !data?.product) return null;
    return mapProduct(data.product);
  } catch (err) {
    console.error("Shopify getProduct error:", err);
    return null;
  }
}

/** Fetches products for a collection by handle. */
export async function getCollection(
  handle: string,
  first = 20,
): Promise<Collection | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{
      collection: {
        id: string;
        handle: string;
        title: string;
        description: string;
        image: Image | null;
        products: { nodes: Record<string, unknown>[] };
      } | null;
    }>(COLLECTION_BY_HANDLE_QUERY, { variables: { handle, first } });
    if (errors || !data?.collection) return null;
    const c = data.collection;
    return {
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description,
      image: c.image,
      products: c.products.nodes.map(mapProduct),
    };
  } catch (err) {
    console.error("Shopify getCollection error:", err);
    return null;
  }
}

/**
 * Lists store collections (handles + titles + sample products).
 * Useful for discovering handles in Admin without opening each product URL.
 */
export async function listCollections(first = 50): Promise<CollectionListEntry[]> {
  const client = getStorefrontClient();
  if (!client) return [];
  try {
    const { data, errors } = await client.request<{
      collections: {
        nodes: Array<{
          id: string;
          handle: string;
          title: string;
          description: string;
          products: { nodes: Array<{ handle: string; title: string }> };
        }>;
      };
    }>(COLLECTIONS_LIST_QUERY, { variables: { first } });
    if (errors || !data?.collections?.nodes) return [];
    return data.collections.nodes.map((n) => ({
      id: n.id,
      handle: n.handle,
      title: n.title,
      description: n.description ?? "",
      products: n.products?.nodes ?? [],
    }));
  } catch (err) {
    console.error("Shopify listCollections error:", err);
    return [];
  }
}

/** Searches products by free-text query. */
export async function searchProducts(
  query: string,
  first = 10,
): Promise<Product[]> {
  const client = getStorefrontClient();
  if (!client) return [];
  try {
    const { data, errors } = await client.request<{
      search: { nodes: Record<string, unknown>[] };
    }>(SEARCH_PRODUCTS_QUERY, { variables: { query, first } });
    if (errors || !data?.search) return [];
    return data.search.nodes.map(mapProduct);
  } catch (err) {
    console.error("Shopify searchProducts error:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Public API — Cart
// ---------------------------------------------------------------------------

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: Array<{ key: string; value: string }>;
}

/** Creates a new cart with the given lines. */
export async function createCart(lines: CartLineInput[]): Promise<Cart | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{
      cartCreate: { cart: Record<string, unknown>; userErrors: { message: string }[] };
    }>(CART_CREATE_MUTATION, { variables: { lines } });
    if (errors || !data?.cartCreate?.cart) return null;
    return mapCart(data.cartCreate.cart);
  } catch (err) {
    console.error("Shopify createCart error:", err);
    throw err;
  }
}

/** Loads an existing cart by ID. */
export async function getCart(cartId: string): Promise<Cart | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{
      cart: Record<string, unknown> | null;
    }>(CART_QUERY, { variables: { cartId } });
    if (errors || !data?.cart) return null;
    return mapCart(data.cart);
  } catch (err) {
    console.error("Shopify getCart error:", err);
    return null;
  }
}

/** Adds lines to an existing cart. */
export async function addCartLines(
  cartId: string,
  lines: CartLineInput[],
): Promise<Cart | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{
      cartLinesAdd: { cart: Record<string, unknown>; userErrors: { message: string }[] };
    }>(CART_LINES_ADD_MUTATION, { variables: { cartId, lines } });
    if (errors || !data?.cartLinesAdd?.cart) return null;
    return mapCart(data.cartLinesAdd.cart);
  } catch (err) {
    console.error("Shopify addCartLines error:", err);
    throw err;
  }
}

/** Updates quantities (and optional attributes) for existing cart lines. */
export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number; attributes?: Array<{ key: string; value: string }> }[],
): Promise<Cart | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{
      cartLinesUpdate: { cart: Record<string, unknown>; userErrors: { message: string }[] };
    }>(CART_LINES_UPDATE_MUTATION, { variables: { cartId, lines } });
    if (errors || !data?.cartLinesUpdate?.cart) return null;
    return mapCart(data.cartLinesUpdate.cart);
  } catch (err) {
    console.error("Shopify updateCartLines error:", err);
    throw err;
  }
}

/** Removes cart lines by line IDs. */
export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<Cart | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{
      cartLinesRemove: { cart: Record<string, unknown>; userErrors: { message: string }[] };
    }>(CART_LINES_REMOVE_MUTATION, { variables: { cartId, lineIds } });
    if (errors || !data?.cartLinesRemove?.cart) return null;
    return mapCart(data.cartLinesRemove.cart);
  } catch (err) {
    console.error("Shopify removeCartLines error:", err);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Menu types and queries
// ---------------------------------------------------------------------------

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: string;
  items: MenuItem[];
}

export interface Menu {
  handle: string;
  items: MenuItem[];
}

const MENU_QUERY = `
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      handle
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
        }
      }
    }
  }
`;

/** Fetches a Shopify navigation menu by handle (e.g. "main-menu", "footer"). */
export async function getMenu(handle: string): Promise<Menu | null> {
  const client = getStorefrontClient();
  if (!client) return null;
  try {
    const { data, errors } = await client.request<{
      menu: { handle: string; items: MenuItem[] } | null;
    }>(MENU_QUERY, { variables: { handle } });
    if (errors || !data?.menu) return null;
    return data.menu;
  } catch (err) {
    console.error("Shopify getMenu error:", err);
    return null;
  }
}
