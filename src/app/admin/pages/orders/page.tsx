// OrdersPage.tsx
"use client";

import React, { useState } from 'react';
import styles from '../../styles/OrdersPage.module.css';
import { ShoppingCart, Search, Eye, Package, Truck, CheckCircle, Clock, AlertCircle, User, Phone, Mail, MapPin } from 'lucide-react';

// ==================================================
// --- 0. CONFIGURAÇÃO E TIPOS DE DADOS ---
// ==================================================

// Usuário atual logado (para a lógica de separação)
const CURRENT_USER_NAME = 'Kayte';

type FilterType = 'all' | 'day' | 'month' | 'pending' | 'in_separation' | 'shipped' | 'delivered' | 'cancelled';
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'in_separation';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    date: string;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
    paymentMethod: string;
    shippingMethod: string;
    separatedBy?: string;
}

// ==================================================
// --- 1. FUNÇÕES DE SIMULAÇÃO DE INTEGRAÇÃO (BACKEND) ---
// ==================================================

const generateInvoice = async (orderId: string): Promise<{ success: boolean, nfeKey?: string, error?: string }> => {
    console.log(`[BACKEND] Tentando gerar NF para o pedido ${orderId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (Math.random() > 0.3) {
        return { success: true, nfeKey: `NFE-3522100000000000000000000000000000000${orderId.slice(-3)}` };
    } else {
        return { success: false, error: 'Falha na comunicação com a Sefaz. Tente novamente mais tarde.' };
    }
};

const generateShippingLabel = async (orderId: string): Promise<{ success: boolean, trackingCode?: string, labelUrl?: string, error?: string }> => {
    console.log(`[BACKEND] Tentando gerar Etiqueta para o pedido ${orderId}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (Math.random() > 0.1) {
        return { success: true, trackingCode: `BR${orderId}-XYZ`, labelUrl: `/labels/label-${orderId}.pdf` };
    } else {
        return { success: false, error: 'Falha ao conectar com o serviço de transporte. Verifique as credenciais.' };
    }
};

// ==================================================
// --- 2. DADOS SIMULADOS E AUXILIARES ---
// ==================================================
const todayDate = new Date().toISOString();
const lastMonthDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

const initialOrders: Order[] = [
    { id: 'PED-001', customerName: 'Maria Silva', customerEmail: 'maria.silva@email.com', customerPhone: '(11) 99999-9999', customerAddress: 'Rua das Flores, 123 - São Paulo, SP', date: todayDate, status: 'delivered', total: 299.90, paymentMethod: 'Cartão de Crédito', shippingMethod: 'Entrega Expressa', items: [{ id: '1', name: 'Smartphone Samsung', quantity: 1, price: 299.90, image: '' }] },
    { id: 'PED-002', customerName: 'João Santos', customerEmail: 'joao.santos@email.com', customerPhone: '(11) 88888-8888', customerAddress: 'Av. Paulista, 456 - São Paulo, SP', date: todayDate, status: 'in_separation', total: 159.80, paymentMethod: 'PIX', shippingMethod: 'Entrega Normal', items: [{ id: '2', name: 'Fones Bluetooth', quantity: 2, price: 79.90, image: '' }], separatedBy: 'Outro Usuario' },
    { id: 'PED-003', customerName: 'Ana Costa', customerEmail: 'ana.costa@email.com', customerPhone: '(11) 77777-7777', customerAddress: 'Rua Augusta, 789 - São Paulo, SP', date: lastMonthDate, status: 'processing', total: 449.70, paymentMethod: 'Cartão de Débito', shippingMethod: 'Entrega Expressa', items: [{ id: '3', name: 'Notebook Dell', quantity: 1, price: 449.70, image: '' }] },
    { id: 'PED-004', customerName: 'Carlos Oliveira', customerEmail: 'carlos.oliveira@email.com', customerPhone: '(11) 66666-6666', customerAddress: 'Rua da Consolação, 321 - São Paulo, SP', date: todayDate, status: 'pending', total: 89.90, paymentMethod: 'Boleto', shippingMethod: 'Entrega Normal', items: [{ id: '4', name: 'Mouse Gamer', quantity: 1, price: 89.90, image: '' }] },
    { id: 'PED-005', customerName: 'Felipe Souza', customerEmail: 'felipe.souza@email.com', customerPhone: '(11) 55555-5555', customerAddress: 'Rua Principal, 50 - Jundiaí, SP', date: todayDate, status: 'in_separation', total: 650.00, paymentMethod: 'Cartão de Crédito', shippingMethod: 'Retirar na Loja', items: [{ id: '5', name: 'Teclado Mecânico', quantity: 1, price: 650.00, image: '' }], separatedBy: CURRENT_USER_NAME },
];


const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};
const isThisMonth = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};
const getStatusIcon = (status: OrderStatus) => {
    const iconClasses = styles['c-status-icon'];
    switch (status) {
        case 'pending': return <Clock className={iconClasses} />;
        case 'processing': return <Package className={iconClasses} />;
        case 'in_separation': return <User className={iconClasses} />;
        case 'shipped': return <Truck className={iconClasses} />;
        case 'delivered': return <CheckCircle className={iconClasses} />;
        case 'cancelled': return <AlertCircle className={iconClasses} />;
        default: return <Clock className={iconClasses} />;
    }
};
const getStatusColorClass = (status: OrderStatus) => {
    switch (status) {
        case 'pending': return styles['c-badge--pending'];
        case 'processing': return styles['c-badge--processing'];
        case 'in_separation': return styles['c-badge--in-separation'];
        case 'shipped': return styles['c-badge--shipped'];
        case 'delivered': return styles['c-badge--delivered'];
        case 'cancelled': return styles['c-badge--cancelled'];
        default: return styles['c-badge--default'];
    }
};
const getStatusText = (order: Order) => {
    switch (order.status) {
        case 'pending': return 'Pendente';
        case 'processing': return 'Processando';
        case 'in_separation': return order.separatedBy ? `${order.separatedBy} Separando` : 'Em Separação';
        case 'shipped': return 'Enviado';
        case 'delivered': return 'Entregue';
        case 'cancelled': return 'Cancelado';
        default: return 'Desconhecido';
    }
};

