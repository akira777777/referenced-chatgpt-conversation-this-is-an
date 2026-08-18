"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, ShieldCheck, Sparkles, Check } from "lucide-react";
import { Repair, formatRepairPrice } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import { BrandIcon, RepairIcon } from "./BrandIcons";

interface RepairPriceCardProps {
  repair: Repair;
  deviceName: string;
  brandName: string;
  brandId?: string;
  deviceCategory?: string;
  deviceId?: string;
}

export function RepairPriceCard({
  repair,
  deviceName,
  brandName,
  brandId = "apple",
  deviceCategory = "iPhone",
  deviceId,
}: RepairPriceCardProps) {
  const { language, lang, t } = useLanguage();

  const formattedPrice = formatRepairPrice(repair, lang, { showCca: true });
  const duration = repair.estimatedDuration || repair.time || "60–90 min";

  // Determine quality tier badge
  const qualityBadge =
    repair.qualityTier === "premium"
      ? t.pricing.qualityPremium
      : repair.qualityTier === "original"
      ? t.pricing.qualityOriginal
      : null;

  const warrantyLabel =
    language === "cs" ? "12 měsíců" : language === "ru" ? "12 мес" : "12 Mo";

  return (
    <motion.article
      className="repair-price-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-top-row">
        <div className="card-device-info">
          <div className="card-brand-badge">
            <BrandIcon brandId={brandId} size={18} />
          </div>
          <div>
            <span className="card-brand">{brandName} · {deviceCategory}</span>
            <h4 className="card-device-name">{deviceName}</h4>
          </div>
        </div>

        {qualityBadge ? (
          <span className="quality-pill">
            <Sparkles size={11} /> {qualityBadge}
          </span>
        ) : (
          <span className="warranty-pill">
            <ShieldCheck size={11} /> {warrantyLabel}
          </span>
        )}
      </div>

      <div className="card-service-body">
        <div className="card-icon-title-wrap">
          <div className="card-repair-icon">
            <RepairIcon repairId={repair.id || repair.name} size={18} />
          </div>
          <h3 className="card-service-title">{repair.name}</h3>
        </div>
        <p className="card-service-desc">{repair.description}</p>
      </div>

      <div className="card-pricing-block">
        <div className="card-price-row">
          <div className="card-price-value">
            <strong>{formattedPrice}</strong>
            <span className="inclusions-badge">
              <Check size={12} /> {t.pricing.partsAndLaborIncluded}
            </span>
          </div>

          <div className="card-duration">
            <Clock size={13} />
            <span>~{duration}</span>
          </div>
        </div>

        <div className="card-trust-note">
          <ShieldCheck size={13} />
          <span>{t.pricing.finalPriceConfirmed}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link
          href={`/repair?brand=${brandId}&model=${deviceId || deviceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          className="button card-book-button"
          aria-label={`${t.pricing.btnBook}: ${repair.name} (${deviceName})`}
        >
          <span>{t.pricing.btnBook}</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  );
}
