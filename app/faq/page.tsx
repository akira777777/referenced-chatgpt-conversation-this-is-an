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
import { contactInfo } from "@/lib/data";
import { faqDatabase, type FaqCategory } from "@/lib/faq";
import { useLanguage } from "@/lib/i18n/context";

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
