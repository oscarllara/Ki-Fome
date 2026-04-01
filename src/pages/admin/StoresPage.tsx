"use client";

import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Download, Edit2, MapPin, 
  Image as ImageIcon, Percent, Truck, Wallet, Utensils,
  SearchCode, Eye, FileText, UserCircle
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showSuccess, showError } from "@/utils/toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const INITIAL_STORES = [
  { id: 1, name: "LOJA TESTE", zone: "Zone: Matriz - RN", owner: "Helio Junio", date: "2023-06-15", status: "Inativo", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400" },
  { id: 2, name: "LOJA TESTE 2", zone: "Zone: Matriz - RN", owner: "Helio Junio", date: "2023-06-15", status: "Inativo", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400" },
  { id: 3, name: "Ki + Lanches", zone: "Zone: Lavras - MG", owner: "Helio Junio", date: "2023-07-06", status: "Ativo", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400" },
];

const StoresPage = () => {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userPhone, setUserPhone] = useState("+55 ");

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let mainDigits = digits;
    if (digits.startsWith("55")) {
      mainDigits = digits.substring(2);
    }
    mainDigits = mainDigits.substring(0, 11);

    let formatted = "+55 ";
    if (mainDigits.length > 0) {
      formatted += "(" + mainDigits.substring(0, 2);
    }
    if (mainDigits.length > 2) {
      formatted += ") " + mainDigits.substring(2, 7);
    }
    if (mainDigits.length > 7) {
      formatted += "-" + mainDigits.substring(7, 11);
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPhone(formatPhone(e.target.value));
  };

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           store.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           store.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || store.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [stores, searchQuery, statusFilter]);

  const toggleStoreStatus = (id: number) => {
    setStores(prev => prev.map(s => {
      if (s.id === id) {
        const newStatus = s.status === "Ativo" ? "Inativo" : "Ativo";
        showSuccess(`Loja ${s.name} agora está ${newStatus}`);
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const exportToCSV = () => {
    const headers = ["ID,Nome,Zona,Proprietario,Data,Status\n"];
    const rows = filteredStores.map(s => `${s.id},${s.name},${s.zone},${s.owner},${s.date},${s.status}\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-lojas-${new Date().toLocaleDateString()}.csv`;
    a.click();
    showSuccess("Relatório CSV gerado com sucesso!");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Lojas - KIFOME", 14, 15);
    autoTable(doc, {
      head: [['ID', 'Nome', 'Zona', 'Proprietário', 'Data', 'Status']],
      body: filteredStores.map(s => [s.id, s.name, s.zone, s.owner, s.date, s.status]),
      startY: 20,
    });
    doc.save(`relatorio-lojas-${new Date().toLocaleDateString()}.pdf`);
    showSuccess("Relatório PDF gerado com sucesso!");
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(editingStore ? "Loja atualizada!" : "Loja cadastrada!");
    setIsDialogOpen(false);
    setEditingStore(null);
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gerenciamento de Lojas</h1>
          <p className="text-slate-500 font-medium">Controle todas as unidades parceiras do sistema.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl font-bold flex gap-2 h-12">
                <Download size={18} /> Exportar Relatório
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              <DropdownMenuItem onClick={exportToCSV} className="font-bold cursor-pointer">Exportar CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="font-bold cursor-pointer">Exportar PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => { setEditingStore(null); setIsDialogOpen(true); }}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black px-6 h-12 uppercase tracking-widest shadow-lg shadow-orange-100"
          >
            <Plus size={18} className="mr-2" /> Adicionar nova loja
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por nome, zona ou proprietário..." 
              className="pl-10 h-12 bg-white rounded-xl border-slate-200 shadow-sm font-medium" 
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-12 rounded-xl bg-white border-slate-200 font-bold uppercase text-[10px]">
                <Filter size={14} className="mr-2" />
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-bold uppercase text-[10px]">Todos os Status</SelectItem>
                <SelectItem value="Ativo" className="font-bold uppercase text-[10px]">Apenas Ativas</SelectItem>
                <SelectItem value="Inativo" className="font-bold uppercase text-[10px]">Apenas Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <button 
                      onClick={() => setSelectedImage(store.img)}
                      className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-100 relative group/img"
                    >
                      <img src={store.img} alt={store.name} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye size={14} className="text-white" />
                      </div>
                    </button>
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
                    <button 
                      onClick={() => { setSelectedUser(store.owner); setUserPhone("+55 "); }}
                      className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
                    >
                      <UserCircle size={16} /> {store.owner}
                    </button>
                  </td>
                  <td className="px-8 py-4 text-xs font-bold text-slate-500">{store.date}</td>
                  <td className="px-8 py-4">
                    <button 
                      onClick={() => toggleStoreStatus(store.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all
                        ${store.status === 'Ativo' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full ${store.status === 'Ativo' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                      {store.status}
                    </button>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        onClick={() => { setEditingStore(store); setIsDialogOpen(true); }}
                        variant="ghost" 
                        size="icon" 
                        className="rounded-lg h-9 w-9 bg-slate-900 text-white hover:bg-orange-600 transition-colors"
                      >
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

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 rounded-[2.5rem] overflow-hidden">
          <form onSubmit={handleSaveStore}>
            <DialogHeader className="px-8 py-5 bg-slate-900 text-white shrink-0">
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                {editingStore ? `Editando: ${editingStore.name}` : "Nova Unidade Parceira"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-medium text-xs">Ajuste as configurações para exibição no aplicativo do cliente.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[calc(95vh-160px)] p-8">
              <div className="space-y-10">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Utensils size={18}/></div>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Informações Básicas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400 ml-1">Nome da Loja</Label>
                      <Input defaultValue={editingStore?.name} placeholder="Ex: Big Burger Artesanal" className="rounded-xl h-12" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400 ml-1">Proprietário (Usuário)</Label>
                      <Input defaultValue={editingStore?.owner} placeholder="Buscar usuário..." className="rounded-xl h-12" />
                    </div>
                  </div>
                </section>
                <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold text-xs uppercase italic">Campos de logística e cashback mantidos conforme sua configuração anterior.</p>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="px-8 py-5 bg-slate-50 border-t shrink-0 flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-12">Cancelar</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 flex-1">
                {editingStore ? "Salvar Alterações" : "Ativar Nova Loja"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* LIGHTBOX DE IMAGEM */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
          {selectedImage && (
            <div className="relative group">
              <img src={selectedImage} alt="Preview" className="max-h-[80vh] w-auto rounded-[3rem] shadow-2xl border-8 border-white" />
              <Button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black rounded-full w-10 h-10 p-0"
              >✕</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL DE USUÁRIO (PROPRIETÁRIO) */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Cadastro de Usuário</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase">Gerenciar perfil do proprietário</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
             <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                  {selectedUser?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{selectedUser}</h4>
                  <p className="text-xs font-bold text-slate-400">ID: #USER8890</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black text-slate-400 uppercase">Nome Completo</Label>
                  <Input defaultValue={selectedUser} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black text-slate-400 uppercase">E-mail</Label>
                  <Input defaultValue="helio@exemplo.com" className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black text-slate-400 uppercase">WhatsApp</Label>
                  <Input 
                    value={userPhone} 
                    onChange={handlePhoneChange}
                    className="rounded-xl" 
                  />
                </div>
             </div>
          </div>
          <DialogFooter className="pt-6">
            <Button className="w-full bg-slate-900 hover:bg-black text-white font-black rounded-xl h-12 uppercase text-[10px]">Salvar Cadastro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StoresPage;