"use client";

import { useState, useMemo, useRef } from "react";
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
  ArrowLeft, ImageIcon, Star, Flame, Diamond, Leaf, Bone, Layers, Percent, DollarSign,
  Copy, Trash2, Upload
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { showSuccess, showError } from "@/utils/toast";

// Mocks para demonstração
const MOCK_STORES = [
  { id: 1, name: "LOJA TESTE", owner: "Helio Junio" },
  { id: 2, name: "LOJA TESTE 2", owner: "Helio Junio" },
  { id: 3, name: "Ki + Lanches", owner: "Helio Junio" },
];

const MOCK_COMPLEMENTS = [
  { id: 1, name: "ADICIONAIS LANCHES" },
  { id: 2, name: "OPÇÕES DE REFRIGERANTES" },
  { id: 3, name: "ADICIONAIS DE BURGER" },
];

const INITIAL_ITEMS = [
  { 
    id: 11, 
    name: "X-TURBO BURGUER (CÓPIA)", 
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    stores: [1, 2, 3], 
    category: "SANDUÍCHE", 
    price: "22.90", 
    status: false,
    isRecommended: true,
    isPopular: true,
    isGourmet: false,
    origin: "animal",
    discountType: "percent",
    discountValue: "10"
  },
  { 
    id: 10, 
    name: "X-TURBO BURGUER", 
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    stores: [1, 2, 3], 
    category: "SANDUÍCHE", 
    price: "22.90", 
    status: true,
    isRecommended: true,
    isPopular: true,
    isGourmet: false,
    origin: "animal",
    discountType: "percent",
    discountValue: "10"
  },
  { 
    id: 9, 
    name: "COMBO CASAL", 
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400",
    stores: [1, 3], 
    category: "COMBOS", 
    price: "45.00", 
    status: true,
    isRecommended: false,
    isPopular: false,
    isGourmet: false,
    origin: "animal",
    discountType: "fixed",
    discountValue: "0"
  },
];

