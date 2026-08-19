import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import { StructuredData } from "@/components/StructuredData";
import { NONCE_REQUEST_HEADER } from "@/lib/security-headers";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#090a0f" },
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
    default: "Reform · Prague — Component Device Care & Electronics Lab",
    template: "%s | Reform Prague",
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
    title: "Reform · Prague — Precision Device Care",
    description:
      "Component-level electronics repair, micro-soldering & transparent individual pricing in Prague 3.",
    url: "https://reart.cz",
    siteName: "Reform Prague",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Reform — Precision Device Care Prague",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reform · Prague — Precision Device Care",
    description: "Component-level electronics repair & micro-soldering in Prague 3.",
    images: ["/icon.png"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Reform · Prague Device Care",
  "image": "https://reart.cz/icon.png",
  "telephone": "+420737500587",
  "email": "fear75412@gmail.com",
  "url": "https://reart.cz",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Biskupcova 31",
    "addressLocality": "Praha 3",
    "postalCode": "130 00",
    "addressCountry": "CZ",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 50.0883,
    "longitude": 14.4715,
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "19:00",
    },
  ],
  "priceRange": "CZK",
  "sameAs": ["https://t.me/liltrafficRUS"],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Per-request CSP nonce from middleware.ts. Reading headers() here opts
  // every page into dynamic rendering, which per-request nonces require.
  const requestHeaders = await headers();
  const nonce = requestHeaders.get(NONCE_REQUEST_HEADER) ?? undefined;

  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <StructuredData data={localBusinessSchema} nonce={nonce} />
        <script
          nonce={nonce}
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