// **CORRIGIDO**: Novas opções de filtro para refletir o fluxo de trabalho
const statusOptions: { value: FilterType, label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'day', label: 'Vendas do Dia' },
    { value: 'month', label: 'Vendas do Mês' },
    { value: 'pending', label: 'Aguardando Separação' }, // pending ou processing
    { value: 'in_separation', label: 'Sendo Separado' },  // in_separation
    { value: 'shipped', label: 'Prontos para Envio' }, // shipped
    { value: 'delivered', label: 'Pedidos Entregues' },
    { value: 'cancelled', label: 'Pedidos Cancelados' },
];

const getConfirmationTexts = (action: 'start' | 'ready' | 'cancel') => {
    switch (action) {
        case 'start':
            return {
                title: 'Iniciar Separação',
                message: `Tem certeza que deseja iniciar a separação do pedido? Outros usuários verão que você (${CURRENT_USER_NAME}) está trabalhando nele.`,
                confirmText: 'Sim, Iniciar Separação',
                icon: <Package className={styles['modal-confirm-icon--blue']} />
            };
        case 'ready':
            return {
                title: 'Gerar Etiqueta e Enviar',
                message: `Ao confirmar, o pedido será marcado como ENVIADO. Você será direcionado para gerar a etiqueta e Nota Fiscal. Deseja continuar?`,
                confirmText: 'Sim, Gerar Etiqueta',
                icon: <Truck className={styles['modal-confirm-icon--green']} />
            };
        case 'cancel':
            return {
                title: 'Cancelar Pedido',
                message: `Esta ação é irreversível. O pedido será cancelado e o estoque liberado. Tem certeza?`,
                confirmText: 'Sim, Cancelar',
                icon: <AlertCircle className={styles['modal-confirm-icon--red']} />
            };
    }
};

