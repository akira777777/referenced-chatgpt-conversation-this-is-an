import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Repair",
  description: "Check the status and progress of your device repair with Reform.",
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
