import type { Metadata } from "next";
import { Suspense } from "react";
import { RepairWizard } from "@/components/RepairWizard";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Start a Repair — Online Configurator & Quote",
  description: "Configure your device repair in seconds: choose Apple, Samsung, Google or other electronics, pick your service and request an individual quote.",
};
export default function RepairPage() { return <SiteChrome><div className="page-hero compact"><div className="container"><p className="eyebrow">ONLINE BOOKING</p><h1>Start a repair.</h1><p>Select your device and issue. We’ll contact you with an individual price—no account required.</p></div></div><div className="container wizard-wrap"><Suspense fallback={<div className="wizard-skeleton"><span/><span/><span/></div>}><RepairWizard/></Suspense></div></SiteChrome>; }
