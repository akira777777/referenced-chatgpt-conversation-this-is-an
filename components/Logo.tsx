import Link from "next/link";

interface LogoProps {
  variant?: "header" | "footer" | "standalone";
  showTagline?: boolean;
  className?: string;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-mark-svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="reformGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="accentGlow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>
      {/* Outer precision frame */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill="url(#reformGrad)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />
      {/* Circuit trace accents */}
      <path
        d="M2 14 H9 L13 18 H20"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="18" r="1.5" fill="#93c5fd" />
      <path
        d="M38 26 H31 L27 22 H20"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="22" r="1.5" fill="#93c5fd" />
      {/* Stylized 'R' Monogram */}
      <path
        d="M14 11 H23 C26.3 11 28.5 13.2 28.5 16.5 C28.5 19.5 26.5 21.5 23.5 21.8 L29 29 H24.2 L19.2 22.5 H17.8 V29 H14 V11 Z M17.8 19 H22.8 C24.4 19 25.2 18 25.2 16.5 C25.2 15 24.4 14 22.8 14 H17.8 V19 Z"
        fill="#ffffff"
      />
      {/* Micro laser node */}
      <circle cx="26" cy="14" r="1.2" fill="url(#accentGlow)" />
    </svg>
  );
}

export function Logo({ variant = "header", showTagline = true, className = "" }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link href="/" className={`brand-logo brand-logo-${variant} ${className}`} aria-label="Reform — Electronics Repair Prague">
      <div className="logo-icon-wrap">
        <LogoMark size={isFooter ? 34 : 30} />
      </div>
      <div className="logo-text-wrap">
        <span className="brand-name">
          REFORM<span className="brand-dot">.</span>
        </span>
        {showTagline && (
          <span className="brand-tagline">
            PRAGUE <span className="tagline-sub">· DEVICE CARE</span>
          </span>
        )}
      </div>
    </Link>
  );
}
