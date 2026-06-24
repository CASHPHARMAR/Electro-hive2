import { MessageCircle, Phone, MapPin, Clock, Mail } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { whatsappLink, PHONE_DISPLAY, CONTACT_EMAIL } from "@/lib/whatsapp";

export default function Contact() {
  return (
    <SiteLayout>
      <Seo title="Contact Us" description="Reach Electronic Hive on WhatsApp or phone. Based in Accra, Ghana — we reply within minutes." />
      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
        <p className="text-muted-foreground mb-10">We reply within minutes. Reach out via WhatsApp for fastest response.</p>
        <div className="space-y-4">
          <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-[var(--shadow-elegant)] transition-all">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><MessageCircle /></span>
            <div><p className="font-semibold">WhatsApp</p><p className="text-sm text-muted-foreground">Tap to chat — reply within minutes</p></div>
          </a>
          <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"><Phone /></span>
            <div><p className="font-semibold">Phone</p><p className="text-sm text-muted-foreground">{PHONE_DISPLAY}</p></div>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-[var(--shadow-elegant)] transition-all">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"><Mail /></span>
            <div><p className="font-semibold">Email</p><p className="text-sm text-muted-foreground">{CONTACT_EMAIL}</p></div>
          </a>
          <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"><MapPin /></span>
            <div><p className="font-semibold">Location</p><p className="text-sm text-muted-foreground">Accra, Ghana</p></div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"><Clock /></span>
            <div><p className="font-semibold">Response time</p><p className="text-sm text-muted-foreground">We reply within minutes</p></div>
          </div>
        </div>
        <div className="mt-8">
          <Button asChild size="lg" className="w-full">
            <a href={whatsappLink()} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4 mr-1" /> Message Us on WhatsApp</a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
