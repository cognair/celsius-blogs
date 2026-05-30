import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { getCart, type Cart } from "./storefront";

const CART_ID_STORAGE_KEY = "shopify_cart_id";

export const $shopifyCartId = persistentAtom<string | null>(CART_ID_STORAGE_KEY, null, {
  encode: (value) => value ?? "",
  decode: (value) => value || null,
});

export const $shopifyCart = atom<Cart | null>(null);

let hydrationPromise: Promise<Cart | null> | null = null;

/**
 * Rehydrates the full cart object using the persisted cart ID.
 */
export async function hydrateShopifyCart(): Promise<Cart | null> {
  const cartId = $shopifyCartId.get();
  if (!cartId) {
    $shopifyCart.set(null);
    return null;
  }

  if (!hydrationPromise) {
    hydrationPromise = getCart(cartId)
      .then((cart) => {
        if (!cart) {
          clearShopifyCart();
          return null;
        }
        $shopifyCart.set(cart);
        return cart;
      })
      .finally(() => {
        hydrationPromise = null;
      });
  }

  return hydrationPromise;
}

/**
 * Updates the store after any cart mutation.
 */
export function syncShopifyCart(nextCart: Cart | null): Cart | null {
  if (!nextCart) return $shopifyCart.get();
  $shopifyCartId.set(nextCart.id);
  $shopifyCart.set(nextCart);
  return nextCart;
}

export function clearShopifyCart(): void {
  $shopifyCartId.set(null);
  $shopifyCart.set(null);
}
