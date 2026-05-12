import { NavLink } from "react-router-dom";
import { Home, Store, MessageCircle, Info, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/shop", label: "Shop", icon: Store },
];

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 h-16">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <it.icon className="h-5 w-5" />
              <span>{it.label}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener"
            aria-label="Chat on WhatsApp"
            className="flex flex-col items-center justify-center h-full -mt-4"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </span>
          </a>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Info className="h-5 w-5" />
            <span>About</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Phone className="h-5 w-5" />
            <span>Contact</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
