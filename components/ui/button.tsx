import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger";

const styles = {
  base: "inline-flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-50",
  sm: "h-9 px-4",
  md: "h-11 px-5",
  lg: "h-12 px-7",
  primary: "bg-forest text-cream hover:bg-forest-dark",
  secondary: "border border-ink/20 bg-transparent text-ink hover:border-forest hover:text-forest",
  ghost: "text-ink hover:text-forest",
  gold: "bg-gold text-forest-dark hover:bg-[#c9a75a]",
  danger: "bg-ink text-cream hover:bg-[#3a2f28]",
};

export function buttonClass(
  variant: Variant = "primary",
  size: "sm" | "md" | "lg" = "md",
  className?: string,
) {
  return cn(styles.base, styles[size], styles[variant], className);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const cls = buttonClass(variant, size, className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {props.children}
      </Link>
    );
  }
  return <button className={cls} {...props} />;
}
