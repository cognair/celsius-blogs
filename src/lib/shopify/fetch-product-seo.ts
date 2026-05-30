import { getStorefrontClient } from "./client";
import { PRODUCT_BY_HANDLE, type ProductByHandleData } from "./queries";

export type ShopifyProductSeo = NonNullable<ProductByHandleData["product"]>;

export async function fetchProductByHandle(handle: string): Promise<ShopifyProductSeo | null> {
  const client = getStorefrontClient();
  if (!client) return null;

  const { data, errors } = await client.request<ProductByHandleData>(PRODUCT_BY_HANDLE, {
    variables: { handle },
  });

  if (errors || !data?.product) return null;
  return data.product;
}
