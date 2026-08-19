"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Wrench, ShieldCheck, Cpu, Send, Sparkles } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { DeviceGlyph, PlaceholderTag } from "@/components/ui";
import { brands, contactInfo } from "@/lib/data";
import { StructuredData } from "@/components/StructuredData";
import { useLanguage } from "@/lib/i18n/context";
import { BrandIcon } from "@/components/BrandIcons";

export default function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: id } = use(params);
  const { language, t } = useLanguage();
  const brand = brands.find(b => b.id === id);

  if (!brand) notFound();

  const brandPerks: Record<string, { title: string; desc: string; icon: typeof Cpu }[]> = {
    apple: [
      {
        icon: Cpu,
        title: language === "cs" ? "TrueTone & Face ID kalibrace" : language === "ru" ? "Калибровка TrueTone & Face ID" : "TrueTone & Face ID Serialization",
        desc: language === "cs" ? "Přenos továrních kalibračních dat z poškozeného panelu bez chybových hlášek." : language === "ru" ? "Считывание и перенос EEPROM микросхем со старого дисплея без системных ошибок." : "Factory EEPROM calibration transfer preserving full optical balance without system warnings.",
      },
      {
        icon: Sparkles,
        title: language === "cs" ? "Mikropájení čipů M1/M2/M3" : language === "ru" ? "Микропайка плат MacBook & iPhone" : "Logic Board Micro-Soldering",
        desc: language === "cs" ? "Oprava napájecích fází, odstranění koroze po vniknutí kapaliny a obnova podsvícení." : language === "ru" ? "Восстановление цепей питания после залития, устранение КЗ на линии VDD_MAIN." : "Power rail reconstruction, liquid corrosion ultrasonic cleaning, and PMIC short repair.",
      },
      {
        icon: ShieldCheck,
        title: language === "cs" ? "100% zachování dat" : language === "ru" ? "100% сохранение ваших данных" : "Zero Data Loss Guarantee",
        desc: language === "cs" ? "Zařízení nemažeme. Vaše fotky, hesla a dokumenty zůstávají v naprostém bezpečí." : language === "ru" ? "Мы не сбрасываем устройство. Все ваши фото, чаты и документы остаются нетронутыми." : "We never wipe your device. All photos, chats, and files remain fully intact.",
      },
    ],
    samsung: [
      {
        icon: Cpu,
        title: language === "cs" ? "Originální Dynamic AMOLED 2X" : language === "ru" ? "Оригинальные Dynamic AMOLED 2X" : "Genuine Dynamic AMOLED 2X",
        desc: language === "cs" ? "120Hz panely s maximálním jasem, plnou odezvou S-Pen a ultrazvukovou čtečkou otisků." : language === "ru" ? "Заводские матрицы 120 Гц с поддержкой S-Pen и ультразвукового сканера пальца." : "Factory 120Hz panels with full S-Pen digitizer support and ultrasonic fingerprint fidelity.",
      },
      {
        icon: Sparkles,
        title: language === "cs" ? "Oprava hlášení vlhkosti Type-C" : language === "ru" ? "Сброс ошибки влаги в Type-C" : "Moisture Warning Port Reset",
        desc: language === "cs" ? "Čištění a výměna korodovaných sub-board konektorů rychlého 45W nabíjení." : language === "ru" ? "Замена субплаты с микросхемой быстрой зарядки 45W и влагозащищенным разъемом." : "Sub-board replacement and 45W fast-charging IC reconstruction.",
      },
      {
        icon: ShieldCheck,
        title: language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Гарантия 12 месяцев" : "12-Month Lab Warranty",
        desc: language === "cs" ? "Kompletní záruka na náhradní díly a práci technika v Praze." : language === "ru" ? "Официальная сервисная гарантия на замененные детали и работу мастера." : "Full warranty coverage on all installed components and laboratory labor.",
      },
    ],
  };

  const defaultPerks = [
    {
      icon: Cpu,
      title: language === "cs" ? "Precizní diagnostika čipů" : language === "ru" ? "Точная диагностика цепей" : "Component-Level Diagnostics",
      desc: language === "cs" ? "Lokalizace závad termokamerou a stereo mikroskopem před zahájením opravy." : language === "ru" ? "Поиск неисправностей тепловизором и стереомикроскопом до первого винта." : "Thermal imaging and microscope fault detection prior to repair.",
    },
    {
      icon: Sparkles,
      title: language === "cs" ? "Originální a Tier-1 komponenty" : language === "ru" ? "Оригинальные и Tier-1 детали" : "OEM & Tier-1 Graded Parts",
      desc: language === "cs" ? "Testováno na 18 bodů funkčnosti před předáním zákazníkovi." : language === "ru" ? "Входной и выходной контроль по 18 пунктам перед выдачей." : "18-point QA verification before returning device to customer.",
    },
    {
      icon: ShieldCheck,
      title: language === "cs" ? "Garance zachování dat" : language === "ru" ? "Сохранение личных данных" : "Data Integrity Preservation",
      desc: language === "cs" ? "Vaše soubory a nastavení zůstávají beze změny." : language === "ru" ? "Все данные и настройки сохраняются в полном объеме." : "Personal data and system settings remain completely untouched.",
    },
  ];

  const perks = brandPerks[brand.id] || defaultPerks;

  return (
    <SiteChrome>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${brand.name} electronics repair in Prague`,
            provider: { "@type": "LocalBusiness", name: "Reform Prague" },
            areaServed: "Prague",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Repairs", item: "/repair" },
              { "@type": "ListItem", position: 3, name: brand.name },
            ],
          },
        ]}
      />

      <div className="page-hero compact">
        <div className="container">
          <p className="eyebrow">
            <BrandIcon brandId={brand.id} size={16} /> {t.wizard.badge} <PlaceholderTag />
          </p>
          <h1>{brand.name} {t.nav.repairs.toLowerCase()}.</h1>
          <p>{t.wizard.chooseModel}</p>
        </div>
      </div>

      {/* Brand Specialization Engineering Highlights */}
      <section className="container" style={{ margin: "30px auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  padding: "20px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "var(--accent-blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon size={18} />
                  </div>
                  <strong style={{ fontSize: "14px", color: "var(--ink)", fontWeight: 650 }}>{p.title}</strong>
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Models Directory Grid */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{brand.name.toUpperCase()} CATALOG</p>
            <h2>
              {language === "cs"
                ? `Vyberte model ${brand.name} pro zobrazení cen`
                : language === "ru"
                ? `Выберите модель ${brand.name} для расчета стоимости`
                : `Select your ${brand.name} model`}
            </h2>
          </div>

          <div className="device-directory">
            {brand.models.map((model, idx) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -3 }}
              >
                <Link href={`/repair?brand=${brand.id}&model=${model.id}`} className="directory-item-link">
                  <DeviceGlyph kind={model.category} />
                  <span>
                    <small>{model.category}</small>
                    <b>{model.name}</b>
                    <em>
                      <Wrench size={11} style={{ display: "inline-block", verticalAlign: "-1px", marginRight: "3px" }} />
                      {model.repairs.length} {t.nav.repairs.toLowerCase()}
                    </em>
                  </span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "14px" }}>
              {language === "cs"
                ? `Nenašli jste svůj model ${brand.name}? Napište nám do Telegramu — opravíme jakoukoliv verzi.`
                : language === "ru"
                ? `Не нашли свою модель ${brand.name}? Напишите нам в Telegram — восстановим любую ревизию.`
                : `Didn't find your ${brand.name} model? Message us on Telegram — we service all revisions.`}
            </p>
            <a
              href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(`Dobrý den! Mám dotaz k opravě zařízení značky ${brand.name}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="button button-secondary"
            >
              <Send size={15} /> {language === "cs" ? "Konzultovat model na Telegramu" : language === "ru" ? "Уточнить модель в Telegram" : "Inquire on Telegram"}
            </a>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
