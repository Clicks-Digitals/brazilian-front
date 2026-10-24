"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { asList } from "@/lib/settings";
import { toast } from "@/features/ui/toast-store";
import type { Category, Product, ProductImage, ProductVariant } from "@/types/api";

type VariantDraft = {
  id?: number;
  name: string;
  sku: string;
  price: string;
  compare_at_price: string;
  stock_quantity: string;
  weight_label: string;
  is_active: boolean;
};

const emptyVariant = (): VariantDraft => ({
  name: "Default",
  sku: "",
  price: "",
  compare_at_price: "",
  stock_quantity: "0",
  weight_label: "",
  is_active: true,
});

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    slug: "",
    sku: "",
    category: "",
    short_description: "",
    description: "",
    tasting_notes: "",
    roast_level: "",
    origin: "",
    is_active: true,
    is_featured: false,
    is_new: false,
    is_promotional: false,
    allow_backorder: false,
    seo_title: "",
    seo_description: "",
  });
  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariant()]);

  useEffect(() => {
    api.get("/admin/categories/").then((data) => setCategories(asList<Category>(data))).catch(() => {
      api.get("/categories/", undefined, { auth: false }).then((data) => setCategories(asList<Category>(data)));
    });
  }, []);

  useEffect(() => {
    if (!productId) return;
    api.get<Product>(`/admin/products/${productId}/`).then((product) => {
      const categoryId =
        product.category && typeof product.category === "object" ? String(product.category.id) : String(product.category || "");
      setForm({
        name: product.name || "",
        name_ar: product.name_ar || "",
        slug: product.slug || "",
        sku: product.sku || "",
        category: categoryId,
        short_description: product.short_description || "",
        description: product.description || "",
        tasting_notes: product.tasting_notes || "",
        roast_level: product.roast_level || "",
        origin: product.origin || "",
        is_active: product.is_active !== false,
        is_featured: Boolean(product.is_featured),
        is_new: Boolean(product.is_new),
        is_promotional: Boolean(product.is_promotional),
        allow_backorder: Boolean(product.allow_backorder),
        seo_title: product.seo_title || "",
        seo_description: product.seo_description || "",
      });
      setImages(product.images || []);
      setVariants(
        (product.variants || []).map((v: ProductVariant) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compare_at_price: v.compare_at_price || "",
          stock_quantity: String(v.stock_quantity ?? 0),
          weight_label: v.weight_label || "",
          is_active: v.is_active !== false,
        })),
      );
    });
  }, [productId]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const payload = {
      ...form,
      category: Number(form.category) || form.category,
      variants: variants.map((v) => ({
        ...v,
        price: v.price,
        compare_at_price: v.compare_at_price || null,
        stock_quantity: Number(v.stock_quantity || 0),
      })),
    };
    try {
      const saved = productId
        ? await api.patch<Product>(`/admin/products/${productId}/`, payload)
        : await api.post<Product>("/admin/products/", payload);
      toast("Product saved", undefined, "success");
      if (!productId) router.push(`/admin/products/${saved.id}`);
    } catch (err) {
      toast("Could not save product", errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File | null) {
    if (!file || !productId) return;
    const body = new FormData();
    body.append("image", file);
    try {
      await api.post(`/admin/products/${productId}/images/`, body);
      toast("Image uploaded", undefined, "success");
      const product = await api.get<Product>(`/admin/products/${productId}/`);
      setImages(product.images || []);
    } catch (err) {
      toast("Upload failed", errorMessage(err), "error");
    }
  }

  return (
    <form onSubmit={save} className="grid max-w-4xl gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Arabic name">
          <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
        </Field>
        <Field label="Slug">
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </Field>
        <Field label="SKU">
          <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        </Field>
        <Field label="Category">
          <Select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Roast">
          <Select value={form.roast_level} onChange={(e) => setForm({ ...form, roast_level: e.target.value })}>
            <option value="">None</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="medium-dark">Medium dark</option>
            <option value="dark">Dark</option>
          </Select>
        </Field>
        <Field label="Origin">
          <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
        </Field>
        <Field label="Tasting notes">
          <Input value={form.tasting_notes} onChange={(e) => setForm({ ...form, tasting_notes: e.target.value })} />
        </Field>
      </div>
      <Field label="Short description">
        <Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
      </Field>
      <Field label="Description">
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <div className="flex flex-wrap gap-4">
        <Checkbox label="Published" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        <Checkbox label="Featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
        <Checkbox label="New" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} />
        <Checkbox label="Promotional" checked={form.is_promotional} onChange={(e) => setForm({ ...form, is_promotional: e.target.checked })} />
        <Checkbox label="Allow backorder" checked={form.allow_backorder} onChange={(e) => setForm({ ...form, allow_backorder: e.target.checked })} />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg">Variants</h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => setVariants([...variants, emptyVariant()])}>
            Add variant
          </Button>
        </div>
        <div className="space-y-3">
          {variants.map((variant, i) => (
            <div key={i} className="grid gap-2 border border-ink/10 p-3 md:grid-cols-6">
              <Input placeholder="Name" value={variant.name} onChange={(e) => {
                const next = [...variants]; next[i] = { ...variant, name: e.target.value }; setVariants(next);
              }} />
              <Input placeholder="SKU" value={variant.sku} onChange={(e) => {
                const next = [...variants]; next[i] = { ...variant, sku: e.target.value }; setVariants(next);
              }} />
              <Input placeholder="Price JOD" value={variant.price} onChange={(e) => {
                const next = [...variants]; next[i] = { ...variant, price: e.target.value }; setVariants(next);
              }} />
              <Input placeholder="Compare" value={variant.compare_at_price} onChange={(e) => {
                const next = [...variants]; next[i] = { ...variant, compare_at_price: e.target.value }; setVariants(next);
              }} />
              <Input placeholder="Stock" value={variant.stock_quantity} onChange={(e) => {
                const next = [...variants]; next[i] = { ...variant, stock_quantity: e.target.value }; setVariants(next);
              }} />
              <Input placeholder="Weight" value={variant.weight_label} onChange={(e) => {
                const next = [...variants]; next[i] = { ...variant, weight_label: e.target.value }; setVariants(next);
              }} />
            </div>
          ))}
        </div>
      </div>
      {productId ? (
        <div>
          <h2 className="mb-2 text-lg">Images</h2>
          <div className="mb-3 flex gap-2">
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                className="text-xs text-muted"
                onClick={async () => {
                  try {
                    await api.delete(`/admin/product-images/${img.id}/`);
                    setImages(images.filter((i) => i.id !== img.id));
                  } catch (err) {
                    toast("Could not delete image", errorMessage(err), "error");
                  }
                }}
              >
                Remove image {img.id}
              </button>
            ))}
          </div>
          <FileUpload label="Upload image" onFile={uploadImage} hint="JPG, PNG, WEBP up to 8 MB" />
        </div>
      ) : (
        <p className="text-sm text-muted">Save the product first to upload images.</p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save product"}
      </Button>
    </form>
  );
}
