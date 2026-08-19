"use client";

import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// ==========================================
// 1. BRAND LOGOS & MARKS (Crisp Vectors)
// ==========================================

export function AppleBrandIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.63 1.34-.56.64-1.04 1.7-0.91 2.74 1.01.08 2.02-.48 2.62-1.21z" />
    </svg>
  );
}

export function SamsungBrandIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <ellipse cx="12" cy="12" rx="10" ry="7" strokeWidth="1.8" />
      <path d="M7 13.5c.8 1 2 1.5 3.5 1.5 2 0 3-1 3-2s-1.5-1.5-3-2-2.5-1-2.5-2 1-1.5 2.5-1.5c1.2 0 2.2.4 3 1.2" strokeWidth="1.6" />
      <path d="M14 9.5l3 5" strokeWidth="1.6" />
    </svg>
  );
}

export function GoogleBrandIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path d="M12 12h5.5" strokeWidth="1.8" />
      <path d="M17.5 12a5.5 5.5 0 1 1-1.6-3.9" strokeWidth="1.8" />
    </svg>
  );
}

export function XiaomiBrandIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.8" />
      <path d="M7.5 16V8.5h3v7.5" strokeWidth="1.8" />
      <path d="M13.5 16V8.5h3v7.5" strokeWidth="1.8" />
      <path d="M10.5 12h3" strokeWidth="1.8" />
    </svg>
  );
}

export function HuaweiBrandIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3v7" strokeWidth="1.8" />
      <path d="M8 5.5l2.5 5.5" strokeWidth="1.8" />
      <path d="M16 5.5L13.5 11" strokeWidth="1.8" />
      <path d="M5 10l4 4" strokeWidth="1.8" />
      <path d="M19 10l-4 4" strokeWidth="1.8" />
      <path d="M12 15a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z" strokeWidth="1.8" />
    </svg>
  );
}

export function UniversalTechIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="5" y="5" width="14" height="14" rx="3" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" strokeWidth="1.8" />
    </svg>
  );
}

// ==========================================
// 2. HARDWARE REPAIR & DIAGNOSTIC GLYPHS
// ==========================================

export function ScreenOledIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="4" y="2" width="16" height="20" rx="3" strokeWidth="1.8" />
      <path d="M9 18h6" strokeWidth="1.8" />
      <path d="M12 5v1" strokeWidth="2" />
      <circle cx="12" cy="11" r="2.5" stroke="var(--accent, #3b82f6)" strokeWidth="1.5" />
      <path d="M8 8l1.5 1.5M16 8l-1.5 1.5M8 14l1.5-1.5M16 14l-1.5-1.5" stroke="var(--accent, #3b82f6)" strokeWidth="1.2" />
    </svg>
  );
}

export function BatteryHealthIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2" y="6" width="17" height="12" rx="3" strokeWidth="1.8" />
      <path d="M22 10v4" strokeWidth="2" />
      <path d="M10 9l-3 4h4l-2 4" strokeWidth="1.8" stroke="var(--success, #10b981)" fill="var(--success, #10b981)" fillOpacity="0.2" />
    </svg>
  );
}

export function BgaMicroSolderingIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.8" />
      <rect x="8" y="8" width="8" height="8" rx="1" fill="var(--accent, #3b82f6)" fillOpacity="0.2" strokeWidth="1.5" />
      <path d="M2 9h2M2 15h2M20 9h2M20 15h2M9 2v2M15 2v2M9 20v2M15 20v2" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="var(--accent, #3b82f6)" />
    </svg>
  );
}

export function LiquidDeconIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeWidth="1.8" fill="var(--accent, #3b82f6)" fillOpacity="0.15" />
      <path d="M9 13.5l2 2 4-4" strokeWidth="2" stroke="var(--success, #10b981)" />
    </svg>
  );
}

export function CameraOpticsIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeWidth="1.8" />
      <circle cx="12" cy="13" r="4.5" strokeWidth="1.8" />
      <circle cx="12" cy="13" r="2" fill="var(--accent, #3b82f6)" fillOpacity="0.3" strokeWidth="1.2" />
    </svg>
  );
}

export function ChargingPortIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="1.8" fill="var(--accent, #3b82f6)" fillOpacity="0.2" />
    </svg>
  );
}

export function DiagnosticsScanIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 8V4h4M16 4h4v4M4 16v4h4M16 20h4v-4" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="var(--accent, #3b82f6)" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

// ==========================================
// 3. TOP-LEVEL COMPONENT WRAPPERS
// ==========================================

export function BrandIcon({
  brandId,
  size = 20,
  className = "",
  ...props
}: IconProps & { brandId?: string }) {
  const normalized = (brandId || "").toLowerCase().trim();
  switch (normalized) {
    case "apple":
      return <AppleBrandIcon size={size} className={className} {...props} />;
    case "samsung":
      return <SamsungBrandIcon size={size} className={className} {...props} />;
    case "google":
      return <GoogleBrandIcon size={size} className={className} {...props} />;
    case "xiaomi":
      return <XiaomiBrandIcon size={size} className={className} {...props} />;
    case "huawei":
      return <HuaweiBrandIcon size={size} className={className} {...props} />;
    default:
      return <UniversalTechIcon size={size} className={className} {...props} />;
  }
}

export function RepairIcon({
  repairId,
  size = 20,
  className = "",
  ...props
}: IconProps & { repairId?: string }) {
  const normalized = (repairId || "").toLowerCase().trim();
  if (normalized.includes("screen") || normalized.includes("display") || normalized.includes("glass")) {
    return <ScreenOledIcon size={size} className={className} {...props} />;
  }
  if (normalized.includes("battery") || normalized.includes("accu")) {
    return <BatteryHealthIcon size={size} className={className} {...props} />;
  }
  if (normalized.includes("charge") || normalized.includes("port") || normalized.includes("lightning") || normalized.includes("usb")) {
    return <ChargingPortIcon size={size} className={className} {...props} />;
  }
  if (normalized.includes("liquid") || normalized.includes("water") || normalized.includes("decon")) {
    return <LiquidDeconIcon size={size} className={className} {...props} />;
  }
  if (normalized.includes("board") || normalized.includes("bga") || normalized.includes("solder") || normalized.includes("chip")) {
    return <BgaMicroSolderingIcon size={size} className={className} {...props} />;
  }
  if (normalized.includes("camera") || normalized.includes("lens") || normalized.includes("optic")) {
    return <CameraOpticsIcon size={size} className={className} {...props} />;
  }
  return <DiagnosticsScanIcon size={size} className={className} {...props} />;
}

export function getBrandIcon(brandId?: string): React.ComponentType<IconProps> {
  return function DynamicBrandIcon(props: IconProps) {
    return <BrandIcon brandId={brandId} {...props} />;
  };
}

export function getRepairIcon(repairId?: string): React.ComponentType<IconProps> {
  return function DynamicRepairIcon(props: IconProps) {
    return <RepairIcon repairId={repairId} {...props} />;
  };
}
