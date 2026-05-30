/**
 * CartDrawer — global side-panel cart accessible from any page.
 *
 * Usage from any component / page:
 *   import { $cartOpen } from "@/components/CartDrawer";
 *   $cartOpen.set(true);   // open
 *   $cartOpen.set(false);  // close
 *
 * Mount once at the layout level:
 *   import CartDrawer from "@/components/CartDrawer";
 *   <CartDrawer />
 */

import { useState } from "react";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  updateCartLines,
  removeCartLines,
  type Cart,
} from "@/lib/shopify/storefront";

import {
  $shopifyCart,
  $shopifyCartId,
  syncShopifyCart,
} from "@/lib/shopify/cart-store";
import { calcCartSubtotal } from "@/lib/shopify/cart-line-helpers";
import CartLines from "@/components/CartLines";
import { toast } from "sonner";


// ---------------------------------------------------------------------------
// Global open/close atom — import this anywhere to open the drawer
// ---------------------------------------------------------------------------
export const $cartOpen = atom<boolean>(false);

// ---------------------------------------------------------------------------
// CartDrawer component
// ---------------------------------------------------------------------------
const CartDrawer = () => {
  const open = useStore($cartOpen);
  const cart = useStore($shopifyCart) as Cart | null;
  const [updatingLine, setUpdatingLine] = useState<string | null>(null);

  const isEmpty = !cart || cart.totalQuantity === 0;

  const handleQtyChange = async (lineId: string, newQty: number) => {
    const cartId = $shopifyCartId.get();
    if (!cartId || !cart) return;
    setUpdatingLine(lineId);
    try {
      const currentLine = cart.lines.find((l) => l.id === lineId);
      const updated =
        newQty === 0
          ? await removeCartLines(cartId, [lineId])
          : await updateCartLines(cartId, [
              {
                id: lineId,
                quantity: newQty,
                attributes: currentLine?.attributes,
              },
            ]);

      if (updated) syncShopifyCart(updated);
    } catch (err) {
      console.error("Cart update error:", err);
      toast.error("Could not update quantity. Please try again.");
    } finally {
      setUpdatingLine(null);
    }
  };

  

  return (
    <Sheet open={open} onOpenChange={(v) => $cartOpen.set(v)}>
      <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-6 py-5 border-b border-[#3a8ec0] shrink-0 bg-[#3a8ec0]">
          <SheetTitle className="font-serif text-xl tracking-tight text-white">
            Your Bag
            {!isEmpty && (
              <span className="ml-2 text-sm font-sans font-normal text-white/80">
                ({cart.totalQuantity}{" "}
                {cart.totalQuantity === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingCart
              className="h-12 w-12 text-[#3a8ec0]/30"
              strokeWidth={1}
            />
            <div>
              <p className="font-serif text-xl mb-1">Your bag is empty</p>
              <p className="text-sm text-muted-foreground">
                Add something beautiful to get started.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2 rounded-full text-xs tracking-[0.15em] uppercase"
              onClick={() => $cartOpen.set(false)}
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <CartLines
                lines={cart.lines}
                updatingLine={updatingLine}
                onQtyChange={handleQtyChange}
                compact
              />
            </div>

            {(() => {
              const currency = cart.cost.subtotalAmount.currencyCode;
              const subtotal = calcCartSubtotal(cart.lines);

              return (
                <div className="px-6 py-5 border-t border-border space-y-3 shrink-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {currency} {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Shipping & taxes calculated at checkout
                  </p>

                  <a
                    href="/cart"
                    onClick={() => $cartOpen.set(false)}
                    className="flex items-center justify-center w-full h-11 rounded-md border border-[#3a8ec0] text-[#3a8ec0] text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#3a8ec0]/5 transition"
                  >
                    View bag
                  </a>

                  <a
                    href={cart.checkoutUrl}
                    className="flex items-center justify-center w-full h-12 rounded-md bg-[#3a8ec0] text-white text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#2d7aad] transition"
                  >
                    Checkout · {currency} {subtotal.toFixed(2)}
                  </a>
                </div>
              );
            })()}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
