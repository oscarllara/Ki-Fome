"use client";

import { useState, useMemo } from "react";
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
  Plus, Search, Edit2, Save, X, Utensils, Store, 
  ArrowLeft, ImageIcon, ChevronRight 
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess } from "@/utils/toast";

// Mocks para demonstração da lógica
const MOCK_STORES = [
  { id: 1, name: "LOJA TESTE", owner: "Helio Junio" },
  { id: 2, name: "LOJA TESTE 2", owner: "Helio Junio" },
  { id: 3, name: "Ki + Lanches", owner: "Helio Junio" },
  { id: 4, name: "Pizzaria Express", owner: "Maria Souza" },
];

const INITIAL_ITEMS = [
  { 
    id: 10, 
    name: "X-TURBO BURGUER", 
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    stores: [1, 2, 3], 
    category: "SANDUÍCHE", 
    price: "22.90", 
    status: true 
  },
  { 
    id: 9, 
    name: "COMBO CASAL", 
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400",
    stores: [1, 3], 
    category: "COMBOS", 
    price: "45.00", 
    status: true 
  },
];

const ItemsPage = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Estados do Formulário
  const [selectedOwner, setSelectedOwner] = useState("Helio Junio");
  const [linkedStores, setLinkedStores] = useState<number[]>([]);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setLinkedStores(item.stores);
    setView("form");
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setLinkedStores([]);
    setView("form");
  };

  const toggleStatus = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, status: !item.status } : item));
    showSuccess("Status do item atualizado!");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(editingItem ? "Item atualizado com sucesso!" : "Novo item cadastrado!");
    setView("list");
  };

  // Filtra lojas disponíveis apenas para o proprietário selecionado
  const availableStores = MOCK_STORES.filter(s => s.owner === selectedOwner);

  if (view === "form") {
    return (
      <AdminLayout>
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 hover:text-orange-600 transition-colors">
          <ArrowLeft size={14} /> Voltar para lista
        </button>

        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
               <Utensils size={20} />
             </div>
             <h3 className="font-black text-slate-900 uppercase tracking-tight">
               {editingItem ? `Editando: ${editingItem.name}` : "Novo Produto"}
             </h3>
          </div>

          <div className="p-8 space-y-10">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400">Nome do Produto</Label>
                  <Input defaultValue={editingItem?.name} className="rounded-xl h-12 font-bold" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400">Descrição</Label>
                  <Textarea className="rounded-xl min-h-[120px]" placeholder="Ingredientes e detalhes..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">Preço (R$)</Label>
                    <Input defaultValue={editingItem?.price} className="rounded-xl h-12 font-black text-lg" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">Categoria</Label>
                    <Select defaultValue={editingItem?.category || "SANDUÍCHE"}>
                      <SelectTrigger className="h-12 rounded-xl font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SANDUÍCHE">SANDUÍCHE</SelectItem>
                        <SelectItem value="COMBOS">COMBOS</SelectItem>
                        <SelectItem value="BEBIDAS">BEBIDAS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="text-orange-500" size={18} />
                    <Label className="text-xs font-black uppercase text-slate-400">Lojas Vinculadas (Mismo Gestor)</Label>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Gestor Selecionado:</span>
                      <span className="font-black text-slate-900">{selectedOwner}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {availableStores.map(store => (
                        <div key={store.id} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <Checkbox 
                            id={`store-${store.id}`}
                            checked={linkedStores.includes(store.id)}
                            onCheckedChange={(checked) => {
                              if (checked) setLinkedStores([...linkedStores, store.id]);
                              else setLinkedStores(linkedStores.filter(id => id !== store.id));
                            }}
                          />
                          <label htmlFor={`store-${store.id}`} className="text-sm font-bold text-slate-700 cursor-pointer uppercase">
                            {store.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">
                      * Apenas lojas do gestor "{selectedOwner}" podem ser vinculadas a este item.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-900 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setView("list")} className="text-white hover:bg-white/10 rounded-xl font-bold uppercase text-[10px]">Cancelar</Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-12 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20">
              <Save size={18} className="mr-2" /> Salvar Produto
            </Button>
          </div>
        </form>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gestão de Cardápio</h1>
          <p className="text-slate-500 font-medium">Controle os produtos disponíveis em todas as suas unidades.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black h-12 px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100">
          <Plus size={18} className="mr-2" /> Cadastrar novo produto
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar por nome ou categoria..." 
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Imagem</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lojas Vinculadas</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4 font-bold text-slate-300">#{item.id}</td>
                  <td className="px-8 py-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="font-black text-slate-900 uppercase group-hover:text-orange-600 transition-colors">{item.name}</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.stores.map(sid => (
                        <Badge key={sid} variant="secondary" className="bg-slate-100 text-slate-500 font-bold border-none text-[9px] uppercase px-2">
                          {MOCK_STORES.find(s => s.id === sid)?.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase px-3 py-1">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="px-8 py-4 font-black text-slate-900">R$ {item.price}</td>
                  <td className="px-8 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      className={`border-none font-black text-[9px] uppercase px-3 py-1 rounded-full transition-all active:scale-90
                        ${item.status ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}
                      `}
                    >
                      {item.status ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Button 
                      onClick={() => handleEdit(item)}
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 bg-slate-900 text-white hover:bg-black rounded-xl"
                    >
                      <Edit2 size={16} />
                    </Button>
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