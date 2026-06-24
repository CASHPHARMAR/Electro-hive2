import { useQuery, useQueryClient } from "@tanstack/react-query";

type AdminUser = { email: string };

async function fetchUser(): Promise<AdminUser | null> {
  const res = await fetch("/api/auth/user", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<AdminUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.message ?? "Invalid credentials" };
    }
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    return { ok: true };
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
