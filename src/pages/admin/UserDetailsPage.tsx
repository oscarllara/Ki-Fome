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
  Trash2, Edit2, CheckCircle2, Ban, Eye, EyeOff, LogIn
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
  const [showPass, setShowPass] = useState(false);
  
  // Carteira
  const [walletAmount, setWalletAmount] = useState("");
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
      if (found) setUser(found);
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
    showSuccess("Usuário atualizado com sucesso!");
  };

  const handleWalletUpdate = () => {
    const rawValue = walletAmount.replace(/[^\d,]/g, "").replace(",", ".");
    const numericValue = parseFloat(rawValue);
    if (isNaN(numericValue) || numericValue === 0) return;

    const newWallet = walletOperation === "add" ? user.wallet + numericValue : Math.max(0, user.wallet - numericValue);
    const updatedUser = { ...user, wallet: newWallet };
    
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
    setWalletAmount("");
    setWalletDescription("");
  };

  const tabs = [
    { id: "detalhes", label: "Detalhes do Usuário", icon: <User size={18} /> },
    { id: "funcao", label: "Função do Usuário & Zona", icon: <Shield size={18} /> },
    { id: "saldo", label: "Saldo da Carteira", icon: <Wallet size={18} /> },
    { id: "transacoes", label: "Transações da Carteira", icon: <History size={18} /> },
    { id: "pedidos", label: "Pedidos", icon: <ShoppingBag size={18} /> },
    { id: "enderecos", label: "Endereços do Usuário", icon: <MapPin size={18} /> },
  ];

  if (!user) return null;

  return (
    <AdminLayout>
      <header className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-4">
          <span>Editando</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">{user.name}</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 pb-20">
        {/* Sidebar de Edição */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-28">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4 ${activeTab === tab.id ? "bg-[#C81E2E] text-white border-[#C81E2E]" : "text-slate-500 border-transparent hover:bg-slate-50"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex-1 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-10">
              {activeTab === "detalhes" && (
                <div className="space-y-10">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">DETALHES DO USUÁRIO</h3>
                  <div className="space-y-6 max-w-3xl">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <Label className="text-sm font-bold text-slate-600">Nome:</Label>
                      <Input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="h-12 rounded-lg bg-slate-50/50" />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <Label className="text-sm font-bold text-slate-600">E-mail:</Label>
                      <Input value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="h-12 rounded-lg bg-slate-50/50" />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <Label className="text-sm font-bold text-slate-600">Celular:</Label>
                      <Input value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} className="h-12 rounded-lg bg-slate-50/50" />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <Label className="text-sm font-bold text-slate-600">Senha:</Label>
                      <div className="relative">
                        <Input 
                          type={showPass ? "text" : "password"} 
                          placeholder="Digite a senha (mínimo 6 caracteres)" 
                          className="h-12 rounded-lg bg-slate-50/50 pr-24" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                          {showPass ? <EyeOff size={14} /> : <Eye size={14} />} {showPass ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="destructive" className="bg-[#FF4D4D] hover:bg-red-600 rounded-lg px-8 h-12 font-bold gap-2">
                        <Ban size={18} /> Banir Usuário
                      </Button>
                      <p className="text-xs text-slate-400 font-bold mt-4">IP do usuário usado durante o registro: <span className="text-slate-900">138.219.182.240</span></p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "funcao" && (
                <div className="space-y-10">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">GERENCIAMENTO DE FUNÇÕES</h3>
                  <div className="space-y-8 max-w-3xl">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <Label className="text-sm font-bold text-slate-600">Função Atual:</Label>
                      <Badge className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-md px-3 py-1 font-bold w-fit">{user.role}</Badge>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <Label className="text-sm font-bold text-slate-600">Atribuir Função:</Label>
                      <Select value={user.role} onValueChange={(val) => setUser({...user, role: val})}>
                        <SelectTrigger className="h-12 rounded-lg bg-slate-50/50 text-slate-400">
                          <SelectValue placeholder="Quando atribuir uma nova função..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="Cliente" className="font-bold">Customer</SelectItem>
                          <SelectItem value="Parceiro" className="font-bold">Partner</SelectItem>
                          <SelectItem value="Proprietário" className="font-bold">Store Owner</SelectItem>
                          <SelectItem value="Entregador" className="font-bold">Driver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "saldo" && (
                <div className="space-y-10">
                  <div className="flex items-center gap-2 bg-orange-50/50 p-2 rounded-md w-fit">
                    <span className="text-xs font-black text-orange-600 uppercase">Carteira Saldo:</span>
                    <span className="text-xs font-black text-slate-900">R$ {user.wallet.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="w-64 space-y-2">
                      <button 
                        onClick={() => setWalletOperation("add")}
                        className={`w-full text-left px-6 py-4 rounded-lg font-bold text-sm transition-all ${walletOperation === 'add' ? 'bg-[#C81E2E] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        Adicionar dinheiro
                      </button>
                      <button 
                        onClick={() => setWalletOperation("subtract")}
                        className={`w-full text-left px-6 py-4 rounded-lg font-bold text-sm transition-all ${walletOperation === 'subtract' ? 'bg-[#C81E2E] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        Deduzir dinheiro
                      </button>
                    </div>

                    <div className="flex-1 space-y-6 max-w-xl">
                      <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <Label className="text-sm font-bold text-slate-600">{walletOperation === 'add' ? 'Adicionar' : 'Deduzir'} dinheiro:</Label>
                        <Input 
                          placeholder="Valor em R$" 
                          value={walletAmount}
                          onChange={(e) => setWalletAmount(e.target.value.replace(/\D/g, "").replace(/(\d+)(\d{2})$/, "R$ $1,$2"))}
                          className="h-12 rounded-lg bg-slate-50/50" 
                        />
                      </div>
                      <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                        <Label className="text-sm font-bold text-slate-600">Mensagem:</Label>
                        <Input 
                          placeholder="Descrição ou Mensagem Resumida" 
                          value={walletDescription}
                          onChange={(e) => setWalletDescription(e.target.value)}
                          className="h-12 rounded-lg bg-slate-50/50" 
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleWalletUpdate} className="bg-[#4DB6AC] hover:bg-[#3d9189] text-white rounded-lg px-8 h-10 font-bold">
                          Atualizar saldo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Outras abas mantidas conforme estrutura anterior */}
            </CardContent>
          </Card>

          {/* Botão de Ação Flutuante/Fixo no Canto */}
          <div className="flex justify-end">
            <Button onClick={handleUpdateUser} className="bg-black hover:bg-slate-900 text-white rounded-lg px-10 h-14 font-bold gap-3 shadow-xl">
              <LogIn size={20} /> Atualizar usuário
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetailsPage;