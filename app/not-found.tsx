import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-forest px-6 text-center text-cream">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BRAND.logo} alt="" className="mb-8 size-20" />
      <p className="eyebrow text-gold">404</p>
      <h1 className="font-display mt-3 text-4xl">{t(locale, "pageNotOnShelf")}</h1>
      <p className="mt-4 max-w-md text-cream/75">
        {t(locale, "pageNotOnShelfBlurb")}
      </p>
      <div className="mt-8">
        <Button href="/" variant="gold">{t(locale, "backHome")}</Button>
      </div>
    </div>
  );
}
