"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ShoppingCart, Star, Clock, Utensils, ShoppingBag, Store } from "lucide-react";

const CATEGORIES = [
  { name: "Promoções", icon: "🏷️" },
  { name: "Burgers", icon: "🍔" },
  { name: "Pizza", icon: "🍕" },
  { name: "Sushi", icon: "🍣" },
  { name: "Bebidas", icon: "🥤" },
  { name: "Doces", icon: "🍰" },
];

const RESTAURANTS = [
  {
    name: "Burger King do Bairro",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    time: "25-35 min",
    category: "Burgers",
    price: "$$"
  },
  {
    name: "La Bella Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    time: "30-45 min",
    category: "Pizza",
    price: "$$$"
  },
  {
    name: "Express Sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    time: "40-55 min",
    category: "Sushi",
    price: "$$$"
  }
];

const DeliveryApp = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header do App */}
      <header className="bg-white px-4 pt-6 pb-4 sticky top-0 z-40 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-800">
            <MapPin className="text-orange-500" size={20} />
            <span className="font-bold text-sm truncate max-w-[150px]">Rua das Flores, 123</span>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </Button>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <Input 
            placeholder="O que você quer comer agora?" 
            className="pl-10 h-12 bg-slate-100 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-orange-500"
          />
        </div>
      </header>

      {/* Categorias */}
      <section className="py-6 overflow-x-auto whitespace-nowrap px-4 scrollbar-hide">
        <div className="flex gap-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.name} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl group-active:scale-95 transition-transform border border-slate-100 group-hover:border-orange-200">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-600">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurantes */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Populares na sua área</h2>
          <Button variant="ghost" size="sm" className="text-orange-500 font-bold">
            Ver todos
          </Button>
        </div>

        <div className="grid gap-6">
          {RESTAURANTS.map((rest) => (
            <div key={rest.name} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="text-yellow-500 fill-yellow-500" size={14} />
                  <span className="text-sm font-bold">{rest.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{rest.name}</h3>
                  <span className="text-slate-400 text-sm">{rest.price}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{rest.time}</span>
                  </div>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{rest.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Mobile Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t px-8 py-3 flex justify-between items-center md:hidden">
        <button className="text-orange-500 flex flex-col items-center gap-1">
          <Utensils size={24} />
          <span className="text-[10px] font-bold">Início</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <Search size={24} />
          <span className="text-[10px] font-bold">Busca</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <ShoppingBag size={24} />
          <span className="text-[10px] font-bold">Pedidos</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <Store size={24} />
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default DeliveryApp;