import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Product } from "@/lib/api";

type Cat = "all" | "laptop" | "accessory";
type Sort = "newest" | "price_asc" | "price_desc";
type PriceFilter = "all" | "lt3000" | "3000_6000" | "gt6000";

const CATS: Cat[] = ["all", "laptop", "accessory"];
const SORTS: Sort[] = ["newest", "price_asc", "price_desc"];
const PRICES: PriceFilter[] = ["all", "lt3000", "3000_6000", "gt6000"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = (CATS.includes(searchParams.get("category") as Cat) ? searchParams.get("category") : "all") as Cat;
  const sort = (SORTS.includes(searchParams.get("sort") as Sort) ? searchParams.get("sort") : "newest") as Sort;
  const price = (PRICES.includes(searchParams.get("price") as PriceFilter) ? searchParams.get("price") : "all") as PriceFilter;
  const q = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(q);

  useEffect(() => { setQuery(q); }, [q]);

  useEffect(() => {
    setLoading(true);
    api.getProducts().then((data) => { setProducts(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    const qq = q.trim().toLowerCase();
    if (qq) list = list.filter((p) =>
      p.name.toLowerCase().includes(qq) ||
      (p.processor ?? "").toLowerCase().includes(qq) ||
      (p.description ?? "").toLowerCase().includes(qq)
    );
    if (price !== "all") {
      list = list.filter((p) => {
        const pr = Number(p.price);
        if (price === "lt3000") return pr < 3000;
        if (price === "3000_6000") return pr >= 3000 && pr <= 6000;
        return pr > 6000;
      });
    }
    const sorted = [...list];
    if (sort === "price_asc") sorted.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price_desc") sorted.sort((a, b) => Number(b.price) - Number(a.price));
    return sorted;
  }, [products, category, q, price, sort]);

  const updateParam = (key: string, value: string | undefined) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all" || value === "newest") next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", query.trim() || undefined);
  };

  return (
    <SiteLayout>
      <Seo
        title="Shop Laptops & Accessories"
        description="Browse all available laptops and accessories at Electronic Hive Ghana. Filter by price, category, and order on WhatsApp."
      />
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">All available laptops and accessories.</p>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          <form onSubmit={submitSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search laptops, processors…" className="pl-9" maxLength={80} />
          </form>
          <div className="flex gap-2 flex-wrap">
            {CATS.map((c) => (
              <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => updateParam("category", c)}>
                {c === "all" ? "All" : c === "laptop" ? "Laptops" : "Accessories"}
              </Button>
            ))}
          </div>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground self-center mr-1">Price:</span>
            {([["all", "All"], ["lt3000", "Under 3,000"], ["3000_6000", "3,000 – 6,000"], ["gt6000", "6,000+"]] as const).map(([key, label]) => (
              <Button key={key} variant={price === key ? "default" : "outline"} size="sm" onClick={() => updateParam("price", key)}>{label}</Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs text-muted-foreground">Sort:</label>
            <select id="sort" value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
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
                <div className="p-4 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-8 w-full mt-2" /></div>
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
