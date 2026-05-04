import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sun, Laptop, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" onClick={close} className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Laptop className="h-4 w-4" />
          </span>
          <span>Electronic Hive</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }} className="hover:text-primary transition-colors">Home</Link>
          <Link to="/shop" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">Shop</Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">About</Link>
          <Link to="/contact" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1 text-sm font-medium">
            <Link to="/" onClick={close} className="py-2 hover:text-primary">Home</Link>
            <Link to="/shop" onClick={close} className="py-2 hover:text-primary">Shop</Link>
            <Link to="/about" onClick={close} className="py-2 hover:text-primary">About</Link>
            <Link to="/contact" onClick={close} className="py-2 hover:text-primary">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}