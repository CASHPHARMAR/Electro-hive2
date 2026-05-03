import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const searchSchema = z.object({
  category: z.enum(["all", "laptop", "accessory"]).catch("all"),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop — Electronic Hive" },
      { name: "description", content: "Browse our laptops & accessories available now in Accra, Ghana." },
    ],
  }),
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from("products").select("*").eq("status", "available").order("created_at", { ascending: false })
      .then(({ data }) => { setProducts(data ?? []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    if (search.category === "all") return products;
    return products.filter((p) => p.category === search.category);
  }, [products, search.category]);

  const setCat = (c: "all" | "laptop" | "accessory") =>
    navigate({ search: { category: c } });

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">All available laptops and accessories.</p>
        </div>
        <div className="flex gap-2 mb-8 flex-wrap">
          {(["all", "laptop", "accessory"] as const).map((c) => (
            <Button key={c} variant={search.category === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>
              {c === "all" ? "All" : c === "laptop" ? "Laptops" : "Accessories"}
            </Button>
          ))}
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground py-16 text-center">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
