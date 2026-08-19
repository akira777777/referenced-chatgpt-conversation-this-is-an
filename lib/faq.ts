/**
 * FAQ content database — shared between the client page (UI rendering)
 * and the server layout (FAQPage JSON-LD structured data).
 *
 * Moved out of app/faq/page.tsx so the server-rendered schema can carry
 * the per-request CSP nonce (client components cannot read headers()).
 */

export type FaqCategory = "all" | "pricing" | "warranty" | "timing" | "data";

export interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, "all">;
  question: { cs: string; ru: string; en: string };
  answer: { cs: string; ru: string; en: string };
}

export const faqDatabase: FaqItem[] = [
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
      ru: "Вы можете приехать лично в лабораторию по адресу Biskupcova 31 (Praha 3 — Жижков), либо заказать вызов курьера по Праге или отправку через Zásilkovna / Почту со всей Чехии.",
      en: "You are welcome to visit our lab in person at Biskupcova 31 (Prague 3 — Žižkov), or arrange courier pick-up across Prague, as well as insured postal drop-off from anywhere in the Czech Republic.",
    },
  },
];

/**
 * Build the schema.org FAQPage payload. Used by the server layout for
 * JSON-LD structured data. Search-engine crawlers mostly index the
 * English variant, so the server schema is language-agnostic.
 */
export function buildFaqPageSchema(language: "cs" | "ru" | "en" = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqDatabase.map(f => ({
      "@type": "Question",
      name: f.question[language] || f.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer[language] || f.answer.en,
      },
    })),
  };
}
