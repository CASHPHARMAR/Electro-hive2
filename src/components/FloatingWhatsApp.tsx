import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-elegant)] hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}