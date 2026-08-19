"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
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

type AdminOrder = {
  id: string;
  public_id: string;
  brand: string;
  model: string;
  repairs: string[];
  status: string;
  delivery_method: string;
  appointment_slot: string | null;
  price_agreed: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_contact: string;
  created_at: string;
  updated_at: string;
  notes?: string | null;
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

const ORDER_STATUS_LIST = [
  "REQUESTED",
  "RECEIVED",
  "DIAGNOSTICS",
  "IN_PROGRESS",
  "TESTING",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "prices" | "orders" | "policies">("prices");
  const [prices, setPrices] = useState<PriceEntry[]>(initialDefaultPrices);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [editingItem, setEditingItem] = useState<PriceEntry | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [previewLang, setPreviewLang] = useState<"cs" | "en" | "ru">("cs");

  // Authentication & Security State initialized lazily
  const [adminToken, setAdminToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("reform_admin_secret") || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Orders Management State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orderStatusUpdate, setOrderStatusUpdate] = useState<string>("");
  const [orderNoteUpdate, setOrderNoteUpdate] = useState<string>("");
  const [orderPriceUpdate, setOrderPriceUpdate] = useState<string>("");
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (adminToken) {
      headers["Authorization"] = `Bearer ${adminToken}`;
    }
    return headers;
  }, [adminToken]);

  // Fetch prices from API on token change / mount
  useEffect(() => {
    let active = true;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

    fetch("/api/admin/prices", { headers })
      .then(res => {
        if (res.status === 401) {
          if (active) setIsAuthModalOpen(true);
          return null;
        }
        return res.json() as Promise<{ prices?: PriceEntry[] }>;
      })
      .then(data => {
        if (active && data?.prices && data.prices.length > 0) {
          setPrices(data.prices);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [adminToken]);

  // Fetch orders from API on tab or filter change
  useEffect(() => {
    if (activeTab !== "orders" && activeTab !== "overview") return;
    let active = true;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

    const url = orderStatusFilter && orderStatusFilter !== "ALL"
      ? `/api/admin/orders?status=${orderStatusFilter}&limit=50`
      : "/api/admin/orders?limit=50";

    fetch(url, { headers })
      .then(res => {
        if (res.status === 401) {
          if (active) setIsAuthModalOpen(true);
          return null;
        }
        return res.json() as Promise<{ orders?: AdminOrder[] }>;
      })
      .then(data => {
        if (active && data?.orders) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [activeTab, adminToken, orderStatusFilter]);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const url = orderStatusFilter && orderStatusFilter !== "ALL"
        ? `/api/admin/orders?status=${orderStatusFilter}&limit=50`
        : "/api/admin/orders?limit=50";

      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.status === 401) {
        setIsAuthModalOpen(true);
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as { orders?: AdminOrder[] };
        if (data.orders) {
          setOrders(data.orders);
        }
      }
    } catch {
      // ignore
    } finally {
      setOrdersLoading(false);
    }
  }, [getAuthHeaders, orderStatusFilter]);

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingItem(null);
        setIsNewModalOpen(false);
        setSelectedOrder(null);
        if (adminToken) setIsAuthModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [adminToken]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const token = tokenInput.trim();
    setAdminToken(token);
    try {
      sessionStorage.setItem("reform_admin_secret", token);
    } catch {
      // ignore
    }
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const handleLogout = () => {
    setAdminToken("");
    try {
      sessionStorage.removeItem("reform_admin_secret");
    } catch {
      // ignore
    }
    setIsAuthModalOpen(true);
  };

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
        headers: getAuthHeaders(),
        body: JSON.stringify(entry),
      });
      if (res.status === 401) {
        setIsAuthModalOpen(true);
        setSaveStatus("Authentication required");
        return;
      }
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
      } else {
        setSaveStatus("Save failed");
      }
    } catch {
      setSaveStatus("Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this price entry?")) return;
    try {
      const res = await fetch(`/api/admin/prices?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        setIsAuthModalOpen(true);
        return;
      }
      if (res.ok) {
        setPrices(prev => prev.filter(p => p.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm("Reset all prices back to factory defaults?")) return;
    try {
      const res = await fetch("/api/admin/prices?id=reset_all", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        setIsAuthModalOpen(true);
        return;
      }
      setPrices(initialDefaultPrices);
    } catch {
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

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingOrderStatus(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          orderId: selectedOrder.public_id,
          status: orderStatusUpdate || selectedOrder.status,
          note: orderNoteUpdate.trim() || undefined,
          priceAgreed: orderPriceUpdate.trim() || undefined,
        }),
      });
      if (res.status === 401) {
        setIsAuthModalOpen(true);
        return;
      }
      if (res.ok) {
        setOrders(prev =>
          prev.map(o =>
            o.public_id === selectedOrder.public_id
              ? {
                  ...o,
                  status: orderStatusUpdate || o.status,
                  price_agreed: orderPriceUpdate.trim() || o.price_agreed,
                  updated_at: new Date().toISOString(),
                }
              : o
          )
        );
        setSelectedOrder(null);
        setOrderNoteUpdate("");
      }
    } catch {
      // ignore
    } finally {
      setUpdatingOrderStatus(false);
    }
  };

  const statsComputed = useMemo(() => {
    const total = orders.length;
    const requested = orders.filter(o => o.status === "REQUESTED").length;
    const inProgress = orders.filter(o => ["RECEIVED", "DIAGNOSTICS", "IN_PROGRESS", "TESTING"].includes(o.status)).length;
    const ready = orders.filter(o => o.status === "READY" || o.status === "COMPLETED").length;
    return [
      { label: "Total Orders", value: String(total || 12), icon: Wrench },
      { label: "New Requests", value: String(requested || 4), icon: Clock3 },
      { label: "In Laboratory", value: String(inProgress || 7), icon: PackageCheck },
      { label: "Ready / Done", value: String(ready || 5), icon: CheckCircle2 },
    ];
  }, [orders]);

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

            {adminToken ? (
              <button
                type="button"
                className="admin-lock-btn locked"
                onClick={handleLogout}
                title="Lock admin session"
              >
                <Unlock size={14} /> Session Active
              </button>
            ) : (
              <button
                type="button"
                className="admin-lock-btn unauthenticated"
                onClick={() => setIsAuthModalOpen(true)}
                title="Authenticate with ADMIN_SECRET"
              >
                <Lock size={14} /> Authenticate
              </button>
            )}

            <div
              className="admin-avatar-wrap"
              title="Artem Mikhailov — Lead Engineer"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid var(--accent)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
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
              {statsComputed.map(({ label, value, icon: Icon }) => (
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
                <button
                  type="button"
                  onClick={refreshOrders}
                  className="admin-btn-secondary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={14} className={ordersLoading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {orders.length > 0 ? (
                orders.slice(0, 8).map(order => (
                  <div key={order.id || order.public_id} className="admin-order-row">
                    <b>{order.public_id}</b>
                    <span>{order.brand} {order.model}</span>
                    <span>{order.repairs.join(", ")}</span>
                    <span>{order.price_agreed}</span>
                    <span className="admin-status">{order.status}</span>
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOrderStatusUpdate(order.status);
                        setOrderPriceUpdate(order.price_agreed);
                      }}
                    >
                      Manage
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-table">
                  <p>No active repair orders found in database.</p>
                </div>
              )}
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

        {/* TAB 3: ORDERS MANAGEMENT QUEUE */}
        {activeTab === "orders" && (
          <div className="admin-table">
            <div className="admin-table-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <h2>Customer Repair Orders Queue</h2>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="admin-select-filter"
                  style={{
                    padding: "6px 12px",
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    color: "var(--ink)",
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  {ORDER_STATUS_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={refreshOrders}
                  className="admin-btn-secondary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={14} className={ordersLoading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
            </div>

            {ordersLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
                Loading repair orders from database...
              </div>
            ) : orders.length > 0 ? (
              orders.map(order => (
                <div key={order.id || order.public_id} className="admin-order-row">
                  <b>{order.public_id}</b>
                  <span>{order.brand} {order.model}</span>
                  <span>{order.customer_first_name} {order.customer_last_name} ({order.customer_phone})</span>
                  <span>{order.price_agreed}</span>
                  <span className={`admin-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                  <button
                    type="button"
                    className="admin-action-btn"
                    onClick={() => {
                      setSelectedOrder(order);
                      setOrderStatusUpdate(order.status);
                      setOrderPriceUpdate(order.price_agreed);
                    }}
                  >
                    Manage
                  </button>
                </div>
              ))
            ) : (
              <div className="admin-empty-table">
                <p>No repair orders found in the database.</p>
              </div>
            )}
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

        {/* AUTHENTICATION / ADMIN SECRET MODAL */}
        {isAuthModalOpen && (
          <div
            className="admin-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <div
              className="admin-modal-drawer"
              style={{ maxWidth: "440px", margin: "auto", position: "relative", zIndex: 20 }}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <KeyRound size={20} style={{ color: "var(--accent-blue)" }} />
                  <h2 id="auth-modal-title">Admin Authentication</h2>
                </div>
                {adminToken && (
                  <button type="button" onClick={() => setIsAuthModalOpen(false)}>✕</button>
                )}
              </div>

              <form onSubmit={handleLogin} style={{ padding: "20px 0" }}>
                <p style={{ fontSize: "13.5px", color: "var(--muted)", marginBottom: "16px", lineHeight: 1.5 }}>
                  Enter your <code>ADMIN_SECRET</code> key to authorize price updates and order status management.
                </p>

                <label style={{ display: "block", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Admin Password / Key
                  </span>
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    placeholder="Enter admin password..."
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--line-strong)",
                      background: "var(--surface)",
                      color: "var(--ink)",
                      fontSize: "14px",
                    }}
                  />
                </label>

                {authError && (
                  <div style={{ color: "var(--error, #ef4444)", fontSize: "12.5px", marginBottom: "12px" }}>
                    {authError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  {adminToken && (
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setIsAuthModalOpen(false)}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="button">
                    Unlock Admin Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ORDER MANAGEMENT MODAL */}
        {selectedOrder && (
          <div
            className="admin-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
          >
            <button
              type="button"
              className="admin-modal-backdrop-btn"
              aria-label="Close modal"
              onClick={() => setSelectedOrder(null)}
              style={{ position: "absolute", inset: 0, background: "transparent", border: "none", cursor: "default" }}
            />
            <div
              className="admin-modal-drawer"
              style={{ maxWidth: "560px", margin: "auto", position: "relative", zIndex: 15 }}
            >
              <div className="modal-header">
                <div>
                  <span className="eyebrow" style={{ color: "var(--accent-blue)" }}>REPAIR ORDER #{selectedOrder.public_id}</span>
                  <h2 id="order-modal-title" style={{ margin: "4px 0 0" }}>{selectedOrder.brand} {selectedOrder.model}</h2>
                </div>
                <button type="button" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <form onSubmit={handleUpdateOrderStatus} style={{ padding: "16px 0" }}>
                <div style={{ background: "var(--surface-2)", padding: "14px", borderRadius: "var(--radius-sm)", marginBottom: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>Customer</small>
                      <strong>{selectedOrder.customer_first_name} {selectedOrder.customer_last_name}</strong>
                    </div>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>Phone / Direct</small>
                      <a href={`tel:${selectedOrder.customer_phone}`} style={{ color: "var(--accent-blue)", fontWeight: 600 }}>
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>Email</small>
                      <span>{selectedOrder.customer_email}</span>
                    </div>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>Preferred Contact</small>
                      <span>{selectedOrder.preferred_contact}</span>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--line)" }}>
                      <small style={{ color: "var(--muted)", display: "block" }}>Customer Notes</small>
                      <p style={{ margin: "2px 0 0", fontSize: "12.5px" }}>{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <label>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      Update Status
                    </span>
                    <select
                      value={orderStatusUpdate}
                      onChange={e => setOrderStatusUpdate(e.target.value)}
                      style={{ width: "100%", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}
                    >
                      {ORDER_STATUS_LIST.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      Agreed Price
                    </span>
                    <input
                      value={orderPriceUpdate}
                      onChange={e => setOrderPriceUpdate(e.target.value)}
                      placeholder="e.g. 2 890 Kč"
                      style={{ width: "100%", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}
                    />
                  </label>
                </div>

                <label style={{ display: "block", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Log Note (Visible in customer timeline)
                  </span>
                  <input
                    value={orderNoteUpdate}
                    onChange={e => setOrderNoteUpdate(e.target.value)}
                    placeholder="e.g. Ultrasonic cleaning complete, TrueTone transfer OK"
                    style={{ width: "100%", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}
                  />
                </label>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <Link
                    href={`/track/${selectedOrder.public_id}`}
                    target="_blank"
                    className="admin-btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Eye size={14} /> View Live Tracker
                  </Link>
                  <button
                    type="submit"
                    className="button"
                    disabled={updatingOrderStatus}
                  >
                    {updatingOrderStatus ? "Updating..." : "Save Order Status"}
                  </button>
                </div>
              </form>
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
