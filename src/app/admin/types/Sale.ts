export interface Sale {
  id: string;
  customerName: string;
  date: string;
  status: "Pendente" | "Processando" | "Enviado" | "Cancelado" | "Preparando" | "Pronto para Envio";
  total: number;
  products: { name: string; quantity: number; price: number }[];
  address: { street: string; number: string; city: string; state: string; zip: string };
  paymentMethod: "Cartão de Crédito" | "Boleto" | "Pix";
  cancellationReason?: string;
  
}