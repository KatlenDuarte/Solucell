import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Venda } from '../lib/lumi';
import styles from '../../../styles/NewSale.module.css'; // Reutiliza os estilos de Vendas

interface VendaActionsProps {
    venda: Venda;
    deleteVenda: (id: string, numeroVenda: string) => Promise<void>;
}

const VendaActions: React.FC<VendaActionsProps> = ({ venda, deleteVenda }) => {
    const handleViewDetails = () => {
        const itensText = venda.itens.map(item =>
            `${item.quantidade}x ${item.descricao} - R$ ${item.valorUnitario.toFixed(2)}`
        ).join('\n');
        alert(`Detalhes da Venda ${venda.numeroVenda}:\n\nCliente: ${venda.cliente.nome}\nValor Total: R$ ${venda.valorTotal.toFixed(2)}\nStatus: ${venda.statusPagamento}\n\nItens:\n${itensText}`);
    };

    return (
        <div className={styles.actionsContainer}>
            <button
                onClick={handleViewDetails}
                className={styles.actionButtonView}
                title="Ver detalhes"
            >
                <Eye className={styles.actionIcon} />
            </button>
            <button
                onClick={() => deleteVenda(venda._id, venda.numeroVenda)}
                className={styles.actionButtonDelete}
                title="Excluir"
            >
                <Trash2 className={styles.actionIcon} />
            </button>
        </div>
    );
};

export default VendaActions;