"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, MapPin, ShoppingCart, Utensils, 
  ShoppingBag, User, Bell, CheckCircle2, 
  Plus, Navigation, Loader2, ChevronRight, Clock, ArrowRight 
} from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { id: "promo", name: "Promo", icon: "🔥", color: "bg-orange-50" },
  { id: "lanches", name: "Lanches", icon: "🍔", color: "bg-yellow-50" },
  { id: "pizza", name: "Pizza", icon: "🍕", color: "bg-red-50" },
  { id: "japonesa", name: "Japonesa", icon: "🍣", color: "bg-blue-50" },
  { id: "bebidas", name: "Bebidas", icon: "🥤", color: "bg-cyan-50" },
  { id: "acai", name: "Açaí", icon: "🥣", color: "bg-purple-50" },
  { id: "saudavel", name: "Saudável", icon: "🥗", color: "bg-green-50" },
];

const RESTAURANTS = [
  {
    id: "1",
    name: "Big Burger Artesanal",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    time: "20-30 min",
    category: "Burgers",
    priceRange: "$$",
    isPromo: true
  },
  {
    id: "2",
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
  const navigate = useNavigate();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const savedAddr = localStorage.getItem("kifome_user_addresses");
      if (savedAddr) {
        const parsed = JSON.parse(savedAddr);
        setAddresses(Array.isArray(parsed) ? parsed : []);
        setSelectedAddress(parsed.find((a: any) => a.isDefault) || parsed[0]);
      }
    } catch (e) { console.error(e); }

    const checkActiveOrder = () => {
      try {
        const savedOrders = localStorage.getItem("kifome_orders");
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        if (Array.isArray(orders)) {
          const active = orders.find((o: any) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
          setActiveOrder(active);
        }
      } catch (e) { console.error(e); }
    };

    checkActiveOrder();
    const interval = setInterval(checkActiveOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || "Sua Cidade";
          const newAddr = { id: Date.now(), nickname: city, street: data.address.road || "Rua Detectada", number: "S/N", isDefault: true };
          setSelectedAddress(newAddr);
          const updated = [newAddr, ...addresses];
          setAddresses(updated);
          localStorage.setItem("kifome_user_addresses", JSON.stringify(updated));
          showSuccess("Localização detectada!");
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
                {selectedAddress ? `${selectedAddress.nickname} • ${selectedAddress.street}` : "Selecione um endereço"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-600"><Bell size={20} /></Button>
            <Button 
              onClick={() => navigate("/delivery/checkout")}
              variant="ghost" 
              size="icon" 
              className="rounded-2xl bg-orange-50 text-orange-600 relative"
            >
              <ShoppingCart size={20} />
            </Button>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input placeholder="Buscar pratos ou restaurantes..." className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-medium" />
        </div>
      </header>

      {activeOrder && (
        <section className="px-6 pt-6">
          <div 
            onClick={() => {
              const cleanId = activeOrder.id.replace('#', '');
              navigate(`/delivery/track/${cleanId}`);
            }}
            className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all shadow-xl shadow-slate-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center animate-pulse">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Pedido em andamento</p>
                <p className="text-sm font-black uppercase tracking-tight">Acompanhar Entrega</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-slate-500" />
          </div>
        </section>
      )}

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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Populares no <span className="text-orange-600">Kifome</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESTAURANTS.map((rest) => (
            <RestaurantCard key={rest.id} {...rest} />
          ))}
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
        <button className="text-slate-400 flex flex-col items-center gap-1"><Search size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Busca</span></button>
        <button className="text-slate-400 flex flex-col items-center gap-1"><ShoppingBag size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span></button>
        <button onClick={() => navigate("/login")} className="text-slate-400 flex flex-col items-center gap-1"><User size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
      </nav>
    </div>
  );
};

export default DeliveryApp;