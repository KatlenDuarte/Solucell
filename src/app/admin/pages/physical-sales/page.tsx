// pages/dashboard.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
    ShoppingCart, Wrench, Package, AlertTriangle, DollarSign,
} from 'lucide-react'
// Assumindo que o arquivo lumi.ts está em uma pasta acima:
import { lumi } from '../../lib/lumi'
import toast from 'react-hot-toast'
// ATENÇÃO: Confirme que este caminho está correto e o arquivo CSS existe
import styles from '../../styles/PhysicalStoreSalesPage.module.css'

// ===============================================
// TIPAGENS DA API (Simplificadas para o exemplo)
// ===============================================

interface Venda {
    _id: string
    numeroVenda: string
    dataVenda: string
    valorTotal: number
    statusPagamento: 'pago' | 'pendente' | 'parcial' | 'cancelado'
    cliente?: { nome: string }
}

interface Manutencao {
    _id: string
    numeroOS: string
    dataEntrada: string
    status: 'aguardando' | 'em_andamento' | 'aguardando_peca' | 'pronto'
    cliente?: { nome: string }
    aparelho?: { marca: string, modelo: string }
}

interface EstoqueItem {
    _id: string
    nome: string
    codigo: string
    quantidade: number
    quantidadeMinima: number
}

interface DashboardStats {
    vendasHoje: number
    faturamentoHoje: number
    osAbertas: number
    estoqueAlerta: number
}

// ===============================================
// COMPONENTE DASHBOARD
// ===============================================

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        vendasHoje: 0,
        faturamentoHoje: 0,
        osAbertas: 0,
        estoqueAlerta: 0
    })
    const [recentSales, setRecentSales] = useState<Venda[]>([])
    const [activeOS, setActiveOS] = useState<Manutencao[]>([])
    const [lowStockItems, setLowStockItems] = useState<EstoqueItem[]>([])
    const [loading, setLoading] = useState(true)

    // Funções auxiliares para mapear status para classes CSS
    const getStatusClass = useCallback((status: Manutencao['status'] | string): string => {
        switch (status) {
            case 'aguardando': return styles['status-aguardando']
            case 'em_andamento': return styles['status-andamento']
            case 'aguardando_peca': return styles['status-peca']
            case 'pronto': return styles['status-pronto']
            default: return styles['status-default']
        }
    }, [])

    const getPaymentStatusClass = useCallback((status: Venda['statusPagamento'] | string): string => {
        switch (status) {
            case 'pago': return styles['payment-pago']
            case 'pendente': return styles['payment-pendente']
            case 'parcial': return styles['payment-parcial']
            case 'cancelado': return styles['payment-cancelado']
            default: return styles['payment-default']
        }
    }, [])

    // Formata o valor de faturamento
    const formatCurrency = (value: number) =>
        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`


    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true)

            const today = new Date().toISOString().split('T')[0]

            // 1. Carregar Dados
            const [vendasRes, manutencoesRes, estoqueRes] = await Promise.all([
                lumi.entities.vendas.list({ sort: { dataVenda: -1 }, limit: 5 }),
                lumi.entities.manutencoes.list({
                    filter: { status: { $in: ['aguardando', 'em_andamento', 'aguardando_peca'] } },
                    sort: { dataEntrada: -1 },
                    limit: 5
                }),
                lumi.entities.estoque.list({ sort: { quantidade: 1 } })
            ]);

            const vendas = vendasRes.list as Venda[]
            const manutencoes = manutencoesRes.list as Manutencao[]
            const estoque = estoqueRes.list as EstoqueItem[]

            // 2. Calcular Estatísticas
            const vendasHoje = vendas.filter(v => v.dataVenda?.startsWith(today)).length

            const faturamentoHoje = vendas
                .filter(v => v.dataVenda?.startsWith(today) && v.statusPagamento === 'pago')
                .reduce((sum, v) => sum + (v.valorTotal || 0), 0)

            const activeOSFiltered = manutencoes.filter(os =>
                ['aguardando', 'em_andamento', 'aguardando_peca'].includes(os.status)
            )
            const osAbertas = activeOSFiltered.length

            const lowStockItemsFiltered = estoque.filter(item =>
                item.quantidade <= item.quantidadeMinima
            )
            const estoqueAlerta = lowStockItemsFiltered.length

            setStats({
                vendasHoje,
                faturamentoHoje,
                osAbertas,
                estoqueAlerta
            })

            // 3. Definir Listas
            setRecentSales(vendas.slice(0, 5))
            setActiveOS(activeOSFiltered.slice(0, 5))
            setLowStockItems(lowStockItemsFiltered.slice(0, 5))

        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error)
            toast.error('Erro ao carregar dados do dashboard')
        } finally {
            setLoading(false)
        }
    }, []) // Dependências removidas por serem usadas no useCallback

    useEffect(() => {
        loadDashboardData()
    }, [loadDashboardData])

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        )
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardContainerWrapper}>

                {/* Título e Subtítulo */}
                <header className={styles.dashboardHeader}>
                    <h1 className={styles.pageTitle}>Visão Geral Solucell</h1>
                    <p className={styles.pageSubtitle}>Acompanhe as principais métricas e acesse as funções mais importantes rapidamente.</p>
                </header>

                {/* Ações Rápidas (Movidas para o topo) */}
                <div className={styles.actionsGrid}>
                    <Link
                        href="/admin/pages/physical-sales/NewSale"
                        className={`${styles.actionCard} ${styles.actionCardBlue}`}
                    >
                        <div className={styles.actionContent}>
                            <ShoppingCart className={styles.actionIcon} />
                            <div>
                                <h3 className={styles.actionTitle}>Nova Venda</h3>
                                <p className={styles.actionSubtitle}>Registrar nova venda</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/manutencoes/nova"
                        className={`${styles.actionCard} ${styles.actionCardOrange}`}
                    >
                        <div className={styles.actionContent}>
                            <Wrench className={styles.actionIcon} />
                            <div>
                                <h3 className={styles.actionTitle}>Nova OS</h3>
                                <p className={styles.actionSubtitle}>Abrir ordem de serviço</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/estoque"
                        className={`${styles.actionCard} ${styles.actionCardGreen}`}
                    >
                        <div className={styles.actionContent}>
                            <Package className={styles.actionIcon} />
                            <div>
                                <h3 className={styles.actionTitle}>Gerenciar Estoque</h3>
                                <p className={styles.actionSubtitle}>Controlar produtos</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Cards de Estatísticas */}
                <div className={styles.statsGrid}>
                    {/* Card: Vendas Hoje */}
                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Vendas Hoje</p>
                            <p className={styles.statValue}>{stats.vendasHoje}</p>
                        </div>
                        <div className={`${styles.statIconBox} ${styles.iconBlue}`}>
                            <ShoppingCart className={styles.icon} />
                        </div>
                    </div>

                    {/* Card: Faturamento Hoje */}
                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Faturamento Hoje</p>
                            <p className={styles.statValue}>
                                {formatCurrency(stats.faturamentoHoje)}
                            </p>
                        </div>
                        <div className={`${styles.statIconBox} ${styles.iconGreen}`}>
                            <DollarSign className={styles.icon} />
                        </div>
                    </div>

                    {/* Card: OS em Andamento */}
                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>OS em Andamento</p>
                            <p className={styles.statValue}>{stats.osAbertas}</p>
                        </div>
                        <div className={`${styles.statIconBox} ${styles.iconOrange}`}>
                            <Wrench className={styles.icon} />
                        </div>
                    </div>

                    {/* Card: Alertas de Estoque */}
                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Alertas de Estoque</p>
                            <p className={styles.statValue}>{stats.estoqueAlerta}</p>
                        </div>
                        <div className={`${styles.statIconBox} ${styles.iconRed}`}>
                            <AlertTriangle className={styles.icon} />
                        </div>
                    </div>
                </div>

                {/* Seções de Dados */}
                <div className={styles.dataGrid}>

                    {/* Vendas Recentes */}
                    <div className={styles.dataSection}>
                        <div className={styles.dataHeader}>
                            <h3 className={styles.dataTitle}>Vendas Recentes</h3>
                            <Link href="/vendas" className={styles.dataLink}>
                                Ver todas
                            </Link>
                        </div>
                        <div className={styles.dataBody}>
                            {recentSales.length === 0 ? (
                                <p className={styles.emptyMessage}>Nenhuma venda registrada</p>
                            ) : (
                                <div className={styles.list}>
                                    {recentSales.map((venda) => (
                                        <div key={venda._id} className={styles.listItem}>
                                            <div>
                                                <p className={styles.listPrimaryText}>{venda.numeroVenda}</p>
                                                <p className={styles.listSecondaryText}>{venda.cliente?.nome || 'Cliente Não Informado'}</p>
                                                <p className={styles.listDateText}>
                                                    {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className={styles.listRightContent}>
                                                <p className={styles.listPrimaryText}>
                                                    {formatCurrency(venda.valorTotal)}
                                                </p>
                                                <span className={`${styles.badge} ${getPaymentStatusClass(venda.statusPagamento)}`}>
                                                    {venda.statusPagamento.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OS em Andamento */}
                    <div className={styles.dataSection}>
                        <div className={styles.dataHeader}>
                            <h3 className={styles.dataTitle}>Manutenções em Andamento</h3>
                            <Link href="/manutencoes" className={styles.dataLink}>
                                Ver todas
                            </Link>
                        </div>
                        <div className={styles.dataBody}>
                            {activeOS.length === 0 ? (
                                <p className={styles.emptyMessage}>Nenhuma OS em andamento</p>
                            ) : (
                                <div className={styles.list}>
                                    {activeOS.map((os) => (
                                        <div key={os._id} className={styles.listItem}>
                                            <div>
                                                <p className={styles.listPrimaryText}>{os.numeroOS}</p>
                                                <p className={styles.listSecondaryText}>{os.cliente?.nome || 'Cliente Não Informado'}</p>
                                                <p className={styles.listDateText}>
                                                    {os.aparelho?.marca} {os.aparelho?.modelo}
                                                </p>
                                            </div>
                                            <div className={styles.listRightContent}>
                                                <span className={`${styles.badge} ${getStatusClass(os.status)}`}>
                                                    {os.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <p className={styles.listDateText}>
                                                    {new Date(os.dataEntrada).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alertas de Estoque */}
                {lowStockItems.length > 0 && (
                    <div className={styles.dataSectionFull}>
                        <div className={styles.dataHeader}>
                            <h3 className={`${styles.dataTitle} ${styles.alertTitle}`}>
                                <AlertTriangle className={styles.alertIcon} />
                                Alertas de Estoque Baixo
                            </h3>
                            <Link href="/estoque" className={styles.dataLink}>
                                Ver estoque
                            </Link>
                        </div>
                        <div className={styles.dataBody}>
                            <div className={styles.stockAlertGrid}>
                                {lowStockItems.map((item) => (
                                    <div key={item._id} className={styles.stockAlertCard}>
                                        <div className={styles.stockAlertContent}>
                                            <div>
                                                <p className={styles.listPrimaryText}>{item.nome}</p>
                                                <p className={styles.listSecondaryText}>{item.codigo}</p>
                                            </div>
                                            <div className={styles.listRightContent}>
                                                <p className={styles.stockAlertValue}>
                                                    {item.quantidade} unidades
                                                </p>
                                                <p className={styles.listDateText}>
                                                    Mín: {item.quantidadeMinima}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard