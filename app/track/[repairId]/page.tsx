"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Send, Smartphone, AlertCircle, Loader2, ShieldCheck, Printer } from "lucide-react";
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
    REQUESTED: language === "cs" ? "Přijato online" : language === "ru" ? "Принято онлайн" : "Received Online",
    RECEIVED: language === "cs" ? "Zařízení v laboratoři" : language === "ru" ? "Устройство в лаборатории" : "Device in Lab",
    DIAGNOSTICS: language === "cs" ? "Diagnostika & Termovize" : language === "ru" ? "Диагностика и тепловизор" : "Diagnostics & Thermal",
    IN_PROGRESS: language === "cs" ? "Probíhá mikrooprava" : language === "ru" ? "Идет ремонт и пайка" : "Micro-Soldering & Repair",
    TESTING: language === "cs" ? "18-bodový test & TrueTone" : language === "ru" ? "18-ступенчатый тест ОТК" : "18-Point QA Testing",
    READY: language === "cs" ? "Připraveno k vyzvednutí" : language === "ru" ? "Готово к выдаче" : "Ready for Pickup",
    COMPLETED: language === "cs" ? "Předáno se zárukou" : language === "ru" ? "Выдано с гарантией" : "Completed with Warranty",
    CANCELLED: language === "cs" ? "Zrušeno" : language === "ru" ? "Отменено" : "Cancelled",
  };

  const telegramMsg =
    language === "cs"
      ? `Dobrý den! Mám dotaz k zakázce ${order?.orderId ?? repairId} (${order?.brand} ${order?.model}).`
      : language === "ru"
      ? `Здравствуйте! У меня вопрос по заказу ${order?.orderId ?? repairId} (${order?.brand} ${order?.model}).`
      : `Hello! I have a question regarding order ${order?.orderId ?? repairId} (${order?.brand} ${order?.model}).`;

  return (
    <SiteChrome>
      <div className="tracking-page container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Link href="/track" className="back-link" style={{ margin: 0 }}>
            <ArrowLeft size={16} /> {t.trackPage.backToTrack}
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="button button-secondary button-small"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
          >
            <Printer size={14} /> {language === "cs" ? "Vytisknout potvrzení" : language === "ru" ? "Печать акта" : "Print Receipt"}
          </button>
        </div>

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
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
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
                          padding: "12px",
                          background: isCurrent ? "var(--surface)" : "transparent",
                          border: isCurrent ? "1px solid var(--line-strong)" : "1px solid transparent",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: isCurrent
                              ? "var(--accent-blue)"
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
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: 14, color: "var(--ink)" }}>{statusLabels[s]}</strong>
                          {log && (
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                              <Clock size={11} style={{ display: "inline", marginRight: 4 }} />
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
                      <Smartphone size={14} /> {order.repairs.join(", ")}
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
                      <MapPin size={14} /> {contactInfo.addressFull}
                    </dd>
                  </div>
                </dl>

                {/* Direct Telegram Sync & Master Question Box */}
                <div className="notice" style={{ marginTop: "12px", background: "var(--surface)", border: "1px solid var(--line-strong)" }}>
                  <Send size={16} style={{ color: "var(--accent-blue)" }} />
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: "12.5px", color: "var(--ink)", fontWeight: 600 }}>
                      {language === "cs" ? "Dotaz k této zakázce?" : language === "ru" ? "Есть вопрос по этой заявке?" : "Questions about this order?"}
                    </p>
                    <a
                      href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(telegramMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-small"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", width: "100%", justifyContent: "center" }}
                    >
                      <Send size={13} /> {language === "cs" ? "Napsat mistrovi na Telegram" : language === "ru" ? "Спросить мастера в Telegram" : "Chat on Telegram"}
                    </a>
                  </div>
                </div>

                <div className="notice" style={{ marginTop: "10px" }}>
                  <ShieldCheck size={16} style={{ color: "var(--success)" }} />
                  <p style={{ fontSize: "12px", margin: 0 }}>
                    {language === "cs"
                      ? "Na všechny provedené práce a náhradní díly se vztahuje záruka 12 měsíců."
                      : language === "ru"
                      ? "На все выполненные работы и установленные компоненты действует гарантия 12 месяцев."
                      : "12-month full lab warranty applies to all components and labor."}
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
