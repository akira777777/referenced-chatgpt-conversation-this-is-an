import type { Metadata } from "next";
import Link from "next/link";
import { Check, Headphones, Search, Send } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { PlaceholderTag } from "@/components/ui";
import { contactInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Repair Request Received — Reform",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const orderId = id ?? "REP-240182";

  return (
    <SiteChrome>
      <div className="success-page container narrow">
        <span className="success-icon"><Check /></span>
        <p className="eyebrow">
          REQUEST RECEIVED <PlaceholderTag />
        </p>
        <h1>Your repair is booked.</h1>
        <p>We’ll review the details, agree the price with you individually, and confirm your repair shortly.</p>
        <div className="order-number">
          <span>REPAIR NUMBER</span>
          <b>{orderId}</b>
          <small>Keep this number to track your repair status anytime.</small>
        </div>
        <div className="success-actions">
          <Link href={`/track/${orderId}`}>
            <Search />Track repair
          </Link>
          <a
            href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(`Hello! I created a repair request with order number ${orderId}.`)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Send />Telegram {contactInfo.telegram}
          </a>
          <Link href="/contact">
            <Headphones />Support & Location
          </Link>
        </div>
        <p style={{ fontSize: "14px", color: "var(--muted)" }}>
          Workshop location: <strong>{contactInfo.addressFull}</strong> · Tel: <a href={`tel:${contactInfo.phoneRaw}`}><strong>{contactInfo.phone}</strong></a>
        </p>
        <Link className="text-link" href="/">
          Return home
        </Link>
      </div>
    </SiteChrome>
  );
}
