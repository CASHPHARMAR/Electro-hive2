import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const searchSchema = z.object({
  category: z.enum(["all", "laptop", "accessory"]).catch("all"),
  q: z.string().optional().catch(undefined),
  sort: z.enum(["newest", "price_asc", "price_desc"]).catch("newest"),
  price: z.enum(["all", "lt3000", "3000_6000", "gt6000"]).catch("all"),
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
  const [query, setQuery] = useState(search.q ?? "");

  useEffect(() => {
    setLoading(true);
    supabase.from("products").select("*").eq("status", "available").order("created_at", { ascending: false })
      .then(({ data }) => { setProducts(data ?? []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (search.category !== "all") list = list.filter((p) => p.category === search.category);
    const q = (search.q ?? "").trim().toLowerCase();
    if (q) list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.processor ?? "").toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
    );
    if (search.price !== "all") {
      list = list.filter((p) => {
        const price = Number(p.price);
        if (search.price === "lt3000") return price < 3000;
        if (search.price === "3000_6000") return price >= 3000 && price <= 6000;
        return price > 6000;
      });
    }
    const sorted = [...list];
    if (search.sort === "price_asc") sorted.sort((a, b) => Number(a.price) - Number(b.price));
    else if (search.sort === "price_desc") sorted.sort((a, b) => Number(b.price) - Number(a.price));
    return sorted;
  }, [products, search.category, search.q, search.price, search.sort]);

  const setCat = (c: "all" | "laptop" | "accessory") =>
    navigate({ search: (prev) => ({ ...prev, category: c }) });

  const setPrice = (p: "all" | "lt3000" | "3000_6000" | "gt6000") =>
    navigate({ search: (prev) => ({ ...prev, price: p }) });

  const setSort = (s: "newest" | "price_asc" | "price_desc") =>
    navigate({ search: (prev) => ({ ...prev, sort: s }) });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: (prev) => ({ ...prev, q: query.trim() || undefined }) });
  };

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">All available laptops and accessories.</p>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          <form onSubmit={submitSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search laptops, processors…"
              className="pl-9"
              maxLength={80}
            />
          </form>
          <div className="flex gap-2 flex-wrap">
            {(["all", "laptop", "accessory"] as const).map((c) => (
              <Button key={c} variant={search.category === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>
                {c === "all" ? "All" : c === "laptop" ? "Laptops" : "Accessories"}
              </Button>
            ))}
          </div>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground self-center mr-1">Price:</span>
            {([
              ["all", "All"],
              ["lt3000", "Under 3,000"],
              ["3000_6000", "3,000 – 6,000"],
              ["gt6000", "6,000+"],
            ] as const).map(([key, label]) => (
              <Button key={key} variant={search.price === key ? "default" : "outline"} size="sm" onClick={() => setPrice(key)}>
                {label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs text-muted-foreground">Sort:</label>
            <select
              id="sort"
              value={search.sort}
              onChange={(e) => setSort(e.target.value as "newest" | "price_asc" | "price_desc")}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
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
