import type { Metadata } from "next";
import { headers } from "next/headers";
import { HomePage } from "@/components/HomePage";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { NONCE_REQUEST_HEADER } from "@/lib/security-headers";
export const metadata: Metadata = { title: "Premium electronics repair in Prague", description: "Individual repair quotes, easy booking and live repair tracking for Apple, Samsung and more." };
export default async function Home() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get(NONCE_REQUEST_HEADER) ?? undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reart.cz";
  return <SiteChrome><StructuredData nonce={nonce} data={{ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Reform", description: "Premium electronics repair with individual quotes and online booking.", telephone: "+420737500587", email: "fear75412@gmail.com", address: { "@type": "PostalAddress", streetAddress: "Biskupcova 31", addressLocality: "Praha", postalCode: "130 00", addressCountry: "CZ" }, areaServed: "Prague", url: siteUrl }}/><HomePage/></SiteChrome>;
}
