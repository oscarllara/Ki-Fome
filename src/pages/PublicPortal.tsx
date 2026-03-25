"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, ShieldCheck, MapPin, ArrowRight, Smartphone, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const PublicPortal = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-orange-100">
      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
            K
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">KIFOME<span className="text-orange-600">.ONLINE</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 font-bold text-slate-600 text-sm uppercase tracking-wide">
          <a href="#como-funciona" className="hover:text-orange-600 transition-colors">Como Funciona</a>
          <a href="#parceiros" className="hover:text-orange-600 transition-colors">Seja Parceiro</a>
          <a href="#contato" className="hover:text-orange-600 transition-colors">Suporte</a>
        </div>

        <Link to="/delivery">
          <Button className="bg-orange-600 hover:bg-orange-700 rounded-2xl px-6 font-bold shadow-lg shadow-orange-200">
            FAZER PEDIDO
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 md:py-28 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-xs font-black mb-8 border border-orange-100 uppercase tracking-widest">
            <Star size={14} className="fill-orange-600" /> O Melhor Delivery da Região
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
            MATOU A <br />
            <span className="text-orange-600">FOME?</span> <br />
            PEDIU KIFOME.
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
            Tudo o que você precisa para saciar sua vontade, entregue na porta da sua casa com rapidez e segurança.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/delivery">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-orange-100 group">
                COMEÇAR AGORA <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold border-2 border-slate-200 hover:bg-slate-50">
              BAIXAR O APP
            </Button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg">
          <div className="absolute -inset-4 bg-orange-500/10 rounded-[4rem] rotate-6 blur-2xl"></div>
          <div className="relative bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-square">
             <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800" 
              alt="Delicious Food" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Badge flutuante */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 animate-bounce">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
              <ShoppingBag size={24} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Tempo Médio</div>
              <div className="text-xl font-black text-slate-900">25-35 min</div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-orange-600 shadow-sm mx-auto mb-6 border border-orange-50">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Onde você estiver</h3>
            <p className="text-slate-500 font-medium">Cobertura completa em toda a cidade com rastreio em tempo real.</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-orange-600 shadow-sm mx-auto mb-6 border border-orange-50">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Segurança Total</h3>
            <p className="text-slate-500 font-medium">Pagamento seguro via app ou na entrega com os melhores protocolos.</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-orange-600 shadow-sm mx-auto mb-6 border border-orange-50">
              <Smartphone size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Fácil de Usar</h3>
            <p className="text-slate-500 font-medium">Uma interface intuitiva para você não perder tempo com burocracia.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 border-t">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale">
          <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xs">K</div>
          <span className="font-black text-slate-900">KIFOME.ONLINE</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest mb-6">© 2024 Kifome Online - Todos os direitos reservados</p>
        
        {/* Acesso Admin Discreto */}
        <Link to="/login" className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-orange-600 transition-colors uppercase tracking-widest">
          <Lock size={10} /> Acesso Restrito
        </Link>
      </footer>
    </div>
  );
};

export default PublicPortal;