export const BRAND = {
  name: "Brazilian Coffee House",
  nameAr: "بيت البن البرازيلي",
  established: 1955,
  jordanSince: 1995,
  phone: "06 222 3330",
  phoneHref: "tel:+96262223330",
  email: "info@bch-coffee.com",
  website: "https://braziliancoffeehouse.com",
  logo: "/assets/brand/logo.png",
  currency: "JOD",
  currencySymbol: "JD",
  story:
    "In 1955, International Mill began in Kuwait, roasting and blending coffee with a focus on quality and hospitality. In 1995, the first international branch opened in Jordan as Brazilian Coffee House — بيت البن البرازيلي — bringing coffees from Brazil and other origins to Jordanian homes and cafés.",
  about:
    "Brazilian Coffee House has roasted and served coffee in Jordan since 1995, with roots that reach back to International Mill in Kuwait in 1955. We source from Brazil and other origins, then roast for Turkish, filter, espresso, Arabic, and capsule brewing.",
  branches: [
    { city: "Amman", name: "City Mall" },
    { city: "Amman", name: "Sweifieh" },
    { city: "Amman", name: "Gardens" },
    { city: "Amman", name: "Avenue Mall" },
    { city: "Amman", name: "Marj Al Hamam" },
    { city: "Amman", name: "Al Fuhais" },
    { city: "Al Mafraq", name: "Al Mafraq" },
    { city: "Irbid", name: "Irbid" },
  ],
} as const;

const vercelHost = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
].find((value) => value && !/localhost|127\.0\.0\.1/.test(value));

export const SITE_URL = vercelHost
  ? vercelHost.startsWith("http")
    ? vercelHost.replace(/\/$/, "")
    : `https://${vercelHost}`
  : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
