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
  ArrowLeft, RefreshCcw, ExternalLink, Plus, MapPinned,
  ArrowUpCircle, ArrowDownCircle
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
  const [walletOperation, setWalletOperation] = useState<"add" | "subtract">("add");
  const [walletDescription, setWalletDescription] = useState("");
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "Felipe Denis",
    email: "felipeacompanhamento@gmail.com",
    phone: "+55 (88) 99926-6723",
    role: "Cliente",
    wallet: 0.00,
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
    const rawValue = walletAmount.replace(/[^\d,]/g, "").replace(",", ".");
    const numericValue = parseFloat(rawValue);

    if (isNaN(numericValue) || numericValue === 0) return;

    const newWallet = walletOperation === "add" 
      ? userData.wallet + numericValue 
      : Math.max(0, userData.wallet - numericValue);

    setUserData({ ...userData, wallet: newWallet });
    showSuccess(`Saldo ${walletOperation === 'add' ? 'adicionado' : 'abatido'} com sucesso!`);
    handleWalletReset();
    setWalletDescription("");
  };

  const handleSaveProfile = () => {
    showSuccess("Alterações no perfil salvas com sucesso!");
  };

  const handleSaveFunction = () => {
    showSuccess("Novas funções e permissões atribuídas!");
  };

  const formatCurrency = (val: string) => {
    let v = val.replace(/\D/g, "");
    if (!v) return "R$ 0,00";
    const numeric = parseInt(v) / 100;
    return numeric.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const displayWallet = userData.wallet.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

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

        <div className="flex-1 space-y-8 pb-20">
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
                    <Button onClick={handleSaveProfile} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-emerald-100">
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
                  <div className="pt-6 border-t flex justify-end">
                    <Button onClick={handleSaveFunction} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-emerald-100">
                      <RefreshCcw size={16} /> Salvar Alterações
                    </Button>
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
                          <h4 className="text-3xl font-black text-orange-900">{displayWallet}</h4>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="space-y-3">
                         <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Escolha a Operação:</Label>
                         <div className="flex gap-4">
                            <button 
                              onClick={() => setWalletOperation("add")}
                              className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest
                                ${walletOperation === 'add' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}
                              `}
                            >
                              <ArrowUpCircle size={18} /> Adicionar
                            </button>
                            <button 
                              onClick={() => setWalletOperation("subtract")}
                              className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest
                                ${walletOperation === 'subtract' ? 'bg-red-50 border-red-500 text-red-600 shadow-lg shadow-red-100' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}
                              `}
                            >
                              <ArrowDownCircle size={18} /> Abater
                            </button>
                         </div>
                       </div>

                       <div className="space-y-2">
                         <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Valor da Movimentação:</Label>
                         <Input 
                           value={walletAmount} 
                           onChange={(e) => setWalletAmount(formatCurrency(e.target.value))} 
                           onClick={handleWalletReset}
                           className="h-14 rounded-2xl font-black text-xl text-center border-slate-200" 
                         />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descrição / Motivo:</Label>
                         <Input 
                          placeholder="Ex: Cashback de indicação ou Estorno de pedido" 
                          value={walletDescription}
                          onChange={(e) => setWalletDescription(e.target.value)}
                          className="h-14 rounded-2xl font-bold" 
                         />
                       </div>
                       <Button 
                        onClick={handleWalletUpdate} 
                        className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all active:scale-95
                          ${walletOperation === 'add' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}
                        `}
                       >
                         {walletOperation === 'add' ? 'Adicionar Saldo Agora' : 'Confirmar Abatimento'}
                       </Button>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center text-center">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ação Rápida</h5>
                       <p className="text-xs font-bold text-slate-500 mb-8 leading-relaxed">
                        Ao clicar no campo de valor, o saldo volta automaticamente para R$ 0,00 para facilitar sua nova entrada.
                       </p>
                       <Button 
                        variant="outline" 
                        onClick={() => {
                          setWalletOperation("subtract");
                          setWalletAmount(formatCurrency(userData.wallet.toFixed(2)));
                          setWalletDescription("Zerar carteira administrativa");
                        }}
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-red-500 border-red-100 hover:bg-red-50"
                       >
                        Zerar Carteira Total
                       </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transacoes" && (
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Histórico de Movimentações</h3>
                  <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-100/50">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-6 py-4">
                            <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[9px]">CRÉDITO</Badge>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">Cadastro de Boas-vindas</td>
                          <td className="px-6 py-4 font-black text-slate-900">R$ 5,00</td>
                          <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">26/03/2026</td>
                        </tr>
                      </tbody>
                    </table>
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