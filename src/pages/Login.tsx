"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { Lock, Mail, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Se já estiver logado, vai pro dashboard mestre
    const auth = localStorage.getItem("admin_auth");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais solicitadas pelo usuário (DONO DO SISTEMA)
    if (email === "admin@admin.com" && password === "Senha@123") {
      showSuccess("Acesso master autorizado!");
      localStorage.setItem("admin_auth", "true");
      navigate("/"); // Redireciona para o Hub Central
    } else {
      showError("E-mail ou senha administrativa incorretos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1500')] bg-cover bg-center opacity-10"></div>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden relative z-10 bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-slate-900 text-white text-center pb-12 pt-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          
          <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-600/30 border border-orange-400/20 relative z-10">
            <ShieldCheck className="text-white" size={40} />
          </div>
          <CardTitle className="text-3xl font-black tracking-tighter uppercase relative z-10">KIFOME ADMIN</CardTitle>
          <CardDescription className="text-slate-400 font-bold pt-2 uppercase tracking-[0.2em] text-[10px] relative z-10">
            Acesso Restrito ao Dono do Sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-10 px-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">E-mail Administrativo</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@admin.com" 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-orange-600 font-bold text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Senha Mestra</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-orange-600 font-bold text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 transition-all uppercase tracking-widest active:scale-95">
              AUTORIZAR ACESSO
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-10 pt-4 text-center flex justify-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
            Central de Comando v1.0
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;