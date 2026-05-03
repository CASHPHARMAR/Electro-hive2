import { Link } from "@tanstack/react-router";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Laptop className="h-4 w-4" />
          </span>
          <span>Electronic Hive</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }} className="hover:text-primary transition-colors">Home</Link>
          <Link to="/shop" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">Shop</Link>
          <Link to="/contact" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}