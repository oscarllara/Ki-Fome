"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, TrendingUp, Users, Store, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <AdminLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard Mestre</h1>
          <p className="text-slate-500 font-medium">Bem-vindo à central de comando do KIFOME.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="bg-white px-4 py-2 rounded-xl border-slate-200 font-bold text-slate-600 uppercase text-[10px]">Todas as Zonas</Badge>
          <Badge variant="outline" className="bg-white px-4 py-2 rounded-xl border-slate-200 font-bold text-slate-600 uppercase text-[10px]">Este mês</Badge>
        </div>
      </header>

      {/* Big Stats - Agora Clicáveis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link to="/admin/orders/list" className="block transition-transform hover:scale-[1.02] active:scale-95">
          <StatCard label="Pedidos" value="12" icon={<ShoppingCart className="text-blue-600"/>} bg="bg-blue-50" />
        </Link>
        <Link to="/admin/users/all" className="block transition-transform hover:scale-[1.02] active:scale-95">
          <StatCard label="Usuários" value="84" icon={<Users className="text-purple-600"/>} bg="bg-purple-50" />
        </Link>
        <Link to="/admin/stores" className="block transition-transform hover:scale-[1.02] active:scale-95">
          <StatCard label="Lojas" value="08" icon={<Store className="text-orange-600"/>} bg="bg-orange-50" />
        </Link>
        <Link to="/admin/reports/store" className="block transition-transform hover:scale-[1.02] active:scale-95">
          <StatCard label="Ganhos" value="R$ 1.240" icon={<DollarSign className="text-green-600"/>} bg="bg-green-50" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pedidos Recentes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Pedidos Recentes</h3>
              <Link to="/admin/orders/list">
                <Button variant="ghost" size="sm" className="text-orange-600 font-black uppercase text-[10px] tracking-widest hover:bg-orange-50">Ver todos</Button>
              </Link>
            </div>
            <div className="space-y-4">
              <Link to="/admin/orders/list" className="block">
                <OrderRow 
                  name="Ki + Lanches" 
                  id="#WXKJPXR70" 
                  status="Cancelado" 
                  price="R$ 17.90" 
                  time="há 4 min" 
                  statusColor="bg-red-100 text-red-600"
                  img="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100"
                />
              </Link>
              <Link to="/admin/orders/list" className="block">
                <OrderRow 
                  name="Pizzaria Bella" 
                  id="#YY3DMWRZ1" 
                  status="Falha no Pgto" 
                  price="R$ 45.00" 
                  time="há 25 seg" 
                  statusColor="bg-orange-100 text-orange-600"
                  img="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100"
                />
              </Link>
              <Link to="/admin/orders/list" className="block">
                <OrderRow 
                  name="Sushiman" 
                  id="#WARJAE3Y5" 
                  status="Entregue" 
                  price="R$ 89.90" 
                  time="há 1 hora" 
                  statusColor="bg-green-100 text-green-700"
                  img="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100"
                />
              </Link>
            </div>
          </div>

          {/* Novas Inscrições */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Novas Inscrições</h3>
              <Link to="/admin/users/all">
                <Button variant="ghost" size="sm" className="text-orange-600 font-black uppercase text-[10px] tracking-widest hover:bg-orange-50">Gerenciar</Button>
              </Link>
            </div>
            <div className="space-y-5">
              <Link to="/admin/users/edit/233" className="block">
                <UserRow name="Felipe Denis" phone="+55 88 99926-****" role="Cliente" date="6 dias atrás" />
              </Link>
              <Link to="/admin/users/edit/232" className="block">
                <UserRow name="Italo Amorim" phone="+55 88 99694-****" role="Entregador" date="1 semana atrás" />
              </Link>
              <Link to="/admin/users/edit/231" className="block">
                <UserRow name="Catiele Gamboa" phone="+55 88 99955-****" role="Entregador" date="1 semana atrás" />
              </Link>
            </div>
          </div>
        </div>

        {/* Meta e Performance */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 uppercase tracking-tight mb-6">Meta de Hoje</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="text-4xl font-black text-slate-900">R$ 1.240</div>
                <div className="text-green-600 font-bold text-sm">124% da meta</div>
              </div>
              <Progress value={80} className="h-3 bg-slate-100" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receita Alvo</p>
                  <p className="text-lg font-black text-slate-700">R$ 1.000</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receita Real</p>
                  <p className="text-lg font-black text-slate-900">R$ 1.240</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vendas Hoje Banner */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-orange-200" />
              <span className="text-xs font-black uppercase tracking-widest">Vendas Hoje</span>
            </div>
            <h4 className="text-3xl font-black mb-2">35 Vendas</h4>
            <p className="text-orange-100 text-sm font-medium">Pico de pedidos às 19:30</p>
            <Link to="/admin/reports/store">
              <Button className="w-full mt-6 bg-white/20 hover:bg-white/30 border-none rounded-2xl font-black uppercase tracking-widest text-xs h-12 transition-all active:scale-95">
                Ver Relatório Completo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Componentes de apoio
const StatCard = ({ label, value, icon, bg }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 h-full">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const OrderRow = ({ name, id, status, price, time, statusColor, img }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-3xl transition-colors group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase text-sm">{name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{id} • {time}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-slate-900 mb-1">{price}</p>
      <Badge className={`${statusColor} border-none text-[9px] font-black uppercase tracking-tighter px-2 rounded-lg`}>
        {status}
      </Badge>
    </div>
  </div>
);

const UserRow = ({ name, phone, role, date }: any) => (
  <div className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-2xl transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors uppercase">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-black text-slate-800 uppercase">{name}</p>
        <p className="text-[10px] font-medium text-slate-400">{phone}</p>
      </div>
    </div>
    <div className="text-right">
      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter mb-1 block w-fit ml-auto">
        {role}
      </Badge>
      <p className="text-[10px] text-slate-300 font-bold">{date}</p>
    </div>
  </div>
);

export default Index;