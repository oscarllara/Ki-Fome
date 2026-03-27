"use client";

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Users, UserPlus, ShieldAlert, RotateCcw, 
  Eye, LogIn, Wallet, Calendar, Phone, Mail, Download, UserCheck
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
  { id: 233, name: "Felipe Denis", email: "felipeacompanhamento@gmail.com", phone: "+5588999266723", role: "Customer", wallet: "R$ 0", date: "2026-03-18 11:09 PM", status: "Active" },
  { id: 232, name: "ITALO AMORIM BARBOZA", email: "ytalloamorim49@gmail.com", phone: "41996946230", role: "Delivery Guy", wallet: "R$ 0", date: "2026-03-16 01:31 AM", status: "Active" },
  { id: 231, name: "Catiele Gamboa", email: "gamboacatiele921@gmail.com", phone: "66999560724", role: "Delivery Guy", wallet: "R$ 0", date: "2026-03-06 10:42 PM", status: "Active" },
  { id: 230, name: "Estela", email: "estelacol55@gmail.com", phone: "+5531997065858", role: "Customer", wallet: "R$ 50", date: "2026-03-05 11:55 AM", status: "Active" },
  { id: 229, name: "Poliana Duarte de Freitas", email: "polianaduarteff@gmail.com", phone: "11993684330", role: "Store Owner", wallet: "R$ 1.200", date: "2026-03-02 09:17 AM", status: "Active" },
  { id: 228, name: "Loja Parceira RN", email: "parceirorn@exemplo.com", phone: "84999998888", role: "Partner", wallet: "R$ 0", date: "2026-01-10 10:00 AM", status: "Active" },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState("Customer");
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleResetFilters = () => {
    setSearch("");
    navigate("/admin/users/all");
    showSuccess("Filtros redefinidos!");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Usuário cadastrado com sucesso!");
    setIsAddUserOpen(false);
  };

  return (
    <AdminLayout>
      <header className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              {currentFilterRole ? `Usuários: ${currentFilterRole}` : "Todos os Usuários"}
            </h1>
            <p className="text-slate-500 font-medium">Gerencie clientes, parceiros e equipe do sistema.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => { setNewUserRole("Customer"); setIsAddUserOpen(true); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2"
            >
              <UserPlus size={18} /> Cadastrar Cliente
            </Button>
            <Button 
              onClick={() => { setNewUserRole("Partner"); setIsAddUserOpen(true); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2"
            >
              <Plus size={18} /> Adicionar Novo Usuário
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => showSuccess("Redirecionando para gestão de permissões...")}
            variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none rounded-xl h-12 font-bold gap-2"
          >
            <ShieldAlert size={18} /> Gerenciar funções e permissões
          </Button>
          <Button 
            onClick={handleResetFilters}
            variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none rounded-xl h-12 font-bold gap-2"
          >
            <RotateCcw size={18} /> Redefinir todos os filtros
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
              onClick={() => showSuccess("CSV gerado com sucesso!")}
              variant="outline" className="h-14 rounded-2xl font-bold gap-2 border-slate-200 text-slate-500 px-6"
            >
               <Download size={18} /> Exportar CSV
            </Button>
            <Select defaultValue="10">
               <SelectTrigger className="w-24 h-14 rounded-2xl font-bold">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent className="rounded-xl">
                 <SelectItem value="10">10</SelectItem>
                 <SelectItem value="25">25</SelectItem>
                 <SelectItem value="50">50</SelectItem>
               </SelectContent>
            </Select>
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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data de Criação</th>
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
                  <td className="px-8 py-5 text-[10px] font-bold text-slate-400">{user.date}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-lg h-9 px-4 font-black text-[10px] uppercase">
                        Conecte-se
                      </Button>
                      <Button 
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        className="bg-black hover:bg-slate-800 text-white rounded-lg h-9 px-4 font-black text-[10px] uppercase"
                      >
                        Visualizar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG DE CADASTRO */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden">
          <form onSubmit={handleCreateUser}>
            <DialogHeader className="p-8 bg-slate-900 text-white">
              <DialogTitle className="text-xl font-black uppercase tracking-tight">Novo Registro</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-bold uppercase">Cadastrar novo usuário no sistema.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome Completo</Label>
                <Input placeholder="Ex: João da Silva" className="rounded-xl h-12" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">E-mail</Label>
                <Input type="email" placeholder="joao@exemplo.com" className="rounded-xl h-12" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">WhatsApp/Celular</Label>
                <Input placeholder="+55 00 00000-0000" className="rounded-xl h-12" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Função inicial</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Customer">Cliente</SelectItem>
                    <SelectItem value="Partner">Parceiro</SelectItem>
                    <SelectItem value="Store Owner">Proprietário de Loja</SelectItem>
                    <SelectItem value="Delivery Guy">Entregador</SelectItem>
                    <SelectItem value="Staff">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-8 bg-slate-50 border-t flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsAddUserOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1 shadow-lg shadow-emerald-100">
                <UserCheck size={16} className="mr-2" /> Cadastrar Usuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;