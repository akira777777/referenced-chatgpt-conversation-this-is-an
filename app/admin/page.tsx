"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Clock3,
  Search,
  Wrench,
  CheckCircle2,
  PackageCheck,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import { PlaceholderTag, DeviceGlyph } from "@/components/ui";
import { allModels, formatRepairPrice, formatNumber } from "@/lib/data";

type PriceEntry = {
  id: string;
  brand: string;
  device: string;
  service: string;
  category: string;
  description: string;
  priceFrom?: number;
  priceTo?: number;
  exactPrice?: number;
  priceFormat: "range" | "from" | "approx" | "exact" | "custom";
  currency: string;
  partsIncluded: boolean;
  laborIncluded: boolean;
  installationIncluded: boolean;
  testingIncluded: boolean;
  estimatedDuration: string;
  qualityTier: "standard" | "premium" | "original" | "all";
  finalPriceRequiresConfirmation: boolean;
  availability: "in_stock" | "on_order" | "1_2_days";
  customNote?: string;
  diagnosticsPolicy: "included_if_repaired" | "free" | "standalone";
};

const initialDefaultPrices: PriceEntry[] = allModels.flatMap(m =>
  m.repairs.map(r => ({
    id: `${m.id}-${r.id}`,
    brand: m.brand,
    device: m.name,
    service: r.name,
    category: r.category || "Other",
    description: r.description || "",
    priceFrom: r.priceFrom,
    priceTo: r.priceTo,
    exactPrice: r.exactPrice,
    priceFormat: r.priceFormat || "range",
    currency: r.currency || "CZK",
    partsIncluded: r.partsIncluded ?? true,
    laborIncluded: r.laborIncluded ?? true,
    installationIncluded: r.installationIncluded ?? true,
    testingIncluded: r.testingIncluded ?? true,
    estimatedDuration: r.estimatedDuration || r.time || "60–90 min",
    qualityTier: r.qualityTier || "standard",
    finalPriceRequiresConfirmation: r.finalPriceRequiresConfirmation ?? true,
    availability: r.availability || "in_stock",
    customNote: r.customNote,
    diagnosticsPolicy: r.diagnosticsPolicy || "included_if_repaired",
  }))
);

const stats = [
  { label: "Repairs today", value: "12", icon: Wrench },
  { label: "Diagnostics", value: "4", icon: Clock3 },
  { label: "In progress", value: "7", icon: PackageCheck },
  { label: "Ready", value: "5", icon: CheckCircle2 },
];

