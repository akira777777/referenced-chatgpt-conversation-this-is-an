"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Search,
  ArrowRight,
  Clock,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  LayoutGrid,
  List,
  Sparkles,
  HelpCircle,
  X,
} from "lucide-react";
import { allModels, brands, formatRepairPrice } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import { RepairPriceCard } from "./RepairPriceCard";
import { BrandIcon, RepairIcon } from "./BrandIcons";

export function PriceExplorer() {
  const { language, lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRepairType, setSelectedRepairType] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "priceAsc" | "priceDesc" | "fastest">("popular");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const brandOptions = ["All", ...brands.map(b => b.name)];

  const repairTypes = [
    { id: "All", label: language === "cs" ? "Všechny opravy" : language === "ru" ? "Все услуги" : "All Services" },
    { id: "display", label: language === "cs" ? "Displej & Sklo" : language === "ru" ? "Дисплей и стекло" : "Display & Glass" },
    { id: "battery", label: language === "cs" ? "Baterie" : language === "ru" ? "Аккумулятор" : "Battery" },
    { id: "charging", label: language === "cs" ? "Konektor / Nabíjení" : language === "ru" ? "Разъем зарядки" : "Charging Port" },
    { id: "board", label: language === "cs" ? "Základní deska / Pájení" : language === "ru" ? "Плата / Микропайка" : "Board & Micro-soldering" },
    { id: "camera", label: language === "cs" ? "Fotoaparát" : language === "ru" ? "Камера" : "Camera" },
    { id: "glass", label: language === "cs" ? "Zadní sklo" : language === "ru" ? "Заднее стекло" : "Back Glass" },
  ];

  // Extract unique categories for active brand
  const categoryOptions = useMemo(() => {
    const available = allModels
      .filter(m => selectedBrand === "All" || m.brand === selectedBrand)
      .map(m => m.category);
    return ["All", ...Array.from(new Set(available))];
  }, [selectedBrand]);

  const rows = useMemo(() => {
    const filtered = allModels
      .filter(
        m =>
          (selectedBrand === "All" || m.brand === selectedBrand) &&
          (selectedCategory === "All" || m.category === selectedCategory) &&
          `${m.brand} ${m.name} ${m.repairs.map(r => r.name).join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
      )
      .flatMap(m =>
        m.repairs.map(r => ({
          ...r,
          model: m,
        }))
      )
      .filter(r => {
        if (selectedRepairType === "All") return true;
        const nameLower = r.name.toLowerCase();
        const idLower = (r.id || "").toLowerCase();
        if (selectedRepairType === "display") return nameLower.includes("display") || nameLower.includes("displej") || nameLower.includes("ekran") || idLower.includes("display");
        if (selectedRepairType === "battery") return nameLower.includes("battery") || nameLower.includes("baterie") || nameLower.includes("akkumul") || idLower.includes("battery");
        if (selectedRepairType === "charging") return nameLower.includes("charge") || nameLower.includes("nabíjen") || nameLower.includes("port") || idLower.includes("charging");
        if (selectedRepairType === "board") return nameLower.includes("board") || nameLower.includes("deska") || nameLower.includes("soldering") || nameLower.includes("plata") || idLower.includes("board");
        if (selectedRepairType === "camera") return nameLower.includes("camera") || nameLower.includes("foto") || nameLower.includes("kamera") || idLower.includes("camera");
        if (selectedRepairType === "glass") return nameLower.includes("back") || nameLower.includes("zadn") || nameLower.includes("zad") || idLower.includes("glass");
        return true;
      });

    // Sorting
    return filtered.sort((a, b) => {
      const priceA = a.priceFrom ?? a.exactPrice ?? a.price ?? 0;
      const priceB = b.priceFrom ?? b.exactPrice ?? b.price ?? 0;

      if (sortBy === "priceAsc") return priceA - priceB;
      if (sortBy === "priceDesc") return priceB - priceA;
      if (sortBy === "fastest") {
        const timeA = parseInt(a.estimatedDuration || a.time || "60", 10) || 60;
        const timeB = parseInt(b.estimatedDuration || b.time || "60", 10) || 60;
        return timeA - timeB;
      }
      return 0; // Default
    });
  }, [query, selectedBrand, selectedCategory, selectedRepairType, sortBy]);

  const actionColHeader =
    language === "cs" ? "Akce" : language === "ru" ? "Заказ" : "Action";

  const resultsCountText =
    language === "cs"
      ? `${rows.length} ${rows.length === 1 ? "položka" : rows.length > 1 && rows.length < 5 ? "položky" : "položek"}`
      : language === "ru"
      ? `${rows.length} ${rows.length === 1 ? "цена" : rows.length > 1 && rows.length < 5 ? "цены" : "цен"}`
      : `${rows.length} ${rows.length === 1 ? "price" : "prices"}`;

  const sortLabels = {
    popular: language === "cs" ? "Doporučené" : language === "ru" ? "По популярности" : "Recommended",
    priceAsc: language === "cs" ? "Od nejlevnějších" : language === "ru" ? "Сначала дешевле" : "Price: Low to High",
    priceDesc: language === "cs" ? "Od nejdražších" : language === "ru" ? "Сначала дороже" : "Price: High to Low",
    fastest: language === "cs" ? "Nejrychlejší" : language === "ru" ? "Самые быстрые" : "Fastest Turnaround",
  };

  return (
    <div className="price-explorer-wrapper">
      {/* 1. FILTER CONTROLS */}
      <div className="price-filters-bar">
        <label className="price-search-input" aria-label="Search devices">
          <Search size={18} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.pricing.searchPlaceholder}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <div className="brand-pill-selector" role="tablist" aria-label="Filter by brand">
          {brandOptions.map(b => {
            const isSelected = selectedBrand === b;
            return (
              <button
                key={b}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`brand-tab-pill ${isSelected ? "active" : ""}`}
                onClick={() => {
                  setSelectedBrand(b);
                  setSelectedCategory("All");
                }}
              >
                {b !== "All" && <BrandIcon brandId={b} size={14} />}
                <span>{b === "All" ? t.pricing.allBrands : b}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Repair Type Selector Ribbon */}
      <div className="repair-type-filters-row">
        <div className="repair-type-pills" role="tablist" aria-label="Filter by service type">
          {repairTypes.map(rt => {
            const isSelected = selectedRepairType === rt.id;
            return (
              <button
                key={rt.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`repair-type-pill ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedRepairType(rt.id)}
              >
                <span>{rt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="price-sort-control">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as "popular" | "priceAsc" | "priceDesc" | "fastest")}
            className="price-sort-select"
            aria-label="Sort prices"
          >
            <option value="popular">{sortLabels.popular}</option>
            <option value="priceAsc">{sortLabels.priceAsc}</option>
            <option value="priceDesc">{sortLabels.priceDesc}</option>
            <option value="fastest">{sortLabels.fastest}</option>
          </select>
        </div>
      </div>

      {/* Category Pills & View Switcher */}
      <div className="price-subfilters-row">
        <div className="category-pill-group" role="tablist" aria-label="Filter by category">
          {categoryOptions.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`category-subpill ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat === "All" ? t.pricing.filterCategoryAll : cat}</span>
              </button>
            );
          })}
        </div>

        <div className="view-mode-toggle" role="group" aria-label="View mode">
          <span className="results-count-badge">
            {resultsCountText}
          </span>
          <button
            type="button"
            className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => setViewMode("cards")}
            title={t.pricing.viewCards}
            aria-pressed={viewMode === "cards"}
          >
            <LayoutGrid size={16} />
            <span>{t.pricing.viewCards}</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title={t.pricing.viewTable}
            aria-pressed={viewMode === "table"}
          >
            <List size={16} />
            <span>{t.pricing.viewTable}</span>
          </button>
        </div>
      </div>

      {/* 2. CORE PRICING NOTICE BANNER */}
      <div className="pricing-banner-note">
        <ShieldCheck size={18} className="banner-icon" />
        <div>
          <strong>{t.pricing.partsAndLaborIncluded}</strong>
          <span> — {t.pricing.finalPriceConfirmed}</span>
        </div>
      </div>

      {/* 3. MAIN RESULTS CONTAINER */}
      {viewMode === "cards" ? (
        <motion.div
          className="repair-card-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {rows.slice(0, 48).map((r, i) => (
            <RepairPriceCard
              key={`${r.model.id}-${r.id}-${i}`}
              repair={r}
              deviceName={r.model.name}
              brandName={r.model.brand}
              brandId={r.model.brandId}
              deviceCategory={r.model.category}
              deviceId={r.model.id}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="price-table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="price-head">
            <span>{t.pricing.colDevice}</span>
            <span>{t.pricing.colCategory}</span>
            <span>{t.pricing.colTime}</span>
            <span>{t.pricing.colPrice}</span>
            <span>{actionColHeader}</span>
          </div>

          {rows.slice(0, 50).map((r, i) => {
            const formattedPrice = formatRepairPrice(r, lang, { showCca: true });
            const duration = r.estimatedDuration || r.time || "60–90 min";

            return (
              <div className="price-row" key={`${r.model.id}-${r.id}-${i}`}>
                <span className="price-device">
                  <div className="table-brand-icon">
                    <BrandIcon brandId={r.model.brandId || r.model.brand} size={16} />
                  </div>
                  <span>
                    <b>{r.model.name}</b>
                    <small>
                      <RepairIcon repairId={r.id || r.name} size={12} className="inline-repair-icon" />
                      {r.name}
                    </small>
                  </span>
                </span>

                <span className="price-cat-badge">{r.model.category}</span>

                <span className="price-timing">
                  <Clock size={13} /> ~{duration}
                </span>

                <span className="price-tag-value">
                  <b>{formattedPrice}</b>
                  <small className="inclusions-label">
                    <CheckCircle2 size={11} /> {t.pricing.partsAndLaborIncluded}
                  </small>
                </span>

                <Link
                  href={`/repair?brand=${r.model.brandId}&model=${r.model.id}`}
                  className="price-book-btn"
                  aria-label={`${t.pricing.btnBook}: ${r.name} (${r.model.name})`}
                >
                  <span>{t.pricing.btnBook}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {!rows.length && (
        <div className="empty-state">
          <Wrench size={36} />
          <strong>{t.nav.noMatch}</strong>
          <p>{t.nav.chooseOther}</p>
          <Link className="button" href="/repair">
            {t.nav.continueWithOther}
          </Link>
        </div>
      )}

      {/* 4. TRUST GUARANTEE PILLARS SECTION */}
      <section className="pricing-trust-pillars">
        <div className="pillar-header">
          <p className="eyebrow">
            <ShieldCheck size={14} /> {t.pricing.noSurpriseChargesTitle}
          </p>
          <h2>{t.pricing.noSurpriseChargesTitle}</h2>
          <p className="section-copy">{t.pricing.noSurpriseChargesDesc}</p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">
              <CheckCircle2 size={22} />
            </div>
            <h3>{t.pricing.partsAndLaborIncluded}</h3>
            <p>{t.pricing.inclusionsTitle}</p>
            <ul>
              <li>{t.pricing.inclusionsParts}</li>
              <li>{t.pricing.inclusionsLabor}</li>
              <li>{t.pricing.inclusionsTesting}</li>
            </ul>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <ShieldCheck size={22} />
            </div>
            <h3>{t.pricing.finalPriceConfirmed}</h3>
            <p>{t.pricing.pricingPhilosophyDesc}</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <Sparkles size={22} />
            </div>
            <h3>{t.pricing.diagnosticsTitle}</h3>
            <p>{t.pricing.diagnosticsDesc}</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <HelpCircle size={22} />
            </div>
            <h3>{t.pricing.qualityTiersTitle}</h3>
            <ul>
              <li><strong>Standard:</strong> {t.pricing.qualityStandard}</li>
              <li><strong>Premium:</strong> {t.pricing.qualityPremium}</li>
              <li><strong>Original:</strong> {t.pricing.qualityOriginal}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
