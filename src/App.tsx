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
import ComplementsPage from "./pages/admin/ComplementsPage";
import ItemsPage from "./pages/admin/ItemsPage";
import UsersPage from "./pages/admin/UsersPage";
import UserDetailsPage from "./pages/admin/UserDetailsPage";
import GenericAdminPage from "./pages/admin/GenericAdminPage";
import OrdersListPage from "./pages/admin/OrdersListPage";
import LiveOrdersPage from "./pages/admin/LiveOrdersPage";
import OrderManagerPage from "./pages/admin/OrderManagerPage";
import SlidesPage from "./pages/admin/SlidesPage";
import CouponsPage from "./pages/admin/CouponsPage";
import PushNotificationsPage from "./pages/admin/PushNotificationsPage";
import TransactionsPage from "./pages/admin/TransactionsPage";
import WalletPage from "./pages/admin/WalletPage";

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
          <Route path="/admin/menu/complements" element={<ComplementsPage />} />
          <Route path="/admin/menu/items" element={<ItemsPage />} />
          
          {/* Usuários */}
          <Route path="/admin/users/all" element={<UsersPage />} />
          <Route path="/admin/users/customers" element={<UsersPage />} />
          <Route path="/admin/users/owners" element={<UsersPage />} />
          <Route path="/admin/users/drivers" element={<UsersPage />} />
          <Route path="/admin/users/staff" element={<UsersPage />} />
          <Route path="/admin/users/partners" element={<UsersPage />} />
          <Route path="/admin/users/edit/:id" element={<UserDetailsPage />} />
          
          {/* Pedidos */}
          <Route path="/admin/orders/list" element={<OrdersListPage />} />
          <Route path="/admin/orders/live" element={<LiveOrdersPage />} />
          <Route path="/admin/orders/manager" element={<OrderManagerPage />} />
          
          {/* Relatórios */}
          <Route path="/admin/reports/client" element={<GenericAdminPage title="Relatório de Clientes" />} />
          <Route path="/admin/reports/store" element={<GenericAdminPage title="Relatório de Lojas" />} />
          
          {/* Promoções */}
          <Route path="/admin/promos/slides" element={<SlidesPage />} />
          <Route path="/admin/promos/cat-slides" element={<SlidesPage />} />
          <Route path="/admin/promos/coupons" element={<CouponsPage />} />
          <Route path="/admin/promos/push" element={<PushNotificationsPage />} />
          
          {/* Transações & Carteiras */}
          <Route path="/admin/transactions/payments" element={<TransactionsPage />} />
          <Route path="/admin/transactions/wallet" element={<WalletPage />} />
          
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