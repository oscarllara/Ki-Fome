"use client";

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LayoutDashboard, ShoppingCart, Globe, TrendingUp, Users, 
  ShieldCheck, Store, DollarSign, Clock, UserPlus, 
  ChevronRight, Wallet, Settings, Megaphone, FileText
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (!auth) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col md:flex-row">
      {/* Sidebar - Menu Principal */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col p-6 border-r border-white/5">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-orange-500/20">K</div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">KIFOME</span>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Master Admin</span>
          </div>
        </div>
        
        <nav className="space-y-1 flex-1">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2">Navegação</p>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Store size={20}/>} label="Lojas" />
          <NavItem icon={<ShoppingCart size={20}/>} label="Itens & Menu" />
          <NavItem icon={<Users size={20}/>} label="Usuários" />
          <NavItem icon={<Clock size={20}/>} label="Pedidos" />
          <NavItem icon={<FileText size={20}/>} label="Relatórios" />
          <NavItem icon={<Megaphone size={20}/>} label="Promoções" />
          <NavItem icon={<Wallet size={20}/>} label="Transações" />
          <NavItem icon={<Settings size={20}/>} label="Configurações" />
        </nav>

        <div className="mt-8 pt-6 border-t border-white/10">
          <Button onClick={handleLogout} variant="ghost" className="w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl justify-start gap-3">
             Sair do Sistema
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel Administrativo</h1>
            <p className="text-slate-500 font-medium">Visão geral de todas as zonas e operações.</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-white px-4 py-2 rounded-xl border-slate-200 font-bold text-slate-600">Todas as Zonas</Badge>
            <Badge variant="outline" className="bg-white px-4 py-2 rounded-xl border-slate-200 font-bold text-slate-600">Este mês</Badge>
          </div>
        </header>

        {/* Big Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Pedidos" value="12" icon={<ShoppingCart className="text-blue-600"/>} bg="bg-blue-50" />
          <StatCard label="Usuários" value="84" icon={<Users className="text-purple-600"/>} bg="bg-purple-50" />
          <StatCard label="Lojas" value="08" icon={<Store className="text-orange-600"/>} bg="bg-orange-50" />
          <StatCard label="Ganhos" value="R$ 1.240" icon={<DollarSign className="text-green-600"/>} bg="bg-green-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pedidos Recentes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Pedidos Recentes</h3>
                <Button variant="ghost" size="sm" className="text-orange-600 font-bold">Ver todos</Button>
              </div>
              <div className="space-y-4">
                <OrderRow 
                  name="Ki + Lanches" 
                  id="#WXKJPXR70" 
                  status="Cancelado" 
                  price="R$ 17.90" 
                  time="há 4 min" 
                  statusColor="bg-red-100 text-red-600"
                  img="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=100"
                />
                <OrderRow 
                  name="Pizzaria Bella" 
                  id="#YY3DMWRZ1" 
                  status="Falha no Pgto" 
                  price="R$ 45.00" 
                  time="há 25 seg" 
                  statusColor="bg-orange-100 text-orange-600"
                  img="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=100"
                />
                <OrderRow 
                  name="Sushiman" 
                  id="#WARJAE3Y5" 
                  status="Entregue" 
                  price="R$ 89.90" 
                  time="há 1 hora" 
                  statusColor="bg-green-100 text-green-600"
                  img="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=100"
                />
              </div>
            </div>

            {/* Novas Inscrições */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Novas Inscrições</h3>
                <Button variant="ghost" size="sm" className="text-orange-600 font-bold">Gerenciar</Button>
              </div>
              <div className="space-y-5">
                <UserRow name="Felipe Denis" phone="+55 88 99926-****" role="Cliente" date="6 dias atrás" />
                <UserRow name="Italo Amorim" phone="+55 88 99694-****" role="Entregador" date="1 semana atrás" />
                <UserRow name="Catiele Gamboa" phone="+55 88 99955-****" role="Entregador" date="1 semana atrás" />
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
              <Button className="w-full mt-6 bg-white/20 hover:bg-white/30 border-none rounded-2xl font-black uppercase tracking-widest text-xs h-12">
                Ver Relatório Completo
              </Button>
            </div>
          </div>
        </div>

        <footer className="mt-16 border-t pt-8 text-center text-slate-400">
          <MadeWithDyad />
        </footer>
      </main>
    </div>
  );
};

// Sub-componentes para manter o código limpo
const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${active ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
    {icon} <span className="text-sm">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, bg }: { label: string, value: string, icon: React.ReactNode, bg: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
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
        <p className="font-black text-slate-900 group-hover:text-orange-600 transition-colors">{name}</p>
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
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-black text-slate-800">{name}</p>
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