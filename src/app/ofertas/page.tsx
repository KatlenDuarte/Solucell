"use client"

import React, { useState, useMemo } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { allProducts, Product } from '../data/products' 
import styles from '../styles/Category.module.css'
import { Star, TrendingUp } from 'lucide-react' 

const DealsPage: React.FC = () => {
    const maxGlobalPrice = 3000

    const [filters, setFilters] = useState({
        category: '',
        discountThreshold: 0,
        priceRange: [0, maxGlobalPrice],
        rating: 0,
        sortBy: 'discount-high'
    })

    const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)))
    const discountThresholds = [
        { label: '10% ou mais', value: 10 },
        { label: '20% ou mais', value: 20 },
        { label: '30% ou mais', value: 30 },
        { label: '40% ou mais', value: 40 },
    ]
    
    const baseDealsProducts = useMemo(() => {
        const minimumDiscountPercentage = 5
        return allProducts.filter(product =>
            (product.discount && product.discount >= minimumDiscountPercentage && product.originalPrice !== product.currentPrice) ||
            product.badge ||
            product.isBestSeller ||
            product.isNew
        )
    }, [])

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = baseDealsProducts.filter(product => {
            const matchesCategory = !filters.category || product.category === filters.category
            const matchesDiscountThreshold = !filters.discountThreshold || 
                (product.discount && product.discount >= filters.discountThreshold) ||
                false
            const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
                product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating
            return matchesCategory && matchesDiscountThreshold && matchesPrice && matchesRating
        })

        switch (filters.sortBy) {
            case 'price-low':
                return filtered.sort((a, b) => a.currentPrice - b.currentPrice)
            case 'price-high':
                return filtered.sort((a, b) => b.currentPrice - a.currentPrice)
            case 'rating':
                return filtered.sort((a, b) => b.rating - a.rating)
            case 'discount-high': 
                return filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0)) 
            default:
                return filtered
        }
    }, [filters, baseDealsProducts])

    const updateFilter = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }
    
    const resetFilters = () => {
         setFilters({
            category: '',
            discountThreshold: 0,
            priceRange: [0, maxGlobalPrice],
            rating: 0,
            sortBy: 'discount-high'
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

    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.breadcrumb}>
                        <span>Home</span> &gt; <span className={styles.active}>Ofertas</span>
                    </div>

                    <div className={styles.pageHeader}>
                        <h1 className={styles.title} style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <TrendingUp size={30} />
                             Ofertas e Destaques
                        </h1>
                        <p className={styles.subtitle}>{filteredAndSortedProducts.length} produtos em destaque</p>
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
                                <h4 className={styles.filterTitle}>Desconto Mínimo</h4>
                                <div className={styles.filterOptions}>
                                    <label className={styles.filterOption}>
                                        <input
                                            type="radio"
                                            name="discountThreshold"
                                            value={0}
                                            checked={filters.discountThreshold === 0}
                                            onChange={() => updateFilter('discountThreshold', 0)}
                                        />
                                        <span>Todos os descontos</span>
                                    </label>
                                    {discountThresholds.map(option => (
                                        <label key={option.value} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="discountThreshold"
                                                value={option.value}
                                                checked={filters.discountThreshold === option.value}
                                                onChange={(e) => updateFilter('discountThreshold', parseInt(e.target.value))}
                                            />
                                            <span>{option.label}</span>
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
                                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                                    className={styles.sortSelect}
                                >
                                    <option value="discount-high">Maior Desconto</option>
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
                                    <div className={styles.emptyIcon}>😔</div>
                                    <h3>Nenhuma oferta encontrada para os filtros selecionados.</h3>
                                    <p>Tente reajustar os filtros de Desconto ou Categoria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default DealsPage
