"use client";

import { useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

interface MercadoPagoPaymentProps {
  publicKey: string;
  amount: number;
  orderId: string;
}

const MercadoPagoPayment = ({ publicKey, amount, orderId }: MercadoPagoPaymentProps) => {
  useEffect(() => {
    // @ts-ignore
    const mp = new window.MercadoPago(publicKey, {
      locale: 'pt-BR'
    });

    const bricksBuilder = mp.bricks();

    const renderPaymentBrick = async (bricksBuilder: any) => {
      const settings = {
        initialization: {
          amount: amount, // valor total
          preferenceId: "<PREFERENCE_ID>", // Opcional para Checkout Pro
        },
        customization: {
          paymentMethods: {
            ticket: "all",
            bankTransfer: "all",
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
          },
        },
        callbacks: {
          onReady: () => {
            console.log("Brick pronto");
          },
          onSubmit: ({ selectedPaymentMethod, formData }: any) => {
            // Aqui o token é gerado com segurança
            console.log("Dados para o backend:", formData);
            showSuccess("Processando pagamento com segurança...");
            
            // Simulação de sucesso
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                showSuccess("Pagamento Aprovado!");
                resolve(true);
              }, 2000);
            });
          },
          onError: (error: any) => {
            showError("Erro no processamento do pagamento.");
            console.error(error);
          },
        },
      };
      
      await bricksBuilder.create("payment", "paymentBrick_container", settings);
    };

    renderPaymentBrick(bricksBuilder);
  }, [publicKey, amount]);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Pagamento Seguro via Mercado Pago</h3>
      <div id="paymentBrick_container"></div>
    </div>
  );
};

export default MercadoPagoPayment;