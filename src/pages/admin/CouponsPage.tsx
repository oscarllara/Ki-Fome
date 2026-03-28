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
  Plus, Trash2, Save, Ticket, Store, Users, Calendar, 
  ArrowLeft, Search, Edit2, Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

const INITIAL_COUPONS = [
  { id: 8, name: "Kifome20", code: "kifome20", type: "Desconto em valor", value: "5.00", expiry: "2025-12-31", active: true },
];

const CouponsPage = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: "Kifome20",
    description: "Kifome Teste",
    code: "kifome20",
    type: "Desconto em valor",
    maxDiscount: "",
    value: "5.00",
    expiry: "2025-12-31",
    stores: ["LOJA TESTE", "LOJA TESTE 2", "Ki + Lanches", "TOP PORÇÕES", "Ki-Fome Teste"],
    maxUsage: "100",
    minSubtotal: "0.00",
    subtotalMessage: "Parabéns você \"pegou\" um novo cupom!!!",
    userType: "Tempos ilimitados para todos os usuários",
    active: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(editingCoupon ? "Cupom atualizado!" : "Cupom criado!");
    setView("list");
  };

  if (view === "form") {
    return (
      <AdminLayout>
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 hover:text-orange-600 transition-colors">
          <ArrowLeft size={14} /> Voltar para lista
        </button>

        <form onSubmit={handleSave} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mb-20">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
             <Ticket className="text-orange-500" size={20} />
             <h3 className="font-black text-slate-900 uppercase tracking-tight">
               {editingCoupon ? `Editando: ${formData.name}` : "Novo Cupom de Desconto"}
             </h3>
          </div>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Nome do cupom:</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 font-bold" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição do cupom:</Label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl h-12 font-bold" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Código do cupom:</Label>
                <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="rounded-xl h-12 font-black uppercase" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Tipo de desconto:</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                    <SelectTrigger className="h-12 rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Desconto em valor" className="font-bold">Desconto em valor</SelectItem>
                      <SelectItem value="Desconto em porcentagem" className="font-bold">Desconto em porcentagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Desconto máximo:</Label>
                  <Input value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})} placeholder="Desconto máximo aplicável em R$" className="rounded-xl h-12 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Cupom de desconto:</Label>
                  <Input value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="rounded-xl h-12 font-black" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Data de expiração:</Label>
                  <Input type="date" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} className="rounded-xl h-12 font-bold" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Cupom aplicável as lojas:</Label>
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {formData.stores.map(store => (
                    <Badge key={store} className="bg-slate-900 text-white rounded-lg px-3 py-1 font-bold text-[10px] uppercase flex items-center gap-2">
                      {store} <button type="button" className="hover:text-red-400">×</button>
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-orange-600">+ Adicionar</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Número máximo de utilização:</Label>
                  <Input value={formData.maxUsage} onChange={(e) => setFormData({...formData, maxUsage: e.target.value})} className="rounded-xl h-12 font-bold" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Subtotal mínimo:</Label>
                  <Input value={formData.minSubtotal} onChange={(e) => setFormData({...formData, minSubtotal: e.target.value})} className="rounded-xl h-12 font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mensagem do subtotal não alcançado:</Label>
                <Input value={formData.subtotalMessage} onChange={(e) => setFormData({...formData, subtotalMessage: e.target.value})} className="rounded-xl h-12 font-bold" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">*Tipo de usuário de cupom:</Label>
                <Select value={formData.userType} onValueChange={(val) => setFormData({...formData, userType: val})}>
                  <SelectTrigger className="h-12 rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Tempos ilimitados para todos os usuários" className="font-bold">Tempos ilimitados para todos os usuários</SelectItem>
                    <SelectItem value="Uma vez por usuário" className="font-bold">Uma vez por usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
                <Label className="text-[10px] font-black uppercase text-slate-400">Está ativo?</Label>
                <Switch checked={formData.active} onCheckedChange={(val) => setFormData({...formData, active: val})} />
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t flex justify-between items-center">
            <Button type="button" variant="ghost" className="bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-black uppercase text-[10px] h-12 px-8">
              EXCLUIR
            </Button>
            <Button type="submit" className="bg-black hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-12 flex items-center gap-2">
              ATUALIZAR <Save size={16} />
            </Button>
          </div>
        </form>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Cupons de Desconto</h1>
        <Button onClick={() => { setEditingCoupon(null); setView("form"); }} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black h-12 px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100">
          <Plus size={20} className="mr-2" /> Novo Cupom
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Código</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiração</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-slate-900 uppercase">{coupon.code}</td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{coupon.type}</td>
                  <td className="px-8 py-5 font-black text-orange-600">R$ {coupon.value}</td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{coupon.expiry}</td>
                  <td className="px-8 py-5 text-center">
                    <Badge className={`border-none px-3 py-1 rounded-full text-[9px] font-black uppercase ${coupon.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {coupon.active ? 'ATIVO' : 'INATIVO'}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => { setEditingCoupon(coupon); setView("form"); }} variant="ghost" size="icon" className="h-10 w-10 bg-slate-900 text-white rounded-xl hover:bg-black transition-all"><Edit2 size={16} /></Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 bg-slate-50 text-slate-300 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></Button>
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

export default CouponsPage;