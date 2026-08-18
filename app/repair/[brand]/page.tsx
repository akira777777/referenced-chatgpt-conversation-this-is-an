import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { DeviceGlyph, PlaceholderTag } from "@/components/ui";
import { brands } from "@/lib/data";
import { StructuredData } from "@/components/StructuredData";

export function generateStaticParams() { return brands.map(b => ({ brand: b.id })); }

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand: id } = await params;
  const brand = brands.find(b => b.id === id);
  if (!brand) return { title: "Brand Repairs" };
  return {
    title: `${brand.name} Repair in Prague`,
    description: `Professional ${brand.name} repair services with individual quotes and quality parts in Prague.`,
  };
}
export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) { const { brand: id } = await params; const brand = brands.find(b => b.id === id); if (!brand) notFound(); return <SiteChrome><StructuredData data={[{ "@context": "https://schema.org", "@type": "Service", name: `${brand.name} electronics repair`, provider: { "@type": "LocalBusiness", name: "Reform" }, areaServed: "Prague" }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "/" }, { "@type": "ListItem", position: 2, name: "Repairs", item: "/repair" }, { "@type": "ListItem", position: 3, name: brand.name }] }]} /><div className="page-hero compact"><div className="container"><p className="eyebrow">DEVICE REPAIR <PlaceholderTag/></p><h1>{brand.name} repair.</h1><p>Select your model to see supported services and request an individual quote.</p></div></div><section className="section"><div className="container"><div className="device-directory">{brand.models.map(model => <Link key={model.id} href={`/repair?brand=${brand.id}&model=${model.id}`}><DeviceGlyph kind={model.category}/><span><small>{model.category}</small><b>{model.name}</b><em>{model.repairs.length} services available</em></span><ArrowRight/></Link>)}</div></div></section></SiteChrome>; }
