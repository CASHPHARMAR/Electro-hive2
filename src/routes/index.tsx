import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, ShieldCheck, Tag, Truck, Star, Laptop, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { whatsappLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import heroImage from "@/assets/hero-laptop.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Electronic Hive — Affordable Laptops & Accessories in Ghana" },
      { name: "description", content: "Tested laptops & accessories in Accra. Fair prices, fast delivery, WhatsApp ordering." },
    ],
  }),
});

function Home() {
  const [featured, setFeatured] = useState<Tables<"products">[]>([]);
  const [recent, setRecent] = useState<Tables<"products">[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").eq("featured", true).eq("status", "available").limit(8)
      .then(({ data }) => setFeatured(data ?? []));
    supabase.from("products").select("*").order("created_at", { ascending: false }).limit(4)
      .then(({ data }) => setRecent(data ?? []));
  }, []);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-subtle)" }}>
        <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium mb-4">
              <Star className="h-3 w-3" /> Trusted seller in Accra
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Electronic <span className="text-primary">Hive</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-md">
              Affordable laptops & accessories in Ghana — tested, reliable, and ready to ship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-[var(--shadow-elegant)]">
                <Link to="/shop"><Laptop className="h-4 w-4 mr-1" /> Shop Laptops</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink()} target="_blank" rel="noopener">
                  <MessageCircle className="h-4 w-4 mr-1" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-40" style={{ background: "var(--gradient-hero)" }} />
            <img src={heroImage} alt="Premium laptop" width={1536} height={1024} className="rounded-2xl shadow-[var(--shadow-elegant)] w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked deals you'll love</p>
            </div>
            <Link to="/shop" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/shop" search={{ category: "laptop" }} className="group relative overflow-hidden rounded-2xl border border-border p-8 bg-card hover:shadow-[var(--shadow-elegant)] transition-all">
            <Laptop className="h-10 w-10 text-primary mb-3" />
            <h3 className="text-xl font-bold">Laptops</h3>
            <p className="text-sm text-muted-foreground">Reliable laptops for work, school & gaming.</p>
            <ArrowRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link to="/shop" search={{ category: "accessory" }} className="group relative overflow-hidden rounded-2xl border border-border p-8 bg-card hover:shadow-[var(--shadow-elegant)] transition-all">
            <Headphones className="h-10 w-10 text-primary mb-3" />
            <h3 className="text-xl font-bold">Accessories</h3>
            <p className="text-sm text-muted-foreground">Chargers, mice, headphones & more.</p>
            <ArrowRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-secondary/40 py-16 mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Choose Us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Tested & Reliable", text: "Every device is fully tested before sale." },
              { icon: Tag, title: "Affordable Prices", text: "Fair pricing with no hidden fees." },
              { icon: Truck, title: "Fast Delivery", text: "Same-day delivery within Accra." },
              { icon: Star, title: "Trusted Seller", text: "Real customers, real reviews." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-card border border-border p-6 text-center shadow-[var(--shadow-card)]">
                <f.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      {recent.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {recent.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl p-10 md:p-16 text-center text-primary-foreground shadow-[var(--shadow-elegant)]" style={{ background: "var(--gradient-hero)" }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to get your laptop?</h2>
          <p className="opacity-90 mb-6">Message us on WhatsApp — we reply within minutes.</p>
          <Button asChild size="lg" variant="secondary">
            <a href={whatsappLink()} target="_blank" rel="noopener">
              <MessageCircle className="h-4 w-4 mr-1" /> Message Us on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
