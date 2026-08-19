"use client";

import { useLanguage } from "@/lib/i18n/context";
import { CheckCircle2, ShieldCheck, Sparkles, Layers, Cpu, Award, ZoomIn } from "lucide-react";

export function PartsTransparency() {
  const { language } = useLanguage();

  const labels = {
    badge: language === "cs" ? "STANDARDY KVALITY DÍLŮ" : language === "ru" ? "СТАНДАРТЫ ДЕТАЛЕЙ" : "PARTS QUALITY STANDARDS",
    title: language === "cs" ? "Transparentní volba třídy komponentů." : language === "ru" ? "Прозрачный выбор классов комплектующих." : "Transparent Component Grading.",
    subtitle:
      language === "cs"
        ? "Žádné překvapení. U každé opravy přesně víte, jaký typ dílu instalujeme a jaké má technické parametry."
        : language === "ru"
        ? "Никаких сюрпризов. Для каждого ремонта вы точно знаете класс устанавливаемой детали и её технические параметры."
        : "No mystery parts. For every repair, you know exactly what grade of component is installed and its technical specs.",
    techArchBadge: language === "cs" ? "TECHNICKÁ ARCHITEKTURA DISPLEJE" : language === "ru" ? "АРХИТЕКТУРА И СЛОИ ДИСПЛЕЯ" : "OPTICAL DISPLAY STACK ARCHITECTURE",
    techArchTitle: language === "cs" ? "Přesná kalibrace a přenos EEPROM dat" : language === "ru" ? "Ювелирная сборка и перенос EEPROM микросхемы" : "Layer Lamination & EEPROM Serialization",
    techArchDesc:
      language === "cs"
        ? "Při výměně displeje zachováváme původní senzor TrueTone, přenášíme hardwarový identifikační kód z poškozeného panelu a obnovujeme tovární vodotěsné těsnění."
        : language === "ru"
        ? "При замене экрана мы сохраняем работу TrueTone, считываем калибровочные данные со старого модуля и наносим заводскую влагозащитную проклейку."
        : "During screen repair, we migrate the factory EEPROM hardware ID, preserve TrueTone optical balance, and re-apply factory water-resistant seals.",
  };

  const grades = [
    {
      id: "oem",
      badge: language === "cs" ? "MAXIMÁLNÍ KVALITA" : language === "ru" ? "МАКСИМАЛЬНОЕ КАЧЕСТВО" : "MAXIMUM QUALITY",
      title: language === "cs" ? "Original OEM (Заводской оригинал)" : language === "ru" ? "Original OEM (Заводской оригинал)" : "Original OEM (Factory)",
      desc:
        language === "cs"
          ? "Originální díl vyrobený pro daného výrobce. Plné zachování továrních standardů, TrueTone, Face ID a maximální barevný gamut DCI-P3."
          : language === "ru"
          ? "Оригинальная фабричная деталь. Полное сохранение заводских стандартов, TrueTone, Face ID и максимальный цветовой охват DCI-P3."
          : "Genuine OEM factory component. Full factory specs, TrueTone, Face ID support, and complete DCI-P3 color fidelity.",
      icon: Award,
      popular: true,
      perks: [
        language === "cs" ? "100% tovární jas a kalibrace" : language === "ru" ? "100% заводская яркость и калибровка" : "100% factory brightness & calibration",
        language === "cs" ? "ProMotion 120Hz & TrueTone" : language === "ru" ? "ProMotion 120Hz и перенос TrueTone" : "ProMotion 120Hz & TrueTone transfer",
        language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Официальная гарантия 12 месяцев" : "12-month full warranty",
      ],
    },
    {
      id: "refurb",
      badge: language === "cs" ? "EKOLOGICKÁ VOLBA" : language === "ru" ? "ЭКО-ВЫБОР" : "ECO CHOICE",
      title: language === "cs" ? "Refurbished Original (Восстановленный)" : language === "ru" ? "Refurbished Original (Переклейка стекла)" : "Refurbished OEM Matrix",
      desc:
        language === "cs"
          ? "Původní originální OLED matrice s novým tvrzeným sklem v bezprašné komoře. Zcela identické podání barev a rychlost odezvy."
          : language === "ru"
          ? "Родная оригинальная OLED матрица с новым заводским стеклом, заламинированная в беспылевой комнате. Идентичная цветопередача и скорость."
          : "Genuine OEM display matrix with new tempered glass laminated in a class-100 cleanroom. Identical touch latency and colors.",
      icon: Layers,
      popular: false,
      perks: [
        language === "cs" ? "Původní originální OLED čip" : language === "ru" ? "Родной заводской OLED чип" : "Original OEM OLED matrix",
        language === "cs" ? "Oleofobní povrch vysoké tvrdosti" : language === "ru" ? "Олеофобное покрытие высокой стойкости" : "High-durability oleophobic coating",
        language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Официальная гарантия 12 месяцев" : "12-month full warranty",
      ],
    },
    {
      id: "premium",
      badge: language === "cs" ? "DOSTUPNÉ ŘEŠENÍ" : language === "ru" ? "БЮДЖЕТНОЕ РЕШЕНИЕ" : "VALUE OPTION",
      title: language === "cs" ? "Certified High-Grade (Сертифицированный аналог)" : language === "ru" ? "Certified High-Grade (Премиум-аналог)" : "Certified High-Grade Tier-1",
      desc:
        language === "cs"
          ? "Prověřený díl třídy Tier-1 od předních výrobců. Prochází přísným laboratorním testováním polarizace a dotykové vrstvy."
          : language === "ru"
          ? "Проверенная деталь класса Tier-1 от сертифицированных фабрик. Проходит строгий входной контроль поляризации и отклика."
          : "Tested Tier-1 replacement from certified manufacturers. Laboratory inspected for polarization and touch responsiveness.",
      icon: Cpu,
      popular: false,
      perks: [
        language === "cs" ? "Testováno na 18 bodů funkčnosti" : language === "ru" ? "Входной контроль по 18 пунктам" : "18-point lab tested & verified",
        language === "cs" ? "Výborný poměr cena / výkon" : language === "ru" ? "Оптимальный баланс цены и надежности" : "Optimal price-to-performance ratio",
        language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Официальная гарантия 12 месяцев" : "12-month full warranty",
      ],
    },
  ];

  return (
    <div className="parts-transparency-section">
      <div className="section-head text-center">
        <p className="eyebrow justify-center">
          <ShieldCheck size={14} /> {labels.badge}
        </p>
        <h2>{labels.title}</h2>
        <p className="section-copy centered">{labels.subtitle}</p>
      </div>

      {/* Exploded Optical Module Architecture Illustration */}
      <div className="display-exploded-showcase" style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        alignItems: "center",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "28px",
      }}>
        <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "var(--surface-2)" }}>
          <img
            src="/cleanroom-display-exploded.jpg"
            alt="Exploded technical illustration of smartphone OLED display matrix, Ceramic Glass, Polarized Film, and EEPROM Serialization Chip"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div style={{ padding: "32px" }}>
          <span className="eyebrow" style={{ color: "var(--accent-blue)", marginBottom: "6px" }}>
            <ZoomIn size={14} /> {labels.techArchBadge}
          </span>
          <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 }}>
            {labels.techArchTitle}
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 18px" }}>
            {labels.techArchDesc}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--ink)", fontWeight: 550 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> Ceramic Shield & High-Grade Lamination
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> 120Hz ProMotion & TrueTone EEPROM Chip
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> IP68 Waterproof Seal Replacement
            </span>
          </div>
        </div>
      </div>

      <div className="grades-grid">
        {grades.map(grade => {
          const Icon = grade.icon;
          return (
            <div key={grade.id} className={`grade-card ${grade.popular ? "popular" : ""}`}>
              {grade.popular && (
                <span className="grade-popular-tag">
                  <Sparkles size={11} /> {language === "cs" ? "DOPORUČENO" : language === "ru" ? "РЕКОМЕНДУЕМ" : "RECOMMENDED"}
                </span>
              )}
              <div className="grade-header">
                <div className="grade-icon-wrap">
                  <Icon size={22} />
                </div>
                <div>
                  <span className="grade-badge-mono">{grade.badge}</span>
                  <h3>{grade.title}</h3>
                </div>
              </div>
              <p className="grade-desc">{grade.desc}</p>
              <ul className="grade-perks">
                {grade.perks.map((perk, i) => (
                  <li key={i}>
                    <CheckCircle2 size={15} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
