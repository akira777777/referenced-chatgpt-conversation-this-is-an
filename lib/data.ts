export type PartQualityTier = "standard" | "premium" | "original" | "all";
export type PriceFormatMode = "range" | "from" | "approx" | "exact" | "custom";
export type AvailabilityStatus = "in_stock" | "on_order" | "1_2_days";

export type QualityOption = {
  tier: PartQualityTier;
  label: { en: string; cs: string; ru: string };
  priceFrom?: number;
  priceTo?: number;
  exactPrice?: number;
  description: { en: string; cs: string; ru: string };
};

export type Repair = {
  id: string;
  name: string;
  category?: string; // "Battery" | "Display" | "Back Glass" | "Charging" | "Camera" | "Audio" | "Cleaning" | "Diagnostics" | "Board" | "Other"
  description: string;
  price?: number; // legacy backward compatibility
  time?: string; // legacy backward compatibility
  priceFrom?: number;
  priceTo?: number;
  exactPrice?: number;
  priceFormat?: PriceFormatMode;
  currency?: string; // default "CZK"
  partsIncluded?: boolean; // default true
  laborIncluded?: boolean; // default true
  installationIncluded?: boolean; // default true
  testingIncluded?: boolean; // default true
  estimatedDuration?: string; // e.g. "60–90 min"
  qualityTier?: PartQualityTier;
  qualityOptions?: QualityOption[];
  finalPriceRequiresConfirmation?: boolean; // default true
  availability?: AvailabilityStatus;
  customNote?: string;
  diagnosticsPolicy?: "included_if_repaired" | "free" | "standalone";
};

export type DeviceModel = {
  id: string;
  name: string;
  category: string;
  brandId?: string;
  brand?: string;
  generation?: "Older" | "Recent" | "OLED";
  repairs: Repair[];
};

export type Brand = {
  id: string;
  name: string;
  categories: string[];
  models: DeviceModel[];
};

// Helper: Formats thousands with space separator
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Comprehensive Repair Price Formatter
export function formatRepairPrice(
  repair?: Partial<Repair> | null,
  lang: "en" | "cs" | "ru" = "cs",
  options: { showCca?: boolean; compact?: boolean } = {}
): string {
  if (!repair) {
    return lang === "cs" ? "Cena na dotaz" : lang === "ru" ? "Цена по запросу" : "Price on request";
  }

  const { priceFrom, priceTo, exactPrice, priceFormat = "range", currency = "Kč" } = repair;
  const curr = currency === "CZK" ? "Kč" : currency;
  const ccaPrefix = lang === "cs" ? "cca " : lang === "ru" ? "ок. " : "cca ";
  const fromPrefix = lang === "cs" ? "od " : lang === "ru" ? "от " : "from ";

  if (exactPrice !== undefined && exactPrice !== null && exactPrice > 0) {
    return `${formatNumber(exactPrice)} ${curr}`;
  }

  if (priceFrom !== undefined && priceTo !== undefined && priceFrom > 0 && priceTo > 0) {
    const formattedRange = `${formatNumber(priceFrom)}–${formatNumber(priceTo)} ${curr}`;
    return options.showCca ? `${ccaPrefix}${formattedRange}` : formattedRange;
  }

  if (priceFrom === 0 && priceTo !== undefined && priceTo > 0) {
    return `0–${formatNumber(priceTo)} ${curr}`;
  }

  if (priceFrom !== undefined && priceFrom > 0) {
    return `${fromPrefix}${formatNumber(priceFrom)} ${curr}`;
  }

  if (priceFormat === "approx" && exactPrice) {
    return `${ccaPrefix}${formatNumber(exactPrice)} ${curr}`;
  }

  // Fallback for legacy price number
  if (repair.price && repair.price > 0) {
    return `${formatNumber(repair.price)} ${curr}`;
  }

  return lang === "cs" ? "Cena na dotaz" : lang === "ru" ? "Цена по запросу" : "Price on request";
}

