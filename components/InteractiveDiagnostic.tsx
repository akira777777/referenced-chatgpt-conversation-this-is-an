"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/lib/i18n/context";
import {
  Clock,
  Wrench,
  ArrowRight,
  Send,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Cpu,
} from "lucide-react";
import {
  ScreenOledIcon,
  BatteryHealthIcon,
  ChargingPortIcon,
  LiquidDeconIcon,
  BgaMicroSolderingIcon,
  CameraOpticsIcon,
} from "./BrandIcons";
import { contactInfo } from "@/lib/data";

type SymptomKey = "screen" | "battery" | "charging" | "liquid" | "board" | "camera";

interface DiagnosticMeta {
  level: string;
  parts: string;
  protocol: string;
}

export function InteractiveDiagnostic() {
  const { language, t } = useLanguage();
  const [activeKey, setActiveKey] = useState<SymptomKey>("screen");

  const symptomsList: {
    key: SymptomKey;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    meta: DiagnosticMeta;
  }[] = [
    {
      key: "screen",
      icon: ScreenOledIcon,
      meta: {
        level: language === "cs" ? "Úroveň 1 · OEM Kalibrace" : language === "ru" ? "Уровень 1 · OEM Калибровка" : "Level 1 · OEM Calibration",
        parts: language === "cs" ? "TrueTone displej + Oleofobní sklo" : language === "ru" ? "TrueTone матрица + Олеофобное стекло" : "TrueTone Matrix + Oleophobic Glass",
        protocol: language === "cs" ? "Barevná kalibrace a přenos EEPROM dat" : language === "ru" ? "Калибровка цвета и перенос EEPROM профиля" : "Color Calibration & Display EEPROM Transfer",
      },
    },
    {
      key: "battery",
      icon: BatteryHealthIcon,
      meta: {
        level: language === "cs" ? "Úroveň 1 · Čerstvý 0-cykl článek" : language === "ru" ? "Уровень 1 · Свежая 0-цикл ячейка" : "Level 1 · 0-Cycle Fresh Cell",
        parts: language === "cs" ? "Vysokokapacitní Grade-A články" : language === "ru" ? "Высокоемкие ячейки Grade-A" : "High Capacity Grade-A Cells",
        protocol: language === "cs" ? "Spárování BMS řadiče & reset kondice" : language === "ru" ? "Привязка контроллера BMS и сброс емкости" : "BMS Controller Pairing & Battery Health Reset",
      },
    },
    {
      key: "charging",
      icon: ChargingPortIcon,
      meta: {
        level: language === "cs" ? "Úroveň 2 · Komponentní výměna" : language === "ru" ? "Уровень 2 · Замена компонента" : "Level 2 · Component Replacement",
        parts: language === "cs" ? "Originální flex dokovací kabel" : language === "ru" ? "Оригинальный шлейф зарядного порта" : "Original Flex Dock Cable",
        protocol: language === "cs" ? "Proudový test rychlého nabíjení PD/QC" : language === "ru" ? "Замер токов быстрой зарядки (PD/QC)" : "Fast Charge (PD/QC) Multi-meter Current Test",
      },
    },
    {
      key: "liquid",
      icon: LiquidDeconIcon,
      meta: {
        level: language === "cs" ? "Úroveň 3 · Ultrazvuková záchrana" : language === "ru" ? "Уровень 3 · Ультразвуковая сушка" : "Level 3 · Ultrasonic Bath Recovery",
        parts: language === "cs" ? "Antikorozní chemická dekontaminace" : language === "ru" ? "Антикоррозийный химический состав" : "Anti-Corrosion Chemical Decon",
        protocol: language === "cs" ? "Termovizní scan zkratů napájecích větví" : language === "ru" ? "Инфракрасный тепловизионный поиск КЗ" : "Power Rail Short-Circuit Infrared Thermal Scan",
      },
    },
    {
      key: "board",
      icon: BgaMicroSolderingIcon,
      meta: {
        level: language === "cs" ? "Úroveň 4 · BGA Mikropájení" : language === "ru" ? "Уровень 4 · BGA Микропайка" : "Level 4 · BGA Micro-Soldering",
        parts: language === "cs" ? "Originální SMD / Napájecí čipy PMIC" : language === "ru" ? "Оригинальные SMD / Чипы питания PMIC" : "OEM SMD / Power Management IC",
        protocol: language === "cs" ? "0,02mm mikromůstky pod mikroskopem" : language === "ru" ? "Микроперемычки 0,02 мм под микроскопом" : "0.02mm Jumper Wire Traces under Microscope",
      },
    },
    {
      key: "camera",
      icon: CameraOpticsIcon,
      meta: {
        level: language === "cs" ? "Úroveň 2 · Oprava optického senzoru" : language === "ru" ? "Уровень 2 · Замена оптического модуля" : "Level 2 · Optical Sensor Repair",
        parts: language === "cs" ? "Originální senzor a soustava čoček" : language === "ru" ? "Оригинальный сенсор и блок линз" : "Original Sensor & Lens Array",
        protocol: language === "cs" ? "Vycentrování optické stabilizace (OIS)" : language === "ru" ? "Центровка оптической стабилизации (OIS)" : "Optical Image Stabilization (OIS) Re-Centering",
      },
    },
  ];

  const activeItem = symptomsList.find(s => s.key === activeKey) || symptomsList[0];
  const currentData = t.diagnostics.symptoms[activeKey];
  const ActiveIcon = activeItem.icon;

  const labels = {
    protocolHeader: language === "cs" ? "DIAGNOSTICKÝ PROTOKOL" : language === "ru" ? "ДИАГНОСТИЧЕСКИЙ ПРОТОКОЛ" : "LAB DIAGNOSTIC PROTOCOL",
    specLabel: language === "cs" ? "Specifikace dílu:" : language === "ru" ? "Класс детали:" : "Hardware Spec:",
    protocolLabel: language === "cs" ? "Servisní postup:" : language === "ru" ? "Протокол лаборатории:" : "Lab Protocol:",
    activeBadge: language === "cs" ? "Vybráno" : language === "ru" ? "Выбрано" : "Active",
    telegramMsg:
      language === "cs"
        ? `Dobrý den! Mám zájem o diagnostiku a kalkulaci opravy: ${currentData.title} (${activeItem.meta.level}).`
        : language === "ru"
        ? `Здравствуйте! Нужна диагностика и расчет стоимости ремонта: ${currentData.title} (${activeItem.meta.level}).`
        : `Hello! I need a diagnostic estimate for ${currentData.title} (${activeItem.meta.level}).`,
  };

  return (
    <div className="diagnostic-section">
      <div className="diagnostic-header">
        <p className="eyebrow">
          <Cpu size={14} /> {t.features.badge}
        </p>
        <h2>{t.diagnostics.title}</h2>
        <p className="section-copy">{t.diagnostics.subtitle}</p>
      </div>

      <div className="diagnostic-grid">
        {/* Left: Interactive Symptom Buttons with Spring Hover & Active Glow */}
        <div className="symptom-tabs" role="tablist" aria-label="Device symptoms">
          {symptomsList.map(({ key, icon: Icon, meta }) => {
            const item = t.diagnostics.symptoms[key];
            const isSelected = activeKey === key;
            return (
              <motion.button
                key={key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`symptom-card ${isSelected ? "selected" : ""}`}
                onClick={() => setActiveKey(key)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="symptom-icon-box">
                  <Icon size={22} />
                </div>
                <div className="symptom-text">
                  <div className="symptom-title-row">
                    <strong>{item.title}</strong>
                    {isSelected && (
                      <span className="symptom-active-badge">
                        <Activity size={10} /> {labels.activeBadge}
                      </span>
                    )}
                  </div>
                  <p>{item.desc}</p>
                  <span className="symptom-tier-tag">{meta.level}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right: Real-time Telemetry & Solution Panel with Framer Motion AnimatePresence */}
        <div className="diagnostic-result-panel">
          <div className="result-glow" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="result-inner-content"
            >
              <div className="result-header">
                <div className="result-badge">
                  <ActiveIcon size={24} />
                </div>
                <div>
                  <span className="result-tag">{labels.protocolHeader}</span>
                  <h3>{currentData.title}</h3>
                  <small className="result-level-sub">{activeItem.meta.level}</small>
                </div>
              </div>

              <div className="result-metrics">
                <div className="metric-box">
                  <div className="metric-icon">
                    <Clock size={18} />
                  </div>
                  <div>
                    <small>{t.diagnostics.timeLabel}</small>
                    <strong>{currentData.time}</strong>
                  </div>
                </div>

                <div className="metric-box">
                  <div className="metric-icon">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <small>{t.diagnostics.solutionLabel}</small>
                    <span>{currentData.solution}</span>
                  </div>
                </div>
              </div>

              <div className="protocol-checklist">
                <div className="protocol-item">
                  <CheckCircle2 size={14} className="protocol-icon" />
                  <span><b>{labels.specLabel}</b> {activeItem.meta.parts}</span>
                </div>
                <div className="protocol-item">
                  <ShieldCheck size={14} className="protocol-icon" />
                  <span><b>{labels.protocolLabel}</b> {activeItem.meta.protocol}</span>
                </div>
              </div>

              <div className="pricing-disclaimer-box">
                <p>💡 {t.diagnostics.pricingNote}</p>
              </div>

              <div className="result-actions">
                <Link href={`/repair?issue=${activeKey}`} className="button result-cta">
                  {t.diagnostics.bookThis} <ArrowRight size={17} />
                </Link>
                <a
                  href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(labels.telegramMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary telegram-quick-btn"
                >
                  <Send size={16} /> Telegram {contactInfo.telegram}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
