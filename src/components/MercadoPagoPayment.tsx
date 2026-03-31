"use client";

import { useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

interface MercadoPagoPaymentProps {
  publicKey: string;
  amount: number;
  orderId: string;
  onPaymentSuccess: (details: any) => void;
}

const MercadoPagoPayment = ({ publicKey, amount, orderId, onPaymentSuccess }: MercadoPagoPaymentProps) => {
  useEffect(() => {
    // Verifica se o SDK foi carregado no index.html
    // @ts-ignore
    if (!window.MercadoPago) {
      showError("Erro ao carregar SDK do Mercado Pago.");
      return;
    }

    // @ts-ignore
    const mp = new window.MercadoPago(publicKey, {
      locale: 'pt-BR'
    });

    const bricksBuilder = mp.bricks();

    const renderPaymentBrick = async (bricksBuilder: any) => {
      const settings = {
        initialization: {
          amount: amount,
          // Se for usar Checkout Pro, você precisaria de um preferenceId gerado no backend
          // preferenceId: "ID_GERADO_NO_BACKEND", 
        },
        customization: {
          paymentMethods: {
            ticket: "all",
            bankTransfer: "all",
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
          },
          visual: {
            style: {
              theme: 'default', // ou 'dark'
            }
          }
        },
        callbacks: {
          onReady: () => {
            console.log("Mercado Pago Brick está pronto.");
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            // ESTA É A PARTE QUE ENVIA PARA O SEU SERVIDOR
            console.log("Dados gerados pelo Brick:", formData);
            
            try {
              showSuccess("Comunicando com o servidor de pagamento...");
              
              /* 
                EXEMPLO DE COMO SERIA A CHAMADA REAL:
                
                const response = await fetch("SUA_API_URL/process_payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                if (result.status === 'approved') {
                  onPaymentSuccess(result);
                }
              */

              // Simulação de sucesso para o protótipo
              return new Promise((resolve) => {
                setTimeout(() => {
                  showSuccess("Pagamento aprovado com sucesso!");
                  onPaymentSuccess({ status: 'approved', id: 'MP-' + Date.now() });
                  resolve(true);
                }, 2000);
              });

            } catch (error) {
              showError("Erro ao processar pagamento no servidor.");
              console.error(error);
            }
          },
          onError: (error: any) => {
            showError("Erro no formulário de pagamento.");
            console.error(error);
          },
        },
      };
      
      // Limpa o container antes de renderizar (evita duplicatas)
      const container = document.getElementById("paymentBrick_container");
      if (container) container.innerHTML = "";
      
      await bricksBuilder.create("payment", "paymentBrick_container", settings);
    };

    renderPaymentBrick(bricksBuilder);
  }, [publicKey, amount, orderId]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-100 shadow-xl shadow-blue-50 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
          <CreditCard size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Pagamento Online</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Processado com segurança pelo Mercado Pago</p>
        </div>
      </div>
      
      <div id="paymentBrick_container">
        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest">Carregando checkout seguro...</p>
        </div>
      </div>
    </div>
  );
};

import { CreditCard } from "lucide-react";
export default MercadoPagoPayment;