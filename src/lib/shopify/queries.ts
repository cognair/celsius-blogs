export const PRODUCT_BY_HANDLE = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      onlineStoreUrl
      seo {
        title
        description
      }
      featuredImage {
        url
        altText
      }
    }
  }
`;

export type ProductByHandleData = {
  product: {
    id: string;
    handle: string;
    title: string;
    description: string;
    onlineStoreUrl?: string | null;
    seo: { title?: string | null; description?: string | null };
    featuredImage?: { url: string; altText?: string | null } | null;
  } | null;
};
