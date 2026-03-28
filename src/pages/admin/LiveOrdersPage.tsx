"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Clock, CheckCircle2, XCircle, 
  AlertCircle, Truck, Utensils, Navigation, Package,
  ArrowRight, User
} from "lucide-react";
import CreateOrderModal from "@/components/admin/CreateOrderModal";

const LiveOrdersPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const stats = [
    { label: "Pedidos concluídos", value: "124", color: "bg-emerald-50 text-emerald-600", link: "/admin/orders/list" },
    { label: "Pedidos cancelados", value: "12", color: "bg-rose-50 text-rose-600", link: "/admin/orders/list" },
    { label: "Em andamentos", value: "08", color: "bg-blue-50 text-blue-600", link: "/admin/orders/manager" },
    { label: "Total de vendas hoje", value: "R$ 2.450", color: "bg-cyan-50 text-cyan-600", link: "/admin/reports/store" },
  ];

  const columns = [
    { 
      title: "Novo Pedido", 
      icon: <Package size={20} />, 
      orders: [
        { id: "#1025", customer: "João Silva", total: "R$ 45,00", time: "Agora" }
      ] 
    },
    { title: "Preparando", icon: <Utensils size={20} />, orders: [] },
    { title: "Em Rota", icon: <Truck size={20} />, orders: [] },
    { title: "Concluído", icon: <CheckCircle2 size={20} />, orders: [] },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pedidos Ao Vivo</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black h-12 px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100"
        >
          <Navigation size={18} className="mr-2" /> Lançar Pedido
        </Button>
      </div>

      {/* Stats Grid - Clicáveis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.link} className="block transition-transform hover:scale-[1.02] active:scale-95">
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <ArrowRight size={20} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Live Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col, i) => (
          <div key={i} className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                {col.icon} {col.title}
              </h4>
              <Badge className="bg-slate-100 text-slate-400 border-none">{col.orders.length}</Badge>
            </div>
            
            <div className="p-4 space-y-4 flex-1">
              {col.orders.length > 0 ? (
                col.orders.map(order => (
                  <Link key={order.id} to="/admin/orders/manager" className="block">
                    <Card className="border-none shadow-sm rounded-2xl hover:ring-2 hover:ring-orange-500/20 transition-all">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-black text-slate-900 text-xs">{order.id}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{order.time}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-600 uppercase mb-1">{order.customer}</p>
                        <p className="text-xs font-black text-orange-600">{order.total}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-300 opacity-40">
                  <Package size={32} className="mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-widest">Vazio</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateOrderModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </AdminLayout>
  );
};

export default LiveOrdersPage;