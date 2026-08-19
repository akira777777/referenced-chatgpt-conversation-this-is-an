"use client";

import { useLanguage } from "@/lib/i18n/context";
import { Microscope, Flame, Wind, Gauge, Cpu } from "lucide-react";

export function LabEquipment() {
  const { language } = useLanguage();

  const labels = {
    badge: language === "cs" ? "VYBAVENÍ NAŠÍ LABORATOŘE" : language === "ru" ? "ОБОРУДОВАНИЕ ЛАБОРАТОРИИ" : "LABORATORY EQUIPMENT",
    title: language === "cs" ? "Inženýrská technika bez kompromisů." : language === "ru" ? "Инженерная база без компромиссов." : "Engineering Grade Infrastructure.",
    subtitle:
      language === "cs"
        ? "Využíváme profesionální mikroskopy, termokamery a BGA pájecí stanice pro bezpečnou obnovu i těch nejsložitějších mikrospojů."
        : language === "ru"
        ? "Мы используем профессиональные микроскопы, тепловизоры и BGA паяльные станции для безопасного восстановления микросхем и дорожек."
        : "We deploy industrial-grade microscopes, thermal diagnostics, and BGA rework stations for microscopic board restoration.",
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
