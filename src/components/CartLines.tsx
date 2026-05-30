import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartLine } from "@/lib/shopify/storefront";
import {
  calcLineUnitPrice,
  getLineStep,
} from "@/lib/shopify/cart-line-helpers";
import { cn } from "@/lib/utils";

type CartLinesProps = {
  lines: CartLine[];
  updatingLine: string | null;
  onQtyChange: (lineId: string, newQty: number) => void;
  compact?: boolean;
};

export default function CartLines({
  lines,
  updatingLine,
  onQtyChange,
  compact = true,
}: CartLinesProps) {
  return (
    <div className={cn("space-y-5", !compact && "space-y-8")}>
      {lines.map((line) => {
        const isUpdating = updatingLine === line.id;
        const sizeAttr = line.attributes.find((a) => a.key === "_size")?.value;
        const purchaseAttr = line.attributes.find(
          (a) => a.key === "_purchase"
        )?.value;
        const step = getLineStep(line.attributes);

        const packLabel =
          sizeAttr === "bundle"
            ? "Pack: Bundle (2 Bottles)"
            : "Pack: Full (1 Bottle)";

        const paymentLabel =
          purchaseAttr === "sub"
            ? "Plan: Subscribe & Save"
            : "Plan: One-time";

        return (
          <div
            key={line.id}
            className={cn(
              "flex gap-4",
              !compact && "gap-5 pb-8 border-b border-border last:border-0 last:pb-0"
            )}
          >
            {line.merchandise.product.featuredImage && (
              <div
                className={cn(
                  "shrink-0 rounded-lg overflow-hidden bg-secondary",
                  compact ? "h-20 w-20" : "h-24 w-24 sm:h-32 sm:w-32"
                )}
              >
                <img
                  src={line.merchandise.product.featuredImage.url}
                  alt={
                    line.merchandise.product.featuredImage.altText ??
                    line.merchandise.product.title
                  }
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "font-medium leading-snug line-clamp-2",
                  compact ? "text-sm" : "text-base sm:text-lg"
                )}
              >
                {line.merchandise.product.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Variant: {line.merchandise.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {packLabel}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {paymentLabel}
              </p>

              {line.merchandise.selectedOptions
                .filter((o) => o.value.trim().length > 0)
                .map((opt) => (
                  <p
                    key={opt.name}
                    className="text-xs text-muted-foreground mt-0.5"
                  >
                    {opt.name}: {opt.value}
                  </p>
                ))}

              <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
                <div className="flex items-center gap-1 border border-border rounded-md">
                  <button
                    aria-label="Decrease quantity"
                    disabled={isUpdating}
                    onClick={() =>
                      onQtyChange(line.id, Math.max(0, line.quantity - step))
                    }
                    className="px-2 py-1 text-muted-foreground hover:text-foreground transition disabled:opacity-40"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium tabular-nums">
                    {isUpdating ? "…" : line.quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    disabled={isUpdating}
                    onClick={() =>
                      onQtyChange(line.id, line.quantity + step)
                    }
                    className="px-2 py-1 text-muted-foreground hover:text-foreground transition disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Remove from cart"
                    disabled={isUpdating}
                    onClick={() => onQtyChange(line.id, 0)}
                    className="px-2 py-1 text-muted-foreground hover:text-foreground transition disabled:opacity-40 rounded-md"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {(() => {
                    const base = parseFloat(line.merchandise.price.amount);
                    const unit = calcLineUnitPrice(
                      base,
                      line.quantity,
                      line.attributes
                    );
                    return (
                      <span
                        className={cn(
                          "font-medium",
                          compact ? "text-sm" : "text-base"
                        )}
                      >
                        {line.merchandise.price.currencyCode}{" "}
                        {(unit * line.quantity).toFixed(2)}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
