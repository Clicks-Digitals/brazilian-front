import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Alexandria } from "next/font/google";
import { IntroSplash } from "@/components/layout/intro-splash";
import { Providers } from "@/components/providers";
import { BRAND, SITE_URL } from "@/lib/brand";
import { getLocale } from "@/lib/locale-server";
import "./globals.css";

const careem = localFont({
  src: [
    { path: "./fonts/Careem-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Careem-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-careem",
  display: "swap",
});

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-alexandria",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1b4a38",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.about,
  openGraph: {
    title: BRAND.name,
    description: BRAND.about,
    images: [{ url: BRAND.logo }],
    locale: "en_JO",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
    shortcut: "/favicon.ico",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale === "ar" ? "ar" : "en"}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${careem.variable} ${alexandria.variable} ${locale === "ar" ? "is-ar" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-forest font-sans text-cream antialiased">
        <IntroSplash />
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
