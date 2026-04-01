"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, UserPlus, UserCircle, AlertCircle, Loader2, RefreshCw
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "+55 ", role: "Cliente"
  });

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const savedData = localStorage.getItem("kifome_users");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          // Filtra apenas objetos válidos para evitar erros de renderização
          const validUsers = parsed.filter(u => u && typeof u === 'object' && u.id);
          setUsers(validUsers);
        } else {
          setUsers(INITIAL_MOCK_USERS);
          localStorage.setItem("kifome_users", JSON.stringify(INITIAL_MOCK_USERS));
        }
      } else {
        setUsers(INITIAL_MOCK_USERS);
        localStorage.setItem("kifome_users", JSON.stringify(INITIAL_MOCK_USERS));
      }
    } catch (e) {
      console.error("Erro ao carregar usuários:", e);
      setUsers(INITIAL_MOCK_USERS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
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
    if (!Array.isArray(users)) return [];
    return users.filter(u => {
      if (!u || typeof u !== 'object') return false;
      
      // Conversão segura para string para evitar crash se o dado não for texto
      const name = String(u.name || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const role = String(u.role || "");
      
      const matchesSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
      const matchesRole = !roleFilter || role === roleFilter;
      
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
    setFormData({ name: "", email: "", phone: "+55 ", role: "Cliente" });
  };

  const handleResetData = () => {
    if (window.confirm("Isso irá resetar a lista de usuários para o padrão. Continuar?")) {
      localStorage.setItem("kifome_users", JSON.stringify(INITIAL_MOCK_USERS));
      loadUsers();
      showSuccess("Dados resetados!");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carregando usuários...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {roleFilter ? `Usuários: ${roleFilter}s` : "Todos os Usuários"}
          </h1>
          <p className="text-slate-500 font-medium">Gerencie clientes, lojistas e equipe do sistema.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetData} className="rounded-xl font-bold h-12 border-slate-200 text-slate-400 hover:text-orange-600">
            <RefreshCw size={18} />
          </Button>
          <Button onClick={() => setIsAddUserOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2">
            <UserPlus size={18} /> Novo Usuário
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar por nome ou e-mail..." 
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
                  <td className="px-8 py-6 font-black text-slate-900 uppercase text-sm">{user.name || "Sem Nome"}</td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase border-orange-200 bg-orange-50 text-orange-600">{user.role || "Cliente"}</Badge>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{user.phone || "N/A"}</td>
                  <td className="px-8 py-6 text-right">
                    <Button onClick={() => navigate(`/admin/users/edit/${user.id}`)} className="bg-slate-900 hover:bg-black text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase">Ver Perfil</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} className="opacity-20" />
                      <span>Nenhum usuário encontrado</span>
                    </div>
                  </td>
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
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome</Label>
                <Input placeholder="Nome completo" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail</Label>
                <Input placeholder="E-mail de acesso" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nível de Acesso</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                    <SelectItem value="Proprietário">Proprietário (Lojista)</SelectItem>
                    <SelectItem value="Gestor Master">Gestor Master</SelectItem>
                    <SelectItem value="Parceiro">Parceiro</SelectItem>
                    <SelectItem value="Entregador">Entregador</SelectItem>
                    <SelectItem value="Garçom">Garçom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button type="submit" className="w-full bg-orange-600 h-12 font-black uppercase text-[10px]">Cadastrar Usuário</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;