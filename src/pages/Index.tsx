"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Rocket, Globe, Zap, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 text-center md:py-32">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
          <Rocket size={16} />
          <span>Pronto para o Deploy</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Seu novo projeto incrível <br /> começa aqui.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Uma base sólida, moderna e performática para você construir a próxima grande ideia. 
          Estilizado com Tailwind CSS e componentes Shadcn/ui.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-full text-lg h-14">
            Começar Agora
          </Button>
          <Button variant="outline" size="lg" className="border-slate-200 px-8 rounded-full text-lg h-14">
            Ver Documentação
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 border border-slate-100">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Alta Performance</h3>
              <p className="text-slate-600 leading-relaxed">
                Desenvolvido com Vite para garantir que sua aplicação carregue instantaneamente.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 border border-slate-100">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Escalabilidade</h3>
              <p className="text-slate-600 leading-relaxed">
                Pronto para ser publicado globalmente com suporte nativo à Vercel.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 border border-slate-100">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Segurança</h3>
              <p className="text-slate-600 leading-relaxed">
                Melhores práticas de desenvolvimento e suporte a variáveis de ambiente seguras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 mt-auto">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <MadeWithDyad />
          <p className="text-slate-400 text-sm mt-4">
            &copy; {new Date().getFullYear()} Seu Projeto. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;