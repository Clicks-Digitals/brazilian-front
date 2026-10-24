import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IntroSplash } from "@/components/layout/intro-splash";
import { Providers } from "@/components/providers";
import { BRAND, SITE_URL } from "@/lib/brand";
import "./globals.css";

const careem = localFont({
  src: [
    { path: "./fonts/Careem-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Careem-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-careem",
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
    default: `${BRAND.name} | ${BRAND.nameAr}`,
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
  icons: { icon: BRAND.logo },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={careem.variable}>
      <body className={`${careem.className} min-h-screen bg-white font-sans text-ink antialiased`}>
        <IntroSplash />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