export const formatPrice = (_price?: number) => "Price on request";

// Quality Options Preset
const displayQualityOptions: QualityOption[] = [
  {
    tier: "standard",
    label: { en: "Standard", cs: "Standardní", ru: "Стандарт" },
    description: {
      en: "High-quality tested compatible component.",
      cs: "Vysoce kvalitní otestovaný kompatibilní díl.",
      ru: "Качественный проверенный аналог высокого уровня.",
    },
  },
  {
    tier: "premium",
    label: { en: "Premium", cs: "Prémiový OEM", ru: "Премиум OEM" },
    description: {
      en: "Higher-grade OEM component with factory color accuracy & TrueTone calibration.",
      cs: "Špičkový díl v OEM kvalitě se zachováním barev a kalibrací TrueTone.",
      ru: "Высококлассный OEM модуль с точной цветопередачей и калибровкой TrueTone.",
    },
  },
  {
    tier: "original",
    label: { en: "Original", cs: "Originální", ru: "Оригинал" },
    description: {
      en: "Original or genuine-pull component where available (subject to stock).",
      cs: "Originální díl z distribuce nebo originální demontáž (dle dostupnosti).",
      ru: "Оригинальный компонент или оригинал с разбора при наличии.",
    },
  },
];

// iPhone Standardized Repairs Generator
function makeIphoneRepairs(isRecent: boolean = true, isOled: boolean = true): Repair[] {
  return [
    {
      id: "battery",
      name: "Battery replacement",
      category: "Battery",
      description: "Restore all-day battery life, peak performance, and fast charging.",
      priceFrom: isRecent ? 1490 : 1000,
      priceTo: isRecent ? 2500 : 1500,
      priceFormat: "range",
      currency: "Kč",
      partsIncluded: true,
      laborIncluded: true,
      installationIncluded: true,
      testingIncluded: true,
      estimatedDuration: isRecent ? "60–90 min" : "45–60 min",
      time: isRecent ? "60–90 min" : "45–60 min",
      finalPriceRequiresConfirmation: true,
      availability: "in_stock",
    },
    {
      id: "screen",
      name: "Display replacement",
      category: "Display",
      description: "Precision display assembly swap, calibrated TrueTone and touch sensors.",
      priceFrom: isOled ? 2500 : 1500,
      priceTo: isOled ? 6000 : 3000,
      priceFormat: "range",
      currency: "Kč",
      partsIncluded: true,
      laborIncluded: true,
      installationIncluded: true,
      testingIncluded: true,
      estimatedDuration: "60–90 min",
      time: "60–90 min",
      qualityTier: isOled ? "premium" : "standard",
      qualityOptions: displayQualityOptions,
      finalPriceRequiresConfirmation: true,
      availability: "in_stock",
    },
    {
      id: "back-glass",
      name: "Back glass replacement",
      category: "Back Glass",
      description: "Precision laser back glass removal and clean factory-grade fitment.",
      priceFrom: 1500,
      priceTo: 3500,
      priceFormat: "range",
      currency: "Kč",
      partsIncluded: true,
      laborIncluded: true,
      installationIncluded: true,
      testingIncluded: true,
      estimatedDuration: "2–3 hours",
      time: "2–3 hours",
      finalPriceRequiresConfirmation: true,
      availability: "in_stock",
    },
    {
      id: "charging",
      name: "Charging port repair / replacement",
      category: "Charging",
      description: "Ultrasonic cleaning or flex connector swap for reliable fast charging.",
      priceFrom: 1200,
      priceTo: 2500,
      priceFormat: "range",
      currency: "Kč",
      partsIncluded: true,
      laborIncluded: true,
      installationIncluded: true,
      testingIncluded: true,
      estimatedDuration: "60–90 min",
      time: "60–90 min",
      finalPriceRequiresConfirmation: true,
      availability: "in_stock",
    },
    {
      id: "camera",
      name: "Camera replacement",
      category: "Camera",
      description: "Restore crystal-clear focus, optical image stabilization, and lens glass.",
      priceFrom: 1500,
      priceTo: 3500,
      priceFormat: "range",
      currency: "Kč",
      partsIncluded: true,
      laborIncluded: true,
      installationIncluded: true,
      testingIncluded: true,
      estimatedDuration: "60–90 min",
      time: "60–90 min",
      finalPriceRequiresConfirmation: true,
      availability: "in_stock",
    },
    {
      id: "speaker-mic",
      name: "Speaker / microphone repair",
      category: "Audio",
      description: "Acoustic mesh cleaning, earpiece module or microphone replacement.",
      priceFrom: 1000,
      priceTo: 2000,
      priceFormat: "range",
      currency: "Kč",
      partsIncluded: true,
      laborIncluded: true,
      installationIncluded: true,
      testingIncluded: true,
      estimatedDuration: "60–90 min",
      time: "60–90 min",
      finalPriceRequiresConfirmation: true,
      availability: "in_stock",
    },
    {
      id: "diagnostics",
      name: "Diagnostics",
      category: "Diagnostics",
      description: "Complete hardware & software testing. Included/free if you proceed with repair.",
      priceFrom: 0,
      priceTo: 500,
      priceFormat: "range",
      currency: "Kč",
      partsIncluded: true,
      laborIncluded: true,
      installationIncluded: true,
      testingIncluded: true,
      estimatedDuration: "Same day · 1–2 days",
      time: "1–2 days",
      finalPriceRequiresConfirmation: true,
      diagnosticsPolicy: "included_if_repaired",
      availability: "in_stock",
    },
  ];
}

// MacBook Standardized Repairs
const macbookRepairs: Repair[] = [
  {
    id: "cleaning",
    name: "Internal cleaning",
    category: "Cleaning",
    description: "Opening MacBook, dust removal, fan cleaning, internal inspection & basic testing.",
    priceFrom: 700,
    priceTo: 1200,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 hours",
    time: "1–2 hours",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "usb-c",
    name: "USB-C / charging port repair",
    category: "Charging",
    description: "Port module replacement or board-level repair depending on model.",
    priceFrom: 1500,
    priceTo: 3500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 days",
    time: "1–2 days",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "battery",
    name: "Battery replacement",
    category: "Battery",
    description: "New high-capacity certified battery cells with full cycle calibration.",
    priceFrom: 2500,
    priceTo: 5000,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1 day",
    time: "1 day",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "display",
    name: "Display replacement",
    category: "Display",
    description: "Lid assembly or panel swap (depends on model, generation & part tier).",
    priceFrom: 5000,
    priceTo: 12000,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "2–3 days",
    time: "2–3 days",
    qualityTier: "premium",
    finalPriceRequiresConfirmation: true,
    availability: "1_2_days",
  },
  {
    id: "keyboard",
    name: "Keyboard / top-case repair",
    category: "Other",
    description: "Individual key mechanism replacement or complete top case assembly.",
    priceFrom: 2000,
    priceTo: 4500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "2–3 days",
    time: "2–3 days",
    finalPriceRequiresConfirmation: true,
    availability: "1_2_days",
  },
  {
    id: "liquid",
    name: "Liquid damage & logic board repair",
    category: "Board",
    description: "Ultrasonic bath, corrosion cleanup & micro-soldering BGA circuit inspection.",
    priceFrom: 2500,
    priceTo: 6500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "3–5 days",
    time: "3–5 days",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    category: "Diagnostics",
    description: "Full circuit board & component diagnosis. Free when repair is performed.",
    priceFrom: 0,
    priceTo: 500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 days",
    time: "1–2 days",
    diagnosticsPolicy: "included_if_repaired",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
];

// iPad Standardized Repairs
const ipadRepairs: Repair[] = [
  {
    id: "battery",
    name: "Battery replacement",
    category: "Battery",
    description: "High capacity replacement battery cell, safely adhered and calibrated.",
    priceFrom: 1800,
    priceTo: 3500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 days",
    time: "1–2 days",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "screen",
    name: "Display / glass repair",
    category: "Display",
    description: "Digitizer glass or full laminated Retina panel replacement.",
    priceFrom: 2000,
    priceTo: 5000,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 days",
    time: "1–2 days",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "charging",
    name: "Charging port repair",
    category: "Charging",
    description: "Lightning or USB-C port module replacement and test.",
    priceFrom: 1200,
    priceTo: 2500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 days",
    time: "1–2 days",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    category: "Diagnostics",
    description: "Full hardware testing. Credited toward final repair cost.",
    priceFrom: 0,
    priceTo: 500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 days",
    time: "1–2 days",
    diagnosticsPolicy: "included_if_repaired",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
];

// Samsung / Android Standardized Repairs
const androidRepairs: Repair[] = [
  {
    id: "battery",
    name: "Battery replacement",
    category: "Battery",
    description: "Certified grade-A battery replacement with waterproof seal re-application.",
    priceFrom: 1000,
    priceTo: 2000,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "60–90 min",
    time: "60–90 min",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "screen",
    name: "Display replacement",
    category: "Display",
    description: "Dynamic AMOLED or OLED module swap with fingerprint sensor calibration.",
    priceFrom: 2000,
    priceTo: 6000,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "1–2 hours",
    time: "1–2 hours",
    qualityTier: "premium",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "charging",
    name: "Charging port",
    category: "Charging",
    description: "Sub-board or Type-C port replacement for fast charging restoration.",
    priceFrom: 1000,
    priceTo: 2500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "60–90 min",
    time: "60–90 min",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "camera",
    name: "Camera replacement",
    category: "Camera",
    description: "Replacement of scratched camera glass or malfunctioning sensor module.",
    priceFrom: 1200,
    priceTo: 3000,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "60–90 min",
    time: "60–90 min",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    category: "Diagnostics",
    description: "Comprehensive testing. Free if you proceed with repair.",
    priceFrom: 0,
    priceTo: 500,
    priceFormat: "range",
    currency: "Kč",
    partsIncluded: true,
    laborIncluded: true,
    installationIncluded: true,
    testingIncluded: true,
    estimatedDuration: "Same day · 1–2 days",
    time: "1–2 days",
    diagnosticsPolicy: "included_if_repaired",
    finalPriceRequiresConfirmation: true,
    availability: "in_stock",
  },
];

// Helper to generate iPhone models
const iphoneModelsList = (names: string[], isRecent: boolean = true) =>
  names.map(name => {
    let repairs = makeIphoneRepairs(isRecent, true);
    if (name === "iPhone 13") {
      repairs = repairs.map(r => {
        if (r.id === "battery") {
          return { ...r, priceFrom: 1490, priceTo: 1790, estimatedDuration: "60–90 min", time: "60–90 min" };
        }
        return r;
      });
    }
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      category: "iPhone",
      generation: (isRecent ? "Recent" : "Older") as "Recent" | "Older",
      repairs,
    };
  });

export const brands: Brand[] = [
  {
    id: "apple",
    name: "Apple",
    categories: ["iPhone", "MacBook", "iPad", "Apple Watch", "AirPods"],
    models: [
      ...iphoneModelsList(["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro", "iPhone 13", "iPhone 12 Pro", "iPhone 12"], true),
      ...iphoneModelsList(["iPhone 11 Pro", "iPhone 11", "iPhone XS", "iPhone XR", "iPhone X", "iPhone SE 2022"], false),
      ...["MacBook Pro 16 M3", "MacBook Pro 14 M3", "MacBook Air 15 M3", "MacBook Air 13 M2", "MacBook Pro 13 M1", "MacBook Air M1"].map(name => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        category: "MacBook",
        repairs: macbookRepairs,
      })),
      ...["iPad Pro 13 M4", "iPad Pro 11 M4", "iPad Air 11 M2", "iPad 10th generation", "iPad mini 6"].map(name => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        category: "iPad",
        repairs: ipadRepairs,
      })),
      {
        id: "apple-watch-series-10",
        name: "Apple Watch Series 10",
        category: "Apple Watch",
        repairs: makeIphoneRepairs(true, true).slice(0, 3),
      },
      {
        id: "airpods-pro-2",
        name: "AirPods Pro 2",
        category: "AirPods",
        repairs: makeIphoneRepairs(true, false).slice(0, 2),
      },
    ],
  },
  {
    id: "samsung",
    name: "Samsung",
    categories: ["Galaxy Phone", "Tablet"],
    models: ["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S24 Ultra", "Galaxy S24", "Galaxy Z Fold 6", "Galaxy Z Flip 6", "Galaxy A55"].map(name => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      category: "Galaxy Phone",
      repairs: androidRepairs,
    })),
  },
  {
    id: "google",
    name: "Google",
    categories: ["Pixel Phone"],
    models: ["Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro"].map(name => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      category: "Pixel Phone",
      repairs: androidRepairs,
    })),
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    categories: ["Phone"],
    models: ["Xiaomi 15 Ultra", "Xiaomi 14 Pro", "Xiaomi 14", "Redmi Note 14 Pro+", "Redmi Note 13 Pro", "POCO F6 Pro"].map(name => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      category: "Phone",
      repairs: androidRepairs,
    })),
  },
  {
    id: "huawei",
    name: "Huawei",
    categories: ["Phone", "Laptop"],
    models: ["Pura 70 Ultra", "Pura 70 Pro", "Mate 60 Pro", "P60 Pro"].map(name => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      category: "Phone",
      repairs: androidRepairs,
    })),
  },
  {
    id: "other",
    name: "Other",
    categories: ["Phone", "Laptop", "Tablet"],
    models: [
      {
        id: "other-device",
        name: "Another device",
        category: "Phone",
        repairs: androidRepairs,
      },
    ],
  },
];

export const allModels = brands.flatMap(brand =>
  brand.models.map(model => ({
    ...model,
    brand: brand.name,
    brandId: brand.id,
  }))
);

export const faqs = [
  ["How long does a repair take?", "Many phone repairs are completed the same day in 45–90 minutes. The exact estimate is shown before booking and confirmed after diagnostics."],
  ["Do displayed prices include parts and labor?", "Yes! Every displayed price is an approximate total price that includes the replacement part, technician labor, installation, and basic testing."],
  ["Can the final price change without my permission?", "Never. We always confirm the final price before starting the repair. If additional damage is discovered during inspection, you will be contacted first."],
  ["Do you use original parts?", "We offer carefully selected premium-quality and, where available, genuine parts. We never claim a part is Apple original unless it genuinely is."],
  ["What is your diagnostics policy?", "Initial diagnostics (0–500 Kč) are completely free of charge if you decide to proceed with the repair."],
  ["Is my data safe?", "Devices are handled under a strict privacy process. Most hardware repairs do not affect data, though we always recommend a recent backup."],
  ["What warranty do I receive?", "All completed repairs include up to a 12-month service warranty covering both replaced components and technician labor."],
  ["Do I need an appointment?", "Walk-ins are welcome at Biskupcova 31 (Praha 3), but booking an appointment reserves dedicated technician time."],
];

export const contactInfo = {
  brandName: "Reform",
  addressStreet: "Biskupcova 31",
  addressDistrict: "Praha 3",
  addressCity: "Praha 3",
  addressFull: "Biskupcova 31, Praha 3",
  postalCode: "130 00",
  city: "Praha",
  country: "CZ",
  phone: "+420 737 500 587",
  phoneRaw: "+420737500587",
  email: "fear75412@gmail.com",
  telegram: "@liltrafficRUS",
  telegramUrl: "https://t.me/liltrafficRUS",
  pricingPolicy: "All repair prices include parts and labor. The final price is agreed individually before work begins.",
};

export const placeholderNotice = "Availability, opening hours and trust metrics are demonstration content until confirmed.";
