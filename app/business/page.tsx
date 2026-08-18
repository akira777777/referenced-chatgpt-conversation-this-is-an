import type { Metadata } from "next";
import { ArrowRight, Building2, FileText, Laptop, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { LinkButton, PlaceholderTag, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Business Device Care & Fleet Repairs",
  description: "Priority repairs, consolidated invoicing and planned device pickup for companies and teams in Prague.",
};

const b2bFeatures = [
  { icon: Laptop, title: "Fleet repairs", text: "iPhone, MacBook and multi-brand device support." },
  { icon: Truck, title: "Pickup & delivery", text: "Planned collections that work around your team." },
  { icon: FileText, title: "Consolidated invoicing", text: "Clear records and simple monthly billing." },
  { icon: ShieldCheck, title: "Priority service", text: "Reserved capacity and named support." },
  { icon: Building2, title: "B2B contracts", text: "Defined workflows for growing teams." },
  { icon: PackageCheck, title: "Lifecycle support", text: "Repair-or-replace advice based on device value." },
];

export default function BusinessPage() {
  return (
    <SiteChrome>
      <div className="page-hero business-hero">
        <div className="container">
          <p className="eyebrow">
            REFORM FOR BUSINESS <PlaceholderTag />
          </p>
          <h1>Keep your team working.</h1>
          <p>Priority repairs, predictable handling and one clear point of contact for your entire device fleet.</p>
          <LinkButton href="/contact">
            Talk to business support <ArrowRight />
          </LinkButton>
        </div>
      </div>
      <Section eyebrow="BUILT FOR OPERATIONS" title="Device care that scales with you.">
        <div className="b2b-grid">
          {b2bFeatures.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>
      <section className="final-cta">
        <div className="container">
          <h2>A calmer way to manage repairs.</h2>
          <p>Tell us about your fleet and we’ll propose a service workflow.</p>
          <LinkButton href="/contact">
            Request a consultation <ArrowRight />
          </LinkButton>
        </div>
      </section>
    </SiteChrome>
  );
}
