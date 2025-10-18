// Função que gera os dados (mock por enquanto)
export function generateDailySalesData() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const totalDias = new Date(year, month, 0).getDate();

  return Array.from({ length: totalDias }, (_, i) => ({
    name: `${i + 1}`,
    vendas: Math.floor(Math.random() * 100000) + 12000,
  }));
}

// Mock de estatísticas
export const stats = [
  { title: "Total de Vendas do Dia", value: "R$ 15.200", color: "#42A5F5" },
  { title: "Total de Vendas do Mês", value: "R$ 250.000", color: "#66BB6A" },
  { title: "Produtos em Estoque", value: "350", color: "#FFA726" },
  { title: "Clientes Registrados", value: "1.250", color: "#EF5350" },
];

// Mock de vendas recentes
export const recentSales = [
  { id: 1, product: "iPhone 13", value: "R$ 5.000", client: "João Silva", date: "2024-06-01" },
  { id: 2, product: "Samsung Galaxy S21", value: "R$ 4.200", client: "Maria Souza", date: "2024-06-02" },
  { id: 3, product: "Xiaomi Mi 11", value: "R$ 3.800", client: "Carlos Lima", date: "2024-06-03" },
  { id: 4, product: "Motorola Edge 20", value: "R$ 3.200", client: "Ana Paula", date: "2024-06-04" },
];

// Mock de produtos mais vendidos
export const topProducts = [
  { id: 1, name: "iPhone 15 Pro", sales: 50, revenue: "R$ 425.000" },
  { id: 2, name: "Samsung Galaxy S24 Ultra", sales: 45, revenue: "R$ 324.000" },
  { id: 3, name: "Google Pixel 8", sales: 30, revenue: "R$ 183.000" },
  { id: 4, name: "Google Pixel 8", sales: 30, revenue: "R$ 183.000" },
  { id: 5, name: "Google Pixel 8", sales: 30, revenue: "R$ 183.000" },
  { id: 6, name: "Google Pixel 8", sales: 30, revenue: "R$ 183.000" },
  { id: 7, name: "Google Pixel 8", sales: 30, revenue: "R$ 183.000" },
];

// Mock inventário
export const inventorySummary = [
  { name: "Celulares", count: 350 },
  { name: "Acessórios", count: 215 },
  { name: "Peças de Reposição", count: 88 },
];
