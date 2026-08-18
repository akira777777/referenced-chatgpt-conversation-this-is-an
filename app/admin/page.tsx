import type { Metadata } from "next";
import { Clock3, Search, Wrench, CheckCircle2, PackageCheck } from "lucide-react";
import { PlaceholderTag } from "@/components/ui";

export const metadata: Metadata = {
  title: "Service Overview — Admin",
  robots: { index: false, follow: false },
};

const orders = [
  ["REP-240182", "iPhone 15 Pro", "Display", "In progress"],
  ["REP-240181", "MacBook Air M2", "Battery", "Diagnostics"],
  ["REP-240180", "Galaxy S24 Ultra", "Screen", "Ready"],
];

const stats = [
  { label: "Repairs today", value: "12", icon: Wrench },
  { label: "Diagnostics", value: "4", icon: Clock3 },
  { label: "In progress", value: "7", icon: PackageCheck },
  { label: "Ready", value: "5", icon: CheckCircle2 },
];

export default function AdminPage() {
  return (
    <main className="admin-page">
      <aside>
        <span className="logo light">
          <span>R</span>REFORM
        </span>
        <nav>
          <b>Overview</b>
          <span>Repair orders</span>
          <span>Appointments</span>
          <span>Devices & prices</span>
          <span>Customers</span>
        </nav>
        <small>
          Architecture preview
          <br />
          Authentication required before launch
        </small>
      </aside>
      <section>
        <header>
          <div>
            <p className="eyebrow">
              ADMIN PREVIEW <PlaceholderTag />
            </p>
            <h1>Service overview</h1>
          </div>
          <button type="button">AR</button>
        </header>
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
            <h2>Recent repairs</h2>
            <label>
              <Search />
              <input placeholder="Search orders" />
            </label>
          </div>
          {orders.map((row) => (
            <div key={row[0]}>
              {row.map((x, i) => (
                <span key={`${row[0]}-${i}`} className={i === 3 ? "admin-status" : ""}>
                  {x}
                </span>
              ))}
              <button type="button">Open</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
