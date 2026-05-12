import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { MobileBottomNav } from "./MobileBottomNav";
import { DeliveryBanner } from "./DeliveryBanner";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DeliveryBanner />
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />
    </div>
  );
}