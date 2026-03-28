"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Utensils, Receipt, Plus, Minus, ShoppingBag, 
  CheckCircle2, Search, ChevronRight, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { showSuccess } from "@/utils/toast";

const MOCK_MENU = [
  { id: 1, name: "X-Turbo Burguer", price: 25.90, category: "Lanches", icon: "🍔" },
  { id: 2, name: "Batata Frita G", price: 18.00, category: "Porções", icon: "🍟" },
  { id: 3, name: "Coca-Cola Lata", price: 6.00, category: "Bebidas", icon: "🥤" },
];

const TableOrderApp = () => {
  const { tableId } = useParams();
  const [activeTab, setActiveTab] = useState<"menu" | "comanda">("menu");
  const [cart, setCart] = useState<any[]>([]);
  const [comanda, setComanda] = useState<any[]>([
    { name: "Suco de Laranja", price: 12.00, status: "Entregue", time: "10 min atrás" }
  ]);

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    showSuccess(`${item.name} adicionado!`);
  };

  const handleSendOrder = () => {
    const newItems = cart.map(item => ({ ...item, status: "Preparando", time: "Agora" }));
    setComanda([...comanda, ...newItems]);
    setCart([]);
    showSuccess("Pedido enviado para a cozinha!");
    setActiveTab("comanda");
  };

  const totalComanda = comanda.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans">
      {/* Header Fixo */}
      <header className="bg-slate-900 text-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Bem-vindo ao Kifome</p>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Mesa {tableId || "05"}</h1>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Utensils size={24} className="text-orange-500" />
          </div>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab("menu")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-orange-600 text-white shadow-lg' : 'text-white/40'}`}
          >
            Cardápio
          </button>
          <button 
            onClick={() => setActiveTab("comanda")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'comanda' ? 'bg-orange-600 text-white shadow-lg' : 'text-white/40'}`}
          >
            Minha Comanda
          </button>
        </div>
      </header>

      <main className="px-6 pt-8">
        {activeTab === "menu" ? (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <Input placeholder="O que deseja pedir?" className="pl-12 h-14 rounded-2xl border-none bg-slate-100 font-bold" />
            </div>

            <div className="space-y-4">
              {MOCK_MENU.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group active:scale-95 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase text-sm">{item.name}</p>
                      <p className="text-orange-600 font-black">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => addToCart(item)}
                    size="icon" 
                    className="bg-slate-900 hover:bg-orange-600 text-white rounded-xl h-10 w-10"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Total Consumido</span>
                <Receipt size={20} className="text-orange-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900">R$ {totalComanda.toFixed(2)}</h2>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Itens Lançados</h3>
              {comanda.map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'Entregue' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`}></div>
                    <div>
                      <p className="font-black text-slate-900 uppercase text-xs">{item.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{item.time} • {item.status}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-700 text-sm">R$ {item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Button className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl">
              Solicitar Fechamento
            </Button>
          </div>
        )}
      </main>

      {/* Barra de Carrinho Flutuante */}
      {cart.length > 0 && activeTab === "menu" && (
        <div className="fixed bottom-6 left-6 right-6 animate-in slide-in-from-bottom-10">
          <Button 
            onClick={handleSendOrder}
            className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] shadow-2xl flex justify-between px-8 items-center"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">
                {cart.length}
              </div>
              <span className="font-black uppercase text-[11px] tracking-widest">Enviar Pedido</span>
            </div>
            <span className="font-black">R$ {cart.reduce((acc, i) => acc + i.price, 0).toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TableOrderApp;