export type Repair = { id: string; name: string; description: string; price: number; time: string };
export type DeviceModel = { id: string; name: string; category: string; repairs: Repair[] };
export type Brand = { id: string; name: string; categories: string[]; models: DeviceModel[] };

const iphoneRepairs: Repair[] = [
  { id: "screen", name: "Display replacement", description: "Premium OLED display, calibrated and tested.", price: 7490, time: "2 hours" },
  { id: "battery", name: "Battery replacement", description: "Restore all-day battery life and peak performance.", price: 2490, time: "60 minutes" },
  { id: "back-glass", name: "Back glass repair", description: "Precision glass replacement with a clean factory finish.", price: 3990, time: "3 hours" },
  { id: "charging", name: "Charging port", description: "Cleaning, diagnostics and port replacement if needed.", price: 2990, time: "2 hours" },
  { id: "camera", name: "Camera repair", description: "Resolve focus, image or lens problems.", price: 3290, time: "2 hours" },
  { id: "diagnostics", name: "Diagnostics", description: "A complete hardware and software assessment.", price: 790, time: "1–2 days" },
];
const computerRepairs: Repair[] = [
  { id: "display", name: "Display service", description: "Panel and display assembly diagnostics or replacement.", price: 8990, time: "2–4 days" },
  { id: "battery", name: "Battery replacement", description: "Battery health restoration with full testing.", price: 4490, time: "1 day" },
  { id: "keyboard", name: "Keyboard repair", description: "Top-case, keyboard or individual key service.", price: 4990, time: "2–3 days" },
  { id: "liquid", name: "Liquid damage", description: "Board-level inspection and corrosion treatment.", price: 1490, time: "3–5 days" },
];
const phoneModels = (names: string[], category = "Phone") => names.map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, category, repairs: iphoneRepairs }));

export const brands: Brand[] = [
  { id: "apple", name: "Apple", categories: ["iPhone", "MacBook", "iPad", "Apple Watch", "AirPods"], models: [
    ...phoneModels(["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15"], "iPhone"),
    ...["MacBook Pro 14 M3", "MacBook Air 15 M3", "MacBook Air 13 M2"].map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, category: "MacBook", repairs: computerRepairs })),
    ...["iPad Pro 13", "iPad Air 11", "iPad 10th generation"].map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, category: "iPad", repairs: iphoneRepairs })),
    { id: "apple-watch-series-10", name: "Apple Watch Series 10", category: "Apple Watch", repairs: iphoneRepairs.slice(0, 3) },
    { id: "airpods-pro-2", name: "AirPods Pro 2", category: "AirPods", repairs: iphoneRepairs.slice(1, 2) },
  ]},
  { id: "samsung", name: "Samsung", categories: ["Galaxy Phone", "Tablet"], models: phoneModels(["Galaxy S25 Ultra", "Galaxy S25", "Galaxy S24 Ultra", "Galaxy Z Flip 6"], "Galaxy Phone") },
  { id: "google", name: "Google", categories: ["Pixel Phone"], models: phoneModels(["Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro"], "Pixel Phone") },
  { id: "xiaomi", name: "Xiaomi", categories: ["Phone"], models: phoneModels(["Xiaomi 15 Ultra", "Xiaomi 14", "Redmi Note 14 Pro"]) },
  { id: "huawei", name: "Huawei", categories: ["Phone", "Laptop"], models: phoneModels(["Pura 70 Pro", "Mate 60 Pro"]) },
  { id: "other", name: "Other", categories: ["Phone", "Laptop", "Tablet"], models: [{ id: "other-device", name: "Another device", category: "Phone", repairs: iphoneRepairs }] },
];

export const formatPrice = (price: number) => new Intl.NumberFormat("cs-CZ").format(price) + " Kč";
export const allModels = brands.flatMap((brand) => brand.models.map((model) => ({ ...model, brand: brand.name, brandId: brand.id })));

export const faqs = [
  ["How long does a repair take?", "Many phone repairs are completed the same day. The exact estimate is shown before booking and confirmed after diagnostics."],
  ["Do you use original parts?", "We offer carefully selected premium-quality and, where available, original parts. The exact part option is confirmed before work begins."],
  ["Is my data safe?", "Devices are handled under a strict privacy process. We only request a passcode when testing requires it, and it is always optional at booking."],
  ["Do I need to back up my device?", "We strongly recommend a recent backup. Most repairs do not affect data, but a backup is the safest precaution."],
  ["What warranty do I receive?", "Selected repairs include up to a 12-month service warranty. The applicable term appears in your written estimate."],
  ["Can you repair water-damaged devices?", "Yes. We begin with diagnostics because liquid damage can affect several components and pricing depends on the findings."],
  ["Do I need an appointment?", "Walk-ins are welcome, but an appointment reserves technician time and usually shortens your visit."],
];

export const placeholderNotice = "Demo content — prices, availability, address and trust metrics must be confirmed before launch.";
