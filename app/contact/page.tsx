"use client";

import { Clock3, Mail, MapPin, Navigation, Phone, Send, Sparkles } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { LinkButton } from "@/components/ui";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

export default function ContactPage() {
  const { language, t } = useLanguage();

  const techCard = {
    badge:
      language === "cs"
        ? "HLAVNÍ INŽENÝR & ZAKLADATEL"
        : language === "ru"
        ? "ВЕДУЩИЙ МАСТЕР И ОСНОВАТЕЛЬ"
        : "LEAD MASTER & FOUNDER",
    desc:
      language === "cs"
        ? "Dostupný přímo na Telegramu pro rychlé odborné posouzení a kalkulaci opravy."
        : language === "ru"
        ? "Доступен напрямую в Telegram для быстрой оценки поломки и согласования цены."
        : "Available directly on Telegram for technical assessment and fast estimates.",
  };

  return (
    <SiteChrome>
      <div className="contact-page container">
        <div className="contact-copy">
          <p className="eyebrow">{t.contact.badge}</p>
          <h1>{t.contact.title}</h1>
          <p>{t.contact.subtitle}</p>

          <div className="contact-lines">
            <div>
              <MapPin />
              <span>
                <b>{t.contact.addressTitle}</b>
                <small>{contactInfo.addressFull}</small>
              </span>
            </div>
            <div>
              <Send />
              <span>
                <a href={contactInfo.telegramUrl} target="_blank" rel="noreferrer">
                  <b>Telegram: {contactInfo.telegram}</b>
                </a>
                <small>{t.contact.telegramDesc}</small>
              </span>
            </div>
            <div>
              <Phone />
              <span>
                <a href={`tel:${contactInfo.phoneRaw}`}>
                  <b>{contactInfo.phone}</b>
                </a>
                <small>{t.contact.phoneTitle}</small>
              </span>
            </div>
            <div>
              <Mail />
              <span>
                <a href={`mailto:${contactInfo.email}`}>
                  <b>{contactInfo.email}</b>
                </a>
                <small>{t.contact.emailTitle}</small>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <b>{t.contact.hoursTitle}</b>
                <small>{t.contact.hours}</small>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <LinkButton href="/repair">{t.nav.startRepair}</LinkButton>
            <a
              href={contactInfo.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="button button-secondary"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <Send size={16} /> {t.contact.telegramBtn}
            </a>
          </div>
        </div>

        <div className="contact-right-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Master Technician Card */}
          <div className="technician-contact-card">
            <div className="tech-avatar-box">
              <div className="tech-avatar-frame">
                <picture>
                  <source srcSet="/artem-avatar.webp" type="image/webp" />
                  <img
                    src="/artem-avatar.png"
                    alt="Artem — Lead Engineer Reform Prague"
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="tech-avatar-img"
                  />
                </picture>
              </div>
              <div className="tech-live-status">
                <span className="tech-pulse-dot" />
                <span className="tech-live-text">
                  {language === "cs" ? "Online" : language === "ru" ? "В сети" : "Online"}
                </span>
              </div>
            </div>

            <div className="tech-info-col">
              <span className="tech-role-badge">
                <Sparkles size={11} /> {techCard.badge}
              </span>
              <h3 className="tech-name">
                {language === "ru" ? "Артём Михайлов" : "Artem Mikhailov"}
              </h3>
              <p className="tech-desc">
                {techCard.desc}
              </p>
              <a
                href={contactInfo.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="tech-tg-link"
              >
                <Send size={13} /> {contactInfo.telegram}
              </a>
            </div>
          </div>

          {/* Map Card */}
          <div className="map-card">
            <div className="map-grid" />
            <span className="map-pin">
              <MapPin />
            </span>
            <div>
              <b>{contactInfo.brandName} Prague Lab</b>
              <small>{contactInfo.addressFull}</small>
              <a
                className="map-directions"
                href="https://www.google.com/maps/search/?api=1&query=Biskupcova+31+Praha"
                target="_blank"
                rel="noreferrer"
              >
                <Navigation size={15} />
                {t.contact.getDirections}
              </a>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
