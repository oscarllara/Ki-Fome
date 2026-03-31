"use client";

import { useState } from "react";
import { Smartphone, Store, LayoutDashboard, ArrowLeftRight, Maximize2, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const SplitPreview = () => {
  const [rightView, setRightView] = useState<"admin" | "gestor">("admin");

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Header de Controle do Split */}
      <header className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-orange-600 px-3 py-1 rounded-lg">
            <ArrowLeftRight size={16} className="text-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Modo Simulação Real-Time</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-500 uppercase mr-2">Lado Direito:</span>
          <Button 
            onClick={() => setRightView("admin")}
            variant={rightView === 'admin' ? 'default' : 'ghost'}
            className={`h-8 text-[9px] font-black uppercase rounded-lg ${rightView === 'admin' ? 'bg-blue-600' : 'text-slate-400'}`}
          >
            <Store size={14} className="mr-1" /> Lojista
          </Button>
          <Button 
            onClick={() => setRightView("gestor")}
            variant={rightView === 'gestor' ? 'default' : 'ghost'}
            className={`h-8 text-[9px] font-black uppercase rounded-lg ${rightView === 'gestor' ? 'bg-slate-700' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={14} className="mr-1" /> Gestor Master
          </Button>
        </div>
      </header>

      {/* Área dos IFrames */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* Lado Esquerdo: App Cliente */}
        <div className="flex-1 flex flex-col border-r-4 border-slate-800 relative group">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <Smartphone size={14} className="text-orange-500" />
              <span className="text-[9px] font-black text-white uppercase">Interface do Cliente</span>
            </div>
          </div>
          <iframe 
            src="/delivery" 
            className="flex-1 w-full h-full border-none bg-white"
            title="Client App"
          />
        </div>

        {/* Lado Direito: Painel Administrativo */}
        <div className="flex-1 flex flex-col relative group">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <Monitor size={14} className={rightView === 'admin' ? 'text-blue-500' : 'text-emerald-500'} />
              <span className="text-[9px] font-black text-white uppercase">
                {rightView === 'admin' ? 'Painel do Restaurante' : 'Dashboard do Sistema'}
              </span>
            </div>
          </div>
          <iframe 
            src={rightView === 'admin' ? "/admin" : "/gestor"} 
            className="flex-1 w-full h-full border-none bg-slate-50"
            title="Admin Panel"
          />
        </div>
      </div>

      {/* Footer Informativo */}
      <footer className="h-8 bg-slate-900 border-t border-white/5 flex items-center justify-center px-6 shrink-0">
        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          Dica: Faça um pedido no lado esquerdo e veja ele aparecer no "Gestor de Pedidos" do lado direito.
        </p>
      </footer>
    </div>
  );
};

export default SplitPreview;