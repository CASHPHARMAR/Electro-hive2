import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Tag, Star, MessageCircle, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { whatsappLink } from "@/lib/whatsapp";

export default function About() {
  const values = [
    { icon: ShieldCheck, title: "Tested & Reliable", text: "Every laptop is fully tested — battery, screen, ports, performance — before it ships." },
    { icon: Tag, title: "Fair Pricing", text: "Honest prices with no hidden fees. We tell you exactly what you're paying for." },
    { icon: Truck, title: "Fast Delivery", text: "Same-day delivery in Accra. Nationwide shipping available across Ghana." },
    { icon: Star, title: "Real Support", text: "Reach a real person on WhatsApp — usually within minutes." },
  ];
  return (
    <SiteLayout>
      <Seo title="About Us" description="Electronic Hive is a Ghana-based seller of tested, reliable laptops and accessories with same-day Accra delivery." />
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Electronic Hive</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We're a Ghana-based seller of quality laptops and accessories. Our mission is simple: get you a reliable
          machine at a fair price, with support you can actually reach.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <v.icon className="h-7 w-7 text-primary mb-2" />
              <h3 className="font-semibold mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Based in Accra</h2>
          <p className="text-muted-foreground text-sm">Pick up locally or get same-day delivery in Accra. We ship nationwide too.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/shop">Browse the shop</Link></Button>
          <Button asChild size="lg" variant="outline">
            <a href={whatsappLink()} target="_blank" rel="noopener">
              <MessageCircle className="h-4 w-4 mr-1" /> Chat on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
