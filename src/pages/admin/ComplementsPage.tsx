"use client";

import { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Plus, Trash2, ListTree, Settings2, Search, Edit2
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const DEFAULT_COMPLEMENTS = [
  { id: 1, name: "ADICIONAIS LANCHES", type: "multipla", itemsCount: 3, status: true },
  { id: 2, name: "OPÇÕES DE REFRIGERANTES", type: "unica", itemsCount: 3, status: true },
];

const ComplementsPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState("unica");
  const [catItems, setCatItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kifome_complements");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(DEFAULT_COMPLEMENTS);
      localStorage.setItem("kifome_complements", JSON.stringify(DEFAULT_COMPLEMENTS));
    }
  }, []);

  const saveToStorage = (updated: any[]) => {
    setCategories(updated);
    localStorage.setItem("kifome_complements", JSON.stringify(updated));
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setCatName(cat.name);
    setCatType(cat.type);
    setCatItems(cat.options || [{ id: Date.now(), name: "", price: "R$ 0,00", active: true }]);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!catName) return;

    let updated;
    if (editingId) {
      updated = categories.map(c => 
        c.id === editingId 
        ? { ...c, name: catName.toUpperCase(), type: catType, itemsCount: catItems.length, options: catItems } 
        : c
      );
      showSuccess("Complemento atualizado!");
    } else {
      const newCategory = {
        id: Date.now(),
        name: catName.toUpperCase(),
        type: catType,
        itemsCount: catItems.length,
        options: catItems,
        status: true
      };
      updated = [newCategory, ...categories];
      showSuccess("Novo complemento criado!");
    }

    saveToStorage(updated);
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setCatName("");
    setCatType("unica");
    setCatItems([]);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Excluir este grupo de complementos?")) {
      const updated = categories.filter(c => c.id !== id);
      saveToStorage(updated);
      showSuccess("Removido.");
    }
  };

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gestão de Complementos</h1>
        </div>
        {!isEditing && (
          <Button onClick={() => { resetForm(); setIsEditing(true); }} className="bg-emerald-500 text-white rounded-xl font-bold h-12 px-6">
            <Plus size={18} className="mr-2" /> Novo Complemento
          </Button>
        )}
      </header>

      {isEditing ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3">
             <Settings2 className="text-orange-500" size={20} />
             <h3 className="font-black text-slate-900 uppercase">{editingId ? "Editar" : "Novo"} Complemento</h3>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400">Nome do Grupo</Label>
                <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Ex: Escolha seu molho" className="rounded-xl h-12 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400">Regra de Seleção</Label>
                <Select value={catType} onValueChange={setCatType}>
                  <SelectTrigger className="h-12 rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unica">Apenas uma opção (Rádio)</SelectItem>
                    <SelectItem value="multipla">Múltiplas opções (Checkbox)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-black text-slate-900 uppercase">Opções do Grupo</h4>
                <Button variant="outline" size="sm" onClick={() => setCatItems([...catItems, { id: Date.now(), name: "", price: "R$ 0,00", active: true }])} className="rounded-lg font-bold">+ Adicionar Opção</Button>
              </div>

              <div className="space-y-3">
                {catItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <Input placeholder="Nome da opção" className="rounded-xl h-12 flex-[3] font-bold" value={item.name} onChange={(e) => setCatItems(catItems.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))} />
                    <Input className="rounded-xl h-12 flex-1 font-black text-center" value={item.price} onChange={(e) => setCatItems(catItems.map(i => i.id === item.id ? { ...i, price: e.target.value } : i))} />
                    <Button variant="ghost" size="icon" onClick={() => setCatItems(catItems.filter(i => i.id !== item.id))} className="text-red-500"><Trash2 size={18} /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={resetForm} className="rounded-xl font-bold uppercase text-[10px] h-12">Cancelar</Button>
            <Button onClick={handleSave} className="bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] h-12 px-10">Salvar Complemento</Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 bg-white rounded-xl border-slate-200" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grupo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Regra</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 font-black text-slate-900 uppercase">{cat.name}</td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">{cat.type === 'unica' ? 'Única' : 'Múltipla'}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => handleEdit(cat)} variant="ghost" size="icon" className="h-9 w-9 bg-slate-900 text-white rounded-lg"><Edit2 size={14} /></Button>
                        <Button onClick={() => handleDelete(cat.id)} variant="ghost" size="icon" className="h-9 w-9 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ComplementsPage;