"use client";

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, UserPlus, ShieldAlert, 
  Trash2, Download, UserCheck, Lock, Mail, Phone, User as UserIcon
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
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
  { id: 233, name: "Felipe Denis", email: "felipeacompanhamento@gmail.com", phone: "+55 (88) 99926-6723", role: "Cliente", wallet: "R$ 0,00", status: "Ativo" },
  { id: 232, name: "ITALO AMORIM BARBOZA", email: "ytalloamorim49@gmail.com", phone: "+55 (41) 99694-6230", role: "Entregador", wallet: "R$ 0,00", status: "Ativo" },
  { id: 231, name: "Catiele Gamboa", email: "gamboacatiele921@gmail.com", phone: "+55 (66) 99956-0724", role: "Entregador", wallet: "R$ 0,00", status: "Ativo" },
  { id: 229, name: "Poliana Duarte de Freitas", email: "polianaduarteff@gmail.com", phone: "+55 (11) 99368-4330", role: "Proprietário", wallet: "R$ 1.200,00", status: "Ativo" },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [adminPass, setAdminPass] = useState("");
  const [newUserRole, setNewUserRole] = useState("Cliente");
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const currentFilterRole = useMemo(() => {
    if (location.pathname.includes("customers")) return "Cliente";
    if (location.pathname.includes("owners")) return "Proprietário";
    if (location.pathname.includes("drivers")) return "Entregador";
    if (location.pathname.includes("staff")) return "Funcionário";
    if (location.pathname.includes("partners")) return "Parceiro";
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
    const roleInfo = newUserRole !== "Cliente" ? `${newUserRole} e Cliente` : "Cliente";
    showSuccess(`${formData.name} cadastrado como ${roleInfo} com sucesso!`);
    setIsAddUserOpen(false);
    setFormData({ name: "", email: "", phone: "", password: "" });
  };

  const handleOpenDelete = (user: any) => {
    setUserToDelete(user);
    setAdminPass("");
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (adminPass === "Senha@123") {
      showSuccess(`Usuário ${userToDelete.name} removido do sistema.`);
      setIsDeleteOpen(false);
    } else {
      showError("Senha administrativa incorreta!");
    }
  };

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
              onClick={() => { setNewUserRole("Cliente"); setIsAddUserOpen(true); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2 shadow-lg shadow-emerald-100"
            >
              <UserPlus size={18} /> Cadastrar Cliente
            </Button>
            <Button 
              onClick={() => { setNewUserRole("Parceiro"); setIsAddUserOpen(true); }}
              className="bg-slate-900 hover:bg-black text-white rounded-xl font-bold h-12 gap-2 shadow-lg shadow-slate-200"
            >
              <Plus size={18} /> Novo Usuário Especial
            </Button>
          </div>
        </div>

        <Button 
          onClick={() => navigate("/admin/settings/all")}
          variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none rounded-xl h-12 font-bold gap-2"
        >
          <ShieldAlert size={18} /> Gerenciar funções e permissões
        </Button>
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
          <Button 
            onClick={() => showSuccess("CSV de usuários gerado!")}
            variant="outline" className="h-14 rounded-2xl font-bold gap-2 border-slate-200 text-slate-500 px-6"
          >
             <Download size={18} /> Exportar CSV
          </Button>
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
                <tr key={user.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-900 uppercase text-sm">{user.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">{user.email}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-700">{user.phone}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase tracking-widest border-slate-200 bg-white text-slate-500">
                        Cliente
                      </Badge>
                      {user.role !== "Cliente" && (
                        <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase tracking-widest border-orange-200 bg-orange-50 text-orange-600">
                          {user.role}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-emerald-600">{user.wallet}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Button 
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        className="bg-slate-900 hover:bg-black text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase shadow-sm"
                      >
                        Visualizar Perfil
                      </Button>
                      <Button 
                        onClick={() => handleOpenDelete(user)}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl h-10 w-10 p-0 transition-all"
                      >
                        <Trash2 size={18} />
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
        <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <form onSubmit={handleCreateUser}>
            <DialogHeader className="p-8 bg-slate-900 text-white">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <UserCheck className="text-orange-500" /> Registro Completo
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Cadastro automático com perfil de Cliente incluso.
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
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">E-mail</Label>
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
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">WhatsApp</Label>
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
                  <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Senha</Label>
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
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Função Adicional</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Cliente" className="font-bold">Apenas Cliente</SelectItem>
                    <SelectItem value="Parceiro" className="font-bold">Parceiro</SelectItem>
                    <SelectItem value="Proprietário" className="font-bold">Proprietário</SelectItem>
                    <SelectItem value="Entregador" className="font-bold">Entregador</SelectItem>
                    <SelectItem value="Funcionário" className="font-bold">Funcionário</SelectItem>
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

      {/* DIALOG DE EXCLUSÃO */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase text-red-600">Excluir Usuário</DialogTitle>
            <DialogDescription className="text-slate-500 font-bold">
              Você está prestes a excluir <span className="text-slate-900">{userToDelete?.name}</span>. Esta ação é irreversível.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Administrador</Label>
              <Input 
                type="password" 
                placeholder="Confirme a senha master" 
                className="rounded-xl h-12 font-bold" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1 shadow-lg shadow-red-100">
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;