import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/ProductForm";

export const Route = createFileRoute("/admin/edit/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  return (<><h2 className="text-xl font-bold mb-6">Edit Product</h2><ProductForm productId={id} /></>);
}
