"use client";

import { useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";
import { CreditCard, Loader2 } from "lucide-react";

interface MercadoPagoPaymentProps {
  publicKey: string;
  amount: number;
  orderId: string;
  onPaymentSuccess: (details: any) => void;
}

const MercadoPagoPayment = ({ publicKey, amount, orderId, onPaymentSuccess }: MercadoPagoPaymentProps) => {
  useEffect(() => {
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
              theme: 'default',
            }
          }
        },
        callbacks: {
          onReady: () => {
            console.log("Mercado Pago Brick pronto.");
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            try {
              showSuccess("Processando pagamento...");
              
              // Simulação de sucesso (Aqui chamaremos a Edge Function do Supabase no futuro)
              return new Promise((resolve) => {
                setTimeout(() => {
                  showSuccess("Pagamento aprovado!");
                  onPaymentSuccess({ status: 'approved', id: 'MP-' + Date.now() });
                  resolve(true);
                }, 2000);
              });

            } catch (error) {
              showError("Erro ao processar pagamento.");
              console.error(error);
            }
          },
          onError: (error: any) => {
            showError("Erro no formulário de pagamento.");
            console.error(error);
          },
        },
      };
      
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
          <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest">Carregando checkout seguro...</p>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoPayment;