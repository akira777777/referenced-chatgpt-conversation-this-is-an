"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/context";
import {
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  CheckCircle2,
  Microscope,
  Award,
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
} from "lucide-react";
import { contactInfo, brands } from "@/lib/data";
import { InteractiveDiagnostic } from "./InteractiveDiagnostic";
import { QuickRepairEstimator } from "./QuickRepairEstimator";
import { StudioTransitAssistant } from "./StudioTransitAssistant";
import { BrandIcon } from "./BrandIcons";

export function HomePage() {
  const { language, t } = useLanguage();

  const featureCards = [
    {
      icon: Microscope,
      title: t.features.f1_title,
      desc: t.features.f1_desc,
      tag: language === "cs" ? "Přesnost 0,02 mm" : language === "ru" ? "Точность 0,02 мм" : "0.02mm BGA Precision",
    },
    {
      icon: Award,
      title: t.features.f2_title,
      desc: t.features.f2_desc,
      tag: language === "cs" ? "TrueTone & Biometrie" : language === "ru" ? "TrueTone и биометрия" : "TrueTone & Biometrics",
    },
    {
      icon: Zap,
      title: t.features.f3_title,
      desc: t.features.f3_desc,
      tag: language === "cs" ? "Expresně 20–40 min" : language === "ru" ? "Экспресс 20–40 мин" : "Express 20-40 min",
    },
    {
      icon: ShieldCheck,
      title: t.features.f4_title,
      desc: t.features.f4_desc,
      tag: language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Гарантия 12 месяцев" : "12-Month Guarantee",
    },
  ];

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
      {/* 1. HERO SECTION WITH HOLOGRAPHIC 3D DEVICE STAGE */}
      <section className="hero-cyber">
        <div className="hero-glow-back" />
        <div className="container hero-cyber-grid">
          <div className="hero-cyber-copy">
            <motion.div
              className="hero-badge-pill"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="live-pulse" />
              <span>{t.hero.badge}</span>
            </motion.div>

            <motion.h1
              className="hero-headline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t.hero.titleStart} <br />
              <span className="gradient-text">{t.hero.titleHighlight}</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              className="hero-actions-row"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
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
            </motion.div>

            <motion.div
              className="hero-trust-bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
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
            </motion.div>
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

      {/* 3. INTERACTIVE DIAGNOSTIC SYMPTOM CHECKER */}
      <section className="section">
        <div className="container">
          <InteractiveDiagnostic />
        </div>
      </section>

      {/* 5. ENGINEERING HIGHLIGHTS / BENTO GRID */}
      <section className="section">
        <div className="container">
          <div className="section-head text-center">
            <p className="eyebrow justify-center">
              <Microscope size={14} /> {t.features.badge}
            </p>
            <h2>{t.features.title}</h2>
            <p className="section-copy centered">{t.features.subtitle}</p>
          </div>

          <div className="features-bento-grid">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  className="bento-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="bento-top-row">
                    <div className="bento-icon-wrap">
                      <Icon size={24} />
                    </div>
                    <span className="bento-tag">{feat.tag}</span>
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                  <div className="bento-corner-glow" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. WORKFLOW & PROCESS */}
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
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                className="step-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
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

      {/* 7. B2B / CORPORATE FLEET SECTION */}
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
                <Link href="/business" className="button b2b-btn-white">
                  {t.b2b.cta}
                </Link>
                <a
                  href={`${contactInfo.telegramUrl}?text=${encodeURIComponent("Hello! I am interested in B2B corporate device repairs.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary b2b-btn-outline"
                >
                  <Send size={16} /> {t.b2b.contactManager}
                </a>
              </div>
            </div>
            <div className="b2b-visual-col">
              <div className="b2b-devices-fan">
                <Laptop size={72} className="b2b-icon laptop" />
                <Smartphone size={54} className="b2b-icon phone" />
                <Tablet size={60} className="b2b-icon tablet" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
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

      {/* 9. MEET THE MASTER & LEAD TECHNICIAN */}
      <section className="section section-founder">
        <div className="container">
          <motion.div
            className="founder-spotlight-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* 10. PRAGUE 3 WORKSHOP LOCATION & TRANSIT ASSISTANT */}
      <section className="section">
        <div className="container">
          <StudioTransitAssistant />
        </div>
      </section>
    </>
  );
}
