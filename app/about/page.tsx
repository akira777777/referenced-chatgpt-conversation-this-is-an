"use client";

import { Send, Microscope, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { PlaceholderTag, Section } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/context";
import { contactInfo } from "@/lib/data";
import { LabEquipment } from "@/components/LabEquipment";
import { PartsTransparency } from "@/components/PartsTransparency";

export default function AboutPage() {
  const { t, language } = useLanguage();

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

      {/* Founder & Lead Master Section */}
      <section className="founder-profile-section container" style={{ padding: "10px 0 40px" }}>
        <div className="founder-card" style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          padding: "36px",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "36px",
          alignItems: "center",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div className="founder-photo-col">
            <div className="founder-img-frame">
              <picture>
                <source srcSet="/artem.webp" type="image/webp" />
                <img
                  src="/artem.png"
                  alt="Artem — Lead Engineer & Founder of Reform"
                  width={384}
                  height={512}
                  decoding="async"
                />
              </picture>
            </div>
            <span className="founder-title-badge">
              <Sparkles size={11} style={{ color: "var(--accent-blue)" }} />
              {language === "cs" ? "HLAVNÍ INŽENÝR" : language === "ru" ? "ГЛАВНЫЙ ИНЖЕНЕР" : "LEAD TECHNICIAN"}
            </span>
          </div>

          <div className="founder-bio">
            <p className="eyebrow" style={{ color: "var(--accent-blue)", marginBottom: "8px" }}>
              {language === "cs"
                ? "ZAKLADATEL & TECHNICKÝ EXPERT"
                : language === "ru"
                ? "ОСНОВАТЕЛЬ И ВЕДУЩИЙ МАСТЕР"
                : "FOUNDER & MASTER TECHNICIAN"}
            </p>
            <h2 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              {language === "cs"
                ? "Artem Mikhailov"
                : language === "ru"
                ? "Артём Михайлов"
                : "Artem Mikhailov"}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.6, marginBottom: "20px" }}>
              {language === "cs"
                ? "Zakladatel a hlavní inženýr servisního studia Reform v Praze 3. Specialista na mikropájení, obnovu základních desek po polití kapalinou a precizní výměny displejů a baterií Apple, Samsung a Google zařízení."
                : language === "ru"
                ? "Основатель и главный инженер сервисной лаборатории Reform на Жижкове (Прага 3). Специализируется на микропайке, компонентном ремонте материнских плат после залития, замене стекол и аккумуляторов Apple, Samsung и Google."
                : "Founder and chief technician at Reform device care studio in Prague 3 (Žižkov). Specializing in micro-soldering, liquid-damage board recovery, and component-level repairs for Apple, Samsung, and Google devices."}
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
              marginBottom: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--ink)", fontWeight: 600 }}>
                <Microscope size={18} style={{ color: "var(--accent-blue)" }} />
                <span>{language === "cs" ? "Mikroskopická přesnost" : language === "ru" ? "Микроскопическая пайка" : "Microscope precision"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--ink)", fontWeight: 600 }}>
                <ShieldCheck size={18} style={{ color: "var(--success)" }} />
                <span>{language === "cs" ? "Záruka až 12 měsíců" : language === "ru" ? "Гарантия до 12 месяцев" : "Up to 12 mo warranty"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--ink)", fontWeight: 600 }}>
                <MapPin size={18} style={{ color: "var(--accent-blue)" }} />
                <span>{contactInfo.addressCity}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <a
                href={contactInfo.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="button"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px" }}
              >
                <Send size={15} />
                <span>{language === "cs" ? "Napsat přímo Artemovi na Telegram" : language === "ru" ? "Написать напрямую Артёму" : "Direct Telegram with Artem"}</span>
              </a>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                {contactInfo.telegram}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Infrastructure Section */}
      <section className="section" style={{ paddingTop: "10px" }}>
        <div className="container">
          <LabEquipment />
        </div>
      </section>

      {/* Parts Transparency Section */}
      <section className="section" style={{ paddingTop: "10px" }}>
        <div className="container">
          <PartsTransparency />
        </div>
      </section>

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
          <blockquote style={{ fontSize: "22px", fontWeight: 550, lineHeight: 1.45, margin: "0 0 12px" }}>
            {t.about.manifestoQuote}
          </blockquote>
          <p style={{ color: "var(--muted)", fontSize: "13.5px", fontFamily: "var(--font-geist-mono)" }}>
            {t.about.manifestoTeam}
          </p>
        </div>
      </section>
    </SiteChrome>
  );
}
