import { headers } from "next/headers";
import { StructuredData } from "@/components/StructuredData";
import { buildFaqPageSchema } from "@/lib/faq";
import { NONCE_REQUEST_HEADER } from "@/lib/security-headers";

/**
 * Server layout for /faq.
 *
 * Owns the FAQPage JSON-LD. The page itself is a client component (search,
 * filters, accordions) and cannot read headers(), so the schema is rendered
 * here where the per-request CSP nonce is available. Search-engine crawlers
 * index the English variant, so the server schema is fixed to English —
 * the interactive UI still localizes live for visitors.
 */
export default async function FaqLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get(NONCE_REQUEST_HEADER) ?? undefined;

  return (
    <>
      <StructuredData nonce={nonce} data={buildFaqPageSchema("en")} />
      {children}
    </>
  );
}
