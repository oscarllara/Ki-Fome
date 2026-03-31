"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Utensils, Clock, Star, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const suggestions = ["Hambúrguer", "Pizza", "Japonesa", "Açaí", "Marmita", "Doces"];

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      <header className="bg-white px-6 pt-8 pb-4 sticky top-0 z-50 border-b border-slate-50">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={() => navigate("/delivery")} variant="ghost" size="icon" className="rounded-xl bg-slate-50">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-black uppercase tracking-tight">Busca</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            autoFocus
            placeholder="O que você quer comer hoje?" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-medium" 
          />
        </div>
      </header>

      <main className="p-6 space-y-8">
        {!search ? (
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sugestões para você</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSearch(s)}
                  className="px-6 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
              <Search size={40} />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Buscando por "{search}"...</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 py-4 flex justify-between items-center z-50">
        <button onClick={() => navigate("/delivery")} className="text-slate-400 flex flex-col items-center gap-1"><Utensils size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Início</span></button>
        <button onClick={() => navigate("/delivery/search")} className="text-orange-600 flex flex-col items-center gap-1"><Search size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Busca</span></button>
        <button onClick={() => navigate("/delivery/orders")} className="text-slate-400 flex flex-col items-center gap-1"><ShoppingBag size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span></button>
        <button onClick={() => navigate("/login")} className="text-slate-400 flex flex-col items-center gap-1"><User size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
      </nav>
    </div>
  );
};

export default SearchPage;