"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CheckCircle2, XCircle, Utensils, 
  Truck, MapPin, Phone, Hash, Navigation,
  AlertCircle, Play, Check, ArrowRight, ShieldCheck
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: string[];
  total: string;
  status: OrderStatus;
  time: string;
  pin?: string;
  driver?: string;
}

const INITIAL_ORDERS: Order[] = [
  { 
    id: "#1024", 
    customer: "Felipe Denis", 
    phone: "(88) 99926-6723", 
    address: "Rua Central, 123 - Centro", 
    items: ["2x X-Turbo Burguer", "1x Coca-Cola 2L"], 
    total: "R$ 58,90", 
    status: 'PENDING', 
    time: "2 min" 
  },
  { 
    id: "#1023", 
    customer: "Maria Souza", 
    phone: "(88) 98877-6655", 
    address: "Av. Brasil, 450 - Bairro Novo", 
    items: ["1x Pizza Calabresa G"], 
    total: "R$ 45,00", 
    status: 'PREPARING', 
    time: "15 min" 
  }
];

const OrderManagerPage = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        // Se estiver indo para entrega, gera um PIN aleatório
        const pin = newStatus === 'SHIPPING' ? Math.floor(1000 + Math.random() * 9000).toString() : order.pin;
        return { ...order, status: newStatus, pin };
      }
      return order;
    }));
    
    const statusLabels: Record<string, string> = {
      'PREPARING': 'Pedido aceito! Iniciando preparo.',
      'READY': 'Pedido pronto para despacho!',
      'SHIPPING': 'Pedido saiu para entrega!',
      'DELIVERED': 'Pedido entregue com sucesso!',
      'CANCELLED': 'Pedido recusado/cancelado.'
    };
    
    showSuccess(statusLabels[newStatus] || "Status atualizado");
  };

  const handleConfirmDelivery = () => {
    if (pinInput === selectedOrder?.pin) {
      updateStatus(selectedOrder.id, 'DELIVERED');
      setIsPinModalOpen(false);
      setPinInput("");
      setSelectedOrder(null);
    } else {
      showError("PIN incorreto! Verifique com o cliente.");
    }
  };

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="border-none shadow-md rounded-[2rem] overflow-hidden bg-white mb-4 group hover:ring-2 hover:ring-orange-500/20 transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-slate-900 text-lg">{order.id}</span>
              <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200 text-slate-400">
                {order.time}
              </Badge>
            </div>
            <p className="text-sm font-black text-slate-700 uppercase">{order.customer}</p>
          </div>
          <div className="text-right">
            <p className="font-black text-orange-600">{order.total}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pagamento: PIX</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <MapPin size={14} className="shrink-0 mt-0.5 text-orange-500" />
            <span className="font-medium">{order.address}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Itens do Pedido:</p>
            {order.items.map((item, i) => (
              <p key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div> {item}
              </p>
            ))}
          </div>
        </div>

        {/* Ações Baseadas no Status */}
        <div className="flex gap-2">
          {order.status === 'PENDING' && (
            <>
              <Button 
                onClick={() => updateStatus(order.id, 'PREPARING')}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] h-11"
              >
                <Check size={16} className="mr-2" /> Aceitar
              </Button>
              <Button 
                onClick={() => updateStatus(order.id, 'CANCELLED')}
                variant="ghost" 
                className="flex-1 text-red-500 hover:bg-red-50 rounded-xl font-black uppercase text-[10px] h-11"
              >
                <XCircle size={16} className="mr-2" /> Recusar
              </Button>
            </>
          )}

          {order.status === 'PREPARING' && (
            <Button 
              onClick={() => updateStatus(order.id, 'READY')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] h-11"
            >
              <Utensils size={16} className="mr-2" /> Marcar como Pronto
            </Button>
          )}

          {order.status === 'READY' && (
            <Button 
              onClick={() => updateStatus(order.id, 'SHIPPING')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] h-11"
            >
              <Truck size={16} className="mr-2" /> Despachar Pedido
            </Button>
          )}

          {order.status === 'SHIPPING' && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-blue-600 animate-pulse" />
                  <span className="text-[10px] font-black text-blue-700 uppercase">Em Rota</span>
                </div>
                <span className="text-[10px] font-black text-blue-900">PIN: {order.pin}</span>
              </div>
              <Button 
                onClick={() => { setSelectedOrder(order); setIsPinModalOpen(true); }}
                className="w-full bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase text-[10px] h-11"
              >
                <ShieldCheck size={16} className="mr-2" /> Confirmar Entrega (PIN)
              </Button>
            </div>
          )}

          {order.status === 'DELIVERED' && (
            <div className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-black uppercase">Pedido Concluído</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getOrdersByStatus = (status: OrderStatus) => orders.filter(o => o.status === status);

  return (
    <AdminLayout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestor de Pedidos</h1>
          <p className="text-slate-500 font-medium">Acompanhe o fluxo de produção e entrega em tempo real.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase">Sistema Online</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Coluna: Novos Pedidos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={16} className="text-orange-500" /> Novos ({getOrdersByStatus('PENDING').length})
            </h3>
          </div>
          <div className="min-h-[500px]">
            {getOrdersByStatus('PENDING').map(renderOrderCard)}
          </div>
        </div>

        {/* Coluna: Em Preparo */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Utensils size={16} className="text-blue-500" /> Preparando ({getOrdersByStatus('PREPARING').length})
            </h3>
          </div>
          <div className="min-h-[500px]">
            {getOrdersByStatus('PREPARING').map(renderOrderCard)}
          </div>
        </div>

        {/* Coluna: Prontos / Despacho */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Package size={16} className="text-purple-500" /> Prontos ({getOrdersByStatus('READY').length})
            </h3>
          </div>
          <div className="min-h-[500px]">
            {getOrdersByStatus('READY').map(renderOrderCard)}
          </div>
        </div>

        {/* Coluna: Em Entrega */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Truck size={16} className="text-emerald-500" /> Em Rota ({getOrdersByStatus('SHIPPING').length})
            </h3>
          </div>
          <div className="min-h-[500px]">
            {getOrdersByStatus('SHIPPING').map(renderOrderCard)}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação por PIN */}
      <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-orange-500" /> Confirmar Entrega
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase">
              Solicite o PIN de 4 dígitos ao cliente para finalizar o pedido {selectedOrder?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 space-y-6">
            <div className="flex justify-center">
              <Input 
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="0000"
                maxLength={4}
                className="w-40 h-20 text-center text-4xl font-black tracking-[0.5em] rounded-3xl border-2 border-slate-100 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-[10px] font-black text-orange-700 uppercase text-center">
                Dica: O PIN está disponível no app do cliente em "Acompanhar Pedido".
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleConfirmDelivery}
              className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Validar e Finalizar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Helper para ícone de pacote que faltou no import
const Package = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);

export default OrderManagerPage;