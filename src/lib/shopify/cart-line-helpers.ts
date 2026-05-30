/** Pricing / quantity step rules shared by CartDrawer and full cart page. */

export const BUNDLE_DISCOUNT = 0.7;
export const SUB_DISCOUNT = 0.9;

export function calcLineUnitPrice(
  basePrice: number,
  quantity: number,
  attrs: Array<{ key: string; value: string }>
): number {
  const size = attrs.find((a) => a.key === "_size")?.value;
  const purchase = attrs.find((a) => a.key === "_purchase")?.value;
  let price = basePrice;
  if (size === "bundle") price *= BUNDLE_DISCOUNT;
  if (purchase === "sub") price *= SUB_DISCOUNT;
  return price;
}

export function getLineStep(_attrs: Array<{ key: string; value: string }>): number {
  return 1;
}

export function calcCartSubtotal(
  lines: Array<{
    quantity: number;
    attributes: Array<{ key: string; value: string }>;
    merchandise: { price: { amount: string } };
  }>
): number {
  return lines.reduce((sum, line) => {
    const base = parseFloat(line.merchandise.price.amount);
    const unit = calcLineUnitPrice(base, line.quantity, line.attributes);
    return sum + unit * line.quantity;
  }, 0);
}
