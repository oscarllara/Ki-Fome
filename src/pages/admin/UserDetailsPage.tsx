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
  ArrowLeft, Plus, MapPinned, ArrowUpCircle, ArrowDownCircle, 
  Trash2, Edit2, CheckCircle2, Ban, Eye, EyeOff, Save,
  TrendingUp, CreditCard, Calendar, RefreshCw, AlertTriangle
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showPass, setShowPass] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  
  // Carteira
  const [walletAmount, setWalletAmount] = useState("R$ 0,00");
  const [walletOperation, setWalletOperation] = useState<"add" | "subtract">("add");
  const [walletDescription, setWalletDescription] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  // Endereços
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressFormData, setAddressFormData] = useState({ 
    id: 0, nickname: "", zip: "", street: "", number: "", neighborhood: "", city: "", state: "", complement: ""
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem("kifome_users");
    const savedTransactions = localStorage.getItem(`kifome_trans_${id}`);
    const savedAddresses = localStorage.getItem(`kifome_addr_${id}`);
    
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      setUsers(parsed);
      const found = parsed.find((u: any) => u.id === Number(id));
      if (found) {
        setUser({
          ...found,
          status: found.status || "Ativo",
          permissions: found.permissions || ["order", "coupons"],
          password: found.password || "123456"
        });
      }
    }

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
  }, [id]);

  const saveToLocal = (updatedUser: any) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem("kifome_users", JSON.stringify(updatedUsers));
  };

  const handleUpdateUser = () => {
    saveToLocal(user);
    showSuccess("Perfil atualizado com sucesso!");
  };

  const handleResetPassword = () => {
    const tempPass = "123456";
    const updatedUser = { ...user, password: tempPass };
    setUser(updatedUser);
    saveToLocal(updatedUser);
    showSuccess(`Senha resetada! Nova senha: ${tempPass}`);
  };

  const handleConfirmBan = () => {
    const newStatus = user.status === "Ativo" ? "Banido" : "Ativo";
    const updatedUser = { ...user, status: newStatus };
    setUser(updatedUser);
    saveToLocal(updatedUser);
    setIsBanModalOpen(false);
    showSuccess(newStatus === "Banido" ? "Usuário banido do sistema!" : "Usuário reativado!");
  };

  const handleWalletAmountChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setWalletAmount("R$ 0,00");
      return;
    }
    const amount = (parseInt(digits) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setWalletAmount(amount);
  };

  const handleWalletUpdate = () => {
    const rawValue = walletAmount.replace(/[^\d,]/g, "").replace(",", ".");
    const numericValue = parseFloat(rawValue);
    if (isNaN(numericValue) || numericValue === 0) {
      showError("Informe um valor válido.");
      return;
    }

    const newWallet = walletOperation === "add" ? user.wallet + numericValue : Math.max(0, user.wallet - numericValue);
    const updatedUser = { ...user, wallet: newWallet };
    
    const newTrans = {
      id: Date.now(),
      type: walletOperation === "add" ? "CRÉDITO" : "DÉBITO",
      amount: numericValue,
      description: walletDescription || (walletOperation === "add" ? "Ajuste manual de saldo" : "Débito manual"),
      date: new Date().toLocaleDateString("pt-BR")
    };
    const updatedTrans = [newTrans, ...transactions];
    setTransactions(updatedTrans);
    localStorage.setItem(`kifome_trans_${id}`, JSON.stringify(updatedTrans));

    setUser(updatedUser);
    saveToLocal(updatedUser);
    showSuccess(`Carteira atualizada!`);
    setWalletAmount("R$ 0,00");
    setWalletDescription("");
  };

  const togglePermission = (perm: string) => {
    const currentPerms = user.permissions || [];
    const newPerms = currentPerms.includes(perm) 
      ? currentPerms.filter((p: string) => p !== perm)
      : [...currentPerms, perm];
    setUser({ ...user, permissions: newPerms });
  };

  const tabs = [
    { id: "detalhes", label: "Dados Pessoais", icon: <User size={18} /> },
    { id: "funcao", label: "Funções & Acessos", icon: <Shield size={18} /> },
    { id: "financeiro", label: "Gestão Financeira", icon: <Wallet size={18} /> },
    { id: "pedidos", label: "Histórico de Pedidos", icon: <ShoppingBag size={18} /> },
    { id: "enderecos", label: "Endereços", icon: <MapPin size={18} /> },
  ];

  if (!user) return null;

  return (
    <AdminLayout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/users/all")}
            className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-orange-100 text-orange-600 border-none text-[9px] font-black uppercase px-2">ID #{user.id}</Badge>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gerenciar Perfil</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{user.name}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleResetPassword}
            className="rounded-2xl h-12 px-6 font-bold border-slate-200 text-slate-500 hover:bg-slate-50 gap-2"
          >
            <RefreshCw size={16} /> Resetar Senha
          </Button>
          <Button onClick={handleUpdateUser} className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100">
            <Save size={18} className="mr-2" /> Salvar Alterações
          </Button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 pb-20">
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 space-y-2 sticky top-28">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-tight transition-all ${activeTab === tab.id ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === tab.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
            
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Button 
                variant="ghost" 
                onClick={() => setIsBanModalOpen(true)}
                className={`w-full justify-start gap-4 px-6 py-4 h-auto rounded-[1.5rem] font-black uppercase tracking-tight text-sm transition-colors ${user.status === 'Ativo' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${user.status === 'Ativo' ? 'bg-red-100' : 'bg-emerald-100'}`}>
                  {user.status === 'Ativo' ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                </div>
                {user.status === 'Ativo' ? 'Banir Usuário' : 'Reativar Usuário'}
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden bg-white">
            <CardContent className="p-12">
              {activeTab === "detalhes" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600"><User size={24} /></div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Informações Pessoais</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo</Label>
                      <Input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg focus:ring-2 focus:ring-orange-500/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail de Acesso</Label>
                      <Input value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg focus:ring-2 focus:ring-orange-500/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp / Celular</Label>
                      <Input value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg focus:ring-2 focus:ring-orange-500/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha Atual</Label>
                      <div className="relative">
                        <Input 
                          type={showPass ? "text" : "password"} 
                          value={user.password}
                          readOnly
                          className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg pr-14 focus:ring-2 focus:ring-orange-500/20" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-600 transition-colors"
                        >
                          {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><Shield size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Segurança</p>
                        <p className="text-xs font-bold text-slate-600">Status da conta: <span className={`font-black ${user.status === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>{user.status.toUpperCase()}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsBanModalOpen(true)}
                      className={`px-4 py-1.5 rounded-full font-black uppercase text-[9px] transition-all active:scale-95 ${user.status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                      {user.status === 'Ativo' ? 'Banir' : 'Reativar'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "funcao" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Shield size={24} /></div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nível de Acesso</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Função no Sistema</Label>
                        <Select value={user.role} onValueChange={(val) => setUser({...user, role: val})}>
                          <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-black uppercase text-[11px] tracking-widest">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="Cliente" className="font-black uppercase text-[10px]">Cliente (Padrão)</SelectItem>
                            <SelectItem value="Parceiro" className="font-black uppercase text-[10px]">Parceiro Comercial</SelectItem>
                            <SelectItem value="Proprietário" className="font-black uppercase text-[10px]">Dono de Loja</SelectItem>
                            <SelectItem value="Entregador" className="font-black uppercase text-[10px]">Entregador</SelectItem>
                            <SelectItem value="Funcionário" className="font-black uppercase text-[10px]">Equipe Interna</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Permissões Ativas</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-sm transition-all">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={user.permissions?.includes('order') ? "text-green-500" : "text-slate-300"} size={18} />
                            <span className="text-xs font-black text-slate-700 uppercase">Fazer Pedidos</span>
                          </div>
                          <Checkbox checked={user.permissions?.includes('order')} onCheckedChange={() => togglePermission('order')} />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-sm transition-all">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={user.permissions?.includes('coupons') ? "text-green-500" : "text-slate-300"} size={18} />
                            <span className="text-xs font-black text-slate-700 uppercase">Usar Cupons</span>
                          </div>
                          <Checkbox checked={user.permissions?.includes('coupons')} onCheckedChange={() => togglePermission('coupons')} />
                        </div>
                        {user.role === 'Proprietário' && (
                          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100 group hover:bg-white transition-all">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className={user.permissions?.includes('manage_store') ? "text-orange-500" : "text-slate-300"} size={18} />
                              <span className="text-xs font-black text-orange-700 uppercase">Gerenciar Loja</span>
                            </div>
                            <Checkbox checked={user.permissions?.includes('manage_store')} onCheckedChange={() => togglePermission('manage_store')} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "financeiro" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Wallet size={24} /></div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gestão Financeira</h3>
                    </div>
                    <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-emerald-100 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><TrendingUp size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-80 tracking-widest">Saldo Atual</p>
                        <p className="text-2xl font-black">{user.wallet.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Movimentar Carteira</h4>
                      <div className="space-y-6">
                        <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200">
                          <button onClick={() => setWalletOperation("add")} className={`flex-1 h-12 rounded-xl font-black uppercase text-[10px] transition-all ${walletOperation === 'add' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Plus size={16} className="inline mr-2" /> Adicionar
                          </button>
                          <button onClick={() => setWalletOperation("subtract")} className={`flex-1 h-12 rounded-xl font-black uppercase text-[10px] transition-all ${walletOperation === 'subtract' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Trash2 size={16} className="inline mr-2" /> Abater
                          </button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor da Operação</Label>
                          <Input 
                            placeholder="R$ 0,00" 
                            value={walletAmount} 
                            onChange={(e) => handleWalletAmountChange(e.target.value)} 
                            className="h-16 rounded-2xl bg-white border-none font-black text-2xl text-center focus:ring-2 focus:ring-orange-500/20" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Motivo / Descrição</Label>
                          <Input placeholder="Ex: Estorno de pedido #1234" value={walletDescription} onChange={(e) => setWalletDescription(e.target.value)} className="h-14 rounded-2xl bg-white border-none font-bold" />
                        </div>
                        <Button onClick={handleWalletUpdate} className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all active:scale-95 ${walletOperation === 'add' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}>
                          Confirmar Movimentação
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Últimas Transações</h4>
                        <History size={18} className="text-slate-300" />
                      </div>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {transactions.length > 0 ? (
                            transactions.map(t => (
                              <div key={t.id} className="p-5 bg-white rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-orange-200 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'CRÉDITO' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {t.type === 'CRÉDITO' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-900 uppercase leading-tight">{t.description}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">{t.date}</p>
                                  </div>
                                </div>
                                <span className={`text-lg font-black ${t.type === 'CRÉDITO' ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {t.type === 'CRÉDITO' ? '+' : '-'} {t.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                              <CreditCard size={48} className="mb-4 opacity-20" />
                              <p className="text-xs font-black uppercase tracking-widest">Sem histórico</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pedidos" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><ShoppingBag size={24} /></div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Histórico de Pedidos</h3>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                      <ShoppingBag size={40} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhum pedido realizado ainda</p>
                    <p className="text-xs font-bold text-slate-300 mt-2">Os pedidos feitos no App aparecerão aqui.</p>
                  </div>
                </div>
              )}

              {activeTab === "enderecos" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600"><MapPin size={24} /></div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Endereços Cadastrados</h3>
                    </div>
                    <Button onClick={() => { 
                      setEditingAddress(null); 
                      setAddressFormData({ id: 0, nickname: "", zip: "", street: "", number: "", neighborhood: "", city: "", state: "", complement: "" }); 
                      setIsAddressOpen(true); 
                    }} className="bg-slate-900 hover:bg-black text-white rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest">
                      <Plus size={18} className="mr-2" /> Novo Endereço
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length > 0 ? (
                      addresses.map(addr => (
                        <div key={addr.id} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 group hover:border-orange-200 transition-all relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10"></div>
                          <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                                <MapPinned size={24} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{addr.nickname || "Endereço"}</p>
                                <p className="text-lg font-black text-slate-900 uppercase leading-tight">{addr.street}, {addr.number}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => { setEditingAddress(addr); setAddressFormData(addr); setIsAddressOpen(true); }} className="h-10 w-10 bg-white rounded-xl shadow-sm hover:bg-orange-600 hover:text-white transition-all"><Edit2 size={16} /></Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 bg-white text-red-500 rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></Button>
                            </div>
                          </div>
                          <div className="relative z-10">
                            <p className="text-sm font-bold text-slate-500 mt-1">{addr.neighborhood} • {addr.city}/{addr.state}</p>
                            <div className="mt-4 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-100">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CEP:</span>
                              <span className="text-[10px] font-black text-slate-900">{addr.zip}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhum endereço cadastrado</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE BANIMENTO */}
      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-red-600">
              <AlertTriangle size={24} /> {user.status === 'Ativo' ? 'Confirmar Banimento' : 'Confirmar Reativação'}
            </DialogTitle>
            <DialogDescription className="text-sm font-bold text-slate-500 uppercase mt-2">
              {user.status === 'Ativo' 
                ? `Deseja realmente banir ${user.name}? Ele perderá acesso imediato ao sistema.` 
                : `Deseja reativar a conta de ${user.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex gap-3">
            <Button variant="ghost" onClick={() => setIsBanModalOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
            <Button 
              onClick={handleConfirmBan} 
              className={`rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1 ${user.status === 'Ativo' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE ENDEREÇO (MANTIDO FUNCIONAL) */}
      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 overflow-hidden shadow-2xl">
          <form>
            <DialogHeader className="p-10 bg-slate-900 text-white">
              <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><MapPinned className="text-orange-500" /> {editingAddress ? 'Editar' : 'Novo'} Endereço</DialogTitle>
            </DialogHeader>
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">CEP</Label>
                <Input value={addressFormData.zip} onChange={(e) => setAddressFormData({...addressFormData, zip: e.target.value})} placeholder="00000-000" className="rounded-2xl h-14 font-bold" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rua / Logradouro</Label>
                <Input value={addressFormData.street} onChange={(e) => setAddressFormData({...addressFormData, street: e.target.value})} placeholder="Ex: Av. Central" className="rounded-2xl h-14 font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Número</Label><Input value={addressFormData.number} onChange={(e) => setAddressFormData({...addressFormData, number: e.target.value})} className="rounded-2xl h-14 font-bold" required /></div>
                <div className="space-y-2"><Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Bairro</Label><Input value={addressFormData.neighborhood} onChange={(e) => setAddressFormData({...addressFormData, neighborhood: e.target.value})} className="rounded-2xl h-14 font-bold" required /></div>
              </div>
            </div>
            <DialogFooter className="p-10 bg-slate-50 border-t flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddressOpen(false)} className="rounded-2xl font-bold h-14 flex-1 uppercase text-[10px]">Cancelar</Button>
              <Button type="submit" className="bg-slate-900 text-white rounded-2xl font-black h-14 flex-1 uppercase text-[10px] tracking-widest">Salvar Endereço</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserDetailsPage;