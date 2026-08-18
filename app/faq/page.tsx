"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  HelpCircle,
  Send,
  ChevronDown,
  Wrench,
  ShieldCheck,
  Clock,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";

type FaqCategory = "all" | "pricing" | "warranty" | "timing" | "data";

interface FaqItem {
  id: string;
  category: FaqCategory;
  question: { cs: string; ru: string; en: string };
  answer: { cs: string; ru: string; en: string };
}

const faqDatabase: FaqItem[] = [
  {
    id: "diag-policy",
    category: "pricing",
    question: {
      cs: "Kolik stojí diagnostika a jak probíhá?",
      ru: "Сколько стоит диагностика и как она проходит?",
      en: "How much does diagnostics cost and how does it work?",
    },
    answer: {
      cs: "Základní diagnostika je zcela ZDARMA, pokud se rozhodnete zařízení u nás opravit. V případě odmítnutí opravy po komplexním měření desky pod mikroskopem je účtován poplatek 300–500 Kč za čas strávený proměřením obvodů.",
      ru: "Первичная диагностика полностью БЕСПЛАТНА при выполнении последующего ремонта. В случае отказа от ремонта после глубокого тестирования цепей под микроскопом берется сбор 300–500 Kč за затраченное время инженера.",
      en: "Initial diagnostics are completely FREE if you proceed with the repair. If you decide not to repair after in-depth multimeter motherboard inspection, a small fee of 300–500 Kč applies for the engineer's testing time.",
    },
  },
  {
    id: "parts-quality",
    category: "warranty",
    question: {
      cs: "Jaké náhradní díly používáte? Zachováte TrueTone a FaceID?",
      ru: "Какие запчасти вы используете? Сохранится ли TrueTone и Face ID?",
      en: "What spare parts do you use? Will TrueTone and Face ID remain active?",
    },
    answer: {
      cs: "Používáme výhradně kalibrované originální OEM díly a výběrové prémiové OLED panely. Při výměně displeje vždy přesouváme EEPROM kód pro 100% zachování funkce TrueTone, senzoru osvětlení i biometrie Face ID / Touch ID.",
      ru: "Мы используем оригинальные OEM компоненты и проверенные премиальные OLED матрицы. При замене экрана мы всегда переносим калибровочный EEPROM код, сохраняя TrueTone, автояркость и Face ID / Touch ID на 100%.",
      en: "We use factory OEM calibrated components and premium Grade-A OLED panels. During screen replacements, we always serialize and transfer the EEPROM profile to preserve 100% TrueTone, ambient light sensors, and Face ID / Touch ID.",
    },
  },
  {
    id: "warranty-period",
    category: "warranty",
    question: {
      cs: "Jaká je záruka na provedenou opravu?",
      ru: "Какая гарантия предоставляется на ремонт?",
      en: "What warranty do you provide on completed repairs?",
    },
    answer: {
      cs: "Na všechny provedené opravy a instalované díly poskytujeme záruku 12 měsíců. U výměn baterií garantujeme kondici a bezproblémový chod.",
      ru: "На все виды выполненных работ и установленные компоненты действует официальная гарантия 12 месяцев. На замененные аккумуляторы предоставляется гарантия емкости.",
      en: "All completed repairs and installed hardware components include an official 12-month service warranty covering both parts and engineering labor.",
    },
  },
  {
    id: "repair-time",
    category: "timing",
    question: {
      cs: "Jak rychle oprava probíhá? Nabízíte expresní servis?",
      ru: "Сколько времени занимает ремонт? Есть ли экспресс-обслуживание?",
      en: "How long does a repair take? Do you offer express turnaround?",
    },
    answer: {
      cs: "Standardní opravy (výměna displeje, baterie, konektoru) provádíme expresně během 20–40 minut po předchozí domluvě. Komplexní mikropájení a záchrana vytopených desek trvá obvykle 1–3 dny.",
      ru: "Модульный ремонт (замена экрана, аккумулятора, порта зарядки) выполняется экспрессом за 20–40 минут по предварительной записи. Сложная микропайка плат и сушка после залития занимает 1–3 рабочих дня.",
      en: "Standard repairs (screen, battery, charging port) are performed express in 20–40 minutes by appointment. Complex BGA micro-soldering and ultrasonic liquid decontamination typically take 1–3 business days.",
    },
  },
  {
    id: "data-safety",
    category: "data",
    question: {
      cs: "Zůstanou moje osobní data v telefonu v bezpečí?",
      ru: "Останутся ли мои личные данные в безопасности?",
      en: "Will my personal data remain safe and intact?",
    },
    answer: {
      cs: "Ano! 99 % hardwarových oprav (displej, baterie, kamera, konektor) nevyžaduje reset zařízení a vaše fotky, zprávy i aplikace zůstanou beze změny. Přesto před každým zásahem doporučujeme provést zálohu na iCloud/Google Drive.",
      ru: "Да! 99% аппаратных ремонтов (экран, аккумулятор, камера, разъем) не затрагивают память устройства — все фото, чаты и приложения останутся на месте. Тем не менее, мы всегда рекомендуем иметь свежую резервную копию.",
      en: "Yes! 99% of hardware repairs (display, battery, camera, dock) do not touch storage NAND memory, keeping your photos, messages, and apps intact. However, we always advise maintaining a recent cloud backup.",
    },
  },
  {
    id: "delivery-options",
    category: "timing",
    question: {
      cs: "Musím přijít osobně, nebo mohu zařízení poslat kurýrem?",
      ru: "Нужно ли приезжать лично или можно отправить курьером?",
      en: "Do I have to come in person or can I send my device via courier?",
    },
    answer: {
      cs: "Můžete nás navštívit osobně v dílně na adrese Biskupcova 31 (Praha 3 — Žižkov), nebo využít vyzvednutí kurýrem po celé Praze či zaslání přes Zásilkovnu/Poštu z celé ČR.",
      ru: "Вы можете приехать лично в лабораторию по адресу Biskupcova 31 (Praha 3 — Žižkov), либо заказать вызов курьера по Праге или отправку через Zásilkovna / Почту со всей Чехии.",
      en: "You are welcome to visit our lab in person at Biskupcova 31 (Prague 3 — Žižkov), or arrange courier pick-up across Prague, as well as insured postal drop-off from anywhere in the Czech Republic.",
    },
  },
];

