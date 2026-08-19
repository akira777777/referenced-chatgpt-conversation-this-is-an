import { headers } from "next/headers";
import { brands } from "@/lib/data";
import { StructuredData } from "@/components/StructuredData";
import { NONCE_REQUEST_HEADER } from "@/lib/security-headers";

/**
 * Server layout for /repair/[brand].
 *
 * Owns the JSON-LD structured data for brand pages. The page itself is a
 * client component and cannot read headers(), so the schema is rendered
 * here where the per-request CSP nonce is available. The schema content
 * only depends on the brand param, so nothing is lost by moving it up.
 */
export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand: id } = await params;
  const brand = brands.find(b => b.id === id);
  const requestHeaders = await headers();
  const nonce = requestHeaders.get(NONCE_REQUEST_HEADER) ?? undefined;

  return (
    <>
      {brand && (
        <StructuredData
          nonce={nonce}
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: `${brand.name} electronics repair in Prague`,
              provider: { "@type": "LocalBusiness", name: "Reform Prague" },
              areaServed: "Prague",
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: "Repairs", item: "/repair" },
                { "@type": "ListItem", position: 3, name: brand.name },
              ],
            },
          ]}
        />
      )}
      {children}
    </>
  );
}
