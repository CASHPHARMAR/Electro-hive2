import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type FormState = {
  name: string; price: string; category: string;
  processor: string; ram: string; storage: string;
  condition: string; description: string; status: string;
  featured: boolean; images: string[];
};

const empty: FormState = {
  name: "", price: "", category: "laptop",
  processor: "", ram: "", storage: "",
  condition: "used", description: "", status: "available",
  featured: false, images: [],
};

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    supabase.from("products").select("*").eq("id", productId).maybeSingle().then(({ data }) => {
      if (data) setForm({
        name: data.name, price: String(data.price), category: data.category,
        processor: data.processor ?? "", ram: data.ram ?? "", storage: data.storage ?? "",
        condition: data.condition ?? "used", description: data.description ?? "",
        status: data.status, featured: data.featured, images: data.images ?? [],
      });
    });
  }, [productId]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("products").upload(path, file);
      if (error) { toast.error(error.message); continue; }
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    update("images", [...form.images, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (i: number) => update("images", form.images.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name, price: Number(form.price) || 0, category: form.category,
      processor: form.processor || null, ram: form.ram || null, storage: form.storage || null,
      condition: form.condition, description: form.description || null,
      status: form.status, featured: form.featured, images: form.images,
    };
    const { error } = productId
      ? await supabase.from("products").update(payload).eq("id", productId)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(productId ? "Updated" : "Published");
    router.navigate({ to: "/admin/products" });
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Label>Name</Label><Input required value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
        <div><Label>Price (GHS)</Label><Input type="number" required value={form.price} onChange={(e) => update("price", e.target.value)} /></div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="accessory">Accessory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Processor</Label><Input value={form.processor} onChange={(e) => update("processor", e.target.value)} /></div>
        <div><Label>RAM</Label><Input value={form.ram} onChange={(e) => update("ram", e.target.value)} placeholder="e.g. 16GB" /></div>
        <div><Label>Storage</Label><Input value={form.storage} onChange={(e) => update("storage", e.target.value)} placeholder="e.g. 512GB SSD" /></div>
        <div>
          <Label>Condition</Label>
          <Select value={form.condition} onValueChange={(v) => update("condition", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => update("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
          <Label className="cursor-pointer">Featured product</Label>
        </div>
      </div>

      <div>
        <Label>Images</Label>
        <div className="mt-2 flex flex-wrap gap-3">
          {form.images.map((src, i) => (
            <div key={i} className="relative h-24 w-24 rounded-lg overflow-hidden border border-border">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Upload className="h-5 w-5" />
            <span className="text-xs mt-1">{uploading ? "…" : "Upload"}</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          </label>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={saving}>{productId ? "Save changes" : "Publish"}</Button>
    </form>
  );
}
