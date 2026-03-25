"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Download, Edit2, MapPin, 
  Image as ImageIcon, Percent, Truck, Wallet, Utensils
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showSuccess } from "@/utils/toast";

const STORES = [
  { id: 1, name: "LOJA TESTE", zone: "Zone: Matriz - RN", owner: "Helio Junio", date: "2023-06-15", status: "Inativo", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100" },
  { id: 2, name: "LOJA TESTE 2", zone: "Zone: Matriz - RN", owner: "Helio Junio", date: "2023-06-15", status: "Inativo", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100" },
  { id: 3, name: "Ki + Lanches", zone: "Zone: Lavras - MG", owner: "Helio Junio", date: "2023-07-06", status: "Ativo", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100" },
];

const StoresPage = () => {
  const [deliveryType, setDeliveryType] = useState("fixed");
  const [cashbackEnabled, setCashbackEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = (type: string) => {
    showSuccess(`Relatório de Lojas (${type}) sendo gerado...`);
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Loja cadastrada com sucesso!");
    setIsDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gerenciamento de Lojas</h1>
          <p className="text-slate-500 font-medium">Controle todas as unidades parceiras do sistema.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => handleExport('CSV')} className="rounded-xl font-bold flex gap-2 h-12">
            <Download size={18} /> Exportar CSV
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black px-6 h-12 uppercase tracking-widest shadow-lg shadow-orange-100">
                <Plus size={18} className="mr-2" /> Adicionar nova loja
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-[2.5rem] overflow-hidden">
              <form onSubmit={handleSaveStore}>
                <DialogHeader className="p-8 bg-slate-900 text-white">
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight">Nova Unidade Parceira</DialogTitle>
                  <DialogDescription className="text-slate-400 font-medium">Preencha todos os detalhes para ativar a loja no sistema.</DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[60vh] p-8">
                  <div className="space-y-10">
                    {/* Seção 1: Informações Básicas */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Utensils size={18}/></div>
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Informações Básicas</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Nome da Loja</Label>
                          <Input placeholder="Ex: Big Burger Artesanal" className="rounded-xl h-12" required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Descrição</Label>
                          <Input placeholder="Breve resumo da loja" className="rounded-xl h-12" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Endereço Completo</Label>
                          <Input placeholder="Rua, Número, Bairro, Cidade - UF" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Ponto de Referência</Label>
                          <Input placeholder="Ex: Próximo ao shopping" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Link Google Maps</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input placeholder="URL da localização" className="pl-10 rounded-xl h-12" />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Seção 2: Configurações de Operação */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Truck size={18}/></div>
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Operação e Logística</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Tempo Entrega (min)</Label>
                          <Input type="text" placeholder="Ex: 30-45" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Tempo Retirada (min)</Label>
                          <Input type="text" placeholder="Ex: 15-20" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Preço Médio (2 pess.)</Label>
                          <Input placeholder="R$ 0,00" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Pedido Mín. Entrega</Label>
                          <Input placeholder="R$ 0,00" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Pedido Mín. Retirada</Label>
                          <Input placeholder="R$ 0,00" className="rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-slate-400 ml-1">Comissão Gestor (%)</Label>
                          <Input placeholder="Ex: 10" className="rounded-xl h-12 border-orange-200 focus:ring-orange-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-black text-slate-900 uppercase tracking-tight">Status do Pedido</Label>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Loja pode alterar status?</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-black text-slate-900 uppercase tracking-tight">Taxa de Entrega</Label>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Tipo de cobrança</p>
                          </div>
                          <Select value={deliveryType} onValueChange={setDeliveryType}>
                            <SelectTrigger className="w-[140px] rounded-xl font-bold uppercase text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                              <SelectItem value="fixed" className="text-[10px] font-bold uppercase">Fixa</SelectItem>
                              <SelectItem value="dynamic" className="text-[10px] font-bold uppercase">Dinâmica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Campos Condicionais de Entrega */}
                      {deliveryType === 'fixed' ? (
                        <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                          <Label className="text-[10px] font-black uppercase text-orange-600 ml-1">Valor da Taxa Fixa</Label>
                          <Input placeholder="R$ 0,00" className="rounded-xl h-12 bg-white" />
                        </div>
                      ) : (
                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-600">Taxa Básica</Label>
                            <Input placeholder="R$ 0,00" className="rounded-xl h-10 bg-white text-xs" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-600">Dist. Base (km)</Label>
                            <Input placeholder="Ex: 3" className="rounded-xl h-10 bg-white text-xs" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-600">Taxa Extra</Label>
                            <Input placeholder="R$ 0,00" className="rounded-xl h-10 bg-white text-xs" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-600">Dist. Extra (km)</Label>
                            <Input placeholder="Ex: 1" className="rounded-xl h-10 bg-white text-xs" />
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Seção 3: Cashback */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Wallet size={18}/></div>
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Programa de Cashback</h3>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-black text-slate-900 uppercase tracking-tight">Ativar Cashback</Label>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">O saldo poderá ser usado apenas nesta loja.</p>
                          </div>
                          <Switch checked={cashbackEnabled} onCheckedChange={setCashbackEnabled} />
                        </div>

                        {cashbackEnabled && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-slate-400">Tipo de Valor</Label>
                              <Select defaultValue="percent">
                                <SelectTrigger className="rounded-xl font-bold">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  <SelectItem value="percent">Porcentagem (%)</SelectItem>
                                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-slate-400">Valor</Label>
                              <Input placeholder="Ex: 5" className="rounded-xl h-10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-slate-400">Limite de Uso</Label>
                              <Input placeholder="R$ 0,00" className="rounded-xl h-10" />
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Seção 4: Tags e Imagem */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><Percent size={18}/></div>
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Destaques e Mídia</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Switch />
                            <Label className="text-[10px] font-black uppercase text-slate-600">Loja Vegetariana</Label>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Switch />
                            <Label className="text-[10px] font-black uppercase text-slate-600">Loja Vegana</Label>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <Switch />
                            <Label className="text-[10px] font-black uppercase text-orange-600">Em Destaque</Label>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400 ml-1">Imagem da Loja (Obrigatório)</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer">
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-xs font-bold uppercase tracking-widest">Clique para subir imagem</span>
                          <span className="text-[10px] font-medium mt-1">PNG, JPG até 5MB</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>

                <DialogFooter className="p-8 bg-slate-50 border-t flex flex-col sm:flex-row gap-4">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12 flex-1">Cancelar</Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-[2] shadow-lg shadow-orange-100">
                    Cadastrar e Ativar Unidade
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Pesquise por nome, zona ou proprietário..." className="pl-10 h-12 bg-white rounded-xl border-slate-200 shadow-sm" />
          </div>
          <Button variant="outline" className="rounded-xl font-bold gap-2">
            <Filter size={18} /> Filtros Avançados
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imagem</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nome</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zonas Operacionais</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Proprietário</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data de Entrada</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STORES.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                      <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="font-black text-slate-900 uppercase group-hover:text-orange-600 transition-colors">{store.name}</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">Brasil</span>
                      <span className="text-[10px] text-slate-400 font-medium">{store.zone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-bold text-slate-700">{store.owner}</span>
                  </td>
                  <td className="px-8 py-4 text-xs font-bold text-slate-500">{store.date}</td>
                  <td className="px-8 py-4">
                    <Badge className={store.status === 'Ativo' ? 'bg-green-100 text-green-700 border-none' : 'bg-slate-100 text-slate-500 border-none'}>
                      {store.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 bg-slate-900 text-white hover:bg-orange-600 transition-colors">
                        <Edit2 size={14} />
                      </Button>
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

export default StoresPage;