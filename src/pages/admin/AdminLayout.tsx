import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Plus, Package } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_EMAILS = ["theophiusakomanyi54@gmail.com"];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setAuthed(false); setIsAdmin(false); setLoading(false); return; }
    setAuthed(true);
    // Check both: email whitelist AND admin role in DB
    const userEmail = session.user.email?.toLowerCase() ?? "";
    const inWhitelist = ADMIN_EMAILS.includes(userEmail);
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    setIsAdmin(inWhitelist || !!roleRow);
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { checkAccess(); });
    checkAccess();
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else toast.success("Signed in");
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Enter your email"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent. Check your inbox.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <SiteLayout><div className="container p-12">Loading…</div></SiteLayout>;

  if (!authed) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground mb-6 text-sm">{resetMode ? "Reset your password." : "Sign in to manage products."}</p>
          <form onSubmit={resetMode ? sendReset : signIn} className="space-y-4">
            <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            {!resetMode && (<div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>)}
            <Button type="submit" className="w-full">{resetMode ? "Send Reset Email" : "Sign In"}</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setResetMode((v) => !v)}>
              {resetMode ? "Back to Sign In" : "Forgot password?"}
            </Button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground text-center">Admin access is restricted. Contact the site owner.</p>
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-16 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Not authorized</h1>
          <p className="text-muted-foreground mb-6">Your account does not have admin access.</p>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
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
            <Button onClick={signOut} variant="outline" size="sm"><LogOut className="h-4 w-4 mr-1" /> Sign Out</Button>
          </div>
        </div>
        <Outlet />
      </div>
    </SiteLayout>
  );
}
