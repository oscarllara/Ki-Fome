"use client";

import { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit2, ChevronUp, ChevronDown, Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { showSuccess } from "@/utils/toast";

const DEFAULT_CATEGORIES = [
  { id: 1, name: "LANCHES ARTESANAIS", itemsCount: 0, status: true },
  { id: 2, name: "PIZZAS", itemsCount: 0, status: true },
  { id: 3, name: "BEBIDAS", itemsCount: 0, status: true },
];

const MenuCategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", status: true });

  // Carregar do LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("kifome_categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem("kifome_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []);

  const saveToStorage = (updated: any[]) => {
    setCategories(updated);
    localStorage.setItem("kifome_categories", JSON.stringify(updated));
  };

  const displayCategories = useMemo(() => {
    return categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    let updated;
    if (editingCategory) {
      updated = categories.map(c => 
        c.id === editingCategory.id 
        ? { ...c, name: formData.name.toUpperCase(), status: formData.status } 
        : c
      );
      showSuccess("Categoria atualizada!");
    } else {
      const newCat = {
        id: Date.now(),
        name: formData.name.toUpperCase(),
        itemsCount: 0,
        status: formData.status
      };
      updated = [newCat, ...categories];
      showSuccess("Nova categoria criada!");
    }
    saveToStorage(updated);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Excluir esta categoria?")) {
      const updated = categories.filter(c => c.id !== id);
      saveToStorage(updated);
      showSuccess("Categoria removida.");
    }
  };

  const toggleStatus = (id: number) => {
    const updated = categories.map(cat => 
      cat.id === id ? { ...cat, status: !cat.status } : cat
    );
    saveToStorage(updated);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Categorias de menu <span className="text-orange-600">({categories.length})</span>
          </h1>
        </div>
        <Button 
          onClick={() => { setEditingCategory(null); setFormData({ name: "", status: true }); setIsDialogOpen(true); }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 px-6"
        >
          <Plus size={18} className="mr-2" /> Adicionar nova categoria
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4 font-black text-slate-900 uppercase">{cat.name}</td>
                  <td className="px-8 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(cat.id)}
                      className={`border-none font-black text-[9px] uppercase px-3 py-1 rounded-full transition-all
                        ${cat.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                      `}
                    >
                      {cat.status ? 'ATIVO' : 'INATIVO'}
                    </button>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button onClick={() => { setEditingCategory(cat); setFormData({ name: cat.name, status: cat.status }); setIsDialogOpen(true); }} variant="ghost" size="icon" className="h-9 w-9 bg-slate-900 text-white rounded-lg"><Edit2 size={14} /></Button>
                      <Button onClick={() => handleDelete(cat.id)} variant="ghost" size="icon" className="h-9 w-9 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden">
          <form onSubmit={handleSave}>
            <DialogHeader className="p-8 bg-slate-900 text-white">
              <DialogTitle className="text-xl font-black uppercase">{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome da Categoria</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: BEBIDAS" className="rounded-xl h-12 font-bold uppercase" required />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-black text-slate-700 uppercase">Ativa no Menu?</span>
                <Switch checked={formData.status} onCheckedChange={(val) => setFormData({ ...formData, status: val })} />
              </div>
            </div>
            <DialogFooter className="p-8 bg-slate-50 flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
              <Button type="submit" className="bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] h-12 flex-1">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MenuCategoriesPage;