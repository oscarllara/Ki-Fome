"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, MapPin, ShoppingCart, Utensils, 
  ShoppingBag, User, Bell, CheckCircle2, 
  Plus, Navigation, Loader2, ChevronRight, Clock, ArrowRight,
  Ticket, Flame, X
} from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: "Cupom Disponível!", desc: "Use KIFOME20 e ganhe R$ 20 OFF.", type: "promo", time: "2h atrás" },
    { id: 2, title: "Novidade na Área", desc: "Pizzaria della Mamma agora aceita PIX.", type: "info", time: "5h atrás" }
  ]);

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
          
          if (active) {
            const orderNotif = {
              id: `order-${active.id}`,
              title: "Status do Pedido",
              desc: `Seu pedido ${active.id} está em status: ${active.status}`,
              type: "order",
              orderId: active.id.replace('#', ''),
              time: "Agora"
            };
            setNotifications(prev => {
              const exists = prev.find(n => n.id === orderNotif.id);
              if (exists && exists.desc === orderNotif.desc) return prev;
              return [orderNotif, ...prev.filter(n => n.id !== orderNotif.id)];
            });
          }
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-600 relative">
                  <Bell size={20} />
                  {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 rounded-l-[3rem] border-none shadow-2xl">
                <SheetHeader className="p-8 bg-slate-900 text-white rounded-bl-[3rem]">
                  <SheetTitle className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                    <Bell className="text-orange-500" /> Notificações
                  </SheetTitle>
                </SheetHeader>
                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] no-scrollbar">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        if (n.type === 'order') navigate(`/delivery/track/${n.orderId}`);
                        else navigate("/delivery");
                      }}
                      className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex gap-4 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'promo' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {n.type === 'promo' ? <Ticket size={20} /> : n.type === 'order' ? <ShoppingBag size={20} /> : <Flame size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{n.title}</h4>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{n.desc}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-slate-300">
                      <Bell size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest">Nenhuma notificação</p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

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
        
        <div onClick={() => navigate("/delivery/search")} className="relative group cursor-pointer">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <div className="w-full h-14 bg-slate-50 rounded-2xl flex items-center pl-12 text-slate-400 font-medium">
            Buscar pratos ou restaurantes...
          </div>
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
        <button onClick={() => navigate("/delivery/search")} className="text-slate-400 flex flex-col items-center gap-1"><Search size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Busca</span></button>
        <button onClick={() => navigate("/delivery/orders")} className="text-slate-400 flex flex-col items-center gap-1"><ShoppingBag size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span></button>
        <button onClick={() => navigate("/login")} className="text-slate-400 flex flex-col items-center gap-1"><User size={24} /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
      </nav>
    </div>
  );
};

export default DeliveryApp;