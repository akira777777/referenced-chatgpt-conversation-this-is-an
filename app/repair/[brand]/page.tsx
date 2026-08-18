"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Wrench } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { DeviceGlyph, PlaceholderTag } from "@/components/ui";
import { brands } from "@/lib/data";
import { StructuredData } from "@/components/StructuredData";
import { useLanguage } from "@/lib/i18n/context";
import { BrandIcon } from "@/components/BrandIcons";

export default function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: id } = use(params);
  const { t } = useLanguage();
  const brand = brands.find(b => b.id === id);

  if (!brand) notFound();

  return (
    <SiteChrome>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${brand.name} electronics repair`,
            provider: { "@type": "LocalBusiness", name: "Reform" },
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
      <section className="section">
        <div className="container">
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
        </div>
      </section>
    </SiteChrome>
  );
}
