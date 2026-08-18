"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Search, Send, Sun, X, ArrowUpRight, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { allModels, contactInfo, placeholderNotice } from "@/lib/data";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n/context";
import { Logo } from "./Logo";

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { label: t.nav.repairs, href: "/repair" },
    { label: t.nav.devices, href: "/repair/apple" },
    { label: t.nav.prices, href: "/prices" },
    { label: t.nav.business, href: "/business" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.contact, href: "/contact" },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("reform_theme", nextDark ? "dark" : "light");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!search) return;
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearch(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [search]);

  const results = query.trim()
    ? allModels.filter(x => `${x.brand} ${x.name}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : allModels.slice(0, 4);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="nav container">
          <Logo variant="header" />

          <nav className="desktop-nav" aria-label="Main Navigation">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <LanguageSwitcher />

            <button
              type="button"
              className="icon-button"
              onClick={() => setSearch(true)}
              aria-label="Search devices"
              title="Search devices"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className="icon-button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              title="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a
              href={contactInfo.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="icon-button telegram-nav-icon"
              aria-label={`Telegram ${contactInfo.telegram}`}
              title={`Telegram ${contactInfo.telegram}`}
            >
              <Send size={16} />
            </a>

            <Link className="button nav-cta" href="/repair">
              {t.nav.startRepair}
            </Link>

            <button
              type="button"
              className="icon-button menu-button"
              onClick={() => setMenu(v => !v)}
              aria-label="Open mobile menu"
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menu && (
          <nav className="mobile-nav" aria-label="Mobile Navigation">
            <div className="mobile-nav-top">
              <LanguageSwitcher />
            </div>
            {navLinks.map(link => (
              <Link
                key={link.href}
                onClick={() => setMenu(false)}
                href={link.href}
                className="mobile-nav-link"
              >
                <span>{link.label}</span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <a
              href={contactInfo.telegramUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenu(false)}
              className="mobile-nav-link mobile-telegram-link"
            >
              <span>Telegram ({contactInfo.telegram})</span>
              <Send size={16} />
            </a>
            <div className="mobile-nav-cta-wrap">
              <Link
                href="/repair"
                onClick={() => setMenu(false)}
                className="button mobile-cta-btn"
              >
                {t.nav.startRepair}
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Global Device Search Modal */}
      {search && (
        <div className="modal-backdrop">
          <button
            type="button"
            className="modal-dismiss-backdrop"
            onClick={() => setSearch(false)}
            aria-label="Close search modal"
          />
          <div role="dialog" aria-modal="true" aria-label="Device search" className="search-modal">
            <div className="search-input">
              <Search size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                aria-label="Search devices"
              />
              <button type="button" onClick={() => setSearch(false)} aria-label="Close search">
                <X size={18} />
              </button>
            </div>
            <div className="search-results">
              <span>{query ? "Results" : t.nav.popularDevices}</span>
              {results.map(model => (
                <Link
                  key={`${model.brandId}-${model.id}`}
                  href={`/repair?brand=${model.brandId}&model=${model.id}`}
                  onClick={() => setSearch(false)}
                >
                  <div>
                    <strong>{model.name}</strong>
                    <small>{model.brand} · {model.category}</small>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
              {!results.length && (
                <div className="empty-state">
                  <strong>{t.nav.noMatch}</strong>
                  <p>{t.nav.chooseOther}</p>
                  <Link className="button" href="/repair" onClick={() => setSearch(false)}>
                    {t.nav.continueWithOther}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <Logo variant="footer" />
          <p className="footer-tagline">
            Precision care, micro-soldering & component-level restoration for the technology you rely on in Prague.
          </p>
          <div className="footer-meta-pill">
            <ShieldCheck size={14} />
            <span>Prague 3 · Certified Lab</span>
          </div>
          <small className="footer-notice">{placeholderNotice}</small>
        </div>

        <div>
          <b>{t.nav.repairs}</b>
          <Link href="/repair">{t.nav.startRepair}</Link>
          <Link href="/prices">{t.nav.prices}</Link>
          <Link href="/track">{t.nav.track}</Link>
          <Link href="/repair/apple">Apple (iPhone / Mac)</Link>
          <Link href="/repair/samsung">Samsung Galaxy</Link>
        </div>

        <div>
          <b>{t.nav.about} & {t.nav.business}</b>
          <Link href="/business">{t.nav.business}</Link>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/contact">{t.nav.contact}</Link>
          <Link href="/faq">FAQ</Link>
        </div>

        <div>
          <b>Support & Direct</b>
          <a href={`tel:${contactInfo.phoneRaw}`} className="footer-contact-link">
            <Phone size={14} /> {contactInfo.phone}
          </a>
          <a href={`mailto:${contactInfo.email}`} className="footer-contact-link">
            <Mail size={14} /> {contactInfo.email}
          </a>
          <a
            href={contactInfo.telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="footer-telegram-highlight"
          >
            <Send size={14} /> Telegram: {contactInfo.telegram}
          </a>
          <span className="footer-address">
            <MapPin size={14} /> {contactInfo.addressFull}
          </span>
          <div className="footer-lang-wrap">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>{t.common.rightsReserved} · {contactInfo.addressFull}</span>
        <div className="footer-links-row">
          <Link href="/about">{t.common.privacy}</Link>
          <span>·</span>
          <Link href="/about">{t.common.terms}</Link>
          <span>·</span>
          <span>CZ / RU / EN</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
