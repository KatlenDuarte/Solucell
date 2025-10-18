"use client"

import React, { useState } from "react"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useProducts, Product } from "../../../hooks/useProducts"
import ProductForm from "./ProductForm"
import styles from "../../../styles/ProductList.module.css"

interface Category {
  value: string
  label: string
}

const categories: Category[] = [
  { value: "", label: "Todas as categorias" },
  { value: "Eletrônicos", label: "Eletrônicos" },
  { value: "Roupas", label: "Roupas" },
  { value: "casa", label: "Casa e Decoração" },
  { value: "esportes", label: "Esportes" },
  { value: "livros", label: "Livros" },
  { value: "beleza", label: "Beleza" },
  { value: "outros", label: "Outros" }
]

interface DeleteConfirmationModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: string) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ product, onClose, onConfirm }) => {
  if (!product) return null;

  return (
    <div className={styles.modalOverlay} style={{ zIndex: 1000 }}>
      <div className={styles.deleteModalContent}>
        <XCircle size={48} className={styles.deleteIcon} />
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir o produto <strong>"{product.name}"</strong>?</p>
        <p className={styles.deleteWarning}>⚠️ **Esta ação removerá o produto da sua loja e não pode ser desfeita.**</p>
        <div className={styles.deleteModalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button
            onClick={() => { onConfirm(product._id); onClose(); }}
            className={styles.confirmDeleteButton}
          >
            Excluir Permanentemente
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------

const ProductList: React.FC = () => {
  const {
    products,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const handleCreateProduct = async (productData: Partial<Product>) => {
    setFormLoading(true)
    try {
      await createProduct(productData)
      setIsFormOpen(false)
      setEditingProduct(null)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct?._id) return
    setFormLoading(true)
    try {
      await updateProduct(editingProduct._id, productData)
      setIsFormOpen(false)
      setEditingProduct(null)
    } finally {
      setFormLoading(false)
    }
  }

  // 🚩 FUNÇÃO ATUALIZADA: Abre o modal de confirmação
  const handleInitiateDelete = (product: Product) => {
    setProductToDelete(product) // Armazena o produto e abre o modal
  }

  // 🚩 FUNÇÃO FINAL: Executa a exclusão
  const handleConfirmDelete = async (productId: string) => {
    // Remove o produto
    await deleteProduct(productId)
    // Fecha o modal
    setProductToDelete(null)
  }

  const handleCloseDeleteModal = () => {
    setProductToDelete(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const getCategoryLabel = (value: string) => categories.find(c => c.value === value)?.label || value

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os produtos da sua loja</p>
        </div>
        <button onClick={() => {
          setEditingProduct(null)
          setIsFormOpen(true)
        }} className={styles.addButton}>
          <Plus size={20} />
          <span>Adicionar Produto</span>
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className={styles.selectInput}
        >
          {categories.map(c => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Package size={24} className={styles.iconBlue} />
          <div>
            <p>Total de Produtos</p>
            <p>{products.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <CheckCircle size={24} className={styles.iconGreen} />
          <div>
            <p>Em Estoque</p>
            <p>{products.filter(p => p.inStock).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <XCircle size={24} className={styles.iconRed} />
          <div>
            <p>Fora de Estoque</p>
            <p>{products.filter(p => !p.inStock).length}</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <Package size={48} className={styles.emptyIcon} />
            <h3>Nenhum produto encontrado</h3>
            <p>{searchTerm || selectedCategory ? "Tente ajustar os filtros de busca" : "Comece adicionando seu primeiro produto"}</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td className={styles.productCell}>
                    <img
                      src={product.imageUrl || "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=100"}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div>
                      <div>{product.name}</div>
                    </div>
                  </td>
                  <td>{product.categoria || "N/A"}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={product.inStock ? styles.inStock : styles.outStock}>
                      {product.inStock ? "Em estoque" : "Fora de estoque"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(product)} className={styles.actionButton}>
                      <Edit size={16} />
                    </button>
                    {/* BOTÃO ATUALIZADO: Chama a função para abrir o modal */}
                    <button onClick={() => handleInitiateDelete(product)} className={styles.actionButtonDelete}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        product={editingProduct}
        loading={formLoading}
      />

      {/* MODAL DE CONFIRMAÇÃO */}
      <DeleteConfirmationModal
        product={productToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default ProductList