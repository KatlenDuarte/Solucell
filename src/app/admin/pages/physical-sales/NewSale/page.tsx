"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Trash2, X } from 'lucide-react' 
import toast, { Toast } from 'react-hot-toast' // ⭐️ Importando 'Toast' para tipagem correta
// ATENÇÃO: Verifique o caminho. Se você está usando 'NewSale.module.css', o nome ideal seria 'Vendas.module.css'
import styles from '../../../styles/NewSale.module.css' 

// --- Interface de Venda Simplificada (Mantida) ---
interface ItemVenda {
    nome: string;
    quantidade: number;
}

interface VendaSimplificada {
    numeroVenda: string; 
    dataVenda: string; 
    valorTotal: number;
    formaPagamento: 'Dinheiro' | 'Pix' | 'Cartão' | 'Aberto/Fiado' | 'Outros'; 
    vendedor: string; 
    itens: ItemVenda[];
}

// --- MOCK DATA (Mantido) ---
const mockVendas: VendaSimplificada[] = [
    // ... (dados do mock) ...
    {
        numeroVenda: 'V0001', dataVenda: '2025-10-02T10:00:00Z', valorTotal: 150.75,
        formaPagamento: 'Pix', vendedor: 'Maria C.', 
        itens: [{ nome: 'Carregador Turbo', quantidade: 1 }, { nome: 'Cabo USB-C', quantidade: 2 }]
    },
    {
        numeroVenda: 'V0002', dataVenda: '2025-10-02T14:30:00Z', valorTotal: 300.00,
        formaPagamento: 'Aberto/Fiado', vendedor: 'Carlos A.',
        itens: [{ nome: 'Película de Vidro (Instalada)', quantidade: 4 }] 
    },
    {
        numeroVenda: 'V0003', dataVenda: '2025-10-01T18:45:00Z', valorTotal: 75.50,
        formaPagamento: 'Dinheiro', vendedor: 'Maria C.',
        itens: [{ nome: 'Capinha iPhone 15', quantidade: 1 }] 
    },
    {
        numeroVenda: 'V0004', dataVenda: '2025-09-30T09:15:00Z', valorTotal: 500.25,
        formaPagamento: 'Aberto/Fiado', vendedor: 'Carlos A.',
        itens: [{ nome: 'Fone Bluetooth Pro', quantidade: 1 }]
    },
    {
        numeroVenda: 'V0005', dataVenda: '2025-09-29T12:00:00Z', valorTotal: 99.90,
        formaPagamento: 'Cartão', vendedor: 'Ana P.',
        itens: [{ nome: 'Power Bank 10000mAh', quantidade: 1 }]
    },
];

