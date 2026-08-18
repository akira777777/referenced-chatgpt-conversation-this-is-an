import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://reart.cz"),
  title: {
    default: "RE:Art — Precision Electronics Repair Prague",
    template: "%s | RE:Art Prague",
  },
  description: "Precision repairs, micro-soldering, and individual quotes for Apple, Samsung, Google in Prague 3. Telegram @liltrafficRUS.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "RE:Art — Precision Device Care Prague",
    description: "Component-level electronics repair, micro-soldering & individual pricing in Prague 3.",
    type: "website",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "RE:Art — Precision Device Care Prague" }],
  },
  twitter: { card: "summary_large_image", images: ["/icon.png"] },
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
