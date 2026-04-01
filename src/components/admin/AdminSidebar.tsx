"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Store, UtensilsCrossed, Users, 
  FileText, Megaphone, Wallet, Settings, ChevronDown, 
  ChevronRight, LogOut, LayoutList, UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const MENU_STRUCTURE = [
  { title: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/gestor" },
  { title: "Lojas", icon: <Store size={20} />, href: "/admin/stores" },
  { 
    title: "Itens & Menu", 
    icon: <UtensilsCrossed size={20} />, 
    subItems: [
      { title: "Categorias", href: "/admin/menu/menu-categories" },
      { title: "Complementos", href: "/admin/menu/complements" },
      { title: "Itens", href: "/admin/menu/items" },
    ]
  },
  { 
    title: "Usuários", 
    icon: <Users size={20} />, 
    subItems: [
      { title: "Todos", href: "/admin/users/all" },
      { title: "Clientes", href: "/admin/users/customers" },
      { title: "Proprietários", href: "/admin/users/owners" },
      { title: "Gestor Master", href: "/admin/users/masters" },
      { title: "Parceiros", href: "/admin/users/partners" },
      { title: "Entregadores", href: "/admin/users/drivers" },
      { title: "Garçons", href: "/admin/users/staff" },
    ]
  },
  { 
    title: "Pedidos", 
    icon: <LayoutList size={20} />, 
    subItems: [
      { title: "Gestor", href: "/admin/orders/manager" },
      { title: "Lista", href: "/admin/orders/list" },
      { title: "Mesas", href: "/admin/orders/tables" },
    ]
  },
  { 
    title: "Promoções", 
    icon: <Megaphone size={20} />, 
    subItems: [
      { title: "Slides", href: "/admin/promos/slides" },
      { title: "Cupons", href: "/admin/promos/coupons" },
      { title: "Notificações Push", href: "/admin/promos/push" },
    ]
  },
  { 
    title: "Financeiro", 
    icon: <Wallet size={20} />, 
    subItems: [
      { title: "Pagamentos", href: "/admin/transactions/payments" },
      { title: "Carteira", href: "/admin/transactions/wallet" },
    ]
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["Usuários", "Lojas"]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen border-r border-white/5 sticky top-0 overflow-y-auto no-scrollbar">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black">K</div>
          <span className="text-xl font-black tracking-tighter">KIFOME</span>
        </div>
        
        <nav className="space-y-1">
          {MENU_STRUCTURE.map((item) => {
            const isActive = location.pathname === item.href || item.subItems?.some(s => s.href === location.pathname);
            const isOpen = openMenus.includes(item.title);

            if (item.subItems) {
              return (
                <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleMenu(item.title)}>
                  <CollapsibleTrigger asChild>
                    <button className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all",
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
                      <Link key={sub.href} to={sub.href} className={cn(
                        "block py-2 text-xs transition-colors",
                        location.pathname === sub.href ? "text-orange-500 font-bold" : "text-slate-500 hover:text-slate-200"
                      )}>
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
                  location.pathname === item.href ? "bg-orange-500 text-white font-bold" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}>
                  {item.icon} <span className="text-sm">{item.title}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <Button onClick={() => window.location.href = "/login"} variant="ghost" className="w-full text-slate-400 hover:text-red-400 rounded-xl justify-start gap-3">
           <LogOut size={20} /> Sair
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;