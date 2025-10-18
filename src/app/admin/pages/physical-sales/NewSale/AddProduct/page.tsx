"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../../styles/NovaVenda.module.css';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { lumi } from '../../../../lib/lumi';
import toast from 'react-hot-toast';

// --- Interfaces (Sem alteração) ---
interface Cliente {
    nome: string;
    telefone: string;
}

interface ItemVenda {
    tipo: 'produto' | 'servico';
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
}

interface FormData {
    cliente: Cliente;
    itens: ItemVenda[];
    valorTotal: number;
    desconto: number;
    valorFinal: number;
    formaPagamento: 'dinheiro' | 'cartao' | 'pix' | 'fiado' | 'transferencia' | 'cheque';
    vendedor: string;
    observacoes: string;
}

// --- Funções de Formatação de Moeda (Sem alteração) ---
const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatInputCurrency = (value: number): string => {
    if (value === 0) return '';
    return value.toFixed(2).replace('.', ',');
};

const parseCurrency = (value: string): number => {
    const cleanedValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanedValue) || 0;
};

// --- Opções de Vendedor e Pagamento (Sem alteração) ---
const FORMAS_PAGAMENTO = [
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'cartao', label: 'Cartão (Crédito/Débito)' },
    { value: 'pix', label: 'PIX' },
    { value: 'fiado', label: 'Fiado' },
];

const VENDEDORES = [
    { value: 'Dênio', label: 'Dênio' },
    { value: 'João', label: 'João' },
    { value: 'Outro', label: 'Outro' },
];

