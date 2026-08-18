import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#040711" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://reart.cz"),
  title: {
    default: "RE:Art — Precision Electronics Repair Prague",
    template: "%s | RE:Art Prague",
  },
  description:
    "Component-level electronics repair, micro-soldering, OLED calibration, and direct transparent quotes for Apple, Samsung, Google in Prague 3. Telegram @liltrafficRUS.",
  keywords: [
    "servis praha",
    "oprava iphone praha",
    "mikropájení praha 3",
    "oprava macbook praha",
    "výměna displeje praha",
    "apple servis zizkov",
    "samsung servis praha",
    "repair shop prague",
    "electronics repair prague",
    "BGA micro-soldering",
  ],
  authors: [{ name: "Artem Mikhailov", url: "https://t.me/liltrafficRUS" }],
  creator: "Artem Mikhailov",
  manifest: "/manifest.json",
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
    description:
      "Component-level electronics repair, micro-soldering & transparent individual pricing in Prague 3.",
    url: "https://reart.cz",
    siteName: "RE:Art Prague",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "RE:Art — Precision Device Care Prague",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RE:Art — Precision Device Care Prague",
    description: "Component-level electronics repair & micro-soldering in Prague 3.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('reform_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geist.variable} ${mono.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
