"use client";

import { motion } from "motion/react";
import { Check, CircleDot } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function StatusTimeline({ current = 3 }: { current?: number }) {
  const { t } = useLanguage();

  const states = [
    [t.timeline.step0, t.timeline.step0_meta],
    [t.timeline.step1, t.timeline.step1_meta],
    [t.timeline.step2, t.timeline.step2_meta],
    [t.timeline.step3, t.timeline.step3_meta],
    [t.timeline.step4, t.timeline.step4_meta],
    [t.timeline.step5, t.timeline.step5_meta],
    [t.timeline.step6, t.timeline.step6_meta],
  ];

  return (
    <div className="status-timeline">
      {states.map(([label, meta], i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className={i < current ? "done" : i === current ? "current" : ""}
        >
          <span>{i < current ? <Check /> : <CircleDot />}</span>
          <div>
            <b>{label}</b>
            <small>{meta}</small>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
