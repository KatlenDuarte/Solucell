export type View = "Todas as Vendas" | "Vendas do Dia" | "Vendas da Semana" | "Vendas do Mês" | "Pedidos Pendentes" | "Pedidos Enviados" | "Pedidos Cancelados" | "Prontos para Envio";

export const views: View[] = [
  "Todas as Vendas",
  "Vendas do Dia",
  "Vendas da Semana",
  "Vendas do Mês",
  "Pedidos Pendentes",
  "Prontos para Envio",
  "Pedidos Enviados",
  "Pedidos Cancelados",
];

export const today = new Date().toISOString().slice(0, 10);

export const getStartOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
};

export const startOfWeek = getStartOfWeek();

export const getStartOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

export const startOfMonth = getStartOfMonth();