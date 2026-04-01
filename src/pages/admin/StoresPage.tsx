"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Filter, Download, Edit2, MapPin, 
  Image as ImageIcon, Percent, Truck, Wallet, Utensils,
  Eye, FileText, UserCircle, Globe, Instagram, Facebook,
  Clock, Navigation, ShieldCheck, Loader2, Save, X
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showSuccess, showError } from "@/utils/toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const INITIAL_STORES = [
  { 
    id: 1, 
    name: "LOJA TESTE", 
    description: "Hamburgueria artesanal com foco em qualidade.",
    responsible: "Lojista Teste",
    ownerId: 234,
    address: "Rua das Flores, 123",
    city: "Lavras",
    state: "MG",
    zip: "37200-000",
    lat: "-21.2427",
    lng: "-45.0013",
    phone: "+55 (35) 99999-9999",
    whatsapp: "+55 (35) 99999-9999",
    email: "lojateste@kifome.com",
    instagram: "@lojateste",
    facebook: "lojateste",
    site: "www.lojateste.com",
    category: "Burgers",
    storeType: "Hamburgueria",
    deliveryMethod: "Moto",
    atendeDelivery: true,
    workingDays: "Segunda a Sábado",
    openTime: "18:00",
    closeTime: "23:30",
    status: "Ativo", 
    isFeatured: true,
    img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400",
    date: "2023-06-15",
    zone: "Zone: Lavras - MG"
  },
  { 
    id: 3, 
    name: "Ki + Lanches", 
    description: "O melhor lanche da região.",
    responsible: "Helio Junio",
    ownerId: 229,
    address: "Av. Central, 500",
    city: "Lavras",
    state: "MG",
    zip: "37200-000",
    lat: "-21.2488",
    lng: "-44.9980",
    phone: "+55 (35) 88888-8888",
    whatsapp: "+55 (35) 88888-8888",
    email: "kilanches@kifome.com",
    category: "Lanches",
    storeType: "Lanchonete",
    deliveryMethod: "Moto",
    atendeDelivery: true,
    workingDays: "Todos os dias",
    openTime: "11:00",
    closeTime: "00:00",
    status: "Ativo", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    date: "2023-07-06",
    zone: "Zone: Lavras - MG"
  },
];

const StoresPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<any>({
    name: "", description: "", responsible: "", ownerId: "",
    address: "", city: "", state: "", zip: "",
    lat: "", lng: "", phone: "+55 ", whatsapp: "+55 ", email: "",
    instagram: "", facebook: "", site: "",
    category: "Burgers", storeType: "Hamburgueria", deliveryMethod: "Moto",
    atendeDelivery: true, workingDays: "Segunda a Sábado",
    openTime: "18:00", closeTime: "23:30",
    status: "Ativo", isFeatured: false, img: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("kifome_stores_full");
    if (saved) {
      setStores(JSON.parse(saved));
    } else {
      setStores(INITIAL_STORES);
      localStorage.setItem("kifome_stores_full", JSON.stringify(INITIAL_STORES));
    }
  }, []);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           store.responsible.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           store.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || store.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [stores, searchQuery, statusFilter]);

  const handleCepBlur = async () => {
    const cep = formData.zip.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData({
          ...formData,
          address: data.logradouro,
          city: data.localidade,
          state: data.uf
        });
        showSuccess("Endereço localizado!");
      }
    } catch (e) { showError("Erro ao buscar CEP."); }
    finally { setIsLoadingCep(false); }
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingStore) {
      updated = stores.map(s => s.id === editingStore.id ? { ...formData, id: s.id } : s);
      showSuccess("Loja atualizada!");
    } else {
      const newStore = { ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0] };
      updated = [newStore, ...stores];
      showSuccess("Nova loja cadastrada!");
    }
    setStores(updated);
    localStorage.setItem("kifome_stores_full", JSON.stringify(updated));
    setIsDialogOpen(false);
  };

  const openEdit = (store: any) => {
    setEditingStore(store);
    setFormData(store);
    setIsDialogOpen(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Lojas - KIFOME", 14, 15);
    autoTable(doc, {
      head: [['Nome', 'Cidade', 'Responsável', 'Status']],
      body: filteredStores.map(s => [s.name, s.city, s.responsible, s.status]),
      startY: 20,
    });
    doc.save(`lojas-kifome.pdf`);
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão de Lojas</h1>
          <p className="text-slate-500 font-medium">Controle total das unidades e seus proprietários.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline" className="rounded-xl font-bold h-12 gap-2 border-slate-200">
            <Download size={18} /> PDF
          </Button>
          <Button 
            onClick={() => { setEditingStore(null); setFormData(INITIAL_STORES[0]); setIsDialogOpen(true); }}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black px-6 h-12 uppercase tracking-widest shadow-lg shadow-orange-100"
          >
            <Plus size={18} className="mr-2" /> Nova Loja
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
              placeholder="Buscar por nome, cidade ou dono..." 
              className="pl-10 h-12 bg-white rounded-xl border-slate-200 shadow-sm font-medium" 
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-12 rounded-xl bg-white border-slate-200 font-bold uppercase text-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ativo">Ativas</SelectItem>
              <SelectItem value="Inativo">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loja</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proprietário</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={store.img} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <span className="font-black text-slate-900 uppercase">{store.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">{store.city} - {store.state}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{store.address}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <Link 
                      to={`/admin/users/edit/${store.ownerId}`}
                      className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline"
                    >
                      <UserCircle size={16} /> {store.responsible}
                    </Link>
                  </td>
                  <td className="px-8 py-4">
                    <Badge className={`border-none font-black uppercase text-[9px] ${store.status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {store.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Button onClick={() => openEdit(store)} variant="ghost" size="icon" className="rounded-lg h-9 w-9 bg-slate-900 text-white hover:bg-orange-600">
                      <Edit2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 rounded-[3rem] overflow-hidden border-none shadow-2xl">
          <form onSubmit={handleSaveStore}>
            <DialogHeader className="px-10 py-8 bg-slate-900 text-white shrink-0">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <Store className="text-orange-500" /> {editingStore ? "Editar Loja" : "Nova Loja"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest">Ficha de Cadastro Completa</DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[calc(90vh-180px)] p-10">
              <div className="space-y-12">
                {/* 🏪 Informações Básicas */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Utensils size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informações Básicas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome da Loja</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Responsável (Dono)</Label>
                      <Input value={formData.responsible} onChange={(e) => setFormData({...formData, responsible: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição</Label>
                      <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl min-h-[80px]" />
                    </div>
                  </div>
                </section>

                {/* 📍 Localização */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <MapPin size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização & Geo</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">CEP</Label>
                      <div className="relative">
                        <Input value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} onBlur={handleCepBlur} className="rounded-xl h-12 font-bold" required />
                        {isLoadingCep && <Loader2 className="absolute right-3 top-3 animate-spin text-orange-500" size={18} />}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Endereço</Label>
                      <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cidade</Label>
                      <Input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Latitude</Label>
                      <Input value={formData.lat} onChange={(e) => setFormData({...formData, lat: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Longitude</Label>
                      <Input value={formData.lng} onChange={(e) => setFormData({...formData, lng: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                  </div>
                </section>

                {/* 📞 Contato & Redes */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Globe size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contato & Redes Sociais</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp</Label>
                      <Input value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail</Label>
                      <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Instagram</Label>
                      <Input value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                  </div>
                </section>

                {/* ⏰ Horário & Config */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Clock size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funcionamento & Configurações</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Dias da Semana</Label>
                      <Input value={formData.workingDays} onChange={(e) => setFormData({...formData, workingDays: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Abertura</Label>
                      <Input type="time" value={formData.openTime} onChange={(e) => setFormData({...formData, openTime: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fechamento</Label>
                      <Input type="time" value={formData.closeTime} onChange={(e) => setFormData({...formData, closeTime: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Switch checked={formData.status === 'Ativo'} onCheckedChange={(val) => setFormData({...formData, status: val ? 'Ativo' : 'Inativo'})} />
                      <Label className="text-[10px] font-black uppercase text-slate-700">Loja Ativa</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={formData.isFeatured} onCheckedChange={(val) => setFormData({...formData, isFeatured: val})} />
                      <Label className="text-[10px] font-black uppercase text-slate-700">Destaque no App</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={formData.atendeDelivery} onCheckedChange={(val) => setFormData({...formData, atendeDelivery: val})} />
                      <Label className="text-[10px] font-black uppercase text-slate-700">Atende Delivery</Label>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>

            <DialogFooter className="px-10 py-8 bg-slate-50 border-t flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-14 flex-1">Cancelar</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-14 flex-1 shadow-xl shadow-orange-100">
                <Save size={20} className="mr-2" /> Salvar Cadastro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StoresPage;