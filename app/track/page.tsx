"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  Search,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Laptop,
} from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { Button, PlaceholderTag } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/context";

export default function TrackPage() {
  const { language, t } = useLanguage();
  const [id, setId] = useState("REP-240182");
  const router = useRouter();

  const presets = [
    {
      id: "REP-240182",
      device: "iPhone 15 Pro",
      repair: language === "cs" ? "Výměna OLED displeje" : language === "ru" ? "Замена OLED экрана" : "OLED Display replacement",
      status: language === "cs" ? "Testování & TrueTone" : language === "ru" ? "Тестирование и TrueTone" : "Testing & TrueTone",
      progress: "85%",
      icon: Smartphone,
      accent: "cyan",
    },
    {
      id: "REP-240181",
      device: "MacBook Air M2",
      repair: language === "cs" ? "Záchrana po polití kapalinou" : language === "ru" ? "Сушка платы после залития" : "Liquid damage recovery",
      status: language === "cs" ? "Připraveno k vyzvednutí" : language === "ru" ? "Готово к выдаче" : "Ready for Pickup",
      progress: "100%",
      icon: Laptop,
      accent: "emerald",
    },
    {
      id: "REP-240180",
      device: "Galaxy S24 Ultra",
      repair: language === "cs" ? "Výměna 0-cykl baterie" : language === "ru" ? "Замена аккумулятора 0 циклов" : "0-Cycle Battery Replacement",
      status: language === "cs" ? "Diagnostika obvodů" : language === "ru" ? "Диагностика цепей" : "Diagnostics & BMS",
      progress: "40%",
      icon: Smartphone,
      accent: "blue",
    },
  ];

  const trackLabels = {
    quickDemoTitle:
      language === "cs"
        ? "Ukázky sledování v reálném čase (klikněte pro náhled):"
        : language === "ru"
        ? "Примеры отслеживания в реальном времени (нажмите для просмотра):"
        : "Live tracking demonstrations (click to preview):",
  };

  return (
    <SiteChrome>
      <div className="track-hero">
        <div className="container narrow">
          <p className="eyebrow">
            <Activity size={14} /> {t.trackPage.badge} <PlaceholderTag />
          </p>
          <h1>{t.trackPage.title}</h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", marginTop: "8px" }}>{t.trackPage.subtitle}</p>

          <form
            onSubmit={e => {
              e.preventDefault();
              router.push(`/track/${id || "REP-240182"}`);
            }}
            className="track-search-form"
          >
            <Search size={20} style={{ color: "var(--muted)", flexShrink: 0 }} />
            <input
              value={id}
              onChange={e => setId(e.target.value)}
              aria-label="Repair number"
              placeholder={t.trackPage.placeholder}
            />
            <Button type="submit">
              {t.trackPage.btn} <ArrowRight size={17} />
            </Button>
          </form>

          {/* Quick Preset Cards */}
          <div className="track-presets-section">
            <p className="track-presets-title">
              <Sparkles size={13} /> {trackLabels.quickDemoTitle}
            </p>

            <div className="track-presets-grid">
              {presets.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    className="track-preset-card"
                    onClick={() => router.push(`/track/${item.id}`)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div className="preset-top-row">
                      <span className="preset-id-badge">{item.id}</span>
                      <span className={`preset-status-tag tag-${item.accent}`}>
                        {item.progress === "100%" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {item.status}
                      </span>
                    </div>

                    <div className="preset-device-row">
                      <div className="preset-icon-box">
                        <Icon size={16} />
                      </div>
                      <div>
                        <strong>{item.device}</strong>
                        <small>{item.repair}</small>
                      </div>
                    </div>

                    <div className="preset-progress-bar-wrap">
                      <div
                        className={`preset-progress-fill fill-${item.accent}`}
                        style={{ width: item.progress }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
