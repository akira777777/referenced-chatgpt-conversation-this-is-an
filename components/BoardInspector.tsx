"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Microscope, Flame, Activity, Zap, Cpu, ZoomIn } from "lucide-react";

export function BoardInspector() {
  const { language } = useLanguage();
  const [activeMode, setActiveMode] = useState<"microscope" | "thermal" | "schematic">("microscope");
  const [activeChip, setActiveChip] = useState<string>("pmic");

  const labels = {
    badge: language === "cs" ? "LABORATORNÍ SIMULÁTOR DIAGNOSTIKY" : language === "ru" ? "ЛАБОРАТОРНЫЙ СИМУЛЯТОР ДИАГНОСТИКИ" : "LABORATORY DIAGNOSTIC SIMULATOR",
    title: language === "cs" ? "Lokalizace závad na úrovni mikroskopu." : language === "ru" ? "Поиск неисправностей на уровне микроскопа." : "Component-Level Fault Localization.",
    subtitle:
      language === "cs"
        ? "Prozkoumejte, jak naši inženýři diagnostikují zkraty a přerušené spoje pomocí termokamery Flir a 45× stereo mikroskopu."
        : language === "ru"
        ? "Попробуйте интерактивную диагностику: как наши инженеры локализуют короткие замыкания и восстанавливают микросхемы с помощью тепловизора и оптики Leica."
        : "Explore how our engineers pinpoint short-circuits and micro-trace fractures using Flir thermal imaging and 45× Leica stereo optics.",
    modeMicro: language === "cs" ? "45× Mikroskop" : language === "ru" ? "45× Микроскоп" : "45× Optics",
    modeThermal: language === "cs" ? "Termokamera Flir" : language === "ru" ? "Тепловизор Flir" : "Flir Thermal",
    modeSchematic: language === "cs" ? "Schéma zapojení" : language === "ru" ? "Схема и шины питания" : "Voltage Rails",
  };

  const chipsData = {
    pmic: {
      name: "U2000 Main PMIC (Power Management IC)",
      voltage: "VDD_MAIN: 4.20 V / 1.85 A Short",
      temp: "+74.2 °C (Hotspot ΔT +51°C)",
      symptom:
        language === "cs"
          ? "Telefon se nezapíná, vysoký odběr proudu po zapojení do nabíječky."
          : language === "ru"
          ? "Аппарат не включается, греется в верхней части платы при подключении кабеля."
          : "Device dead, massive current draw immediately upon connecting charger.",
      solution:
        language === "cs"
          ? "Výměna proraženého keramického kondenzátoru C1042 a reballing řídicího čipu PMIC."
          : language === "ru"
          ? "Устранение пробитого фильтрующего конденсатора C1042 и реболлинг контроллера питания."
          : "Removal of shorted bypass capacitor C1042 and BGA reballing of PMIC controller.",
      status: language === "cs" ? "Zkrat lokalizován" : language === "ru" ? "Короткое замыкание локализовано" : "Short-Circuit Pinpointed",
    },
    nand: {
      name: "U1500 NVMe NAND Flash (512 GB)",
      voltage: "PP1V8_NAND: 1.80 V / Stable",
      temp: "+28.5 °C (Nominal)",
      symptom:
        language === "cs"
          ? "Nekonečné restartování (bootloop), chyba iTunes 4013 / 9."
          : language === "ru"
          ? "Циклическая перезагрузка на яблоке (Bootloop), ошибка прошивки 4013 / 9."
          : "Endless bootloop on logo, recovery error 4013 / 9.",
      solution:
        language === "cs"
          ? "Přepájení BGA kuliček paměťového čipu, obnova integrity I²C sběrnice."
          : language === "ru"
          ? "Реболлинг BGA выводов флеш-памяти, восстановление целостности шины I²C."
          : "Underfill cleaning, precision BGA reballing, and I²C trace reconstruction.",
      status: language === "cs" ? "Integrita dat zachována" : language === "ru" ? "Данные сохранены на 100%" : "Data Integrity 100% Preserved",
    },
    audio: {
      name: "U3101 Audio Codec IC",
      voltage: "PP_CODEC_1V8: 1.78 V / Line Pad Lift",
      temp: "+31.0 °C (Nominal)",
      symptom:
        language === "cs"
          ? "Nefunkční mikrofon při hovoru, zašedlá ikona diktafonu."
          : language === "ru"
          ? "Не работает микрофон при звонках, неактивна кнопка диктофона (залипание)."
          : "Inoperable loudspeaker/mic during calls, grayed-out voice memos.",
      solution:
        language === "cs"
          ? "Mikropájení zpevňujícího 0,02 mm mikropropoje na pad C12 pod audio čipem."
          : language === "ru"
          ? "Микропайка армированного джампера 0,02 мм на контактную площадку C12 под чипом."
          : "Installation of 0.02mm insulated jumper on severed C12 master audio rail.",
      status: language === "cs" ? "Mikropropojka aplikována" : language === "ru" ? "Микро-джампер установлен" : "Micro-Jumper Applied",
    },
  };

  const selected = chipsData[activeChip as keyof typeof chipsData] || chipsData.pmic;

  return (
    <div className="board-inspector-card" style={{
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      padding: "36px",
      boxShadow: "var(--shadow-sm)",
      margin: "40px 0",
    }}>
      <div className="section-head text-center" style={{ marginBottom: "28px" }}>
        <p className="eyebrow justify-center">
          <Activity size={14} /> {labels.badge}
        </p>
        <h2 style={{ fontSize: "26px", fontWeight: 700, margin: "6px 0 10px" }}>{labels.title}</h2>
        <p className="section-copy centered">{labels.subtitle}</p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setActiveMode("microscope")}
          className={`button ${activeMode === "microscope" ? "" : "button-secondary"}`}
          style={{ padding: "8px 18px", fontSize: "13px" }}
        >
          <Microscope size={15} /> {labels.modeMicro}
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("thermal")}
          className={`button ${activeMode === "thermal" ? "" : "button-secondary"}`}
          style={{ padding: "8px 18px", fontSize: "13px" }}
        >
          <Flame size={15} /> {labels.modeThermal}
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("schematic")}
          className={`button ${activeMode === "schematic" ? "" : "button-secondary"}`}
          style={{ padding: "8px 18px", fontSize: "13px" }}
        >
          <Zap size={15} /> {labels.modeSchematic}
        </button>
      </div>

      {/* Main Interactive Inspection Stage */}
      <div className="inspector-stage-grid" style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "24px",
        alignItems: "stretch",
      }}>
        {/* Left: Visual Board Simulation Canvas */}
        <div style={{
          background: activeMode === "thermal" ? "linear-gradient(135deg, #0b0e14 0%, #1e102a 50%, #2e0814 100%)" : "var(--surface-2)",
          border: "1px solid var(--line-strong)",
          borderRadius: "var(--radius)",
          padding: "24px",
          position: "relative",
          minHeight: "360px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}>
          {/* Overlay Status Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
            <span style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "11px",
              padding: "4px 8px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.6)",
              color: activeMode === "thermal" ? "#ff7b72" : "#58a6ff",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              {activeMode === "microscope" ? "45× LEICA OPTICAL FEED" : activeMode === "thermal" ? "FLIR IR THERMOGRAPHY 640×480" : "CAD BOARDVIEW & SCHEMATIC"}
            </span>
            <span style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "11px",
              color: "var(--muted)",
              background: "var(--surface)",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
            }}>
              {selected.temp}
            </span>
          </div>

          {/* Interactive Chips on Board */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            margin: "24px 0",
            position: "relative",
            zIndex: 2,
          }}>
            <button
              type="button"
              onClick={() => setActiveChip("pmic")}
              style={{
                background: activeChip === "pmic" ? (activeMode === "thermal" ? "rgba(255, 60, 0, 0.3)" : "rgba(37, 99, 235, 0.15)") : "var(--surface)",
                border: activeChip === "pmic" ? (activeMode === "thermal" ? "2px solid #ff453a" : "2px solid var(--accent-blue)") : "1px solid var(--line)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <Cpu size={18} style={{ color: activeChip === "pmic" ? "#ff453a" : "var(--muted)" }} />
                <span style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)", color: "#ff453a", fontWeight: 700 }}>
                  {activeMode === "thermal" ? "HOTSPOT +74°C" : "U2000"}
                </span>
              </div>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ink)" }}>Main Power PMIC</strong>
              <small style={{ color: "var(--muted)", fontSize: "11px" }}>VDD_MAIN Short</small>
            </button>

            <button
              type="button"
              onClick={() => setActiveChip("nand")}
              style={{
                background: activeChip === "nand" ? "rgba(37, 99, 235, 0.15)" : "var(--surface)",
                border: activeChip === "nand" ? "2px solid var(--accent-blue)" : "1px solid var(--line)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <Cpu size={18} style={{ color: activeChip === "nand" ? "var(--accent-blue)" : "var(--muted)" }} />
                <span style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)", color: "var(--muted)" }}>
                  U1500
                </span>
              </div>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ink)" }}>NAND NVMe Flash</strong>
              <small style={{ color: "var(--muted)", fontSize: "11px" }}>Error 4013 Trace</small>
            </button>

            <button
              type="button"
              onClick={() => setActiveChip("audio")}
              style={{
                background: activeChip === "audio" ? "rgba(37, 99, 235, 0.15)" : "var(--surface)",
                border: activeChip === "audio" ? "2px solid var(--accent-blue)" : "1px solid var(--line)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                textAlign: "left",
                cursor: "pointer",
                gridColumn: "span 2",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <Cpu size={18} style={{ color: activeChip === "audio" ? "var(--accent-blue)" : "var(--muted)" }} />
                <span style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)", color: "var(--muted)" }}>
                  U3101 · Audio Subsystem
                </span>
              </div>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ink)" }}>Audio Codec IC (Pad Lift C12)</strong>
              <small style={{ color: "var(--muted)", fontSize: "11px" }}>Micro-jumper repair</small>
            </button>
          </div>

          {/* Bottom Diagnostics Strip */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: "var(--radius-sm)",
            fontSize: "12px",
            color: "#e6edf3",
            zIndex: 2,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <ZoomIn size={14} style={{ color: "var(--accent-blue)" }} />
              {language === "cs" ? "Klikněte na čip pro zobrazení protokolu" : language === "ru" ? "Нажмите на чип для анализа поломки" : "Click chip to inspect protocol"}
            </span>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#7ee787" }}>
              PASS 18/18 QA
            </span>
          </div>
        </div>

        {/* Right: Technical Protocol Card */}
        <div style={{
          background: "var(--surface-2)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "10.5px",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "4px",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                color: "var(--accent-blue)",
                fontWeight: 600,
              }}>
                {selected.status}
              </span>
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 14px", color: "var(--ink)" }}>
              {selected.name}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <div style={{ padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}>
                <small style={{ display: "block", fontSize: "10.5px", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>
                  {language === "cs" ? "Příznaky vady:" : language === "ru" ? "Симптомы поломки:" : "Observed Symptoms:"}
                </small>
                <span style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.4 }}>{selected.symptom}</span>
              </div>

              <div style={{ padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}>
                <small style={{ display: "block", fontSize: "10.5px", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>
                  {language === "cs" ? "Laboratorní řešení:" : language === "ru" ? "Инженерное решение:" : "Laboratory Remediation:"}
                </small>
                <span style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.4 }}>{selected.solution}</span>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: "14px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: "12.5px",
            color: "var(--muted)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{language === "cs" ? "Telemetrie napájení:" : language === "ru" ? "Телеметрия шины:" : "Bus Telemetry:"}</span>
              <strong style={{ fontFamily: "var(--font-geist-mono)", color: "var(--ink)" }}>{selected.voltage}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{language === "cs" ? "Záruka na mikroopravu:" : language === "ru" ? "Гарантия на ремонт:" : "Warranty:"}</span>
              <strong style={{ color: "var(--success)" }}>12 {language === "cs" ? "měsíců" : language === "ru" ? "месяцев" : "months"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
