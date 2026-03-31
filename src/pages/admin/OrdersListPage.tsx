"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, RefreshCw, Download, Eye, Navigation, 
  ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import CreateOrderModal from "@/components/admin/CreateOrderModal";

const OrdersListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
    setOrders(savedOrders);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Lista de Pedidos Realizados</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black h-12 px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100"
          >
            <Navigation size={18} className="mr-2" /> Lançar Pedido
          </Button>
          <Button onClick={loadOrders} variant="outline" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl font-bold h-12 px-6 gap-2">
            <RefreshCw size={18} /> Atualizar Lista
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar por ID ou Cliente..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-white rounded-2xl border-slate-200 font-bold" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagamento</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">{order.id}</td>
                  <td className="px-8 py-6">
                    <Badge className={`border-none px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter
                      ${order.status === 'CANCELLED' ? 'bg-red-500 text-white' : ''}
                      ${order.status === 'DELIVERED' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}
                    `}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-600">{order.customer}</td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200">
                      {order.paymentMethod} • {order.paymentStatus === 'PAID' ? 'PAGO' : 'PENDENTE'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-slate-900">{order.total}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{order.time}</td>
                  <td className="px-8 py-6 text-right">
                    <Button className="bg-black hover:bg-slate-800 text-white rounded-lg h-10 px-6 font-black text-[10px] uppercase">Visualizar</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Nenhum pedido encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateOrderModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </AdminLayout>
  );
};

export default OrdersListPage;