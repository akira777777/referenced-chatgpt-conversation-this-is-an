import { PriceExplorer } from "@/components/PriceExplorer";
import { SiteChrome } from "@/components/SiteChrome";
export const metadata = { title: "Repair prices", description: "Search indicative prices for phone, tablet and computer repairs." };
export default function PricesPage() { return <SiteChrome><div className="page-hero"><div className="container"><p className="eyebrow">CLEAR FROM THE START</p><h1>Repair pricing.</h1><p>Explore indicative prices for common repairs. You’ll approve a final quote after diagnostics.</p></div></div><section className="section price-section"><div className="container"><PriceExplorer/></div></section></SiteChrome>; }
