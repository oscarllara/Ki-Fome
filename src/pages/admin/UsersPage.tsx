"use client";

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, UserPlus, ShieldAlert, 
  Wallet, Download, UserCheck, Lock, Mail, Phone, User as UserIcon
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOCK_USERS = [
  { id: 233, name: "Felipe Denis", email: "felipeacompanhamento@gmail.com", phone: "+55 (88) 99926-6723", role: "Customer", wallet: "R$ 0", date: "2026-03-18 11:09 PM", status: "Active" },
  { id: 232, name: "ITALO AMORIM BARBOZA", email: "ytalloamorim49@gmail.com", phone: "+55 (41) 99694-6230", role: "Delivery Guy", wallet: "R$ 0", date: "2026-03-16 01:31 AM", status: "Active" },
  { id: 231, name: "Catiele Gamboa", email: "gamboacatiele921@gmail.com", phone: "+55 (66) 99956-0724", role: "Delivery Guy", wallet: "R$ 0", date: "2026-03-06 10:42 PM", status: "Active" },
  { id: 229, name: "Poliana Duarte de Freitas", email: "polianaduarteff@gmail.com", phone: "+55 (11) 99368-4330", role: "Store Owner", wallet: "R$ 1.200", date: "2026-03-02 09:17 AM", status: "Active" },
  { id: 228, name: "Loja Parceira RN", email: "parceirorn@exemplo.com", phone: "+55 (84) 99999-8888", role: "Partner", wallet: "R$ 0", date: "2026-01-10 10:00 AM", status: "Active" },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState("Customer");
  const navigate = useNavigate();
  const location = useLocation();

  // Estados do formulário de cadastro completo
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const currentFilterRole = useMemo(() => {
    if (location.pathname.includes("customers")) return "Customer";
    if (location.pathname.includes("owners")) return "Store Owner";
    if (location.pathname.includes("drivers")) return "Delivery Guy";
    if (location.pathname.includes("staff")) return "Staff";
    if (location.pathname.includes("partners")) return "Partner";
    return null;
  }, [location.pathname]);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                           u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !currentFilterRole || u.role === currentFilterRole;
      return matchesSearch && matchesRole;
    });
  }, [search, currentFilterRole]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(`${formData.name} cadastrado como ${newUserRole} com sucesso!`);
    setIsAddUserOpen(false);
    setFormData({ name: "", email: "", phone: "", password: "" });
  };

  // Função para aplicar máscara básica de telefone conforme solicitado
  const handlePhoneChange = (val: string) => {
    let v = val.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    
    if (v.length > 2) {
      v = `+55 (${v.substring(0, 2)}) ${v.substring(2)}`;
    } else if (v.length > 0) {
      v = `+55 (${v}`;
    }
    
    if (v.length > 10) {
      v = v.substring(0, 10) + "-" + v.substring(10);
    }
    
    setFormData({ ...formData, phone: v });
  };

  return (
    <AdminLayout>
      <header className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              {currentFilterRole ? `Usuários: ${currentFilterRole}` : "Todos os Usuários"}
            </h1>
            <p className="text-slate-500 font-medium">Controle total sobre os acessos do KIFOME.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => { setNewUserRole("Customer"); setIsAddUserOpen(true); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2 shadow-lg shadow-emerald-100"
            >
              <UserPlus size={18} /> Cadastrar Cliente
            </Button>
            <Button 
              onClick={() => { setNewUserRole("Partner"); setIsAddUserOpen(true); }}
              className="bg-slate-900 hover:bg-black text-white rounded-xl font-bold h-12 gap-2 shadow-lg shadow-slate-200"
            >
              <Plus size={18} /> Adicionar Novo Usuário
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate("/admin/settings/all")}
            variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none rounded-xl h-12 font-bold gap-2"
          >
            <ShieldAlert size={18} /> Gerenciar funções e permissões
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquise por nome, e-mail ou celular..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-white rounded-2xl border-slate-200 font-bold"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button 
              onClick={() => showSuccess("CSV de usuários gerado!")}
              variant="outline" className="h-14 rounded-2xl font-bold gap-2 border-slate-200 text-slate-500 px-6"
            >
               <Download size={18} /> Exportar CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Celular</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Função</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Carteira</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-slate-900 uppercase text-sm">{user.name}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{user.email}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{user.phone}</td>
                  <td className="px-8 py-5">
                    <Badge variant="outline" className={`rounded-lg text-[9px] font-black uppercase tracking-widest border-slate-200 
                      ${user.role === 'Partner' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'text-slate-500'}
                    `}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 font-black text-emerald-600">{user.wallet}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        className="bg-black hover:bg-slate-800 text-white rounded-lg h-9 px-4 font-black text-[10px] uppercase shadow-sm"
                      >
                        Visualizar Perfil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG DE CADASTRO COMPLETO */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <form onSubmit={handleCreateUser}>
            <DialogHeader className="p-8 bg-slate-900 text-white">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <UserCheck className="text-orange-500" /> Registro Completo
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Preencha todos os dados para ativar o novo acesso no sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome Completo</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input 
                      placeholder="Ex: João da Silva" 
                      className="rounded-xl h-12 pl-12 font-bold" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">E-mail de Acesso</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input 
                      type="email" 
                      placeholder="joao@exemplo.com" 
                      className="rounded-xl h-12 pl-12 font-bold" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">WhatsApp / Celular</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input 
                      placeholder="+55 (xx) xxxxx-xxxx" 
                      className="rounded-xl h-12 pl-12 font-bold" 
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Senha Inicial</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="rounded-xl h-12 pl-12 font-bold" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5 pt-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Função no Sistema</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Customer" className="font-bold">Cliente (Customer)</SelectItem>
                    <SelectItem value="Partner" className="font-bold">Parceiro (Partner)</SelectItem>
                    <SelectItem value="Store Owner" className="font-bold">Proprietário (Store Owner)</SelectItem>
                    <SelectItem value="Delivery Guy" className="font-bold">Entregador (Delivery Guy)</SelectItem>
                    <SelectItem value="Staff" className="font-bold">Funcionário (Staff)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-8 bg-slate-50 border-t flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddUserOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1 shadow-lg shadow-emerald-100">
                Confirmar Cadastro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;