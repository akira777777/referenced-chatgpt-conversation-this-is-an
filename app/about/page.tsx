"use client";

import { SiteChrome } from "@/components/SiteChrome";
import { PlaceholderTag, Section } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/context";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <SiteChrome>
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">
            {t.about.badge} <PlaceholderTag />
          </p>
          <h1>{t.about.title}</h1>
          <p>{t.about.subtitle}</p>
        </div>
      </div>
      <Section eyebrow={t.about.approachBadge} title={t.about.approachTitle}>
        <div className="editorial-grid">
          <div>
            <h3>{t.about.f1_title}</h3>
            <p>{t.about.f1_desc}</p>
          </div>
          <div>
            <h3>{t.about.f2_title}</h3>
            <p>{t.about.f2_desc}</p>
          </div>
          <div>
            <h3>{t.about.f3_title}</h3>
            <p>{t.about.f3_desc}</p>
          </div>
        </div>
      </Section>
      <section className="manifesto">
        <div className="container">
          <blockquote style={{ fontSize: "24px", fontWeight: 500, lineHeight: 1.4, margin: "0 0 12px" }}>
            {t.about.manifestoQuote}
          </blockquote>
          <p style={{ color: "var(--muted)", fontSize: "14px", fontFamily: "var(--font-geist-mono)" }}>
            {t.about.manifestoTeam}
          </p>
        </div>
      </section>
    </SiteChrome>
  );
}
