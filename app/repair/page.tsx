"use client";

import { Suspense } from "react";
import { RepairWizard } from "@/components/RepairWizard";
import { SiteChrome } from "@/components/SiteChrome";
import { useLanguage } from "@/lib/i18n/context";

export default function RepairPage() {
  const { t } = useLanguage();

  return (
    <SiteChrome>
      <div className="page-hero compact">
        <div className="container">
          <p className="eyebrow">{t.wizard.badge}</p>
          <h1>{t.wizard.title}</h1>
          <p>{t.wizard.chooseBrand}</p>
        </div>
      </div>
      <div className="container wizard-wrap">
        <Suspense fallback={<div className="wizard-skeleton"><span /><span /><span /></div>}>
          <RepairWizard />
        </Suspense>
      </div>
    </SiteChrome>
  );
}
