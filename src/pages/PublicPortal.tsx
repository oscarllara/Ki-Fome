"use client";

import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Star, ShieldCheck, MapPin, ArrowRight, 
  Smartphone, Lock, UserCog, Store, Users, Utensils, 
  Truck, QrCode, LayoutDashboard 
} from "lucide-react";
import { Link } from "react-router-dom";

const PublicPortal = () => {
  const apps = [
    { title: "Gestor Master", desc: "Painel do Dono do Sistema", icon: <LayoutDashboard />, path: "/gestor", color: "bg-slate-900" },
    { title: "Painel Lojista", desc: "Gestão do Restaurante", icon: <Store />, path: "/admin", color: "bg-blue-600" },
    { title: "App Delivery", desc: "Interface do Cliente", icon: <ShoppingBag />, path: "/delivery", color: "bg-orange-600" },
    { title: "App Parceiro", desc: "Ganhos e Afiliados", icon: <Users />, path: "/partner", color: "bg-purple-600" },
    { title: "App Garçom", desc: "Lançamento em Salão", icon: <Utensils />, path: "/waiter", color: "bg-emerald-600" },
    { title: "App Entregador", desc: "Logística e Coletas", icon: <Truck />, path: "/driver", color: "bg-indigo-600" },
    { title: "Pedido de Mesa", desc: "Autoatendimento QR", icon: <QrCode />, path: "/table/05", color: "bg-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100">
      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
            K
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">KIFOME<span className="text-orange-600">.online</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 font-bold text-slate-600 text-sm uppercase tracking-wide">
          <a href="#atalhos" className="hover:text-orange-600 transition-colors">Acesso Rápido</a>
          <a href="#como-funciona" className="hover:text-orange-600 transition-colors">Como Funciona</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-slate-500 font-bold hover:text-orange-600 hover:bg-orange-50 rounded-xl gap-2">
              <Lock size={18} /> Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-xs font-black mb-8 border border-orange-100 uppercase tracking-widest">
            <Star size={14} className="fill-orange-600" /> O Ecossistema Completo de Delivery
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter uppercase">
            TUDO EM UM <br />
            <span className="text-orange-600">SÓ LUGAR.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
            Do gestor ao entregador, do lojista ao cliente na mesa. A solução definitiva para o seu negócio de alimentação.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#atalhos">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-orange-100 group uppercase">
                EXPLORAR INTERFACES <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg">
          <div className="absolute -inset-4 bg-orange-500/10 rounded-[4rem] rotate-6 blur-2xl"></div>
          <div className="relative bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-square">
             <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
              alt="Delicious Food" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Atalhos de Acesso Rápido */}
      <section id="atalhos" className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Acesso Rápido às Interfaces</h2>
            <p className="text-slate-500 font-medium">Navegue entre os diferentes aplicativos do ecossistema KIFOME.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apps.map((app, i) => (
              <Link key={i} to={app.path} className="group">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
                  <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {app.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{app.title}</h3>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{app.desc}</p>
                  <div className="mt-6 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center text-slate-400 border-t bg-white">
        <div className="flex items-center justify-center gap-2 mb-6 grayscale opacity-60">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm">K</div>
          <span className="font-black text-slate-900 tracking-tighter">KIFOME.ONLINE</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">© 2024 Kifome Online - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default PublicPortal;