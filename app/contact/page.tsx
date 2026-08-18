"use client";

import { Clock3, Mail, MapPin, Navigation, Phone, Send } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { LinkButton } from "@/components/ui";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

export default function ContactPage() {
  const { t } = useLanguage();

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
    </SiteChrome>
  );
}
