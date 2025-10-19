"use client"

import React, { useState, useMemo } from 'react'
import { Star } from 'lucide-react'
import Header from '../../components/Header'
import SubHeader from '../../components/SubHeader'
import ProductCard from '../../components/ProductCard'
import { accessoryProducts } from '../../data/products'
import styles from '../../styles/Category.module.css'

// 1. Definição da interface para o estado de filtros
interface Filters {
    type: string;
    compatibility: string;
    brand: string;
    priceRange: [number, number];
    rating: number;
    sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating';
}

const AcessoriosPage: React.FC = () => {
    // A tipagem é feita aqui: useState<Filters>
    const [filters, setFilters] = useState<Filters>({
        type: '',
        compatibility: '',
        brand: '',
        priceRange: [0, 1000],
        rating: 0,
        sortBy: 'relevance'
    })

    const types = ['Carregadores', 'Fones', 'Suportes', 'Películas', 'Power Bank']
    const compatibility = ['iPhone', 'Samsung', 'Universal', 'Android']
    const brands = ['Apple', 'JBL', 'Anker', 'Spigen', 'Belkin']

    const filteredProducts = useMemo(() => {
        const filtered = accessoryProducts.filter(product => {
            // ... lógica de filtro
            const matchesType = !filters.type || product.category === filters.type
            // Você pode adicionar a lógica para compatibilidade e marca aqui
            const matchesPrice = product.currentPrice >= filters.priceRange[0] && 
                                 product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating
            
            return matchesType && matchesPrice && matchesRating
        })

        switch (filters.sortBy) {
            case 'price-low':
                return [...filtered].sort((a, b) => a.currentPrice - b.currentPrice)
            case 'price-high':
                return [...filtered].sort((a, b) => b.currentPrice - a.currentPrice)
            case 'rating':
                return [...filtered].sort((a, b) => b.rating - a.rating)
            default:
                return filtered
        }
    }, [filters])

    // 2. Tipagem da função updateFilter para ser genérica e segura
    const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const resetFilters = () => {
        setFilters({
            type: '',
            compatibility: '',
            brand: '',
            priceRange: [0, 1000],
            rating: 0,
            sortBy: 'relevance'
        })
    }
    
    // ... restante do JSX, aplicando as correções de tipagem nos eventos onChange:

    return (
        <div className={styles.page}>
            <Header />
            {/* O SubHeader precisa ser importado e usado para não gerar erro, embora não estivesse no seu código */}
            {/* <SubHeader /> */}
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* ... breadcrumb e pageHeader ... */}

                    <div className={styles.content}>
                        {/* ===== SIDEBAR ===== */}
                        <aside className={styles.sidebar}>
                            <div className={styles.filtersHeader}>
                                <h3>Filtros</h3>
                                <button 
                                    onClick={resetFilters} // Usando a função dedicada
                                    className={styles.clearFilters}
                                >
                                    Limpar
                                </button>
                            </div>

                            {/* Tipo */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Tipo</h4>
                                <div className={styles.filterOptions}>
                                    {types.map(type => (
                                        <label key={type} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type}
                                                checked={filters.type === type}
                                                // Corrigido para passar o tipo correto (string)
                                                onChange={(e) => updateFilter('type', e.target.value)}
                                            />
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Compatibilidade */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Compatibilidade</h4>
                                <div className={styles.filterOptions}>
                                    {compatibility.map(comp => (
                                        <label key={comp} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="compatibility"
                                                value={comp}
                                                checked={filters.compatibility === comp}
                                                // Corrigido para passar o tipo correto (string)
                                                onChange={(e) => updateFilter('compatibility', e.target.value)}
                                            />
                                            <span>{comp}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Faixa de Preço */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Faixa de Preço</h4>
                                <div className={styles.priceRange}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        step="50"
                                        value={filters.priceRange[0]}
                                        // Corrigido para passar o array de números [number, number]
                                        onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        step="50"
                                        value={filters.priceRange[1]}
                                        // Corrigido para passar o array de números [number, number]
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
                                                // Corrigido para passar o tipo correto (number)
                                                onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                                            />
                                            <span>
                                                {'★'.repeat(rating)} e acima
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* ===== ÁREA DE PRODUTOS ===== */}
                        <div className={styles.productsArea}>
                            <div className={styles.sortBar}>
                                <select
                                    value={filters.sortBy}
                                    // Corrigido com type assertion para o tipo literal
                                    onChange={(e) => updateFilter('sortBy', e.target.value as Filters['sortBy'])}
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
                            
                            {/* ... emptyState ... */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AcessoriosPage