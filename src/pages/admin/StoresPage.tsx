"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, MoreVertical, Edit2 } from "lucide-react";

const STORES = [
  { id: 1, name: "LOJA TESTE", zone: "Zone: Matriz - RN", owner: "Helio Junio", date: "2023-06-15", status: "Inativo", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100" },
  { id: 2, name: "LOJA TESTE 2", zone: "Zone: Matriz - RN", owner: "Helio Junio", date: "2023-06-15", status: "Inativo", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100" },
  { id: 3, name: "Ki + Lanches", zone: "Zone: Lavras - MG", owner: "Helio Junio", date: "2023-07-06", status: "Ativo", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100" },
];

const StoresPage = () => {
  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gerenciamento de Lojas</h1>
          <p className="text-slate-500 font-medium">Controle todas as unidades parceiras do sistema.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl font-bold flex gap-2 h-12">
            <Download size={18} /> Exportar CSV
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black px-6 h-12 uppercase tracking-widest shadow-lg shadow-orange-100">
            <Plus size={18} className="mr-2" /> Adicionar nova loja
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Pesquise por nome, zona ou proprietário..." className="pl-10 h-12 bg-white rounded-xl border-slate-200" />
          </div>
          <Button variant="outline" className="rounded-xl font-bold gap-2">
            <Filter size={18} /> Filtros Avançados
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imagem</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nome</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zonas Operacionais</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Proprietário</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data de Entrada</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STORES.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                      <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="font-black text-slate-900 uppercase group-hover:text-orange-600 transition-colors">{store.name}</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">Brasil</span>
                      <span className="text-[10px] text-slate-400 font-medium">{store.zone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-bold text-slate-700">{store.owner}</span>
                  </td>
                  <td className="px-8 py-4 text-xs font-bold text-slate-500">{store.date}</td>
                  <td className="px-8 py-4">
                    <Badge className={store.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}>
                      {store.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 bg-slate-900 text-white hover:bg-orange-600">
                        <Edit2 size={14} />
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

export default StoresPage;