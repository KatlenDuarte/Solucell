'use client'

import React, { useState, useMemo } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { allProducts, Product } from '../data/products' 
import styles from '../styles/Category.module.css'
import { Star, Zap } from 'lucide-react'

// 1. Defina a interface para o objeto de filtros
interface Filters {
    category: string;
    priceRange: [number, number];
    rating: number;
    sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
}

const LaunchPage: React.FC = () => {
    const maxGlobalPrice = 3000

    // 2. Tipa o estado inicial usando a interface
    const [filters, setFilters] = useState<Filters>({
        category: '',
        priceRange: [0, maxGlobalPrice],
        rating: 0,
        sortBy: 'newest'
    })

    const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)))
    
    const baseLaunchProducts = useMemo(() => {
        return allProducts.filter(product => product.isNew)
    }, [])

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = baseLaunchProducts.filter(product => {
            const matchesCategory = !filters.category || product.category === filters.category
            const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
                product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating
            return matchesCategory && matchesPrice && matchesRating
        })

        switch (filters.sortBy) {
            case 'price-low':
                // Nota: O .sort() opera in-place, mas para useMemo, 
                // é bom criar uma cópia para garantir a re-renderização.
                return [...filtered].sort((a, b) => a.currentPrice - b.currentPrice) 
            case 'price-high':
                return [...filtered].sort((a, b) => b.currentPrice - a.currentPrice)
            case 'rating':
                return [...filtered].sort((a, b) => b.rating - a.rating)
            case 'newest': 
            default:
                return filtered
        }
    }, [filters, baseLaunchProducts])

    // 3. Tipa a função para aceitar apenas chaves e valores válidos da interface Filters
    const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }
    
    const resetFilters = () => {
        setFilters({
            category: '',
            priceRange: [0, maxGlobalPrice],
            rating: 0,
            sortBy: 'newest'
        })
    }

    const renderStars = (rating: number) => {
        const maxStars = 5
        const filledStars = rating
        const emptyStars = maxStars - filledStars
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {Array.from({ length: filledStars }).map((_, i) => (
                    <Star key={`filled-${i}`} size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                ))}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star key={`empty-${i}`} size={16} style={{ color: '#d1d5db', fill: 'none' }} />
                ))}
            </div>
        )
    }

    // ... (restante do JSX)
    
    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.breadcrumb}>
                        <span>Home</span> &gt; <span className={styles.active}>Lançamentos</span>
                    </div>

                    <div className={styles.pageHeader}>
                        <h1 className={styles.title} style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Zap size={30} />
                            Lançamentos
                        </h1>
                        <p className={styles.subtitle}>{filteredAndSortedProducts.length} produtos em novidade</p>
                    </div>

                    <div className={styles.content}>
                        <aside className={styles.sidebar}>
                            <div className={styles.filtersHeader}>
                                <h3>Filtros</h3>
                                <button onClick={resetFilters} className={styles.clearFilters}>
                                    Limpar
                                </button>
                            </div>

                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Categoria</h4>
                                <div className={styles.filterOptions}>
                                    {uniqueCategories.map(category => (
                                        <label key={category} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category}
                                                checked={filters.category === category}
                                                onChange={(e) => updateFilter('category', e.target.value)}
                                            />
                                            <span>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Faixa de Preço (Máx: R$ {maxGlobalPrice.toFixed(2)})</h4>
                                <div className={styles.priceRange}>
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxGlobalPrice}
                                        step="50"
                                        value={filters.priceRange[0]}
                                        // O valor é um number[], mas o e.target.value é string.
                                        // A função updateFilter agora aceita o array de números [number, number].
                                        onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxGlobalPrice}
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
                                                // O valor é um number. A função updateFilter aceita number para 'rating'.
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
                            <div className={styles.sortBar}>
                                <select
                                    value={filters.sortBy}
                                    // O valor é string literal (sortBy). A função updateFilter aceita as strings literais.
                                    onChange={(e) => updateFilter('sortBy', e.target.value as Filters['sortBy'])}
                                    className={styles.sortSelect}
                                >
                                    <option value="newest">Mais Recente</option>
                                    <option value="price-low">Menor Preço</option>
                                    <option value="price-high">Maior Preço</option>
                                    <option value="rating">Melhor Avaliação</option>
                                </select>
                            </div>

                            <div className={styles.productsGrid}>
                                {filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>

                            {filteredAndSortedProducts.length === 0 && (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🚀</div>
                                    <h3>Nenhum lançamento encontrado para os filtros selecionados.</h3>
                                    <p>Tente reajustar os filtros ou visite nossa página de ofertas!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LaunchPage