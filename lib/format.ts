const JOD = "JOD";

function fractionDigits(value: string | number): number {
  const raw = String(value);
  const fraction = raw.includes(".") ? raw.split(".")[1] ?? "" : "";
  return fraction.length >= 3 ? 3 : 2;
}

export function formatMoney(
  value: string | number | null | undefined,
  currency = JOD,
): string {
  if (value === null || value === undefined || value === "") return "";
  const amount = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat("en-JO", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits(value),
    maximumFractionDigits: 3,
  }).format(amount);
}

export function formatDate(value?: string | null, withTime = false): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function titleCase(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `bch-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
