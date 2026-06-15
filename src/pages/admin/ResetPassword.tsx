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
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorDescription = params.get("error_description") || hashParams.get("error_description");

    if (errorDescription) {
      setLinkError(errorDescription.replace(/\+/g, " "));
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });

    const code = params.get("code");
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
        if (error) setLinkError(error.message);
        else setReady(true);
      });
    } else if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setLinkError(error.message);
        else setReady(true);
      });
    } else {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) setLinkError(error.message);
        else if (data.session) setReady(true);
        else setLinkError("This reset link is invalid or expired. Please request a new one from the admin login page.");
      });
    }

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
        {linkError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-6">
            {linkError}
          </div>
        )}
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