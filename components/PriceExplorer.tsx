"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, Clock, Wrench } from "lucide-react";
import { allModels, formatPrice, brands } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import { DeviceGlyph } from "./ui";

export function PriceExplorer() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const brandOptions = ["All", ...brands.map(b => b.name)];

  const rows = useMemo(() => {
    return allModels
      .filter(
        m =>
          (selectedBrand === "All" || m.brand === selectedBrand) &&
          `${m.brand} ${m.name} ${m.repairs.map(r => r.name).join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
      )
      .flatMap(m =>
        m.repairs.slice(0, 4).map(r => ({
          ...r,
          model: m,
        }))
      );
  }, [query, selectedBrand]);

  return (
    <div className="price-explorer-wrapper">
      <div className="price-filters-bar">
        <label className="price-search-input" aria-label="Search devices">
          <Search size={18} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.pricing.searchPlaceholder}
          />
        </label>

        <div className="brand-pill-selector">
          {brandOptions.map(b => (
            <button
              key={b}
              type="button"
              className={`brand-tab-pill ${selectedBrand === b ? "active" : ""}`}
              onClick={() => setSelectedBrand(b)}
            >
              {b === "All" ? t.pricing.allBrands : b}
            </button>
          ))}
        </div>
      </div>

      <div className="pricing-banner-note">
        <Sparkles size={16} />
        <span>{t.pricing.note}</span>
      </div>

      <div className="price-table">
        <div className="price-head">
          <span>{t.pricing.colDevice}</span>
          <span>{t.pricing.colCategory}</span>
          <span>{t.pricing.colTime}</span>
          <span>{t.pricing.colPrice}</span>
          <span>Action</span>
        </div>

        {rows.slice(0, 40).map((r, i) => (
          <div className="price-row" key={`${r.model.id}-${r.id}-${i}`}>
            <span className="price-device">
              <DeviceGlyph kind={r.model.category} compact />
              <span>
                <b>{r.model.name}</b>
                <small>{r.name}</small>
              </span>
            </span>

            <span className="price-cat-badge">{r.model.category}</span>

            <span className="price-timing">
              <Clock size={13} /> {r.time}
            </span>

            <span className="price-tag-value">
              <b>{formatPrice(r.price)}</b>
              <small>{t.wizard.agreedIndividually}</small>
            </span>

            <Link
              href={`/repair?brand=${r.model.brandId}&model=${r.model.id}`}
              className="price-book-btn"
              aria-label={`Book ${r.name} for ${r.model.name}`}
            >
              <span>{t.pricing.btnBook}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ))}

        {!rows.length && (
          <div className="empty-state">
            <Wrench size={32} />
            <strong>{t.nav.noMatch}</strong>
            <p>{t.nav.chooseOther}</p>
            <Link className="button" href="/repair">
              {t.nav.continueWithOther}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
