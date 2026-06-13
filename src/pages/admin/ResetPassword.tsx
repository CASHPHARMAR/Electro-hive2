import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. You are signed in.");
    navigate("/calvin-admin");
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          {ready ? "Enter your new password below." : "Validating reset link…"}
        </p>
        {ready && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Updating…" : "Update Password"}
            </Button>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}