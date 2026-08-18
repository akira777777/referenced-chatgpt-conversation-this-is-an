import { PriceExplorer } from "@/components/PriceExplorer";
import { SiteChrome } from "@/components/SiteChrome";
export const metadata = { title: "Request a repair price", description: "Find your device and request an individual quote for phone, tablet or computer repair." };
export default function PricesPage() { return <SiteChrome><div className="page-hero"><div className="container"><p className="eyebrow">PRICED FOR YOUR DEVICE</p><h1>Individual repair quotes.</h1><p>Every device and fault is different. Choose your repair and we’ll contact you to agree the price.</p></div></div><section className="section price-section"><div className="container"><PriceExplorer/></div></section></SiteChrome>; }
