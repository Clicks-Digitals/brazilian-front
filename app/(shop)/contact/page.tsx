import type { Metadata } from "next";
import { ContactForm } from "@/features/storefront/contact-form";
import { BRAND, branchTelHref } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { serverGet } from "@/lib/server-get";
import { normalizeSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit or write to ${BRAND.name}. ${BRAND.phone} · ${BRAND.email}`,
};

type BranchRow = {
  name: string;
  nameAr?: string;
  city?: string;
  cityAr?: string;
  address?: string;
  phone?: string;
};

function enrichBranch(branch: BranchRow): BranchRow {
  const found = BRAND.branches.find(
    (item) => item.name.toLowerCase() === branch.name.toLowerCase() || item.nameAr === branch.name,
  );
  const foundPhone = found && "phone" in found ? String(found.phone) : undefined;
  return {
    name: branch.name,
    nameAr: found?.nameAr || branch.nameAr,
    city: branch.city || found?.city,
    cityAr: found?.cityAr || branch.cityAr,
    address: branch.address,
    phone: branch.phone || foundPhone,
  };
}

function groupBranches(branches: BranchRow[]) {
  const groups = new Map<string, typeof branches>();
  for (const branch of branches) {
    const city = branch.city || "Jordan"; // grouped; display label localized below
    const list = groups.get(city) ?? [];
    list.push(branch);
    groups.set(city, list);
  }
  return [...groups.entries()];
}

export default async function ContactPage() {
  const locale = await getLocale();
  let settings = normalizeSettings({});
  try {
    settings = normalizeSettings(await serverGet("/settings/"));
  } catch {
    /* brand fallbacks */
  }
  const phone = settings.phone || BRAND.phone;
  const email = settings.email || BRAND.email;
  const branches = (settings.branches?.length ? settings.branches : BRAND.branches).map((branch) => {
    const row = branch as BranchRow & { nameAr?: string; name_ar?: string };
    return enrichBranch({
      name: row.name,
      nameAr: row.nameAr || row.name_ar,
      city: row.city,
      address: row.address,
      phone: row.phone,
    });
  });
  const social = Object.entries(settings.social || {}).filter(([, url]) => Boolean(url));
  const cities = groupBranches(branches);

  return (
    <div className="pb-16 md:pb-24">
      <section className="border-b border-cream/10 bg-forest">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20" data-reveal>
          <p className="eyebrow text-gold">{t(locale, "contact")}</p>
          <h1 className="font-display mt-4 text-[2rem] leading-tight text-cream sm:text-4xl md:text-5xl">{t(locale, "visitUs")}</h1>
          <p className="font-subtitle mt-5 max-w-xl text-base leading-relaxed text-cream/75 md:mt-6 md:text-lg">
            {t(locale, "contactBlurb")}
          </p>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-10">
            <a href={branchTelHref(phone)} className="group block min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{t(locale, "telephone")}</p>
              <p className="font-subtitle mt-2 text-xl font-normal text-cream transition group-hover:text-gold sm:text-2xl">
                {phone}
              </p>
            </a>
            <a href={`mailto:${email}`} className="group block min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{t(locale, "email")}</p>
              <p className="font-subtitle mt-2 break-words text-lg font-normal text-cream transition group-hover:text-gold sm:text-2xl">
                {email}
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 md:gap-16 md:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-24">
        <div className="min-w-0" data-reveal>
          <p className="eyebrow text-gold">{t(locale, "write")}</p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl md:text-4xl">{t(locale, "sendANote")}</h2>
          <p className="font-subtitle mt-3 max-w-md text-cream/75">
            {t(locale, "contactFormBlurb")}
          </p>
          <div className="mt-8 md:mt-10">
            <ContactForm />
          </div>
        </div>

        <div className="min-w-0" data-reveal>
          <p className="eyebrow text-gold">{t(locale, "visit")}</p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl md:text-4xl">{t(locale, "branches")}</h2>
          <p className="font-subtitle mt-3 text-cream/75">{t(locale, "eightHouses")}</p>

          <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
            {cities.map(([city, list]) => (
              <div key={city}>
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                  {city === "Jordan"
                    ? t(locale, "jordan")
                    : locale === "ar"
                      ? list[0]?.cityAr || city
                      : city}
                </p>
                <ul className="mt-3">
                  {list.map((branch) => (
                    <li key={`${city}-${branch.name}`} className="border-t border-cream/15 last:border-b last:border-cream/15">
                      <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:py-4">
                        <p className="font-subtitle text-lg font-normal text-cream sm:text-xl">
                          {locale === "ar" ? branch.nameAr || branch.name : branch.name}
                        </p>
                        {branch.phone ? (
                          <a
                            href={branchTelHref(branch.phone)}
                            className="text-sm text-gold hover:text-cream sm:shrink-0"
                            dir="ltr"
                          >
                            {branch.phone}
                          </a>
                        ) : (
                          <span className="text-[11px] uppercase tracking-[0.16em] text-cream/70 sm:shrink-0">
                            {branch.address || t(locale, "open")}
                          </span>
                        )}
                      </div>
                      {branch.address && branch.phone ? (
                        <p className="font-subtitle -mt-1 pb-3.5 text-sm text-cream/70 sm:-mt-2 sm:pb-4">
                          {branch.address}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {social.length > 0 ? (
            <div className="mt-12 border-t border-cream/15 pt-8">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{t(locale, "follow")}</p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                {social.map(([network, url]) => (
                  <li key={network}>
                    <a
                      href={url}
                      className="font-subtitle capitalize text-cream hover:text-gold"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {network}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
