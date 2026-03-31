"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, TrendingUp, Users, Store, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 84, // Mock
    totalStores: 8    // Mock
  });

  useEffect(() => {
    const loadData = () => {
      const savedOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
      setOrders(savedOrders.slice(0, 5)); // Pega os 5 mais recentes
      
      const revenue = savedOrders.reduce((acc: number, o: any) => {
        const val = parseFloat(o.total.replace("R$ ", "").replace(",", "."));
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      setStats(prev => ({
        ...prev,
        totalOrders: savedOrders.length,
        totalRevenue: revenue
      }));
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard Mestre</h1>
          <p className="text-slate-500 font-medium">Visão geral do sistema KIFOME.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link to="/admin/orders/list" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-all">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center"><ShoppingCart className="text-blue-600"/></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase">Pedidos</p><p className="text-2xl font-black text-slate-900">{stats.totalOrders}</p></div>
        </Link>
        <Link to="/admin/users/all" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-all">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center"><Users className="text-purple-600"/></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase">Usuários</p><p className="text-2xl font-black text-slate-900">{stats.activeUsers}</p></div>
        </Link>
        <Link to="/admin/stores" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-all">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center"><Store className="text-orange-600"/></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase">Lojas</p><p className="text-2xl font-black text-slate-900">{stats.totalStores}</p></div>
        </Link>
        <Link to="/admin/reports/store" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-all">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center"><DollarSign className="text-green-600"/></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase">Ganhos</p><p className="text-2xl font-black text-slate-900">R$ {stats.totalRevenue.toFixed(2)}</p></div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Pedidos Recentes</h3>
              <Link to="/admin/orders/list" className="text-orange-600 font-black uppercase text-[10px] tracking-widest">Ver todos</Link>
            </div>
            <div className="space-y-4">
              {orders.length > 0 ? orders.map(order => (
                <Link key={order.id} to="/admin/orders/manager" className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-3xl transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold">K</div>
                    <div>
                      <p className="font-black text-slate-900 uppercase text-sm">Pedido {order.id}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{order.customer} • {order.time}</p>
                    </div>
                  </div>
                  <Badge className={`border-none text-[9px] font-black uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {order.status}
                  </Badge>
                </Link>
              )) : (
                <div className="py-10 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Nenhum pedido recente</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 uppercase tracking-tight mb-6">Meta de Hoje</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="text-4xl font-black text-slate-900">R$ {stats.totalRevenue.toFixed(2)}</div>
              </div>
              <Progress value={Math.min(100, (stats.totalRevenue / 5000) * 100)} className="h-3 bg-slate-100" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Meta: R$ 5.000,00</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;