"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, UserPlus, AlertCircle, Loader2, RefreshCw, Trash2
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

const INITIAL_MOCK_USERS = [
  { id: 234, name: "Lojista Teste", email: "lojista@teste.com", phone: "+55 (35) 99999-9999", role: "Proprietário", status: "Ativo" },
  { id: 233, name: "Felipe Denis", email: "felipe@gmail.com", phone: "+55 (88) 99926-6723", role: "Cliente", status: "Ativo" },
  { id: 232, name: "ITALO AMORIM", email: "ytallo@gmail.com", phone: "+55 (41) 99694-6230", role: "Entregador", status: "Ativo" },
  { id: 229, name: "Helio Junio", email: "helio@kifome.com", phone: "+55 (35) 88888-8888", role: "Gestor Master", status: "Ativo" },
];

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Função para carregar dados com segurança máxima
  const loadUsers = () => {
    setIsLoading(true);
    try {
      const savedData = localStorage.getItem("kifome_users");
      
      if (!savedData || savedData === "undefined" || savedData === "null") {
        setUsers(INITIAL_MOCK_USERS);
        localStorage.setItem("kifome_users", JSON.stringify(INITIAL_MOCK_USERS));
      } else {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          // Filtra apenas objetos que tenham ID e Nome (evita crash no map)
          const validUsers = parsed.filter(u => u && typeof u === 'object' && u.id && u.name);
          setUsers(validUsers);
        } else {
          throw new Error("Dados não são um array");
        }
      }
    } catch (e) {
      console.error("Erro crítico ao carregar usuários, resetando...", e);
      setUsers(INITIAL_MOCK_USERS);
      localStorage.setItem("kifome_users", JSON.stringify(INITIAL_MOCK_USERS));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtro de Função baseado na URL
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
      const name = String(u.name || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const role = String(u.role || "");
      
      const matchesSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
      const matchesRole = !roleFilter || role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleHardReset = () => {
    if (window.confirm("Isso irá apagar todos os usuários customizados e voltar ao padrão do sistema. Deseja continuar?")) {
      localStorage.removeItem("kifome_users");
      loadUsers();
      showSuccess("Sistema de usuários resetado com sucesso!");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carregando...</p>
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
          <p className="text-slate-500 font-medium">Gerenciamento central de contas.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleHardReset} 
            className="rounded-xl font-bold h-12 border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 gap-2"
            title="Limpar Cache e Resetar"
          >
            <Trash2 size={18} /> Resetar Dados
          </Button>
          <Button onClick={() => navigate("/admin/users/all")} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2">
            <Plus size={18} /> Novo Usuário
          </Button>
        </div>
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
                <tr key={String(user.id)} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-6 font-black text-slate-900 uppercase text-sm">
                    {String(user.name || "Sem Nome")}
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase border-orange-200 bg-orange-50 text-orange-600">
                      {String(user.role || "Cliente")}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">
                    {String(user.phone || user.email || "N/A")}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button 
                      onClick={() => navigate(`/admin/users/edit/${user.id}`)} 
                      className="bg-slate-900 hover:bg-black text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase"
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;