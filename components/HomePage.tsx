"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import {
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Wrench,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Navigation,
  Microscope,
  Award,
} from "lucide-react";
import { contactInfo, brands } from "@/lib/data";
import { InteractiveDiagnostic } from "./InteractiveDiagnostic";
import { InteractiveComparison } from "./InteractiveComparison";

export function HomePage() {
  const { t } = useLanguage();

  const brandIcons: Record<string, React.ComponentType<{ size?: number }>> = {
    apple: Smartphone,
    samsung: Smartphone,
    google: Smartphone,
    xiaomi: Smartphone,
    huawei: Smartphone,
    other: Wrench,
  };

  const featureCards = [
    {
      icon: Microscope,
      title: t.features.f1_title,
      desc: t.features.f1_desc,
    },
    {
      icon: Award,
      title: t.features.f2_title,
      desc: t.features.f2_desc,
    },
    {
      icon: Zap,
      title: t.features.f3_title,
      desc: t.features.f3_desc,
    },
    {
      icon: ShieldCheck,
      title: t.features.f4_title,
      desc: t.features.f4_desc,
    },
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="hero-cyber">
        <div className="hero-glow-back" />
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

            <p className="hero-description">{t.hero.subtitle}</p>

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

          {/* 3D Visual Stage */}
          <div className="hero-stage-cyber">
            <div className="stage-cyber-frame">
              <div className="device-showcase-card">
                <div className="scanner-beam" />
                <div className="device-floating-model">
                  <div className="device-silhouette">
                    <div className="device-bezel" />
                    <div className="device-content">
                      <Sparkles size={48} className="device-glow-icon" />
                      <div className="device-tech-text">
                        <span>REFORM LAB</span>
                        <strong>0.02mm</strong>
                        <small>MICROSCOPIC PRECISION</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating telemetry tags */}
                <div className="telemetry-badge tag-top-right">
                  <Wrench size={15} />
                  <div>
                    <b>BGA Micro-Soldering</b>
                    <small>Prague 3 Lab</small>
                  </div>
                </div>

                <div className="telemetry-badge tag-bottom-left">
                  <CheckCircle2 size={15} />
                  <div>
                    <b>Calibrated OEM Parts</b>
                    <small>TrueTone & Biometrics</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Manufacturer Strip */}
        <div className="container quick-brands-container">
          <div className="quick-brands-strip">
            <span className="quick-title">{t.hero.quickSelectTitle}</span>
            <div className="quick-brands-grid">
              {brands.map(brand => {
                const Icon = brandIcons[brand.id] || Smartphone;
                return (
                  <Link
                    key={brand.id}
                    href={`/repair?brand=${brand.id}`}
                    className="brand-quick-chip quick-select"
                    data-testid="quick-select-brand"
                  >
                    <Icon size={16} />
                    <span>{brand.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE DIAGNOSTIC SYMPTOM CHECKER */}
      <section className="section">
        <div className="container">
          <InteractiveDiagnostic />
        </div>
      </section>

      {/* 3. BEFORE / AFTER INTERACTIVE SLIDER */}
      <section className="section section-dark-accent">
        <div className="container">
          <InteractiveComparison />
        </div>
      </section>

      {/* 4. ENGINEERING HIGHLIGHTS / WHY REFORM */}
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
                <div key={idx} className="bento-card">
                  <div className="bento-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                  <div className="bento-corner-glow" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW & PROCESS */}
      <section className="section section-workflow">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.process.badge}</p>
            <h2>{t.process.title}</h2>
            <p className="section-copy">{t.process.subtitle}</p>
          </div>

          <div className="workflow-steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>{t.process.step1_title}</h3>
              <p>{t.process.step1_desc}</p>
            </div>
            <div className="step-card">
              <span className="step-number">02</span>
              <h3>{t.process.step2_title}</h3>
              <p>{t.process.step2_desc}</p>
            </div>
            <div className="step-card">
              <span className="step-number">03</span>
              <h3>{t.process.step3_title}</h3>
              <p>{t.process.step3_desc}</p>
            </div>
            <div className="step-card">
              <span className="step-number">04</span>
              <h3>{t.process.step4_title}</h3>
              <p>{t.process.step4_desc}</p>
            </div>
          </div>

          <div className="center-cta-wrap">
            <Link href="/repair" className="button button-large">
              {t.nav.startRepair} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. B2B / CORPORATE FLEET SECTION */}
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

      {/* 7. TESTIMONIALS */}
      <section className="section section-testimonials">
        <div className="container">
          <div className="section-head text-center">
            <p className="eyebrow justify-center">{t.testimonials.badge}</p>
            <h2>{t.testimonials.title}</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars-row">★★★★★</div>
              <p>{t.testimonials.t1_text}</p>
              <div className="author-row">
                <div className="author-avatar">JN</div>
                <div>
                  <strong>{t.testimonials.t1_author}</strong>
                  <small>{t.testimonials.t1_role}</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars-row">★★★★★</div>
              <p>{t.testimonials.t2_text}</p>
              <div className="author-row">
                <div className="author-avatar">MV</div>
                <div>
                  <strong>{t.testimonials.t2_author}</strong>
                  <small>{t.testimonials.t2_role}</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars-row">★★★★★</div>
              <p>{t.testimonials.t3_text}</p>
              <div className="author-row">
                <div className="author-avatar">EP</div>
                <div>
                  <strong>{t.testimonials.t3_author}</strong>
                  <small>{t.testimonials.t3_role}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRAGUE 3 WORKSHOP LOCATION & MAP */}
      <section className="section">
        <div className="container">
          <div className="contact-preview-card">
            <div className="contact-info-col">
              <p className="eyebrow">{t.contact.badge}</p>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.subtitle}</p>

              <div className="contact-details-list">
                <div className="contact-detail-item">
                  <MapPin size={20} className="detail-icon" />
                  <div>
                    <small>{t.contact.addressTitle}</small>
                    <strong>{contactInfo.addressFull}</strong>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <Clock size={20} className="detail-icon" />
                  <div>
                    <small>{t.contact.hoursTitle}</small>
                    <strong>{t.contact.hours}</strong>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <Send size={20} className="detail-icon" />
                  <div>
                    <small>{t.contact.telegramTitle}</small>
                    <a href={contactInfo.telegramUrl} target="_blank" rel="noreferrer">
                      <strong>{contactInfo.telegram}</strong> ({t.contact.telegramDesc})
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-actions-row">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Biskupcova+31+Praha"
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                >
                  <Navigation size={17} /> {t.contact.getDirections}
                </a>
                <a
                  href={contactInfo.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary"
                >
                  <Send size={16} /> {t.contact.telegramBtn}
                </a>
              </div>
            </div>

            <div className="contact-map-col">
              <div className="map-visual-container">
                <div className="map-grid-pattern" />
                <div className="map-pulse-pin">
                  <MapPin size={28} />
                </div>
                <div className="map-glass-overlay">
                  <strong>{contactInfo.brandName} Prague Lab</strong>
                  <span>{contactInfo.addressFull}</span>
                  <small>Tel: {contactInfo.phone}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
