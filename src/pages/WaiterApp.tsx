"use client";

import { useState } from "react";
import { 
  LayoutGrid, Plus, Search, User, 
  ChevronLeft, Send, Hash, UtensilsCrossed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccess } from "@/utils/toast";

const WaiterApp = () => {
  const [step, setStep] = useState<"tables" | "order">("tables");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);

  const tables = Array.from({ length: 12 }, (_, i) => ({ id: (i + 1).toString(), status: i % 3 === 0 ? 'occupied' : 'free' }));

  const handleSelectTable = (id: string) => {
    setSelectedTable(id);
    setStep("order");
  };

  const handleFinish = () => {
    showSuccess(`Pedido da Mesa ${selectedTable} enviado!`);
    setStep("tables");
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <header className="bg-slate-900 text-white p-8 rounded-b-[3rem] shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Garçom Online</p>
              <h2 className="text-lg font-black uppercase tracking-tight">Ricardo Silva</h2>
            </div>
          </div>
          <Button variant="ghost" className="text-white/40 hover:text-white">
            <LayoutGrid size={24} />
          </Button>
        </div>
      </header>

      <main className="px-6">
        {step === "tables" ? (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Selecione a Mesa</h3>
            <div className="grid grid-cols-3 gap-4">
              {tables.map(table => (
                <button 
                  key={table.id}
                  onClick={() => handleSelectTable(table.id)}
                  className={`aspect-square rounded-[2rem] flex flex-col items-center justify-center transition-all active:scale-90 border-2
                    ${table.status === 'occupied' ? 'bg-white border-orange-500 text-orange-600 shadow-lg shadow-orange-100' : 'bg-white border-slate-100 text-slate-400'}
                  `}
                >
                  <span className="text-[10px] font-black uppercase mb-1">Mesa</span>
                  <span className="text-2xl font-black">{table.id}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-10">
            <div className="flex items-center gap-4">
              <Button onClick={() => setStep("tables")} variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm">
                <ChevronLeft size={20} />
              </Button>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Lançar: Mesa {selectedTable}</h3>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Código ou nome do produto..." className="pl-12 h-14 rounded-2xl border-none bg-white shadow-sm font-bold" />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
               <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                  <UtensilsCrossed size={48} className="mb-4 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest">Aguardando itens...</p>
               </div>
            </div>

            <Button 
              onClick={handleFinish}
              className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl flex gap-3"
            >
              <Send size={18} /> Finalizar e Enviar
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WaiterApp;