import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
export const metadata: Metadata = { title: "Premium electronics repair in Prague", description: "Individual repair quotes, easy booking and live repair tracking for Apple, Samsung and more." };
export default function Home() { return <SiteChrome><StructuredData data={{ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Reform", description: "Premium electronics repair with individual quotes and online booking.", telephone: "+420737500587", email: "fear75412@gmail.com", address: { "@type": "PostalAddress", streetAddress: "Biskupcova 31", addressLocality: "Praha", postalCode: "130 00", addressCountry: "CZ" }, areaServed: "Prague", url: "https://reform-device-care-prague.artemmikhailov200310.chatgpt.site" }}/><HomePage/></SiteChrome>; }
