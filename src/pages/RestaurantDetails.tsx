"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, Clock, Info, Search, 
  Plus, ShoppingBag, ChevronRight, Heart,
  Share2, MapPin, Minus, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { showSuccess } from "@/utils/toast";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("kifome_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const handleOpenItem = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(i => i.id === selectedItem.id);

    if (existingIndex > -1) {
      newCart[existingIndex].qty += quantity;
    } else {
      newCart.push({ ...selectedItem, qty: quantity });
    }

    setCart(newCart);
    localStorage.setItem("kifome_cart", JSON.stringify(newCart));
    setSelectedItem(null);
    showSuccess(`${quantity}x ${selectedItem.name} adicionado!`);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Mock de menu (Em produção viria do localStorage/API)
  const menu = [
    {
      category: "Mais Pedidos",
      items: [
        { id: 1, name: "X-Turbo Burguer", desc: "Pão brioche, blend 180g, queijo cheddar, bacon crocante.", price: 28.90, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400" },
        { id: 2, name: "Combo Casal", desc: "2 Burgers + Batata G + Coca 1.5L.", price: 65.00, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      <div className="relative h-64 md:h-80">
        <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <Button onClick={() => navigate("/delivery")} className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40"><ArrowLeft size={24} /></Button>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-50">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Big Burger Artesanal</h1>
          <div className="flex gap-6 py-4 border-t border-slate-50 mt-4">
            <div className="flex items-center gap-2"><Clock className="text-slate-400" size={18} /><span className="text-xs font-bold text-slate-600">25-35 min</span></div>
            <div className="flex items-center gap-2"><Star className="text-orange-600 fill-orange-600" size={18} /><span className="font-black text-orange-700">4.8</span></div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {menu.map((cat) => (
          <section key={cat.category} className="px-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 ml-2">{cat.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <div key={item.id} onClick={() => handleOpenItem(item)} className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-all cursor-pointer group active:scale-95">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 uppercase text-sm group-hover:text-orange-600 transition-colors">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2">{item.desc}</p>
                    <p className="text-lg font-black text-slate-900 mt-3">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 shadow-inner">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Modal de Quantidade */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none">
          {selectedItem && (
            <>
              <div className="h-48 relative">
                <img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} />
                <Button onClick={() => setSelectedItem(null)} variant="ghost" size="icon" className="absolute top-4 right-4 bg-black/20 text-white rounded-full hover:bg-black/40"><X size={20} /></Button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedItem.name}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-2">{selectedItem.desc}</p>
                </div>
                <div className="flex items-center justify-between py-6 border-y border-slate-50">
                  <span className="font-black text-slate-900">R$ {(selectedItem.price * quantity).toFixed(2)}</span>
                  <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
                    <Button onClick={() => setQuantity(Math.max(1, quantity - 1))} variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm"><Minus size={18} /></Button>
                    <span className="font-black text-lg w-6 text-center">{quantity}</span>
                    <Button onClick={() => setQuantity(quantity + 1)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm"><Plus size={18} /></Button>
                  </div>
                </div>
                <Button onClick={handleAddToCart} className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Adicionar ao Carrinho</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {cartItemsCount > 0 && (
        <div className="fixed bottom-8 left-6 right-6 z-50 animate-in slide-in-from-bottom-10">
          <Button onClick={() => navigate("/delivery/checkout")} className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] shadow-2xl flex justify-between px-8 items-center group active:scale-95 transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">{cartItemsCount}</div>
              <span className="font-black uppercase text-[11px] tracking-widest">Ver Carrinho</span>
            </div>
            <span className="font-black">R$ {cartTotal.toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;