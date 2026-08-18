"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
} from "lucide-react";
import { brands, allModels, formatRepairPrice, contactInfo, type DeviceModel, type Repair } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import { BrandIcon, RepairIcon } from "./BrandIcons";

export function QuickRepairEstimator() {
  const { lang, language, t } = useLanguage();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("apple");
  const [selectedModelId, setSelectedModelId] = useState<string>("iphone-15-pro");
  const [selectedRepairId, setSelectedRepairId] = useState<string>("display");

  // Models for selected brand
  const brandModels = useMemo(() => {
    return allModels.filter(m => (m.brandId || m.brand?.toLowerCase()) === selectedBrandId);
  }, [selectedBrandId]);

  // Active Model
  const activeModel: DeviceModel = useMemo(() => {
    return (
      brandModels.find(m => m.id === selectedModelId) ||
      brandModels[0] ||
      allModels[0]
    );
  }, [brandModels, selectedModelId]);

  // Active Repair
  const activeRepair: Repair = useMemo(() => {
    const repairs = activeModel?.repairs || [];
    return (
      repairs.find(r => r.id === selectedRepairId || r.name.toLowerCase().includes(selectedRepairId)) ||
      repairs[0] || {
        id: "display",
        name: "Display Replacement",
        description: "High-grade screen replacement",
        priceFrom: 2490,
        priceTo: 3490,
        estimatedDuration: "40–60 min",
      }
    );
  }, [activeModel, selectedRepairId]);

  const formattedPrice = formatRepairPrice(activeRepair, lang, { showCca: true });
  const duration = activeRepair.estimatedDuration || activeRepair.time || "45–60 min";

  const labels = {
    badge: language === "cs" ? "RYCHLÁ KALKULACE CENY" : language === "ru" ? "БЫСТРЫЙ РАСЧЕТ СТОИМОСТИ" : "INSTANT REPAIR ESTIMATE",
    title: language === "cs" ? "Zjistěte cenu opravy během vteřiny" : language === "ru" ? "Узнайте стоимость ремонта за 1 секунду" : "Get your repair estimate in 1 second",
    subtitle:
      language === "cs"
        ? "Vyberte značku, model a požadovaný servis. Každá cena zahrnuje náhradní díl, práci technika i finální testování."
        : language === "ru"
        ? "Выберите бренд, модель и услугу. Каждая цена уже включает оригинальную деталь, работу мастера и тестирование."
        : "Select your device and service. Every price transparently includes replacement parts, technician labor and testing.",
    step1: language === "cs" ? "1. Značka" : language === "ru" ? "1. Бренд" : "1. Brand",
    step2: language === "cs" ? "2. Model zařízení" : language === "ru" ? "2. Модель" : "2. Model",
    step3: language === "cs" ? "3. Požadovaná oprava" : language === "ru" ? "3. Неисправность" : "3. Service",
    estTotal: language === "cs" ? "Orientační cena celkem" : language === "ru" ? "Ориентировочно под ключ" : "Estimated Total (Parts & Labor)",
    bookBtn: language === "cs" ? "Objednat tento servis" : language === "ru" ? "Оформить этот ремонт" : "Book This Repair",
    telegramBtn: language === "cs" ? "Konzultovat přes Telegram" : language === "ru" ? "Уточнить в Telegram" : "Consult via Telegram",
    inclusionsTitle: language === "cs" ? "Co je vždy v ceně:" : language === "ru" ? "Всегда включено в цену:" : "Always included in the price:",
    inc1: language === "cs" ? "Kvalitní díl / displej / článek" : language === "ru" ? "Качественная деталь / дисплей / ячейка" : "OEM-grade replacement part",
    inc2: language === "cs" ? "Práce servisního inženýra" : language === "ru" ? "Работа инженера лаборатории" : "Certified technician labor",
    inc3: language === "cs" ? "Kompletní diagnostika a testy" : language === "ru" ? "Комплексная диагностика и тесты" : "Diagnostics & multi-point QA",
    inc4: language === "cs" ? "Záruka až 12 měsíců" : language === "ru" ? "Гарантия до 12 месяцев" : "Up to 12-month service warranty",
    telegramMsg:
      language === "cs"
        ? `Dobrý den! Mám zájem o opravu: ${activeModel?.name} - ${activeRepair?.name} (${formattedPrice}). Je možný termín dnes?`
        : language === "ru"
        ? `Здравствуйте! Интересует ремонт: ${activeModel?.name} — ${activeRepair?.name} (${formattedPrice}). Можно записаться на сегодня?`
        : `Hello! I would like to book a repair: ${activeModel?.name} - ${activeRepair?.name} (${formattedPrice}). Is today available?`,
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    const models = allModels.filter(m => (m.brandId || m.brand?.toLowerCase()) === brandId);
    if (models.length > 0) {
      setSelectedModelId(models[0].id);
      if (models[0].repairs.length > 0) {
        setSelectedRepairId(models[0].repairs[0].id || "display");
      }
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const model = allModels.find(m => m.id === modelId);
    if (model && model.repairs.length > 0) {
      setSelectedRepairId(model.repairs[0].id || "display");
    }
  };

  return (
    <div className="quick-estimator-card">
      <div className="estimator-glow-bg" />

      <div className="estimator-head">
        <div className="estimator-badge">
          <Zap size={14} />
          <span>{labels.badge}</span>
        </div>
        <h3>{labels.title}</h3>
        <p>{labels.subtitle}</p>
      </div>

      <div className="estimator-body-grid">
        {/* Left Column: Selectors */}
        <div className="estimator-selectors-col">
          {/* 1. Brand Selector */}
          <div className="selector-group">
            <label className="selector-label">{labels.step1}</label>
            <div className="estimator-brand-chips" role="tablist">
              {brands.map(b => {
                const isSelected = selectedBrandId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`estimator-brand-btn ${isSelected ? "active" : ""}`}
                    onClick={() => handleBrandChange(b.id)}
                  >
                    <BrandIcon brandId={b.id} size={16} />
                    <span>{b.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Model Selector */}
          <div className="selector-group">
            <label className="selector-label">{labels.step2}</label>
            <div className="estimator-models-scroll">
              {brandModels.slice(0, 8).map(m => {
                const isSelected = activeModel?.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`estimator-model-chip ${isSelected ? "active" : ""}`}
                    onClick={() => handleModelChange(m.id)}
                  >
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Repair Service Selector */}
          <div className="selector-group">
            <label className="selector-label">{labels.step3}</label>
            <div className="estimator-repairs-grid">
              {(activeModel?.repairs || []).map(r => {
                const isSelected = activeRepair?.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`estimator-repair-btn ${isSelected ? "active" : ""}`}
                    onClick={() => setSelectedRepairId(r.id)}
                  >
                    <RepairIcon repairId={r.id || r.name} size={15} />
                    <span className="repair-btn-title">{r.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Price & Inclusions Card */}
        <div className="estimator-summary-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeModel?.id}-${activeRepair?.id}`}
              className="estimator-price-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <div className="price-box-header">
                <div className="device-tag-row">
                  <span className="brand-chip-mini">
                    <BrandIcon brandId={activeModel?.brandId || selectedBrandId} size={12} />
                    {activeModel?.name}
                  </span>
                  <span className="time-chip-mini">
                    <Clock size={12} /> {duration}
                  </span>
                </div>
                <h4 className="active-service-title">{activeRepair?.name}</h4>
                <p className="active-service-desc">{activeRepair?.description}</p>
              </div>

              <div className="price-display-hero">
                <small className="price-hero-label">{labels.estTotal}</small>
                <div className="price-hero-number">{formattedPrice}</div>
                <div className="price-inclusions-badge">
                  <CheckCircle2 size={13} />
                  <span>{t.pricing.partsAndLaborIncluded}</span>
                </div>
              </div>

              <div className="estimator-inclusions-list">
                <div className="inc-item">
                  <CheckCircle2 size={13} className="inc-icon" />
                  <span>{labels.inc1}</span>
                </div>
                <div className="inc-item">
                  <CheckCircle2 size={13} className="inc-icon" />
                  <span>{labels.inc2}</span>
                </div>
                <div className="inc-item">
                  <CheckCircle2 size={13} className="inc-icon" />
                  <span>{labels.inc3}</span>
                </div>
                <div className="inc-item">
                  <ShieldCheck size={13} className="inc-icon" />
                  <span>{labels.inc4}</span>
                </div>
              </div>

              <div className="estimator-cta-stack">
                <Link
                  href={`/repair?brand=${selectedBrandId}&model=${activeModel?.id}&service=${activeRepair?.id}`}
                  className="button estimator-main-btn"
                >
                  <span>{labels.bookBtn}</span>
                  <ArrowRight size={17} />
                </Link>
                <a
                  href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(labels.telegramMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary estimator-telegram-btn"
                >
                  <Send size={15} />
                  <span>{labels.telegramBtn}</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
