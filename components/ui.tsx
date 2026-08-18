"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { Smartphone, Laptop, Tablet } from "lucide-react";

export function Button({ children, className = "", ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={`button ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function LinkButton({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Section({
  eyebrow,
  title,
  copy,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`section ${className}`}>
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2>{title}</h2>}
        {copy && <p className="section-copy">{copy}</p>}
        {children}
      </div>
    </section>
  );
}

export function DeviceGlyph({
  kind = "phone",
  compact = false,
}: {
  kind?: string;
  compact?: boolean;
}) {
  const isLaptop = /Mac|Laptop|Book/i.test(kind);
  const isTablet = /iPad|Tablet|Tab/i.test(kind);

  return (
    <span
      aria-hidden
      className={`device-glyph-badge ${compact ? "compact" : ""}`}
    >
      {isLaptop ? (
        <Laptop size={compact ? 16 : 20} />
      ) : isTablet ? (
        <Tablet size={compact ? 16 : 20} />
      ) : (
        <Smartphone size={compact ? 16 : 20} />
      )}
    </span>
  );
}

export function PlaceholderTag() {
  return <span className="placeholder-tag">Lab Verified</span>;
}
