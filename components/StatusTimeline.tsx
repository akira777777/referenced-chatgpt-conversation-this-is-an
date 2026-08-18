"use client";

import { motion } from "motion/react";
import { Check, CircleDot, Activity } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function StatusTimeline({ current = 3 }: { current?: number }) {
  const { language, t } = useLanguage();

  const states = [
    [t.timeline.step0, t.timeline.step0_meta],
    [t.timeline.step1, t.timeline.step1_meta],
    [t.timeline.step2, t.timeline.step2_meta],
    [t.timeline.step3, t.timeline.step3_meta],
    [t.timeline.step4, t.timeline.step4_meta],
    [t.timeline.step5, t.timeline.step5_meta],
    [t.timeline.step6, t.timeline.step6_meta],
  ];

  const inLabBadge =
    language === "cs" ? "V DÍLNĚ" : language === "ru" ? "В РАБОТЕ" : "IN LAB";

  return (
    <div className="status-timeline">
      {states.map(([label, meta], i) => {
        const isDone = i < current;
        const isCurrent = i === current;

        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className={`timeline-node ${isDone ? "done" : isCurrent ? "current" : "pending"}`}
          >
            <span className="timeline-bullet">
              {isDone ? (
                <Check size={14} className="check-icon" />
              ) : isCurrent ? (
                <>
                  <span className="timeline-pulse-ring" />
                  <CircleDot size={16} className="current-icon" />
                </>
              ) : (
                <span className="pending-dot" />
              )}
            </span>
            <div className="timeline-content">
              <div className="timeline-title-row">
                <b>{label}</b>
                {isCurrent && (
                  <span className="timeline-live-tag">
                    <Activity size={10} /> {inLabBadge}
                  </span>
                )}
              </div>
              <small>{meta}</small>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
