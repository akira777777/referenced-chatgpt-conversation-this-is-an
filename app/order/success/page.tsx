"use client";

import { use } from "react";
import Link from "next/link";
import { Check, Headphones, Search, Send } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { PlaceholderTag } from "@/components/ui";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

export default function SuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = use(searchParams);
  const { t } = useLanguage();
  const orderId = id ?? "REP-240182";

  return (
    <SiteChrome>
      <div className="success-page container narrow">
        <span className="success-icon">
          <Check />
        </span>
        <p className="eyebrow">
          {t.successPage.badge} <PlaceholderTag />
        </p>
        <h1>{t.successPage.title}</h1>
        <p>{t.successPage.subtitle}</p>
        <div className="order-number">
          <span>{t.successPage.numberTitle}</span>
          <b>{orderId}</b>
          <small>{t.successPage.numberDesc}</small>
        </div>
        <div className="success-actions">
          <Link href={`/track/${orderId}`}>
            <Search /> {t.successPage.trackBtn}
          </Link>
          <a
            href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(
              `Hello! I created a repair request with order number ${orderId}.`
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <Send /> Telegram {contactInfo.telegram}
          </a>
          <Link href="/contact">
            <Headphones /> {t.successPage.supportLink}
          </Link>
        </div>
        <p style={{ fontSize: "14px", color: "var(--muted)" }}>
          {t.successPage.workshopLocation} <strong>{contactInfo.addressFull}</strong> · Tel:{" "}
          <a href={`tel:${contactInfo.phoneRaw}`}>
            <strong>{contactInfo.phone}</strong>
          </a>
        </p>
        <Link className="text-link" href="/">
          {t.successPage.returnHome}
        </Link>
      </div>
    </SiteChrome>
  );
}
