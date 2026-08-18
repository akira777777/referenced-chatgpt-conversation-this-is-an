"use client";

import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { useLanguage } from "@/lib/i18n/context";

export default function FaqPage() {
  const { t } = useLanguage();

  return (
    <SiteChrome>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: t.faqPage.faqs.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
      <div className="page-hero compact">
        <div className="container">
          <p className="eyebrow">{t.faqPage.badge}</p>
          <h1>{t.faqPage.title}</h1>
          <p>{t.faqPage.subtitle}</p>
        </div>
      </div>
      <section className="section">
        <div className="container narrow faq-list">
          {t.faqPage.faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
