/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SHOPIFY_STORE_DOMAIN?: string;
  readonly PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN?: string;
  readonly PUBLIC_SHOPIFY_API_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
