import { Phone, MapPin, MessageCircle } from "lucide-react";
import { whatsappLink, PHONE_DISPLAY } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-16">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <h3 className="font-bold text-base mb-3">Electronic Hive</h3>
          <p className="text-muted-foreground">Affordable laptops & accessories in Ghana. Tested, trusted, fast delivery in Accra.</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {PHONE_DISPLAY}</p>
          <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Accra, Ghana</p>
          <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-2 text-primary hover:underline">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li><a href="/shop" className="hover:text-primary">Shop</a></li>
            <li><a href="/contact" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Electronic Hive. All rights reserved.
      </div>
    </footer>
  );
}