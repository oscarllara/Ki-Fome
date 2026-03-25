"use client";

import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Edit2, GripVertical } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const INITIAL_CATEGORIES = [
  { id: 125, name: "LANCHES ARTESANAIS", itemsCount: 7, status: true, createdBy: "Derick De Carvalho", createdAt: "1 year ago" },
  { id: 124, name: "SOBREMESAS", itemsCount: 0, status: true, createdBy: "Derick De Carvalho", createdAt: "1 year ago" },
  { id: 123, name: "BEBIDAS", itemsCount: 0, status: true, createdBy: "Derick De Carvalho", createdAt: "1 year ago" },
  { id: 122, name: "PIZZAS de 35 Cm / 8 Pedaços", itemsCount: 17, status: true, createdBy: "Derick De Carvalho", createdAt: "1 year ago" },
];

const MenuCategoriesPage = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");

  // Ordenação Alfabética por padrão conforme solicitado
  const sortedCategories = useMemo(() => {
    return [...categories]
      .filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, search]);

  const toggleStatus = (id: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, status: !cat.status } : cat
    ));
    showSuccess("Status da categoria atualizado!");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Total <span className="text-orange-600">({categories.length})</span> Categorias de menu
          </h1>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 px-6">
          <Plus size={18} className="mr-2" /> Adicionar nova categoria
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar categoria..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-white rounded-xl border-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº da Categoria</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nº de itens</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Criado por</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Criado em</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4 font-bold text-slate-400">#{cat.id}</td>
                  <td className="px-8 py-4 font-black text-slate-900 uppercase">{cat.name}</td>
                  <td className="px-8 py-4 text-center font-bold text-slate-600">{cat.itemsCount}</td>
                  <td className="px-8 py-4 text-center">
                    <Badge variant="outline" className={`border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md ${cat.status ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'}`}>
                      {cat.status ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </td>
                  <td className="px-8 py-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold border-none">
                      {cat.createdBy}
                    </Badge>
                  </td>
                  <td className="px-8 py-4 text-xs font-bold text-slate-400">{cat.createdAt}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Button variant="ghost" className="bg-slate-900 hover:bg-black text-white h-9 px-4 rounded-lg font-bold text-xs">
                        Editar
                      </Button>
                      <Switch checked={cat.status} onCheckedChange={() => toggleStatus(cat.id)} />
                      <button className="text-slate-300 hover:text-slate-600 transition-colors">
                        <GripVertical size={18} />
                      </button>
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

export default MenuCategoriesPage;