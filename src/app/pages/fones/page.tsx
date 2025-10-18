"use client"

import React, { useState, useMemo } from 'react'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
import { allProducts, ProductDetails } from '../../data/products' 
import styles from '../../styles/Category.module.css'
import { Search, Star } from 'lucide-react' 

const HeadphonesPage: React.FC = () => {
    const [filters, setFilters] = useState({
        brand: '',
        connection: '', 
        noiseCancellation: '',
        color: '',
        priceRange: [0, 2500], 
        rating: 0,
        sortBy: 'relevance'
    })

    // Opções de filtro específicas para FONES
    const brands = ['Apple', 'JBL', 'Samsung', 'Sony', 'Xiaomi']
    const connectionOptions = ['Wireless', 'Com Fio', 'True Wireless']
    const ncOptions = ['Ativo', 'Passivo', 'Não possui']
    const colors = ['Preto', 'Branco', 'Azul', 'Vermelho']

    // 1. Filtragem Inicial: Apenas produtos da categoria Fones/Audio
    const headphoneProducts = allProducts.filter(product =>
        product.category === 'Fones' || product.category === 'Audio'
    )

    const filteredProducts = useMemo(() => {
        let filtered = headphoneProducts.filter(product => {
            // Filtros por Radio Button/Select
            const matchesBrand = !filters.brand || product.brand === filters.brand
            const matchesColor = !filters.color || product.details?.color === filters.color
            
            // Filtro por Preço e Avaliação
            const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
                product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating

            return matchesPrice && matchesRating && matchesBrand && matchesColor
        })

        switch (filters.sortBy) {
            case 'price-low':
                return filtered.sort((a, b) => a.currentPrice - b.currentPrice)
            case 'price-high':
                return filtered.sort((a, b) => b.currentPrice - a.currentPrice)
            case 'rating':
                return filtered.sort((a, b) => b.rating - a.rating)
            default:
                return filtered
        }
    }, [filters])

    const updateFilter = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    // Função auxiliar para renderizar estrelas
    const renderStars = (rating: number) => {
        const maxStars = 5
        const filledStars = rating
        const emptyStars = maxStars - filledStars

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {Array.from({ length: filledStars }).map((_, i) => (
                    <Star
                        key={`filled-${i}`}
                        size={16}
                        style={{ color: '#f59e0b', fill: '#f59e0b' }}
                    />
                ))}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        size={16}
                        style={{ color: '#d1d5db', fill: 'none' }}
                    />
                ))}
            </div>
        )
    }

    // Determina o valor máximo de preço dinamicamente
    const maxPrice = Math.max(...headphoneProducts.map(p => p.currentPrice), 2500)

    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.breadcrumb}>
                        <span>Home</span> &gt; <span className={styles.active}>Fones</span>
                    </div>

                    <div className={styles.pageHeader}>
                        <h1 className={styles.title}>Fones de Ouvido</h1>
                        <p className={styles.subtitle}>{filteredProducts.length} produtos encontrados</p>
                    </div>

                    <div className={styles.content}>
                        <aside className={styles.sidebar}>
                            <div className={styles.filtersHeader}>
                                <h3>Filtros</h3>
                                <button
                                    onClick={() => setFilters({
                                        brand: '',
                                        connection: '',
                                        noiseCancellation: '',
                                        color: '',
                                        priceRange: [0, 2500],
                                        rating: 0,
                                        sortBy: 'relevance'
                                    })}
                                    className={styles.clearFilters}
                                >
                                    Limpar
                                </button>
                            </div>

                            {/* Marca Filter */}
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
                            
                            {/* Conexão Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Tipo de Conexão</h4>
                                <div className={styles.filterOptions}>
                                    {connectionOptions.map(conn => (
                                        <label key={conn} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="connection"
                                                value={conn}
                                                checked={filters.connection === conn}
                                                onChange={(e) => updateFilter('connection', e.target.value)}
                                            />
                                            <span>{conn}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Cancelamento de Ruído Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Cancelamento de Ruído (NC)</h4>
                                <div className={styles.filterOptions}>
                                    {ncOptions.map(nc => (
                                        <label key={nc} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="noiseCancellation"
                                                value={nc}
                                                checked={filters.noiseCancellation === nc}
                                                onChange={(e) => updateFilter('noiseCancellation', e.target.value)}
                                            />
                                            <span>{nc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                             {/* Color Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Cor</h4>
                                <div className={styles.filterOptions}>
                                    {colors.map(color => (
                                        <label key={color} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="color"
                                                value={color}
                                                checked={filters.color === color}
                                                onChange={(e) => updateFilter('color', e.target.value)}
                                            />
                                            <span>{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Faixa de Preço (Máx: R$ {maxPrice.toFixed(2)})</h4>
                                <div className={styles.priceRange}>
                                    {/* O range max deve ser dinâmico ou fixado num valor alto */}
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        step="50"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        step="50"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                    />
                                    <div className={styles.priceLabels}>
                                        <span>R$ {filters.priceRange[0].toFixed(2)}</span>
                                        <span>R$ {filters.priceRange[1].toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Avaliação</h4>
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
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                {renderStars(rating)}
                                                {rating}+ estrelas
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className={styles.productsArea}>
                            <div className={styles.sortBar} style={{justifyContent: 'flex-end'}}>
                                {/* O campo de busca de compatibilidade de CasesPage não faz sentido aqui, então ele foi removido */}
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                                    className={styles.sortSelect}
                                >
                                    <option value="relevance">Mais Relevantes</option>
                                    <option value="price-low">Menor Preço</option>
                                    <option value="price-high">Maior Preço</option>
                                    <option value="rating">Melhor Avaliação</option>
                                </select>
                            </div>

                            <div className={styles.productsGrid}>
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🎧</div>
                                    <h3>Nenhum fone de ouvido encontrado</h3>
                                    <p>Tente ajustar os filtros, como Marca ou Faixa de Preço</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default HeadphonesPage