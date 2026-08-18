"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import {
  Smartphone,
  BatteryCharging,
  Zap,
  Droplets,
  Cpu,
  Camera,
  Clock,
  Wrench,
  ArrowRight,
  Send,
} from "lucide-react";
import { contactInfo } from "@/lib/data";

type SymptomKey = "screen" | "battery" | "charging" | "liquid" | "board" | "camera";

export function InteractiveDiagnostic() {
  const { t } = useLanguage();
  const [activeKey, setActiveKey] = useState<SymptomKey>("screen");

  const symptomsList: { key: SymptomKey; icon: React.ComponentType<{ size?: number }> }[] = [
    { key: "screen", icon: Smartphone },
    { key: "battery", icon: BatteryCharging },
    { key: "charging", icon: Zap },
    { key: "liquid", icon: Droplets },
    { key: "board", icon: Cpu },
    { key: "camera", icon: Camera },
  ];

  const currentData = t.diagnostics.symptoms[activeKey];
  const ActiveIcon = symptomsList.find(s => s.key === activeKey)?.icon || Smartphone;

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
        {/* Left: Interactive Symptom Buttons */}
        <div className="symptom-tabs" role="tablist" aria-label="Device symptoms">
          {symptomsList.map(({ key, icon: Icon }) => {
            const item = t.diagnostics.symptoms[key];
            const isSelected = activeKey === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`symptom-card ${isSelected ? "selected" : ""}`}
                onClick={() => setActiveKey(key)}
              >
                <div className="symptom-icon-box">
                  <Icon size={22} />
                </div>
                <div className="symptom-text">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
                <div className="symptom-indicator" />
              </button>
            );
          })}
        </div>

        {/* Right: Real-time Telemetry & Solution Panel */}
        <div className="diagnostic-result-panel">
          <div className="result-glow" />
          <div className="result-header">
            <div className="result-badge">
              <ActiveIcon size={24} />
            </div>
            <div>
              <span className="result-tag">LAB DIAGNOSTIC PROTOCOL</span>
              <h3>{currentData.title}</h3>
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

          <div className="pricing-disclaimer-box">
            <p>💡 {t.diagnostics.pricingNote}</p>
          </div>

          <div className="result-actions">
            <Link href={`/repair?issue=${activeKey}`} className="button result-cta">
              {t.diagnostics.bookThis} <ArrowRight size={17} />
            </Link>
            <a
              href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(
                `Hello! I need a diagnostic estimate for ${currentData.title}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="button button-secondary telegram-quick-btn"
            >
              <Send size={16} /> Telegram {contactInfo.telegram}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
