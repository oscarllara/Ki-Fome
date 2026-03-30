"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, Clock, Info, Search, 
  Plus, ShoppingBag, ChevronRight, Heart,
  Share2, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

const MOCK_MENU = [
  {
    category: "Mais Pedidos",
    items: [
      { id: 1, name: "X-Turbo Burguer", desc: "Pão brioche, blend 180g, queijo cheddar, bacon crocante e molho especial da casa.", price: 28.90, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400" },
      { id: 2, name: "Combo Casal", desc: "2 Burgers + Batata G + Coca 1.5L. Perfeito para dividir.", price: 65.00, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400" },
    ]
  },
  {
    category: "Sanduíches",
    items: [
      { id: 3, name: "Classic Cheese", desc: "O clássico pão, carne e queijo que nunca falha.", price: 22.00, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
      { id: 4, name: "Bacon Lover", desc: "Muito bacon, muito queijo e muito sabor.", price: 32.00, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400" },
    ]
  }
];

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      {/* Header / Banner */}
      <div className="relative h-64 md:h-80">
        <img 
          src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <Button 
            onClick={() => navigate("/delivery")}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex gap-2">
            <Button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40">
              <Share2 size={20} />
            </Button>
            <Button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40">
              <Heart size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Info do Restaurante */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Big Burger Artesanal</h1>
              <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                Burgers • 2.4 km • <span className="text-orange-600 font-bold">Aberto</span>
              </p>
            </div>
            <div className="bg-orange-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-orange-100">
              <Star className="text-orange-600 fill-orange-600" size={18} />
              <span className="font-black text-orange-700">4.8</span>
            </div>
          </div>

          <div className="flex gap-6 py-4 border-t border-slate-50 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="text-slate-400" size={18} />
              <span className="text-xs font-bold text-slate-600">25-35 min</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-slate-400" size={18} />
              <span className="text-xs font-bold text-slate-600">Entrega R$ 5,00</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="text-slate-400" size={18} />
              <span className="text-xs font-bold text-slate-600">Ver mais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Busca Interna */}
      <div className="px-6 mt-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar no cardápio..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-medium"
          />
        </div>
      </div>

      {/* Categorias e Itens */}
      <div className="mt-10 space-y-12">
        {MOCK_MENU.map((cat) => (
          <section key={cat.category} className="px-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 ml-2">{cat.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-all cursor-pointer group active:scale-95"
                >
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 uppercase text-sm group-hover:text-orange-600 transition-colors">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                    <p className="text-lg font-black text-slate-900 mt-3">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 shadow-inner">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Carrinho Flutuante */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
        <Button className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] shadow-2xl flex justify-between px-8 items-center group active:scale-95 transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">
              2
            </div>
            <span className="font-black uppercase text-[11px] tracking-widest">Ver Carrinho</span>
          </div>
          <span className="font-black">R$ 57,80</span>
        </Button>
      </div>
    </div>
  );
};

export default RestaurantDetails;