"use client"

import React, { useState, useMemo } from 'react'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
// Importando todos os produtos e a interface ProductDetails
import { allProducts, ProductDetails } from '../../data/products' 
import styles from '../../styles/Category.module.css'
import { Star } from 'lucide-react' 

// 1. Definição da interface para o estado de filtros
interface Filters {
    brand: string;
    chargerType: string;
    powerType: string;
    capacity: string;
    priceRange: [number, number];
    rating: number;
    sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating';
}

const ChargersPage: React.FC = () => {
    // 2. Tipagem do useState com a nova interface
    const [filters, setFilters] = useState<Filters>({
        brand: '', // Marca (Apple, Anker, Samsung, etc.)
        chargerType: '', // Tipo (Parede, Power Bank, Sem Fio)
        powerType: '', // Tecnologia (Fast Charge, MagSafe)
        capacity: '', // Capacidade (para Power Banks, ex: 10000mAh)
        priceRange: [0, 600], // Faixa de preço adequada para carregadores
        rating: 0,
        sortBy: 'relevance'
    })

    // Opções de filtro específicas para CARREGADORES
    const brands = ['Apple', 'Anker', 'Samsung', 'Xiaomi']
    const chargerTypes = ['Parede', 'Power Bank', 'Sem Fio', 'Veicular']
    const powerTypes = ['Fast Charge', 'MagSafe', 'PowerIQ', 'USB-C PD']
    const capacities = ['5000mAh', '10000mAh', '20000mAh+']
    
    // Filtra apenas produtos da categoria Carregadores
    const chargerProducts = allProducts.filter(product =>
        product.category === 'Carregadores'
    )

    const filteredProducts = useMemo(() => {
        let filtered = chargerProducts.filter(product => {
            const productNameLower = product.name.toLowerCase()
            const productDescLower = product.description.toLowerCase()
            
            // Filtros por Radio Button/Select
            const matchesBrand = !filters.brand || product.brand === filters.brand
            
            // Simulação de filtro de tipo de carregador (usando o nome/descrição, se 'details' não tiver)
            const matchesChargerType = !filters.chargerType || 
                (filters.chargerType === 'Parede' && productDescLower.includes('tomada')) ||
                (filters.chargerType === 'Power Bank' && productNameLower.includes('power bank')) ||
                (filters.chargerType === 'Sem Fio' && productDescLower.includes('sem fio')) ||
                (filters.chargerType === 'Veicular' && productNameLower.includes('veicular')) ||
                false

            // Simulação de filtro de potência/tecnologia
            const matchesPowerType = !filters.powerType || productDescLower.includes(filters.powerType.toLowerCase().replace('-', ' '))
            
            // Simulação de filtro de capacidade (apenas para Power Banks)
            const matchesCapacity = !filters.capacity || productDescLower.includes(filters.capacity.toLowerCase())
            
            // Filtro por Preço e Avaliação
            const matchesPrice = product.currentPrice >= filters.priceRange[0] &&
                product.currentPrice <= filters.priceRange[1]
            const matchesRating = product.rating >= filters.rating

            // Combina todos os filtros
            return matchesPrice && matchesRating && matchesBrand && matchesChargerType && matchesPowerType && matchesCapacity
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

    // 3. Tipagem Corrigida: Usando Genéricos e keyof Filters para segurança de tipo
    const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    // Função para resetar filtros (ajustada para usar o estado inicial)
    const resetFilters = () => {
        setFilters({
            brand: '',
            chargerType: '',
            powerType: '',
            capacity: '',
            priceRange: [0, 600],
            rating: 0,
            sortBy: 'relevance'
        });
    };

    // Função auxiliar para renderizar estrelas
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
    
    // Determina o valor máximo de preço dinamicamente
    const maxPrice = Math.max(...chargerProducts.map(p => p.currentPrice), 600)

    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
                <div className={styles.container}>
                    {/* ... breadcrumb e pageHeader ... */}

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
                                                // OK: 'brand' recebe string
                                                onChange={(e) => updateFilter('brand', e.target.value)}
                                            />
                                            <span>{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Tipo de Carregador Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Tipo</h4>
                                <div className={styles.filterOptions}>
                                    {chargerTypes.map(type => (
                                        <label key={type} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="chargerType"
                                                value={type}
                                                checked={filters.chargerType === type}
                                                // OK: 'chargerType' recebe string
                                                onChange={(e) => updateFilter('chargerType', e.target.value)}
                                            />
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Tecnologia/Potência Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Tecnologia / Padrão</h4>
                                <div className={styles.filterOptions}>
                                    {powerTypes.map(power => (
                                        <label key={power} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="powerType"
                                                value={power}
                                                checked={filters.powerType === power}
                                                // OK: 'powerType' recebe string
                                                onChange={(e) => updateFilter('powerType', e.target.value)}
                                            />
                                            <span>{power}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Capacidade (Apenas para Power Banks) Filter */}
                            <div className={styles.filterGroup}>
                                <h4 className={styles.filterTitle}>Capacidade (Power Bank)</h4>
                                <div className={styles.filterOptions}>
                                    {capacities.map(cap => (
                                        <label key={cap} className={styles.filterOption}>
                                            <input
                                                type="radio"
                                                name="capacity"
                                                value={cap}
                                                checked={filters.capacity === cap}
                                                // OK: 'capacity' recebe string
                                                onChange={(e) => updateFilter('capacity', e.target.value)}
                                            />
                                            <span>{cap}</span>
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
                                        step="25"
                                        value={filters.priceRange[0]}
                                        // OK: 'priceRange' recebe [number, number]
                                        onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    />
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
                            <div className={styles.sortBar} style={{justifyContent: 'flex-end'}}>
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
                                    <div className={styles.emptyIcon}>🔋</div>
                                    <h3>Nenhum carregador encontrado</h3>
                                    <p>Tente reajustar os filtros de Tipo ou Marca.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ChargersPage