const mockOrders = [
  ["REP-240182", "iPhone 15 Pro", "Display replacement", "In progress", "2 500–6 000 Kč"],
  ["REP-240181", "MacBook Air M2", "Battery replacement", "Diagnostics", "2 500–5 000 Kč"],
  ["REP-240180", "Galaxy S24 Ultra", "Display replacement", "Ready", "2 000–6 000 Kč"],
  ["REP-240179", "iPhone 13", "Battery replacement", "Completed", "1 490–1 790 Kč"],
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "prices" | "orders" | "policies">("prices");
  const [prices, setPrices] = useState<PriceEntry[]>(initialDefaultPrices);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [editingItem, setEditingItem] = useState<PriceEntry | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [previewLang, setPreviewLang] = useState<"cs" | "en" | "ru">("cs");

  // Fetch prices from API on load
  useEffect(() => {
    fetch("/api/admin/prices")
      .then(res => res.json())
      .then(data => {
        if (data.prices && data.prices.length > 0) {
          setPrices(data.prices);
        }
      })
      .catch((_err) => {
        // use default fallback prices
      });
  }, []);

  // Keyboard shortcut: Escape closes editing modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingItem(null);
        setIsNewModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredPrices = useMemo(() => {
    return prices.filter(p => {
      const matchesBrand = brandFilter === "All" || p.brand.toLowerCase() === brandFilter.toLowerCase();
      const matchesSearch =
        p.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [prices, brandFilter, searchQuery]);

  const handleSaveEdit = async (entry: PriceEntry) => {
    setSaveStatus("Saving...");
    try {
      const res = await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        setPrices(prev => {
          const idx = prev.findIndex(p => p.id === entry.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = entry;
            return next;
          }
          return [entry, ...prev];
        });
        setSaveStatus("Saved successfully!");
        setTimeout(() => {
          setSaveStatus(null);
          setEditingItem(null);
          setIsNewModalOpen(false);
        }, 800);
      }
    } catch (_err) {
      setSaveStatus("Save error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this price entry?")) return;
    try {
      await fetch(`/api/admin/prices?id=${id}`, { method: "DELETE" });
      setPrices(prev => prev.filter(p => p.id !== id));
    } catch (_err) {
      // ignore
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm("Reset all prices back to factory defaults?")) return;
    try {
      await fetch("/api/admin/prices?id=reset_all", { method: "DELETE" });
      setPrices(initialDefaultPrices);
    } catch (_err) {
      // ignore
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prices, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `repair_prices_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <main className="admin-page">
      {/* Sidebar Navigation */}
      <aside>
        <span className="logo light">
          <span>R</span>REFORM
        </span>
        <nav>
          <button
            type="button"
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={activeTab === "prices" ? "active" : ""}
            onClick={() => setActiveTab("prices")}
          >
            Devices & Prices
          </button>
          <button
            type="button"
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Repair Orders
          </button>
          <button
            type="button"
            className={activeTab === "policies" ? "active" : ""}
            onClick={() => setActiveTab("policies")}
          >
            Pricing Policies
          </button>
        </nav>
        <div className="admin-aside-footer">
          <small>
            Artem Admin Portal
            <br />
            Reform Prague 3 Studio
          </small>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="admin-content-area">
        <header className="admin-top-header">
          <div>
            <p className="eyebrow">
              ARTEM MANAGEMENT · PRAGUE LAB <PlaceholderTag />
            </p>
            <h1>
              {activeTab === "prices"
                ? "Repair Prices & Services"
                : activeTab === "orders"
                ? "Repair Orders Queue"
                : activeTab === "policies"
                ? "Pricing Guarantees & Policies"
                : "Service Overview"}
            </h1>
          </div>
          <div className="admin-header-actions">
            <Link href="/prices" target="_blank" className="admin-live-link">
              <Eye size={15} /> Live Price Page
            </Link>
            <div className="admin-avatar-wrap" title="Artem Mikhailov — Lead Engineer" style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--accent)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}>
              <picture>
                <source srcSet="/artem.webp" type="image/webp" />
                <img
                  src="/artem.png"
                  alt="Artem"
                  width={42}
                  height={42}
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </picture>
            </div>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="admin-stats">
              {stats.map(({ label, value, icon: Icon }) => (
                <article key={label}>
                  <span><Icon /></span>
                  <p>{label}</p>
                  <b>{value}</b>
                </article>
              ))}
            </div>

            <div className="admin-table">
              <div className="admin-table-head">
                <h2>Recent repairs & active quotes</h2>
              </div>
              {mockOrders.map(row => (
                <div key={row[0]} className="admin-order-row">
                  <b>{row[0]}</b>
                  <span>{row[1]}</span>
                  <span>{row[2]}</span>
                  <span>{row[4]}</span>
                  <span className="admin-status">{row[3]}</span>
                  <button type="button" className="admin-action-btn">Open</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 2: DEVICES & PRICES (ARTEM'S PRICING ENGINE) */}
        {activeTab === "prices" && (
          <div className="admin-pricing-manager">
            {/* Control Bar */}
            <div className="pricing-manager-controls">
              <div className="pricing-manager-filters">
                <label className="admin-search-box">
                  <Search size={16} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search device, brand or repair (e.g. iPhone 13, battery)..."
                  />
                </label>

                <div className="admin-brand-pills">
                  {["All", "Apple", "Samsung", "Google", "Xiaomi", "Huawei"].map(b => (
                    <button
                      key={b}
                      type="button"
                      className={`admin-pill ${brandFilter === b ? "active" : ""}`}
                      onClick={() => setBrandFilter(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pricing-manager-actions">
                <button
                  type="button"
                  className="button admin-btn-add"
                  onClick={() => {
                    setEditingItem({
                      id: `custom-${Date.now()}`,
                      brand: "Apple",
                      device: "iPhone 13",
                      service: "Battery replacement",
                      category: "Battery",
                      description: "Restore all-day battery life and peak performance.",
                      priceFrom: 1490,
                      priceTo: 1790,
                      priceFormat: "range",
                      currency: "CZK",
                      partsIncluded: true,
                      laborIncluded: true,
                      installationIncluded: true,
                      testingIncluded: true,
                      estimatedDuration: "60–90 min",
                      qualityTier: "standard",
                      finalPriceRequiresConfirmation: true,
                      availability: "in_stock",
                      diagnosticsPolicy: "included_if_repaired",
                    });
                    setIsNewModalOpen(true);
                  }}
                >
                  <Plus size={16} /> Add Price Entry
                </button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={handleExportJson}
                  title="Export prices as JSON"
                >
                  <Download size={15} /> Export JSON
                </button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={handleResetDefaults}
                  title="Reset to factory defaults"
                >
                  <RotateCcw size={15} /> Reset
                </button>
              </div>
            </div>

            {/* Inclusions Policy Reminder for Admin */}
            <div className="admin-inclusions-banner">
              <ShieldCheck size={18} />
              <div>
                <strong>Pricing Rule Active:</strong> Every customer-facing price must include the spare part, technician labor, installation, and basic testing.
              </div>
            </div>

            {/* Prices List Table */}
            <div className="admin-prices-table">
              <div className="prices-table-header">
                <span>Device & Brand</span>
                <span>Service & Category</span>
                <span>Approx. Price</span>
                <span>Inclusions</span>
                <span>Duration</span>
                <span>Quality Tier</span>
                <span>Actions</span>
              </div>

              {filteredPrices.map(item => {
                const formatted = item.exactPrice
                  ? `${formatNumber(item.exactPrice)} Kč`
                  : item.priceFrom && item.priceTo
                  ? `${formatNumber(item.priceFrom)}–${formatNumber(item.priceTo)} Kč`
                  : item.priceFrom
                  ? `od ${formatNumber(item.priceFrom)} Kč`
                  : "On request";

                return (
                  <div className="prices-table-row" key={item.id}>
                    <div className="table-col-device">
                      <strong>{item.device}</strong>
                      <small>{item.brand}</small>
                    </div>

                    <div className="table-col-service">
                      <span>{item.service}</span>
                      <small className="cat-badge">{item.category}</small>
                    </div>

                    <div className="table-col-price">
                      <b>{formatted}</b>
                    </div>

                    <div className="table-col-inclusions">
                      <span title="Part + Labor + Testing Included" className="inclusion-tags">
                        {item.partsIncluded && <i>Part ✓</i>}
                        {item.laborIncluded && <i>Labor ✓</i>}
                      </span>
                    </div>

                    <div className="table-col-duration">
                      <Clock size={12} /> ~{item.estimatedDuration}
                    </div>

                    <div className="table-col-tier">
                      <span className={`tier-badge tier-${item.qualityTier}`}>
                        {item.qualityTier}
                      </span>
                    </div>

                    <div className="table-col-actions">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => setEditingItem(item)}
                        title="Edit price"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDelete(item.id)}
                        title="Delete price"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {!filteredPrices.length && (
                <div className="admin-empty-table">
                  <p>No price entries match the filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === "orders" && (
          <div className="admin-table">
            <div className="admin-table-head">
              <h2>Customer Repair Orders Queue</h2>
            </div>
            {mockOrders.map(row => (
              <div key={row[0]} className="admin-order-row">
                <b>{row[0]}</b>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[4]} (Parts & Labor Included)</span>
                <span className="admin-status">{row[3]}</span>
                <button type="button" className="admin-action-btn">Manage</button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: POLICIES */}
        {activeTab === "policies" && (
          <div className="admin-policies-panel">
            <div className="policy-box">
              <h3>Pricing Transparency Mandate</h3>
              <p>1. Every price shown to customer includes spare part + labor + testing.</p>
              <p>2. No repair starts without customer approving final confirmed quote.</p>
              <p>3. If hidden damage is discovered, technician calls customer before price increase.</p>
            </div>
            <div className="policy-box">
              <h3>Diagnostics Fee Policy</h3>
              <p>Default: <strong>0–500 Kč</strong> (Credited/free if customer proceeds with repair).</p>
            </div>
          </div>
        )}

        {/* EDIT / CREATE MODAL WITH LIVE CARD PREVIEW */}
        {editingItem && (
          <div
            className="admin-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Backdrop click dismisser button */}
            <button
              type="button"
              className="admin-modal-backdrop-btn"
              aria-label="Close modal"
              onClick={() => setEditingItem(null)}
              style={{
                position: "absolute",
                inset: 0,
                background: "transparent",
                border: "none",
                cursor: "default",
                width: "100%",
                height: "100%",
              }}
            />
            <div
              className="admin-modal-drawer"
              style={{ position: "relative", zIndex: 10 }}
            >
              <div className="modal-header">
                <h2 id="modal-title">{isNewModalOpen ? "Add Repair Price" : `Edit: ${editingItem.device} — ${editingItem.service}`}</h2>
                <button type="button" onClick={() => setEditingItem(null)}>✕</button>
              </div>

              <div className="modal-body-split">
                {/* Form Fields */}
                <div className="modal-form-fields">
                  <div className="form-row-2">
                    <label>
                      <span>Brand</span>
                      <select
                        value={editingItem.brand}
                        onChange={e => setEditingItem({ ...editingItem, brand: e.target.value })}
                      >
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Google">Google</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Huawei">Huawei</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label>
                      <span>Device Model</span>
                      <input
                        value={editingItem.device}
                        onChange={e => setEditingItem({ ...editingItem, device: e.target.value })}
                        placeholder="e.g. iPhone 13"
                      />
                    </label>
                  </div>

                  <div className="form-row-2">
                    <label>
                      <span>Repair Service</span>
                      <input
                        value={editingItem.service}
                        onChange={e => setEditingItem({ ...editingItem, service: e.target.value })}
                        placeholder="e.g. Battery replacement"
                      />
                    </label>

                    <label>
                      <span>Category</span>
                      <select
                        value={editingItem.category}
                        onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                      >
                        <option value="Battery">Battery</option>
                        <option value="Display">Display</option>
                        <option value="Back Glass">Back Glass</option>
                        <option value="Charging">Charging</option>
                        <option value="Camera">Camera</option>
                        <option value="Audio">Audio / Mic</option>
                        <option value="Cleaning">Cleaning & Thermal</option>
                        <option value="Diagnostics">Diagnostics</option>
                        <option value="Board">Motherboard / Micro-soldering</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                  </div>

                  <div className="form-row-3">
                    <label>
                      <span>Price From (Kč)</span>
                      <input
                        type="number"
                        value={editingItem.priceFrom ?? ""}
                        onChange={e => setEditingItem({ ...editingItem, priceFrom: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="1490"
                      />
                    </label>

                    <label>
                      <span>Price To (Kč)</span>
                      <input
                        type="number"
                        value={editingItem.priceTo ?? ""}
                        onChange={e => setEditingItem({ ...editingItem, priceTo: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="1790"
                      />
                    </label>

                    <label>
                      <span>Exact Price (optional)</span>
                      <input
                        type="number"
                        value={editingItem.exactPrice ?? ""}
                        onChange={e => setEditingItem({ ...editingItem, exactPrice: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="Optional fixed"
                      />
                    </label>
                  </div>

                  <div className="form-row-3">
                    <label>
                      <span>Estimated Duration</span>
                      <input
                        value={editingItem.estimatedDuration}
                        onChange={e => setEditingItem({ ...editingItem, estimatedDuration: e.target.value })}
                        placeholder="60–90 min"
                      />
                    </label>

                    <label>
                      <span>Quality Tier</span>
                      <select
                        value={editingItem.qualityTier}
                        onChange={e => setEditingItem({ ...editingItem, qualityTier: e.target.value as PriceEntry["qualityTier"] })}
                      >
                        <option value="standard">Standard (Compatible)</option>
                        <option value="premium">Premium OEM-Grade</option>
                        <option value="original">Original / Genuine Pull</option>
                      </select>
                    </label>

                    <label>
                      <span>Availability</span>
                      <select
                        value={editingItem.availability}
                        onChange={e => setEditingItem({ ...editingItem, availability: e.target.value as PriceEntry["availability"] })}
                      >
                        <option value="in_stock">In Stock (Immediate)</option>
                        <option value="1_2_days">1–2 Days Delivery</option>
                        <option value="on_order">On Order</option>
                      </select>
                    </label>
                  </div>

                  <div className="form-checkboxes-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={editingItem.partsIncluded}
                        onChange={e => setEditingItem({ ...editingItem, partsIncluded: e.target.checked })}
                      />
                      <span>Spare part included in price</span>
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={editingItem.laborIncluded}
                        onChange={e => setEditingItem({ ...editingItem, laborIncluded: e.target.checked })}
                      />
                      <span>Technician labor included in price</span>
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={editingItem.finalPriceRequiresConfirmation}
                        onChange={e => setEditingItem({ ...editingItem, finalPriceRequiresConfirmation: e.target.checked })}
                      />
                      <span>Final price confirmed before starting repair</span>
                    </label>
                  </div>

                  <label>
                    <span>Description / Scope of Work</span>
                    <textarea
                      rows={2}
                      value={editingItem.description}
                      onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="e.g. Precision battery replacement with cycle test."
                    />
                  </label>
                </div>

                {/* LIVE CUSTOMER CARD PREVIEW */}
                <div className="modal-live-preview">
                  <div className="preview-top-bar">
                    <span>
                      <Sparkles size={14} /> LIVE CUSTOMER CARD PREVIEW
                    </span>
                    <div className="preview-lang-switch">
                      {(["cs", "en", "ru"] as const).map(l => (
                        <button
                          key={l}
                          type="button"
                          className={previewLang === l ? "active" : ""}
                          onClick={() => setPreviewLang(l)}
                        >
                          {l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="preview-card-frame">
                    <article className="repair-price-card">
                      <div className="card-top-row">
                        <div className="card-device-info">
                          <DeviceGlyph kind={editingItem.brand === "MacBook" ? "MacBook" : "iPhone"} compact />
                          <div>
                            <span className="card-brand">{editingItem.brand}</span>
                            <h4 className="card-device-name">{editingItem.device}</h4>
                          </div>
                        </div>

                        {editingItem.qualityTier !== "standard" && (
                          <span className="quality-pill">
                            <Sparkles size={11} /> {editingItem.qualityTier.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="card-service-body">
                        <h3 className="card-service-title">{editingItem.service}</h3>
                        <p className="card-service-desc">{editingItem.description}</p>
                      </div>

                      <div className="card-pricing-block">
                        <div className="card-price-row">
                          <div className="card-price-value">
                            <strong>
                              {formatRepairPrice(
                                {
                                  priceFrom: editingItem.priceFrom,
                                  priceTo: editingItem.priceTo,
                                  exactPrice: editingItem.exactPrice,
                                  priceFormat: editingItem.priceFormat,
                                  currency: editingItem.currency,
                                },
                                previewLang,
                                { showCca: true }
                              )}
                            </strong>
                            <span className="inclusions-badge">
                              <Check size={12} />
                              {previewLang === "cs"
                                ? "Cena včetně dílu a práce"
                                : previewLang === "ru"
                                ? "Запчасть и работа включены"
                                : "Parts and labor included"}
                            </span>
                          </div>

                          <div className="card-duration">
                            <Clock size={13} />
                            <span>~{editingItem.estimatedDuration}</span>
                          </div>
                        </div>

                        <div className="card-trust-note">
                          <ShieldCheck size={13} />
                          <span>
                            {previewLang === "cs"
                              ? "Cenu vždy potvrdíme před zahájením opravy."
                              : previewLang === "ru"
                              ? "Окончательную стоимость мы всегда согласовываем до начала ремонта."
                              : "We always confirm the final price before starting the repair."}
                          </span>
                        </div>
                      </div>

                      <div className="card-actions">
                        <div className="button card-book-button">
                          <span>
                            {previewLang === "cs"
                              ? "Objednat opravu"
                              : previewLang === "ru"
                              ? "Записаться на ремонт"
                              : "Request repair"}
                          </span>
                          <ArrowRight size={15} />
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                {saveStatus && <span className="save-status-badge">{saveStatus}</span>}
                <button type="button" className="btn-cancel" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="button btn-save-primary"
                  onClick={() => handleSaveEdit(editingItem)}
                >
                  <Save size={15} /> Save Price Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

