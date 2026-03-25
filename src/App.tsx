import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PublicPortal from "./pages/PublicPortal";
import DeliveryApp from "./pages/DeliveryApp";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Páginas Administrativas
import StoresPage from "./pages/admin/StoresPage";
import MenuCategoriesPage from "./pages/admin/MenuCategoriesPage";
import ComplementCategoriesPage from "./pages/admin/ComplementCategoriesPage";
import ItemsPage from "./pages/admin/ItemsPage";
import GenericAdminPage from "./pages/admin/GenericAdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/public" element={<PublicPortal />} />
          <Route path="/delivery" element={<DeliveryApp />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Rotas Master Admin */}
          <Route path="/admin/stores" element={<StoresPage />} />
          
          {/* Menu & Itens */}
          <Route path="/admin/menu/menu-categories" element={<MenuCategoriesPage />} />
          <Route path="/admin/menu/complement-categories" element={<ComplementCategoriesPage />} />
          <Route path="/admin/menu/complements" element={<GenericAdminPage title="Complementos" />} />
          <Route path="/admin/menu/items" element={<ItemsPage />} />
          
          {/* Usuários */}
          <Route path="/admin/users/all" element={<GenericAdminPage title="Todos os Usuários" />} />
          <Route path="/admin/users/customers" element={<GenericAdminPage title="Clientes" />} />
          <Route path="/admin/users/owners" element={<GenericAdminPage title="Proprietários" />} />
          <Route path="/admin/users/drivers" element={<GenericAdminPage title="Entregadores" />} />
          <Route path="/admin/users/staff" element={<GenericAdminPage title="Funcionários" />} />
          
          {/* Pedidos */}
          <Route path="/admin/orders/list" element={<GenericAdminPage title="Lista de Pedidos" />} />
          <Route path="/admin/orders/live" element={<GenericAdminPage title="Pedidos ao Vivo" />} />
          
          {/* Relatórios */}
          <Route path="/admin/reports/client" element={<GenericAdminPage title="Relatório de Clientes" />} />
          <Route path="/admin/reports/store" element={<GenericAdminPage title="Relatório de Lojas" />} />
          
          {/* Configurações */}
          <Route path="/admin/settings/zones" element={<GenericAdminPage title="Zonas (Franquias)" />} />
          <Route path="/admin/settings/all" element={<GenericAdminPage title="Todas as Configurações" />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;