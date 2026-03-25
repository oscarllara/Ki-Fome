"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingCart, Globe, ArrowRight, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sidebar/Nav fake para o Portal Administrativo */}
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col p-6">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">K</div>
            <span className="text-xl font-black tracking-tighter">KIFOME ADMIN</span>
          </div>
          
          <nav className="space-y-4 flex-1">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Menu Principal</div>
            <a href="#" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl text-white font-medium">
              <LayoutDashboard size={20} /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
              <ShoppingCart size={20} /> Pedidos
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
              <Users size={20} /> Clientes
            </a>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <Link to="/public">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Ver Site Público <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Olá, Administrador!</h1>
              <p className="text-slate-500">Aqui está o que está acontecendo no Kifome hoje.</p>
            </div>
            <div className="flex gap-4">
               <Link to="/delivery">
                <Button className="bg-orange-500 hover:bg-orange-600 rounded-xl">
                  Abrir App de Delivery
                </Button>
              </Link>
              <Link to="/public">
                <Button variant="outline" className="rounded-xl border-slate-300">
                  Landing Page
                </Button>
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <div className="text-2xl font-bold text-slate-900">R$ 12.450,00</div>
              <div className="text-slate-500 text-sm">Vendas hoje (+12%)</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingCart size={24} />
              </div>
              <div className="text-2xl font-bold text-slate-900">142</div>
              <div className="text-slate-500 text-sm">Pedidos entregues</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <div className="text-2xl font-bold text-slate-900">850</div>
              <div className="text-slate-500 text-sm">Visitas na Landing Page</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Pronto para modernizar seu site?</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Esta é a visão do seu novo painel administrativo. Navegue pelos links abaixo para ver os outros ambientes que acabei de criar para você.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/public">
                <Button variant="secondary" className="px-6 py-6 rounded-2xl font-bold">
                  Ir para Público (/public)
                </Button>
              </Link>
              <Link to="/delivery">
                <Button className="bg-orange-500 hover:bg-orange-600 px-6 py-6 rounded-2xl font-bold">
                  Ir para Delivery (/delivery)
                </Button>
              </Link>
            </div>
          </div>

          <footer className="mt-12 text-center text-slate-400">
            <MadeWithDyad />
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;