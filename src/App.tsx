import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Faq from "@/pages/Faq";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminNew from "@/pages/admin/AdminNew";
import AdminEdit from "@/pages/admin/AdminEdit";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/calvin-admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="new" element={<AdminNew />} />
          <Route path="edit/:id" element={<AdminEdit />} />
        </Route>
        <Route path="/reset-password" element={<Navigate to="/calvin-admin" replace />} />
        <Route path="/admin/*" element={<Navigate to="/calvin-admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
