"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, UserPlus, UserCircle
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const INITIAL_MOCK_USERS = [
  { id: 234, name: "Lojista Teste", email: "lojista@teste.com", phone: "+55 (35) 99999-9999", role: "Proprietário", wallet: 0, status: "Ativo" },
  { id: 233, name: "Felipe Denis", email: "felipe@gmail.com", phone: "+55 (88) 99926-6723", role: "Cliente", wallet: 0, status: "Ativo" },
  { id: 232, name: "ITALO AMORIM", email: "ytallo@gmail.com", phone: "+55 (41) 99694-6230", role: "Entregador", wallet: 0, status: "Ativo" },
  { id: 229, name: "Helio Junio", email: "helio@kifome.com", phone: "+55 (35) 88888-8888", role: "Gestor Master", wallet: 1200, status: "Ativo" },
];

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "+55 ", role: "Cliente"
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem("kifome_users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(INITIAL_MOCK_USERS);
      localStorage.setItem("kifome_users", JSON.stringify(INITIAL_MOCK_USERS));
    }
  }, []);

  // Mapeamento de rotas para funções
  const roleFilter = useMemo(() => {
    const path = location.pathname;
    if (path.includes("customers")) return "Cliente";
    if (path.includes("owners")) return "Proprietário";
    if (path.includes("masters")) return "Gestor Master";
    if (path.includes("partners")) return "Parceiro";
    if (path.includes("drivers")) return "Entregador";
    if (path.includes("staff")) return "Garçom";
    return null;
  }, [location.pathname]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                           u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      ...formData,
      wallet: 0,
      status: "Ativo"
    };
    const updated = [newUser, ...users];
    setUsers(updated);
    localStorage.setItem("kifome_users", JSON.stringify(updated));
    showSuccess("Usuário cadastrado!");
    setIsAddUserOpen(false);
  };

  return (
    <AdminLayout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {roleFilter ? `Usuários: ${roleFilter}s` : "Todos os Usuários"}
          </h1>
          <p className="text-slate-500 font-medium">Gerencie clientes, lojistas e equipe.</p>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2">
          <UserPlus size={18} /> Novo Usuário
        </Button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-white rounded-2xl border-slate-200 font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Função</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contato</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-6 font-black text-slate-900 uppercase text-sm">{user.name}</td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase border-orange-200 bg-orange-50 text-orange-600">{user.role}</Badge>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{user.phone}</td>
                  <td className="px-8 py-6 text-right">
                    <Button onClick={() => navigate(`/admin/users/edit/${user.id}`)} className="bg-slate-900 hover:bg-black text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase">Ver Perfil</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Nenhum usuário encontrado nesta categoria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-8">
          <form onSubmit={handleCreateUser}>
            <DialogHeader><DialogTitle className="text-xl font-black uppercase">Novo Usuário</DialogTitle></DialogHeader>
            <div className="space-y-4 py-6">
              <Input placeholder="Nome" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <Input placeholder="E-mail" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Proprietário">Proprietário</SelectItem>
                  <SelectItem value="Gestor Master">Gestor Master</SelectItem>
                  <SelectItem value="Parceiro">Parceiro</SelectItem>
                  <SelectItem value="Entregador">Entregador</SelectItem>
                  <SelectItem value="Garçom">Garçom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button type="submit" className="w-full bg-orange-600">Cadastrar</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;