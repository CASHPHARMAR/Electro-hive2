export type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  processor: string | null;
  ram: string | null;
  storage: string | null;
  condition: string | null;
  description: string | null;
  images: string[];
  status: string;
  featured: boolean;
  createdAt: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getProducts: () => apiFetch<Product[]>("/api/products"),
  getFeatured: () => apiFetch<Product[]>("/api/products/featured"),
  getRecent: () => apiFetch<Product[]>("/api/products/recent"),
  getProduct: (id: string) => apiFetch<Product>(`/api/products/${id}`),
  getRelated: (id: string) => apiFetch<Product[]>(`/api/products/${id}/related`),

  admin: {
    getProducts: () => apiFetch<Product[]>("/api/admin/products"),
    getStats: () => apiFetch<{ total: number; available: number; sold: number }>("/api/admin/stats"),
    createProduct: (data: unknown) =>
      apiFetch<Product>("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    updateProduct: (id: string, data: unknown) =>
      apiFetch<Product>(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    deleteProduct: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/admin/products/${id}`, { method: "DELETE" }),
    uploadImage: async (file: File): Promise<string> => {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, name: file.name }),
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url as string;
    },
  },
};
