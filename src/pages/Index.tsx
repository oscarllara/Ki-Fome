"use client";

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingCart, Globe, ArrowRight, TrendingUp, Users, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Sidebar de Controle Mestre */}
      <aside className="hidden lg:flex w-72 bg-slate-900 text-white flex-col p-8 border-r border-white/5">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-orange-500/20">K</div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">KIFOME</span>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Master Admin</span>
          </div>
        </div>
        
        <nav className="space-y-6 flex-1">
          <div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2">Visão Geral</div>
            <div className="space-y-1">
              <a href="#" className="flex items-center gap-3 bg-orange-500 text-white p-3 rounded-2xl font-bold shadow-lg shadow-orange-500/20">
                <LayoutDashboard size={20} /> Dashboard Mestre
              </a>
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2">Atalhos do Sistema</div>
            <div className="space-y-1">
              <Link to="/admin" className="flex items-center gap-3 p-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium">
                <ShoppingCart size={20} /> Gestor de Pedidos
              </Link>
              <Link to="/delivery" className="flex items-center gap-3 p-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium">
                <Users size={20} /> App do Cliente
              </Link>
              <Link to="/public" className="flex items-center gap-3 p-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium">
                <Globe size={20} /> Site Público
              </Link>
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <Button onClick={handleLogout} variant="ghost" className="w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl justify-start gap-3">
             Sair do Sistema
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-orange-500" />
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Painel do Dono</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Central de Comando</h1>
            <p className="text-slate-500 font-medium">Bem-vindo de volta, administrador. Seu sistema está rodando normalmente.</p>
          </div>
          
          <div className="flex gap-3">
             <Link to="/admin">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 h-12 font-bold shadow-xl">
                  Abrir Pedidos
                </Button>
              </Link>
              <Link to="/public">
                <Button variant="outline" className="rounded-2xl border-2 px-6 h-12 font-bold">
                  Ver Landing Page
                </Button>
              </Link>
          </div>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">R$ 12.450,00</div>
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Vendas Hoje</div>
            <div className="mt-4 text-green-600 text-xs font-black bg-green-50 w-fit px-2 py-1 rounded-lg">+12% vs ontem</div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingCart size={28} />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">142</div>
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Pedidos Ativos</div>
            <div className="mt-4 text-blue-600 text-xs font-black bg-blue-50 w-fit px-2 py-1 rounded-lg">3 novos agora</div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe size={28} />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">850</div>
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Visitas no Site</div>
            <div className="mt-4 text-purple-600 text-xs font-black bg-purple-50 w-fit px-2 py-1 rounded-lg">Pico às 19h</div>
          </div>
        </div>

        {/* Acesso Rápido */}
        <div className="bg-orange-600 p-10 md:p-16 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-orange-200">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black mb-6 leading-tight tracking-tight uppercase">Gestão Completa em <br />um só lugar.</h2>
            <p className="text-orange-100 text-lg mb-10 font-medium leading-relaxed">
              Você está no controle total. Da edição do cardápio ao acompanhamento das vendas e experiência do usuário no aplicativo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/admin">
                <Button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-7 rounded-2xl font-black text-base shadow-xl uppercase">
                  Gestor de Pedidos <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/delivery">
                <Button variant="ghost" className="text-white hover:bg-white/10 px-8 py-7 rounded-2xl font-black text-base uppercase border-2 border-white/20">
                  Ver App do Cliente
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorativo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full -mr-10 -mb-10 blur-2xl"></div>
        </div>

        <footer className="mt-16 text-center text-slate-400">
          <MadeWithDyad />
        </footer>
      </main>
    </div>
  );
};

export default Index;