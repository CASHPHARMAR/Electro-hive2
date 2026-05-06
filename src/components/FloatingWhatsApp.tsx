import { MessageCircle } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { whatsappLink } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith("/product/");

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className={`fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-elegant)] hover:scale-110 transition-transform ${
        isProductPage ? "bottom-24 md:bottom-5" : "bottom-5"
      }`}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}