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
  ArrowLeft, RefreshCcw, ExternalLink, Plus, MapPinned,
  ArrowUpCircle, ArrowDownCircle, Trash2, Edit2, CheckCircle2
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Carteira
  const [walletAmount, setWalletAmount] = useState("R$ 0,00");
  const [walletOperation, setWalletOperation] = useState<"add" | "subtract">("add");
  const [walletDescription, setWalletDescription] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  // Endereços
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressFormData, setAddressFormData] = useState({ zip: "", street: "", number: "", neighborhood: "", city: "", state: "" });

  useEffect(() => {
    const savedUsers = localStorage.getItem("kifome_users");
    const savedTransactions = localStorage.getItem(`kifome_trans_${id}`);
    const savedAddresses = localStorage.getItem(`kifome_addr_${id}`);
    
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      setUsers(parsed);
      const found = parsed.find((u: any) => u.id === Number(id));
      if (found) {
        setUser(found);
      } else {
        navigate("/admin/users/all");
      }
    }

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      const initialAddr = [{ id: 1, zip: "37200-000", street: "Rua Central", number: "500", neighborhood: "Centro", city: "Lavras", state: "MG", isDefault: true }];
      setAddresses(initialAddr);
      localStorage.setItem(`kifome_addr_${id}`, JSON.stringify(initialAddr));
    }
  }, [id, navigate]);

  const saveToLocal = (updatedUser: any) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem("kifome_users", JSON.stringify(updatedUsers));
  };

  const handleSaveProfile = () => {
    saveToLocal(user);
    showSuccess("Alterações no perfil salvas com sucesso!");
  };

  const handleCEPChange = async (val: string) => {
    let v = val.replace(/\D/g, "");
    if (v.length > 8) v = v.substring(0, 8);
    if (v.length > 5) v = v.substring(0, 5) + "-" + v.substring(5);
    setAddressFormData({ ...addressFormData, zip: v });

    if (v.replace("-", "").length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${v.replace("-", "")}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddressFormData(prev => ({ ...prev, zip: v, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf }));
          showSuccess("CEP localizado!");
        }
      } catch (err) {
        showError("Erro ao buscar CEP.");
      }
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    let newAddresses;
    if (editingAddress) {
      newAddresses = addresses.map(a => a.id === editingAddress.id ? { ...addressFormData, id: a.id, isDefault: a.isDefault } : a);
    } else {
      newAddresses = [...addresses, { ...addressFormData, id: Date.now(), isDefault: false }];
    }
    setAddresses(newAddresses);
    localStorage.setItem(`kifome_addr_${id}`, JSON.stringify(newAddresses));
    showSuccess(editingAddress ? "Endereço atualizado!" : "Endereço adicionado!");
    setIsAddressOpen(false);
    setEditingAddress(null);
  };

  const removeAddress = (addrId: number) => {
    const newAddresses = addresses.filter(a => a.id !== addrId);
    setAddresses(newAddresses);
    localStorage.setItem(`kifome_addr_${id}`, JSON.stringify(newAddresses));
    showSuccess("Endereço removido.");
  };

  const handleWalletUpdate = () => {
    const rawValue = walletAmount.replace(/[^\d,]/g, "").replace(",", ".");
    const numericValue = parseFloat(rawValue);
    if (isNaN(numericValue) || numericValue === 0) return;

    const newWallet = walletOperation === "add" ? user.wallet + numericValue : Math.max(0, user.wallet - numericValue);
    const updatedUser = { ...user, wallet: newWallet };
    
    // Log transação
    const newTrans = {
      id: Date.now(),
      type: walletOperation === "add" ? "CRÉDITO" : "DÉBITO",
      amount: numericValue,
      description: walletDescription || (walletOperation === "add" ? "Adição manual" : "Abatimento manual"),
      date: new Date().toLocaleDateString("pt-BR")
    };
    const updatedTrans = [newTrans, ...transactions];
    setTransactions(updatedTrans);
    localStorage.setItem(`kifome_trans_${id}`, JSON.stringify(updatedTrans));

    setUser(updatedUser);
    saveToLocal(updatedUser);
    showSuccess(`Saldo atualizado!`);
    setWalletAmount("R$ 0,00");
    setWalletDescription("");
  };

  const tabs = [
    { id: "detalhes", label: "Dados Pessoais", icon: <User size={18} /> },
    { id: "funcao", label: "Funções", icon: <Shield size={18} /> },
    { id: "saldo", label: "Carteira (Saldo)", icon: <Wallet size={18} /> },
    { id: "transacoes", label: "Histórico Financeiro", icon: <History size={18} /> },
    { id: "pedidos", label: "Pedidos realizados", icon: <ShoppingBag size={18} /> },
    { id: "enderecos", label: "Endereços cadastrados", icon: <MapPin size={18} /> },
  ];

  if (!user) return null;

  return (
    <AdminLayout>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={() => navigate("/admin/users/all")} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 mb-2">
            <ArrowLeft size={14} /> Voltar para lista
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Perfil / {user.name}</h1>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 pb-20">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden sticky top-28">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-8 py-5 text-sm font-bold transition-all border-l-4 ${activeTab === tab.id ? "bg-red-50 text-red-600 border-red-600" : "text-slate-500 border-transparent hover:bg-slate-50"}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden">
            <CardContent className="p-10">
              {activeTab === "detalhes" && (
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">Dados Básicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400">Nome</Label>
                      <Input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="h-12 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400">E-mail</Label>
                      <Input value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="h-12 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400">WhatsApp</Label>
                      <Input value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} className="h-12 rounded-xl font-bold" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveProfile} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 px-8 font-black uppercase text-[10px] shadow-lg shadow-emerald-100 transition-all active:scale-95">
                      <CheckCircle2 size={16} className="mr-2" /> Salvar Alterações
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "funcao" && (
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">Atribuir Funções</h3>
                  <div className="max-w-md space-y-4">
                    <Label className="text-sm font-black text-slate-600">Função Principal:</Label>
                    <Select value={user.role} onValueChange={(val) => {
                      const updated = {...user, role: val};
                      setUser(updated);
                      saveToLocal(updated);
                      showSuccess("Função atualizada!");
                    }}>
                      <SelectTrigger className="h-14 rounded-2xl font-black uppercase text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="Cliente" className="font-bold">Cliente</SelectItem>
                        <SelectItem value="Parceiro" className="font-bold">Parceiro</SelectItem>
                        <SelectItem value="Proprietário" className="font-bold">Proprietário de Loja</SelectItem>
                        <SelectItem value="Entregador" className="font-bold">Entregador</SelectItem>
                        <SelectItem value="Funcionário" className="font-bold">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {activeTab === "saldo" && (
                <div className="space-y-8">
                  <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm"><Wallet size={32} /></div>
                      <div>
                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Saldo disponível</p>
                        <h4 className="text-3xl font-black text-orange-900">{user.wallet.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <button onClick={() => setWalletOperation("add")} className={`flex-1 h-14 rounded-2xl border-2 font-black uppercase text-[10px] ${walletOperation === 'add' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white text-slate-400'}`}><ArrowUpCircle size={18} className="inline mr-2" /> Adicionar</button>
                        <button onClick={() => setWalletOperation("subtract")} className={`flex-1 h-14 rounded-2xl border-2 font-black uppercase text-[10px] ${walletOperation === 'subtract' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white text-slate-400'}`}><ArrowDownCircle size={18} className="inline mr-2" /> Abater</button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor</Label>
                        <Input value={walletAmount} onChange={(e) => setWalletAmount(e.target.value.replace(/\D/g, "").replace(/(\d+)(\d{2})$/, "R$ $1,$2"))} onClick={() => setWalletAmount("R$ 0,00")} className="h-14 rounded-2xl font-black text-xl text-center" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Motivo da movimentação</Label>
                        <Input value={walletDescription} onChange={(e) => setWalletDescription(e.target.value)} placeholder="Ex: Estorno de pedido cancelado" className="h-12 rounded-xl font-bold" />
                      </div>
                      <Button onClick={handleWalletUpdate} className={`w-full h-14 rounded-2xl font-black uppercase text-[11px] ${walletOperation === 'add' ? 'bg-emerald-500' : 'bg-red-600'}`}>Confirmar Movimentação</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transacoes" && (
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">Histórico de Transações</h3>
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.map(t => (
                        <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'CRÉDITO' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                              {t.type === 'CRÉDITO' ? <Plus size={20} /> : <Trash2 size={20} />}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 uppercase">{t.description}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{t.date}</p>
                            </div>
                          </div>
                          <span className={`font-black ${t.type === 'CRÉDITO' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'CRÉDITO' ? '+' : '-'} {t.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic py-10 text-center">Nenhuma movimentação registrada.</p>
                  )}
                </div>
              )}

              {activeTab === "pedidos" && (
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">Pedidos do Cliente</h3>
                  <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <ShoppingBag size={48} className="text-slate-300 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase">Sincronizando com App de Delivery...</p>
                  </div>
                </div>
              )}

              {activeTab === "enderecos" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b pb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereços Salvos</h3>
                    <Button onClick={() => { setEditingAddress(null); setAddressFormData({ zip: "", street: "", number: "", neighborhood: "", city: "", state: "" }); setIsAddressOpen(true); }} className="bg-slate-900 text-white rounded-xl h-12 px-6 font-black uppercase text-[10px]">Novo Endereço</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                      <Card key={addr.id} className="rounded-[2.5rem] p-8 space-y-4 bg-slate-50 border-slate-200">
                        <div className="flex justify-between">
                          <MapPin className="text-red-500" />
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingAddress(addr); setAddressFormData(addr); setIsAddressOpen(true); }} className="h-8 w-8 bg-white rounded-lg shadow-sm"><Edit2 size={14} /></Button>
                            <Button variant="ghost" size="icon" onClick={() => removeAddress(addr.id)} className="h-8 w-8 bg-white text-red-500 rounded-lg shadow-sm"><Trash2 size={14} /></Button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase">{addr.street}, {addr.number}</p>
                          <p className="text-xs text-slate-500">{addr.neighborhood} - {addr.city}/{addr.state}</p>
                          <p className="text-[10px] font-black text-slate-400 mt-2">CEP: {addr.zip}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden">
          <form onSubmit={handleSaveAddress}>
            <DialogHeader className="p-8 bg-slate-900 text-white"><DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><MapPinned className="text-orange-500" /> {editingAddress ? 'Editar' : 'Novo'} Endereço</DialogTitle></DialogHeader>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase">CEP (padrão 00000-000)</Label>
                <Input value={addressFormData.zip} onChange={(e) => handleCEPChange(e.target.value)} placeholder="00000-000" className="rounded-xl h-12 font-bold" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase">Logradouro</Label>
                <Input value={addressFormData.street} onChange={(e) => setAddressFormData({...addressFormData, street: e.target.value})} placeholder="Rua..." className="rounded-xl h-12" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label className="text-[10px] font-black text-slate-400 uppercase">Número</Label><Input value={addressFormData.number} onChange={(e) => setAddressFormData({...addressFormData, number: e.target.value})} placeholder="123" className="rounded-xl h-12" required /></div>
                <div className="space-y-1"><Label className="text-[10px] font-black text-slate-400 uppercase">Bairro</Label><Input value={addressFormData.neighborhood} onChange={(e) => setAddressFormData({...addressFormData, neighborhood: e.target.value})} placeholder="Centro" className="rounded-xl h-12" required /></div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-slate-50 border-t flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsAddressOpen(false)} className="rounded-xl font-bold h-12 flex-1">Cancelar</Button>
              <Button type="submit" className="bg-slate-900 text-white rounded-xl font-black h-12 flex-1">Salvar Endereço</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserDetailsPage;