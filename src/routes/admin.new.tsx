import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/ProductForm";

export const Route = createFileRoute("/admin/new")({
  component: () => (<><h2 className="text-xl font-bold mb-6">Add Product</h2><ProductForm /></>),
});
