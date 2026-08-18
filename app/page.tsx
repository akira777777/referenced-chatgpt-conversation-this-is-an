import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
export const metadata: Metadata = { title: "Premium electronics repair in Prague", description: "Transparent device repair estimates, easy booking and live repair tracking for Apple, Samsung and more." };
export default function Home() { return <SiteChrome><StructuredData data={{ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Reform (demonstration concept)", description: "Premium electronics repair with transparent online booking.", priceRange: "$$", address: { "@type": "PostalAddress", streetAddress: "Example Street 12", addressLocality: "Prague", addressCountry: "CZ" }, openingHours: "Mo-Fr 09:00-18:00", areaServed: "Prague", url: "https://reform-repair.example" }}/><HomePage/></SiteChrome>; }