export default function FaqPage() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0": true });

  const categories: { id: FaqCategory; label: { cs: string; ru: string; en: string }; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "all", label: { cs: "Všechny dotazy", ru: "Все вопросы", en: "All Questions" }, icon: HelpCircle },
    { id: "pricing", label: { cs: "Ceny a diagnostika", ru: "Цены и диагностика", en: "Pricing & Diagnostics" }, icon: Wrench },
    { id: "warranty", label: { cs: "Díly a záruka", ru: "Запчасти и гарантия", en: "OEM Parts & Warranty" }, icon: ShieldCheck },
    { id: "timing", label: { cs: "Sроки a expres", ru: "Сроки и доставка", en: "Timing & Delivery" }, icon: Clock },
    { id: "data", label: { cs: "Bezpečnost dat", ru: "Безопасность данных", en: "Data & Privacy" }, icon: Lock },
  ];

  const filteredFaqs = useMemo(() => {
    return faqDatabase.filter(item => {
      const matchCat = activeCategory === "all" || item.category === activeCategory;
      const qText = item.question[language as "cs" | "ru" | "en"] || item.question.en;
      const aText = item.answer[language as "cs" | "ru" | "en"] || item.answer.en;
      const matchQuery = `${qText} ${aText}`.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCategory, query, language]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const faqLabels = {
    searchPlaceholder:
      language === "cs"
        ? "Hledat v častých dotazech (např. záruka, cena, expres, data)..."
        : language === "ru"
        ? "Поиск по вопросам (например, гарантия, сроки, TrueTone, данные)..."
        : "Search frequently asked questions (warranty, time, data, pricing)...",
    noResultTitle:
      language === "cs" ? "Nenalezli jste odpověď?" : language === "ru" ? "Не нашли ответ на свой вопрос?" : "Didn't find your answer?",
    noResultSub:
      language === "cs"
        ? "Napište přímo hlavnímu inženýrovi Artemovi na Telegram a získejte okamžitou konzultaci."
        : language === "ru"
        ? "Напишите напрямую ведущему мастеру Артёму в Telegram для мгновенной консультации."
        : "Ask Lead Master Artem directly on Telegram for an instant technical consultation.",
    askTgBtn:
      language === "cs" ? "Položit dotaz na Telegramu" : language === "ru" ? "Спросить в Telegram" : "Ask on Telegram",
  };

  return (
    <SiteChrome>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqDatabase.map(f => ({
            "@type": "Question",
            name: f.question[language as "cs" | "ru" | "en"] || f.question.en,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer[language as "cs" | "ru" | "en"] || f.answer.en,
            },
          })),
        }}
      />

      {/* Hero Header */}
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">
            <HelpCircle size={14} /> {t.faqPage.badge}
          </p>
          <h1>{t.faqPage.title}</h1>
          <p>{t.faqPage.subtitle}</p>
        </div>
      </div>

      <section className="section faq-interactive-section">
        <div className="container narrow">
          {/* Search Bar */}
          <div className="faq-search-box">
            <Search size={18} className="faq-search-icon" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={faqLabels.searchPlaceholder}
              aria-label="Search FAQ"
            />
          </div>

          {/* Category Tabs */}
          <div className="faq-category-pills" role="tablist" aria-label="FAQ Categories">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              const label = cat.label[language as "cs" | "ru" | "en"] || cat.label.en;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`faq-cat-btn ${isSelected ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Accordion List */}
          <div className="faq-accordion-list">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = Boolean(openItems[faq.id]);
              const qText = faq.question[language as "cs" | "ru" | "en"] || faq.question.en;
              const aText = faq.answer[language as "cs" | "ru" | "en"] || faq.answer.en;

              return (
                <motion.div
                  key={faq.id}
                  className={`faq-card ${isOpen ? "open" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{qText}</span>
                    <span className="faq-chevron-wrap">
                      <ChevronDown size={18} className={`faq-chevron ${isOpen ? "rotate" : ""}`} />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="faq-answer-wrap"
                      >
                        <p className="faq-answer-text">{aText}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {!filteredFaqs.length && (
              <div className="empty-state">
                <HelpCircle size={36} />
                <strong>{faqLabels.noResultTitle}</strong>
                <p>{faqLabels.noResultSub}</p>
              </div>
            )}
          </div>

          {/* Telegram Assistance Banner */}
          <div className="faq-telegram-card">
            <div className="faq-tg-copy">
              <span className="faq-tg-badge">
                <Sparkles size={12} /> {faqLabels.noResultTitle}
              </span>
              <h3>{faqLabels.noResultSub}</h3>
            </div>
            <div className="faq-tg-actions">
              <a
                href={contactInfo.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="button"
              >
                <Send size={15} />
                <span>{faqLabels.askTgBtn}</span>
              </a>
              <Link href="/repair" className="button button-secondary">
                {t.nav.startRepair} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
