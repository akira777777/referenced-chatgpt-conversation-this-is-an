import { Suspense } from "react";
import { RepairWizard } from "@/components/RepairWizard";
import { SiteChrome } from "@/components/SiteChrome";
export default function RepairPage() { return <SiteChrome><div className="page-hero compact"><div className="container"><p className="eyebrow">ONLINE BOOKING</p><h1>Start a repair.</h1><p>Select a device, see an instant estimate and book without an account.</p></div></div><div className="container wizard-wrap"><Suspense fallback={<div className="wizard-skeleton"><span/><span/><span/></div>}><RepairWizard/></Suspense></div></SiteChrome>; }
