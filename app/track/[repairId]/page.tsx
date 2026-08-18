import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Send, Smartphone } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusTimeline } from "@/components/StatusTimeline";
import { DeviceGlyph, PlaceholderTag } from "@/components/ui";
import { contactInfo } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ repairId: string }> }): Promise<Metadata> {
  const { repairId } = await params;
  return {
    title: `Repair Status: ${repairId.toUpperCase()}`,
    description: `Real-time status timeline and details for repair order ${repairId.toUpperCase()}.`,
  };
}

export default async function TrackDetail({ params }: { params: Promise<{ repairId: string }> }) {
  const { repairId } = await params;
  return (
    <SiteChrome>
      <div className="tracking-page container">
        <Link href="/track" className="back-link">
          <ArrowLeft />Track another repair
        </Link>
        <div className="tracking-head">
          <div>
            <p className="eyebrow">
              REPAIR {repairId.toUpperCase()} <PlaceholderTag />
            </p>
            <h1>Repair in progress.</h1>
            <p>Your device is with a technician. We’ll notify you when testing begins.</p>
          </div>
          <span className="status-badge"><i />In progress</span>
        </div>
        <div className="tracking-grid">
          <section>
            <h2>Repair status</h2>
            <StatusTimeline />
          </section>
          <aside>
            <div className="tracking-device">
              <DeviceGlyph />
              <div>
                <small>DEVICE</small>
                <b>iPhone 15 Pro</b>
                <span><Smartphone />Display replacement</span>
              </div>
            </div>
            <dl>
              <div>
                <dt>Price</dt>
                <dd>Price on request (agreed individually)</dd>
              </div>
              <div>
                <dt>Expected</dt>
                <dd>Today, 17:00</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd><MapPin />{contactInfo.addressFull}</dd>
              </div>
            </dl>
            <div className="notice">
              <Mail />
              <p>We’ll send updates by email and SMS as soon as the device is ready.</p>
            </div>
            <div className="notice" style={{ marginTop: "10px", background: "var(--surface-2)" }}>
              <Send />
              <p>
                Questions? Message our technician directly on Telegram:{" "}
                <a href={contactInfo.telegramUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
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
