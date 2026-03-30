"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, CreditCard, Wallet, 
  Banknote, ChevronRight, CheckCircle2, Loader2,
  ShoppingBag, Clock, Percent, Plus, Minus, Trash2, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [address, setAddress] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedAddr = localStorage.getItem("kifome_user_addresses");
    if (savedAddr) {
      const parsed = JSON.parse(savedAddr);
      setAddress(parsed.find((a: any) => a.isDefault) || parsed[0]);
    }

    const savedCart = localStorage.getItem("kifome_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

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

  const handlePlaceOrder = () => {
    if (!address) {
      showError("Selecione um endereço de entrega.");
      return;
    }
    if (cart.length === 0) {
      showError("Seu carrinho está vazio.");
      return;
    }

    setLoading(true);
    
    // Simulação de Mercado Pago se for Online
    if (paymentMethod === 'online') {
      showSuccess("Redirecionando para o Mercado Pago...");
      // Aqui entraria o SDK do Mercado Pago
    }

    const newOrder = {
      id: `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customer: "Felipe Denis",
      phone: "(88) 99926-6723",
      address: `${address.street}, ${address.number} - ${address.neighborhood}`,
      items: cart.map(i => `${i.qty}x ${i.name}`),
      total: `R$ ${total.toFixed(2)}`,
      status: 'PENDING',
      paymentMethod: paymentMethod.toUpperCase(),
      time: "Agora",
      createdAt: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
    localStorage.setItem("kifome_orders", JSON.stringify([newOrder, ...existingOrders]));

    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("kifome_cart");
      showSuccess("Pedido enviado com sucesso!");
      navigate("/delivery");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      <header className="bg-white px-6 py-6 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-100">
        <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="rounded-xl"><ArrowLeft size={24} /></Button>
        <h1 className="text-xl font-black uppercase tracking-tight">Finalizar Pedido</h1>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Itens do Carrinho */}
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

        {/* Endereço */}
        <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço de Entrega</h3>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0"><MapPin size={24} /></div>
            <div>
              <p className="font-black text-slate-900 uppercase text-sm">{address?.nickname || "Selecione um endereço"}</p>
              <p className="text-xs text-slate-500 font-medium">{address ? `${address.street}, ${address.number}` : "Nenhum endereço selecionado"}</p>
            </div>
          </div>
        </section>

        {/* Pagamento */}
        <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Forma de Pagamento</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'pix', name: 'PIX (Automático)', icon: <Wallet size={20} />, color: 'text-emerald-600' },
              { id: 'online', name: 'Cartão Online (Mercado Pago)', icon: <Smartphone size={20} />, color: 'text-blue-500' },
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

        {/* Resumo */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between text-sm font-bold text-slate-500"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm font-bold text-emerald-600"><span>Taxa de Entrega</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
          <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
            <span className="text-lg font-black text-slate-900 uppercase">Total</span>
            <span className="text-2xl font-black text-orange-600">R$ {total.toFixed(2)}</span>
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 left-6 right-6 max-w-2xl mx-auto z-50">
        <Button onClick={handlePlaceOrder} disabled={loading || cart.length === 0} className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] shadow-2xl font-black uppercase tracking-widest text-[11px] flex gap-3">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />}
          {loading ? "Processando..." : "Finalizar Pedido"}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;