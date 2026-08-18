import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://reform-device-care-prague.artemmikhailov200310.chatgpt.site"),
  title: {
    default: "Reform — Precision Electronics Repair Prague",
    template: "%s | Reform Prague",
  },
  description: "Precision repairs, micro-soldering, and individual quotes for Apple, Samsung, Google in Prague 3. Telegram @liltrafficRUS.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.ico", apple: "/favicon.svg" },
  openGraph: {
    title: "Reform — Precision Device Care Prague",
    description: "Component-level electronics repair, micro-soldering & individual pricing in Prague 3.",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Reform — Precision Device Care Prague" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className={`${geist.variable} ${mono.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
