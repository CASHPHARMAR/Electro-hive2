import { Outlet, Link, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Plus, Package } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <SiteLayout><div className="container p-12">Loading…</div></SiteLayout>;

  if (!isAuthenticated) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-16 max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground mb-6 text-sm">Sign in to manage products.</p>
          <Button onClick={login} className="w-full">Log In</Button>
          <p className="mt-6 text-xs text-muted-foreground text-center">Admin access is restricted. Contact the site owner.</p>
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