// --- Componente Principal ---
const NovaVenda: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        cliente: { nome: '', telefone: '' },
        itens: [{ tipo: 'produto', descricao: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 }],
        valorTotal: 0,
        desconto: 0,
        valorFinal: 0,
        formaPagamento: 'dinheiro',
        vendedor: 'Dênio',
        observacoes: ''
    });

    // Efeito para recalcular totais
    useEffect(() => {
        const novoValorTotal = formData.itens.reduce((sum, item) => sum + item.valorTotal, 0);
        const novoValorFinal = Math.max(0, novoValorTotal - formData.desconto);

        setFormData(prev => ({
            ...prev,
            valorTotal: novoValorTotal,
            valorFinal: novoValorFinal
        }));
    }, [formData.itens, formData.desconto]);


    // Funções de manipulação de estado (mantidas)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            cliente: { ...prev.cliente, [name]: value }
        }));
    };

    const gerarNumeroVenda = () => {
        const ano = new Date().getFullYear();
        const numero = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `VD-${ano}-${numero}`;
    };

    const adicionarItem = () => {
        setFormData(prev => ({
            ...prev,
            itens: [...prev.itens, { tipo: 'produto', descricao: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 }]
        }));
    };

    const removerItem = (index: number) => {
        if (formData.itens.length > 1) {
            setFormData(prev => {
                const novosItens = prev.itens.filter((_, i) => i !== index);
                return { ...prev, itens: novosItens };
            });
        }
    };

    const atualizarItem = (index: number, campo: keyof ItemVenda, valor: any) => {
        setFormData(prev => {
            const novosItens = [...prev.itens];
            let newQuantidade = novosItens[index].quantidade;
            let newValorUnitario = novosItens[index].valorUnitario;

            if (campo === 'quantidade') {
                newQuantidade = Math.max(1, parseInt(valor) || 1);
            } else if (campo === 'valorUnitario') {
                newValorUnitario = Math.max(0, parseCurrency(valor));
            } else if (campo === 'descricao' || campo === 'tipo') {
                novosItens[index] = { ...novosItens[index], [campo]: valor };
            }

            const valorCalculado = newQuantidade * newValorUnitario;

            novosItens[index] = {
                ...novosItens[index],
                quantidade: newQuantidade,
                valorUnitario: newValorUnitario,
                valorTotal: valorCalculado
            };

            return { ...prev, itens: novosItens };
        });
    };

    const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorDigitado = e.target.value;
        const valorNumerico = parseCurrency(valorDigitado);
        const valorDesconto = Math.min(Math.max(0, valorNumerico), formData.valorTotal);

        setFormData(prev => ({ ...prev, desconto: valorDesconto }));
    };

    // Função de submissão (mantida)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validação dos Itens
        if (formData.itens.some(item => !item.descricao.trim() || item.quantidade <= 0 || item.valorUnitario <= 0)) {
            toast.error('Preencha a descrição, quantidade e valor unitário de todos os itens.');
            return;
        }

        // 2. Validação para Fiado
        if (formData.formaPagamento === 'fiado') {
            if (!formData.cliente.nome.trim() || !formData.cliente.telefone.trim()) {
                toast.error('O nome e telefone do cliente são obrigatórios para vendas "Fiado".');
                return;
            }
        }

        // 3. Validação Geral
        if (formData.valorFinal <= 0 && formData.valorTotal > 0) {
            if (formData.desconto < formData.valorTotal) {
                 toast.error('O valor final da venda não pode ser R$ 0,00, a menos que haja um desconto total.');
                 return;
            }
        }

        try {
            setLoading(true);

            const clienteFinal = formData.formaPagamento === 'fiado'
                ? formData.cliente
                : {
                    nome: formData.cliente.nome.trim() || 'Consumidor Final',
                    telefone: formData.cliente.telefone.trim() || ''
                };

            const formaPagamentoLabel = FORMAS_PAGAMENTO.find(f => f.value === formData.formaPagamento)?.label || 'Dinheiro';

            const vendaASalvar = {
                numeroVenda: gerarNumeroVenda(),
                cliente: clienteFinal,
                itens: formData.itens,
                valorTotal: formData.valorTotal,
                desconto: formData.desconto,
                valorFinal: formData.valorFinal,
                formaPagamento: formaPagamentoLabel,
                statusPagamento: formData.formaPagamento === 'fiado' ? 'pendente' : 'pago',
                vendedor: formData.vendedor,
                observacoes: formData.observacoes,
                dataVenda: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await lumi.entities.vendas.create(vendaASalvar);
            toast.success('Venda registrada com sucesso!');
            router.push('/vendas');
        } catch (error) {
            console.error('Erro ao salvar venda:', error);
            toast.error('Erro ao registrar venda. Verifique a conexão com a API.');
        } finally {
            setLoading(false);
        }
    };

    const isClientRequired = formData.formaPagamento === 'fiado';

    return (
        <div className={styles.pageContent}>
            <div className={styles.wrapper}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles['header__title-group']}>
                        <button
                            onClick={() => router.push('/vendas')}
                            className={styles['header__back-button']}
                            aria-label="Voltar para Vendas"
                            type="button"
                        >
                            <ArrowLeft className={styles.icon} />
                        </button>
                        <h1 className={styles.header__title}>Nova Venda Simplificada</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Dados do Cliente (Opcional, exceto se for Fiado) */}
                    {(isClientRequired || formData.cliente.nome.trim() || formData.cliente.telefone.trim()) && (
                        <div className={styles.sectionCard}>
                            <h3 className={styles.sectionCard__title}>Cliente {isClientRequired ? '(Obrigatório para Fiado)' : ''}</h3>
                            <div className={styles['form__grid--cliente']}>
                                <div className={styles.form__group}>
                                    <label className={styles.form__label}>Nome do Cliente/Comprador {isClientRequired ? '*' : ''}</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.cliente.nome}
                                        onChange={handleClientChange}
                                        className={styles.form__input}
                                        placeholder="Nome completo ou Apelido"
                                        required={isClientRequired}
                                    />
                                </div>
                                <div className={styles.form__group}>
                                    <label className={styles.form__label}>Telefone {isClientRequired ? '*' : ''}</label>
                                    <input
                                        type="tel"
                                        name="telefone"
                                        value={formData.cliente.telefone}
                                        onChange={handleClientChange}
                                        className={styles.form__input}
                                        placeholder="(99) 99999-9999"
                                        required={isClientRequired}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ------------------------------------------------------------------ */}
                    {/* NOVO CARD: ITENS, PAGAMENTO E TOTAIS (Estrutura de duas colunas) */}
                    {/* ------------------------------------------------------------------ */}
                    <div className={styles.sectionCard}>
                        <h3 className={styles.sectionCard__title}>Itens e Fechamento</h3>

                        <div className={styles['section__grid-two-cols']}>
                            {/* COLUNA 1: ITENS DA VENDA */}
                            <div>
                                <div className={styles['sectionCard__header-itens']}>
                                    <h4 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem' }}>Lista de Itens</h4>
                                    <button
                                        type="button"
                                        onClick={adicionarItem}
                                        className={styles['item__button--add']}
                                    >
                                        <Plus className={styles.iconSmall} />
                                        Adicionar Item
                                    </button>
                                </div>

                                <div className={styles.item__list}>
                                    {formData.itens.map((item, index) => (
                                        <div key={index} className={styles.item__row}>
                                            {/* Descrição */}
                                            <div className={styles['item__field--description']}>
                                                <label className={styles.item__label}>Descrição</label>
                                                <input
                                                    type="text"
                                                    value={item.descricao}
                                                    onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                                                    className={styles.form__input}
                                                    placeholder="Produto ou serviço"
                                                    required
                                                />
                                            </div>
                                            {/* Quantidade */}
                                            <div className={styles.item__field}>
                                                <label className={styles.item__label}>Qtd</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantidade}
                                                    onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
                                                    className={styles.form__input}
                                                    required
                                                />
                                            </div>
                                            {/* Valor Unitário COM formatação de moeda */}
                                            <div className={styles.item__field}>
                                                <label className={styles.item__label}>Valor Unit. (R$)</label>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={formatInputCurrency(item.valorUnitario)}
                                                    onChange={(e) => atualizarItem(index, 'valorUnitario', e.target.value)}
                                                    className={styles.form__input}
                                                    placeholder="0,00"
                                                    required
                                                />
                                            </div>
                                            {/* Total e Botão Remover */}
                                            <div className={styles['item__field--total-actions']}>
                                                <div className={styles.item__total}>
                                                    <label className={styles.item__label}>Total</label>
                                                    <div className={styles.item__valueDisplay}>
                                                        R$ {formatCurrency(item.valorTotal)}
                                                    </div>
                                                </div>
                                                {formData.itens.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removerItem(index)}
                                                        className={styles['item__button--remove']}
                                                        aria-label="Remover item"
                                                    >
                                                        <Trash2 className={styles.iconSmall} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* COLUNA 2: PAGAMENTO E TOTAIS */}
                            <div>
                                <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary-orange)', fontSize: '1.1rem', paddingTop: '10px', borderTop: '1px solid var(--light-border)' }}>Fechamento e Totais</h4>

                                {/* Formas de Pagamento e Vendedor */}
                                <div className={styles['form__grid--pagamento']}>
                                    <div className={styles.form__group}>
                                        <label className={styles.form__label}>Vendedor</label>
                                        <select
                                            name="vendedor"
                                            value={formData.vendedor}
                                            onChange={handleInputChange}
                                            className={styles.form__select}
                                            required
                                        >
                                            {VENDEDORES.map(v => (
                                                <option key={v.value} value={v.value}>{v.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.form__group}>
                                        <label className={styles.form__label}>Forma de Pagamento</label>
                                        <select
                                            name="formaPagamento"
                                            value={formData.formaPagamento}
                                            onChange={handleInputChange}
                                            className={styles.form__select}
                                            required
                                        >
                                            {FORMAS_PAGAMENTO.map(f => (
                                                <option key={f.value} value={f.value}>{f.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Desconto */}
                                <div className={styles.form__group} style={{ marginTop: '20px' }}>
                                    <label className={styles.form__label}>Desconto (R$)</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={formatInputCurrency(formData.desconto)}
                                        onChange={handleDescontoChange}
                                        className={styles.form__input}
                                        placeholder="0,00"
                                    />
                                </div>

                                {/* Sumário de Totais */}
                                <div className={styles.summary__group} style={{ marginTop: '20px' }}>
                                    <div className={styles.summary__row}>
                                        <span className={styles.summary__label}>Subtotal:</span>
                                        <span className={styles.summary__value}>R$ {formatCurrency(formData.valorTotal)}</span>
                                    </div>
                                    <div className={styles.summary__row}>
                                        <span className={styles.summary__label}>Desconto Aplicado:</span>
                                        <span className={styles.summary__value}>- R$ {formatCurrency(formData.desconto)}</span>
                                    </div>
                                    <div className={styles.summary__rowFinal}>
                                        <span className={styles.summary__labelFinal}>Total Final:</span>
                                        <span className={styles.summary__valueFinal}>R$ {formatCurrency(formData.valorFinal)}</span>
                                    </div>
                                </div>
                            </div>

                        </div> {/* Fim do section__grid-two-cols */}
                    </div> {/* Fim do sectionCard principal */}


                    {/* Botões */}
                    <div className={styles.form__actions}>
                        <button
                            type="button"
                            onClick={() => router.push('admin/pages/physical-sales')}
                            className={styles['form__button--cancel']}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || formData.itens.length === 0}
                            className={styles['form__button--submit']}
                        >
                            {loading ? (
                                <div className={styles.spinner}></div>
                            ) : (
                                <Save className={styles.iconSmall} />
                            )}
                            Registrar Venda
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NovaVenda;