"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Search, Edit2, MapPin, Utensils, Globe, Clock, Loader2, Save, UserCircle, 
  Phone, Instagram, Facebook, Truck, Navigation, MapPinned, ImageIcon, Star, 
  DollarSign, Percent, Package, Leaf, Bone, Layers, ExternalLink
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { showSuccess, showError } from "@/utils/toast";

const INITIAL_STORES = [
  { 
    id: 1, 
    name: "LOJA TESTE", 
    description: "Hamburgueria artesanal com foco em qualidade.",
    responsible: "Lojista Teste",
    ownerId: 234,
    address: "Rua das Flores, 123",
    neighborhood: "Centro",
    reference: "Próximo à Praça Central",
    city: "Lavras",
    state: "MG",
    zip: "37200-000",
    lat: "-21.2427000",
    lng: "-45.0013000",
    phone: "+55 (35) 99999-9999",
    whatsapp: "+55 (35) 99999-9999",
    instagram: "lojateste",
    facebook: "lojateste",
    category: "Burgers",
    dietType: "ambos",
    rating: "4.8",
    deliveryTime: "30-45",
    priceForTwo: "60.00",
    packagingFee: "2.00",
    deliveryType: "fixed",
    deliveryFee: "5.00",
    baseKm: "3",
    extraKmFee: "1.50",
    minOrderDelivery: "30.00",
    minOrderPickup: "0.00",
    commission: "10",
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
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<any>(INITIAL_STORES[0]);

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
      const name = store?.name?.toLowerCase() || "";
      const responsible = store?.responsible?.toLowerCase() || "";
      return name.includes(searchQuery.toLowerCase()) || responsible.includes(searchQuery.toLowerCase());
    });
  }, [stores, searchQuery]);

  // Máscaras e Formatações
  const formatWhatsApp = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(2); // Remove o 55 inicial
    let formatted = "+55 ";
    if (digits.length > 0) formatted += "(" + digits.substring(0, 2);
    if (digits.length > 2) formatted += ") " + digits.substring(2, 7);
    if (digits.length > 7) formatted += "-" + digits.substring(7, 11);
    return formatted;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result as string });
        showSuccess("Logo carregada!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCepBlur = async () => {
    const cep = formData.zip?.replace(/\D/g, "") || "";
    if (cep.length !== 8) return;
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData({ 
          ...formData, 
          address: data.logradouro, 
          neighborhood: data.bairro,
          city: data.localidade, 
          state: data.uf 
        });
        showSuccess("Endereço localizado!");
      }
    } catch (e) { showError("Erro ao buscar CEP."); }
    finally { setIsLoadingCep(false); }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({ 
          ...formData, 
          lat: latitude.toFixed(7), 
          lng: longitude.toFixed(7) 
        });
        showSuccess("GPS capturado com sucesso!");
        setIsLocating(false);
      },
      () => { showError("Erro ao obter GPS."); setIsLocating(false); }
    );
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

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão de Lojas</h1>
          <p className="text-slate-500 font-medium">Controle total das unidades e logística.</p>
        </div>
        <Button 
          onClick={() => { setEditingStore(null); setFormData(INITIAL_STORES[0]); setIsDialogOpen(true); }}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black px-6 h-12 uppercase tracking-widest shadow-lg"
        >
          <Plus size={18} className="mr-2" /> Nova Loja
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar loja..." className="pl-10 h-12 bg-white rounded-xl border-slate-200" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loja</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avaliação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={store.img} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                      <span className="font-black text-slate-900 uppercase">{store.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">{store.city} - {store.state}</span>
                      <span className="text-[9px] text-slate-400 font-medium uppercase">{store.neighborhood}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Star size={14} className="fill-orange-500" />
                      <span className="text-sm font-black">{store.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <Badge className={`border-none font-black uppercase text-[9px] ${store.status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {store.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Button onClick={() => { setEditingStore(store); setFormData(store); setIsDialogOpen(true); }} variant="ghost" size="icon" className="rounded-lg h-9 w-9 bg-slate-900 text-white hover:bg-orange-600">
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
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 rounded-[3rem] overflow-hidden border-none shadow-2xl">
          <form onSubmit={handleSaveStore}>
            <DialogHeader className="px-10 py-8 bg-slate-900 text-white shrink-0">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <Utensils className="text-orange-500" /> {editingStore ? "Editar Loja" : "Nova Loja"}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="h-[calc(95vh-180px)] p-10">
              <div className="space-y-12">
                {/* Logo e Dados Básicos */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Logo da Loja</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-square bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden group hover:border-orange-400 transition-all cursor-pointer relative"
                    >
                      {formData.img ? (
                        <img src={formData.img} className="w-full h-full object-cover" alt="Logo" />
                      ) : (
                        <ImageIcon size={40} className="mb-2 opacity-20" />
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome da Loja</Label>
                        <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 font-bold" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Responsável</Label>
                        <Input value={formData.responsible} onChange={(e) => setFormData({...formData, responsible: e.target.value})} className="rounded-xl h-12 font-bold" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição Curta</Label>
                      <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl min-h-[80px]" />
                    </div>
                  </div>
                </section>

                {/* Localização e Mapa */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <MapPin size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização & Mapa</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">CEP</Label>
                          <Input value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} onBlur={handleCepBlur} className="rounded-xl h-12 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Bairro</Label>
                          <Input value={formData.neighborhood} onChange={(e) => setFormData({...formData, neighborhood: e.target.value})} className="rounded-xl h-12 font-bold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Endereço Completo</Label>
                        <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="rounded-xl h-12 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ponto de Referência</Label>
                        <Input value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} className="rounded-xl h-12 font-bold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-orange-600 ml-1">Latitude</Label>
                          <Input value={formData.lat} onChange={(e) => setFormData({...formData, lat: e.target.value})} className="rounded-xl h-12 font-black bg-orange-50/30 border-orange-100" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-orange-600 ml-1">Longitude</Label>
                          <Input value={formData.lng} onChange={(e) => setFormData({...formData, lng: e.target.value})} className="rounded-xl h-12 font-black bg-orange-50/30 border-orange-100" />
                        </div>
                      </div>
                      <Button type="button" onClick={handleGetCurrentLocation} disabled={isLocating} className="w-full h-12 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] gap-2">
                        {isLocating ? <Loader2 className="animate-spin" /> : <Navigation size={16} />} Capturar Localização GPS
                      </Button>
                    </div>
                    
                    <div className="w-full h-full min-h-[300px] bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-inner relative">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${formData.lat},${formData.lng}&zoom=16`}
                        allowFullScreen
                      ></iframe>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce">
                          <MapPin size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contato e Redes Sociais */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Phone size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contato & Redes Sociais</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp</Label>
                      <div className="relative">
                        <Input 
                          value={formData.whatsapp} 
                          onChange={(e) => setFormData({...formData, whatsapp: formatWhatsApp(e.target.value)})} 
                          className="rounded-xl h-12 font-bold pl-4" 
                        />
                        <a href={`https://wa.me/${formData.whatsapp?.replace(/\D/g, "")}`} target="_blank" className="absolute right-3 top-3 text-emerald-500"><ExternalLink size={18} /></a>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Instagram</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">instagram.com/</span>
                        <Input 
                          value={formData.instagram} 
                          onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
                          className="rounded-xl h-12 font-bold pl-[105px]" 
                        />
                        <a href={`https://instagram.com/${formData.instagram}`} target="_blank" className="absolute right-3 top-3 text-pink-500"><Instagram size={18} /></a>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Facebook</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">facebook.com/</span>
                        <Input 
                          value={formData.facebook} 
                          onChange={(e) => setFormData({...formData, facebook: e.target.value})} 
                          className="rounded-xl h-12 font-bold pl-[100px]" 
                        />
                        <a href={`https://facebook.com/${formData.facebook}`} target="_blank" className="absolute right-3 top-3 text-blue-600"><Facebook size={18} /></a>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Classificação e Preços */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Star size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classificação & Preços</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nota Inicial</Label>
                      <Input value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="rounded-xl h-12 font-black text-orange-600" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tempo Médio (min)</Label>
                      <Input value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} placeholder="Ex: 30-45" className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Preço p/ 2 Pessoas</Label>
                      <Input value={formData.priceForTwo} onChange={(e) => setFormData({...formData, priceForTwo: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Taxa de Embalagem</Label>
                      <Input value={formData.packagingFee} onChange={(e) => setFormData({...formData, packagingFee: e.target.value})} className="rounded-xl h-12 font-bold" />
                    </div>
                  </div>
                </section>

                {/* Logística de Entrega */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Truck size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logística de Entrega</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modelo de Taxa</Label>
                      <RadioGroup value={formData.deliveryType} onValueChange={(val) => setFormData({...formData, deliveryType: val})} className="grid grid-cols-2 gap-4">
                        <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.deliveryType === 'fixed' ? 'bg-white border-orange-500 shadow-lg' : 'bg-transparent border-slate-200'}`}>
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed" className="font-black uppercase text-[10px] cursor-pointer">Taxa Fixa</Label>
                        </div>
                        <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.deliveryType === 'dynamic' ? 'bg-white border-orange-500 shadow-lg' : 'bg-transparent border-slate-200'}`}>
                          <RadioGroupItem value="dynamic" id="dynamic" />
                          <Label htmlFor="dynamic" className="font-black uppercase text-[10px] cursor-pointer">Taxa Dinâmica</Label>
                        </div>
                      </RadioGroup>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Taxa Padrão (R$)</Label>
                          <Input value={formData.deliveryFee} onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})} className="rounded-xl h-12 font-bold" />
                        </div>
                        {formData.deliveryType === 'dynamic' && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Até quantos KM?</Label>
                              <Input value={formData.baseKm} onChange={(e) => setFormData({...formData, baseKm: e.target.value})} className="rounded-xl h-12 font-bold" />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor por KM Adicional (R$)</Label>
                              <Input value={formData.extraKmFee} onChange={(e) => setFormData({...formData, extraKmFee: e.target.value})} className="rounded-xl h-12 font-bold" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Pedido Mín. Entrega</Label>
                          <Input value={formData.minOrderDelivery} onChange={(e) => setFormData({...formData, minOrderDelivery: e.target.value})} className="rounded-xl h-12 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Pedido Mín. Retirada</Label>
                          <Input value={formData.minOrderPickup} onChange={(e) => setFormData({...formData, minOrderPickup: e.target.value})} className="rounded-xl h-12 font-bold" />
                        </div>
                      </div>
                      <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Percent className="text-orange-600" size={20} />
                            <Label className="text-[10px] font-black uppercase text-orange-900">Comissão do App (%)</Label>
                          </div>
                          <Input value={formData.commission} onChange={(e) => setFormData({...formData, commission: e.target.value})} className="w-20 h-10 rounded-lg bg-white border-orange-200 font-black text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Preferências e Destaque */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Layers size={18} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferências & Destaque</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Cozinha</Label>
                      <RadioGroup value={formData.dietType} onValueChange={(val) => setFormData({...formData, dietType: val})} className="flex gap-4">
                        <div className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${formData.dietType === 'vegetal' ? 'bg-green-50 border-green-500' : 'border-slate-200'}`}>
                          <RadioGroupItem value="vegetal" id="veg" />
                          <Label htmlFor="veg" className="text-[10px] font-black uppercase text-green-700 cursor-pointer flex items-center gap-1"><Leaf size={12} /> Vegetal</Label>
                        </div>
                        <div className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${formData.dietType === 'animal' ? 'bg-red-50 border-red-500' : 'border-slate-200'}`}>
                          <RadioGroupItem value="animal" id="ani" />
                          <Label htmlFor="ani" className="text-[10px] font-black uppercase text-red-700 cursor-pointer flex items-center gap-1"><Bone size={12} /> Animal</Label>
                        </div>
                        <div className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${formData.dietType === 'ambos' ? 'bg-blue-50 border-blue-500' : 'border-slate-200'}`}>
                          <RadioGroupItem value="ambos" id="amb" />
                          <Label htmlFor="amb" className="text-[10px] font-black uppercase text-blue-700 cursor-pointer flex items-center gap-1"><Layers size={12} /> Ambos</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white">
                      <div className="flex items-center gap-3">
                        <Star className="text-orange-400 fill-orange-400" size={24} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Loja em Destaque</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Aparece no topo do App</p>
                        </div>
                      </div>
                      <Switch checked={formData.isFeatured} onCheckedChange={(val) => setFormData({...formData, isFeatured: val})} className="data-[state=checked]:bg-orange-500" />
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>

            <DialogFooter className="px-10 py-8 bg-slate-50 border-t flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase text-[10px] h-14 flex-1">Cancelar</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-14 flex-1 shadow-xl">
                <Save size={20} className="mr-2" /> Salvar Configurações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StoresPage;