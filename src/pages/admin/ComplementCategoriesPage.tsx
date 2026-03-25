"use client";

import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Plus, Trash2, ListTree, Settings2, Search, Edit2, GripVertical
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const INITIAL_COMPLEMENT_CATEGORIES = [
  { id: 1, name: "OPÇÕES DE REFRIGERANTES", type: "unica", itemsCount: 3, status: true },
  { id: 2, name: "ADICIONAIS DE BURGER", type: "multipla", itemsCount: 5, status: true },
];

const ComplementCategoriesPage = () => {
  const [categories, setCategories] = useState(INITIAL_COMPLEMENT_CATEGORIES);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  
  // Dados do formulário
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState("unica");
  const [catItems, setCatItems] = useState([
    { id: 1, name: "Coca-Cola Tradicional", price: "R$ 0,00", active: true },
  ]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits || digits === "000") return "R$ 0,00";
    const amount = (parseInt(digits) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return amount;
  };

  const handlePriceChange = (id: number, rawValue: string) => {
    const formatted = formatCurrency(rawValue);
    setCatItems(catItems.map(item => item.id === id ? { ...item, price: formatted } : item));
  };

  const handleSave = () => {
    if (!catName) return;

    const newCategory = {
      id: Date.now(),
      name: catName.toUpperCase(),
      type: catType,
      itemsCount: catItems.length,
      status: true
    };

    setCategories([newCategory, ...categories]);
    setIsEditing(false);
    setCatName("");
    setCatItems([{ id: 1, name: "", price: "R$ 0,00", active: true }]);
    showSuccess("Categoria salva com sucesso!");
  };

  const addItem = () => {
    setCatItems([...catItems, { id: Date.now(), name: "", price: "R$ 0,00", active: true }]);
  };

  const removeItem = (id: number) => {
    setCatItems(catItems.filter(item => item.id !== id));
  };

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Categorias de Adicionais <span className="text-orange-600">({categories.length})</span>
          </h1>
          <p className="text-slate-500 font-medium">Gerencie grupos de complementos e suas regras.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 px-6">
            <Plus size={18} className="mr-2" /> Nova Categoria
          </Button>
        )}
      </header>

      {isEditing ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3">
             <Settings2 className="text-orange-500" size={20} />
             <h3 className="font-black text-slate-900 uppercase tracking-tight">Criar Nova Categoria</h3>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400">Nome Adicional:</Label>
                <Input 
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ex: Opções de Refrigerantes" 
                  className="rounded-xl h-12 font-bold" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400">Tipo de Seleção:</Label>
                <Select value={catType} onValueChange={setCatType}>
                  <SelectTrigger className="h-12 rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="unica" className="font-bold">Seleção Única</SelectItem>
                    <SelectItem value="multipla" className="font-bold">Seleção Múltipla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ListTree className="text-slate-400" size={18} />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Itens do Complemento</h4>
                </div>
                <Button variant="outline" type="button" size="sm" onClick={addItem} className="rounded-lg font-bold">
                  <Plus size={14} className="mr-1" /> Adicionar Linha
                </Button>
              </div>

              <div className="space-y-3">
                {catItems.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-3 items-center group">
                    <Input 
                      placeholder="Nome do item (ex: Coca-Cola)" 
                      className="rounded-xl h-12 flex-[3] font-bold" 
                      value={item.name}
                      onChange={(e) => setCatItems(catItems.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                    />
                    <Input 
                      className="rounded-xl h-12 flex-1 font-black text-center" 
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      onFocus={() => item.price === "R$ 0,00" && handlePriceChange(item.id, "")}
                      onBlur={() => (!item.price || item.price === "R$ ") && handlePriceChange(item.id, "0")}
                    />
                    <div className="flex items-center gap-4 px-4 h-12 bg-slate-50 rounded-xl border border-slate-100">
                      <Switch checked={item.active} onCheckedChange={(val) => setCatItems(catItems.map(i => i.id === item.id ? { ...i, active: val } : i))} />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="rounded-xl h-12 w-12 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl font-bold uppercase text-[10px] h-12">Cancelar</Button>
            <Button onClick={handleSave} className="bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-10">
              Salvar Categoria
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Pesquisar categoria de adicional..." 
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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Categoria</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nº de Itens</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4 font-black text-slate-900 uppercase">{cat.name}</td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">
                      {cat.type === 'unica' ? 'Seleção Única' : 'Seleção Múltipla'}
                    </td>
                    <td className="px-8 py-4 text-center font-bold text-slate-600">{cat.itemsCount} itens</td>
                    <td className="px-8 py-4 text-center">
                      <Badge variant="outline" className={`border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md ${cat.status ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'}`}>
                        {cat.status ? 'ATIVO' : 'INATIVO'}
                      </Badge>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 bg-slate-900 text-white rounded-lg">
                          <Edit2 size={14} />
                        </Button>
                        <button className="text-slate-300 hover:text-slate-600">
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
      )}
    </AdminLayout>
  );
};

export default ComplementCategoriesPage;