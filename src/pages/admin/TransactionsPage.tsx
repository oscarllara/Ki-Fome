"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, ArrowDownLeft, DollarSign, Store, 
  Truck, Users, Percent, Search, Download, Filter,
  AlertCircle, CheckCircle2, Wallet
} from "lucide-react";
import { Input } from "@/components/ui/input";

const MOCK_TRANSACTIONS = [
  { 
    id: "#1234", 
    store: "Ki + Lanches", 
    total: 100.00, 
    deliveryFee: 10.00,
    paymentMethod: "OFFLINE", // Loja recebeu
    appCommission: 10.00, // 10%
    partnerCut: 2.00, // Parte do parceiro
    status: "Pendente",
    date: "2024-03-28 19:30"
  },
  { 
    id: "#1235", 
    store: "Pizzaria Bella", 
    total: 100.00, 
    deliveryFee: 10.00,
    paymentMethod: "ONLINE", // App recebeu
    appCommission: 10.00,
    partnerCut: 2.00,
    status: "Concluído",
    date: "2024-03-28 20:15"
  }
];

const TransactionsPage = () => {
  return (
    <AdminLayout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Fluxo de Transações</h1>
          <p className="text-slate-500 font-medium">Conciliação financeira entre Lojas, Entregadores e App.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold h-12 gap-2 border-slate-200">
            <Download size={18} /> Exportar Razão
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="border-none shadow-sm rounded-[2rem] bg-red-50 border-red-100">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
                <ArrowDownLeft size={20} />
              </div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Lojas Devem ao App</span>
            </div>
            <h3 className="text-3xl font-black text-red-700">R$ 1.450,00</h3>
            <p className="text-xs font-bold text-red-400 mt-2 uppercase">Pagamentos feitos em dinheiro/maquininha</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-emerald-50 border-emerald-100">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <ArrowUpRight size={20} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">App Deve às Lojas</span>
            </div>
            <h3 className="text-3xl font-black text-emerald-700">R$ 3.890,00</h3>
            <p className="text-xs font-bold text-emerald-400 mt-2 uppercase">Pagamentos feitos via PIX/Cartão Online</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-slate-900 text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                <Percent size={20} />
              </div>
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Comissão Acumulada</span>
            </div>
            <h3 className="text-3xl font-black">R$ 540,00</h3>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Lucro líquido do App (Pós-Parceiros)</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Buscar por pedido ou loja..." className="pl-12 h-14 bg-white rounded-2xl border-slate-200 font-bold" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-14 rounded-2xl font-bold gap-2 border-slate-200">
              <Filter size={18} /> Filtros Avançados
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loja</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagamento</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Comissão (10%)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Líquido</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TRANSACTIONS.map((t) => {
                const isOnline = t.paymentMethod === "ONLINE";
                const netValue = isOnline ? (t.total - t.appCommission) : -t.appCommission;
                
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900 uppercase text-xs">{t.id}</span>
                      <p className="text-[9px] text-slate-400 font-bold">{t.date}</p>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-700 uppercase text-xs">{t.store}</td>
                    <td className="px-8 py-6 font-black text-slate-900">R$ {t.total.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <Badge className={`rounded-lg text-[9px] font-black uppercase tracking-widest border-none ${isOnline ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {isOnline ? 'Online (App)' : 'Offline (Loja)'}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">R$ {t.appCommission.toFixed(2)}</span>
                        <span className="text-[9px] text-orange-600 font-bold">Parceiro: R$ {t.partnerCut.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 font-black text-sm ${netValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {netValue > 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                        R$ {Math.abs(netValue).toFixed(2)}
                        <span className="text-[9px] uppercase ml-1">
                          {netValue > 0 ? 'App deve Loja' : 'Loja deve App'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Badge className="bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase">{t.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TransactionsPage;