"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Clock, CheckCircle2, XCircle, 
  AlertCircle, Truck, Utensils, Navigation, Package
} from "lucide-react";
import CreateOrderModal from "@/components/admin/CreateOrderModal";

const LiveOrdersPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const stats = [
    { label: "Pedidos concluídos", value: "0", color: "bg-emerald-50 text-emerald-600" },
    { label: "Pedidos cancelados", value: "0", color: "bg-rose-50 text-rose-600" },
    { label: "Em andamentos", value: "0", color: "bg-blue-50 text-blue-600" },
    { label: "Total de vendas hoje", value: "0", color: "bg-cyan-50 text-cyan-600" },
  ];

  const columns = [
    { title: "Novo Pedido", icon: <Package size={24} /> },
    { title: "Preparando pedidos", icon: <Utensils size={24} /> },
    { title: "Entregador Atribuido", icon: <User size={24} /> },
    { title: "Entregador Pegou Pedido", icon: <Truck size={24} /> },
    { title: "Concluído", icon: <CheckCircle2 size={24} /> },
    { title: "Aguardando pagamento", icon: <Clock size={24} /> },
    { title: "Pagamento Falhou", icon: <AlertCircle size={24} /> },
    { title: "Pedido Cancelado", icon: <XCircle size={24} /> },
    { title: "Pedido para Retirada", icon: <ShoppingBag size={24} /> },
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <div className="w-3 h-3 rounded-full bg-current opacity-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col, i) => (
          <div key={i} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
            <div className="p-6 border-b border-slate-50">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{col.title}</h4>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <Package size={32} className="opacity-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-center">Sem pedidos para mostrar</p>
            </div>
          </div>
        ))}
      </div>

      <CreateOrderModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </AdminLayout>
  );
};

// Helper para ícone de usuário que faltou no import
const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default LiveOrdersPage;