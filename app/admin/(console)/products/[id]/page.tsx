"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/features/admin/product-form";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-light">Edit product</h1>
      <ProductForm productId={params.id} />
    </div>
  );
}