// --- Modal de Exclusão Simples e Funcional ---
// ⭐️ CORREÇÃO 1: Tipagem correta de 't' de 'any' para 'Toast' do 'react-hot-toast'
const CustomDeleteToast: React.FC<{ t: Toast; numeroVenda: string; onConfirm: () => void }> = ({ t, numeroVenda, onConfirm }) => {
    // Usamos estilos INLINE simples para garantir que a funcionalidade não dependa do seu CSS
    const modalStyle: React.CSSProperties = {
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    };
    
    return (
        <div style={modalStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151' }}>Confirmar Exclusão</h3>
            <p style={{ marginTop: '8px', fontSize: '1rem', color: '#6b7280' }}>
                Tem certeza que deseja **EXCLUIR** a venda **{numeroVenda}**? Esta ação não pode ser desfeita.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <button 
                    onClick={() => toast.dismiss(t.id)} 
                    style={{ flex: 1, padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', color: '#374151', fontWeight: 500, cursor: 'pointer' }}
                >
                    Cancelar
                </button>
                <button 
                    onClick={() => {
                        onConfirm();
                        toast.dismiss(t.id);
                    }}
                    style={{ flex: 1, padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                    <Trash2 size={16} />
                    Excluir
                </button>
            </div>
        </div>
    );
};


// --- Venda Actions (Componente de Ações na Tabela) ---
interface VendaActionsProps {
    venda: VendaSimplificada;
    deleteVenda: (numeroVenda: string) => void; 
    handleViewDetails: (venda: VendaSimplificada) => void; 
}

const VendaActions: React.FC<VendaActionsProps> = ({ venda, deleteVenda, handleViewDetails }) => (
    <div className={styles.actions__container}>
        <button 
            onClick={() => handleViewDetails(venda)}
            className={`${styles.actions__button} ${styles['actions__button--view']}`} 
            title="Ver Detalhes (Itens)"
        >
            <Eye className={styles.icon} />
        </button>
        <button
            onClick={() => deleteVenda(venda.numeroVenda)}
            className={`${styles.actions__button} ${styles['actions__button--delete']}`}
            title="Excluir Venda"
        >
            <Trash2 className={styles.icon} />
        </button>
    </div>
);


// --- Componente Principal ---
const Vendas: React.FC = () => {
    const [vendas, setVendas] = useState<VendaSimplificada[]>(mockVendas) 
    // ⭐️ CORREÇÃO 2: Removido 'setLoading' da desestruturação para resolver o aviso de variável não utilizada (Linha 128 do seu log)
    const [loading] = useState(false) 
    const [searchTerm, setSearchTerm] = useState('')
    const [paymentFilter, setPaymentFilter] = useState<VendaSimplificada['formaPagamento'] | 'todos'>('todos') // ⭐️ Tipagem melhorada
    const [dateFilter, setDateFilter] = useState('')

    // Lógica de Exclusão com Modal SIMPLIFICADO
    const deleteVenda = (numeroVenda: string) => {
        // Função que será chamada se o usuário confirmar a exclusão
        const onConfirm = () => {
            setVendas(prev => prev.filter(v => v.numeroVenda !== numeroVenda));
            toast.success(`Venda ${numeroVenda} excluída com sucesso!`);
        };

        // Exibe o modal customizado de confirmação
        // ⭐️ CORREÇÃO 3: O 't' dentro da arrow function é tipado implicitamente, mas o componente CustomDeleteToast agora aceita o tipo correto 'Toast'.
        toast.custom((t) => (
            <CustomDeleteToast 
                t={t as Toast} // Garante a tipagem correta para o componente
                numeroVenda={numeroVenda} 
                onConfirm={onConfirm}
            />
        ), { duration: Infinity, position: 'top-center' }); // Mantém o toast aberto
    }

    // Lógica de Visualização de Itens (Olho)
    const handleViewDetails = (venda: VendaSimplificada) => {
        const itemDetails = venda.itens.map(item => 
            `${item.nome} (${item.quantidade}x)`
        ).join(', ');

        toast.success(
            <div style={{ padding: '0.5rem', minWidth: '300px' }}>
                <p style={{ fontWeight: 700, color: '#212529' }}>Detalhes da Venda {venda.numeroVenda}</p>
                <p style={{ marginTop: '0.25rem', color: '#495057', fontSize: '0.9rem' }}>{itemDetails}</p>
                <p style={{ marginTop: '0.25rem', fontWeight: 600, color: '#059669', fontSize: '0.9rem' }}>
                    Total: R$ {venda.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>,
            { duration: 5000, style: { minWidth: '400px' } }
        );
    }
    
    // As funções de filtro e renderização permanecem as mesmas
    const getPaymentColorClass = (formaPagamento: string) => {
        if (formaPagamento === 'Aberto/Fiado') {
            return styles['status-fiado']
        }
        return styles['status-pago']
    }

    const filteredVendas = useMemo(() => {
        return vendas.filter(venda => {
            const primaryItemName = venda.itens[0]?.nome.toLowerCase() || ''
            const matchesSearch = venda.numeroVenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                primaryItemName.includes(searchTerm.toLowerCase())

            // ⭐️ Ajuste para compatibilidade com o tipo 'todos'
            const matchesPayment = paymentFilter === 'todos' || venda.formaPagamento === paymentFilter

            const matchesDate = !dateFilter || venda.dataVenda.startsWith(dateFilter)

            return matchesSearch && matchesPayment && matchesDate
        })
    }, [vendas, searchTerm, paymentFilter, dateFilter])

    const salesSummary = useMemo(() => {
        const totalValue = filteredVendas.reduce((sum, v) => sum + (v.valorTotal || 0), 0)
        
        const totalRevenueFiado = filteredVendas
            .filter(v => v.formaPagamento === 'Aberto/Fiado')
            .reduce((sum, v) => sum + (v.valorTotal || 0), 0)

        const totalRevenuePago = filteredVendas
            .filter(v => v.formaPagamento !== 'Aberto/Fiado')
            .reduce((sum, v) => sum + (v.valorTotal || 0), 0)

        return {
            totalSales: filteredVendas.length,
            totalRevenue: totalValue,
            totalRevenueFiado: totalRevenueFiado,
            totalRevenuePago: totalRevenuePago
        }
    }, [filteredVendas])

    const handleClearFilters = () => {
        setSearchTerm('')
        setPaymentFilter('todos')
        setDateFilter('')
    }

    const getItemList = (itens: ItemVenda[]) => {
        if (itens.length === 0) return 'Sem itens'
        const firstItem = `${itens[0].nome} (${itens[0].quantidade}x)`
        if (itens.length === 1) return firstItem
        return `${firstItem} +${itens.length - 1} ${itens.length > 2 ? 'itens' : 'item'}`
    }

    if (loading) {
        return (
            <div className={styles.loading__container}>
                <div className={styles.loading__spinner}></div>
            </div>
        )
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles['header__title-group-new']}> 
                        <Link href="/admin/dashboard" passHref legacyBehavior>
                            <a className={styles['header__button--text-back']} title="Voltar para a Dashboard">
                                Voltar
                            </a>
                        </Link>
                        <h1 className={styles.header__title}>Controle de Vendas</h1>
                        <p className={styles['header__subtitle']}>Visão geral das vendas</p>
                    </div>
                    <Link href="/admin/pages/physical-sales/NewSale/AddProduct" passHref legacyBehavior>
                        <a className={styles['header__button--new-sale']}>
                            <Plus className={styles.header__buttonIcon} />
                            Registrar Nova Venda
                        </a>
                    </Link>
                </div>

                <div className={styles.summary__card}>
                    <div className={styles.summary__gridCustom}>
                        <div className={`${styles.summary__item} ${styles['summary__item--clean']}`}>
                            <p className={styles.summary__label}>Faturamento PAGO</p>
                            <p className={`${styles.summary__value} ${styles['summary__value--paid']}`}>
                                R$ {salesSummary.totalRevenuePago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className={`${styles.summary__item} ${styles['summary__item--clean']}`}>
                            <p className={styles.summary__label}>Total FIADO (A Receber)</p>
                            <p className={`${styles.summary__value} ${styles['summary__value--credit']}`}>
                                R$ {salesSummary.totalRevenueFiado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className={`${styles.summary__item} ${styles['summary__item--clean']}`}>
                            <p className={styles.summary__label}>Total de Vendas</p>
                            <p className={styles.summary__value}>
                                {salesSummary.totalSales}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.filters__card}>
                    <div className={styles.filters__grid}>
                        <div>
                            <label htmlFor="search" className={styles.filters__label}>Buscar</label>
                            <div className={styles.filters__inputWrapper}>
                                <Search className={styles.filters__inputIcon} />
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Nº da venda ou item principal..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`${styles.filters__input} ${styles['filters__input--search']}`}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="payment" className={styles.filters__label}>Pagamento/Status</label>
                            <select
                                id="payment"
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value as VendaSimplificada['formaPagamento'] | 'todos')} // ⭐️ Cast para o tipo correto
                                className={styles.filters__select}
                            >
                                <option value="todos">Todos os Pagamentos</option>
                                <option value="Dinheiro">Dinheiro (Pago)</option>
                                <option value="Cartão">Cartão (Pago)</option>
                                <option value="Pix">Pix (Pago)</option>
                                <option value="Aberto/Fiado">Fiado (Aberto)</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className={styles.filters__label}>Data</label>
                            <input
                                id="date"
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className={styles.filters__input}
                            />
                        </div>
                        <div className={styles['filters__clearContainer']}>
                            <button
                                onClick={handleClearFilters}
                                className={styles['filters__button--clear']}
                                disabled={!searchTerm && paymentFilter === 'todos' && !dateFilter}
                            >
                                <X size={16} />
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.sales__card}>
                    {filteredVendas.length === 0 ? (
                        <div className={styles.empty__state}>
                            <p className={styles['empty__state-title']}>Nenhuma venda encontrada 🧐</p>
                            <p className={styles['empty__state-subtitle']}>
                                Ajuste seus filtros ou clique em &quot;Registrar Nova Venda&quot;. {/* ⭐️ CORRIGIDO: Aspas escapadas */}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.sales__tableWrapper}>
                            <table className={styles.sales__table}>
                                <thead className={styles['sales__table-head']}>
                                    <tr>
                                        <th className={styles['sales__table-th']}>Data</th> 
                                        <th className={styles['sales__table-th']}>Vendedor</th> 
                                        <th className={styles['sales__table-th']}>Produto Principal</th>
                                        <th className={styles['sales__table-th']}>Valor Total</th>
                                        <th className={styles['sales__table-th']}>Pagamento/Status</th>
                                        <th className={styles['sales__table-th']}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody className={styles['sales__table-body']}>
                                    {filteredVendas.map((venda) => (
                                        <tr key={venda.numeroVenda} className={styles['sales__table-row']}>
                                            <td className={styles['sales__table-td']}>
                                                <p className={styles.sale__date}>
                                                    {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                                                </p>
                                            </td>
                                            <td className={styles['sales__table-td']}>
                                                <div>
                                                    <p className={styles.sale__number}>{venda.numeroVenda}</p>
                                                    <p className={styles.sale__vendedor}>{venda.vendedor}</p>
                                                </div>
                                            </td>
                                            <td className={styles['sales__table-td']}>
                                                <p className={styles.client__phone}>{getItemList(venda.itens)}</p>
                                            </td>
                                            <td className={styles['sales__table-td']}>
                                                <p className={styles.sale__total}>
                                                    R$ {venda.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </td>
                                            <td className={styles['sales__table-td']}>
                                                <span 
                                                    className={`${styles.status__badge} ${getPaymentColorClass(venda.formaPagamento)}`}
                                                    title={venda.formaPagamento === 'Aberto/Fiado' ? 'Venda Fiada (A Receber)' : 'Venda Paga'}
                                                >
                                                    {venda.formaPagamento.toUpperCase().replace('/FIADO', '')}
                                                </span>
                                            </td>
                                            <td className={styles['sales__table-td']}>
                                                <VendaActions 
                                                    venda={venda} 
                                                    deleteVenda={deleteVenda} 
                                                    handleViewDetails={handleViewDetails} 
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Vendas