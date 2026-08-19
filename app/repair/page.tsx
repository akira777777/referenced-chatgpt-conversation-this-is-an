"use client";

import { Suspense } from "react";
import { RepairWizard } from "@/components/RepairWizard";
import { SiteChrome } from "@/components/SiteChrome";

export default function RepairPage() {
  return (
    <SiteChrome>
      <div className="container wizard-page-container" style={{ padding: "110px 0 60px" }}>
        <Suspense fallback={<div className="wizard-skeleton"><span /><span /><span /></div>}>
          <RepairWizard />
        </Suspense>
      </div>
    </SiteChrome>
  );
}