// ==================================================
// --- 4. COMPONENTE PRINCIPAL ---
// ==================================================
const OrdersPage: React.FC = () => {
    const [ordersData, setOrdersData] = useState<Order[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [actionToConfirm, setActionToConfirm] = useState<{ action: 'start' | 'ready' | 'cancel', orderId: string } | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [processError, setProcessError] = useState<{ id: string, message: string } | null>(null);

    // --- Lógica de Ações ---

    const updateOrderStatus = (orderId: string, newStatus: OrderStatus, separatedBy?: string) => {
        setOrdersData(prevOrders => prevOrders.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus, separatedBy: separatedBy !== undefined ? separatedBy : order.separatedBy }
                : order
        ));
    };

    const initiateSeparation = (orderId: string) => {
        updateOrderStatus(orderId, 'in_separation', CURRENT_USER_NAME);
        setSelectedOrder(null);
        setActionToConfirm(null);
    };

    // FUNÇÃO CRÍTICA: Geração de NF e Etiqueta
    const markAsReadyToShip = async (orderId: string) => {
        setProcessError(null);
        setIsLoading(true);

        try {
            // 1. Geração da Nota Fiscal
            const invoiceResult = await generateInvoice(orderId);
            if (!invoiceResult.success) {
                setProcessError({ id: orderId, message: `NF Falhou: ${invoiceResult.error}` });
                return;
            }

            // 2. Geração da Etiqueta de Envio
            const labelResult = await generateShippingLabel(orderId);
            if (!labelResult.success) {
                setProcessError({ id: orderId, message: `Etiqueta Falhou: ${labelResult.error}` });
                return;
            }

            // 3. SUCESSO: Atualiza o status
            const currentOrder = ordersData.find(o => o.id === orderId);
            updateOrderStatus(orderId, 'shipped', currentOrder?.separatedBy);

            alert(`SUCESSO! Pedido ${orderId} ENVIADO.\nNF-e: ${invoiceResult.nfeKey}\nRastreio: ${labelResult.trackingCode}`);

        } catch (error) {
            setProcessError({ id: orderId, message: 'Erro de conexão no backend. Contate o suporte.' });
        } finally {
            setIsLoading(false);
            setSelectedOrder(null);
            setActionToConfirm(null);
        }
    };

    const cancelOrder = (orderId: string) => {
        updateOrderStatus(orderId, 'cancelled', undefined);
        setSelectedOrder(null);
        setActionToConfirm(null);
    };

    const handleConfirmAction = () => {
        if (!actionToConfirm) return;
        const { action, orderId } = actionToConfirm;

        switch (action) {
            case 'start':
                initiateSeparation(orderId);
                break;
            case 'ready':
                markAsReadyToShip(orderId);
                break;
            case 'cancel':
                cancelOrder(orderId);
                break;
        }
    };


    // --- Lógica de Filtro (CORRIGIDA) ---
    const filteredOrders = ordersData.filter(order => {
        let matchesStatus = true;
        let matchesDate = true;

        switch (statusFilter) {
            case 'day':
                matchesDate = isToday(order.date);
                break;
            case 'month':
                matchesDate = isThisMonth(order.date);
                break;
            case 'pending':
                // Aguardando Separação = Pending OU Processing
                matchesStatus = order.status === 'pending' || order.status === 'processing';
                break;
            case 'in_separation':
                // Sendo Separado = Apenas in_separation
                matchesStatus = order.status === 'in_separation';
                break;
            case 'shipped':
                // Prontos para Envio = Apenas shipped
                matchesStatus = order.status === 'shipped';
                break;
            case 'delivered':
                matchesStatus = order.status === 'delivered';
                break;
            case 'cancelled':
                matchesStatus = order.status === 'cancelled';
                break;
            case 'all':
            default:
                matchesStatus = true;
                break;
        }

        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesDate && matchesSearch;
    });

    // --- Cálculo de Estatísticas ---
    const stats = {
        total: ordersData.length,
        pending: ordersData.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'in_separation').length,
        delivered: ordersData.filter(o => o.status === 'delivered').length,
        revenue: ordersData.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
    };

    return (
        <div className={styles['orders-page']}>
            <div className={styles['orders-content-wrapper']}>

                {/* ==================================================
               MODAL DE CONFIRMAÇÃO (Z-INDEX 3000)
               ================================================== */}
                {actionToConfirm && (
                    <div className={styles['modal-overlay']} style={{ zIndex: 3000 }}>
                        <div className={`${styles['modal-content']} ${styles['modal-content--small']}`}>
                            <div className={styles['modal-header']}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    {getConfirmationTexts(actionToConfirm.action).icon}
                                    <h3 className={styles['modal-title']} style={{ textAlign: 'center' }}>{getConfirmationTexts(actionToConfirm.action).title}</h3>
                                </div>
                                <button
                                    onClick={() => setActionToConfirm(null)}
                                    className={styles['modal-close-button']}
                                    disabled={isLoading}
                                >&times;</button>
                            </div>
                            <div className={styles['modal-body']}>
                                <p className={styles['modal-confirmation-message']}>
                                    {getConfirmationTexts(actionToConfirm.action).message}
                                </p>
                                <div className={styles['modal-footer']}>
                                    <button
                                        className={`${styles['button']} ${styles['button--secondary']}`}
                                        onClick={() => setActionToConfirm(null)}
                                        disabled={isLoading}
                                    >
                                        Não, Voltar
                                    </button>
                                    <button
                                        className={`${styles['button']} ${styles['button--primary']}`}
                                        onClick={handleConfirmAction}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Processando...' : getConfirmationTexts(actionToConfirm.action).confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                <div className={styles['page-header']}>
                    <h1 className={styles['page-title']}>Gerenciamento de Pedidos</h1>
                    <p className={styles['page-subtitle']}>Olá, **{CURRENT_USER_NAME}**. Gerencie todos os pedidos da sua loja.</p>
                </div>

                {/* Estatísticas */}
                <div className={styles['stats-grid']}>
                    <div className={styles['stat-card']}>
                        <div className={styles['stat-content']}>
                            <div>
                                <p className={styles['stat-label']}>Total de Pedidos</p>
                                <p className={`${styles['stat-value']} ${styles['stat-value--dark']}`}>{stats.total}</p>
                            </div>
                            <ShoppingCart className={`${styles['stat-icon']} ${styles['stat-icon--blue']}`} />
                        </div>
                    </div>

                    <div className={styles['stat-card']}>
                        <div className={styles['stat-content']}>
                            <div>
                                <p className={styles['stat-label']}>Em Preparação/Envio</p>
                                <p className={`${styles['stat-value']} ${styles['stat-value--yellow']}`}>{stats.pending}</p>
                            </div>
                            <Clock className={`${styles['stat-icon']} ${styles['stat-icon--yellow']}`} />
                        </div>
                    </div>

                    <div className={styles['stat-card']}>
                        <div className={styles['stat-content']}>
                            <div>
                                <p className={styles['stat-label']}>Entregues</p>
                                <p className={`${styles['stat-value']} ${styles['stat-value--green']}`}>{stats.delivered}</p>
                            </div>
                            <CheckCircle className={`${styles['stat-icon']} ${styles['stat-icon--green']}`} />
                        </div>
                    </div>

                    <div className={styles['stat-card']}>
                        <div className={styles['stat-content']}>
                            <div>
                                <p className={styles['stat-label']}>Receita Entregue</p>
                                <p className={`${styles['stat-value']} ${styles['stat-value--green']}`}>R$ {stats.revenue.toFixed(2)}</p>
                            </div>
                            <Package className={`${styles['stat-icon']} ${styles['stat-icon--green']}`} />
                        </div>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className={styles['controls-bar']}>
                    <div className={styles['controls-layout']}>

                        <div className={styles['filter-group']}>
                            <div className={styles['filter-buttons']}>
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`${styles['status-button']} ${statusFilter === option.value ? styles['status-button--active'] : ''
                                            }`}
                                        onClick={() => setStatusFilter(option.value as FilterType)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles['search-container']}>
                            <Search className={styles['search-icon']} />
                            <input
                                type="text"
                                placeholder="Buscar por cliente ou ID do pedido..."
                                className={styles['search-input']}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela de Pedidos */}
                <div className={styles['table-container']}>
                    <div className={styles['table-wrapper']}>
                        <table className={styles['orders-table']}>
                            <thead className={styles['table-header']}>
                                <tr>
                                    <th className={styles['table-th']}>Pedido</th>
                                    <th className={styles['table-th']}>Cliente</th>
                                    <th className={styles['table-th']}>Data</th>
                                    <th className={styles['table-th']}>Status</th>
                                    <th className={styles['table-th']}>Total</th>
                                    <th className={styles['table-th']}>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={styles['table-body']}>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className={styles['table-row']}>
                                        <td className={`${styles['table-td']} ${styles['table-td--id']}`}>{order.id}</td>
                                        <td className={`${styles['table-td']} ${styles['table-td--customer']}`}>
                                            <div className={styles['customer-name']}>{order.customerName}</div>
                                            <div className={styles['customer-email']}>{order.customerEmail}</div>
                                        </td>
                                        <td className={`${styles['table-td']} ${styles['table-td--date']}`}>
                                            {new Date(order.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className={`${styles['table-td']} ${styles['table-td--status']}`}>
                                            <span className={`${styles['c-badge']} ${getStatusColorClass(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {getStatusText(order)}
                                            </span>
                                        </td>
                                        <td className={`${styles['table-td']} ${styles['table-td--total']}`}>
                                            R$ {order.total.toFixed(2)}
                                        </td>
                                        <td className={`${styles['table-td']} ${styles['table-td--actions']}`}>
                                            <button
                                                onClick={() => { setSelectedOrder(order); setProcessError(null); }}
                                                className={styles['table-action-button']}
                                            >
                                                <Eye className={styles['c-status-icon']} />
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className={styles['no-orders-message']}>
                            Nenhum pedido encontrado com o filtro atual.
                        </div>
                    )}
                </div>

                {/* ==================================================
               MODAL DE DETALHES DO PEDIDO (Z-INDEX 2000)
               ================================================== */}
                {selectedOrder && (
                    <div className={styles['modal-overlay']} style={{ zIndex: 2000 }}>
                        <div className={styles['modal-content']}>
                            <div className={styles['modal-header']}>
                                <div className={styles['modal-header-content']}>
                                    <div>
                                        <h2 className={styles['modal-title']}>Detalhes do Pedido</h2>
                                        <p className={styles['modal-subtitle']}>#{selectedOrder.id}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className={styles['modal-close-button']}
                                        disabled={isLoading} // Não deixa fechar se estiver carregando
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>

                            {/* Exibição de Erros de Processamento */}
                            {processError && processError.id === selectedOrder.id && (
                                <div className={styles['error-message-bar']}>
                                    <AlertCircle />
                                    <span>Erro no Processamento: {processError.message}</span>
                                    <button onClick={() => setProcessError(null)}>&times;</button>
                                </div>
                            )}

                            <div className={styles['modal-body']}>
                                <div className={styles['modal-details-grid']}>
                                    <div className={styles['detail-section']}>
                                        <h3 className={styles['detail-section-title']}>
                                            <User className={styles['detail-icon']} />
                                            Informações do Cliente
                                        </h3>
                                        <div className={styles['detail-info-list']}>
                                            <div className={styles['detail-info-item']}><User className={styles['detail-info-icon']} /><span>{selectedOrder.customerName}</span></div>
                                            <div className={styles['detail-info-item']}><Mail className={styles['detail-info-icon']} /><span>{selectedOrder.customerEmail}</span></div>
                                            <div className={styles['detail-info-item']}><Phone className={styles['detail-info-icon']} /><span>{selectedOrder.customerPhone}</span></div>
                                            <div className={`${styles['detail-info-item']} ${styles['detail-info-item--address']}`}><MapPin className={`${styles['detail-info-icon']} ${styles['detail-info-icon--top']}`} /><span>{selectedOrder.customerAddress}</span></div>
                                        </div>
                                    </div>

                                    <div className={styles['detail-section']}>
                                        <h3 className={styles['detail-section-title']}>
                                            <Package className={styles['detail-icon']} />
                                            Informações do Pedido
                                        </h3>
                                        <div className={styles['detail-info-list']}>
                                            <div className={styles['detail-label-value']}><span className={styles['detail-label']}>Data do Pedido:</span><span className={styles['detail-value']}>{new Date(selectedOrder.date).toLocaleDateString('pt-BR')}</span></div>
                                            <div className={styles['detail-label-value']}><span className={styles['detail-label']}>Status:</span>
                                                <span className={`${styles['c-badge']} ${getStatusColorClass(selectedOrder.status)}`}>
                                                    {getStatusIcon(selectedOrder.status)}
                                                    {getStatusText(selectedOrder)}
                                                </span>
                                            </div>
                                            {selectedOrder.separatedBy && (
                                                <div className={styles['detail-label-value']}><span className={styles['detail-label']}>Separado por:</span><span className={styles['detail-value']}>{selectedOrder.separatedBy}</span></div>
                                            )}
                                            <div className={styles['detail-label-value']}><span className={styles['detail-label']}>Pagamento:</span><span className={styles['detail-value']}>{selectedOrder.paymentMethod}</span></div>
                                            <div className={styles['detail-label-value']}><span className={styles['detail-label']}>Entrega:</span><span className={styles['detail-value']}>{selectedOrder.shippingMethod}</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles['modal-items-section']}>
                                    <h3 className={styles['items-section-title']}>Itens do Pedido</h3>
                                    <div className={styles['items-table-wrapper']}>
                                        <table className={styles['orders-table']}>
                                            <thead className={styles['table-header']}>
                                                <tr>
                                                    <th className={styles['table-th']}>Produto</th>
                                                    <th className={styles['table-th']}>Quantidade</th>
                                                    <th className={styles['table-th']}>Preço Unitário</th>
                                                    <th className={styles['table-th']}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className={styles['table-body']}>
                                                {selectedOrder.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className={`${styles['table-td']} ${styles['table-td--item']}`}>
                                                            <div className={styles['item-details']}>
                                                                <img className={styles['item-img']} src={item.image} alt={item.name} />
                                                                <div className={styles['item-name']}>{item.name}</div>
                                                            </div>
                                                        </td>
                                                        <td className={styles['table-td']}>{item.quantity}</td>
                                                        <td className={styles['table-td']}>R$ {item.price.toFixed(2)}</td>
                                                        <td className={`${styles['table-td']} ${styles['table-td--total']}`}>R$ {(item.quantity * item.price).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles['modal-total-wrapper']}>
                                        <div className={styles['modal-total-box']}>
                                            <div className={styles['modal-total-value']}>
                                                Total: R$ {selectedOrder.total.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                           BARRA DE AÇÕES 
                           ================================================== */}
                            <div className={styles['modal-actions-bar']}>

                                {/* 1. Pendente/Processando: INICIAR SEPARAÇÃO */}
                                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                                    <>
                                        <button
                                            className={`${styles['button']} ${styles['button--secondary']} ${styles['button--red']}`}
                                            onClick={() => setActionToConfirm({ action: 'cancel', orderId: selectedOrder.id })}
                                            disabled={isLoading}
                                        >
                                            <AlertCircle /> Cancelar Pedido
                                        </button>
                                        <button
                                            className={`${styles['button']} ${styles['button--primary']}`}
                                            onClick={() => setActionToConfirm({ action: 'start', orderId: selectedOrder.id })}
                                            disabled={isLoading}
                                        >
                                            <Package /> Iniciar Separação
                                        </button>
                                    </>
                                )}

                                {/* 2. EM SEPARAÇÃO, pelo usuário ATUAL: PRONTO PARA ENVIO (Gerar Etiqueta) */}
                                {selectedOrder.status === 'in_separation' && selectedOrder.separatedBy === CURRENT_USER_NAME && (
                                    <>
                                        <button
                                            className={`${styles['button']} ${styles['button--secondary']} ${styles['button--red']}`}
                                            onClick={() => setActionToConfirm({ action: 'cancel', orderId: selectedOrder.id })}
                                            disabled={isLoading}
                                        >
                                            <AlertCircle /> Cancelar Pedido
                                        </button>
                                        <button
                                            className={`${styles['button']} ${styles['button--primary']} ${styles['button--green']}`}
                                            onClick={() => setActionToConfirm({ action: 'ready', orderId: selectedOrder.id })}
                                            disabled={isLoading}
                                        >
                                            <Truck /> Pronto p/ Envio (Gerar Etiqueta)
                                        </button>
                                    </>
                                )}

                                {/* 3. EM SEPARAÇÃO, por OUTRO USUÁRIO: BLOQUEIO */}
                                {selectedOrder.status === 'in_separation' && selectedOrder.separatedBy !== CURRENT_USER_NAME && (
                                    <span className={styles['action-lock-message']}>
                                        <AlertCircle /> Bloqueado: **{selectedOrder.separatedBy}** está separando.
                                    </span>
                                )}

                                {/* 4. JÁ ENVIADO ou ENTREGUE: REIMPRIMIR ETÍQUETA e CANCELAR */}
                                {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && (
                                    <>
                                        <button
                                            className={`${styles['button']} ${styles['button--secondary']} ${styles['button--red']}`}
                                            onClick={() => setActionToConfirm({ action: 'cancel', orderId: selectedOrder.id })}
                                            disabled={isLoading}
                                        >
                                            <AlertCircle /> Cancelar Pedido
                                        </button>
                                        <button
                                            className={`${styles['button']} ${styles['button--primary']}`}
                                            onClick={() => alert(`Reimprimindo etiqueta/NF para ${selectedOrder.id}`)}
                                            disabled={isLoading}
                                        >
                                            <Truck /> Reimprimir Etiqueta/NF
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>

                )}
            </div>
        </div>
    );
};

export default OrdersPage;