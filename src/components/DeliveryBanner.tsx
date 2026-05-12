import { useEffect, useState } from "react";
import { Truck, X } from "lucide-react";

const KEY = "eh-delivery-banner-dismissed-v1";

export function DeliveryBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="bg-primary text-primary-foreground text-xs sm:text-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 min-w-0">
          <Truck className="h-4 w-4 flex-shrink-0" />
          <span className="truncate"><strong>Same-day delivery</strong> in Accra · Nationwide via STC</span>
        </p>
        <button
          aria-label="Dismiss"
          onClick={() => { localStorage.setItem(KEY, "1"); setShow(false); }}
          className="flex-shrink-0 opacity-80 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
