"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, Image as ImageIcon, Users, Bell, 
  Smartphone, UserPlus, Trash2, Upload, Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";

const PushNotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");

  const stats = [
    { label: "Clientes Registrados", value: "226", color: "text-slate-400" },
    { label: "Assinantes", value: "161", color: "text-slate-400" },
    { label: "Usuários do Aplicativo", value: "153", color: "text-slate-400" },
    { label: "Excluir dados indesejados", value: "1235", color: "text-red-500" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Notificação enviada com sucesso!");
    setTitle("");
    setMessage("");
    setUrl("");
  };

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Enviar notificações - Dashboard</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-8">
              <h3 className={`text-2xl font-black mb-1 ${stat.color}`}>{stat.value}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar de Abas */}
        <div className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => setActiveTab("todos")}
            className={`w-full text-left px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'todos' ? 'bg-red-700 text-white shadow-lg shadow-red-100' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
          >
            Para todos
          </button>
          <button 
            onClick={() => setActiveTab("selecionado")}
            className={`w-full text-left px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'selecionado' ? 'bg-red-700 text-white shadow-lg shadow-red-100' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
          >
            Para selecionado
          </button>
          <button 
            onClick={() => setActiveTab("nao-registrados")}
            className={`w-full text-left px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'nao-registrados' ? 'bg-red-700 text-white shadow-lg shadow-red-100' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
          >
            Para usuários de aplicativos não registrados
          </button>
        </div>

        {/* Formulário Principal */}
        <div className="lg:col-span-9">
          <form onSubmit={handleSend} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {activeTab === 'todos' && "ENVIAR NOTIFICAÇÕES PUSH E ALERTA PARA TODOS OS USUÁRIOS"}
                {activeTab === 'selecionado' && "ENVIAR NOTIFICAÇÕES PUSH E ALERTA PARA USUÁRIOS SELECIONADOS"}
                {activeTab === 'nao-registrados' && "ENVIAR NOTIFICAÇÃO PUSH, PARA USUÁRIOS OS NÃO REGISTRADOS NOS APLICATIVOS"}
              </h3>
            </div>

            <div className="p-10 space-y-10">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-1/3 space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Imagem de notificação:</Label>
                  <div className="w-full aspect-video bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group hover:border-orange-400 transition-all cursor-pointer">
                    <Upload size={40} className="mb-2 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Drop files here to upload</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase text-center">Tamanho da imagem: 1600 x 1100</p>
                </div>

                <div className="flex-1 w-full space-y-6">
                  {activeTab === 'selecionado' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-red-600 ml-1">*Selecionar os usuários:</Label>
                      <Input placeholder="Buscar usuários..." className="rounded-xl h-12 font-bold" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-red-600 ml-1">
                      {activeTab === 'nao-registrados' ? "*Notificação Title:" : "*Título da notificação:"}
                    </Label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={activeTab === 'nao-registrados' ? "Título da notificação" : "Título da notificação"} 
                      className="rounded-xl h-12 font-bold" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-red-600 ml-1">*Mensagem:</Label>
                    <Input 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mensagem de notificação" 
                      className="rounded-xl h-12 font-bold" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">URL:</Label>
                    <Input 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Este link será aberto quando a notificação for selecionada" 
                      className="rounded-xl h-12 font-bold" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex justify-end">
              <Button type="submit" className="bg-black hover:bg-slate-800 text-white rounded-xl h-12 px-12 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                <Send size={16} /> ENVIAR
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PushNotificationsPage;