"use client"
import React, { useState, useMemo } from 'react'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
import { smartphoneProducts, Product } from '../../data/products'
import styles from '../../styles/Category.module.css'

const SmartphonesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    brand: '',
    priceRange: [0, 15000],
    storage: '',
    rating: 0,
    sortBy: 'relevance'
  })

  const brands = ['iPhone', 'Samsung', 'Xiaomi', 'OnePlus', 'Google']
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

  const filteredProducts = useMemo(() => {
    let filtered = smartphoneProducts.filter(product => {
      const matchesBrand = !filters.brand || product.category === filters.brand
      const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
        product.currentPrice <= filters.priceRange[1]
      const matchesRating = product.rating >= filters.rating

      return matchesBrand && matchesPrice && matchesRating
    })

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.currentPrice - b.currentPrice)
      case 'price-high':
        return filtered.sort((a, b) => b.currentPrice - a.currentPrice)
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating)
      case 'newest':
        return filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      default:
        return filtered
    }
  }, [filters])

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <span>Home</span> &gt; <span className={styles.active}>Smartphones</span>
          </div>

          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Smartphones</h1>
            <p className={styles.subtitle}>{filteredProducts.length} produtos encontrados</p>
          </div>

          <div className={styles.content}>
            {/* Filters Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.filtersHeader}>
                <h3>Filtros</h3>
                <button
                  onClick={() => setFilters({
                    brand: '',
                    priceRange: [0, 15000],
                    storage: '',
                    rating: 0,
                    sortBy: 'relevance'
                  })}
                  className={styles.clearFilters}
                >
                  Limpar
                </button>
              </div>

              {/* Brand Filter */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Marca</h4>
                <div className={styles.filterOptions}>
                  {brands.map(brand => (
                    <label key={brand} className={styles.filterOption}>
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={filters.brand === brand}
                        onChange={(e) => updateFilter('brand', e.target.value)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Faixa de Preço</h4>
                <div className={styles.priceRange}>
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    step="500"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                  />
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    step="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  />
                  <div className={styles.priceLabels}>
                    <span>R$ {filters.priceRange[0]}</span>
                    <span>R$ {filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Avaliação Mínima</h4>
                <div className={styles.ratingFilter}>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <label key={rating} className={styles.filterOption}>
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                      />
                      <span>
                        {'★'.repeat(rating)} e acima
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Storage Filter */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Armazenamento</h4>
                <div className={styles.filterOptions}>
                  {storageOptions.map(storage => (
                    <label key={storage} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        value={storage}
                        checked={filters.storage === storage}
                        onChange={(e) => updateFilter('storage', e.target.checked ? storage : '')}
                      />
                      <span>{storage}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Area */}
            <div className={styles.productsArea}>
              {/* Sort Options */}
              <div className={styles.sortBar}>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="relevance">Mais Relevantes</option>
                  <option value="price-low">Menor Preço</option>
                  <option value="price-high">Maior Preço</option>
                  <option value="rating">Melhor Avaliação</option>
                  <option value="newest">Lançamentos</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className={styles.productsGrid}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📱</div>
                  <h3>Nenhum smartphone encontrado</h3>
                  <p>Tente ajustar os filtros para ver mais produtos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SmartphonesPage
