"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Clock, CheckCircle2, 
  Truck, Utensils, Package, Star, Heart, 
  Smartphone, Navigation, Phone, MessageCircle,
  ChevronRight, Wallet, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { showSuccess } from "@/utils/toast";

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState({ app: 0, store: 0, driver: 0 });

  const loadOrder = () => {
    const allOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
    const found = allOrders.find((o: any) => o.id === id);
    if (found) {
      setOrder(found);
      if (found.status === 'DELIVERED' && !showRating) {
        setShowRating(true);
      }
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
    navigator.clipboard.writeText("entregador@pix.com");
    showSuccess("Chave PIX copiada!");
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <header className="bg-white px-6 py-6 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-100">
        <Button onClick={() => navigate("/delivery")} variant="ghost" size="icon" className="rounded-xl"><ArrowLeft size={24} /></Button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight">Acompanhar Pedido</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.id}</p>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Mapa Simbólico */}
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

        {/* Status Progress */}
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

        {/* PIN de Segurança */}
        {order.status === 'SHIPPING' && (
          <section className="bg-slate-900 p-8 rounded-[3rem] text-white text-center space-y-4 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">PIN de Segurança</p>
            <h2 className="text-5xl font-black tracking-[0.2em]">{order.pin}</h2>
            <p className="text-xs font-medium text-slate-400">Informe este código ao entregador para confirmar o recebimento.</p>
          </section>
        )}

        {/* Entregador */}
        {order.status === 'SHIPPING' && (
          <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <User size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seu Entregador</p>
                <p className="font-black text-slate-900 uppercase text-sm">Marcos Oliveira</p>
                <div className="flex items-center gap-1 text-orange-500 mt-1">
                  <Star size={12} className="fill-orange-500" />
                  <span className="text-[10px] font-black">4.9</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 text-slate-600"><Phone size={20} /></Button>
              <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 text-slate-600"><MessageCircle size={20} /></Button>
            </div>
          </section>
        )}

        {/* Modal de Avaliação */}
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

            {/* Gorjeta PIX */}
            <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 space-y-4">
              <div className="flex items-center gap-3">
                <Wallet className="text-orange-600" size={20} />
                <h4 className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Doar Gorjeta (PIX)</h4>
              </div>
              <p className="text-[10px] text-orange-700 font-medium">O valor vai 100% para o entregador Marcos Oliveira.</p>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-orange-200">
                <span className="text-xs font-black text-slate-900 flex-1 truncate">entregador@pix.com</span>
                <Button onClick={handleCopyPix} size="sm" className="bg-orange-600 text-white rounded-lg h-8 px-3 text-[9px] font-black uppercase">Copiar</Button>
              </div>
            </div>

            <Button onClick={() => { showSuccess("Obrigado pela avaliação!"); navigate("/delivery"); }} className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px]">Enviar Avaliação</Button>
          </section>
        )}
      </main>
    </div>
  );
};

export default OrderTrackingPage;