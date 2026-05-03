import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatGHS } from "@/lib/whatsapp";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/products")({
  component: ManageProducts,
});

function ManageProducts() {
  const [products, setProducts] = useState<Tables<"products">[]>([]);

  const load = () => {
    supabase.from("products").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setProducts(data ?? []));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  const markSold = async (id: string) => {
    const { error } = await supabase.from("products").update({ status: "sold" }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Marked as sold"); load(); }
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{formatGHS(p.price)}</td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3">
                  <Badge variant={p.status === "sold" ? "destructive" : "default"}>{p.status}</Badge>
                </td>
                <td className="p-3 text-right space-x-1 whitespace-nowrap">
                  {p.status !== "sold" && (
                    <Button size="sm" variant="ghost" onClick={() => markSold(p.id)} title="Mark as sold">
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  )}
                  <Button asChild size="sm" variant="ghost"><Link to="/admin/edit/$id" params={{ id: p.id }}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
