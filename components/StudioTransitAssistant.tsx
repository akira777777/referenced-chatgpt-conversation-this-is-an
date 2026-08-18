"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Send,
  Navigation,
  Copy,
  Check,
  Compass,
  ExternalLink,
} from "lucide-react";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

export function StudioTransitAssistant() {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"tram" | "metro" | "car" | "courier">("tram");

  const copyAddress = () => {
    navigator.clipboard.writeText(`${contactInfo.brandName}, ${contactInfo.addressFull}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const transitData = {
    tram: {
      badge: "TRAMVAJ (2 MIN CHŮZE)",
      title: language === "cs" ? "Zastávka Biskupcova" : language === "ru" ? "Остановка Biskupcova" : "Tram Stop Biskupcova",
      lines: ["9", "10", "11", "16", "19", "26"],
      desc:
        language === "cs"
          ? "Přímé spojení z Hlavního nádraží (10 min), Václavského náměstí (12 min) nebo Žižkova. Ze zastávky stačí přejít 150 metrů."
          : language === "ru"
          ? "Прямой маршрут от Главного вокзала (10 мин), Вацлавской площади (12 мин) или Пальмовки. От остановки 150 метров пешком."
          : "Direct connection from Main Station (10 min), Wenceslas Square (12 min), or Palmovka. Just a 150m walk from the platform.",
    },
    metro: {
      badge: "METRO A / B",
      title: language === "cs" ? "Trasa A (Želivského) / Trasa B (Palmovka)" : language === "ru" ? "Линия A (Želivského) / Линия B (Palmovka)" : "Line A (Želivského) / Line B (Palmovka)",
      lines: ["Metro A", "Metro B"],
      desc:
        language === "cs"
          ? "Z metra A Želivského 3 zastávky tramvají (5 min). Z metra B Palmovka 3 zastávky tramvají (6 min)."
          : language === "ru"
          ? "От станции метро A Želivského — 3 остановки на трамвае (5 мин). От метро B Palmovka — 3 остановки (6 мин)."
          : "From Metro A Želivského: 3 tram stops (5 min). From Metro B Palmovka: 3 tram stops (6 min).",
    },
    car: {
      badge: "AUTO & PARKOVÁNÍ",
      title: language === "cs" ? "Modrá & Smíšená zóna přímo před vchodem" : language === "ru" ? "Парковка прямо у входа (синяя и смешанная зоны)" : "Easy drop-off parking in front of the lab",
      lines: ["P1-0301", "Easypark"],
      desc:
        language === "cs"
          ? "Pohodlné krátkodobé zastavení pro předání přístroje přímo v ulici Biskupcova. Parkování lze uhradit přes aplikaci Lítačka nebo EasyPark."
          : language === "ru"
          ? "Удобная остановка для быстрой передачи техники прямо на ул. Biskupcova. Оплата через приложения EasyPark или PID Lítačka."
          : "Short-term drop-off parking right on Biskupcova street. Convenient payment via Lítačka or EasyPark app.",
    },
    courier: {
      badge: "KURÝR PO CELÉ PRAZE",
      title: language === "cs" ? "Vyzvednutí a doručení kurýrem" : language === "ru" ? "Курьерский забор и доставка по Праге" : "Door-to-door Prague courier",
      lines: ["Express Courier", "Zásilkovna"],
      desc:
        language === "cs"
          ? "Nemáte čas přijet osobně? Kurýr vyzvedne zařízení u vás doma nebo v kanceláři a po opravě vám ho doručí zpět."
          : language === "ru"
          ? "Нет времени приехать лично? Курьер заберет устройство из вашего дома или офиса и привезет обратно после ремонта."
          : "No time to visit in person? Our courier collects your device from your home/office and returns it restored.",
    },
  };

  const labels = {
    badge: language === "cs" ? "PRAHA 3 STUDIO & DOSTUPNOST" : language === "ru" ? "ЛАБОРАТОРИЯ В ПРАГЕ 3 И КАК ДОБРАТЬСЯ" : "PRAGUE 3 STUDIO & ACCESS",
    title: language === "cs" ? "Kde nás najdete a jak se k nám dostanete" : language === "ru" ? "Где мы находимся и как к нам добраться" : "Where to find us & directions",
    subtitle:
      language === "cs"
        ? "Centrální poloha na Žižkově, pouhé 2 minuty od tramvajové zastávky Biskupcova."
        : language === "ru"
        ? "Удобная локация на Жижкове, всего в 2 минутах от трамвайной остановки Biskupcova."
        : "Centrally located in Prague 3 Žižkov, just 2 minutes from Biskupcova tram junction.",
    copyBtn: copied
      ? language === "cs" ? "Adresa zkopírována!" : language === "ru" ? "Адрес скопирован!" : "Address Copied!"
      : language === "cs" ? "Kopírovat adresu" : language === "ru" ? "Скопировать адрес" : "Copy Address",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    waze: "Waze",
    statusOpen: language === "cs" ? "Dnes otevřeno: 09:00 – 19:00" : language === "ru" ? "Сегодня открыты: 09:00 – 19:00" : "Open Today: 09:00 – 19:00",
    fastDiag: language === "cs" ? "Expresní diagnostika na počkání" : language === "ru" ? "Экспресс-диагностика на месте" : "Express walk-in diagnostics",
  };

  return (
    <div className="transit-assistant-card">
      <div className="transit-header">
        <div className="transit-badge-row">
          <span className="transit-tag">
            <Compass size={14} /> {labels.badge}
          </span>
          <span className="transit-status-pill">
            <span className="live-pulse" />
            {labels.statusOpen}
          </span>
        </div>
        <h3>{labels.title}</h3>
        <p className="transit-sub">{labels.subtitle}</p>
      </div>

      <div className="transit-grid">
        {/* Left: Interactive Tabs & Information */}
        <div className="transit-nav-col">
          <div className="transit-tab-buttons" role="tablist">
            {(["tram", "metro", "car", "courier"] as const).map(tab => {
              const isSelected = activeTab === tab;
              const title =
                tab === "tram"
                  ? language === "cs" ? "Tramvaj" : language === "ru" ? "Трамвай" : "Tram"
                  : tab === "metro"
                  ? "Metro"
                  : tab === "car"
                  ? language === "cs" ? "Autem" : language === "ru" ? "На авто" : "By Car"
                  : language === "cs" ? "Kurýr" : language === "ru" ? "Курьер" : "Courier";

              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`transit-tab-btn ${isSelected ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{title}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="transit-details-box"
            >
              <div className="transit-badge-small">{transitData[activeTab].badge}</div>
              <h4>{transitData[activeTab].title}</h4>
              <p>{transitData[activeTab].desc}</p>

              <div className="transit-lines-strip">
                {transitData[activeTab].lines.map(line => (
                  <span key={line} className="transit-line-pill">
                    {line}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="transit-address-bar">
            <div className="address-text-group">
              <MapPin size={18} className="address-pin-icon" />
              <div>
                <strong>{contactInfo.addressFull}</strong>
                <small>{labels.fastDiag}</small>
              </div>
            </div>
            <button
              type="button"
              className={`copy-address-btn ${copied ? "copied" : ""}`}
              onClick={copyAddress}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{labels.copyBtn}</span>
            </button>
          </div>
        </div>

        {/* Right: Interactive Navigation Launchers */}
        <div className="transit-maps-col">
          <div className="map-launch-card">
            <div className="map-launch-header">
              <Navigation size={22} className="map-nav-icon" />
              <div>
                <strong>{contactInfo.brandName} Prague Lab</strong>
                <small>Biskupcova 31, Praha 3</small>
              </div>
            </div>

            <div className="map-links-stack">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Biskupcova+31+Praha"
                target="_blank"
                rel="noreferrer"
                className="map-nav-link google-maps"
              >
                <span>{labels.googleMaps}</span>
                <ExternalLink size={14} />
              </a>

              <a
                href="https://maps.apple.com/?address=Biskupcova%2031,%20Praha,%20Czechia"
                target="_blank"
                rel="noreferrer"
                className="map-nav-link apple-maps"
              >
                <span>{labels.appleMaps}</span>
                <ExternalLink size={14} />
              </a>

              <a
                href="https://waze.com/ul?q=Biskupcova%2031%20Praha"
                target="_blank"
                rel="noreferrer"
                className="map-nav-link waze-maps"
              >
                <span>{labels.waze}</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="direct-chat-mini-prompt">
              <Send size={15} />
              <a href={contactInfo.telegramUrl} target="_blank" rel="noreferrer">
                Telegram: <b>{contactInfo.telegram}</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
