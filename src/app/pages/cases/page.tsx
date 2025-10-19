"use client"

import React, { useState, useMemo } from 'react'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
// Importando accessoryProducts e a interface ProductDetails
import { accessoryProducts, ProductDetails } from '../../data/products'
import styles from '../../styles/Category.module.css'
import { Search, Star } from 'lucide-react'

// 1. Definição da interface para o estado de filtros
interface Filters {
    material: string;
    compatibility: string;
    compatibilitySearch: string;
    color: string;
    protection: string;
    priceRange: [number, number];
    rating: number;
    sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating';
}

const CasesPage: React.FC = () => {
    // 2. Tipagem do useState com a nova interface
    const initialFilters: Filters = {
        material: '',
        compatibility: '',
        compatibilitySearch: '',
        color: '',
        protection: '',
        priceRange: [0, 500],
        rating: 0,
        sortBy: 'relevance'
    };

    const [filters, setFilters] = useState<Filters>(initialFilters)

    const materials = ['Silicone', 'Couro', 'Plástico', 'TPU', 'Híbrido'] as const
    const compatibilityOptions = ['iPhone 15', 'iPhone 14', 'Samsung S24', 'Samsung S23'] as const
    const colors = ['Transparente', 'Preto', 'Azul', 'Rosa', 'Verde', 'Vermelho'] as const
    const protection = ['Básica', 'Militar', 'Anti-impacto', 'À prova d\'água'] as const

    const casesProducts = accessoryProducts.filter(product =>
        product.category === 'Capinhas' || product.name.toLowerCase().includes('capinha')
    )

    const filteredProducts = useMemo(() => {
        let filtered = casesProducts.filter(product => {
            const details = product.details as ProductDetails || {}
            // Assumindo que as propriedades details.material, details.color, details.protection existam
            const matchesMaterial = !filters.material || details.material === filters.material
            const matchesColor = !filters.color || details.color === filters.color
            const matchesProtection = !filters.protection || details.protection === filters.protection
            
            const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
                product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating
            
            const compatibilitySearchTerm = filters.compatibilitySearch.toLowerCase().trim()
            const compatibilityRadioTerm = filters.compatibility.toLowerCase().trim()
            
            let matchesCompatibility = true
            const productCompatibility = details.compatibility ? details.compatibility.toLowerCase() : ''
            
            if (compatibilitySearchTerm) {
                matchesCompatibility = productCompatibility.includes(compatibilitySearchTerm) ||
                    product.name.toLowerCase().includes(compatibilitySearchTerm)
            } else if (compatibilityRadioTerm) {
                matchesCompatibility = productCompatibility.includes(compatibilityRadioTerm) ||
                    product.name.toLowerCase().includes(compatibilityRadioTerm)
            }
            
            return matchesPrice && matchesRating && matchesMaterial && matchesColor && matchesProtection && matchesCompatibility
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

    // 3. Tipagem Corrigida: Uso de Genéricos para associar 'key' e 'value'
    const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }
    
    // Função para resetar filtros usando o estado inicial
    const resetFilters = () => {
        setFilters(initialFilters);
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

    const maxPrice = Math.max(...casesProducts.map(p => p.currentPrice), 500)

    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.breadcrumb}>
                        <span>Home</span> &gt; <span className={styles.active}>Cases</span>
                    </div>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.title}>Capinhas e Cases de Proteção</h1>
                        <p className={styles.subtitle}>{filteredProducts.length} produtos encontrados</p>
                    </div>
                    <div className={styles.content}>
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

                            {/* Material Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Material</h4>
                                <div className={styles.filterOptions}>
                                    {materials.map(material => (
                                        <label key={material} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="material"
                                                value={material}
                                                checked={filters.material === material}
                                                // OK: 'material' recebe string
                                                onChange={(e) => updateFilter('material', e.target.value)}
                                            />
                                            <span>{material}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Compatibility Filter (Radio Buttons) */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Compatibilidade (Modelo)</h4>
                                <div className={styles.filterOptions} style={{ marginTop: '10px' }}>
                                    {compatibilityOptions.map(comp => (
                                        <label key={comp} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="compatibility"
                                                value={comp}
                                                checked={filters.compatibility === comp}
                                                // OK: 'compatibility' recebe string
                                                onChange={(e) => {
                                                    updateFilter('compatibility', e.target.value)
                                                    // OK: 'compatibilitySearch' recebe string
                                                    updateFilter('compatibilitySearch', '')
                                                }}
                                            />
                                            <span>{comp}</span>
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
                                                // OK: 'color' recebe string
                                                onChange={(e) => updateFilter('color', e.target.value)}
                                            />
                                            <span>{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Protection Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Nível de Proteção</h4>
                                <div className={styles.filterOptions}>
                                    {protection.map(prot => (
                                        <label key={prot} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="protection"
                                                value={prot}
                                                checked={filters.protection === prot}
                                                // OK: 'protection' recebe string
                                                onChange={(e) => updateFilter('protection', e.target.value)}
                                            />
                                            <span>{prot}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Faixa de Preço (Máx: R$ {maxPrice.toFixed(2)})</h4>
                                <div className={styles.priceRange}>
                                    {/* Primeiro Range Input */}
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        step="25"
                                        value={filters.priceRange[0]}
                                        // OK: 'priceRange' recebe [number, number]
                                        onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    />
                                    {/* Segundo Range Input */}
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        step="25"
                                        value={filters.priceRange[1]}
                                        // OK: 'priceRange' recebe [number, number]
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
                                                // OK: 'rating' recebe number
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
                                {/* Compatibility Search Input */}
                                <div className={styles.compatibilitySearchInput}>
                                    <input
                                        type="text"
                                        placeholder="Ex: iPhone 15 Pro Max"
                                        value={filters.compatibilitySearch}
                                        // OK: 'compatibilitySearch' recebe string
                                        onChange={(e) => {
                                            updateFilter('compatibilitySearch', e.target.value)
                                            updateFilter('compatibility', '') // Limpa a opção de rádio se estiver digitando
                                        }}
                                    />
                                    <Search size={20} style={{ color: '#aaa' }} />
                                </div>
                                {/* Sort Select */}
                                <select
                                    value={filters.sortBy}
                                    // OK: 'sortBy' recebe string literal (com Type Assertion)
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
                                    <div className={styles.emptyIcon}>🛡️</div>
                                    <h3>Nenhuma capinha encontrada</h3>
                                    <p>Tente ajustar os filtros ou use a busca de modelo</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CasesPage