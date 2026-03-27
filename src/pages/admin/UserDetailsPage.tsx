"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, Shield, Wallet, History, ShoppingBag, MapPin, 
  ArrowLeft, RefreshCcw, ExternalLink, Plus, MapPinned
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");
  const [walletAmount, setWalletAmount] = useState("R$ 0,00");
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [userData] = useState({
    name: "Felipe Denis",
    email: "felipeacompanhamento@gmail.com",
    phone: "+55 (88) 99926-6723",
    role: "Cliente",
    wallet: "R$ 0,00",
    ip: "138.219.182.240"
  });

  const tabs = [
    { id: "detalhes", label: "Dados Pessoais", icon: <User size={18} /> },
    { id: "funcao", label: "Funções & Zonas", icon: <Shield size={18} /> },
    { id: "saldo", label: "Carteira (Saldo)", icon: <Wallet size={18} /> },
    { id: "transacoes", label: "Histórico Financeiro", icon: <History size={18} /> },
    { id: "pedidos", label: "Pedidos realizados", icon: <ShoppingBag size={18} /> },
    { id: "enderecos", label: "Endereços cadastrados", icon: <MapPin size={18} /> },
  ];

  const handleWalletReset = () => {
    setWalletAmount("R$ 0,00");
  };

  const handleWalletUpdate = () => {
    showSuccess(`Saldo atualizado com sucesso!`);
    handleWalletReset();
  };

  const formatCurrency = (val: string) => {
    let v = val.replace(/\D/g, "");
    if (!v) return "R$ 0,00";
    v = (parseInt(v) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return v;
  };

  return (
    <AdminLayout>
      <header className="mb-8">
        <button 
          onClick={() => navigate("/admin/users/all")} 
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Voltar para lista
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
          Perfil <span className="text-slate-300">/</span> {userData.name}
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden sticky top-28">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-8 py-5 text-sm font-bold transition-all border-l-4
                  ${activeTab === tab.id 
                    ? "bg-red-50 text-red-600 border-red-600" 
                    : "text-slate-500 border-transparent hover:bg-slate-50"}
                `}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 space-y-8">
          <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden">
            <CardContent className="p-10">
              {activeTab === "detalhes" && (
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Informações de Cadastro</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400">Nome Completo</Label>
                      <Input defaultValue={userData.name} className="h-12 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400">E-mail</Label>
                      <Input defaultValue={userData.email} className="h-12 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400">Telefone</Label>
                      <Input defaultValue={userData.phone} className="h-12 rounded-xl font-bold" />
                    </div>
                  </div>
                  <div className="pt-6 border-t flex justify-end">
                    <Button className="bg-slate-900 hover:bg-black text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] gap-2">
                      <RefreshCcw size={16} /> Salvar Alterações
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "funcao" && (
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Gerenciar Funções</h3>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Atual</p>
                      <div className="flex gap-2">
                        <Badge className="bg-emerald-500 text-white border-none rounded-lg px-3 py-1 font-black text-[10px] uppercase">Cliente</Badge>
                        {userData.role !== "Cliente" && (
                          <Badge className="bg-orange-500 text-white border-none rounded-lg px-3 py-1 font-black text-[10px] uppercase">{userData.role}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acesso Master</p>
                      <p className="text-sm font-black text-slate-900">HABILITADO</p>
                    </div>
                  </div>
                  <div className="max-w-md space-y-4">
                    <Label className="text-sm font-black text-slate-600">Atribuir Nova Função Adicional:</Label>
                    <Select defaultValue={userData.role}>
                      <SelectTrigger className="h-14 rounded-2xl font-black uppercase text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="Cliente" className="font-bold">Apenas Cliente</SelectItem>
                        <SelectItem value="Parceiro" className="font-bold">Parceiro</SelectItem>
                        <SelectItem value="Proprietário" className="font-bold">Proprietário de Loja</SelectItem>
                        <SelectItem value="Entregador" className="font-bold">Entregador</SelectItem>
                        <SelectItem value="Funcionário" className="font-bold">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-slate-400 font-bold uppercase italic">* O perfil de Cliente será mantido independentemente da função escolhida.</p>
                  </div>
                </div>
              )}

              {activeTab === "saldo" && (
                <div className="space-y-8">
                  <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2rem] flex items-center justify-between shadow-inner">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                          <Wallet size={32} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Saldo disponível</p>
                          <h4 className="text-3xl font-black text-orange-900">{userData.wallet}</h4>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="space-y-2">
                         <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Valor para adicionar:</Label>
                         <Input 
                           value={walletAmount} 
                           onChange={(e) => setWalletAmount(formatCurrency(e.target.value))} 
                           onClick={handleWalletReset}
                           className="h-14 rounded-2xl font-black text-xl text-center border-slate-200" 
                         />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descrição:</Label>
                         <Input placeholder="Motivo do ajuste..." className="h-14 rounded-2xl font-bold" />
                       </div>
                       <Button onClick={handleWalletUpdate} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl h-14 w-full font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-100">
                         Atualizar Saldo Agora
                       </Button>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ação Rápida</h5>
                       <p className="text-xs font-medium text-slate-500 mb-6">Ao clicar no campo de valor, o saldo volta automaticamente para R$ 0,00 para facilitar sua nova entrada.</p>
                       <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-red-500 border-red-100 hover:bg-red-50">Zerar Carteira</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "enderecos" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b pb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Endereços do Cliente</h3>
                    <Button onClick={() => setIsAddressOpen(true)} className="rounded-2xl font-black h-12 px-8 bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-100 uppercase text-[10px] tracking-widest">
                      <Plus size={18} className="mr-2" /> Novo Endereço
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-[2.5rem] border-slate-100 bg-slate-50/50 overflow-hidden group hover:border-orange-200 transition-all">
                      <div className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                            <MapPin size={24} />
                          </div>
                          <Badge className="bg-slate-900 text-white rounded-lg px-3 py-1 font-black text-[9px] uppercase">Principal</Badge>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase text-md">Rua Central, 500</p>
                          <p className="text-xs font-bold text-slate-500">Centro - Lavras/MG</p>
                          <p className="text-[10px] font-black text-slate-400 mt-2 uppercase">CEP: 37200-000</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <Button variant="outline" className="rounded-xl font-black text-[9px] uppercase h-10 bg-white">Editar</Button>
                           <Button variant="outline" className="rounded-xl font-black text-[9px] uppercase h-10 bg-white text-red-500 hover:text-red-600">Remover</Button>
                        </div>
                        <a 
                          href="https://www.google.com/maps" 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-black transition-all"
                        >
                          <ExternalLink size={14} /> Localizar no GPS
                        </a>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DIALOG DE NOVO ENDEREÇO */}
      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-slate-900 text-white">
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <MapPinned className="text-orange-500" /> Novo Endereço
            </DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">CEP</Label>
              <Input placeholder="00000-000" className="rounded-xl h-12 font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rua / Logradouro</Label>
              <Input placeholder="Ex: Av. Brasil" className="rounded-xl h-12 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Número</Label>
                <Input placeholder="Ex: 123" className="rounded-xl h-12 font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Bairro</Label>
                <Input placeholder="Ex: Centro" className="rounded-xl h-12 font-bold" />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t flex gap-3">
            <Button variant="ghost" onClick={() => setIsAddressOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
            <Button onClick={() => { showSuccess("Endereço adicionado!"); setIsAddressOpen(false); }} className="bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1">Salvar Endereço</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserDetailsPage;