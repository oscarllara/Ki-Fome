"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, Shield, Wallet, History, ShoppingBag, MapPin, 
  ArrowLeft, Lock, Trash2, Plus, Search, ExternalLink, RefreshCcw
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");
  const [cepLoading, setCepLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "Felipe Denis",
    email: "felipeacompanhamento@gmail.com",
    phone: "+5588999266723",
    role: "Customer",
    wallet: 0,
    ip: "138.219.182.240"
  });

  const tabs = [
    { id: "detalhes", label: "Detalhes do Usuário", icon: <User size={18} /> },
    { id: "funcao", label: "Função do Usuário & Zona", icon: <Shield size={18} /> },
    { id: "saldo", label: "Saldo da Carteira", icon: <Wallet size={18} /> },
    { id: "transacoes", label: "Transações da Carteira", icon: <History size={18} /> },
    { id: "pedidos", label: "Pedidos", icon: <ShoppingBag size={18} /> },
    { id: "enderecos", label: "Endereços do Usuário", icon: <MapPin size={18} /> },
  ];

  const handleFetchCep = async (cep: string) => {
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        showError("CEP não encontrado.");
      } else {
        showSuccess("Endereço localizado!");
        // Aqui atualizaria o estado do endereço
      }
    } catch (err) {
      showError("Erro ao buscar CEP.");
    } finally {
      setCepLoading(false);
    }
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
          Editando <span className="text-slate-400">/</span> {userData.name}
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Navegação das Abas */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-28">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4
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

        {/* Área de Conteúdo */}
        <div className="flex-1 space-y-8">
          <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10">
              {activeTab === "detalhes" && (
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Detalhes do Usuário</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">Nome:</Label>
                        <Input defaultValue={userData.name} className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">E-mail:</Label>
                        <Input defaultValue={userData.email} className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">Celular:</Label>
                        <Input defaultValue={userData.phone} className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">Senha:</Label>
                        <div className="relative">
                          <Input type="password" placeholder="Digite a senha (mínimo 6 caracteres)" className="h-12 rounded-xl pr-12" />
                          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-400">Mostrar</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <Button variant="destructive" className="bg-red-500 hover:bg-red-600 rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">
                          Banir Usuário
                        </Button>
                        <p className="text-[10px] text-slate-400 font-medium mt-4">IP do usuário usado durante o registro: <span className="font-bold text-slate-600">{userData.ip}</span></p>
                      </div>
                      <Button className="bg-black hover:bg-slate-800 text-white rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] gap-2">
                        <RefreshCcw size={16} /> Atualizar usuário
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "funcao" && (
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Gerenciamento de Funções</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-8">
                      <span className="text-sm font-bold text-slate-600">Função Atual:</span>
                      <Badge className="bg-emerald-500 text-white border-none rounded-lg px-4 py-1.5 font-black uppercase text-[10px]">{userData.role}</Badge>
                    </div>
                    <div className="max-w-md space-y-2">
                      <Label className="text-sm font-bold text-slate-600">Atribuir Função:</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Selecione uma nova função..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Customer">Cliente (Customer)</SelectItem>
                          <SelectItem value="StoreOwner">Proprietário (Store Owner)</SelectItem>
                          <SelectItem value="DeliveryGuy">Entregador (Delivery Guy)</SelectItem>
                          <SelectItem value="Staff">Funcionário (Staff)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[9px] text-slate-400 font-medium italic">* As funções antigas serão revogadas e as novas serão aplicadas imediatamente.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "saldo" && (
                <div className="space-y-8">
                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                     <span className="font-black text-slate-900 text-sm">Carteira Saldo: R$ {userData.wallet}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-2">
                       <button className="w-full text-left bg-red-600 text-white p-4 rounded-xl font-black text-sm">Adicionar dinheiro</button>
                       <button className="w-full text-left bg-slate-50 text-slate-400 p-4 rounded-xl font-black text-sm">Deduzir dinheiro</button>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                       <div className="space-y-2">
                         <Label className="text-xs font-bold text-slate-600">Adicionar dinheiro:</Label>
                         <Input placeholder="Valor em R$" className="h-12 rounded-xl" />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-xs font-bold text-slate-600">Mensagem:</Label>
                         <Input placeholder="Descrição ou Mensagem Resumida" className="h-12 rounded-xl" />
                       </div>
                       <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 w-full md:w-auto px-8 font-black uppercase text-[10px]">
                         Atualizar saldo
                       </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "enderecos" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Endereços Cadastrados</h3>
                    <Button variant="outline" className="rounded-xl font-bold h-10 border-slate-200">
                      <Plus size={16} className="mr-2" /> Novo Endereço
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-[2rem] border-slate-100 bg-slate-50/30 overflow-hidden group">
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                            <MapPin size={20} />
                          </div>
                          <Badge className="bg-slate-900 text-white rounded-lg">Principal</Badge>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase text-sm">Rua Central, 500</p>
                          <p className="text-xs font-medium text-slate-500">Centro - Lavras/MG</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">CEP: 37200-000</p>
                        </div>
                        <div className="flex gap-2 pt-4">
                           <Button size="sm" variant="outline" className="flex-1 rounded-xl font-bold text-[10px] uppercase h-9">Editar</Button>
                           <Button size="sm" variant="outline" className="flex-1 rounded-xl font-bold text-[10px] uppercase h-9 text-red-500 hover:text-red-600">Excluir</Button>
                        </div>
                        <a 
                          href="https://www.google.com/maps?q=-21.2427,-44.9992" 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink size={14} /> Ver no Google Maps
                        </a>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Pedidos e Transações teriam estruturas de lista similares */}
              {(activeTab === "pedidos" || activeTab === "transacoes") && (
                 <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <ShoppingBag size={48} className="mb-4 text-slate-300" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Nenhum registro encontrado</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default UserDetailsPage;