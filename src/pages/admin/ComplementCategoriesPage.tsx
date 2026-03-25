"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Plus, Trash2, ListTree, Settings2
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const ComplementCategoriesPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([
    { id: 1, name: "Coca-Cola Tradicional", price: "0.00", active: true },
    { id: 2, name: "Cola-Cola Zero", price: "0.00", active: true },
    { id: 3, name: "Guaraná Antártica", price: "0.00", active: true },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", price: "0.00", active: true }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <AdminLayout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Categorias de Adicionais</h1>
          <p className="text-slate-500 font-medium">Gerencie grupos de complementos e suas regras.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 px-6">
            <Plus size={18} className="mr-2" /> Adicionar Categoria
          </Button>
        )}
      </header>

      {isEditing ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3">
             <Settings2 className="text-orange-500" size={20} />
             <h3 className="font-black text-slate-900 uppercase tracking-tight">Detalhes Adicionais</h3>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 flex items-center">
                  <span className="text-red-500 mr-1">*</span>Nome Adicional:
                </Label>
                <Input placeholder="Ex: Opções de Refrigerantes" className="rounded-xl h-12 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 flex items-center">
                  <span className="text-red-500 mr-1">*</span>Tipo:
                </Label>
                <Select defaultValue="unica">
                  <SelectTrigger className="h-12 rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="unica" className="font-bold">Seleção Única</SelectItem>
                    <SelectItem value="multipla" className="font-bold">Seleção Múltipla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400">Descrição:</Label>
                <Input placeholder="Breve descritivo (50-80 caracteres)" className="rounded-xl h-12" />
                <p className="text-[10px] font-bold text-slate-400 uppercase italic">(Isso será exibido na página de Itens ao selecionar Categorias de Adicionais)</p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ListTree className="text-slate-400" size={18} />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Adicionais</h4>
                </div>
                <Button variant="outline" size="sm" onClick={addItem} className="rounded-lg font-bold border-slate-200">
                  <Plus size={14} className="mr-1" /> Adicionar item
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-3 items-center group">
                    <Input 
                      placeholder="Nome do item" 
                      className="rounded-xl h-12 flex-[3] font-bold" 
                      defaultValue={item.name}
                    />
                    <Input 
                      placeholder="Preço" 
                      className="rounded-xl h-12 flex-1 font-black text-center" 
                      defaultValue={item.price}
                    />
                    <Input 
                      placeholder="." 
                      className="rounded-xl h-12 flex-1" 
                    />
                    <div className="flex items-center gap-4 px-4 h-12 bg-slate-50 rounded-xl border border-slate-100">
                      <Switch checked={item.active} />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="rounded-xl h-12 w-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 px-8">Cancelar</Button>
            <Button onClick={() => { setIsEditing(false); showSuccess("Categoria salva!"); }} className="bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-10">
              Salvar Categoria
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <ListTree size={32} />
          </div>
          <p className="text-slate-400 font-bold uppercase text-xs">Selecione uma categoria para editar ou crie uma nova.</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default ComplementCategoriesPage;