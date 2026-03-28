"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ShoppingCart, Utensils, ShoppingBag, User, Bell, CheckCircle2, Plus } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = [
  { name: "Promo", icon: "🔥", color: "bg-orange-50" },
  { name: "Lanches", icon: "🍔", color: "bg-yellow-50" },
  { name: "Pizza", icon: "🍕", color: "bg-red-50" },
  { name: "Japonesa", icon: "🍣", color: "bg-blue-50" },
  { name: "Bebidas", icon: "🥤", color: "bg-cyan-50" },
  { name: "Açaí", icon: "🥣", color: "bg-purple-50" },
  { name: "Saudável", icon: "🥗", color: "bg-green-50" },
];

const RESTAURANTS = [
  {
    name: "Big Burger Artesanal",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    time: "20-30 min",
    category: "Burgers",
    priceRange: "$$",
    isPromo: true
  },
  {
    name: "Pizzaria della Mamma",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    time: "35-50 min",
    category: "Pizza",
    priceRange: "$$$",
    isPromo: false
  }
];

const DeliveryApp = () => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    // Simulando usuário logado (ex: id 233 de Felipe Denis)
    const savedAddr = localStorage.getItem("kifome_addr_233");
    if (savedAddr) {
      const parsed = JSON.parse(savedAddr);
      setAddresses(parsed);
      const defaultAddr = parsed.find((a: any) => a.isDefault) || parsed[0];
      setSelectedAddress(defaultAddr);
      
      // Se não tiver endereço, abre o modal
      if (parsed.length === 0) setIsAddressModalOpen(true);
    } else {
      setIsAddressModalOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans">
      {/* Top Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-50 shadow-sm border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col cursor-pointer group" onClick={() => setIsAddressModalOpen(true)}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-600 transition-colors">Entregar em</span>
            <div className="flex items-center gap-1">
              <MapPin className="text-orange-600" size={16} />
              <span className="font-black text-sm text-slate-900">
                {selectedAddress ? (
                  <span className="flex items-center gap-2">
                    <span className="text-orange-600">{selectedAddress.nickname || "Endereço"}</span>
                    <span className="text-slate-300">•</span>
                    <span>{selectedAddress.street}, {selectedAddress.number}</span>
                  </span>
                ) : "Selecione um endereço"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-600">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-2xl bg-orange-50 text-orange-600 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">
                3
              </span>
            </Button>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
          <Input 
            placeholder="Buscar pratos ou restaurantes..." 
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-orange-600 font-medium placeholder:text-slate-400"
          />
        </div>
      </header>

      {/* Categorias */}
      <section className="py-8 overflow-x-auto whitespace-nowrap px-6 scrollbar-hide no-scrollbar">
        <div className="flex gap-5">
          {CATEGORIES.map((cat) => (
            <button key={cat.name} className="flex flex-col items-center gap-3 group">
              <div className={`w-20 h-20 ${cat.color} rounded-[2rem] shadow-sm flex items-center justify-center text-3xl group-active:scale-90 transition-all border border-transparent group-hover:border-orange-200 group-hover:shadow-md`}>
                {cat.icon}
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Listagem de Restaurantes */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Populares no <span className="text-orange-600">Kifome</span></h2>
          <button className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline">
            Ver Tudo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESTAURANTS.map((rest) => (
            <RestaurantCard key={rest.name} {...rest} />
          ))}
        </div>
      </section>

      {/* MODAL DE ENDEREÇOS */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Onde vamos entregar?</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase">Selecione um endereço para ver as lojas da sua região</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <button 
                  key={addr.id}
                  onClick={() => { setSelectedAddress(addr); setIsAddressModalOpen(false); }}
                  className={`w-full p-6 rounded-3xl border text-left flex items-center justify-between transition-all active:scale-95
                    ${selectedAddress?.id === addr.id ? 'bg-orange-50 border-orange-500 shadow-lg shadow-orange-100' : 'bg-slate-50 border-slate-100'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedAddress?.id === addr.id ? 'bg-orange-500 text-white' : 'bg-white text-slate-400'}`}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{addr.nickname || "Endereço"}</p>
                      <p className="font-black text-slate-900 uppercase text-xs">{addr.street}, {addr.number}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{addr.neighborhood} - {addr.city}</p>
                    </div>
                  </div>
                  {selectedAddress?.id === addr.id && <CheckCircle2 size={20} className="text-orange-500" />}
                </button>
              ))
            ) : (
              <div className="text-center py-10">
                <MapPin size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase">Nenhum endereço salvo</p>
              </div>
            )}
          </div>
          <Button className="w-full mt-6 h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">
            <Plus size={16} className="mr-2" /> Adicionar Novo Endereço
          </Button>
        </DialogContent>
      </Dialog>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 py-4 flex justify-between items-center z-50">
        <button className="text-orange-600 flex flex-col items-center gap-1 group">
          <Utensils size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Início</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1 group">
          <Search size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Busca</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1 group">
          <ShoppingBag size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1 group">
          <User size={24} className="group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default DeliveryApp;