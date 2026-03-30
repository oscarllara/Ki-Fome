"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CheckCircle2, XCircle, Utensils, 
  Truck, MapPin, Phone, Navigation,
  AlertCircle, Check, ShieldCheck, Package, RefreshCw
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
  createdAt?: string;
}

const OrderManagerPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("kifome_orders") || "[]");
    setOrders(savedOrders);
  };

  useEffect(() => {
    loadOrders();
    // Polling para simular tempo real (a cada 5 segundos)
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const pin = newStatus === 'SHIPPING' ? Math.floor(1000 + Math.random() * 9000).toString() : order.pin;
        return { ...order, status: newStatus, pin };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem("kifome_orders", JSON.stringify(updatedOrders));
    
    const statusLabels: Record<string, string> = {
      'PREPARING': 'Pedido aceito!',
      'READY': 'Pedido pronto!',
      'SHIPPING': 'Saiu para entrega!',
      'DELIVERED': 'Entregue!',
      'CANCELLED': 'Cancelado.'
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
      showError("PIN incorreto!");
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
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <MapPin size={14} className="shrink-0 mt-0.5 text-orange-500" />
            <span className="font-medium">{order.address}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {order.items.map((item, i) => (
              <p key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div> {item}
              </p>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {order.status === 'PENDING' && (
            <>
              <Button onClick={() => updateStatus(order.id, 'PREPARING')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] h-11">
                <Check size={16} className="mr-2" /> Aceitar
              </Button>
              <Button onClick={() => updateStatus(order.id, 'CANCELLED')} variant="ghost" className="flex-1 text-red-500 hover:bg-red-50 rounded-xl font-black uppercase text-[10px] h-11">
                <XCircle size={16} className="mr-2" /> Recusar
              </Button>
            </>
          )}

          {order.status === 'PREPARING' && (
            <Button onClick={() => updateStatus(order.id, 'READY')} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] h-11">
              <Utensils size={16} className="mr-2" /> Pronto
            </Button>
          )}

          {order.status === 'READY' && (
            <Button onClick={() => updateStatus(order.id, 'SHIPPING')} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] h-11">
              <Truck size={16} className="mr-2" /> Despachar
            </Button>
          )}

          {order.status === 'SHIPPING' && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
                <span className="text-[10px] font-black text-blue-700 uppercase">Em Rota</span>
                <span className="text-[10px] font-black text-blue-900">PIN: {order.pin}</span>
              </div>
              <Button onClick={() => { setSelectedOrder(order); setIsPinModalOpen(true); }} className="w-full bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase text-[10px] h-11">
                <ShieldCheck size={16} className="mr-2" /> Confirmar PIN
              </Button>
            </div>
          )}

          {order.status === 'DELIVERED' && (
            <div className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-black uppercase">Concluído</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getOrdersByStatus = (status: OrderStatus) => orders.filter(o => o.status === status);

  return (
    <AdminLayout>
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestor de Pedidos</h1>
        <Button onClick={loadOrders} variant="outline" className="rounded-xl gap-2">
          <RefreshCw size={18} /> Atualizar
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-500" /> Novos ({getOrdersByStatus('PENDING').length})
          </h3>
          {getOrdersByStatus('PENDING').map(renderOrderCard)}
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Utensils size={16} className="text-blue-500" /> Preparando ({getOrdersByStatus('PREPARING').length})
          </h3>
          {getOrdersByStatus('PREPARING').map(renderOrderCard)}
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Package size={16} className="text-purple-500" /> Prontos ({getOrdersByStatus('READY').length})
          </h3>
          {getOrdersByStatus('READY').map(renderOrderCard)}
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Truck size={16} className="text-emerald-500" /> Em Rota ({getOrdersByStatus('SHIPPING').length})
          </h3>
          {getOrdersByStatus('SHIPPING').map(renderOrderCard)}
        </div>
      </div>

      <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Confirmar Entrega</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase">Solicite o PIN ao cliente.</DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <Input value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="0000" maxLength={4} className="w-full h-16 text-center text-3xl font-black rounded-2xl" />
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmDelivery} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase">Validar PIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrderManagerPage;