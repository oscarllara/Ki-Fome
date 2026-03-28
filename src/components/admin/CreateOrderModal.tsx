"use client";

import { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, User, Store, Navigation, Search, Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CreateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateOrderModal = ({ open, onOpenChange }: CreateOrderModalProps) => {
  const [loading, setLoading] = useState(false);
  const [pickupType, setPickupType] = useState<"store" | "gps">("store");

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de processamento
    setTimeout(() => {
      setLoading(false);
      showSuccess("Pedido lançado com sucesso no sistema!");
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-[2.5rem] p-0 overflow-hidden shadow-2xl border-none">
        <form onSubmit={handleLaunch}>
          <DialogHeader className="p-8 bg-slate-900 text-white">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Navigation className="text-orange-500" /> Lançar Pedido Manual
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Utilize esta função para pedidos via Telefone ou WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[65vh] overflow-y-auto no-scrollbar">
            {/* Coluna 1: Cliente e Loja */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <User size={16} className="text-orange-500" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dados do Cliente</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome do Cliente</Label>
                    <Input placeholder="Ex: João Silva" className="rounded-xl h-12 font-bold" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Telefone / WhatsApp</Label>
                    <Input placeholder="+55 (88) 99999-9999" className="rounded-xl h-12 font-bold" required />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Store size={16} className="text-orange-500" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origem (Retirada)</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Selecionar Loja</Label>
                    <Select defaultValue="1">
                      <SelectTrigger className="h-12 rounded-xl font-bold">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1" className="font-bold">Ki + Lanches (Matriz)</SelectItem>
                        <SelectItem value="2" className="font-bold">Pizzaria Bella</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Endereço de Retirada:</p>
                    <p className="text-xs font-bold text-slate-700">Rua Central, 123 - Centro, Lavras/MG</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Coluna 2: Entrega e Mapa */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <MapPin size={16} className="text-orange-500" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destino (Entrega)</h3>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input placeholder="Buscar endereço de entrega..." className="pl-10 h-12 rounded-xl font-bold border-orange-100 focus:ring-orange-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rua</Label>
                      <Input className="rounded-xl h-10 text-xs font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nº</Label>
                      <Input className="rounded-xl h-10 text-xs font-bold" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Placeholder de Mapa */}
              <div className="w-full h-48 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:opacity-40 transition-opacity" 
                  alt="Map"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <Navigation size={32} className="mb-2 text-orange-500 animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Visualização GPS Ativa</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50 border-t flex gap-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold uppercase text-[10px] h-14 flex-1">Cancelar</Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-14 flex-1 shadow-xl shadow-orange-100"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Navigation size={18} className="mr-2" />}
              Lançar Pedido Agora
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderModal;