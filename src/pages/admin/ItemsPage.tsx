"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  X, Image as ImageIcon, Sparkles, Utensils,
  ChevronRight, Save, Power
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const ItemsPage = () => {
  const [selectedComplements, setSelectedComplements] = useState(["Adicionais"]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Item atualizado com sucesso!");
  };

  return (
    <AdminLayout>
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          Itens & Menu <ChevronRight size={10} /> Editar Item
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Detalhes do Item</h1>
      </header>

      <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
           <Utensils className="text-orange-500" size={20} />
           <h3 className="font-black text-slate-900 uppercase tracking-tight">Editar Item - X-Turbo Burguer</h3>
        </div>

        <div className="p-8 space-y-10">
          {/* Informações Básicas */}
          <section className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400"><span className="text-red-500 mr-1">*</span>Nome do item:</Label>
              <Input defaultValue="X-Turbo Burguer" className="rounded-xl h-12 font-bold text-lg" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400">Descrição do item:</Label>
              <Textarea 
                defaultValue="Pão, Alface, Hambúrguer, Maionese Caseira, Tomate, Abacaxi, Batata-Palha" 
                className="rounded-xl min-h-[150px] font-medium p-4 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400"><span className="text-red-500 mr-1">*</span>Preço:</Label>
                <div className="flex gap-2">
                  <Input defaultValue="22.90" className="rounded-xl h-12 font-black text-xl" />
                  <Button type="button" variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] h-12 px-6 uppercase tracking-widest rounded-xl shrink-0">
                    <Sparkles size={14} className="mr-2" /> Adicionar preço com desconto
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Relacionamentos */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-slate-50">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400"><span className="text-red-500 mr-1">*</span>Loja a qual o item pertence:</Label>
              <Select defaultValue="teste-helio">
                <SelectTrigger className="h-12 rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="teste-helio" className="font-bold">Loja Teste - Helio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400"><span className="text-red-500 mr-1">*</span>Categoria dos itens:</Label>
              <Select defaultValue="sanduiche">
                <SelectTrigger className="h-12 rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="sanduiche" className="font-bold uppercase">SANDUÍCHE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-black uppercase text-slate-400">Categorias de complemento do item:</Label>
              <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-xl bg-slate-50 min-h-[50px]">
                {selectedComplements.map(comp => (
                  <Badge key={comp} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
                    {comp} <X size={12} className="cursor-pointer" />
                  </Badge>
                ))}
              </div>
            </div>
          </section>

          {/* Mídia e Atributos */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-50">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase text-slate-400">Imagem:</Label>
              <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400" 
                  alt="Item" 
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
                <div className="flex flex-col gap-2">
                  <button type="button" className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline text-left">Remover a imagem</button>
                  <Input type="file" className="text-xs font-bold" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dimensão da imagem 486 x 355</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Label className="text-xs font-black uppercase text-slate-600 tracking-tight">É recomendado?</Label>
                  <Switch defaultChecked className="data-[state=checked]:bg-red-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Label className="text-xs font-black uppercase text-slate-600 tracking-tight">É popular?</Label>
                  <Switch defaultChecked className="data-[state=checked]:bg-purple-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Label className="text-xs font-black uppercase text-slate-600 tracking-tight">Gourmet?</Label>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase text-slate-400">Origem Vegetal / Origem Animal:</Label>
                <RadioGroup defaultValue="animal" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetal" id="r1" />
                    <Label htmlFor="r1" className="text-xs font-bold">Vegetal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="animal" id="r2" />
                    <Label htmlFor="r2" className="text-xs font-bold">Origem Animal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ambos" id="r3" />
                    <Label htmlFor="r3" className="text-xs font-bold">Ambos</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="button" className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3">
                <Power size={20} /> DESABILITAR
              </Button>
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-900 flex justify-end">
          <Button type="submit" className="h-14 px-12 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-black/20">
            <Save size={18} /> ATUALIZAR
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ItemsPage;