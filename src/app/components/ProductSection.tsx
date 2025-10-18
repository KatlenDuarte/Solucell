"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import styles from '../styles/ProductSection.module.css'

interface Product {
  id: string
  name: string
  description: string
  currentPrice: number
  originalPrice?: number
  installments: number
  installmentPrice: number
  discount?: number
  image: string
  rating: number
  reviews: number
  category: string
  badge?: string
  isNew?: boolean
  isBestSeller?: boolean
}

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: Product[]
  showViewAll?: boolean
  showFilters?: boolean
  maxItems?: number
  link?: string
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  showViewAll = false,
  showFilters = false,
  maxItems = 8,
  link
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')

  // Lista de categorias únicas
  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products])

  // Filtragem por categoria
  const filteredProducts = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory)

    // Ordenação sem mutar o array original
    const sorted = [...filtered]
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.currentPrice - b.currentPrice)
        break
      case 'price-high':
        sorted.sort((a, b) => b.currentPrice - a.currentPrice)
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'discount':
        sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
      default:
        break // 'featured' mantém a ordem original
    }
    return sorted
  }, [products, selectedCategory, sortBy])

  const displayProducts = filteredProducts.slice(0, maxItems)

  return (
    <section className={styles.productSection}>
      <div className={styles.container}>
        {/* Header da Seção */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {showViewAll && link && (
            <Link href={link} passHref>
              <button className={styles.viewAllBtn}>
                Ver Todos ({filteredProducts.length})
              </button>
            </Link>
          )}
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className={styles.filters}>
            {/* Categoria */}
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Categoria:</span>
              <div className={styles.categoryFilters}>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`${styles.categoryBtn} ${selectedCategory === category ? styles.categoryBtnActive : ''}`}
                  >
                    {category === 'all' ? 'Todos' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenação */}
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="featured">Destaques</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="rating">Melhor Avaliação</option>
                <option value="discount">Maior Desconto</option>
              </select>
            </div>
          </div>
        )}

        {/* Grid de Produtos */}
        <div className={styles.productsGrid}>
          {displayProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Botão Carregar Mais */}
        {filteredProducts.length > maxItems && (
          <div className={styles.loadMore}>
            <button className={styles.loadMoreBtn}>Carregar Mais Produtos</button>
          </div>
        )}

        {/* Estado Vazio */}
        {displayProducts.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📱</div>
            <h3 className={styles.emptyTitle}>Nenhum produto encontrado</h3>
            <p className={styles.emptyDescription}>
              Tente alterar os filtros ou navegar por outras categorias
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductSection
