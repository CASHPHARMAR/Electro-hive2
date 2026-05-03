import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Cpu, MemoryStick, HardDrive, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatGHS, whatsappLink } from "@/lib/whatsapp";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Tables<"products"> | null>(null);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).maybeSingle()
      .then(({ data }) => { setProduct(data); setLoading(false); });
  }, [id]);

  if (loading) return <SiteLayout><div className="container mx-auto p-12">Loading…</div></SiteLayout>;
  if (!product) return <SiteLayout><div className="container mx-auto p-12 text-center">
    <h1 className="text-2xl font-bold mb-4">Product not found</h1>
    <Button asChild><Link to="/shop">Back to shop</Link></Button>
  </div></SiteLayout>;

  const sold = product.status === "sold";
  const images = product.images?.length ? product.images : ["https://placehold.co/800x600?text=No+Image"];

  const specs = [
    { icon: Cpu, label: "Processor", value: product.processor },
    { icon: MemoryStick, label: "RAM", value: product.ram },
    { icon: HardDrive, label: "Storage", value: product.storage },
    { icon: Sparkles, label: "Condition", value: product.condition },
  ].filter((s) => s.value);

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted border border-border">
              <img src={images[active]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${i === active ? "border-primary" : "border-border"}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category}</Badge>
              {sold ? <Badge className="bg-destructive">Sold Out</Badge> : <Badge className="bg-success text-success-foreground">Available</Badge>}
              {product.featured && <Badge className="bg-primary">Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">{formatGHS(product.price)}</p>

            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-lg border border-border p-3 bg-card">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <s.icon className="h-3 w-3" /> {s.label}
                    </div>
                    <p className="font-medium text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <Button asChild size="lg" className="w-full" disabled={sold}>
              <a href={whatsappLink(product.name)} target="_blank" rel="noopener">
                <MessageCircle className="h-4 w-4 mr-1" />
                {sold ? "Sold Out" : "Order on WhatsApp"}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
