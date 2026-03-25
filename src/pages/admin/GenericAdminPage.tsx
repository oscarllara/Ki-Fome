"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Package } from "lucide-react";

interface GenericAdminPageProps {
  title: string;
}

const GenericAdminPage = ({ title }: GenericAdminPageProps) => {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
          <Package size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h1>
        <p className="text-slate-400 font-medium max-w-md">
          Esta seção está sendo preparada para receber os dados do seu sistema. 
          O menu lateral já está apontando corretamente para este endereço.
        </p>
      </div>
    </AdminLayout>
  );
};

export default GenericAdminPage;