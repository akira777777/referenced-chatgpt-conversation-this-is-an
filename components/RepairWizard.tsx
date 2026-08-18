"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Battery,
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
  Wrench,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Brand, brands, DeviceModel, Repair, contactInfo } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import { Button, DeviceGlyph } from "./ui";
import { useRouter, useSearchParams } from "next/navigation";

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

const issueIcons: Record<string, React.ReactNode> = {
  battery: <Battery size={20} />,
  screen: <Smartphone size={20} />,
  display: <Smartphone size={20} />,
  charging: <ZapIcon />,
  camera: <Wrench size={20} />,
  diagnostics: <Cpu size={20} />,
  default: <Wrench size={20} />,
};

function ZapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function RepairWizard() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();

  const initialBrand = brands.find(b => b.id === params.get("brand"));
  const initialModel = initialBrand?.models.find(m => m.id === params.get("model"));

  const [step, setStep] = useState(initialModel ? 3 : initialBrand ? 1 : 0);
  const [brand, setBrand] = useState<Brand | null>(initialBrand ?? null);
  const [category, setCategory] = useState<string | null>(initialModel?.category ?? null);
  const [model, setModel] = useState<DeviceModel | null>(initialModel ?? null);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [method, setMethod] = useState("Service center");
  const [slot, setSlot] = useState("Tomorrow · 10:30");
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { contact: "Email", consent: false },
  });

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
          estimatedPrice: 0,
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

      {/* Interactive Step Indicator */}
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
            {/* Step 0: Brand Selection */}
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
                    <button
                      key={item.id}
                      type="button"
                      className={`choice ${brand?.id === item.id ? "selected" : ""}`}
                      onClick={() => chooseBrand(item)}
                    >
                      <span className="brand-letter">{item.name[0]}</span>
                      <div>
                        <strong>{item.name}</strong>
                        <small>{item.models.length} devices available</small>
                      </div>
                      <ArrowRight size={18} />
                    </button>
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
                <p>Filter models by product category</p>
                <div className="choice-grid">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`choice ${category === cat ? "selected" : ""}`}
                      onClick={() => {
                        setCategory(cat);
                        next();
                      }}
                    >
                      <DeviceGlyph kind={cat} />
                      <div>
                        <strong>{cat}</strong>
                        <small>{brand?.name} {cat} series</small>
                      </div>
                      <ArrowRight size={18} />
                    </button>
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
                    <button
                      key={item.id}
                      type="button"
                      className={`model-btn ${model?.id === item.id ? "selected" : ""}`}
                      onClick={() => {
                        setModel(item);
                        next();
                      }}
                    >
                      <DeviceGlyph kind={item.category} compact />
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.category} · {item.repairs.length} repair types</small>
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Repair Service Selector */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="wizard-step"
              >
                <h2>{t.wizard.chooseRepairs}</h2>
                <p>{model?.name ?? "Selected device"}</p>
                <div className="repair-list">
                  {(model?.repairs ?? []).map(repair => {
                    const selected = repairs.some(r => r.id === repair.id);
                    return (
                      <button
                        key={repair.id}
                        type="button"
                        className={selected ? "selected" : ""}
                        onClick={() =>
                          setRepairs(r => (selected ? r.filter(x => x.id !== repair.id) : [...r, repair]))
                        }
                      >
                        <span className="issue-icon">
                          {issueIcons[repair.id] ?? issueIcons.default}
                        </span>
                        <div className="repair-info">
                          <strong>{repair.name}</strong>
                          <small>{repair.description}</small>
                          <em>
                            <Clock size={12} /> {repair.time}
                          </em>
                        </div>
                        <div className="repair-price">
                          <b>{t.wizard.priceOnRequest}</b>
                          {selected ? (
                            <i><Check size={14} /></i>
                          ) : (
                            <small className="tap-select">Select</small>
                          )}
                        </div>
                      </button>
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
                      <button
                        key={item.id}
                        type="button"
                        className={isSelected ? "selected" : ""}
                        onClick={() => setMethod(item.id)}
                      >
                        <span>
                          <Icon size={20} />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.desc}</small>
                        </div>
                        {isSelected && <CheckCircle2 size={20} className="method-checked" />}
                      </button>
                    );
                  })}
                </div>

                <div className="slot-picker">
                  <b>
                    <Clock size={18} /> Preferred Drop-off / Collection Time:
                  </b>
                  <div>
                    {["Today · 16:00", "Tomorrow · 10:30", "Tomorrow · 14:00", "Flexible / By arrangement"].map(
                      time => (
                        <button
                          key={time}
                          type="button"
                          className={slot === time ? "selected" : ""}
                          onClick={() => setSlot(time)}
                        >
                          {time}
                        </button>
                      )
                    )}
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
                      <option value="Phone">Phone Call</option>
                      <option value="SMS">SMS Message</option>
                      <option value="Email">Email</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>{t.wizard.form.notes}</span>
                    <textarea {...form.register("notes")} placeholder="Describe any additional symptoms, passcodes (optional), or requests…" rows={3} />
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
                  <strong>{repairs.length ? repairs.map(r => r.name).join(", ") : "General Diagnostics"}</strong>
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

        {/* Persistent Right Summary Sidebar */}
        <aside className="repair-summary">
          <span>SUMMARY</span>
          {model ? (
            <div className="summary-device">
              <DeviceGlyph kind={model.category} />
              <div>
                <small>{brand?.name}</small>
                <strong>{model.name}</strong>
                <button type="button" onClick={() => setStep(2)}>
                  Change device
                </button>
              </div>
            </div>
          ) : (
            <div className="summary-empty">
              <Smartphone size={32} />
              <p>Select your manufacturer and model</p>
            </div>
          )}

          {repairs.length > 0 && (
            <div className="summary-services">
              {repairs.map(r => (
                <div key={r.id}>
                  <span>{r.name}</span>
                  <b>{t.wizard.priceOnRequest}</b>
                </div>
              ))}
            </div>
          )}

          <div className="summary-total">
            <div>
              <span>Estimated Cost</span>
              <small>{t.wizard.agreedIndividually}</small>
            </div>
            <b>{t.wizard.priceOnRequest}</b>
          </div>

          <div className="summary-meta">
            <span><ShieldCheck size={15} /> 12-Month Guarantee</span>
            <span><MapPin size={15} /> {contactInfo.addressStreet}</span>
            <span><Send size={15} /> Telegram: {contactInfo.telegram}</span>
          </div>

          <div className="summary-telegram-assist">
            <a
              href={`${contactInfo.telegramUrl}?text=${encodeURIComponent("Hello! I have a question about booking a repair.")}`}
              target="_blank"
              rel="noreferrer"
              className="telegram-assist-link"
            >
              <MessageSquare size={14} /> Need quick consultation? Ask master
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
