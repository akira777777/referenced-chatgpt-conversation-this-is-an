"use client";

import { ArrowRight, Building2, FileText, Laptop, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { LinkButton, PlaceholderTag, Section } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/context";

export default function BusinessPage() {
  const { language, t } = useLanguage();

  const b2bFeatures = [
    { icon: Laptop, title: t.businessPage.f1_title, text: t.businessPage.f1_desc },
    { icon: Truck, title: t.businessPage.f2_title, text: t.businessPage.f2_desc },
    { icon: FileText, title: t.businessPage.f3_title, text: t.businessPage.f3_desc },
    { icon: ShieldCheck, title: t.businessPage.f4_title, text: t.businessPage.f4_desc },
    { icon: Building2, title: t.businessPage.f5_title, text: t.businessPage.f5_desc },
    { icon: PackageCheck, title: t.businessPage.f6_title, text: t.businessPage.f6_desc },
  ];

  const sectionEyebrow =
    language === "cs"
      ? "PRO FIREMNÍ FLOTILY"
      : language === "ru"
      ? "ДЛЯ КОРПОРАТИВНЫХ КЛИЕНТОВ"
      : "BUILT FOR OPERATIONS";

  return (
    <SiteChrome>
      <div className="page-hero business-hero">
        <div className="container">
          <p className="eyebrow">
            {t.businessPage.badge} <PlaceholderTag />
          </p>
          <h1>{t.businessPage.title}</h1>
          <p>{t.businessPage.subtitle}</p>
          <LinkButton href="/contact">
            {t.businessPage.cta} <ArrowRight />
          </LinkButton>
        </div>
      </div>
      <Section eyebrow={sectionEyebrow} title={t.businessPage.builtTitle}>
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
          <h2>{t.businessPage.finalCtaTitle}</h2>
          <p>{t.businessPage.finalCtaSub}</p>
          <LinkButton href="/contact">
            {t.businessPage.requestConsultation} <ArrowRight />
          </LinkButton>
        </div>
      </section>
    </SiteChrome>
  );
}
