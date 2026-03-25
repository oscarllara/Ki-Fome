"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais solicitadas pelo usuário
    if (email === "admin@admin.com" && password === "Senha@123") {
      showSuccess("Login realizado com sucesso!");
      localStorage.setItem("admin_auth", "true");
      navigate("/admin");
    } else {
      showError("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-orange-600 text-white text-center pb-10 pt-12">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
            <Lock className="text-white" size={32} />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">KIFOME ADMIN</CardTitle>
          <CardDescription className="text-orange-100 font-medium pt-2">
            Acesse o painel do gestor
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-slate-700 ml-1">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@admin.com" 
                  className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-orange-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-slate-700 ml-1">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-orange-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl shadow-lg shadow-orange-100 transition-all">
              ENTRAR NO PAINEL
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-8 pt-2 text-center flex justify-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Kifome.online © 2024
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;