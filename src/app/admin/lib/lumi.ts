
import { createClient } from '@lumi.new/sdk'

export const lumi = createClient({
  projectId: 'p362736234890457088',
  apiBaseUrl: 'https://api.lumi.new',
  authOrigin: 'https://auth.lumi.new',
})

export interface Venda {
  _id: string
  numeroVenda: string
  cliente: {
    nome: string
    telefone: string
    email?: string
  }
  valorTotal: number
  statusPagamento: 'pago' | 'pendente' | 'parcial' | 'cancelado' | string
  formaPagamento?: string
  vendedor?: string
  dataVenda: string // Formato 'YYYY-MM-DD'
  itens: Array<{
    tipo: string
    descricao: string
    quantidade: number
    valorUnitario: number
  }>
}