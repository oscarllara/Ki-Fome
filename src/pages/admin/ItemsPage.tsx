"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Plus, Search, Edit2, Save, Utensils, Store, 
  ArrowLeft, ImageIcon, Star, Flame, Diamond, Leaf, Bone, Layers, Percent,
  Copy, Trash2, Upload, ListTree
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { showSuccess, showError } from "@/utils/toast";

const ItemsPage = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [complements, setComplements] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("R$ 0,00");
  const [category, setCategory] = useState("");
  const [linkedComplements, setLinkedComplements] = useState<number[]>([]);
  const [promoType, setPromoType] = useState<"fixed" | "percent">("fixed");
  const [promoValue, setPromoValue] = useState("");
  const [origin, setOrigin] = useState("animal");
  const [features, setFeatures] = useState({ recommended: false, popular: false, gourmet: false });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem("kifome_items");
    if (savedItems) setItems(JSON.parse(savedItems));

    const savedCats = localStorage.getItem("kifome_categories");
    if (savedCats) setCategories(JSON.parse(savedCats));

    const savedComps = localStorage.getItem("kifome_complements");
    if (savedComps) setComplements(JSON.parse(savedComps));
  }, []);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "R$ 0,00";
    const amount = (parseInt(digits) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return amount;
  };

  const saveItems = (updated: any[]) => {
    setItems(updated);
    localStorage.setItem("kifome_items", JSON.stringify(updated));
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price || "R$ 0,00");
    setCategory(item.category);
    setLinkedComplements(item.complements || []);
    setFeatures({ 
      recommended: item.isRecommended || false, 
      popular: item.isPopular || false, 
      gourmet: item.isGourmet || false 
    });
    setOrigin(item.origin || "animal");
    setPromoType(item.discountType || "fixed");
    setPromoValue(item.discountValue || "");
    setImagePreview(item.image || null);
    setView("form");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      name: name.toUpperCase(),
      description,
      price,
      category,
      complements: linkedComplements,
      isRecommended: features.recommended,
      isPopular: features.popular,
      isGourmet: features.gourmet,
      origin,
      discountType: promoType,
      discountValue: promoValue,
      status: editingItem ? editingItem.status : true,
      image: imagePreview || "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400"
    };

    let updated;
    if (editingItem) {
      updated = items.map(item => item.id === editingItem.id ? { ...item, ...updatedData } : item);
      showSuccess("Produto atualizado!");
    } else {
      const newItem = { id: Date.now(), ...updatedData };
      updated = [newItem, ...items];
      showSuccess("Novo produto cadastrado!");
    }
    saveItems(updated);
    setView("list");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Excluir este produto?")) {
      saveItems(items.filter(i => i.id !== id));
      showSuccess("Removido.");
    }
  };

  if (view === "form") {
    return (
      <AdminLayout>
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 hover:text-orange-600 transition-colors">
          <ArrowLeft size={14} /> Voltar para lista
        </button>

        <form onSubmit={handleSave} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mb-20">
          <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
             <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
               <Utensils size={24} />
             </div>
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
               {editingItem ? `EDITANDO: ${editingItem.name}` : "NOVO PRODUTO"}
             </h3>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <section className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Imagem do Produto</Label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-44 h-44 bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden group hover:border-orange-400 transition-all cursor-pointer relative"
                    >
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="mb-2" />
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Produto</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl h-14 font-black uppercase text-lg" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição Detalhada</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-2xl min-h-[100px] font-medium" />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Preço (R$)</Label>
                    <Input value={price} onChange={(e) => setPrice(formatCurrency(e.target.value))} className="rounded-2xl h-14 font-black text-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-14 rounded-2xl font-black uppercase text-[11px]">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name} className="font-black">{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* SEÇÃO DE PROMOÇÃO RESTAURADA */}
                <section className="bg-orange-50/50 p-10 rounded-[3rem] border border-orange-100 space-y-8">
                  <div className="flex items-center gap-3">
                    <Flame className="text-orange-600" size={24} />
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Configurar Promoção</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Desconto</Label>
                      <RadioGroup value={promoType} onValueChange={(val: any) => setPromoType(val)} className="flex gap-4">
                        <div className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${promoType === 'fixed' ? 'bg-white border-orange-500 shadow-md' : 'border-slate-200'}`}>
                          <RadioGroupItem value="fixed" id="p-fixed" />
                          <Label htmlFor="p-fixed" className="text-[10px] font-black uppercase cursor-pointer">Valor Fixo (R$)</Label>
                        </div>
                        <div className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${promoType === 'percent' ? 'bg-white border-orange-500 shadow-md' : 'border-slate-200'}`}>
                          <RadioGroupItem value="percent" id="p-perc" />
                          <Label htmlFor="p-perc" className="text-[10px] font-black uppercase cursor-pointer">Porcentagem (%)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor do Desconto</Label>
                      <div className="relative">
                        <Input 
                          value={promoValue} 
                          onChange={(e) => setPromoValue(promoType === 'fixed' ? formatCurrency(e.target.value) : e.target.value)} 
                          className="rounded-2xl h-14 font-black text-xl pl-4" 
                          placeholder={promoType === 'fixed' ? "R$ 0,00" : "0%"}
                        />
                        <div className="absolute right-4 top-4 text-orange-600"><Percent size={20} /></div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ListTree className="text-orange-600" size={18} />
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Anexar Complementos</Label>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {complements.map(comp => (
                      <div key={comp.id} className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all group ${linkedComplements.includes(comp.id) ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                        <Checkbox 
                          id={`comp-${comp.id}`} 
                          checked={linkedComplements.includes(comp.id)} 
                          onCheckedChange={(checked) => checked ? setLinkedComplements([...linkedComplements, comp.id]) : setLinkedComplements(linkedComplements.filter(id => id !== comp.id))} 
                        />
                        <label htmlFor={`comp-${comp.id}`} className="flex flex-col cursor-pointer flex-1">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{comp.name}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">{comp.type === 'unica' ? 'Única' : 'Múltipla'}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-900 flex justify-end">
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-16 h-16 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl">
              <Save size={20} className="mr-3" /> SALVAR PRODUTO
            </Button>
          </div>
        </form>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão de Cardápio</h1>
        <Button onClick={() => { setEditingItem(null); setView("form"); }} className="bg-orange-600 text-white rounded-2xl font-black h-14 px-8 uppercase text-[10px] tracking-widest shadow-xl">
          <Plus size={20} className="mr-2" /> Novo produto
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12 h-14 bg-white rounded-2xl font-bold border-slate-200" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Imagem</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-100 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900 uppercase text-sm">{item.name}</td>
                  <td className="px-8 py-5"><Badge variant="outline" className="text-[8px] font-black uppercase">{item.category}</Badge></td>
                  <td className="px-8 py-5 font-black text-slate-900">{item.price}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleEdit(item)} variant="ghost" size="icon" className="h-12 w-12 bg-slate-900 text-white rounded-2xl"><Edit2 size={18} /></Button>
                      <Button onClick={() => handleDelete(item.id)} variant="ghost" size="icon" className="h-12 w-12 bg-red-50 text-red-500 rounded-2xl"><Trash2 size={18} /></Button>
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

export default ItemsPage;