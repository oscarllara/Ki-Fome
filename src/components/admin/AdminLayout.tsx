"use client";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { ShieldCheck, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (!auth) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 h-20 shrink-0">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar em todo o sistema..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="rounded-xl relative text-slate-400">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 uppercase">Dono do Sistema</p>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Online</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;