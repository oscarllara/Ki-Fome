"use client";

import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit2, GripVertical, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { showSuccess } from "@/utils/toast";

const INITIAL_CATEGORIES = [
  { id: 125, name: "LANCHES ARTESANAIS", itemsCount: 7, status: true, createdBy: "Derick De Carvalho", createdAt: "1 ano atrás" },
  { id: 124, name: "SOBREMESAS", itemsCount: 0, status: true, createdBy: "Derick De Carvalho", createdAt: "1 ano atrás" },
  { id: 123, name: "BEBIDAS", itemsCount: 0, status: true, createdBy: "Derick De Carvalho", createdAt: "1 ano atrás" },
  { id: 122, name: "PIZZAS de 35 Cm / 8 Pedaços", itemsCount: 17, status: true, createdBy: "Derick De Carvalho", createdAt: "1 ano atrás" },
];

const MenuCategoriesPage = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({ name: "", status: true });

  const sortedCategories = useMemo(() => {
    return [...categories]
      .filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, search]);

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", status: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (cat: any) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, status: cat.status });
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
        ? { ...c, name: formData.name.toUpperCase(), status: formData.status } 
        : c
      ));
      showSuccess("Categoria atualizada!");
    } else {
      const newCategory = {
        id: Math.floor(Math.random() * 1000),
        name: formData.name.toUpperCase(),
        itemsCount: 0,
        status: formData.status,
        createdBy: "Dono do Sistema",
        createdAt: "Agora mesmo"
      };
      setCategories([newCategory, ...categories]);
      showSuccess("Nova categoria cadastrada!");
    }

    setIsDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, status: !cat.status } : cat
    ));
    showSuccess("Status da categoria alterado!");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Total <span className="text-orange-600">({categories.length})</span> Categorias de menu
          </h1>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 px-6 shadow-lg shadow-emerald-100"
        >
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
                    <Badge variant="outline" className={`border-none font-black text-[9px] uppercase px-3 py-1 rounded-full ${cat.status ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
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
                      <Button 
                        onClick={() => openEditDialog(cat)}
                        variant="ghost" 
                        className="bg-slate-900 hover:bg-black text-white h-9 px-4 rounded-lg font-bold text-xs"
                      >
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

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none">
          <form onSubmit={handleSave}>
            <DialogHeader className="p-8 bg-slate-900 text-white">
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-bold uppercase">
                Defina o nome que aparecerá no cardápio do cliente.
              </DialogDescription>
            </DialogHeader>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Categoria</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: BEBIDAS, PIZZAS..." 
                  className="rounded-xl h-12 font-bold uppercase"
                  required
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-700 uppercase">Status da Categoria</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Ativar exibição no cardápio</span>
                </div>
                <Switch 
                  checked={formData.status} 
                  onCheckedChange={(val) => setFormData({ ...formData, status: val })} 
                />
              </div>
            </div>

            <DialogFooter className="p-8 bg-slate-50 flex gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1 shadow-lg shadow-orange-100"
              >
                <Save size={16} className="mr-2" /> 
                {editingCategory ? "Salvar Alterações" : "Cadastrar Agora"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MenuCategoriesPage;