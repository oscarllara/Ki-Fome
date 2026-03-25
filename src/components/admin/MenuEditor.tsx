"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

const MenuEditor = () => {
  const [items, setItems] = useState([
    { id: 1, name: "X-Burger Especial", category: "Lanches", price: "R$ 25,90", status: "Ativo", stock: 15 },
    { id: 2, name: "Pizza Calabresa Grande", category: "Pizzas", price: "R$ 55,00", status: "Ativo", stock: 8 },
    { id: 3, name: "Combo Sushi 20pçs", category: "Japonesa", price: "R$ 89,90", status: "Indisponível", stock: 0 },
    { id: 4, name: "Suco de Laranja 500ml", category: "Bebidas", price: "R$ 12,00", status: "Ativo", stock: 50 },
  ]);

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    showSuccess("Item removido do cardápio.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar no cardápio..." 
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl font-bold flex gap-2">
            <Filter size={18} /> Filtrar
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex gap-2">
            <Plus size={18} /> Novo Item
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Preço</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estoque</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">{item.price}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{item.stock} un.</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs font-bold text-slate-700">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50">
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuEditor;