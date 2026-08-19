"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/context";
import {
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  CheckCircle2,
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
} from "lucide-react";
import { contactInfo, brands } from "@/lib/data";
import { InteractiveDiagnostic } from "./InteractiveDiagnostic";
import { QuickRepairEstimator } from "./QuickRepairEstimator";
import { InteractiveComparison } from "./InteractiveComparison";
import { PartsTransparency } from "./PartsTransparency";
import { LabEquipment } from "./LabEquipment";
import { StudioTransitAssistant } from "./StudioTransitAssistant";
import { BoardInspector } from "./BoardInspector";
import { BrandIcon } from "./BrandIcons";

export function HomePage() {
  const { language, t } = useLanguage();

  const founderText = {
    badge: language === "cs" ? "ARTEM · HLAVNÍ INŽENÝR" : language === "ru" ? "АРТЁМ · ВЕДУЩИЙ МАСТЕР" : "ARTEM · LEAD MASTER",
    quote:
      language === "cs"
        ? "„Každé zařízení opravujeme s mikroskopickou přesností.“"
        : language === "ru"
        ? "«Каждое устройство мы восстанавливаем с микроскопической точностью.»"
        : "“Every device is treated with microscopic precision.”",
    desc:
      language === "cs"
        ? "V Reform vaše zařízení diagnostikují a opravují osobně zkušení servisní inženýři. Žádné skryté poplatky — zkontrolujeme desku, otestujeme všechny čipy a potvrdíme přesnou kalkulaci ještě před prvním šroubkem."
        : language === "ru"
        ? "В Reform ваше устройство диагностируют и ремонтируют лично опытные инженеры. Никаких скрытых наценок — мы осматриваем плату, тестируем цепи и утверждаем точную смету до первого винта."
        : "At Reform, your device is diagnosed and repaired personally by experienced electronics engineers. No hidden fees, no mystery surcharges — we inspect the motherboard, test all components, and confirm the exact quote before turning the first screw.",
    credentials: [
      language === "cs" ? "8+ let zkušeností v mikroelektronice" : language === "ru" ? "8+ лет опыта компонентного ремонта" : "8+ Years Component-Level Repair",
      language === "cs" ? "IPC-7711/7721 certifikace BGA pájení" : language === "ru" ? "IPC-7711/7721 сертификация BGA пайки" : "IPC-7711/7721 BGA Soldering Cert",
      language === "cs" ? "Bezpřachová komora pro laminaci displejů" : language === "ru" ? "Беспылевая комната для экранов" : "Class-100 Cleanroom Lamination",
      language === "cs" ? "Specializace na Apple & Unix architekturu" : language === "ru" ? "Специализация Apple & Unix архитектуры" : "Apple & Unix Logic Board Specialist",
    ],
    telegramBtn:
      language === "cs"
        ? "Konzultovat s Artemem na Telegramu"
        : language === "ru"
        ? "Написать Артёму в Telegram"
        : "Consult with Artem on Telegram",
    storyBtn:
      language === "cs"
        ? "Náš inženýrský příběh"
        : language === "ru"
        ? "О нашей лаборатории"
        : "Our Engineering Story",
  };

  return (
    <>
      {/* 1. HERO SECTION WITH CLEAN SWISS TYPOGRAPHY */}
      <section className="hero-cyber">
        <div className="container hero-cyber-grid">
          <div className="hero-cyber-copy">
            <div className="hero-badge-pill">
              <span className="live-pulse" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="hero-headline">
              {t.hero.titleStart} <br />
              <span className="gradient-text">{t.hero.titleHighlight}</span>
            </h1>

            <p className="hero-description">
              {t.hero.subtitle}
            </p>

            <div className="hero-actions-row">
              <Link href="/repair" className="button hero-main-cta">
                {t.hero.startRepair} <ArrowRight size={18} />
              </Link>
              <a
                href={contactInfo.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="button button-secondary hero-telegram-cta"
              >
                <Send size={16} /> {t.hero.chatTelegram}
              </a>
            </div>

            <div className="hero-trust-bar">
              <div className="trust-item">
                <ShieldCheck size={16} className="trust-icon" />
                <span>{t.hero.trustWarranty}</span>
              </div>
              <div className="trust-item">
                <MapPin size={16} className="trust-icon" />
                <span>{t.hero.trustLocation}</span>
              </div>
              <div className="trust-item">
                <Clock size={16} className="trust-icon" />
                <span>{t.hero.trustDiagnostics}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Manufacturer Strip with Vector Brand Logos */}
        <div className="container quick-brands-container">
          <div className="quick-brands-strip">
            <span className="quick-title">{t.hero.quickSelectTitle}</span>
            <div className="quick-brands-grid">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  href={`/repair?brand=${brand.id}`}
                  className="brand-quick-chip quick-select"
                  data-testid="quick-select-brand"
                >
                  <BrandIcon brandId={brand.id} size={16} />
                  <span>{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. INSTANT LIVE REPAIR ESTIMATOR */}
      <section className="section section-estimator">
        <div className="container">
          <QuickRepairEstimator />
        </div>
      </section>

      {/* 3. INTERACTIVE BEFORE/AFTER REPAIR RESTORATION INSPECTOR */}
      <section className="section">
        <div className="container">
          <InteractiveComparison />
        </div>
      </section>

      {/* 4. INTERACTIVE DIAGNOSTIC SYMPTOM CHECKER */}
      <section className="section">
        <div className="container">
          <InteractiveDiagnostic />
        </div>
      </section>

      {/* 4.1 INTERACTIVE COMPONENT-LEVEL BOARD & THERMAL INSPECTOR */}
      <section className="section">
        <div className="container">
          <BoardInspector />
        </div>
      </section>

      {/* 5. PARTS TRANSPARENCY & QUALITY STANDARDS */}
      <section className="section">
        <div className="container">
          <PartsTransparency />
        </div>
      </section>

      {/* 6. LABORATORY EQUIPMENT & INFRASTRUCTURE */}
      <section className="section">
        <div className="container">
          <LabEquipment />
        </div>
      </section>

      {/* 7. WORKFLOW & PROCESS */}
      <section className="section section-workflow">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.process.badge}</p>
            <h2>{t.process.title}</h2>
            <p className="section-copy">{t.process.subtitle}</p>
          </div>

          <div className="workflow-steps-grid">
            {[
              { num: "01", title: t.process.step1_title, desc: t.process.step1_desc },
              { num: "02", title: t.process.step2_title, desc: t.process.step2_desc },
              { num: "03", title: t.process.step3_title, desc: t.process.step3_desc },
              { num: "04", title: t.process.step4_title, desc: t.process.step4_desc },
            ].map(step => (
              <motion.div
                key={step.num}
                className="step-card"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="step-number">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="center-cta-wrap">
            <Link href="/repair" className="button button-large">
              {t.nav.startRepair} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. B2B / CORPORATE FLEET SECTION */}
      <section className="section">
        <div className="container">
          <div className="b2b-banner-card">
            <div className="b2b-copy-col">
              <span className="b2b-pill">{t.b2b.badge}</span>
              <h2>{t.b2b.title}</h2>
              <p>{t.b2b.subtitle}</p>
              <ul className="b2b-perks-list">
                <li><CheckCircle2 size={18} /> {t.b2b.feature1}</li>
                <li><CheckCircle2 size={18} /> {t.b2b.feature2}</li>
                <li><CheckCircle2 size={18} /> {t.b2b.feature3}</li>
                <li><CheckCircle2 size={18} /> {t.b2b.feature4}</li>
              </ul>
              <div className="b2b-actions">
                <Link href="/business" className="button">
                  {t.b2b.cta}
                </Link>
                <a
                  href={`${contactInfo.telegramUrl}?text=${encodeURIComponent("Hello! I am interested in B2B corporate device repairs.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary"
                >
                  <Send size={16} /> {t.b2b.contactManager}
                </a>
              </div>
            </div>
            <div className="b2b-visual-col">
              <div className="b2b-devices-fan">
                <Laptop size={72} />
                <Smartphone size={54} />
                <Tablet size={60} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="section section-testimonials">
        <div className="container">
          <div className="section-head text-center">
            <p className="eyebrow justify-center">{t.testimonials.badge}</p>
            <h2>{t.testimonials.title}</h2>
          </div>

          <div className="testimonials-grid">
            {[
              {
                text: t.testimonials.t1_text,
                author: t.testimonials.t1_author,
                role: t.testimonials.t1_role,
                avatar: "JN",
              },
              {
                text: t.testimonials.t2_text,
                author: t.testimonials.t2_author,
                role: t.testimonials.t2_role,
                avatar: "MV",
              },
              {
                text: t.testimonials.t3_text,
                author: t.testimonials.t3_author,
                role: t.testimonials.t3_role,
                avatar: "EP",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="testimonial-card"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="stars-row">★★★★★</div>
                <p>{item.text}</p>
                <div className="author-row">
                  <div className="author-avatar">{item.avatar}</div>
                  <div>
                    <strong>{item.author}</strong>
                    <small>{item.role}</small>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. MEET THE MASTER & LEAD TECHNICIAN */}
      <section className="section section-founder">
        <div className="container">
          <div className="founder-spotlight-card">
            <div className="founder-photo-col">
              <div className="founder-img-frame">
                <picture>
                  <source srcSet="/artem.webp" type="image/webp" />
                  <img
                    src="/artem.png"
                    alt="Artem Mikhailov — Lead Master Reform Prague"
                  />
                </picture>
              </div>
              <span className="founder-title-badge">
                <Sparkles size={11} /> {founderText.badge}
              </span>
            </div>

            <div className="founder-content-col">
              <p className="eyebrow">
                {t.nav.about || "REFORM PRAGUE 3 STUDIO"}
              </p>
              <h2>{founderText.quote}</h2>
              <p className="founder-desc-text">{founderText.desc}</p>

              <div className="founder-credentials-grid">
                {founderText.credentials.map((cred, i) => (
                  <div key={i} className="founder-cred-badge">
                    <CheckCircle2 size={13} className="cred-icon" />
                    <span>{cred}</span>
                  </div>
                ))}
              </div>

              <div className="founder-actions-row">
                <a
                  href={contactInfo.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                >
                  <Send size={15} />
                  <span>{founderText.telegramBtn}</span>
                </a>
                <Link href="/about" className="button button-secondary">
                  {founderText.storyBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. PRAGUE 3 WORKSHOP LOCATION & TRANSIT ASSISTANT */}
      <section className="section">
        <div className="container">
          <StudioTransitAssistant />
        </div>
      </section>
    </>
  );
}