const ItemsPage = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("SANDUÍCHE");
  const [linkedStores, setLinkedStores] = useState<number[]>([]);
  const [promoType, setPromoType] = useState<"fixed" | "percent">("fixed");
  const [promoValue, setPromoValue] = useState("");
  const [origin, setOrigin] = useState("animal");
  const [selectedComplements, setSelectedComplements] = useState<number[]>([]);
  const [features, setFeatures] = useState({ recommended: false, popular: false, gourmet: false });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const calculateDiscountedPrice = (price: string, type: string, value: string) => {
    const basePrice = parseFloat(price.replace(",", "."));
    const cleanValue = value.replace("%", "").replace(",", ".");
    const discValue = parseFloat(cleanValue) || 0;
    if (discValue === 0) return basePrice;

    if (type === "fixed") {
      return Math.max(0, basePrice - discValue);
    } else {
      return Math.max(0, basePrice * (1 - discValue / 100));
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price);
    setCategory(item.category);
    setLinkedStores(item.stores || []);
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

  const handleDuplicate = (item: any) => {
    const newItem = {
      ...item,
      id: Math.max(...items.map(i => i.id)) + 1,
      name: `${item.name} (CÓPIA)`,
      status: false
    };
    setItems([newItem, ...items]);
    showSuccess(`Produto "${item.name}" duplicado com sucesso!`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setItems(items.filter(item => item.id !== id));
      showSuccess("Produto excluído do sistema.");
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("SANDUÍCHE");
    setLinkedStores([]);
    setFeatures({ recommended: false, popular: false, gourmet: false });
    setOrigin("animal");
    setPromoType("fixed");
    setPromoValue("");
    setImagePreview(null);
    setView("form");
  };

  const toggleStatus = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, status: !item.status } : item));
    showSuccess("Status do item atualizado!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        showSuccess("Imagem carregada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      name: name.toUpperCase(),
      description,
      price: price.replace(",", "."),
      category,
      stores: linkedStores,
      isRecommended: features.recommended,
      isPopular: features.popular,
      isGourmet: features.gourmet,
      origin,
      discountType: promoType,
      discountValue: promoValue,
      status: editingItem ? editingItem.status : true,
      image: imagePreview || "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400"
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...item, ...updatedData } : item));
      showSuccess("Item atualizado com sucesso!");
    } else {
      const newItem = {
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        ...updatedData
      };
      setItems([newItem, ...items]);
      showSuccess("Novo item cadastrado!");
    }
    
    setView("list");
  };

  const formatDiscountOnBlur = () => {
    if (!promoValue) return;

    if (promoType === "fixed") {
      const numeric = parseFloat(promoValue.replace(",", "."));
      if (!isNaN(numeric)) {
        setPromoValue(numeric.toFixed(2).replace(".", ","));
      }
    } else {
      let numericString = promoValue.replace("%", "").replace(",", ".");
      const numeric = parseFloat(numericString);
      if (!isNaN(numeric)) {
        setPromoValue(numeric.toString().replace(".", ",") + "%");
      }
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
               {editingItem ? `EDITANDO: ${editingItem.name}` : "CADASTRAR NOVO PRODUTO"}
             </h3>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              <div className="lg:col-span-2 space-y-8">
                <section className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Imagem do Produto</Label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-44 h-44 bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden group hover:border-orange-400 transition-all cursor-pointer relative"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-[9px] font-black uppercase tracking-tighter">Clique para anexar</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                      />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Produto</Label>
                        <Input 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="rounded-2xl h-14 font-black uppercase tracking-tight text-lg" 
                          placeholder="Ex: X-TURBO BURGUER" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição</Label>
                        <Textarea 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          className="rounded-2xl min-h-[100px] font-medium" 
                          placeholder="Ingredientes e detalhes..." 
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Preço Base (R$)</Label>
                    <Input 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      className="rounded-2xl h-14 font-black text-xl" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria do Menu</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-14 rounded-2xl font-black uppercase tracking-widest text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
think
The previous response from the AI cut off mid-way through a `dyad-write` block for `src/pages/admin/ItemsPage.tsx`. I need to complete the file content and provide the concise summary.

Looking at the previous turn, the code cut off inside the `SelectContent` tag of the `category` field.

I will continue from:
```tsx
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="SANDUÍCHE" className="font-black uppercase text-[10px]">SANDUÍCHE</SelectItem>
                        <SelectItem value="COMBOS" className="font-black uppercase text-[10px]">COMBOS</SelectItem>
                        <SelectItem value="BEBIDAS" className="font-black uppercase text-[10px]">BEBIDAS</SelectItem>
                      </SelectContent>
```
And then complete the rest of the component. I should make sure to include all requested features:
- Image upload (already started, need to finish the JSX and logic if any left).
- Form persistence for highlights (already implemented in previous turn but need to maintain it).
- Formatters for discount (already implemented).
- Trash icon (already implemented).

Wait, the user said "não está abrindo opção de encontrar e anexar as imagens". The AI started implementing `handleImageUpload` and `fileInputRef`. I need to finish that.

The cut-off was here:
```tsx
                      <SelectContent className="rounded-2xl">
```

I'll resume and finish the whole file.

Plan:
1. Finish the `ItemsPage.tsx` file.
2. Provide summary.
3. Provide chat title.<dyad-write path="src/pages/admin/ItemsPage.tsx" description="Finalizando implementação do upload de imagem e persistência de dados.">
"use client";

import { useState, useMemo, useRef } from "react";
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
  ArrowLeft, ImageIcon, Star, Flame, Diamond, Leaf, Bone, Layers, Percent, DollarSign,
  Copy, Trash2, Upload
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { showSuccess, showError } from "@/utils/toast";

// Mocks para demonstração
const MOCK_STORES = [
  { id: 1, name: "LOJA TESTE", owner: "Helio Junio" },
  { id: 2, name: "LOJA TESTE 2", owner: "Helio Junio" },
  { id: 3, name: "Ki + Lanches", owner: "Helio Junio" },
];

const MOCK_COMPLEMENTS = [
  { id: 1, name: "ADICIONAIS LANCHES" },
  { id: 2, name: "OPÇÕES DE REFRIGERANTES" },
  { id: 3, name: "ADICIONAIS DE BURGER" },
];

const INITIAL_ITEMS = [
  { 
    id: 11, 
    name: "X-TURBO BURGUER (CÓPIA)", 
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    stores: [1, 2, 3], 
    category: "SANDUÍCHE", 
    price: "22.90", 
    status: false,
    isRecommended: true,
    isPopular: true,
    isGourmet: false,
    origin: "animal",
    discountType: "percent",
    discountValue: "10"
  },
  { 
    id: 10, 
    name: "X-TURBO BURGUER", 
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    stores: [1, 2, 3], 
    category: "SANDUÍCHE", 
    price: "22.90", 
    status: true,
    isRecommended: true,
    isPopular: true,
    isGourmet: false,
    origin: "animal",
    discountType: "percent",
    discountValue: "10"
  },
  { 
    id: 9, 
    name: "COMBO CASAL", 
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400",
    stores: [1, 3], 
    category: "COMBOS", 
    price: "45.00", 
    status: true,
    isRecommended: false,
    isPopular: false,
    isGourmet: false,
    origin: "animal",
    discountType: "fixed",
    discountValue: "0"
  },
];

const ItemsPage = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("SANDUÍCHE");
  const [linkedStores, setLinkedStores] = useState<number[]>([]);
  const [promoType, setPromoType] = useState<"fixed" | "percent">("fixed");
  const [promoValue, setPromoValue] = useState("");
  const [origin, setOrigin] = useState("animal");
  const [selectedComplements, setSelectedComplements] = useState<number[]>([]);
  const [features, setFeatures] = useState({ recommended: false, popular: false, gourmet: false });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const calculateDiscountedPrice = (price: string, type: string, value: string) => {
    const basePrice = parseFloat(price.replace(",", "."));
    const cleanValue = value.replace("%", "").replace(",", ".");
    const discValue = parseFloat(cleanValue) || 0;
    if (discValue === 0) return basePrice;

    if (type === "fixed") {
      return Math.max(0, basePrice - discValue);
    } else {
      return Math.max(0, basePrice * (1 - discValue / 100));
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price);
    setCategory(item.category);
    setLinkedStores(item.stores || []);
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

  const handleDuplicate = (item: any) => {
    const newItem = {
      ...item,
      id: Math.max(...items.map(i => i.id)) + 1,
      name: `${item.name} (CÓPIA)`,
      status: false
    };
    setItems([newItem, ...items]);
    showSuccess(`Produto "${item.name}" duplicado com sucesso!`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setItems(items.filter(item => item.id !== id));
      showSuccess("Produto excluído do sistema.");
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("SANDUÍCHE");
    setLinkedStores([]);
    setFeatures({ recommended: false, popular: false, gourmet: false });
    setOrigin("animal");
    setPromoType("fixed");
    setPromoValue("");
    setImagePreview(null);
    setView("form");
  };

  const toggleStatus = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, status: !item.status } : item));
    showSuccess("Status do item atualizado!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        showSuccess("Imagem carregada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      name: name.toUpperCase(),
      description,
      price: price.replace(",", "."),
      category,
      stores: linkedStores,
      isRecommended: features.recommended,
      isPopular: features.popular,
      isGourmet: features.gourmet,
      origin,
      discountType: promoType,
      discountValue: promoValue,
      status: editingItem ? editingItem.status : true,
      image: imagePreview || "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400"
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...item, ...updatedData } : item));
      showSuccess("Item atualizado com sucesso!");
    } else {
      const newItem = {
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        ...updatedData
      };
      setItems([newItem, ...items]);
      showSuccess("Novo item cadastrado!");
    }
    
    setView("list");
  };

  const formatDiscountOnBlur = () => {
    if (!promoValue) return;

    if (promoType === "fixed") {
      const numeric = parseFloat(promoValue.replace(",", "."));
      if (!isNaN(numeric)) {
        setPromoValue(numeric.toFixed(2).replace(".", ","));
      }
    } else {
      let numericString = promoValue.replace("%", "").replace(",", ".");
      const numeric = parseFloat(numericString);
      if (!isNaN(numeric)) {
        setPromoValue(numeric.toString().replace(".", ",") + "%");
      }
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
               {editingItem ? `EDITANDO: ${editingItem.name}` : "CADASTRAR NOVO PRODUTO"}
             </h3>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              <div className="lg:col-span-2 space-y-8">
                <section className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Imagem do Produto</Label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-44 h-44 bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden group hover:border-orange-400 transition-all cursor-pointer relative"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-[9px] font-black uppercase tracking-tighter">Clique para anexar</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                      />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Produto</Label>
                        <Input 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="rounded-2xl h-14 font-black uppercase tracking-tight text-lg" 
                          placeholder="Ex: X-TURBO BURGUER" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição</Label>
                        <Textarea 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          className="rounded-2xl min-h-[100px] font-medium" 
                          placeholder="Ingredientes e detalhes..." 
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Preço Base (R$)</Label>
                    <Input 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      className="rounded-2xl h-14 font-black text-xl" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria do Menu</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-14 rounded-2xl font-black uppercase tracking-widest text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="SANDUÍCHE" className="font-black uppercase text-[10px]">SANDUÍCHE</SelectItem>
                        <SelectItem value="COMBOS" className="font-black uppercase text-[10px]">COMBOS</SelectItem>
                        <SelectItem value="BEBIDAS" className="font-black uppercase text-[10px]">BEBIDAS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <section className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="text-orange-600" size={18} />
                    <h4 className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Configurar Promoção</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-orange-700 ml-1">Tipo de Desconto</Label>
                      <div className="flex bg-white rounded-xl p-1 border border-orange-100">
                        <button 
                          type="button"
                          onClick={() => { setPromoType("fixed"); setPromoValue(""); }}
                          className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black transition-all ${promoType === 'fixed' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-orange-400'}`}
                        >
                          <DollarSign size={14} /> VALOR EM R$
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setPromoType("percent"); setPromoValue(""); }}
                          className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black transition-all ${promoType === 'percent' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-orange-400'}`}
                        >
                          <Percent size={14} /> PORCENTAGEM %
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-orange-700 ml-1">Valor do Desconto</Label>
                      <Input 
                        value={promoValue}
                        onChange={(e) => setPromoValue(e.target.value)}
                        onBlur={formatDiscountOnBlur}
                        className="rounded-xl h-12 bg-white border-orange-100 font-black" 
                        placeholder={promoType === 'fixed' ? "0,00" : "x%"} 
                      />
                    </div>
                  </div>
                </section>

                <section className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="text-slate-500" size={18} />
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Origem / Dieta</h4>
                  </div>
                  <RadioGroup value={origin} onValueChange={setOrigin} className="flex flex-col md:flex-row gap-4">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all cursor-pointer flex-1 ${origin === 'animal' ? 'bg-white border-red-200 shadow-sm' : 'bg-transparent border-transparent opacity-50'}`}>
                      <RadioGroupItem value="animal" id="origin-animal" className="border-red-500 text-red-500" />
                      <Label htmlFor="origin-animal" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-red-600 cursor-pointer">
                        <Bone size={14} /> Origem Animal
                      </Label>
                    </div>
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all cursor-pointer flex-1 ${origin === 'vegetal' ? 'bg-white border-green-200 shadow-sm' : 'bg-transparent border-transparent opacity-50'}`}>
                      <RadioGroupItem value="vegetal" id="origin-vegetal" className="border-green-500 text-green-500" />
                      <Label htmlFor="origin-vegetal" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-green-600 cursor-pointer">
                        <Leaf size={14} /> Origem Vegetal
                      </Label>
                    </div>
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all cursor-pointer flex-1 ${origin === 'ambos' ? 'bg-white border-blue-200 shadow-sm' : 'bg-transparent border-transparent opacity-50'}`}>
                      <RadioGroupItem value="ambos" id="origin-ambos" className="border-blue-500 text-blue-500" />
                      <Label htmlFor="origin-ambos" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-blue-600 cursor-pointer">
                        <Layers size={14} /> Ambos
                      </Label>
                    </div>
                  </RadioGroup>
                </section>
              </div>

              <div className="space-y-8">
                <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-orange-400" size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Status & Destaques</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Star className={`transition-colors ${features.recommended ? 'text-orange-400 fill-orange-400' : 'text-white/20'}`} size={20} />
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight leading-none">RECOMENDADO</p>
                          <p className="text-[9px] text-white/40 font-bold">Destaque no topo do App</p>
                        </div>
                      </div>
                      <Switch checked={features.recommended} onCheckedChange={(val) => setFeatures({...features, recommended: val})} className="data-[state=checked]:bg-orange-500" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Flame className={`transition-colors ${features.popular ? 'text-rose-500 fill-rose-500' : 'text-white/20'}`} size={20} />
                        <p className="text-[11px] font-black uppercase tracking-tight">POPULAR</p>
                      </div>
                      <Switch checked={features.popular} onCheckedChange={(val) => setFeatures({...features, popular: val})} className="data-[state=checked]:bg-rose-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Diamond className={`transition-colors ${features.gourmet ? 'text-indigo-400 fill-indigo-400' : 'text-white/20'}`} size={20} />
                        <p className="text-[11px] font-black uppercase tracking-tight">GOURMET</p>
                      </div>
                      <Switch checked={features.gourmet} onCheckedChange={(val) => setFeatures({...features, gourmet: val})} className="data-[state=checked]:bg-indigo-600" />
                    </div>
                  </div>
                </section>

                <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="text-orange-500" size={18} />
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lojas Vinculadas</Label>
                  </div>
                  <div className="space-y-3">
                    {MOCK_STORES.map(store => (
                      <div key={store.id} className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm group hover:border-orange-200 transition-all">
                        <Checkbox 
                          id={`store-${store.id}`}
                          checked={linkedStores.includes(store.id)}
                          onCheckedChange={(checked) => {
                            if (checked) setLinkedStores([...linkedStores, store.id]);
                            else setLinkedStores(linkedStores.filter(id => id !== store.id));
                          }}
                        />
                        <label htmlFor={`store-${store.id}`} className="text-xs font-black text-slate-700 cursor-pointer uppercase tracking-tight flex-1">
                          {store.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <button type="button" onClick={() => setView("list")} className="text-white/40 hover:text-white font-black uppercase text-[10px] tracking-[0.2em] transition-colors">
              CANCELAR ALTERAÇÕES
            </button>
            <Button type="submit" className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-16 h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-black/40 active:scale-95 transition-all">
              <Save size={20} className="mr-3" /> SALVAR PRODUTO NO SISTEMA
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão de Cardápio</h1>
          <p className="text-slate-500 font-medium italic">Controle total dos produtos ativos na rede Kifome.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black h-14 px-8 uppercase text-[10px] tracking-widest shadow-xl shadow-orange-100">
          <Plus size={20} className="mr-2" /> Cadastrar novo produto
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar por nome ou categoria..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-white rounded-2xl border-slate-200 font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Imagem</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destaques</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => {
                const discountedPrice = calculateDiscountedPrice(item.price, item.discountType || 'fixed', item.discountValue || '0');
                const hasDiscount = discountedPrice < parseFloat(item.price.replace(",", "."));

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-bold text-slate-300">#{item.id}</td>
                    <td className="px-8 py-5">
                      <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-100 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 uppercase group-hover:text-orange-600 transition-colors text-sm">{item.name}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.stores?.map(sid => (
                            <Badge key={sid} variant="secondary" className="bg-slate-100 text-slate-400 font-bold border-none text-[8px] uppercase px-1.5 py-0 h-4">
                              {MOCK_STORES.find(s => s.id === sid)?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-1.5">
                        {item.isRecommended && <Star size={14} className="text-orange-400 fill-orange-400" />}
                        {item.isPopular && <Flame size={14} className="text-rose-500 fill-rose-500" />}
                        {item.isGourmet && <Diamond size={14} className="text-indigo-400 fill-indigo-400" />}
                        <Badge variant="outline" className={`text-[8px] font-black uppercase px-2 border-slate-200 ${item.origin === 'vegetal' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.origin}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        {hasDiscount ? (
                          <>
                            <span className="text-[10px] font-bold text-slate-400 line-through">R$ {parseFloat(item.price.replace(",", ".")).toFixed(2)}</span>
                            <span className="font-black text-orange-600">R$ {discountedPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-black text-slate-900">R$ {parseFloat(item.price.replace(",", ".")).toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => toggleStatus(item.id)}
                        className={`border-none font-black text-[9px] uppercase px-4 py-1.5 rounded-full transition-all active:scale-90
                          ${item.status ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}
                        `}
                      >
                        {item.status ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleDuplicate(item)}
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 bg-slate-100 text-slate-400 hover:bg-orange-600 hover:text-white rounded-2xl transition-all"
                        >
                          <Copy size={18} />
                        </Button>
                        <Button 
                          onClick={() => handleEdit(item)}
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 bg-slate-900 text-white hover:bg-black rounded-2xl shadow-lg shadow-slate-200"
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(item.id)}
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 bg-slate-50 text-slate-300 hover:bg-red-600 hover:text-white rounded-2xl transition-all"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ItemsPage;