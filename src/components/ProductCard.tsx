import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatGHS, whatsappLink } from "@/lib/whatsapp";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export function ProductCard({ product }: { product: Product }) {
  const sold = product.status === "sold";
  const img = product.images?.[0] ?? "https://placehold.co/600x400?text=No+Image";
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={img} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        {sold && (<Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">Sold Out</Badge>)}
        {product.featured && !sold && (<Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Featured</Badge>)}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {[product.ram, product.storage].filter(Boolean).join(" • ") || product.category}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">{formatGHS(product.price)}</span>
        </div>
        <Button asChild size="sm" disabled={sold} className="w-full">
          <a href={whatsappLink(product.name)} target="_blank" rel="noopener">
            <MessageCircle className="h-4 w-4 mr-1" />
            {sold ? "Sold" : "Order on WhatsApp"}
          </a>
        </Button>
      </div>
    </div>
  );
}
