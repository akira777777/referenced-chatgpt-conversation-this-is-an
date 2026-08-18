"use client";
import { motion } from "motion/react";
import { Check, CircleDot } from "lucide-react";
const states = [["Request received", "18 Aug · 09:12"], ["Device received", "18 Aug · 10:04"], ["Diagnostics", "18 Aug · 11:20"], ["Repair in progress", "Current status"], ["Testing", "Next"], ["Ready for pickup", ""], ["Completed", ""]];
export function StatusTimeline({ current = 3 }: { current?: number }) { return <div className="status-timeline">{states.map(([label, meta], i) => <motion.div key={label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }} className={i < current ? "done" : i === current ? "current" : ""}><span>{i < current ? <Check/> : <CircleDot/>}</span><div><b>{label}</b><small>{meta}</small></div></motion.div>)}</div>; }
