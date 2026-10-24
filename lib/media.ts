function publicHost(): string {
  const fromEnv = [
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].find((value) => value && !/localhost|127\.0\.0\.1/.test(value));
  if (!fromEnv) return "";
  return fromEnv.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

const MEDIA_BASE = (
  publicHost()
    ? `https://${publicHost()}`
    : process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

function mediaOrigin() {
  if (typeof window !== "undefined" && !/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
    return window.location.origin;
  }
  return MEDIA_BASE;
}

export function mediaUrl(
  path?: string | null,
): string | null {
  if (!path) return null;
  const stripped = path.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, "");
  if (stripped.startsWith("http://") || stripped.startsWith("https://") || stripped.startsWith("data:")) {
    return stripped;
  }
  const normalized = stripped.startsWith("/") ? stripped : `/${stripped}`;
  if (normalized.startsWith("/assets/")) return normalized;
  return `${mediaOrigin()}${normalized}`;
}

export function imageAlt(
  image?: { alt_text?: string } | null,
  fallback = "Brazilian Coffee House",
): string {
  return image?.alt_text?.trim() || fallback;
}
