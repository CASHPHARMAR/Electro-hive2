import { useParams } from "react-router-dom";
import { ProductForm } from "@/components/ProductForm";
export default function AdminEdit() {
  const { id } = useParams<{ id: string }>();
  return (<><h2 className="text-xl font-bold mb-6">Edit Product</h2><ProductForm productId={id} /></>);
}
