"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Plus, Edit2, Trash2, Power, Save, Image as ImageIcon, 
  ArrowRight, Layout, Maximize, Trash
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const INITIAL_SLIDES = [
  { id: 1, title: "Brasil", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", active: true },
  { id: 2, title: "Brasil 2", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", active: true },
];

const SlidesPage = () => {
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [sliderName, setSliderName] = useState("Brasil");
  const [position, setPosition] = useState("principal");
  const [size, setSize] = useState("grande");

  const handleToggleActive = (id: number) => {
    setSlides(slides.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showSuccess("Status do slide alterado!");
  };

  const handleDeleteSlide = (id: number) => {
    if (window.confirm("Deseja excluir este slide?")) {
      setSlides(slides.filter(s => s.id !== id));
      showSuccess("Slide removido com sucesso!");
    }
  };

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Editar o Slider - Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel de Propriedades (Esquerda) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PROPERTIES DO SLIDER</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-600">Nome:</Label>
                  <Input 
                    value={sliderName} 
                    onChange={(e) => setSliderName(e.target.value)}
                    className="w-2/3 h-11 rounded-xl border-slate-200 font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-600">Posição:</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger className="w-2/3 h-11 rounded-xl border-slate-200 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="principal">Posição principal</SelectItem>
                      <SelectItem value="secundaria">Posição secundária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-600">Size:</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="w-2/3 h-11 rounded-xl border-slate-200 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="grande">Grande</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="pequeno">Pequeno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="bg-black hover:bg-slate-800 text-white rounded-xl h-11 px-8 font-black uppercase text-[10px] tracking-widest gap-2">
                  Atualizar <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-xl h-14 font-black uppercase text-[10px] tracking-widest gap-2">
              Desativar <Power size={16} />
            </Button>
            <Button variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-none rounded-xl h-14 font-black uppercase text-[10px] tracking-widest gap-2">
              EXCLUIR O SLIDER <Trash size={16} />
            </Button>
          </div>
        </div>

        {/* Painel de Slides (Direita) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SLIDES</h3>
            </div>
            
            <div className="p-8 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {slides.map((slide) => (
                  <div key={slide.id} className="space-y-3">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{slide.title}</p>
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm group">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      {!slide.active && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <Badge className="bg-red-500 text-white border-none font-black uppercase text-[8px]">Inativo</Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex rounded-xl overflow-hidden border border-slate-100">
                      <button className="flex-1 h-10 bg-slate-800 text-white flex items-center justify-center hover:bg-black transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="flex-1 h-10 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleToggleActive(slide.id)}
                        className={`flex-1 h-10 flex items-center justify-center transition-colors ${slide.active ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 flex justify-end">
              <Button className="bg-black hover:bg-slate-800 text-white rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest gap-2">
                ADICIONAR SLIDE <Plus size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SlidesPage;