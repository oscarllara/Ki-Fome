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
  RefreshCw, AlertTriangle, Loader2
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [addressFormData, setAddressFormData] = useState({ 
    id: 0, nickname: "", zip: "", street: "", number: "", neighborhood: "", city: "", state: "", complement: ""
  });

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);
      try {
        const savedUsers = localStorage.getItem("kifome_users");
        const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
        const found = allUsers.find((u: any) => u.id === Number(id));
        
        if (found) {
          setUser({
            ...found,
            status: found.status || "Ativo",
            permissions: found.permissions || ["order", "coupons"],
            password: found.password || "123456",
            wallet: found.wallet || 0
          });
          
          const savedTransactions = localStorage.getItem(`kifome_trans_${id}`);
          if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
          
          const savedAddresses = localStorage.getItem(`kifome_addr_${id}`);
          if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
        showError("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [id]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, phone: e.target.value });
  };

  const saveToLocal = (updatedUser: any) => {
    try {
      const savedUsers = localStorage.getItem("kifome_users");
      const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
      const updatedUsers = allUsers.map((u: any) => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem("kifome_users", JSON.stringify(updatedUsers));
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
    }
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
    showSuccess(newStatus === "Banido" ? "Usuário banido!" : "Usuário reativado!");
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

    const newWallet = walletOperation === "add" ? (user.wallet || 0) + numericValue : Math.max(0, (user.wallet || 0) - numericValue);
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

  const handleCepBlur = async () => {
    const cep = addressFormData.zip.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        showError("CEP não encontrado.");
      } else {
        setAddressFormData({
          ...addressFormData,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        });
        showSuccess("Endereço preenchido!");
      }
    } catch (error) {
      showError("Erro ao buscar CEP.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedAddresses;
    
    if (editingAddress) {
      updatedAddresses = addresses.map(a => a.id === editingAddress.id ? addressFormData : a);
      showSuccess("Endereço atualizado!");
    } else {
      const newAddr = { ...addressFormData, id: Date.now() };
      updatedAddresses = [newAddr, ...addresses];
      showSuccess("Endereço cadastrado!");
    }

    setAddresses(updatedAddresses);
    localStorage.setItem(`kifome_addr_${id}`, JSON.stringify(updatedAddresses));
    setIsAddressOpen(false);
  };

  const handleDeleteAddress = (addrId: number) => {
    if (window.confirm("Deseja excluir este endereço?")) {
      const updated = addresses.filter(a => a.id !== addrId);
      setAddresses(updated);
      localStorage.setItem(`kifome_addr_${id}`, JSON.stringify(updated));
      showSuccess("Endereço removido.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carregando perfil...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-black text-slate-900 uppercase">Usuário não encontrado</h2>
          <Button onClick={() => navigate("/admin/users/all")} variant="link" className="text-orange-600 mt-4">Voltar para a lista</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/users/all")}
            className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-600 transition-all shadow-sm"
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
          <Button variant="outline" onClick={handleResetPassword} className="rounded-2xl h-12 px-6 font-bold border-slate-200 text-slate-500 gap-2">
            <RefreshCw size={16} /> Resetar Senha
          </Button>
          <Button onClick={handleUpdateUser} className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-lg">
            <Save size={18} className="mr-2" /> Salvar Alterações
          </Button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 pb-20">
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 space-y-2 sticky top-28">
            {[
              { id: "detalhes", label: "Dados Pessoais", icon: <User size={18} /> },
              { id: "funcao", label: "Funções & Acessos", icon: <Shield size={18} /> },
              { id: "financeiro", label: "Gestão Financeira", icon: <Wallet size={18} /> },
              { id: "pedidos", label: "Histórico de Pedidos", icon: <ShoppingBag size={18} /> },
              { id: "enderecos", label: "Endereços", icon: <MapPin size={18} /> },
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-tight transition-all ${activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === tab.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
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
                      <Input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail de Acesso</Label>
                      <Input value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp / Celular</Label>
                      <Input value={user.phone} onChange={handlePhoneChange} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha Atual</Label>
                      <div className="relative">
                        <Input type={showPass ? "text" : "password"} value={user.password} readOnly className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg pr-14" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-600">
                          {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
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
                    <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-xl flex items-center gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-80 tracking-widest">Saldo Atual</p>
                        <p className="text-2xl font-black">{(user.wallet || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Movimentar Carteira</h4>
                      <div className="space-y-6">
                        <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200">
                          <button onClick={() => setWalletOperation("add")} className={`flex-1 h-12 rounded-xl font-black uppercase text-[10px] transition-all ${walletOperation === 'add' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}>
                            <Plus size={16} className="inline mr-2" /> Adicionar
                          </button>
                          <button onClick={() => setWalletOperation("subtract")} className={`flex-1 h-12 rounded-xl font-black uppercase text-[10px] transition-all ${walletOperation === 'subtract' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400'}`}>
                            <Trash2 size={16} className="inline mr-2" /> Abater
                          </button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor da Operação</Label>
                          <Input placeholder="R$ 0,00" value={walletAmount} onChange={(e) => handleWalletAmountChange(e.target.value)} className="h-16 rounded-2xl bg-white border-none font-black text-2xl text-center" />
                        </div>
                        <Button onClick={handleWalletUpdate} className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl ${walletOperation === 'add' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-600 hover:bg-red-700'}`}>
                          Confirmar Movimentação
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Últimas Transações</h4>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-3">
                          {transactions.length > 0 ? transactions.map(t => (
                            <div key={t.id} className="p-5 bg-white rounded-3xl border border-slate-100 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-black text-slate-900 uppercase leading-tight">{t.description}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{t.date}</p>
                              </div>
                              <span className={`text-lg font-black ${t.type === 'CRÉDITO' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {t.type === 'CRÉDITO' ? '+' : '-'} {t.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </span>
                            </div>
                          )) : (
                            <p className="text-center text-slate-300 py-10 font-black uppercase text-[10px]">Sem histórico</p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
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
                    }} className="bg-slate-900 text-white rounded-2xl h-12 px-6 font-black uppercase text-[10px]">
                      <Plus size={18} className="mr-2" /> Novo Endereço
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length > 0 ? addresses.map(addr => (
                      <div key={addr.id} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{addr.nickname || "Endereço"}</p>
                            <p className="text-lg font-black text-slate-900 uppercase">{addr.street}, {addr.number}</p>
                            <p className="text-sm font-bold text-slate-500">{addr.neighborhood} • {addr.city}/{addr.state}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingAddress(addr); setAddressFormData(addr); setIsAddressOpen(true); }} className="h-10 w-10 bg-white rounded-xl shadow-sm"><Edit2 size={16} /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="h-10 w-10 bg-white text-red-500 rounded-xl shadow-sm"><Trash2 size={16} /></Button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="col-span-full text-center py-20 text-slate-300 font-black uppercase text-[10px]">Nenhum endereço cadastrado</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL DE ENDEREÇO COM API DE CEP */}
      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden">
          <form onSubmit={handleSaveAddress}>
            <DialogHeader className="p-10 bg-slate-900 text-white">
              <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <MapPinned className="text-orange-500" /> {editingAddress ? 'Editar' : 'Novo'} Endereço
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Apelido (Ex: Casa)</Label>
                  <Input value={addressFormData.nickname} onChange={(e) => setAddressFormData({...addressFormData, nickname: e.target.value})} className="rounded-2xl h-14 font-bold" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">CEP</Label>
                  <div className="relative">
                    <Input value={addressFormData.zip} onChange={(e) => setAddressFormData({...addressFormData, zip: e.target.value})} onBlur={handleCepBlur} className="rounded-2xl h-14 font-bold" required />
                    {isLoadingCep && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-orange-500" size={20} />}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Rua</Label>
                <Input value={addressFormData.street} onChange={(e) => setAddressFormData({...addressFormData, street: e.target.value})} className="rounded-2xl h-14 font-bold" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Número</Label>
                  <Input value={addressFormData.number} onChange={(e) => setAddressFormData({...addressFormData, number: e.target.value})} className="rounded-2xl h-14 font-bold" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Bairro</Label>
                  <Input value={addressFormData.neighborhood} onChange={(e) => setAddressFormData({...addressFormData, neighborhood: e.target.value})} className="rounded-2xl h-14 font-bold" required />
                </div>
              </div>
            </div>

            <DialogFooter className="p-10 bg-slate-50 border-t flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddressOpen(false)} className="rounded-2xl font-bold h-14 flex-1 uppercase text-[10px]">Cancelar</Button>
              <Button type="submit" className="bg-slate-900 text-white rounded-2xl font-black h-14 flex-1 uppercase text-[10px]">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase text-red-600">Confirmar Ação</DialogTitle>
            <DialogDescription className="text-sm font-bold text-slate-500 uppercase mt-2">
              Deseja realmente alterar o status de {user.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex gap-3">
            <Button variant="ghost" onClick={() => setIsBanModalOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
            <Button onClick={handleConfirmBan} className="bg-red-600 text-white rounded-xl font-black uppercase text-[10px] h-12 flex-1">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserDetailsPage;