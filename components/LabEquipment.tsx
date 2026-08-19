"use client";

import { useLanguage } from "@/lib/i18n/context";
import { Microscope, Flame, Wind, Gauge, Cpu, CheckCircle2 } from "lucide-react";

export function LabEquipment() {
  const { language } = useLanguage();

  const labels = {
    badge: language === "cs" ? "VYBAVENÍ NAŠÍ LABORATOŘE" : language === "ru" ? "ОБОРУДОВАНИЕ ЛАБОРАТОРИИ" : "LABORATORY EQUIPMENT",
    title: language === "cs" ? "Inženýrská technika bez kompromisů." : language === "ru" ? "Инженерная база без компромиссов." : "Engineering Grade Infrastructure.",
    subtitle:
      language === "cs"
        ? "Využíváme profesionální mikroskopy Leica, termokamery Flir a BGA pájecí stanice JBC pro bezpečnou obnovu i těch nejsložitějších mikrospojů."
        : language === "ru"
        ? "Мы используем профессиональные микроскопы Leica, тепловизоры Flir и BGA паяльные станции JBC для безопасного восстановления микросхем и дорожек."
        : "We deploy industrial-grade Leica stereo optics, Flir thermal diagnostics, and JBC soldering stations for microscopic board restoration.",
    workbenchBadge: language === "cs" ? "PRACOVIŠTĚ PRAHA 3" : language === "ru" ? "РАБОЧЕЕ МЕСТО В ПРАГЕ 3" : "PRAGUE 3 WORKBENCH",
    workbenchTitle: language === "cs" ? "Pracovní stůl s ESD ochranou a termodiagnostikou" : language === "ru" ? "Антистатическое рабочее место с тепловизионным контролем" : "ESD-Protected Diagnostics & Rework Station",
    microsolderBadge: language === "cs" ? "MIKROPÁJENÍ 0.02 MM" : language === "ru" ? "МИКРОПАЙКА 0.02 ММ" : "0.02MM MICRO-JUMPERS",
    microsolderTitle: language === "cs" ? "Obnova přerušených spojů pod mikroskopem" : language === "ru" ? "Восстановление оборванных дорожек под микроскопом" : "Microscope Trace Reconstruction",
  };

  const tools = [
    {
      icon: Microscope,
      title: language === "cs" ? "Optický mikroskop 45×" : language === "ru" ? "Оптический микроскоп 45×" : "45× Stereo Optical Microscope",
      desc:
        language === "cs"
          ? "Kontrola spojů a mikropropojek o tloušťce 0,02 mm pod stabilním LED osvětlením."
          : language === "ru"
          ? "Контроль пайки и восстановление проводников толщиной 0,02 мм с кольцевой подсветкой."
          : "Inspection and micro-jumper restoration for 0.02mm logic board traces.",
      tag: "0.02 mm BGA",
    },
    {
      icon: Flame,
      title: language === "cs" ? "Termokamera Flir High-Res" : language === "ru" ? "Тепловизор Flir High-Res" : "Flir Thermal Imaging",
      desc:
        language === "cs"
          ? "Lokalizace zkratů a přehřívajících se SMD součástek během několika sekund bez rizika pro desku."
          : language === "ru"
          ? "Локализация коротких замыканий и перегревающихся SMD компонентов за секунды."
          : "Instant short-circuit detection and thermal profiling of damaged power rails.",
      tag: "0.1°C ΔT",
    },
    {
      icon: Wind,
      title: language === "cs" ? "Bezprašná laminovací komora" : language === "ru" ? "Беспылевой ламинатор OCA" : "Class-100 Laminator",
      desc:
        language === "cs"
          ? "Laminace krycích skel displejů v prostředí s HEPA filtrací bez prachových částic."
          : language === "ru"
          ? "Переклейка стекол экранов в среде с глубокой HEPA-фильтрацией без единой пылинки."
          : "Cleanroom display lamination ensuring factory optical bonding without dust particles.",
      tag: "Class-100",
    },
    {
      icon: Gauge,
      title: language === "cs" ? "Programátory EEPROM & TrueTone" : language === "ru" ? "Программаторы EEPROM и TrueTone" : "EEPROM & TrueTone Programmers",
      desc:
        language === "cs"
          ? "Záloha a přenos továrních kalibračních dat pro TrueTone, Face ID a stav baterie."
          : language === "ru"
          ? "Считывание и перенос заводских калибровок TrueTone, Face ID и серийных номеров батареи."
          : "Serialization transfer and optical calibration backup for TrueTone and battery health.",
      tag: "I²C / SMBus",
    },
  ];

  return (
    <div className="lab-equipment-section">
      <div className="section-head text-center">
        <p className="eyebrow justify-center">
          <Cpu size={14} /> {labels.badge}
        </p>
        <h2>{labels.title}</h2>
        <p className="section-copy centered">{labels.subtitle}</p>
      </div>

      {/* Visual Photography & Illustration Dual Showcase */}
      <div className="lab-visual-gallery" style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "20px",
        marginBottom: "28px",
      }}>
        <div className="lab-showcase-item" style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          position: "relative",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
            <img
              src="/prague-precision-workbench.jpg"
              alt="Reform Prague Laboratory precision workbench with Leica microscope and Flir thermal camera"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              decoding="async"
            />
          </div>
          <div style={{ padding: "18px 24px" }}>
            <span className="eyebrow" style={{ color: "var(--accent-blue)", marginBottom: "4px" }}>
              {labels.workbenchBadge}
            </span>
            <h4 style={{ fontSize: "16px", fontWeight: 650, margin: "0 0 6px" }}>
              {labels.workbenchTitle}
            </h4>
            <div style={{ display: "flex", gap: "16px", fontSize: "12.5px", color: "var(--muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} style={{ color: "var(--success)" }} /> Leica Stereo 45×
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} style={{ color: "var(--success)" }} /> JBC Soldering 360°C
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} style={{ color: "var(--success)" }} /> Flir Thermal Monitor
              </span>
            </div>
          </div>
        </div>

        <div className="lab-showcase-item" style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          position: "relative",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
            <img
              src="/lab-microsoldering.jpg"
              alt="Micro-soldering 0.02mm jump wires under microscope"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              decoding="async"
            />
          </div>
          <div style={{ padding: "18px 24px" }}>
            <span className="eyebrow" style={{ color: "var(--accent-blue)", marginBottom: "4px" }}>
              {labels.microsolderBadge}
            </span>
            <h4 style={{ fontSize: "16px", fontWeight: 650, margin: "0 0 6px" }}>
              {labels.microsolderTitle}
            </h4>
            <div style={{ display: "flex", gap: "16px", fontSize: "12.5px", color: "var(--muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} style={{ color: "var(--success)" }} /> 0.02mm Gold Wire
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} style={{ color: "var(--success)" }} /> BGA Reballing
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="equipment-grid">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div key={idx} className="equipment-card">
              <div className="equipment-top">
                <div className="equipment-icon-wrap">
                  <Icon size={22} />
                </div>
                <span className="equipment-tag">{tool.tag}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
