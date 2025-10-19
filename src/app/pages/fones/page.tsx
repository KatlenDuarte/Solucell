"use client"

import React, { useState, useMemo } from 'react'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
import { allProducts, ProductDetails } from '../../data/products' // Mantém ProductDetails, embora não esteja 100% claro qual é o tipo base de allProducts
import styles from '../../styles/Category.module.css'
import { Search, Star } from 'lucide-react'

// 1. Definição da interface para o estado de filtros
interface Filters {
    brand: string;
    connection: string;
    noiseCancellation: string;
    color: string;
    priceRange: [number, number];
    rating: number;
    sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating';
}

const HeadphonesPage: React.FC = () => {
    // 2. Tipagem do useState com a nova interface
    const initialFilters: Filters = {
        brand: '',
        connection: '',
        noiseCancellation: '',
        color: '',
        priceRange: [0, 2500],
        rating: 0,
        sortBy: 'relevance'
    };

    const [filters, setFilters] = useState<Filters>(initialFilters)

    // Opções de filtro específicas para FONES (usando 'as const' para tipagem mais rigorosa)
    const brands = ['Apple', 'JBL', 'Samsung', 'Sony', 'Xiaomi'] as const
    const connectionOptions = ['Wireless', 'Com Fio', 'True Wireless'] as const
    const ncOptions = ['Ativo', 'Passivo', 'Não possui'] as const
    const colors = ['Preto', 'Branco', 'Azul', 'Vermelho'] as const

    // 1. Filtragem Inicial: Apenas produtos da categoria Fones/Audio
    const headphoneProducts = allProducts.filter(product =>
        product.category === 'Fones' || product.category === 'Audio'
    )

    const filteredProducts = useMemo(() => {
        let filtered = headphoneProducts.filter(product => {
            const details = product.details as ProductDetails || {}

            // Filtros por Radio Button/Select
            const matchesBrand = !filters.brand || product.brand === filters.brand
            const matchesColor = !filters.color || details.color === filters.color
            
            // Filtro por Preço e Avaliação
            const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
                product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating
        })

        // Lógica de Ordenação
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

    // 3. Tipagem Corrigida: Uso de Genéricos para associar 'key' e 'value' de forma segura
    const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    // Função para resetar filtros usando o estado inicial
    const resetFilters = () => {
        setFilters(initialFilters);
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
                                    onClick={resetFilters}
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
                                <select
                                    value={filters.sortBy}
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