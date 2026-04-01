"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, MapPin, ShoppingCart, Utensils, 
  ShoppingBag, User, Bell, CheckCircle2, 
  Plus, Navigation, Loader2, ChevronRight, Clock, ArrowRight,
  Ticket, Flame, X
} from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { id: "promo", name: "Promo", icon: "🔥", color: "bg-orange-50" },
  { id: "lanches", name: "Lanches", icon: "🍔", color: "bg-yellow-50" },
  { id: "pizza", name: "Pizza", icon: "🍕", color: "bg-red-50" },
  { id: "japonesa", name: "Japonesa", icon: "🍣", color: "bg-blue-50" },
  { id: "bebidas", name: "Bebidas", icon: "🥤", color: "bg-cyan-50" },
  { id: "acai", name: "Açaí", icon: "🥣", color: "bg-purple-50" },
  { id: "saudavel", name: "Saudável", icon: "🥗", color: "bg-green-50" },
];

const DeliveryApp = () => {
  const navigate = useNavigate();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    // Carregar Lojas
    const savedStores = localStorage.getItem("kifome_stores_full");
    if (savedStores) {
      setRestaurants(JSON.parse(savedStores));
    }

    // Carregar Endereços
    const savedAddr = localStorage.getItem("kifome_user_addresses");
    if (savedAddr) {
      const parsed = JSON.parse(savedAddr);
      setAddresses(parsed);
      setSelectedAddress(parsed.find((a: any) => a.isDefault) || parsed[0]);
    }
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (!selectedAddress) return restaurants;
    return restaurants.filter(r => 
      (r.city && selectedAddress.city && r.city.toLowerCase() === selectedAddress.city.toLowerCase()) || 
      r.status === 'Ativo'
    );
  }, [restaurants, selectedAddress]);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || "Sua Cidade";
          const newAddr = { 
            id: Date.now(), 
            nickname: "Local Atual", 
            street: data.address.road || "Rua Detectada", 
            city: city,
            isDefault: true 
          };
          setSelectedAddress(newAddr);
          const updated = [newAddr, ...addresses.filter(a => !a.isDefault)];
          setAddresses(updated);
          localStorage.setItem("kifome_user_addresses", JSON.stringify(updated));
          showSuccess(`Localizado em ${city}!`);
        } catch (e) { showError("Erro ao detectar endereço."); }
        finally { setIsLocating(false); setIsAddressModalOpen(false); }
      },
      () => { showError("GPS negado."); setIsLocating(false); }
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans">
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-50 shadow-sm border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col cursor-pointer group" onClick={() => setIsAddressModalOpen(true)}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entregar em</span>
            <div className="flex items-center gap-1">
              <MapPin className="text-orange-600" size={16} />
              <span className="font-black text-sm text-slate-900">
                {selectedAddress ? (
                  <>
                    {selectedAddress.city && <span>{selectedAddress.city} • </span>}
                    <span>{selectedAddress.street || "Selecionar endereço"}</span>
                  </>
                ) : "Selecione um endereço"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-600 relative">
              <Bell size={20} />
            </Button>
            <Button onClick={() => navigate("/delivery/checkout")} variant="ghost" size="icon" className="rounded-2xl bg-orange-50 text-orange-600">
              <ShoppingCart size={20} />
            </Button>
          </div>
        </div>
        
        <div onClick={() => navigate("/delivery/search")} className="relative group cursor-pointer">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <div className="w-full h-14 bg-slate-50 rounded-2xl flex items-center pl-12 text-slate-400 font-medium">
            Buscar pratos ou restaurantes...
          </div>
        </div>
      </header>

      <section className="py-8 overflow-x-auto whitespace-nowrap px-6 no-scrollbar">
        <div className="flex gap-5">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} className="flex flex-col items-center gap-3 group">
              <div className={`w-20 h-20 ${cat.color} rounded-[2rem] shadow-sm flex items-center justify-center text-3xl group-active:scale-90 transition-all`}>
                {cat.icon}
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lojas em <span className="text-orange-600">{selectedAddress?.city || "Sua Região"}</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length > 0 ? filteredRestaurants.map((rest) => (
            <RestaurantCard 
              key={rest.id} 
              id={rest.id}
              name={rest.name}
              image={rest.img}
              rating={4.8}
              time={rest.openTime + " - " + rest.closeTime}
              category={rest.category}
              priceRange="$$"
              isPromo={rest.isFeatured}
            />
          )) : (
            <div className="col-span-full py-20 text-center text-slate-300">
              <Utensils size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">Nenhuma loja aberta nesta região</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-8">
          <DialogHeader><DialogTitle className="text-xl font-black uppercase tracking-tight">Onde vamos entregar?</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-6">
            <Button onClick={handleGetCurrentLocation} disabled={isLocating} variant="outline" className="w-full h-16 rounded-2xl border-orange-100 bg-orange-50/50 text-orange-600 font-black uppercase text-[10px] tracking-widest gap-3">
              {isLocating ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
              {isLocating ? "Localizando..." : "Usar minha localização atual"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 py-4 flex justify-between items-center z-50">
        <button onClick={() => navigate("/delivery")} className="text-orange-600 flex flex-col items-center gap-1"><Utensils size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Início</span></button>
        <button onClick={() => navigate("/delivery/search")} className="text-slate-400 flex flex-col items-center gap-1"><Search size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Busca</span></button>
        <button onClick={() => navigate("/delivery/orders")} className="text-slate-400 flex flex-col items-center gap-1"><ShoppingBag size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span></button>
        <button onClick={() => navigate("/login")} className="text-slate-400 flex flex-col items-center gap-1"><User size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
      </nav>
    </div>
  );
};

export default DeliveryApp;