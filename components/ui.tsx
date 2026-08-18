"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <motion.button whileTap={{ scale: .98 }} className={`button ${className}`} {...props}>{children}</motion.button>;
}
export function LinkButton({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <Link href={href} className={`button ${secondary ? "button-secondary" : ""}`}>{children}</Link>;
}
export function Section({ eyebrow, title, copy, children, className = "" }: { eyebrow?: string; title?: string; copy?: string; children?: ReactNode; className?: string }) {
  return <section className={`section ${className}`}><div className="container">{eyebrow && <p className="eyebrow">{eyebrow}</p>}{title && <h2>{title}</h2>}{copy && <p className="section-copy">{copy}</p>}{children}</div></section>;
}
export function DeviceGlyph({ kind = "phone", compact = false }: { kind?: string; compact?: boolean }) {
  const laptop = /Mac|Laptop/i.test(kind);
  const tablet = /iPad|Tablet/i.test(kind);
  return <span aria-hidden className={`device-glyph ${laptop ? "laptop" : tablet ? "tablet" : "phone"} ${compact ? "compact" : ""}`}><i /></span>;
}
export function PlaceholderTag() { return <span className="placeholder-tag">Demo data</span>; }
