"use client";

import { ArrowRight, Building2, FileText, Laptop, PackageCheck, ShieldCheck, Truck, Send } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { PlaceholderTag, Section } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/context";
import { contactInfo } from "@/lib/data";

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

  const heroImageAlt =
    language === "cs"
      ? "Firemní servis MacBook a iPhone pro společnosti v Praze"
      : language === "ru"
      ? "Корпоративное обслуживание техники Apple, MacBook и смартфонов в Праге"
      : "Corporate MacBook and iPhone fleet maintenance in Prague";

  return (
    <SiteChrome>
      <div className="page-hero business-hero">
        <div className="container">
          <p className="eyebrow">
            {t.businessPage.badge} <PlaceholderTag />
          </p>
          <h1>{t.businessPage.title}</h1>
          <p>{t.businessPage.subtitle}</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
            <a
              href={`${contactInfo.telegramUrl}?text=${encodeURIComponent("Dobrý den, mám zájem o firemní servis / B2B spolupráci.")}`}
              target="_blank"
              rel="noreferrer"
              className="button"
            >
              <Send size={16} /> {t.businessPage.cta}
            </a>
            <a
              href={`mailto:${contactInfo.email}?subject=${encodeURIComponent("B2B Corporate Repair Request - Reform Prague")}`}
              className="button button-secondary"
            >
              {language === "cs" ? "Napsat na e-mail" : language === "ru" ? "Запрос по email" : "Email RFQ"}
            </a>
          </div>
        </div>
      </div>

      {/* Visual B2B Fleet Spotlight */}
      <section className="container" style={{ marginBottom: "40px" }}>
        <div className="b2b-visual-banner" style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          alignItems: "center",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ padding: "36px" }}>
            <span className="b2b-pill">
              {language === "cs" ? "SLA & FAKTURACE S DPH" : language === "ru" ? "SLA И ОПЛАТА ПО СЧЕТУ С НДС" : "SLA & TAX INVOICING"}
            </span>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "6px 0 12px", lineHeight: 1.25 }}>
              {language === "cs"
                ? "Kompletní servisní péče o notebooky a telefony vaší firmy."
                : language === "ru"
                ? "Комплексное сервисное обслуживание ноутбуков и смартфонов вашей компании."
                : "Full-cycle lifecycle care for your corporate device fleet."}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.55, margin: "0 0 20px" }}>
              {language === "cs"
                ? "Rychlá výměna baterií, displejů a klávesnic pro MacBook Pro, MacBook Air a iPhone. Jednotná měsíční faktura, kurýrní svoz a garance zachování firemních dat."
                : language === "ru"
                ? "Быстрая замена батарей, матриц и клавиатур для MacBook Pro, MacBook Air и iPhone. Единая ежемесячная фактура с НДС, забор курьером и гарантия конфиденциальности данных."
                : "Rapid turnaround on batteries, displays, and keyboards for MacBook Pro, MacBook Air, and iPhone. Consolidated monthly tax invoice, courier logistics, and enterprise data security."}
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "var(--ink)", fontWeight: 600 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={16} style={{ color: "var(--success)" }} />
                <span>{language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Гарантия 12 месяцев" : "12-month warranty"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Truck size={16} style={{ color: "var(--accent-blue)" }} />
                <span>{language === "cs" ? "Kurýr Praha do 60 min" : language === "ru" ? "Курьер по Праге за 60 мин" : "Prague courier 60 min"}</span>
              </div>
            </div>
          </div>
          <div style={{ height: "100%", minHeight: "260px", background: "var(--surface-2)" }}>
            <img
              src="/b2b-fleet-care.jpg"
              alt={heroImageAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </section>

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
          <a
            href={`${contactInfo.telegramUrl}?text=${encodeURIComponent("Hello! We would like to consult regarding B2B device maintenance.")}`}
            target="_blank"
            rel="noreferrer"
            className="button button-large"
          >
            <Send size={16} /> {t.businessPage.requestConsultation}
          </a>
        </div>
      </section>
    </SiteChrome>
  );
}
