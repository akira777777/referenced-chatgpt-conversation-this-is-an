"use client";

import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/context";
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  BatteryCharging,
  Smartphone,
  Droplets,
  Zap,
  Cpu,
  Flashlight,
  Camera,
} from "lucide-react";

type RepairScenario = "screen" | "battery" | "liquid" | "port";

export function InteractiveComparison() {
  const { t, lang: language } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
  const [activeScenario, setActiveScenario] = useState<RepairScenario>("screen");
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const scenarios: { id: RepairScenario; title: { cs: string; en: string; ru: string }; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    {
      id: "screen",
      title: { cs: "OLED Displej", en: "OLED Display", ru: "OLED Дисплей" },
      icon: Smartphone,
    },
    {
      id: "battery",
      title: { cs: "Baterie 68% → 100%", en: "Battery 68% → 100%", ru: "Батарея 68% → 100%" },
      icon: BatteryCharging,
    },
    {
      id: "liquid",
      title: { cs: "Vytopení & Koroze", en: "Liquid & Corrosion", ru: "Залитие и коррозия" },
      icon: Droplets,
    },
    {
      id: "port",
      title: { cs: "Nabíjecí konektor", en: "Charging Port", ru: "Разъем зарядки" },
      icon: Zap,
    },
  ];

  const labels = {
    sliderInstruction:
      language === "ru"
        ? "Перетаскивайте ползунок для сравнения"
        : language === "cs"
        ? "Posunutím posuvníku porovnejte stav"
        : "Drag the slider to compare before and after",
    dateHeader:
      language === "cs" ? "Úterý, 12. září" : language === "ru" ? "Вторник, 12 сентября" : "Tuesday, September 12",
    oledActive:
      language === "cs" ? "TrueTone & 3D Touch aktivní" : language === "ru" ? "TrueTone и 3D Touch активны" : "TrueTone & 3D Touch Active",
    calibOk:
      language === "cs" ? "Optická kalibrace v pořádku" : language === "ru" ? "Заводская калибровка в норме" : "Factory Optical Calibration OK",
    batteryHealth:
      language === "cs" ? "Kondice baterie" : language === "ru" ? "Состояние аккумулятора" : "Battery Health",
    maxCap:
      language === "cs" ? "Maximální kapacita" : language === "ru" ? "Максимальная емкость" : "Maximum Capacity",
    peakPerf:
      language === "cs" ? "Maximální výkon podporován" : language === "ru" ? "Пиковая производительность" : "Peak Performance Capability",
    batteryBms:
      language === "cs" ? "0 cyklů • Originální BMS čip" : language === "ru" ? "0 циклов • Заводской чип BMS" : "0 Cycles • OEM TI-Chip BMS",
    boardDiag:
      language === "cs" ? "Diagnostika základní desky" : language === "ru" ? "Диагностика системной платы" : "Logic Board Diagnostic",
    leakageZero:
      language === "cs" ? "Svodový proud 0,00 V" : language === "ru" ? "Ток утечки 0.00 В" : "0.00V Leakage",
    deconDone:
      language === "cs" ? "Ultrazvuková dekontaminace hotova" : language === "ru" ? "Ультразвуковая сушка завершена" : "Ultrasonic Decontamination Complete",
    chargingSub:
      language === "cs" ? "Systém napájení" : language === "ru" ? "Система питания и зарядки" : "Charging Subsystem",
    fastCharge:
      language === "cs" ? "30W Rychlé nabíjení" : language === "ru" ? "30W Быстрая зарядка" : "30W Fast Charge",
    pdOk:
      language === "cs" ? "Protokol Power Delivery v normě" : language === "ru" ? "Протокол Power Delivery в норме" : "Power Delivery Protocol OK",
    shatteredTitle:
      language === "cs" ? "ROZBITÝ DISPLEJ" : language === "ru" ? "РАЗБИТЫЙ ЭКРАН" : "SHATTERED DISPLAY",
    touchUnresponsive:
      language === "cs" ? "Dotyková vrstva nereaguje" : language === "ru" ? "Тачскрин не отвечает" : "Touch Digitizer Unresponsive",
    degradedState:
      language === "cs" ? "Degradovaný stav" : language === "ru" ? "Изношенное состояние" : "Degraded State",
    serviceRec:
      language === "cs" ? "Doporučen servis" : language === "ru" ? "Сервисное обслуживание" : "Service Recommended",
    severeDeg:
      language === "cs" ? "Kritický pokles kapacity" : language === "ru" ? "Критический износ и падение частот" : "Severe Degradation & Throttling",
    unexpectedShutdowns:
      language === "cs" ? "Hlášena náhlá vypínání v zátěži" : language === "ru" ? "Устройство внезапно выключается" : "Unexpected Shutdowns Reported",
    corrosionTitle:
      language === "cs" ? "KOROZE A ZKRAT" : language === "ru" ? "КОРРОЗИЯ И КОРОТКОЕ ЗАМЫКАНИЕ" : "CORROSION & SHORT",
    pmicFail:
      language === "cs" ? "Závada napájecích větví PMIC" : language === "ru" ? "Сбой цепей питания PMIC" : "PMIC Power Rail Failure",
    noConn:
      language === "cs" ? "Bez spojení" : language === "ru" ? "Нет соединения" : "No Connection",
    notCharging:
      language === "cs" ? "Nenabíjí se" : language === "ru" ? "Нет зарядки" : "Not Charging",
    pinCorrosion:
      language === "cs" ? "Uvolněné kontakty a koroze pinů" : language === "ru" ? "Окисление пинов и люфт разъема" : "Loose Contacts & Pin Corrosion",
    cableWiggle:
      language === "cs" ? "Kabel nedrží / 0 W" : language === "ru" ? "Нужно шевелить кабель / 0 W" : "Cable Wiggle Required / 0W",
  };

  return (
    <div className="comparison-wrapper">
      <div className="comparison-card">
        {/* Header copy */}
        <div className="comparison-copy">
          <p className="eyebrow">
            <Cpu size={14} /> {t.comparison.badge}
          </p>
          <h2>{t.comparison.title}</h2>
          <p className="section-copy">{t.comparison.subtitle}</p>

          {/* Scenario Switcher Tabs */}
          <div className="comparison-tabs" role="tablist" aria-label="Select repair scenario">
            {scenarios.map(sc => {
              const Icon = sc.icon;
              const isSelected = activeScenario === sc.id;
              const titleText = sc.title[language as "cs" | "en" | "ru"] || sc.title.en;
              return (
                <button
                  key={sc.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`comparison-tab-btn ${isSelected ? "active" : ""}`}
                  onClick={() => setActiveScenario(sc.id)}
                >
                  <Icon size={15} />
                  <span>{titleText}</span>
                </button>
              );
            })}
          </div>

          <ul className="comparison-perks">
            <li>
              <CheckCircle2 size={18} />
              <span>{t.comparison.item1}</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>{t.comparison.item2}</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>{t.comparison.item3}</span>
            </li>
          </ul>

          <div className="slider-instruction">
            <Sliders size={16} />
            <span>{labels.sliderInstruction}</span>
          </div>
        </div>

        {/* Interactive Split View Stage */}
        <div
          ref={containerRef}
          role="slider"
          aria-label="Comparison image slider"
          aria-valuenow={sliderPos}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "ArrowLeft") setSliderPos(p => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setSliderPos(p => Math.min(100, p + 5));
          }}
          className="comparison-stage"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={() => (isDragging.current = true)}
          onMouseUp={() => (isDragging.current = false)}
          onMouseLeave={() => (isDragging.current = false)}
        >
          {/* Top Status Badges */}
          <div className="stage-top-hud">
            <div className="hud-status-card hud-status-before" style={{ opacity: sliderPos > 20 ? 1 : 0.35 }}>
              <div className="hud-card-header">
                <ShieldAlert size={15} />
                <span>{t.comparison.beforeLabel}</span>
              </div>
              <p className="hud-card-desc">
                {activeScenario === "screen" && (language === "ru" ? "Треснувшее стекло и полосы матрицы" : language === "cs" ? "Rozbité sklo a pruhy na displeji" : "Cracked glass & OLED matrix bleed")}
                {activeScenario === "battery" && (language === "ru" ? "Износ 68%, отключения на холоде" : language === "cs" ? "Kapacita 68%, náhlé vypínání" : "68% health, unexpected shutdowns")}
                {activeScenario === "liquid" && (language === "ru" ? "Окислы и короткое замыкание" : language === "cs" ? "Koroze a zkrat na desce" : "Corrosion & logic board short")}
                {activeScenario === "port" && (language === "ru" ? "Разбитый порт, нет контакта" : language === "cs" ? "Uvolněný konektor, nenabíjí" : "Loose port pins, 0W input")}
              </p>
            </div>

            <div className="hud-status-card hud-status-after" style={{ opacity: sliderPos < 80 ? 1 : 0.35 }}>
              <div className="hud-card-header">
                <Sparkles size={15} />
                <span>{t.comparison.afterLabel}</span>
              </div>
              <p className="hud-card-desc">
                {activeScenario === "screen" && (language === "ru" ? "Новый 120Hz OLED + TrueTone 100%" : language === "cs" ? "Nový 120Hz OLED + TrueTone 100%" : "New 120Hz OLED + TrueTone 100%")}
                {activeScenario === "battery" && (language === "ru" ? "100% емкость, 0 циклов, ориг. BMS" : language === "cs" ? "100% kapacita, 0 cyklů, OEM BMS" : "100% capacity, 0 cycles, OEM BMS")}
                {activeScenario === "liquid" && (language === "ru" ? "Ультразвук + восстановление дорожек" : language === "cs" ? "Ultrazvuk + oprava spojů" : "Ultrasonic clean + trace micro-soldered")}
                {activeScenario === "port" && (language === "ru" ? "Быстрая зарядка 30W PD restored" : language === "cs" ? "Rychlé nabíjení 30W PD obnoveno" : "30W Fast PD charging restored")}
              </p>
            </div>
          </div>

          {/* Central Device Chassis with Smooth Split Reveal */}
          <div className="comparison-device-chassis">
            <div className="chassis-island" />

            {/* Restored Screen Visual Base (Always underneath) */}
            <div className="screen-layer-pristine">
              <div className="screen-clock-center">
                <span className="clock-digits">09:41</span>
                <span className="clock-day">{labels.dateHeader}</span>
              </div>

              {activeScenario === "screen" && (
                <div className="lockscreen-wallpaper-glow" />
              )}

              {activeScenario === "battery" && (
                <div className="screen-visual-battery battery-full">
                  <BatteryCharging size={36} className="battery-icon-green" />
                  <b>100%</b>
                  <small>{labels.maxCap}</small>
                </div>
              )}

              {activeScenario === "liquid" && (
                <div className="screen-visual-chip chip-clean">
                  <Cpu size={36} />
                  <b>A17 PRO</b>
                  <small>{labels.leakageZero}</small>
                </div>
              )}

              {activeScenario === "port" && (
                <div className="screen-visual-port port-clean">
                  <Zap size={36} className="zap-fast" />
                  <b>30W FAST CHARGE</b>
                  <small>{labels.pdOk}</small>
                </div>
              )}

              <div className="lockscreen-bottom-bar">
                <div className="lockscreen-tool-btn"><Flashlight size={14} /></div>
                <div className="screen-dock-bar" />
                <div className="lockscreen-tool-btn"><Camera size={14} /></div>
              </div>
            </div>

            {/* Damaged Screen Visual Overlay (Clipped by slider position) */}
            <div
              className="screen-layer-damaged"
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
              <div className="screen-clock-center">
                <span className="clock-digits">09:41</span>
                <span className="clock-day">{labels.dateHeader}</span>
              </div>

              {/* Realistic Shatter Glass Fracture Overlay */}
              {activeScenario === "screen" && (
                <>
                  <svg className="svg-shatter-lines" viewBox="0 0 250 460" preserveAspectRatio="none">
                    <path
                      d="M25,50 L95,135 L170,90 L230,165 M95,135 L140,240 L75,320 L195,400 M95,135 L45,260 L15,385 M140,240 L225,270 M140,240 L115,365 L175,445"
                      stroke="rgba(255, 255, 255, 0.95)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <line x1="120" y1="0" x2="120" y2="460" stroke="#ff0055" strokeWidth="2.5" strokeOpacity="0.85" />
                    <line x1="124" y1="0" x2="124" y2="460" stroke="#00ffcc" strokeWidth="1.5" strokeOpacity="0.75" />
                    <line x1="80" y1="0" x2="80" y2="460" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
                  </svg>
                  <div className="dead-pixels-blackout" />
                </>
              )}

              {activeScenario === "battery" && (
                <div className="screen-visual-battery battery-degraded">
                  <ShieldAlert size={36} className="battery-icon-red" />
                  <b>68%</b>
                  <small>{labels.serviceRec}</small>
                </div>
              )}

              {activeScenario === "liquid" && (
                <div className="screen-visual-chip chip-corroded">
                  <Droplets size={36} className="corrosion-icon" />
                  <b>PMIC SHORT</b>
                  <small>{labels.pmicFail}</small>
                  <div className="corrosion-blob-1" />
                  <div className="corrosion-blob-2" />
                </div>
              )}

              {activeScenario === "port" && (
                <div className="screen-visual-port port-broken">
                  <Zap size={36} className="zap-broken" />
                  <b>NOT CHARGING</b>
                  <small>{labels.notCharging}</small>
                </div>
              )}

              <div className="lockscreen-bottom-bar">
                <div className="lockscreen-tool-btn text-dimmed"><Flashlight size={14} /></div>
                <div className="screen-dock-bar" />
                <div className="lockscreen-tool-btn text-dimmed"><Camera size={14} /></div>
              </div>
            </div>

            {/* Glowing Neon Slider Handle Line */}
            <div className="chassis-slider-divider" style={{ left: `${sliderPos}%` }}>
              <div className="divider-neon-line" />
              <div className="divider-handle-circle">
                <span>‹</span>
                <span>›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
