export const BRAND = {
  name: "Brazilian Coffee House",
  nameAr: "بيت البن البرازيلي",
  established: 1955,
  jordanSince: 1995,
  phone: "06 222 3330",
  phoneHref: "tel:+96262223330",
  whatsapp: "+96262223330",
  whatsappHref: "https://wa.me/96262223330",
  email: "info@bch-coffee.com",
  website: "https://braziliancoffeehouse.com",
  instagram: "https://www.instagram.com/brazilian_coffee_house/",
  logo: "/assets/brand/logo.png",
  currency: "JOD",
  currencySymbol: "JD",
  story:
    "In 1955, International Mill began in Kuwait, roasting and blending coffee with a focus on quality and hospitality. In 1995, the first international branch opened in Jordan as Brazilian Coffee House, bringing coffees from Brazil and other origins to Jordanian homes and cafés.",
  about:
    "Brazilian Coffee House has roasted and served coffee in Jordan since 1995, with roots that reach back to International Mill in Kuwait in 1955. We source from Brazil and other origins, then roast for Turkish, filter, espresso, Arabic, and capsule brewing.",
  branches: [
    { city: "Amman", cityAr: "عمّان", name: "Sweifieh", nameAr: "الصويفية", phone: "+962 7 9886 2810" },
    { city: "Amman", cityAr: "عمّان", name: "Gardens", nameAr: "الجاردنز", phone: "06 552 8055" },
    { city: "Amman", cityAr: "عمّان", name: "Marj Al Hamam", nameAr: "مرج الحمام", phone: "+962 7 9582 2576" },
    { city: "Amman", cityAr: "عمّان", name: "City Mall", nameAr: "السيتي مول", phone: "06 588 5112" },
    { city: "Amman", cityAr: "عمّان", name: "Al Fuhais", nameAr: "الفحيص", phone: "07 9844 4451" },
    { city: "Amman", cityAr: "عمّان", name: "Avenue Mall", nameAr: "الاڤينيو مول", phone: "07 9844 4450" },
    { city: "Al Mafraq", cityAr: "المفرق", name: "Al Mafraq", nameAr: "المفرق" },
    { city: "Irbid", cityAr: "إربد", name: "Irbid", nameAr: "إربد" },
  ],
} as const;

export function branchTelHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");
  if (compact === BRAND.phone.replace(/\s/g, "")) return BRAND.phoneHref;
  if (compact.startsWith("+")) return `tel:${compact}`;
  if (compact.startsWith("00")) return `tel:+${compact.slice(2)}`;
  if (compact.startsWith("0")) return `tel:+962${compact.slice(1)}`;
  if (compact.startsWith("962")) return `tel:+${compact}`;
  return `tel:${compact}`;
}

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
