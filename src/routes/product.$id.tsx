import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Cpu, MemoryStick, HardDrive, Sparkles, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
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
  const [zoom, setZoom] = useState(false);
  const [related, setRelated] = useState<Tables<"products">[]>([]);
  const [mainEmbla, mainApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [zoomEmbla, zoomApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (!mainApi) return;
    const onSelect = () => setActive(mainApi.selectedScrollSnap());
    mainApi.on("select", onSelect);
    onSelect();
    return () => { mainApi.off("select", onSelect); };
  }, [mainApi]);

  useEffect(() => {
    if (zoom && zoomApi) zoomApi.scrollTo(active, true);
  }, [zoom, zoomApi, active]);

  useEffect(() => {
    if (!zoomApi) return;
    const onSelect = () => setActive(zoomApi.selectedScrollSnap());
    zoomApi.on("select", onSelect);
    return () => { zoomApi.off("select", onSelect); };
  }, [zoomApi]);

  useEffect(() => {
    setLoading(true);
    setActive(0);
    supabase.from("products").select("*").eq("id", id).maybeSingle()
      .then(({ data }) => { setProduct(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (product?.name) document.title = `${product.name} — Electronic Hive`;
    if (!product) return;
    supabase.from("products").select("*").eq("category", product.category).eq("status", "available").neq("id", product.id).limit(4)
      .then(({ data }) => setRelated(data ?? []));
  }, [product]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowLeft") zoomApi?.scrollPrev();
      if (e.key === "ArrowRight") zoomApi?.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, zoomApi]);

  if (loading) return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-[4/3] rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </SiteLayout>
  );
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
      <div className="container mx-auto px-4 py-8 pb-28 md:pb-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="min-w-0">
            <div className="relative group rounded-2xl overflow-hidden border border-border bg-muted">
              <div className="overflow-hidden" ref={mainEmbla}>
                <div className="flex touch-pan-y">
                  {images.map((src, i) => (
                    <div key={i} className="relative min-w-0 flex-[0_0_100%] aspect-[4/3]">
                      <button
                        type="button"
                        onClick={() => setZoom(true)}
                        aria-label="Zoom image"
                        className="block h-full w-full"
                      >
                        <img
                          src={src}
                          alt={`${product.name} - image ${i + 1}`}
                          loading={i === 0 ? "eager" : "lazy"}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => mainApi?.scrollPrev()}
                    aria-label="Previous"
                    className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mainApi?.scrollNext()}
                    aria-label="Next"
                    className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => mainApi?.scrollTo(i)}
                        aria-label={`Go to image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <span className="pointer-events-none absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4" />
              </span>
            </div>
            {images.length > 1 && (
              <div className="hidden md:flex gap-2 mt-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => mainApi?.scrollTo(i)}
                    className={`h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === active ? "border-primary" : "border-border opacity-70 hover:opacity-100"}`}
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
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

            <Button asChild size="lg" className="hidden md:flex w-full" disabled={sold}>
              <a href={whatsappLink(product.name)} target="_blank" rel="noopener">
                <MessageCircle className="h-4 w-4 mr-1" />
                {sold ? "Sold Out" : "Order on WhatsApp"}
              </a>
            </Button>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile WhatsApp CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur p-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{product.name}</p>
          <p className="text-base font-bold text-primary">{formatGHS(product.price)}</p>
        </div>
        <Button asChild size="sm" disabled={sold} className="bg-success text-success-foreground hover:bg-success/90">
          <a href={whatsappLink(product.name)} target="_blank" rel="noopener">
            <MessageCircle className="h-4 w-4 mr-1" />
            {sold ? "Sold" : "Order"}
          </a>
        </Button>
      </div>

      {/* Lightbox */}
      {zoom && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setZoom(false)}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoom(false); }}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); zoomApi?.scrollPrev(); }}
                aria-label="Previous"
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); zoomApi?.scrollNext(); }}
                aria-label="Next"
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <div className="overflow-hidden w-full h-full" ref={zoomEmbla} onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full touch-pan-y">
              {images.map((src, i) => (
                <div key={i} className="min-w-0 flex-[0_0_100%] h-full flex items-center justify-center p-4">
                  <img src={src} alt={`${product.name} - image ${i + 1}`} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </SiteLayout>
  );
}
