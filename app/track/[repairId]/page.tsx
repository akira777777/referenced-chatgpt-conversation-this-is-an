"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Send, Smartphone } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusTimeline } from "@/components/StatusTimeline";
import { DeviceGlyph, PlaceholderTag } from "@/components/ui";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

export default function TrackDetail({ params }: { params: Promise<{ repairId: string }> }) {
  const { repairId } = use(params);
  const { t } = useLanguage();

  return (
    <SiteChrome>
      <div className="tracking-page container">
        <Link href="/track" className="back-link">
          <ArrowLeft /> {t.trackPage.backToTrack}
        </Link>
        <div className="tracking-head">
          <div>
            <p className="eyebrow">
              {t.common.repairNumber} {repairId.toUpperCase()} <PlaceholderTag />
            </p>
            <h1>{t.trackPage.detailTitle}</h1>
            <p>{t.trackPage.detailSub}</p>
          </div>
          <span className="status-badge">
            <i /> {t.trackPage.statusBadge}
          </span>
        </div>
        <div className="tracking-grid">
          <section>
            <h2>{t.trackPage.statusTitle}</h2>
            <StatusTimeline />
          </section>
          <aside>
            <div className="tracking-device">
              <DeviceGlyph />
              <div>
                <small>{t.trackPage.deviceLabel}</small>
                <b>iPhone 15 Pro</b>
                <span>
                  <Smartphone /> Display replacement
                </span>
              </div>
            </div>
            <dl>
              <div>
                <dt>{t.trackPage.priceLabel}</dt>
                <dd>{t.trackPage.priceValue}</dd>
              </div>
              <div>
                <dt>{t.trackPage.expectedLabel}</dt>
                <dd>{t.trackPage.expectedValue}</dd>
              </div>
              <div>
                <dt>{t.trackPage.locationLabel}</dt>
                <dd>
                  <MapPin /> {contactInfo.addressFull}
                </dd>
              </div>
            </dl>
            <div className="notice">
              <Mail />
              <p>{t.trackPage.updatesNotice}</p>
            </div>
            <div className="notice" style={{ marginTop: "10px", background: "var(--surface-2)" }}>
              <Send />
              <p>
                {t.trackPage.questionsNotice}{" "}
                <a
                  href={contactInfo.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  {contactInfo.telegram}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </SiteChrome>
  );
}
