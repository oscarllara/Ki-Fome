"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Clock, CheckCircle2, 
  Truck, Utensils, Package, Star, Heart, 
  Smartphone, Navigation, Phone, MessageCircle,
  ChevronRight, Wallet, Copy, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState({ app: 0, store: 0, driver: 0 });
  const [tipAmount, setTipAmount] = useState("");

  const loadOrder = () => {
    try {
      const savedOrders = localStorage.getItem("kifome_orders");
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
      const found = allOrders.find((o: any) => o.id === id);
      if (found) {
        setOrder(found);
        if (found.status === 'DELIVERED' && !showRating) {
          setShowRating(true);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar pedido:", e);
    }
  };

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const getStatusStep = () => {
    const steps: any = { 'PENDING': 1, 'PREPARING': 2, 'READY': 3, 'SHIPPING': 4, 'DELIVERED': 5 };
    return steps[order?.status] || 0;
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText("marcos@pix.com");
    showSuccess("Chave PIX do Marcos copiada!");
  };

  const handleConfirmTip = () => {
    if (!tipAmount || parseFloat(tipAmount.replace(",", ".")) <= 0) {
      showError("Informe um valor válido.");
      return;
    }

    const tipLog = {
      id: Date.now(),
      orderId: order?.id,
      driverName: "Marcos Oliveira",
      amount: parseFloat(tipAmount.replace(",", ".")),
      date: new Date().toLocaleString("pt-BR"),
      customer: "Felipe Denis"
    };

    try {
      const savedTips = localStorage.getItem("kifome_tips_logs");
      const existingTips = savedTips ? JSON.parse(savedTips) : [];
      localStorage.setItem("kifome_tips_logs", JSON.stringify([tipLog, ...existingTips]));
      showSuccess("Gorjeta registrada no sistema! Obrigado.");
      setTipAmount("");
    } catch (e) {
      showError("Erro ao salvar gorjeta.");
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Clock className="mx-auto text-slate-300 animate-spin" size={48} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <header className="bg-white px-6 py-6 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-100">
        <Button onClick={() => navigate("/delivery")} variant="ghost" size="icon" className="rounded-xl">
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight">Acompanhar Pedido</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.id}</p>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="w-full h-48 bg-slate-200 rounded-[3rem] relative overflow-hidden shadow-inner border-4 border-white">
          <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800" className="w-full h-full object-cover opacity-40 grayscale" alt="Map" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce">
                <Truck size={24} />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-600 rotate-45"></div>
            </div>
          </div>
        </div>

        <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Status do Pedido</h3>
            <Badge className="bg-orange-100 text-orange-600 border-none font-black uppercase text-[9px]">
              {order.status === 'PENDING' && 'Enviado'}
              {order.status === 'PREPARING' && 'Na Cozinha'}
              {order.status === 'READY' && 'Pronto para Coleta'}
              {order.status === 'SHIPPING' && 'Em Rota'}
              {order.status === 'DELIVERED' && 'Entregue'}
            </Badge>
          </div>

          <div className="relative pt-4">
            <Progress value={(getStatusStep() / 5) * 100} className="h-2 bg-slate-100" />
            <div className="flex justify-between mt-4">
              <div className={`flex flex-col items-center gap-2 ${getStatusStep() >= 1 ? 'text-orange-600' : 'text-slate-300'}`}>
                <Package size={20} />
                <span className="text-[8px] font-black uppercase">Enviado</span>
              </div>
              <div className={`flex flex-col items-center gap-2 ${getStatusStep() >= 2 ? 'text-orange-600' : 'text-slate-300'}`}>
                <Utensils size={20} />
                <span className="text-[8px] font-black uppercase">Preparo</span>
              </div>
              <div className={`flex flex-col items-center gap-2 ${getStatusStep() >= 4 ? 'text-orange-600' : 'text-slate-300'}`}>
                <Truck size={20} />
                <span className="text-[8px] font-black uppercase">Rota</span>
              </div>
              <div className={`flex flex-col items-center gap-2 ${getStatusStep() >= 5 ? 'text-orange-600' : 'text-slate-300'}`}>
                <CheckCircle2 size={20} />
                <span className="text-[8px] font-black uppercase">Fim</span>
              </div>
            </div>
          </div>
        </section>

        {order.status === 'SHIPPING' && (
          <section className="bg-slate-900 p-8 rounded-[3rem] text-white text-center space-y-4 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">PIN de Segurança</p>
            <h2 className="text-5xl font-black tracking-[0.2em]">{order.pin}</h2>
            <p className="text-xs font-medium text-slate-400">Informe este código ao entregador para confirmar o recebimento.</p>
          </section>
        )}

        {showRating && (
          <section className="bg-white p-10 rounded-[3rem] border-2 border-orange-100 shadow-2xl space-y-8 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pedido Entregue!</h2>
              <p className="text-sm font-medium text-slate-500 mt-2">Como foi sua experiência hoje?</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O Aplicativo</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={20} onClick={() => setRating({...rating, app: s})} className={`cursor-pointer ${rating.app >= s ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />)}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O Restaurante</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={20} onClick={() => setRating({...rating, store: s})} className={`cursor-pointer ${rating.store >= s ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />)}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O Entregador</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={20} onClick={() => setRating({...rating, driver: s})} className={`cursor-pointer ${rating.driver >= s ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />)}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 space-y-6">
              <div className="flex items-center gap-3">
                <Wallet className="text-orange-600" size={20} />
                <h4 className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Doar Gorjeta (PIX Direto)</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-white p-4 rounded-2xl border border-orange-200">
                  <span className="text-xs font-black text-slate-900 flex-1 truncate">marcos@pix.com</span>
                  <Button onClick={handleCopyPix} size="sm" className="bg-orange-600 text-white rounded-xl h-10 px-4 text-[9px] font-black uppercase">Copiar Chave</Button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-orange-700 uppercase ml-1">Quanto você enviou?</p>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="R$ 0,00" 
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value)}
                      className="rounded-xl h-12 bg-white border-orange-100 font-black"
                    />
                    <Button onClick={handleConfirmTip} className="bg-slate-900 text-white rounded-xl h-12 px-4"><Send size={18} /></Button>
                  </div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase italic">*Isso ajuda o gestor a premiar os melhores entregadores.</p>
                </div>
              </div>
            </div>

            <Button onClick={() => { showSuccess("Obrigado pela avaliação!"); navigate("/delivery"); }} className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px]">Finalizar e Voltar</Button>
          </section>
        )}
      </main>
    </div>
  );
};

export default OrderTrackingPage;