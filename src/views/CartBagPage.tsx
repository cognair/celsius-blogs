import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  updateCartLines,
  removeCartLines,
  type Cart,
} from "@/lib/shopify/storefront";
import {
  $shopifyCart,
  $shopifyCartId,
  hydrateShopifyCart,
  syncShopifyCart,
} from "@/lib/shopify/cart-store";
import { calcCartSubtotal } from "@/lib/shopify/cart-line-helpers";
import CartLines from "@/components/CartLines";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";

export default function CartBagPage() {
  const cart = useStore($shopifyCart) as Cart | null;
  const [updatingLine, setUpdatingLine] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrateShopifyCart().finally(() => setHydrated(true));
  }, []);

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

  const isEmpty = !cart || cart.totalQuantity === 0;
  const showEmpty = hydrated && isEmpty;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CartDrawer />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 pt-6 text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
        <a href="/" className="hover:text-foreground">
          Home
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">Your bag</span>
      </div>

      <main className="max-w-[1320px] mx-auto px-4 sm:px-5 lg:px-10 py-8 lg:py-12">
        {!hydrated ? (
          <p className="text-sm text-muted-foreground">Loading your bag…</p>
        ) : showEmpty ? (
          <div className="max-w-md text-center mx-auto py-16">
            <ShoppingBag
              className="h-14 w-14 mx-auto text-muted-foreground/30 mb-4"
              strokeWidth={1}
            />
            <h1 className="font-serif text-2xl tracking-tight mb-2">
              Your bag is empty
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Add something beautiful to get started.
            </p>
            <Button asChild className="rounded-full text-xs tracking-[0.15em] uppercase">
              <a href="/">Continue shopping</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 lg:items-start">
            {/* Left: title fixed, line items scroll inside a bounded panel */}
            <div
              className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-0 lg:h-[calc(100dvh-12rem)]"
            >
              <div className="shrink-0 mb-4">
                <h1 className="font-serif text-2xl sm:text-3xl tracking-tight mb-2">
                  Your bag
                </h1>
                <p className="text-sm text-muted-foreground">
                  {cart!.totalQuantity}{" "}
                  {cart!.totalQuantity === 1 ? "item" : "items"}
                </p>
              </div>
              <div
                className="min-h-0 max-h-[min(24rem,calc(100dvh-14rem))] sm:max-h-[min(28rem,calc(100dvh-13rem))] lg:max-h-none lg:flex-1 overflow-y-auto overscroll-y-contain rounded-lg border border-border/60 bg-card/20 px-4 py-4 sm:px-5 sm:py-5 [scrollbar-gutter:stable]"
              >
                <CartLines
                  lines={cart!.lines}
                  updatingLine={updatingLine}
                  onQtyChange={handleQtyChange}
                  compact={false}
                />
              </div>
            </div>

            <aside className="lg:col-span-5 xl:col-span-4 lg:self-start">
              <div className="lg:sticky lg:top-28 border border-border rounded-lg p-6 space-y-4 bg-card/30 shrink-0">
                <h2 className="font-serif text-lg tracking-tight">
                  Order summary
                </h2>
                {(() => {
                  const currency = cart!.cost.subtotalAmount.currencyCode;
                  const subtotal = calcCartSubtotal(cart!.lines);
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          {currency} {subtotal.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Shipping & taxes calculated at checkout
                      </p>
                      <a
                        href={cart!.checkoutUrl}
                        className="flex items-center justify-center w-full h-12 rounded-md bg-foreground text-background text-xs tracking-[0.15em] uppercase font-medium hover:bg-foreground/90 transition"
                      >
                        Checkout · {currency} {subtotal.toFixed(2)}
                      </a>
                      <Button
                        variant="outline"
                        className="w-full rounded-md text-xs tracking-[0.15em] uppercase"
                        asChild
                      >
                        <a href="/">Continue shopping</a>
                      </Button>
                    </>
                  );
                })()}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
