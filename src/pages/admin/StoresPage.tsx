"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Edit2, MapPin, Utensils, Globe, Clock, Loader2, Save, UserCircle
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showSuccess, showError } from "@/utils/toast";

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
    date: "2023-06-15"
  }
];

const StoresPage = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    name: "", description: "", responsible: "", ownerId: "",
    address: "", city: "", state: "", zip: "",
    lat: "", lng: "", phone: "+55 ", whatsapp: "+55 ", email: "",
    instagram: "", facebook: "", site: "",
    category: "Burgers", storeType: "Hamburgueria", deliveryMethod: "Moto",
    atendeDelivery: true, workingDays: "Segunda a Sábado",
    openTime: "18:00", closeTime: "23:30",
    status: "Ativo", isFeatured: false, img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400"
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kifome_stores_full");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setStores(parsed);
        } else {
          setStores(INITIAL_STORES);
        }
      } else {
        setStores(INITIAL_STORES);
        localStorage.setItem("kifome_stores_full", JSON.stringify(INITIAL_STORES));
      }
    } catch (e) {
      console.error("Erro ao carregar lojas:", e);
      setStores(INITIAL_STORES);
    }
  }, []);

  const filteredStores = useMemo(() => {
    if (!Array.isArray(stores)) return [];
    return stores.filter(store => {
      if (!store) return false;
      const name = store.name?.toLowerCase() || "";
      const responsible = store.responsible?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return name.includes(query) || responsible.includes(query);
    });
  }, [stores, searchQuery]);

  const handleCepBlur = async () => {
    const cep = formData.zip?.replace(/\D/g, "") || "";
    if (cep.length !== 8) return;
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData({ ...formData, address: data.logradouro, city: data.localidade, state: data.uf });
        showSuccess("Endereço localizado!");
      }
    } catch (e) { 
      showError("Erro ao buscar CEP."); 
    } finally { 
      setIsLoadingCep(false); 
    }
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
    } catch (e) {
      showError("Erro ao salvar loja.");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão de Lojas</h1>
          <p className="text-slate-500 font-medium">Controle total das unidades e seus proprietários.</p>
        </div>
        <Button 
          onClick={() => { 
            setEditingStore(null); 
            setFormData(INITIAL_STORES[0] || {}); 
            setIsDialogOpen(true); 
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black px-6 h-12 uppercase tracking-widest shadow-lg shadow-orange-100"
        >
          <Plus size={18} className="mr-2" /> Nova Loja
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar loja ou dono..." 
              className="pl-10 h-12 bg-white rounded-xl border-slate-200 shadow-sm font-medium" 
            />
          </div>
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
              {filteredStores.length > 0 ? filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={store.img || "https://via.placeholder.com/150"} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <span className="font-black text-slate-900 uppercase">{store.name || "Sem Nome"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">{store.city || "N/A"} - {store.state || "N/A"}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{store.address || "Sem endereço"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <Link 
                      to={`/admin/users/edit/${store.ownerId || 234}`}
                      className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline"
                    >
                      <UserCircle size={16} /> {store.responsible || "Não definido"}
                    </Link>
                  </td>
                  <td className="px-8 py-4">
                    <Badge className={`border-none font-black uppercase text-[9px] ${store.status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {store.status || "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Button onClick={() => { setEditingStore(store); setFormData(store); setIsDialogOpen(true); }} variant="ghost" size="icon" className="rounded-lg h-9 w-9 bg-slate-900 text-white hover:bg-orange-600">
                      <Edit2 size={14} />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                    Nenhuma loja encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 rounded-[3rem] overflow-hidden border-none shadow-2xl">
          <form onSubmit={handleSaveStore}>
            <DialogHeader className="px-10 py-8 bg-slate-900 text-white shrink-0">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <Utensils className="text-orange-500" /> {editingStore ? "Editar Loja" : "Nova Loja"}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="h-[calc(90vh-180px)] p-10">
              <div className="space-y-12">
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Utensils size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informações Básicas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome da Loja</Label>
                      <Input value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Responsável (Dono)</Label>
                      <Input value={formData.responsible || ""} onChange={(e) => setFormData({...formData, responsible: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição</Label>
                      <Textarea value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl min-h-[80px]" />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <MapPin size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização & Geo</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">CEP</Label>
                      <div className="relative">
                        <Input value={formData.zip || ""} onChange={(e) => setFormData({...formData, zip: e.target.value})} onBlur={handleCepBlur} className="rounded-xl h-12 font-bold" required />
                        {isLoadingCep && <Loader2 className="absolute right-3 top-3 animate-spin text-orange-500" size={18} />}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Endereço</Label>
                      <Input value={formData.address || ""} onChange={(e) => setFormData({...formData, address: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cidade</Label>
                      <Input value={formData.city || ""} onChange={(e) => setFormData({...formData, city: e.target.value})} className="rounded-xl h-12 font-bold" required />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Clock size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funcionamento</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Dias da Semana</Label>
                      <Input value={formData.workingDays || ""} onChange={(e) => setFormData({...formData, workingDays: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Abertura</Label>
                      <Input type="time" value={formData.openTime || ""} onChange={(e) => setFormData({...formData, openTime: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fechamento</Label>
                      <Input type="time" value={formData.closeTime || ""} onChange={(e) => setFormData({...formData, closeTime: e.target.value})} className="rounded-xl h-12 font-bold" />
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