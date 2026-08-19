"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Camera, Send, X } from "lucide-react";
import { contactInfo } from "@/lib/data";

export function FloatingPhotoQuote() {
  const { language } = useLanguage();
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  const labels = {
    title:
      language === "cs"
        ? "Odhad poškození z fotky"
        : language === "ru"
        ? "Оценка ремонта по фото"
        : "Instant Quote via Photo",
    desc:
      language === "cs"
        ? "Pošlete fotku displeje nebo desky na Telegram — odpovíme do 5 minut."
        : language === "ru"
        ? "Отправьте фото разбитого экрана или платы в Telegram — мастер ответит за 5 мин."
        : "Send a photo of broken screen or board to Telegram — fast 5-min quote.",
    btn:
      language === "cs"
        ? "Poslat na Telegram"
        : language === "ru"
        ? "Написать в Telegram"
        : "Send to Telegram",
    msg:
      language === "cs"
        ? "Dobrý den! Posílám fotografii svého zařízení k orientačnímu posouzení ceny opravy."
        : language === "ru"
        ? "Здравствуйте! Отправляю фото устройства для предварительной оценки стоимости ремонта."
        : "Hello! I am sending a photo of my device for an approximate repair estimate.",
  };

  return (
    <aside
      aria-label={labels.title}
      className="floating-photo-quote"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 90,
        maxWidth: "340px",
        background: "var(--surface)",
        border: "1px solid var(--line-strong)",
        borderRadius: "var(--radius)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        padding: "16px",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        animation: "slideUp 0.3s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "rgba(37, 99, 235, 0.12)",
            color: "var(--accent-blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Camera size={16} />
          </div>
          <strong style={{ fontSize: "13.5px", color: "var(--ink)", fontWeight: 650 }}>
            {labels.title}
          </strong>
        </div>
        <button
          type="button"
          onClick={() => setClosed(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            padding: "2px",
          }}
          aria-label="Close photo quote widget"
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
        {labels.desc}
      </p>

      <a
        href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(labels.msg)}`}
        target="_blank"
        rel="noreferrer"
        className="button button-small"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "8px 12px",
          fontSize: "12.5px",
        }}
      >
        <Send size={14} />
        <span>{labels.btn}</span>
      </a>
    </aside>
  );
}
