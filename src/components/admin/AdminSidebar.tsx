"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Store, UtensilsCrossed, Users, Clock, 
  FileText, Megaphone, Wallet, Settings, ChevronDown, 
  ChevronRight, LogOut, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: { title: string; href: string }[];
}

const MENU_STRUCTURE: NavItem[] = [
  { title: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/" },
  { title: "Lojas", icon: <Store size={20} />, href: "/admin/stores" },
  { 
    title: "Itens & Menu", 
    icon: <UtensilsCrossed size={20} />, 
    subItems: [
      { title: "Categorias de menu", href: "/admin/menu/menu-categories" },
      { title: "Complementos", href: "/admin/menu/complements" },
      { title: "Itens", href: "/admin/menu/items" },
    ]
  },
  { 
    title: "Usuários", 
    icon: <Users size={20} />, 
    subItems: [
      { title: "Todos Usuários", href: "/admin/users/all" },
      { title: "Clientes", href: "/admin/users/customers" },
      { title: "Proprietários de lojas", href: "/admin/users/owners" },
      { title: "Entregadores", href: "/admin/users/drivers" },
      { title: "Funcionários", href: "/admin/users/staff" },
      { title: "Parceiros", href: "/admin/users/partners" },
    ]
  },
  { 
    title: "Pedidos", 
    icon: <Clock size={20} />, 
    subItems: [
      { title: "Lista de Pedidos", href: "/admin/orders/list" },
      { title: "Pedidos ao vivo", href: "/admin/orders/live" },
    ]
  },
  { 
    title: "Relatórios", 
    icon: <FileText size={20} />, 
    subItems: [
      { title: "Relatório do cliente", href: "/admin/reports/client" },
      { title: "Relatório loja", href: "/admin/reports/store" },
      { title: "Relatório pedido loja", href: "/admin/reports/order" },
      { title: "Relatório do entregador", href: "/admin/reports/driver" },
      { title: "Relatório saldo da loja", href: "/admin/reports/balance" },
    ]
  },
  { 
    title: "Promoções", 
    icon: <Megaphone size={20} />, 
    subItems: [
      { title: "Slides Promocionais", href: "/admin/promos/slides" },
      { title: "Slides das Categorias", href: "/admin/promos/cat-slides" },
      { title: "Cupons de Desconto", href: "/admin/promos/coupons" },
      { title: "Enviar Push", href: "/admin/promos/push" },
    ]
  },
  { 
    title: "Transações", 
    icon: <Wallet size={20} />, 
    subItems: [
      { title: "Pagamentos da Loja", href: "/admin/transactions/payments" },
      { title: "Coletas de Entrega", href: "/admin/transactions/collections" },
      { title: "Carteira", href: "/admin/transactions/wallet" },
    ]
  },
  { 
    title: "Configurações", 
    icon: <Settings size={20} />, 
    subItems: [
      { title: "Zonas (Franquias)", href: "/admin/settings/zones" },
      { title: "Configuração API Whatsapp", href: "/admin/settings/whatsapp" },
      { title: "Todas as Configurações", href: "/admin/settings/all" },
    ]
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen border-r border-white/5 sticky top-0 overflow-y-auto no-scrollbar">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-orange-500/20">K</div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">KIFOME</span>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Master Admin</span>
          </div>
        </div>
        
        <nav className="space-y-1">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2">Navegação</p>
          
          {MENU_STRUCTURE.map((item) => {
            const isActive = location.pathname === item.href || item.subItems?.some(s => s.href === location.pathname);
            const isOpen = openMenus.includes(item.title);

            if (item.subItems) {
              return (
                <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleMenu(item.title)}>
                  <CollapsibleTrigger asChild>
                    <button className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group",
                      isActive ? "text-orange-400 font-bold" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}>
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-sm">{item.title}</span>
                      </div>
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-11 space-y-1 mt-1">
                    {item.subItems.map(sub => (
                      <Link 
                        key={sub.href} 
                        to={sub.href}
                        className={cn(
                          "block py-2 text-xs transition-colors",
                          location.pathname === sub.href ? "text-orange-500 font-bold" : "text-slate-500 hover:text-slate-200"
                        )}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link key={item.href} to={item.href || "#"}>
                <button className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                  location.pathname === item.href ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}>
                  {item.icon} <span className="text-sm">{item.title}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <Button 
          onClick={handleLogout} 
          variant="ghost" 
          className="w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl justify-start gap-3"
        >
           <LogOut size={20} /> Sair do Sistema
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;