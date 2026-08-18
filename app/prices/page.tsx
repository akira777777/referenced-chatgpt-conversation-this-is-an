"use client";

import { PriceExplorer } from "@/components/PriceExplorer";
import { SiteChrome } from "@/components/SiteChrome";
import { useLanguage } from "@/lib/i18n/context";
import { Cpu } from "lucide-react";

export default function PricesPage() {
  const { t } = useLanguage();

  return (
    <SiteChrome>
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">
            <Cpu size={14} /> {t.pricing.badge}
          </p>
          <h1>{t.pricing.title}</h1>
          <p>{t.pricing.subtitle}</p>
        </div>
      </div>
      <section className="section price-section">
        <div className="container">
          <PriceExplorer />
        </div>
      </section>
    </SiteChrome>
  );
}
