import type { MessageKey } from "@/lib/i18n";
import type { ProductVariant } from "@/types/api";

type Translate = (key: MessageKey) => string;

const SIZE_KEYS: Record<string, MessageKey> = {
  s: "sizeSmall",
  small: "sizeSmall",
  m: "sizeMedium",
  medium: "sizeMedium",
  l: "sizeLarge",
  large: "sizeLarge",
  "250": "size250",
  "250g": "size250",
  "250غ": "size250",
  "500": "size500",
  "500g": "size500",
  "500غ": "size500",
  "1000": "size1000",
  "1000g": "size1000",
  "1000غ": "size1000",
  "1kg": "size1000",
  "1كغ": "size1000",
};

function normalize(value?: string) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "");
}

export function variantSizeLabel(variant: ProductVariant, t: Translate) {
  const weight = normalize(variant.weight_label);
  const name = normalize(variant.name);
  const key = SIZE_KEYS[weight] || SIZE_KEYS[name];
  if (key) return t(key);
  if (variant.weight_label?.trim()) return variant.weight_label.trim();
  if (variant.name?.trim() && name !== "default") return variant.name.trim();
  return t("size");
}
