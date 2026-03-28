"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, Store, Truck, Users, Heart, 
  ArrowUpCircle, ArrowDownCircle, History,
  TrendingUp, CreditCard, Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("lojista");

  return (
    <AdminLayout>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Central de Carteiras</h1>
        <p className="text-slate-500 font-medium">Gestão de saldos, repasses e cashback do ecossistema KIFOME.</p>
      </header>

      <Tabs defaultValue="lojista" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList className="bg-white p-2 rounded-[2rem] border border-slate-100 h-auto flex flex-wrap gap-2 shadow-sm">
          <TabsTrigger value="lojista" className="rounded-2xl px-8 py-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
            <Store size={16} /> Lojistas
          </TabsTrigger>
          <TabsTrigger value="entregador" className="rounded-2xl px-8 py-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
            <Truck size={16} /> Entregadores
          </TabsTrigger>
          <TabsTrigger value="parceiro" className="rounded-2xl px-8 py-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
            <Users size={16} /> Parceiros
          </TabsTrigger>
          <TabsTrigger value="cliente" className="rounded-2xl px-8 py-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
            <Heart size={16} /> Clientes (Cashback)
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-8">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Wallet className="text-orange-500" size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Saldo Total em Custódia</p>
                <h2 className="text-4xl font-black">R$ 45.890,00</h2>
              </div>
              <div className="mt-10 space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                  <span className="text-[10px] font-black uppercase">Aguardando Repasse</span>
                  <span className="font-black text-orange-400">R$ 12.400</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                  <span className="text-[10px] font-black uppercase">Disponível</span>
                  <span className="font-black text-emerald-400">R$ 33.490</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <div className="relative w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input placeholder={`Buscar ${activeTab}...`} className="pl-12 h-14 bg-white rounded-2xl border-slate-200 font-bold" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiário</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo/Nível</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Atual</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Última Mov.</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Exemplo de Lojista */}
                    {activeTab === 'lojista' && (
                      <tr className="hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">Ki + Lanches</td>
                        <td className="px-8 py-6"><Badge className="bg-orange-100 text-orange-600 border-none text-[9px] font-black uppercase">Matriz</Badge></td>
                        <td className="px-8 py-6">
                          <span className="font-black text-emerald-600 text-sm">R$ 1.240,00</span>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Crédito (App deve)</p>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">Hoje, 14:30</td>
                        <td className="px-8 py-6 text-right">
                          <Button className="bg-slate-900 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase">Repassar</Button>
                        </td>
                      </tr>
                    )}
                    {/* Exemplo de Parceiro */}
                    {activeTab === 'parceiro' && (
                      <tr className="hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">Helio Junio</td>
                        <td className="px-8 py-6"><Badge className="bg-blue-100 text-blue-600 border-none text-[9px] font-black uppercase">Nível 1 (Master)</Badge></td>
                        <td className="px-8 py-6 font-black text-emerald-600 text-sm">R$ 450,00</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">Há 2 horas</td>
                        <td className="px-8 py-6 text-right">
                          <Button className="bg-slate-900 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase">Extrato</Button>
                        </td>
                      </tr>
                    )}
                    {/* Exemplo de Cliente (Cashback) */}
                    {activeTab === 'cliente' && (
                      <tr className="hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">Felipe Denis</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-purple-100 text-purple-600 border-none text-[8px] font-black uppercase w-fit">Ki + Lanches: R$ 12,00</Badge>
                            <Badge className="bg-purple-100 text-purple-600 border-none text-[8px] font-black uppercase w-fit">Pizzaria Bella: R$ 5,00</Badge>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-black text-purple-600 text-sm">R$ 17,00</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">Ontem</td>
                        <td className="px-8 py-6 text-right">
                          <Button className="bg-slate-900 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase">Ver Lojas</Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </AdminLayout>
  );
};

export default WalletPage;