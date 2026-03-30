"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, TrendingUp, Store, Users, Bell, 
  ArrowUpRight, DollarSign, PieChart, 
  ChevronRight, Star, Zap, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

const PartnerApp = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Simulação de "Plin" - Ganhos chegando
  useEffect(() => {
    const interval = setInterval(() => {
      const stores = ["Ki + Lanches", "Pizzaria Bella", "Top Burguer"];
      const levels = ["Nível 1 (Master)", "Nível 2 (Regional)", "Nível 3 (Local)"];
      const store = stores[Math.floor(Math.random() * stores.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const value = (Math.random() * 5 + 1).toFixed(2);

      const newNotif = {
        id: Date.now(),
        store,
        level,
        value,
        time: "Agora"
      };

      setNotifications(prev => [newNotif, ...prev].slice(0, 5));
      showSuccess(`Plin! + R$ ${value} da loja ${store}`);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Saldo Disponível", value: "R$ 1.240,50", icon: <Wallet className="text-emerald-500" />, color: "bg-emerald-50" },
    { label: "Ganhos Hoje", value: "R$ 84,20", icon: <Zap className="text-orange-500" />, color: "bg-orange-50" },
    { label: "Lojas Vinculadas", value: "12", icon: <Store className="text-blue-500" />, color: "bg-blue-50" },
    { label: "Sua Graduação", value: "Diamante", icon: <Award className="text-purple-500" />, color: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      {/* Header Premium */}
      <header className="bg-slate-900 text-white p-10 rounded-b-[4rem] shadow-2xl mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] flex items-center justify-center shadow-xl border-4 border-white/10">
              <Users size={32} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-1">Parceiro Kifome</p>
              <h2 className="text-2xl font-black uppercase tracking-tight">Helio Junio</h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 text-white hover:bg-white/10 relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Comissão Acumulada</p>
            <p className="text-3xl font-black text-white">R$ 12.450</p>
          </div>
          <div className="bg-orange-600 p-6 rounded-[2rem] shadow-xl shadow-orange-900/20">
            <p className="text-[10px] font-black text-orange-200 uppercase mb-2">Próximo Saque</p>
            <p className="text-3xl font-black text-white">R$ 850,00</p>
          </div>
        </div>
      </header>

      <main className="px-8 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all">
              <CardContent className="p-8 flex items-center gap-5">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-xl font-black text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Feed de Ganhos em Tempo Real */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Fluxo de Ganhos (Plin!)</h3>
              <Badge className="bg-emerald-100 text-emerald-600 border-none font-black uppercase text-[9px]">Ao Vivo</Badge>
            </div>
            
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500">
                        <ArrowUpRight size={28} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase">{notif.store}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 text-slate-400">{notif.level}</Badge>
                          <span className="text-[10px] font-bold text-slate-300 uppercase">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-600">+ R$ {notif.value}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Comissão Direta</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-sm font-black text-slate-400 uppercase">Aguardando novos pedidos nas suas lojas...</p>
                </div>
              )}
            </div>
          </div>

          {/* Divisão por Níveis */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight px-2">Desempenho por Nível</h3>
            <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden bg-slate-900 text-white">
              <CardContent className="p-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Nível 1 (Master)</p>
                      <p className="text-xl font-black">R$ 8.450,00</p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">68%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[68%]"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Nível 2 (Regional)</p>
                      <p className="text-xl font-black">R$ 2.800,00</p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">22%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[22%]"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Nível 3 (Local)</p>
                      <p className="text-xl font-black">R$ 1.200,00</p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">10%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[10%]"></div>
                  </div>
                </div>

                <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4">
                  Ver Detalhes da Rede
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 py-4 flex justify-between items-center z-50">
        <button className="text-orange-600 flex flex-col items-center gap-1">
          <TrendingUp size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Ganhos</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <Store size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Lojas</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <Users size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Rede</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <Wallet size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Saque</span>
        </button>
      </nav>
    </div>
  );
};

export default PartnerApp;