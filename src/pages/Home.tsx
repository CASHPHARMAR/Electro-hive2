import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, ShieldCheck, Tag, Truck, Star, Laptop, Headphones, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { whatsappLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import heroImage from "@/assets/hero-laptop.jpg";

export default function Home() {
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
      <Seo
        title="Electronic Hive — Affordable Laptops & Accessories in Ghana"
        description="Tested laptops & accessories in Accra, Ghana. Fair prices, same-day delivery, WhatsApp ordering."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Electronic Hive",
          description: "Affordable laptops & accessories in Ghana — tested, trusted, fast delivery.",
          address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
          telephone: "+233538239083",
          url: typeof window !== "undefined" ? window.location.origin : "",
        }}
      />
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

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/shop?category=laptop" className="group relative overflow-hidden rounded-2xl border border-border p-8 bg-card hover:shadow-[var(--shadow-elegant)] transition-all">
            <Laptop className="h-10 w-10 text-primary mb-3" />
            <h3 className="text-xl font-bold">Laptops</h3>
            <p className="text-sm text-muted-foreground">Reliable laptops for work, school & gaming.</p>
            <ArrowRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link to="/shop?category=accessory" className="group relative overflow-hidden rounded-2xl border border-border p-8 bg-card hover:shadow-[var(--shadow-elegant)] transition-all">
            <Headphones className="h-10 w-10 text-primary mb-3" />
            <h3 className="text-xl font-bold">Accessories</h3>
            <p className="text-sm text-muted-foreground">Chargers, mice, headphones & more.</p>
            <ArrowRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </section>

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

      {recent.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {recent.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real feedback from buyers across Ghana.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Kwame A.", city: "Accra", text: "Got my Dell laptop same day. Battery, screen, everything as described. Will definitely buy again." },
              { name: "Ama B.", city: "Kumasi", text: "Honest pricing and fast WhatsApp replies. They walked me through specs until I picked the right one." },
              { name: "Kojo M.", city: "Tema", text: "Bought a HP for school. Working perfectly 3 months in. Trustworthy seller, highly recommend." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)] flex flex-col">
                <Quote className="h-6 w-6 text-primary mb-3" />
                <p className="text-sm text-foreground/90 mb-4 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                  <div className="ml-auto flex text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-3 w-3 fill-current" />))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
