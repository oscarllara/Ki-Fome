"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Utensils, Search, User, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ClientOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kifome_orders");
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/delivery")} variant="ghost" size="icon" className="rounded-xl bg-slate-50">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-black uppercase tracking-tight">Meus Pedidos</h1>
        </div>
      </header>

      <main className="p-6 space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.id} 
              onClick={() => navigate(`/delivery/track/${order.id.replace('#', '')}`)}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido {order.id}</p>
                    <p className="font-black text-slate-900 uppercase text-sm">Restaurante Central</p>
                  </div>
                </div>
                <Badge className={`border-none font-black uppercase text-[9px] px-3 py-1 rounded-lg ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                  {order.status === 'DELIVERED' ? 'Concluído' : 'Em andamento'}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.items.slice(0, 2).map((item: string, i: number) => (
                  <p key={i} className="text-xs font-bold text-slate-500 uppercase">• {item}</p>
                ))}
                {order.items.length > 2 && <p className="text-[10px] font-black text-slate-300 uppercase">+ {order.items.length - 2} itens</p>}
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">{order.total}</span>
                <div className="flex items-center gap-1 text-orange-600 font-black uppercase text-[10px] tracking-widest">
                  Ver Detalhes <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-white rounded-[3rem] flex items-center justify-center mx-auto shadow-sm text-slate-200">
              <ShoppingBag size={48} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Nenhum pedido ainda</h3>
              <p className="text-sm font-medium text-slate-400 mt-2">Que tal fazer seu primeiro pedido agora?</p>
            </div>
            <Button onClick={() => navigate("/delivery")} className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-100">
              Explorar Cardápio
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 py-4 flex justify-between items-center z-50">
        <button onClick={() => navigate("/delivery")} className="text-slate-400 flex flex-col items-center gap-1"><Utensils size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Início</span></button>
        <button onClick={() => navigate("/delivery/search")} className="text-slate-400 flex flex-col items-center gap-1"><Search size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Busca</span></button>
        <button onClick={() => navigate("/delivery/orders")} className="text-orange-600 flex flex-col items-center gap-1"><ShoppingBag size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span></button>
        <button onClick={() => navigate("/login")} className="text-slate-400 flex flex-col items-center gap-1"><User size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
      </nav>
    </div>
  );
};

export default ClientOrdersPage;