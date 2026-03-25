"use client";

import { Button } from "@/components/ui/button";
import { Utensils, ShoppingBag, Store, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PublicPortal = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Simplificada */}
      <nav className="border-b px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          <span className="text-2xl font-black text-orange-600 tracking-tight">KIFOME</span>
        </div>
        <div className="hidden md:flex gap-6 font-medium text-slate-600">
          <a href="#" className="hover:text-orange-500 transition-colors">Como funciona</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Restaurantes</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Para Entregadores</a>
        </div>
        <Link to="/delivery">
          <Button className="bg-orange-500 hover:bg-orange-600 rounded-full px-6">
            Pedir Agora
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6 inline-block uppercase tracking-wider">
            O Delivery que você ama
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
            Sua comida favorita, <br />
            <span className="text-orange-500">em um clique.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
            Descubra os melhores sabores da sua região com a agilidade e o carinho que a Kifome oferece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/delivery">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 h-16 px-8 rounded-2xl text-lg w-full">
                Ver Cardápios <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-16 px-8 rounded-2xl text-lg border-2 w-full">
              Seja um Parceiro
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="w-full aspect-square bg-orange-100 rounded-[3rem] overflow-hidden rotate-3 relative z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000" 
            alt="Food" 
            className="absolute inset-0 w-full h-full object-cover rounded-[3rem] -rotate-3 shadow-2xl z-10 hover:rotate-0 transition-transform duration-500"
          />
        </div>
      </header>

      {/* Seção de Números */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
            <div className="text-slate-400">Restaurantes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">15k</div>
            <div className="text-slate-400">Clientes Ativos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">10min</div>
            <div className="text-slate-400">Média de Entrega</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">4.9/5</div>
            <div className="text-slate-400">Avaliação Média</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicPortal;