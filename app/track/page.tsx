"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { Button, PlaceholderTag } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/context";

export default function TrackPage() {
  const { t } = useLanguage();
  const [id, setId] = useState("REP-240182");
  const router = useRouter();

  return (
    <SiteChrome>
      <div className="track-hero">
        <div className="container narrow">
          <p className="eyebrow">
            {t.trackPage.badge} <PlaceholderTag />
          </p>
          <h1>{t.trackPage.title}</h1>
          <p>{t.trackPage.subtitle}</p>
          <form
            onSubmit={e => {
              e.preventDefault();
              router.push(`/track/${id || "REP-240182"}`);
            }}
          >
            <Search />
            <input
              value={id}
              onChange={e => setId(e.target.value)}
              aria-label="Repair number"
              placeholder={t.trackPage.placeholder}
            />
            <Button>
              {t.trackPage.btn} <ArrowRight />
            </Button>
          </form>
          <small>{t.trackPage.demo}</small>
        </div>
      </div>
    </SiteChrome>
  );
}
