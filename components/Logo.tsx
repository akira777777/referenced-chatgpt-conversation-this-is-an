import Link from "next/link";

interface LogoProps {
  variant?: "header" | "footer" | "standalone";
  showTagline?: boolean;
  className?: string;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="logo-mark-img-wrap"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--line)",
        flexShrink: 0,
        background: "var(--surface-2)",
      }}
    >
      <img
        src="/icon.png"
        alt="Reform Device Care"
        width={size}
        height={size}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

export function Logo({ variant = "header", showTagline = true, className = "" }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link href="/" className={`brand-logo brand-logo-${variant} ${className}`} aria-label="Reform — Electronics Repair Prague">
      <div className="logo-icon-wrap">
        <LogoMark size={isFooter ? 36 : 32} />
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
