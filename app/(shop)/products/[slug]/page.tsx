import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ErrorState } from "@/components/ui/states";
import { ProductDetail } from "@/features/shop/product-detail";
import { SITE_URL } from "@/lib/brand";
import { errorMessage } from "@/lib/http";
import { serverGet } from "@/lib/server-get";
import { formatMoney } from "@/lib/format";
import { pickImage } from "@/lib/settings";
import type { Product } from "@/types/api";

type Props = { params: Promise<{ slug: string }> };

async function loadProduct(slug: string) {
  return serverGet<Product>(`/products/${slug}/`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await loadProduct(slug);
    return {
      title: product.seo_title || product.name,
      description: product.seo_description || product.short_description || product.tasting_notes,
      openGraph: {
        images: pickImage(product) ? [{ url: pickImage(product)! }] : undefined,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await loadProduct(slug);
    const variant = product.default_variant || product.variants?.[0];
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description || product.short_description,
              image: pickImage(product),
              sku: variant?.sku || product.sku,
              offers: variant
                ? {
                    "@type": "Offer",
                    priceCurrency: "JOD",
                    price: variant.price,
                    availability: variant.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    url: `${SITE_URL}/products/${product.slug}`,
                  }
                : undefined,
            }),
          }}
        />
        <ProductDetail product={product} />
        {variant?.price ? (
          <span className="sr-only">{formatMoney(variant.price)}</span>
        ) : null}
      </>
    );
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && (error as { status: number }).status === 404) {
      notFound();
    }
    return <ErrorState description={errorMessage(error)} />;
  }
}
