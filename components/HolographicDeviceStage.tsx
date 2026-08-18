"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Smartphone,
  Microscope,
} from "lucide-react";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

type StageMode = "teardown" | "diagnostics" | "craft";

export function HolographicDeviceStage() {
  const { language } = useLanguage();
  const [activeMode, setActiveMode] = useState<StageMode>("diagnostics");

  // Mouse tilt physics for 3D holographic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-180, 180], [10, -10]), {
    damping: 25,
    stiffness: 180,
  });
  const rotateY = useSpring(useTransform(mouseX, [-180, 180], [-10, 10]), {
    damping: 25,
    stiffness: 180,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const labels = {
    diagnostics: language === "cs" ? "Diagnostika" : language === "ru" ? "Диагностика" : "Diagnostics",
    teardown: language === "cs" ? "Rozborka" : language === "ru" ? "Разборка" : "Teardown",
    craft: language === "cs" ? "Mikropájení" : language === "ru" ? "Микропайка" : "BGA Lab",
    allSystemsOk: language === "cs" ? "VŠECH 18 SYSTÉMŮ V POŘÁDKU" : language === "ru" ? "ВСЕ 18 СИСТЕМ В НОРМЕ" : "ALL 18 HARDWARE SUBSYSTEMS OK",
    calloutLeftTitle: language === "cs" ? "Kalibrace OEM displeje" : language === "ru" ? "Калибровка OEM дисплея" : "OEM OLED Calibration",
    calloutLeftSub: language === "cs" ? "120Hz ProMotion & TrueTone" : language === "ru" ? "120Hz ProMotion и TrueTone" : "120Hz ProMotion & TrueTone",
    calloutRightTitle: language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Гарантия 12 месяцев" : "12-Month Guarantee",
    calloutRightSub: language === "cs" ? "Garance na úrovni čipů" : language === "ru" ? "Компонентная гарантия" : "Component-level warranty",
    layer1Title: language === "cs" ? "1. Super Retina OLED sklo" : language === "ru" ? "1. Стекло Super Retina OLED" : "1. Super Retina OLED Glass",
    layer1Sub: language === "cs" ? "0,3mm Ceramic Shield • 120Hz matrice" : language === "ru" ? "0,3 мм Ceramic Shield • 120Hz матрица" : "0.3mm Ceramic Shield • 120Hz Matrix",
    layer2Title: language === "cs" ? "2. Základní deska Logic Board" : language === "ru" ? "2. Материнская плата Logic Board" : "2. High-Density Logic Board",
    layer2Sub: language === "cs" ? "SoC procesor • Flash NAND • PMIC" : language === "ru" ? "SoC процессор • Flash NAND • PMIC" : "A-Series SoC • Flash NAND • PMIC",
    layer3Title: language === "cs" ? "3. Kalibrovaná baterie" : language === "ru" ? "3. Калиброванный аккумулятор" : "3. Calibrated Battery Cell",
    layer3Sub: language === "cs" ? "0 cyklů • Duální MOSFET ochrana" : language === "ru" ? "0 циклов • Двойная MOSFET защита" : "0 Cycles • Dual MOSFET Protection",
    layer4Title: language === "cs" ? "4. Titanové tělo šasi" : language === "ru" ? "4. Титановое шасси" : "4. Aerospace Titanium Chassis",
    layer4Sub: language === "cs" ? "Laserové sváry • Tovární IP68 těsnění" : language === "ru" ? "Лазерная сварка • Заводская IP68 проклейка" : "Laser Welded • IP68 Factory Seal",
    craftPitch: language === "cs" ? "BGA rozteč kuliček 0,01 mm" : language === "ru" ? "Шаг BGA шариков 0,01 мм" : "0.01mm Solder Ball Pitch",
    craftStat1: language === "cs" ? "Obnova přerušených spojů" : language === "ru" ? "Восстановление обрывов цепей" : "Short circuit trace restored",
    craftStat2: language === "cs" ? "Ultrazvukové čištění tavidla" : language === "ru" ? "Ультразвуковая деконтаминация" : "Ultrasonic flux decontamination",
    craftStat3: language === "cs" ? "Plná záchrana dat a NAND paměti" : language === "ru" ? "Полная сохранность данных и NAND" : "Full data & NAND intact",
    leadMaster: language === "cs" ? "Hlavní inženýr:" : language === "ru" ? "Ведущий мастер:" : "Lead Master:",
    askTelegram: language === "cs" ? "Konzultace na Telegramu" : language === "ru" ? "Консультация в Telegram" : "Ask on Telegram",
  };

  return (
    <div
      className="hero-stage-cyber"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="stage-cyber-frame"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Ambient Backlight Glow */}
        <div className="workstation-ambient-glow" />

        <div className="workstation-card">
          {/* Top Bar: Interactive Mode Switcher */}
          <div className="workstation-header">
            <div className="workstation-brand-pill">
              <span className="live-status-dot" />
              <span className="workstation-title">REFORM LAB • PRAGUE 3</span>
            </div>

            <div className="workstation-modes" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeMode === "diagnostics"}
                className={`ws-mode-btn ${activeMode === "diagnostics" ? "active" : ""}`}
                onClick={() => setActiveMode("diagnostics")}
              >
                <Activity size={13} />
                <span>{labels.diagnostics}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeMode === "teardown"}
                className={`ws-mode-btn ${activeMode === "teardown" ? "active" : ""}`}
                onClick={() => setActiveMode("teardown")}
              >
                <Layers size={13} />
                <span>{labels.teardown}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeMode === "craft"}
                className={`ws-mode-btn ${activeMode === "craft" ? "active" : ""}`}
                onClick={() => setActiveMode("craft")}
              >
                <Microscope size={13} />
                <span>{labels.craft}</span>
              </button>
            </div>
          </div>

          {/* Main Visual Display Area */}
          <div className="workstation-display-stage">
            {/* Laser Scanning Inspection Sweep */}
            <div className="scanner-sweep-beam" />

            {/* MODE 1: DIAGNOSTICS VIEW */}
            {activeMode === "diagnostics" && (
              <motion.div
                className="ws-view ws-view-diagnostics"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Center Device Visual */}
                <div className="diagnostics-phone-mockup">
                  <div className="diag-island" />
                  <div className="diag-screen-ui">
                    <div className="diag-circle-radar">
                      <div className="radar-sweep" />
                      <div className="radar-center-icon">
                        <Smartphone size={32} />
                      </div>
                    </div>

                    <div className="diag-telemetry-badge">
                      <Sparkles size={14} />
                      <span>{labels.allSystemsOk}</span>
                    </div>

                    <div className="diag-metric-grid">
                      <div className="diag-metric-box">
                        <small>TRUETONE</small>
                        <b>100%</b>
                      </div>
                      <div className="diag-metric-box">
                        <small>BATTERY</small>
                        <b>100%</b>
                      </div>
                      <div className="diag-metric-box">
                        <small>FACE ID</small>
                        <b>ALIGNED</b>
                      </div>
                      <div className="diag-metric-box">
                        <small>THERMAL</small>
                        <b>28.4°C</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Telemetry Callout: Left */}
                <div className="ws-callout ws-callout-left">
                  <div className="callout-icon-box cyan-box">
                    <Zap size={14} />
                  </div>
                  <div>
                    <b>{labels.calloutLeftTitle}</b>
                    <small>{labels.calloutLeftSub}</small>
                  </div>
                </div>

                {/* Floating Telemetry Callout: Right */}
                <div className="ws-callout ws-callout-right">
                  <div className="callout-icon-box emerald-box">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <b>{labels.calloutRightTitle}</b>
                    <small>{labels.calloutRightSub}</small>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODE 2: TEARDOWN VIEW */}
            {activeMode === "teardown" && (
              <motion.div
                className="ws-view ws-view-teardown"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="teardown-stack-3d">
                  {/* Layer 1: Screen */}
                  <div className="teardown-layer layer-display">
                    <div className="layer-tag">{labels.layer1Title}</div>
                    <div className="layer-details">{labels.layer1Sub}</div>
                  </div>

                  {/* Layer 2: Logic Board */}
                  <div className="teardown-layer layer-board">
                    <div className="layer-tag">{labels.layer2Title}</div>
                    <div className="layer-details">{labels.layer2Sub}</div>
                  </div>

                  {/* Layer 3: Battery */}
                  <div className="teardown-layer layer-battery">
                    <div className="layer-tag">{labels.layer3Title}</div>
                    <div className="layer-details">{labels.layer3Sub}</div>
                  </div>

                  {/* Layer 4: Titanium Chassis */}
                  <div className="teardown-layer layer-chassis">
                    <div className="layer-tag">{labels.layer4Title}</div>
                    <div className="layer-details">{labels.layer4Sub}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODE 3: BGA MICRO-SOLDERING CRAFT VIEW */}
            {activeMode === "craft" && (
              <motion.div
                className="ws-view ws-view-craft"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="craft-microscope-stage">
                  <div className="microscope-reticle">
                    <div className="reticle-grid" />
                    <div className="reticle-circle" />
                    <div className="reticle-crosshair-h" />
                    <div className="reticle-crosshair-v" />

                    <div className="chip-micro-target">
                      <Cpu size={36} className="target-chip-icon" />
                      <span className="chip-code">BGA-U2000</span>
                    </div>

                    <div className="micro-spec-tag">
                      <Wrench size={12} />
                      <span>{labels.craftPitch}</span>
                    </div>
                  </div>

                  <div className="craft-stats-sidebar">
                    <div className="craft-stat-row">
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>{labels.craftStat1}</span>
                    </div>
                    <div className="craft-stat-row">
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>{labels.craftStat2}</span>
                    </div>
                    <div className="craft-stat-row">
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>{labels.craftStat3}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Bar: Master Artem Status */}
          <div className="workstation-footer">
            <div className="engineer-info">
              <div className="engineer-avatar-mini">
                <picture>
                  <source srcSet="/artem-avatar.webp" type="image/webp" />
                  <img src="/artem-avatar.png" alt="Artem" width={24} height={24} />
                </picture>
              </div>
              <span>{labels.leadMaster} <b>Artem Mikhailov</b></span>
            </div>

            <a
              href={contactInfo.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-consult-link"
            >
              <span>{labels.askTelegram}</span>
              <span className="direct-handle">@{contactInfo.telegram}</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
