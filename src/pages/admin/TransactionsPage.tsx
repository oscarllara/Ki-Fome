"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, ArrowDownLeft, DollarSign, Store, 
  Truck, Users, Percent, Search, Download, Filter,
  AlertCircle, CheckCircle2, Wallet, Heart
} from "lucide-react";
import { Input } from "@/components/ui/input";

const TransactionsPage = () => {
  const [tips, setTips] = useState<any[]>([]);

  useEffect(() => {
    const savedTips = JSON.parse(localStorage.getItem("kifome_tips_logs") || "[]");
    setTips(savedTips);
  }, []);

  const totalTips = tips.reduce((acc, t) => acc + t.amount, 0);

  return (
    <AdminLayout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Fluxo Financeiro</h1>
          <p className="text-slate-500 font-medium">Conciliação de vendas, comissões e gorjetas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold h-12 gap-2 border-slate-200">
            <Download size={18} /> Exportar Relatório
          </Button>
        </div>
      </header>

      <Tabs defaultValue="vendas" className="space-y-8">
        <TabsList className="bg-white p-2 rounded-2xl border border-slate-100 h-auto flex gap-2 shadow-sm w-fit">
          <TabsTrigger value="vendas" className="rounded-xl px-6 py-3 font-black uppercase text-[10px] data-[state=active]:bg-slate-900 data-[state=active]:text-white">Vendas & Comissões</TabsTrigger>
          <TabsTrigger value="gorjetas" className="rounded-xl px-6 py-3 font-black uppercase text-[10px] data-[state=active]:bg-orange-600 data-[state=active]:text-white">Relatório de Gorjetas</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-sm rounded-[2rem] bg-red-50 border-red-100">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white"><ArrowDownLeft size={20} /></div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Lojas Devem ao App</span>
                </div>
                <h3 className="text-3xl font-black text-red-700">R$ 1.450,00</h3>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[2rem] bg-emerald-50 border-emerald-100">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><ArrowUpRight size={20} /></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">App Deve às Lojas</span>
                </div>
                <h3 className="text-3xl font-black text-emerald-700">R$ 3.890,00</h3>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[2rem] bg-slate-900 text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white"><Percent size={20} /></div>
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Comissão Acumulada</span>
                </div>
                <h3 className="text-3xl font-black">R$ 540,00</h3>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gorjetas" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm rounded-[2rem] bg-orange-600 text-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart size={24} className="fill-white" />
                <span className="text-[10px] font-black uppercase tracking-widest">Total de Gorjetas</span>
              </div>
              <h3 className="text-4xl font-black">{totalTips.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h3>
              <p className="text-[9px] font-bold uppercase mt-2 opacity-60">Valores enviados via PIX direto</p>
            </Card>

            <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Logs de Gorjetas Registradas</h4>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <Input placeholder="Buscar entregador..." className="pl-9 h-10 rounded-xl text-xs" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entregador</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data/Hora</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {tips.length > 0 ? tips.map((tip) => (
                      <tr key={tip.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 font-black text-slate-900 uppercase text-xs">{tip.driverName}</td>
                        <td className="px-8 py-5 font-bold text-slate-400 text-xs">{tip.orderId}</td>
                        <td className="px-8 py-5 font-bold text-slate-600 text-xs">{tip.customer}</td>
                        <td className="px-8 py-5 text-[10px] font-bold text-slate-400">{tip.date}</td>
                        <td className="px-8 py-5 text-right font-black text-orange-600">
                          {tip.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Nenhuma gorjeta registrada ainda</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default TransactionsPage;