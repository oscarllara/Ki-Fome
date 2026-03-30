"use client";

import { useState } from "react";
import { 
  Truck, MapPin, Navigation, CheckCircle2, 
  Clock, DollarSign, User, ChevronRight, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

const DriverApp = () => {
  const [status, setStatus] = useState<"offline" | "online" | "busy">("online");
  
  const activeDeliveries = [
    { 
      id: "#1024", 
      store: "Ki + Lanches", 
      address: "Rua das Flores, 450 - Centro", 
      fee: "R$ 8,00",
      distance: "2.4 km",
      status: "Coletando"
    }
  ];

  const handleFinish = () => {
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
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Entregas Ativas</h3>
        
        {activeDeliveries.length > 0 ? (
          activeDeliveries.map(delivery => (
            <div key={delivery.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido {delivery.id}</p>
                    <p className="font-black text-slate-900 uppercase">{delivery.store}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-600 border-none font-black uppercase text-[9px]">{delivery.status}</Badge>
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
                    <p className="text-sm font-black text-emerald-600">{delivery.fee}</p>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Distância</p>
                    <p className="text-sm font-black text-slate-700">{delivery.distance}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 font-black uppercase text-[10px] gap-2">
                  <Navigation size={16} /> GPS
                </Button>
                <Button onClick={handleFinish} className="flex-1 h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] gap-2">
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

        <section className="pt-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Histórico Recente</h3>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase text-xs">Pedido #102{i}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Finalizado às 18:30</p>
                  </div>
                </div>
                <span className="font-black text-emerald-600 text-sm">+ R$ 7,50</span>
              </div>
            ))}
          </div>
        </section>
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