"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutGrid, QrCode, Receipt, Users, 
  Clock, CheckCircle2, AlertCircle, MoreVertical,
  Printer, Trash2, Plus
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const TableManagerPage = () => {
  const [tables, setTables] = useState([
    { id: "01", status: "occupied", total: "R$ 145,90", time: "45 min", people: 4 },
    { id: "02", status: "free", total: "R$ 0,00", time: "-", people: 0 },
    { id: "03", status: "occupied", total: "R$ 32,00", time: "12 min", people: 2 },
    { id: "04", status: "waiting_bill", total: "R$ 210,50", time: "1h 20", people: 6 },
  ]);

  return (
    <AdminLayout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestão de Salão</h1>
          <p className="text-slate-500 font-medium">Monitore as mesas e comandas em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold h-12 gap-2 border-slate-200">
            <Printer size={18} /> Imprimir QR Codes
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black h-12 px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-orange-100">
            <Plus size={18} className="mr-2" /> Adicionar Mesa
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {tables.map((table) => (
          <Card key={table.id} className={`border-none shadow-sm rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02]
            ${table.status === 'occupied' ? 'bg-white' : table.status === 'waiting_bill' ? 'bg-orange-50 ring-2 ring-orange-500' : 'bg-slate-50 opacity-60'}
          `}>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl
                  ${table.status === 'occupied' ? 'bg-orange-100 text-orange-600' : table.status === 'waiting_bill' ? 'bg-orange-600 text-white' : 'bg-white text-slate-300'}
                `}>
                  {table.id}
                </div>
                <Badge className={`border-none px-3 py-1 rounded-full text-[9px] font-black uppercase
                  ${table.status === 'occupied' ? 'bg-blue-100 text-blue-600' : table.status === 'waiting_bill' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-200 text-slate-500'}
                `}>
                  {table.status === 'occupied' ? 'Ocupada' : table.status === 'waiting_bill' ? 'Pediu Conta' : 'Livre'}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumo</p>
                    <p className="text-2xl font-black text-slate-900">{table.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo</p>
                    <p className="text-xs font-bold text-slate-600">{table.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users size={14} />
                    <span className="text-xs font-bold">{table.people}</span>
                  </div>
                  <div className="flex-1 flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-100 text-slate-400 hover:text-orange-600"><Receipt size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-100 text-slate-400 hover:text-orange-600"><QrCode size={16} /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default TableManagerPage;