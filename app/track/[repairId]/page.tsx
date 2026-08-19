"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Mail, MapPin, Send, Smartphone, AlertCircle, Loader2 } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusTimeline } from "@/components/StatusTimeline";
import { DeviceGlyph, PlaceholderTag } from "@/components/ui";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

type OrderData = {
  orderId: string;
  status: string;
  brand: string;
  model: string;
  repairs: string[];
  deliveryMethod: string;
  appointmentSlot: string | null;
  priceAgreed: string;
  createdAt: string;
  updatedAt: string;
  customerFirstName: string;
  statusLogs: Array<{ status: string; note: string | null; loggedAt: string }>;
};

const STATUS_ORDER = [
  "REQUESTED",
  "RECEIVED",
  "DIAGNOSTICS",
  "IN_PROGRESS",
  "TESTING",
  "READY",
  "COMPLETED",
] as const;

function getStatusIndex(status: string) {
  return STATUS_ORDER.indexOf(status as (typeof STATUS_ORDER)[number]);
}

export default function TrackDetail({ params }: { params: Promise<{ repairId: string }> }) {
  const { repairId } = use(params);
  const { language, t } = useLanguage();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repairId) return;

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${repairId.toUpperCase()}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError(language === "cs" ? "Zakázka nenalezena" : language === "ru" ? "Заявка не найдена" : "Order not found");
          } else {
            setError(language === "cs" ? "Chyba při načítání" : language === "ru" ? "Ошибка загрузки" : "Failed to load order");
          }
          return;
        }
        const data = await res.json();
        setOrder(data as OrderData);
      } catch {
        setError(language === "cs" ? "Nepodařilo se načíst zakázku" : language === "ru" ? "Не удалось загрузить заявку" : "Unable to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [repairId, language]);

  const statusLabels: Record<string, string> = {
    REQUESTED: language === "cs" ? "Přijato" : language === "ru" ? "Принято" : "Received",
    RECEIVED: language === "cs" ? "Doručeno" : language === "ru" ? "Доставлено" : "Delivered",
    DIAGNOSTICS: language === "cs" ? "Diagnostika" : language === "ru" ? "Диагностика" : "Diagnostics",
    IN_PROGRESS: language === "cs" ? "Probíhá oprava" : language === "ru" ? "В ремонте" : "In Progress",
    TESTING: language === "cs" ? "Testování" : language === "ru" ? "Тестирование" : "Testing",
    READY: language === "cs" ? "Připraveno k vyzvednutí" : language === "ru" ? "Готово к выдаче" : "Ready for Pickup",
    COMPLETED: language === "cs" ? "Dokončeno" : language === "ru" ? "Завершено" : "Completed",
    CANCELLED: language === "cs" ? "Zrušeno" : language === "ru" ? "Отменено" : "Cancelled",
  };

  return (
    <SiteChrome>
      <div className="tracking-page container">
        <Link href="/track" className="back-link">
          <ArrowLeft /> {t.trackPage.backToTrack}
        </Link>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "40px 0", color: "var(--muted)" }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            {language === "cs" ? "Načítám zakázku…" : language === "ru" ? "Загружаю заявку…" : "Loading order…"}
          </div>
        )}

        {error && (
          <div className="notice" style={{ maxWidth: 500, marginTop: 24 }}>
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {order && (
          <>
            <div className="tracking-head">
              <div>
                <p className="eyebrow">
                  {t.common.repairNumber} {repairId.toUpperCase()} <PlaceholderTag />
                </p>
                <h1>{t.trackPage.detailTitle}</h1>
                <p>
                  {language === "cs" ? "Zákazník: " : language === "ru" ? "Клиент: " : "Customer: "}
                  <strong>{order.customerFirstName}</strong>
                </p>
              </div>
              <span className="status-badge">
                <i /> {statusLabels[order.status] ?? order.status}
              </span>
            </div>

            <div className="tracking-grid">
              <section>
                <h2>{t.trackPage.statusTitle}</h2>
                {/* Real status timeline from Supabase */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                  {STATUS_ORDER.filter(s => (s as string) !== "CANCELLED").map((s, i) => {
                    const currentIndex = getStatusIndex(order.status);
                    const isDone = i < currentIndex;
                    const isCurrent = s === order.status;
                    const log = order.statusLogs.findLast(l => l.status === s);

                    return (
                      <div
                        key={s}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          opacity: isDone || isCurrent ? 1 : 0.35,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: isCurrent
                              ? "var(--accent)"
                              : isDone
                              ? "var(--success, #22c55e)"
                              : "var(--surface-2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: 12,
                            color: isCurrent || isDone ? "#fff" : "var(--muted)",
                            fontWeight: 700,
                          }}
                        >
                          {isDone ? "✓" : i + 1}
                        </div>
                        <div>
                          <strong style={{ fontSize: 14 }}>{statusLabels[s]}</strong>
                          {log && (
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                              <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
                              {new Date(log.loggedAt).toLocaleString(
                                language === "cs" ? "cs-CZ" : language === "ru" ? "ru-RU" : "en-GB"
                              )}
                              {log.note && ` — ${log.note}`}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <aside>
                <div className="tracking-device">
                  <DeviceGlyph />
                  <div>
                    <small>{t.trackPage.deviceLabel}</small>
                    <b>{order.brand} {order.model}</b>
                    <span>
                      <Smartphone /> {order.repairs.join(", ")}
                    </span>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>{t.trackPage.priceLabel}</dt>
                    <dd>{order.priceAgreed}</dd>
                  </div>
                  <div>
                    <dt>{language === "cs" ? "Způsob předání" : language === "ru" ? "Способ передачи" : "Delivery Method"}</dt>
                    <dd>{order.deliveryMethod}{order.appointmentSlot ? ` (${order.appointmentSlot})` : ""}</dd>
                  </div>
                  <div>
                    <dt>{language === "cs" ? "Přijato" : language === "ru" ? "Принято" : "Created"}</dt>
                    <dd>
                      {new Date(order.createdAt).toLocaleString(
                        language === "cs" ? "cs-CZ" : language === "ru" ? "ru-RU" : "en-GB"
                      )}
                    </dd>
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
          </>
        )}

        {/* If order not found, show static timeline as fallback */}
        {!loading && !order && !error && (
          <div className="tracking-grid">
            <section>
              <h2>{t.trackPage.statusTitle}</h2>
              <StatusTimeline />
            </section>
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
