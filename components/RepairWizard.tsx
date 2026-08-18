"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Cpu,
  MapPin,
  Package,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Truck,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  Brand,
  brands,
  DeviceModel,
  Repair,
  contactInfo,
  formatRepairPrice,
  formatNumber,
} from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import { Button, DeviceGlyph } from "./ui";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandIcon, RepairIcon } from "./BrandIcons";

const schema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  contact: z.string(),
  notes: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: "Please accept the privacy notice",
  }),
});

type FormData = z.infer<typeof schema>;

export function RepairWizard() {
  const { language, lang, t } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();

  const initialBrand = brands.find(b => b.id === params.get("brand"));
  const initialModel = initialBrand?.models.find(m => m.id === params.get("model"));

  const defaultSlot =
    language === "cs" ? "Zítra · 10:30" : language === "ru" ? "Завтра · 10:30" : "Tomorrow · 10:30";

  const [step, setStep] = useState(initialModel ? 3 : initialBrand ? 1 : 0);
  const [brand, setBrand] = useState<Brand | null>(initialBrand ?? null);
  const [category, setCategory] = useState<string | null>(initialModel?.category ?? null);
  const [model, setModel] = useState<DeviceModel | null>(initialModel ?? null);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [method, setMethod] = useState("Service center");
  const [slot, setSlot] = useState(defaultSlot);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { contact: "Telegram", consent: false },
  });

  const totalEstimate = useMemo(() => {
    if (!repairs.length) return null;
    let min = 0;
    let max = 0;
    for (const r of repairs) {
      min += (r.priceFrom ?? r.exactPrice ?? r.price ?? 0);
      max += (r.priceTo ?? r.exactPrice ?? r.price ?? 0);
    }
    if (min === 0 && max === 0) return null;
    if (min > 0 && max > 0 && min !== max) {
      return `${formatNumber(min)}–${formatNumber(max)} Kč`;
    }
    if (min > 0 && max > 0 && min === max) {
      return `${formatNumber(min)} Kč`;
    }
    if (min === 0 && max > 0) {
      return `0–${formatNumber(max)} Kč`;
    }
    if (min > 0) {
      return `od ${formatNumber(min)} Kč`;
    }
    return null;
  }, [repairs]);

  const categories = brand?.categories ?? [];
  const models = useMemo(
    () =>
      brand?.models.filter(
        m => (!category || m.category === category) && m.name.toLowerCase().includes(query.toLowerCase())
      ) ?? [],
    [brand, category, query]
  );

  const next = () => setStep(s => Math.min(6, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  const submitDetails = form.handleSubmit(data => {
    setCustomer(data);
    next();
  });

  async function confirm() {
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: brand?.name,
          model: model?.name,
          repairs: repairs.map(r => r.name),
          estimatedPrice: totalEstimate ?? 0,
          method,
          slot,
          customer,
        }),
      });
      const result = (await response.json()) as { orderId?: string };
      router.push(`/order/success?id=${result.orderId ?? "REP-240182"}`);
    } catch {
      setSubmitting(false);
    }
  }

  function chooseBrand(item: Brand) {
    setBrand(item);
    setCategory(null);
    setModel(null);
    setRepairs([]);
    next();
  }

  const deliveryList = [
    {
      id: "Service center",
      title: t.wizard.deliveryMethods.center.title,
      desc: t.wizard.deliveryMethods.center.desc,
      icon: MapPin,
    },
    {
      id: "Courier pickup",
      title: t.wizard.deliveryMethods.courier.title,
      desc: t.wizard.deliveryMethods.courier.desc,
      icon: Truck,
    },
    {
      id: "Send by mail",
      title: t.wizard.deliveryMethods.post.title,
      desc: t.wizard.deliveryMethods.post.desc,
      icon: Package,
    },
  ];

  const slotOptions =
    language === "cs"
      ? ["Dnes · 16:00", "Zítra · 10:30", "Zítra · 14:00", "Flexibilní / Dle domluvy"]
      : language === "ru"
      ? ["Сегодня · 16:00", "Завтра · 10:30", "Завтра · 14:00", "Гибко / По договоренности"]
      : ["Today · 16:00", "Tomorrow · 10:30", "Tomorrow · 14:00", "Flexible / By arrangement"];

  const wizardLabels = {
    summaryHeader: language === "cs" ? "SOUHRN" : language === "ru" ? "СВОДКА" : "SUMMARY",
    changeDevice: language === "cs" ? "Změnit zařízení" : language === "ru" ? "Изменить модель" : "Change device",
    selectPrompt: language === "cs" ? "Vyberte výrobce a model" : language === "ru" ? "Выберите производителя и модель" : "Select your manufacturer and model",
    warrantyBadge: language === "cs" ? "Záruka 12 měsíců" : language === "ru" ? "Гарантия 12 месяцев" : "12-Month Guarantee",
    askTelegram: language === "cs" ? "Napsat Artemovi na Telegram" : language === "ru" ? "Написать Артёму в Telegram" : "Ask Artem on Telegram",
    instantConsult: language === "cs" ? "Okamžitá technická konzultace" : language === "ru" ? "Быстрая консультация мастера" : "Instant technical consultation",
    slotTitle: language === "cs" ? "Preferovaný čas předání / vyzvednutí:" : language === "ru" ? "Удобное время передачи / забора:" : "Preferred Drop-off / Collection Time:",
    step1Desc: language === "cs" ? "Filtrovat modely podle kategorie" : language === "ru" ? "Фильтрация по типу устройства" : "Filter models by product category",
    selectBtn: language === "cs" ? "Vybrat" : language === "ru" ? "Выбрать" : "Select",
    notesPlaceholder:
      language === "cs"
        ? "Popište další závady, případně heslo pro testování (volitelné)..."
        : language === "ru"
        ? "Опишите проблему, код разблокировки для тестов (необязательно)..."
        : "Describe any additional symptoms, passcodes (optional), or requests…",
  };

  return (
    <div className="wizard-shell">
      <div className="wizard-top">
        <div>
          <p className="eyebrow">
            <Cpu size={14} /> {t.wizard.badge}
          </p>
          <h1>{t.wizard.title}</h1>
        </div>
        <span className="step-counter">
          {t.wizard.stepOf.replace("{current}", String(step + 1)).replace("{total}", String(t.wizard.steps.length))}
        </span>
      </div>

      {/* Interactive Step Indicator with Glowing Line */}
      <div className="progress" role="tablist">
        {t.wizard.steps.map((label, index) => (
          <button
            key={index}
            type="button"
            className={index <= step ? "active" : ""}
            onClick={() => index < step && setStep(index)}
            disabled={index > step}
          >
            <i>{index < step ? <Check size={14} /> : index + 1}</i>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="wizard-layout">
        <div className="wizard-content">
          <AnimatePresence mode="wait">
            {/* Step 0: Brand Selection with Vector Logos */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step"
              >
                <h2>{t.wizard.chooseBrand}</h2>
                <p>{t.wizard.chooseCategory}</p>
                <div className="choice-grid">
                  {brands.map(item => (
                    <motion.button
                      key={item.id}
                      type="button"
                      className={`choice ${brand?.id === item.id ? "selected" : ""}`}
                      onClick={() => chooseBrand(item)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="brand-vector-box">
                        <BrandIcon brandId={item.id} size={22} />
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <small>
                          {language === "cs"
                            ? `${item.models.length} modelů k dispozici`
                            : language === "ru"
                            ? `${item.models.length} доступных моделей`
                            : `${item.models.length} devices available`}
                        </small>
                      </div>
                      <ArrowRight size={18} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Device Category */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step"
              >
                <h2>{brand?.name}: {t.wizard.chooseCategory}</h2>
                <p>{wizardLabels.step1Desc}</p>
                <div className="choice-grid">
                  {categories.map(cat => (
                    <motion.button
                      key={cat}
                      type="button"
                      className={`choice ${category === cat ? "selected" : ""}`}
                      onClick={() => {
                        setCategory(cat);
                        next();
                      }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <DeviceGlyph kind={cat} />
                      <div>
                        <strong>{cat}</strong>
                        <small>{brand?.name} {cat}</small>
                      </div>
                      <ArrowRight size={18} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Model Picker */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step"
              >
                <h2>{t.wizard.chooseModel}</h2>
                <div className="model-search">
                  <Search size={18} />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t.wizard.searchModels}
                    aria-label="Filter models"
                  />
                </div>
                <div className="model-list">
                  {models.map(item => (
                    <motion.button
                      key={item.id}
                      type="button"
                      className={`model-btn ${model?.id === item.id ? "selected" : ""}`}
                      onClick={() => {
                        setModel(item);
                        next();
                      }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <DeviceGlyph kind={item.category} compact />
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.category} · {item.repairs.length}{" "}
                          {language === "cs" ? "možností oprav" : language === "ru" ? "видов ремонта" : "repair options"}
                        </small>
                      </span>
                      <ArrowRight size={18} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Repair Service Selector with Vector Glyphs */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step"
              >
                <h2>{t.wizard.chooseRepairs}</h2>
                <p>{model?.name ?? (language === "cs" ? "Zvolené zařízení" : language === "ru" ? "Выбранное устройство" : "Selected device")}</p>
                <div className="repair-list">
                  {(model?.repairs ?? []).map(repair => {
                    const selected = repairs.some(r => r.id === repair.id);
                    const formattedPrice = formatRepairPrice(repair, lang, { showCca: true });
                    const duration = repair.estimatedDuration || repair.time || "60–90 min";

                    return (
                      <motion.button
                        key={repair.id}
                        type="button"
                        className={selected ? "selected" : ""}
                        onClick={() =>
                          setRepairs(r => (selected ? r.filter(x => x.id !== repair.id) : [...r, repair]))
                        }
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="issue-icon">
                          <RepairIcon repairId={repair.id || repair.name} size={20} />
                        </span>
                        <div className="repair-info">
                          <strong>{repair.name}</strong>
                          <small>{repair.description}</small>
                          <em>
                            <Clock size={12} /> ~{duration}
                          </em>
                        </div>
                        <div className="repair-price">
                          <b>{formattedPrice}</b>
                          <small className="inclusions-mini">
                            {t.pricing.partsAndLaborIncluded}
                          </small>
                          {selected ? (
                            <i><Check size={14} /></i>
                          ) : (
                            <small className="tap-select">{wizardLabels.selectBtn}</small>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Handover Method & Slot */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step"
              >
                <h2>{t.wizard.chooseDelivery}</h2>
                <div className="method-list">
                  {deliveryList.map(item => {
                    const Icon = item.icon;
                    const isSelected = method === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        className={isSelected ? "selected" : ""}
                        onClick={() => setMethod(item.id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>
                          <Icon size={20} />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.desc}</small>
                        </div>
                        {isSelected && <CheckCircle2 size={20} className="method-checked" />}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="slot-picker">
                  <b>
                    <Clock size={18} /> {wizardLabels.slotTitle}
                  </b>
                  <div>
                    {slotOptions.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={slot === time ? "selected" : ""}
                        onClick={() => setSlot(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Customer Details Form */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step"
              >
                <h2>{t.wizard.fillDetails}</h2>
                <form onSubmit={submitDetails} className="customer-form">
                  <label className="field">
                    <span>{t.wizard.form.firstName}</span>
                    <input {...form.register("firstName")} placeholder="Jan" />
                    {form.formState.errors.firstName && (
                      <small className="error">{form.formState.errors.firstName.message}</small>
                    )}
                  </label>

                  <label className="field">
                    <span>{t.wizard.form.lastName}</span>
                    <input {...form.register("lastName")} placeholder="Novák" />
                    {form.formState.errors.lastName && (
                      <small className="error">{form.formState.errors.lastName.message}</small>
                    )}
                  </label>

                  <label className="field">
                    <span>{t.wizard.form.email}</span>
                    <input {...form.register("email")} type="email" placeholder="jan.novak@example.cz" />
                    {form.formState.errors.email && (
                      <small className="error">{form.formState.errors.email.message}</small>
                    )}
                  </label>

                  <label className="field">
                    <span>{t.wizard.form.phone}</span>
                    <input {...form.register("phone")} placeholder="+420 737 000 000" />
                    {form.formState.errors.phone && (
                      <small className="error">{form.formState.errors.phone.message}</small>
                    )}
                  </label>

                  <label className="field">
                    <span>{t.wizard.form.preferredContact}</span>
                    <select {...form.register("contact")}>
                      <option value="Telegram">Telegram (@liltrafficRUS)</option>
                      <option value="Phone">{language === "cs" ? "Telefonní hovor" : language === "ru" ? "Звонок по телефону" : "Phone Call"}</option>
                      <option value="SMS">{language === "cs" ? "SMS zpráva" : language === "ru" ? "SMS сообщение" : "SMS Message"}</option>
                      <option value="Email">{language === "cs" ? "E-mail" : language === "ru" ? "Электронная почта" : "Email"}</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>{t.wizard.form.notes}</span>
                    <textarea {...form.register("notes")} placeholder={wizardLabels.notesPlaceholder} rows={3} />
                  </label>

                  <label className="consent">
                    <input type="checkbox" {...form.register("consent")} />
                    <span>{t.wizard.form.consent}</span>
                  </label>
                  {form.formState.errors.consent && (
                    <small className="error consent-error">{form.formState.errors.consent.message}</small>
                  )}

                  <div className="form-submit">
                    <Button type="submit">{t.wizard.form.submit} <ArrowRight size={17} /></Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 6: Confirmation */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step confirmation"
              >
                <h2>{t.wizard.confirm.title}</h2>
                <div className="review-row">
                  <span>{t.wizard.confirm.device}:</span>
                  <strong>{brand?.name} {model?.name}</strong>
                </div>
                <div className="review-row">
                  <span>{t.wizard.confirm.selectedServices}:</span>
                  <strong>{repairs.length ? repairs.map(r => r.name).join(", ") : t.wizard.freeDiagnostics}</strong>
                </div>
                <div className="review-row">
                  <span>{t.wizard.confirm.method}:</span>
                  <strong>{method} ({slot})</strong>
                </div>
                <div className="review-row">
                  <span>{t.wizard.confirm.customer}:</span>
                  <strong>{customer?.firstName} {customer?.lastName} ({customer?.phone})</strong>
                </div>

                <div className="notice">
                  <ShieldCheck size={20} />
                  <p>{t.wizard.confirm.notice}</p>
                </div>

                <Button onClick={confirm} disabled={submitting} className="confirm-btn">
                  {submitting ? t.wizard.confirm.btnSubmitting : t.wizard.confirm.btnSubmit}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="wizard-nav">
            {step > 0 ? (
              <button type="button" onClick={back} className="wizard-back-btn">
                <ArrowLeft size={16} /> {t.common.back}
              </button>
            ) : <span />}

            {step < 5 && step !== 1 && step !== 2 && (
              <Button onClick={next} disabled={step === 3 && repairs.length === 0}>
                {t.common.next} <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Persistent Right Summary Sidebar with Animated Price Count & Artem Assist */}
        <aside className="repair-summary">
          <div className="summary-header-row">
            <span>{wizardLabels.summaryHeader}</span>
            <Sparkles size={14} className="summary-sparkle" />
          </div>

          {model ? (
            <div className="summary-device">
              <div className="summary-brand-icon">
                <BrandIcon brandId={brand?.id} size={20} />
              </div>
              <div>
                <small>{brand?.name}</small>
                <strong>{model.name}</strong>
                <button type="button" onClick={() => setStep(2)}>
                  {wizardLabels.changeDevice}
                </button>
              </div>
            </div>
          ) : (
            <div className="summary-empty">
              <Smartphone size={32} />
              <p>{wizardLabels.selectPrompt}</p>
            </div>
          )}

          {repairs.length > 0 && (
            <div className="summary-services">
              {repairs.map(r => (
                <div key={r.id} className="summary-service-item">
                  <span>
                    <RepairIcon repairId={r.id || r.name} size={14} className="summary-service-icon" />
                    {r.name}
                  </span>
                  <b>{formatRepairPrice(r, lang, { showCca: true })}</b>
                </div>
              ))}
            </div>
          )}

          <div className="summary-total">
            <div>
              <span>{t.pricing.totalEstimateLabel}</span>
              <small>{t.pricing.partsAndLaborIncluded}</small>
            </div>
            <b>{totalEstimate ?? t.wizard.priceOnRequest}</b>
          </div>

          <div className="summary-trust-notice">
            <ShieldCheck size={14} />
            <small>{t.pricing.finalPriceConfirmed}</small>
          </div>

          <div className="summary-meta">
            <span><ShieldCheck size={15} /> {wizardLabels.warrantyBadge}</span>
            <span><MapPin size={15} /> {contactInfo.addressStreet}</span>
            <span><Send size={15} /> Telegram: {contactInfo.telegram}</span>
          </div>

          <div className="summary-telegram-assist">
            <div className="assist-avatar-wrap">
              <picture>
                <source srcSet="/artem-avatar.webp" type="image/webp" />
                <img src="/artem-avatar.png" alt="Artem" width={40} height={40} />
              </picture>
            </div>
            <div className="assist-text-wrap">
              <a
                href={`${contactInfo.telegramUrl}?text=${encodeURIComponent(
                  language === "cs"
                    ? "Dobrý den! Mám dotaz ohledně objednávky opravy."
                    : language === "ru"
                    ? "Здравствуйте! У меня есть вопрос по поводу оформления ремонта."
                    : "Hello! I have a question about booking a repair."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="assist-link"
              >
                <span>{wizardLabels.askTelegram}</span>
                <Send size={12} />
              </a>
              <small className="assist-sub">
                {wizardLabels.instantConsult}
              </small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
