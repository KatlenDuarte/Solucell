"use client"

import React, { useState, useMemo } from 'react'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
// Importe a lista de produtos seminovos e a interface correta
import { usedPhoneProducts, UsedPhoneDetails, Product } from '../../data/products' 
import styles from '../../styles/Category.module.css'
import { Search, Star } from 'lucide-react'

// Define a interface para os filtros específicos de seminovos
interface UsedPhoneFilters {
    brand: string;
    modelSearch: string; // Para pesquisa de modelo livre
    storage: string;
    condition: string;
    priceRange: [number, number];
    rating: number;
    sortBy: string;
}

const UsedPhonesPage: React.FC = () => {
    const [filters, setFilters] = useState<UsedPhoneFilters>({
        brand: '',
        modelSearch: '',
        storage: '',
        condition: '',
        priceRange: [500, 5000], // Faixa de preço maior para celulares
        rating: 0,
        sortBy: 'relevance'
    })

    // Opções de filtros baseadas nos seus produtos
    const brands = ['Apple', 'Samsung', 'Xiaomi']
    const storageOptions = ['64GB', '128GB', '256GB', '512GB']
    const conditionOptions: UsedPhoneDetails['condition'][] = ['Excelente', 'Muito Bom', 'Bom']

    const updateFilter = (key: keyof UsedPhoneFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const filteredProducts = useMemo(() => {
        let filtered = usedPhoneProducts.filter((product: Product) => {
            // Garante que os detalhes são do tipo correto (UsedPhoneDetails)
            const details = product.details as UsedPhoneDetails
            if (product.category !== 'Seminovos' || !details) return false;

            const matchesBrand = !filters.brand || details.brand === filters.brand
            const matchesStorage = !filters.storage || details.storage === filters.storage
            const matchesCondition = !filters.condition || details.condition === filters.condition
            const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
                product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating

            const modelSearchTerm = filters.modelSearch.toLowerCase().trim()
            const matchesModelSearch = !modelSearchTerm || 
                details.model.toLowerCase().includes(modelSearchTerm) ||
                product.name.toLowerCase().includes(modelSearchTerm)

            return matchesPrice && matchesRating && matchesBrand && 
                   matchesStorage && matchesCondition && matchesModelSearch
        })

        // Ordenação
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

    // Função para resetar todos os filtros
    const resetFilters = () => {
        setFilters({
            brand: '',
            modelSearch: '',
            storage: '',
            condition: '',
            priceRange: [500, 5000],
            rating: 0,
            sortBy: 'relevance'
        })
    }

    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.breadcrumb}>
                        <span>Home</span> &gt; <span className={styles.active}>Seminovos</span>
                    </div>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.title}>Celulares Seminovos</h1>
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

                            {/* Filtro de Marca */}
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

                            {/* Filtro de Capacidade de Armazenamento */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Armazenamento</h4>
                                <div className={styles.filterOptions}>
                                    {storageOptions.map(storage => (
                                        <label key={storage} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="storage"
                                                value={storage}
                                                checked={filters.storage === storage}
                                                onChange={(e) => updateFilter('storage', e.target.value)}
                                            />
                                            <span>{storage}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filtro de Condição (Grau de Recondicionamento) */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Condição</h4>
                                <div className={styles.filterOptions}>
                                    {conditionOptions.map(condition => (
                                        <label key={condition} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="condition"
                                                value={condition}
                                                checked={filters.condition === condition}
                                                onChange={(e) => updateFilter('condition', e.target.value)}
                                            />
                                            <span>{condition}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filtro de Faixa de Preço */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Faixa de Preço (R$)</h4>
                                <div className={styles.priceRange}>
                                    <input
                                        type="range"
                                        min="500"
                                        max="5000" // Aumentado para celulares
                                        step="100"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    />
                                    <input
                                        type="range"
                                        min="500"
                                        max="5000" // Aumentado para celulares
                                        step="100"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                    />
                                    <div className={styles.priceLabels}>
                                        <span>R$ {filters.priceRange[0]}</span>
                                        <span>R$ {filters.priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Filtro de Avaliação */}
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
                            <div className={styles.sortBar}>
                                {/* Campo de busca de modelo/nome */}
                                <div className={styles.compatibilitySearchInput}>
                                    <input
                                        type="text"
                                        placeholder="Pesquisar por modelo (Ex: iPhone 13)"
                                        value={filters.modelSearch}
                                        onChange={(e) => updateFilter('modelSearch', e.target.value)}
                                    />
                                    <Search size={20} style={{ color: '#aaa' }} />
                                </div>
                                
                                {/* Dropdown de Ordenação */}
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

                            {/* Grade de Produtos */}
                            <div className={styles.productsGrid}>
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>

                            {/* Estado Vazio */}
                            {filteredProducts.length === 0 && (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>📱</div>
                                    <h3>Nenhum celular seminovo encontrado</h3>
                                    <p>Tente ajustar os filtros ou use a barra de pesquisa de modelo</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default UsedPhonesPage