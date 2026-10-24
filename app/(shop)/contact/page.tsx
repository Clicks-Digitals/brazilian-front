import type { Metadata } from "next";
import { ContactForm } from "@/features/storefront/contact-form";
import { BRAND } from "@/lib/brand";
import { serverGet } from "@/lib/server-get";
import { normalizeSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit or write to ${BRAND.name}. ${BRAND.phone} · ${BRAND.email}`,
};

function phoneHref(phone: string) {
  const compact = phone.replace(/\s/g, "");
  if (compact === BRAND.phone.replace(/\s/g, "")) return BRAND.phoneHref;
  if (compact.startsWith("+")) return `tel:${compact}`;
  if (compact.startsWith("0")) return `tel:+962${compact.slice(1)}`;
  return `tel:${compact}`;
}

function groupBranches(
  branches: Array<{ name: string; city?: string; address?: string; phone?: string }>,
) {
  const groups = new Map<string, typeof branches>();
  for (const branch of branches) {
    const city = branch.city || "Jordan";
    const list = groups.get(city) ?? [];
    list.push(branch);
    groups.set(city, list);
  }
  return [...groups.entries()];
}

export default async function ContactPage() {
  let settings = normalizeSettings({});
  try {
    settings = normalizeSettings(await serverGet("/settings/"));
  } catch {
    /* brand fallbacks */
  }
  const phone = settings.phone || BRAND.phone;
  const email = settings.email || BRAND.email;
  const branches = (settings.branches?.length ? settings.branches : BRAND.branches).map((branch) => ({
    name: branch.name,
    city: "city" in branch ? branch.city : undefined,
    address: "address" in branch ? branch.address : undefined,
    phone: "phone" in branch ? branch.phone : undefined,
  }));
  const social = Object.entries(settings.social || {}).filter(([, url]) => Boolean(url));
  const cities = groupBranches(branches);

  return (
    <div className="pb-16 md:pb-24">
      <section className="border-b border-ink/8 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20" data-reveal>
          <p className="eyebrow text-gold">Contact</p>
          <h1 className="font-display mt-4 text-[2rem] leading-tight text-ink sm:text-4xl md:text-5xl">Visit us</h1>
          <p className="font-subtitle mt-3 text-sm text-muted" dir="rtl" lang="ar">
            {settings.store_name_ar || BRAND.nameAr}
          </p>
          <p className="font-subtitle mt-5 max-w-xl text-base leading-relaxed text-muted md:mt-6 md:text-lg">
            Questions about roast, wholesale, or a branch in Jordan. Call the house, send a note, or come in.
          </p>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-10">
            <a href={phoneHref(phone)} className="group block min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">Telephone</p>
              <p className="font-subtitle mt-2 text-xl font-normal text-ink transition group-hover:text-forest sm:text-2xl">
                {phone}
              </p>
            </a>
            <a href={`mailto:${email}`} className="group block min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">Email</p>
              <p className="font-subtitle mt-2 break-words text-lg font-normal text-ink transition group-hover:text-forest sm:text-2xl">
                {email}
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 md:gap-16 md:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-24">
        <div className="min-w-0" data-reveal>
          <p className="eyebrow text-gold">Write</p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl md:text-4xl">Send a note</h2>
          <p className="font-subtitle mt-3 max-w-md text-muted">
            Roast lots, wholesale, or a message for a branch. We reply from the house.
          </p>
          <div className="mt-8 md:mt-10">
            <ContactForm />
          </div>
        </div>

        <div className="min-w-0" data-reveal>
          <p className="eyebrow text-gold">Visit</p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl md:text-4xl">Branches</h2>
          <p className="font-subtitle mt-3 text-muted">Eight houses across Jordan.</p>

          <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
            {cities.map(([city, list]) => (
              <div key={city}>
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{city}</p>
                <ul className="mt-3">
                  {list.map((branch) => (
                    <li key={`${city}-${branch.name}`} className="border-t border-ink/10 last:border-b">
                      <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:py-4">
                        <p className="font-subtitle text-lg font-normal text-ink sm:text-xl">{branch.name}</p>
                        {branch.phone ? (
                          <a
                            href={phoneHref(branch.phone)}
                            className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-forest sm:shrink-0"
                          >
                            {branch.phone}
                          </a>
                        ) : (
                          <span className="text-[11px] uppercase tracking-[0.16em] text-muted sm:shrink-0">
                            {branch.address || "Open"}
                          </span>
                        )}
                      </div>
                      {branch.address && branch.phone ? (
                        <p className="font-subtitle -mt-1 pb-3.5 text-sm text-muted sm:-mt-2 sm:pb-4">
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
            <div className="mt-12 border-t border-ink/8 pt-8">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">Follow</p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                {social.map(([network, url]) => (
                  <li key={network}>
                    <a
                      href={url}
                      className="font-subtitle capitalize text-ink hover:text-forest"
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
