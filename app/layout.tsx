import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = { metadataBase: new URL(process.env.SITE_URL ?? "https://reform-repair.example"), title: { default: "Reform — Premium electronics repair", template: "%s | Reform" }, description: "Precision repairs for Apple and premium electronics with transparent estimates and simple online booking.", icons: { icon: "/favicon.svg" }, openGraph: { title: "Reform — Technology, restored", description: "Premium electronics repair with transparent pricing and effortless booking.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Reform — Technology, restored" }] }, twitter: { card: "summary_large_image", images: ["/og.png"] } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>; }
