"use client";

import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Sparkles, ShieldAlert, Cpu, CheckCircle2 } from "lucide-react";

export function InteractiveComparison() {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
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

  return (
    <div className="comparison-wrapper">
      <div className="comparison-card">
        <div className="comparison-copy">
          <p className="eyebrow">
            <Cpu size={14} /> {t.comparison.badge}
          </p>
          <h2>{t.comparison.title}</h2>
          <p className="section-copy">{t.comparison.subtitle}</p>

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
            <Sparkles size={16} />
            <span>Drag slider horizontally to inspect precision quality</span>
          </div>
        </div>

        {/* Interactive Split View */}
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
          {/* AFTER (Restored Layer - Full width background) */}
          <div className="stage-layer after-layer">
            <div className="mockup-screen fixed-state">
              <div className="device-notch" />
              <div className="screen-inner-glow">
                <div className="screen-logo-ring">
                  <Sparkles size={36} />
                </div>
                <strong>100%</strong>
                <small>FACTORY SPEC</small>
                <span className="calibrated-tag">CALIBRATED OLED</span>
              </div>
            </div>
            <div className="stage-label after-badge">
              <Sparkles size={13} /> {t.comparison.afterLabel}
            </div>
          </div>

          {/* BEFORE (Damaged Layer - Clipped with slider width) */}
          <div
            className="stage-layer before-layer"
            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
          >
            <div className="mockup-screen broken-state">
              <div className="device-notch" />
              <div className="screen-cracks">
                <div className="crack-line crack-1" />
                <div className="crack-line crack-2" />
                <div className="crack-line crack-3" />
                <div className="dead-pixel-cluster" />
              </div>
              <div className="screen-inner-broken">
                <ShieldAlert size={34} />
                <strong>FAULT</strong>
                <small>CRACKED & BLEEDING</small>
              </div>
            </div>
            <div className="stage-label before-badge">
              <ShieldAlert size={13} /> {t.comparison.beforeLabel}
            </div>
          </div>

          {/* Slider Handle Bar */}
          <div className="slider-divider" style={{ left: `${sliderPos}%` }}>
            <div className="slider-handle" aria-label="Comparison slider handle">
              <div className="slider-arrows">‹ ›</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
