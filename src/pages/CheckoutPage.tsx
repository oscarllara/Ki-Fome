"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, CreditCard, Wallet, 
  Banknote, CheckCircle2, Loader2,
  ShoppingBag, Plus, Minus, Smartphone, Navigation,
  ChevronRight, MapPinned, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import MercadoPagoPayment from "@/components/MercadoPagoPayment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [address, setAddress] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Estados do formulário de endereço
  const [addrForm, setAddrForm] = useState({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    reference: "",
    nickname: "Minha Casa"
  });

  const MP_PUBLIC_KEY = "APP_USR-d0b5b319-7a4b-4ed5-9639-08f993aab379"; 

  useEffect(() => {
    const loadData = () => {
      const savedAddr = localStorage.getItem("kifome_user_addresses");
      if (savedAddr) {
        const parsed = JSON.parse(savedAddr);
        const current = parsed.find((a: any) => a.isDefault) || parsed[0];
        setAddress(current);
        if (current) {
          setAddrForm({
            street: current.street || "",
            number: current.number || "",
            neighborhood: current.neighborhood || "",
            city: current.city || "",
            state: current.state || "",
            reference: current.reference || "",
            nickname: current.nickname || "Minha Casa"
          });
        }
      }

      const savedCart = localStorage.getItem("kifome_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    };
    loadData();
  }, []);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          setAddrForm(prev => ({
            ...prev,
            street: data.address.road || "",
            neighborhood: data.address.suburb || data.address.neighbourhood || "",
            city: data.address.city || data.address.town || "",
            state: data.address.state || "",
          }));
          showSuccess("Localização detectada! Por favor, insira o número.");
        } catch (e) { showError("Erro ao detectar endereço."); }
        finally { setIsLocating(false); }
      },
      () => { 
        showError("GPS negado ou indisponível."); 
        setIsLocating(false); 
      }
    );
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.street || !addrForm.number || !addrForm.neighborhood || !addrForm.city) {
      showError("Preencha os campos obrigatórios (Rua, Número, Bairro e Cidade).");
      return;
    }

    const newAddr = { 
      ...addrForm,
      id: Date.now(), 
      isDefault: true 
    };
    
    setAddress(newAddr);
    localStorage.setItem("kifome_user_addresses", JSON.stringify([newAddr]));
    showSuccess("Endereço salvo!");
    setIsAddressModalOpen(false);
  };

  const updateQty = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0);
    
    setCart(newCart);
    localStorage.setItem("kifome_cart", JSON.stringify(newCart));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = (paymentDetails?: any) => {
    if (!address) {
      setIsAddressModalOpen(true);
      showError("Por favor, defina um endereço de entrega.");
      return;
    }
    if (cart.length === 0) {
      showError("Seu carrinho está vazio.");
      return;
    }

    setLoading(true);
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

    const newOrder = {
      id: `#${orderId}`,
      customer: "Felipe Denis",
      phone: "(88) 99926-6723",
      address: `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}`,
      reference: address.reference || "",
      items: cart.map(i => `${i.qty}x ${i.name}`),
      total: `R$ ${total.toFixed(2)}`,
      status: 'PENDING',
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: paymentDetails ? 'PAID' : 'PENDING',
      paymentId: paymentDetails?.id || null,
      time: "Agora",
      createdAt: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
    localStorage.setItem("kifome_orders", JSON.stringify([newOrder, ...existingOrders]));

    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("kifome_cart");
      showSuccess("Pedido confirmado!");
      navigate(`/delivery/track/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      <header className="bg-white px-6 py-6 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-100">
        <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="rounded-xl"><ArrowLeft size={24} /></Button>
        <h1 className="text-xl font-black uppercase tracking-tight">Finalizar Pedido</h1>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seu Pedido</h3>
          <div className="divide-y divide-slate-50">
            {cart.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-black text-slate-900 uppercase text-xs">{item.name}</p>
                  <p className="text-xs font-bold text-orange-600">R$ {(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 hover:text-red-500"><Minus size={14} /></button>
                  <span className="font-black text-xs w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 hover:text-orange-600"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section 
          onClick={() => setIsAddressModalOpen(true)}
          className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-orange-200 transition-all"
        >
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Endereço de Entrega</h3>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0"><MapPin size={24} /></div>
            <div className="flex-1">
              {address ? (
                <>
                  <p className="font-black text-slate-900 uppercase text-sm">{address.nickname}</p>
                  <p className="text-xs text-slate-500 font-medium">{address.street}, {address.number} - {address.neighborhood}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{address.city} / {address.state}</p>
                  {address.reference && (
                    <p className="text-[10px] text-orange-600 font-bold uppercase mt-1 flex items-center gap-1">
                      <Info size={10} /> Ref: {address.reference}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm font-black text-orange-600 uppercase">Clique para definir endereço</p>
              )}
            </div>
            <ChevronRight className="text-slate-300" />
          </div>
        </section>

        <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Forma de Pagamento</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'online', name: 'Cartão Online (Mercado Pago)', icon: <Smartphone size={20} />, color: 'text-blue-500' },
              { id: 'pix', name: 'PIX (Automático)', icon: <Wallet size={20} />, color: 'text-emerald-600' },
              { id: 'machine', name: 'Cartão (Máquina da Loja)', icon: <CreditCard size={20} />, color: 'text-blue-600' },
              { id: 'money', name: 'Dinheiro', icon: <Banknote size={20} />, color: 'text-emerald-500' },
            ].map((method) => (
              <button 
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all
                  ${paymentMethod === method.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-600'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`${paymentMethod === method.id ? 'text-white' : method.color}`}>{method.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-tight">{method.name}</span>
                </div>
                {paymentMethod === method.id && <CheckCircle2 size={18} className="text-orange-500" />}
              </button>
            ))}
          </div>
        </section>

        {paymentMethod === 'online' && address && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <MercadoPagoPayment 
              publicKey={MP_PUBLIC_KEY} 
              amount={total} 
              orderId="TEMP_ID" 
              onPaymentSuccess={handlePlaceOrder}
            />
          </div>
        )}

        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between text-sm font-bold text-slate-500"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm font-bold text-emerald-600"><span>Taxa de Entrega</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
          <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
            <span className="text-lg font-black text-slate-900 uppercase">Total</span>
            <span className="text-2xl font-black text-orange-600">R$ {total.toFixed(2)}</span>
          </div>
        </section>
      </main>

      {paymentMethod !== 'online' && (
        <div className="fixed bottom-8 left-6 right-6 max-w-2xl mx-auto z-50">
          <Button onClick={() => handlePlaceOrder()} disabled={loading || cart.length === 0} className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] shadow-2xl font-black uppercase tracking-widest text-[11px] flex gap-3">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />}
            {loading ? "Processando..." : "Finalizar Pedido"}
          </Button>
        </div>
      )}

      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="max-w-lg rounded-[2.5rem] p-0 overflow-hidden shadow-2xl border-none">
          <form onSubmit={handleSaveAddress}>
            <DialogHeader className="p-8 bg-slate-900 text-white">
              <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <MapPinned className="text-orange-500" /> Endereço de Entrega
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              <Button 
                type="button"
                onClick={handleGetCurrentLocation} 
                disabled={isLocating} 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-orange-100 bg-orange-50/50 text-orange-600 font-black uppercase text-[10px] tracking-widest gap-3 mb-4"
              >
                {isLocating ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
                {isLocating ? "Localizando..." : "Usar minha localização atual"}
              </Button>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rua / Logradouro</Label>
                  <Input 
                    value={addrForm.street} 
                    onChange={(e) => setAddrForm({...addrForm, street: e.target.value})} 
                    placeholder="Ex: Av. Paulista" 
                    className="rounded-xl h-12 font-bold" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Número</Label>
                    <Input 
                      value={addrForm.number} 
                      onChange={(e) => setAddrForm({...addrForm, number: e.target.value})} 
                      placeholder="123" 
                      className="rounded-xl h-12 font-bold" 
                      required 
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Bairro</Label>
                    <Input 
                      value={addrForm.neighborhood} 
                      onChange={(e) => setAddrForm({...addrForm, neighborhood: e.target.value})} 
                      placeholder="Ex: Centro" 
                      className="rounded-xl h-12 font-bold" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cidade</Label>
                    <Input 
                      value={addrForm.city} 
                      onChange={(e) => setAddrForm({...addrForm, city: e.target.value})} 
                      placeholder="Ex: São Paulo" 
                      className="rounded-xl h-12 font-bold" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Estado (UF)</Label>
                    <Input 
                      value={addrForm.state} 
                      onChange={(e) => setAddrForm({...addrForm, state: e.target.value})} 
                      placeholder="Ex: SP" 
                      maxLength={2}
                      className="rounded-xl h-12 font-bold uppercase" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ponto de Referência</Label>
                  <Input 
                    value={addrForm.reference} 
                    onChange={(e) => setAddrForm({...addrForm, reference: e.target.value})} 
                    placeholder="Ex: Próximo ao mercado central" 
                    className="rounded-xl h-12 font-bold" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Apelido (Ex: Casa, Trabalho)</Label>
                  <Input 
                    value={addrForm.nickname} 
                    onChange={(e) => setAddrForm({...addrForm, nickname: e.target.value})} 
                    className="rounded-xl h-12 font-bold" 
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 bg-slate-50 border-t flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddressModalOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1 shadow-xl shadow-orange-100">
                Salvar Endereço
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;