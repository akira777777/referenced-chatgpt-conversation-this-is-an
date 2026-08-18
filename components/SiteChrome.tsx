"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Search, Sun, X, ArrowUpRight } from "lucide-react";
import { allModels, placeholderNotice } from "@/lib/data";

const links = [["Repairs", "/repair"], ["Devices", "/repair/apple"], ["Prices", "/prices"], ["Business", "/business"], ["About", "/about"], ["Contact", "/contact"]];

export function Header() {
  const [scrolled, setScrolled] = useState(false); const [menu, setMenu] = useState(false); const [search, setSearch] = useState(false); const [dark, setDark] = useState(false); const [query, setQuery] = useState("");
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 12); fn(); addEventListener("scroll", fn); return () => removeEventListener("scroll", fn); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  const results = query.trim() ? allModels.filter(x => `${x.brand} ${x.name}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : allModels.slice(0, 4);
  return <>
    <header className={scrolled ? "header scrolled" : "header"}><div className="nav container">
      <Link href="/" className="logo" aria-label="Reform home"><span>R</span>REFORM</Link>
      <nav className="desktop-nav">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="nav-actions"><button className="icon-button" onClick={() => setSearch(true)} aria-label="Search devices"><Search size={18} /></button><button className="icon-button" onClick={() => setDark(v => !v)} aria-label="Toggle color theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><Link className="button nav-cta" href="/repair">Start repair</Link><button className="icon-button menu-button" onClick={() => setMenu(v => !v)} aria-label="Open menu">{menu ? <X/> : <Menu/>}</button></div>
    </div>{menu && <nav className="mobile-nav">{links.map(([label, href]) => <Link key={href} onClick={() => setMenu(false)} href={href}>{label}<ArrowUpRight size={16}/></Link>)}</nav>}</header>
    {search && <div className="modal-backdrop" onMouseDown={() => setSearch(false)}><div role="dialog" aria-modal="true" aria-label="Device search" className="search-modal" onMouseDown={e => e.stopPropagation()}><div className="search-input"><Search size={20}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search iPhone, MacBook, Samsung…" aria-label="Search devices"/><button onClick={() => setSearch(false)} aria-label="Close search"><X/></button></div><div className="search-results"><span>{query ? "Results" : "Popular devices"}</span>{results.map(model => <Link key={`${model.brandId}-${model.id}`} href={`/repair?brand=${model.brandId}&model=${model.id}`} onClick={() => setSearch(false)}><div><strong>{model.name}</strong><small>{model.brand} · repair options</small></div><ArrowUpRight size={18}/></Link>)}{!results.length && <div className="empty-state"><strong>No exact match</strong><p>Choose “Other” in the repair flow and tell us about your device.</p><Link className="button" href="/repair">Continue with another device</Link></div>}</div></div></div>}
  </>;
}

export function Footer() { return <footer><div className="container footer-grid"><div><Link href="/" className="logo light"><span>R</span>REFORM</Link><p>Precision care for the technology you rely on.</p><small>{placeholderNotice}</small></div><div><b>Repairs</b><Link href="/repair">Start a repair</Link><Link href="/prices">Request pricing</Link><Link href="/track">Track repair</Link></div><div><b>Company</b><Link href="/business">Business</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div><div><b>Support</b><Link href="/faq">FAQ</Link><a href="tel:+420737500587">+420 737 500 587</a><a href="mailto:fear75412@gmail.com">fear75412@gmail.com</a><span>Biskupcova 31, Praha 3</span></div></div><div className="container footer-bottom"><span>© 2026 Reform — demonstration concept</span><span>Privacy · Terms · CZ / EN</span></div></footer>; }

export function SiteChrome({ children }: { children: React.ReactNode }) { return <><Header/><main>{children}</main><Footer/></>; }
