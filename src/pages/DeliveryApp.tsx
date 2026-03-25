"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ShoppingCart, Utensils, ShoppingBag, User, Bell } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";

const CATEGORIES = [
  { name: "Promo", icon: "🔥", color: "bg-orange-50" },
  { name: "Lanches", icon: "🍔", color: "bg-yellow-50" },
  { name: "Pizza", icon: "🍕", color: "bg-red-50" },
  { name: "Japonesa", icon: "🍣", color: "bg-blue-50" },
  { name: "Bebidas", icon: "🥤", color: "bg-cyan-50" },
  { name: "Açaí", icon: "🥣", color: "bg-purple-50" },
  { name: "Saudável", icon: "🥗", color: "bg-green-50" },
];

const RESTAURANTS = [
  {
    name: "Big Burger Artesanal",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    time: "20-30 min",
    category: "Burgers",
    priceRange: "$$",
    isPromo: true
  },
  {
    name: "Pizzaria della Mamma",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    time: "35-50 min",
    category: "Pizza",
    priceRange: "$$$",
    isPromo: false
  },
  {
    name: "Sushiman Premium",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    time: "40-60 min",
    category: "Japonesa",
    priceRange: "$$$",
    isPromo: true
  },
  {
    name: "Açaí do Porto",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400",
    rating: 4.6,
    time: "15-25 min",
    category: "Sobremesas",
    priceRange: "$",
    isPromo: false
  }
];

const DeliveryApp = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans">
      {/* Top Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-50 shadow-sm border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entregar em</span>
            <div className="flex items-center gap-1">
              <MapPin className="text-orange-600" size={16} />
              <span className="font-black text-sm text-slate-900">Rua Central, 500</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-600">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-2xl bg-orange-50 text-orange-600 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">
                3
              </span>
            </Button>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
          <Input 
            placeholder="Buscar pratos ou restaurantes..." 
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-orange-600 font-medium placeholder:text-slate-400"
          />
        </div>
      </header>

      {/* Categorias */}
      <section className="py-8 overflow-x-auto whitespace-nowrap px-6 scrollbar-hide no-scrollbar">
        <div className="flex gap-5">
          {CATEGORIES.map((cat) => (
            <button key={cat.name} className="flex flex-col items-center gap-3 group">
              <div className={`w-20 h-20 ${cat.color} rounded-[2rem] shadow-sm flex items-center justify-center text-3xl group-active:scale-90 transition-all border border-transparent group-hover:border-orange-200 group-hover:shadow-md`}>
                {cat.icon}
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Listagem de Restaurantes */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Populares no <span className="text-orange-600">Kifome</span></h2>
          <button className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline">
            Ver Tudo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESTAURANTS.map((rest) => (
            <RestaurantCard key={rest.name} {...rest} />
          ))}
        </div>
      </section>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 py-4 flex justify-between items-center z-50">
        <button className="text-orange-600 flex flex-col items-center gap-1 group">
          <Utensils size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Início</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1 group">
          <Search size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Busca</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1 group">
          <ShoppingBag size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1 group">
          <User size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default DeliveryApp;