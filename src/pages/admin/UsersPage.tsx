"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Users, UserPlus, ShieldAlert, RotateCcw, 
  Eye, LogIn, Wallet, Calendar, Phone, Mail, Download
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const MOCK_USERS = [
  { id: 233, name: "Felipe Denis", email: "felipeacompanhamento@gmail.com", phone: "+5588999266723", role: "Customer", wallet: "R$ 0", date: "2026-03-18 11:09 PM", status: "Active" },
  { id: 232, name: "ITALO AMORIM BARBOZA", email: "ytalloamorim49@gmail.com", phone: "41996946230", role: "Delivery Guy", wallet: "R$ 0", date: "2026-03-16 01:31 AM", status: "Active" },
  { id: 231, name: "Catiele Gamboa", email: "gamboacatiele921@gmail.com", phone: "66999560724", role: "Delivery Guy", wallet: "R$ 0", date: "2026-03-06 10:42 PM", status: "Active" },
  { id: 230, name: "Estela", email: "estelacol55@gmail.com", phone: "+5531997065858", role: "Customer", wallet: "R$ 50", date: "2026-03-05 11:55 AM", status: "Active" },
  { id: 229, name: "Poliana Duarte de Freitas", email: "polianaduarteff@gmail.com", phone: "11993684330", role: "Store Owner", wallet: "R$ 1.200", date: "2026-03-02 09:17 AM", status: "Active" },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <AdminLayout>
      <header className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Todos os Usuários</h1>
            <p className="text-slate-500 font-medium">Gerencie clientes, parceiros e equipe do sistema.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2">
              <UserPlus size={18} /> Cadastrar Cliente
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 gap-2">
              <Plus size={18} /> Adicionar Novo Usuário
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none rounded-xl h-12 font-bold gap-2">
            <ShieldAlert size={18} /> Gerenciar funções e permissões
          </Button>
          <Button variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 border-none rounded-xl h-12 font-bold gap-2">
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
            <Button variant="outline" className="h-14 rounded-2xl font-bold gap-2 border-slate-200 text-slate-500 px-6">
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
                    <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-500">
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
    </AdminLayout>
  );
};

// Componentes necessários do Shadcn para o select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default UsersPage;