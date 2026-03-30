import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import PublicPortal from "./pages/PublicPortal";
import DeliveryApp from "./pages/DeliveryApp";
import RestaurantDetails from "./pages/RestaurantDetails";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrderTrackingPage from "./pages/OrderTrackingPage";

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
import TableManagerPage from "./pages/admin/TableManagerPage";
import SlidesPage from "./pages/admin/SlidesPage";
import CouponsPage from "./pages/admin/CouponsPage";
import PushNotificationsPage from "./pages/admin/PushNotificationsPage";
import TransactionsPage from "./pages/admin/TransactionsPage";
import WalletPage from "./pages/admin/WalletPage";

// Apps Específicos
import WaiterApp from "./pages/WaiterApp";
import TableOrderApp from "./pages/TableOrderApp";
import DriverApp from "./pages/DriverApp";
import PartnerApp from "./pages/PartnerApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<PublicPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gestor" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/delivery" element={<DeliveryApp />} />
          <Route path="/delivery/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/delivery/checkout" element={<CheckoutPage />} />
          <Route path="/delivery/track/:id" element={<OrderTrackingPage />} />
          <Route path="/partner" element={<PartnerApp />} />
          <Route path="/waiter" element={<WaiterApp />} />
          <Route path="/driver" element={<DriverApp />} />
          <Route path="/table/:tableId" element={<TableOrderApp />} />
          <Route path="/admin/stores" element={<StoresPage />} />
          <Route path="/admin/menu/menu-categories" element={<MenuCategoriesPage />} />
          <Route path="/admin/menu/complements" element={<ComplementsPage />} />
          <Route path="/admin/menu/items" element={<ItemsPage />} />
          <Route path="/admin/users/all" element={<UsersPage />} />
          <Route path="/admin/users/customers" element={<UsersPage />} />
          <Route path="/admin/users/owners" element={<UsersPage />} />
          <Route path="/admin/users/drivers" element={<UsersPage />} />
          <Route path="/admin/users/staff" element={<UsersPage />} />
          <Route path="/admin/users/partners" element={<UsersPage />} />
          <Route path="/admin/users/edit/:id" element={<UserDetailsPage />} />
          <Route path="/admin/orders/list" element={<OrdersListPage />} />
          <Route path="/admin/orders/live" element={<LiveOrdersPage />} />
          <Route path="/admin/orders/manager" element={<OrderManagerPage />} />
          <Route path="/admin/orders/tables" element={<TableManagerPage />} />
          <Route path="/admin/reports/client" element={<GenericAdminPage title="Relatório de Clientes" />} />
          <Route path="/admin/reports/store" element={<GenericAdminPage title="Relatório de Lojas" />} />
          <Route path="/admin/promos/slides" element={<SlidesPage />} />
          <Route path="/admin/promos/cat-slides" element={<SlidesPage />} />
          <Route path="/admin/promos/coupons" element={<CouponsPage />} />
          <Route path="/admin/promos/push" element={<PushNotificationsPage />} />
          <Route path="/admin/transactions/payments" element={<TransactionsPage />} />
          <Route path="/admin/transactions/wallet" element={<WalletPage />} />
          <Route path="/admin/settings/zones" element={<GenericAdminPage title="Zonas (Franquias)" />} />
          <Route path="/admin/settings/all" element={<GenericAdminPage title="Todas as Configurações" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;