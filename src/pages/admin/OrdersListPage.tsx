"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, RefreshCw, Download, Eye, Navigation, 
  ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import CreateOrderModal from "@/components/admin/CreateOrderModal";

const MOCK_ORDERS = [
  { id: "#WXKJPXR70", status: "Cancelado", customer: "Oscar Leão Lara Cliente", store: "Ki + Lanches", payment: "MERCADOPAGO", total: "17.90", date: "2025-04-23", time: "09:43 AM", duration: "4 min" },
  { id: "#YY3DMWRZ1", status: "Falha no Pagamento", customer: "Oscar Leão Lara Cliente", store: "Ki + Lanches", payment: "MERCADOPAGO", total: "13.90", date: "2025-04-23", time: "09:31 AM", duration: "Pag" },
  { id: "#WARJAE3Y5", status: "Cancelado", customer: "Helio Ferreira", store: "TOP PORÇÕES", payment: "MERCADOPAGO", total: "63.40", date: "2025-04-18", time: "08:22 AM", duration: "1 hour 32" },
  { id: "#OARJAE3Y6", status: "Entregue", customer: "Maria Souza", store: "Pizzaria Bella", payment: "DINHEIRO", total: "45.00", date: "2025-04-18", time: "08:10 AM", duration: "25 min" },
];

const OrdersListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gerenciamento de pedidos</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black h-12 px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100"
          >
            <Navigation size={18} className="mr-2" /> Lançar Pedido
          </Button>
          <Button variant="outline" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl font-bold h-12 px-6 gap-2">
            <RefreshCw size={18} /> Redefinir todos os filtros
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Pesquise com qualquer coisa..." className="pl-12 h-14 bg-white rounded-2xl border-slate-200 font-bold" />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-14 rounded-2xl font-bold gap-2 border-slate-200 text-slate-500 px-8">
              Exportar os pedidos para o arquivo CSV
            </Button>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 h-14">
              <span className="text-xs font-bold text-slate-400">10</span>
              <ChevronRight size={16} className="text-slate-300 rotate-90" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº do Pedido</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Loja</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Forma de Pagamento</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido feito em</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">{order.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                      <Badge className={`border-none px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter mb-1
                        ${order.status === 'Cancelado' ? 'bg-orange-500 text-white' : ''}
                        ${order.status === 'Falha no Pagamento' ? 'bg-rose-500 text-white' : ''}
                        ${order.status === 'Entregue' ? 'bg-emerald-500 text-white' : ''}
                      `}>
                        {order.status}
                      </Badge>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Pedido por: {order.customer}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-600">{order.store}</td>
                  <td className="px-8 py-6 text-xs font-black text-slate-900">{order.payment}</td>
                  <td className="px-8 py-6 text-xs font-black text-slate-900">{order.total}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{order.date} - {order.time}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">{order.duration}</td>
                  <td className="px-8 py-6 text-right">
                    <Button className="bg-black hover:bg-slate-800 text-white rounded-lg h-10 px-6 font-black text-[10px] uppercase">Visualizar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateOrderModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </AdminLayout>
  );
};

export default OrdersListPage;