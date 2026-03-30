"use client";

import { useState, useEffect } from "react";
import { 
  Truck, MapPin, Navigation, CheckCircle2, 
  Clock, DollarSign, User, ChevronRight, Phone, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

const DriverApp = () => {
  const [status, setStatus] = useState<"offline" | "online" | "busy">("online");
  const [deliveries, setDeliveries] = useState<any[]>([]);

  const loadDeliveries = () => {
    const allOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
    // Entregador vê pedidos que estão READY (Prontos) ou SHIPPING (Em rota com ele)
    const active = allOrders.filter((o: any) => o.status === 'READY' || o.status === 'SHIPPING');
    setDeliveries(active);
  };

  useEffect(() => {
    loadDeliveries();
    const interval = setInterval(loadDeliveries, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFinish = (orderId: string) => {
    const allOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
    const updated = allOrders.map((o: any) => o.id === orderId ? { ...o, status: 'DELIVERED' } : o);
    localStorage.setItem("kifome_orders", JSON.stringify(updated));
    loadDeliveries();
    showSuccess("Entrega finalizada! Saldo atualizado.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header do Entregador */}
      <header className="bg-slate-900 text-white p-8 rounded-b-[3rem] shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center border-2 border-white/10">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Entregador</p>
              <h2 className="text-lg font-black uppercase tracking-tight">Marcos Oliveira</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">Ganhos Hoje</p>
            <p className="text-xl font-black text-emerald-400">R$ 124,50</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setStatus("online")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${status === 'online' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40'}`}
          >
            Disponível
          </button>
          <button 
            onClick={() => setStatus("offline")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${status === 'offline' ? 'bg-red-600 text-white shadow-lg' : 'text-white/40'}`}
          >
            Offline
          </button>
        </div>
      </header>

      <main className="px-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Entregas Ativas</h3>
          <Button onClick={loadDeliveries} variant="ghost" size="icon" className="text-slate-400"><RefreshCw size={18} /></Button>
        </div>
        
        {deliveries.length > 0 ? (
          deliveries.map(delivery => (
            <div key={delivery.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido {delivery.id}</p>
                    <p className="font-black text-slate-900 uppercase">Restaurante Central</p>
                  </div>
                </div>
                <Badge className={`border-none font-black uppercase text-[9px] ${delivery.status === 'READY' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {delivery.status === 'READY' ? 'Aguardando Coleta' : 'Em Rota'}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Destino</p>
                    <p className="text-xs font-bold text-slate-700">{delivery.address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Taxa</p>
                    <p className="text-sm font-black text-emerald-600">R$ 5,00</p>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Total Pedido</p>
                    <p className="text-sm font-black text-slate-700">{delivery.total}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 font-black uppercase text-[10px] gap-2">
                  <Navigation size={16} /> GPS
                </Button>
                <Button 
                  onClick={() => handleFinish(delivery.id)} 
                  className="flex-1 h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] gap-2"
                >
                  <CheckCircle2 size={16} /> Finalizar
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Clock size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-black text-slate-400 uppercase">Aguardando novas chamadas...</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 py-4 flex justify-between items-center z-50">
        <button className="text-orange-600 flex flex-col items-center gap-1">
          <Navigation size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Entregas</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <DollarSign size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Ganhos</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <User size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default DriverApp;