"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Settings, 
  Bell, 
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pedidos");

  const orders = [
    { id: "#1234", customer: "João Silva", status: "Pendente", total: "R$ 45,90", items: 2, time: "5 min" },
    { id: "#1233", customer: "Maria Souza", status: "Preparando", total: "R$ 89,00", items: 4, time: "12 min" },
    { id: "#1232", customer: "Carlos Lima", status: "Entregando", total: "R$ 32,50", items: 1, time: "25 min" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar do Gestor */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <span className="font-black text-slate-900 tracking-tight">KIFOME GESTOR</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("pedidos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "pedidos" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <ShoppingBag size={20} /> Pedidos Ativos
          </button>
          <button 
            onClick={() => setActiveTab("cardapio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "cardapio" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <UtensilsCrossed size={20} /> Cardápio
          </button>
          <button 
            onClick={() => setActiveTab("config")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "config" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Settings size={20} /> Configurações
          </button>
        </nav>

        <div className="p-4 border-t">
          <div className="bg-green-50 p-4 rounded-2xl flex items-center justify-between">
            <div className="text-xs font-bold text-green-700">LOJA ABERTA</div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar pedidos, clientes..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">Restaurante Central</p>
                <p className="text-[10px] text-slate-500">Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Pedidos</h1>
              <p className="text-slate-500 text-sm">Acompanhe e gerencie as entregas do dia.</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-4 py-2 rounded-lg font-bold">Hoje</Badge>
              <Badge variant="outline" className="px-4 py-2 rounded-lg font-bold">Ontem</Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Novos</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-slate-900">12</h3>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Preparando</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-slate-900">08</h3>
                  <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                    <UtensilsCrossed size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Em Entrega</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-slate-900">05</h3>
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6 bg-orange-600 text-white">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Total Hoje</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black">R$ 1.240</h3>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Pedidos */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Pedidos Recentes</h3>
              <Button variant="ghost" size="sm" className="text-orange-600 font-bold hover:text-orange-700 hover:bg-orange-50">
                Ver histórico completo
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pedido</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Items</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900">{order.id}</span>
                        <p className="text-[10px] text-slate-400 font-bold">há {order.time}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{order.customer}</td>
                      <td className="px-6 py-4">
                        <Badge className={`border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                          ${order.status === 'Pendente' ? 'bg-blue-100 text-blue-700' : ''}
                          ${order.status === 'Preparando' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${order.status === 'Entregando' ? 'bg-purple-100 text-purple-700' : ''}
                        `}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-bold">{order.items} un.</td>
                      <td className="px-6 py-4 text-slate-900 font-black">{order.total}</td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreVertical size={18} className="text-slate-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;