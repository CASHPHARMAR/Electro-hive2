import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { LogOut, LayoutDashboard, Plus, Package, Mail, Lock, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) setError(result.error ?? "Invalid credentials");
  }

  if (isLoading) return <SiteLayout><div className="container p-12">Loading…</div></SiteLayout>;

  if (!isAuthenticated) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-2xl font-bold mb-1 text-center">Admin Login</h1>
            <p className="text-muted-foreground text-sm text-center mb-7">Sign in to manage products.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h1 className="text-3xl font-bold">Admin</h1>
          <div className="flex gap-2 flex-wrap">
            <Button asChild variant="ghost" size="sm"><Link to="/calvin-admin"><LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/calvin-admin/products"><Package className="h-4 w-4 mr-1" /> Products</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/calvin-admin/new"><Plus className="h-4 w-4 mr-1" /> Add Product</Link></Button>
            <Button onClick={logout} variant="outline" size="sm"><LogOut className="h-4 w-4 mr-1" /> Sign Out</Button>
          </div>
        </div>
        <Outlet />
      </div>
    </SiteLayout>
  );
}
