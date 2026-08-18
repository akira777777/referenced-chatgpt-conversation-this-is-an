declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
    ASSETS?: Fetcher;
    [key: string]: unknown;
  };
}
