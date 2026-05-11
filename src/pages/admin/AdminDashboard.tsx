import { useEffect, useState } from "react";
import { Package, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0 });
  useEffect(() => {
    supabase.from("products").select("status").then(({ data }) => {
      const list = data ?? [];
      setStats({
        total: list.length,
        available: list.filter((p) => p.status === "available").length,
        sold: list.filter((p) => p.status === "sold").length,
      });
    });
  }, []);
  const cards = [
    { label: "Total products", value: stats.total, icon: Package, color: "text-primary" },
    { label: "Available", value: stats.available, icon: CheckCircle, color: "text-success" },
    { label: "Sold", value: stats.sold, icon: XCircle, color: "text-destructive" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <c.icon className={`h-5 w-5 ${c.color}`} />
          </div>
          <p className="text-3xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
