'use client'
import { useState, useMemo, useEffect } from 'react' // Importado useEffect
import Header from '../../components/Header'
import { Heart, Star, ShoppingCart, Filter, Trash2 } from 'lucide-react'
import './favorite.css'

// Define a estrutura de um item do carrinho
type CartItem = {
    id: number
    name: string
    price: number // Usaremos number para cálculos
    quantity: number
}

// Produto Favorito
type FavoriteProduct = {
    id: number
    name: string
    price: string // Preço em string para exibição
    originalPrice: string // Preço original em string
    image: string
    rating: number
    reviews: number
    category: string
    addedDate: string
    inStock: boolean
    discount: number
}

// Dados mockados (Serão usados apenas para inicialização)
const mockFavoriteProducts: FavoriteProduct[] = [
    {
        id: 1,
        name: 'Smartphone Premium Galaxy',
        price: 'R$ 1.299,00',
        originalPrice: 'R$ 1.599,00',
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        reviews: 124,
        category: 'Eletrônicos',
        addedDate: '2024-01-15',
        inStock: true,
        discount: 19
    },
    {
        id: 2,
        name: 'Notebook Gamer Ultra',
        price: 'R$ 2.899,00',
        originalPrice: 'R$ 3.299,00',
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        reviews: 89,
        category: 'Computadores',
        addedDate: '2024-01-12',
        inStock: true,
        discount: 12
    },
    {
        id: 3,
        name: 'Fone Bluetooth Premium',
        price: 'R$ 299,00',
        originalPrice: 'R$ 399,00',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        reviews: 256,
        category: 'Áudio',
        addedDate: '2024-01-10',
        inStock: false,
        discount: 25
    },
    {
        id: 4,
        name: 'Smartwatch Esportivo',
        price: 'R$ 499,00',
        originalPrice: 'R$ 599,00',
        image: 'https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.5,
        reviews: 90,
        category: 'Wearables',
        addedDate: '2023-12-20',
        inStock: true,
        discount: 16
    }
]

// CHAVE DO LOCALSTORAGE
const FAVORITES_KEY = 'favoriteProducts'

// Função auxiliar para converter string de preço para número (apenas para cálculo)
const priceToNumber = (priceString: string): number => {
    return parseFloat(priceString.replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0
}

// Função auxiliar para disparar o evento de atualização do carrinho no Header
const dispatchCartUpdate = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'))
    }
}

// NOVO: Função auxiliar para disparar o evento de atualização de favoritos no Header
const dispatchFavoritesUpdate = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('favoritesUpdated'))
    }
}

export default function Favorites() {
    // Estados para os filtros e produtos
    const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([])
    const [sortBy, setSortBy] = useState('recent')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [availabilityFilter, setAvailabilityFilter] = useState('')

    // --- Lógica de Inicialização (Carrega do LocalStorage) ---
    useEffect(() => {
        // Se não estiver no navegador, não executa
        if (typeof window === 'undefined') return

        try {
            const storedFavorites = localStorage.getItem(FAVORITES_KEY)
            if (storedFavorites) {
                setFavoriteProducts(JSON.parse(storedFavorites) as FavoriteProduct[])
            } else {
                // Se não houver nada, inicializa com os mocks e salva
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(mockFavoriteProducts))
                setFavoriteProducts(mockFavoriteProducts)
                dispatchFavoritesUpdate() // Notifica o Header após carregar os mocks iniciais
            }
        } catch (error) {
            console.error("Erro ao carregar favoritos do localStorage:", error)
            setFavoriteProducts(mockFavoriteProducts)
        }
    }, [])

    // --- Categorias (Baseadas nos produtos atuais, não nos mocks) ---
    const categories = useMemo(() => {
        return [...new Set(favoriteProducts.map(product => product.category))]
    }, [favoriteProducts])

    // --- Lógica de Manipulação de Favoritos ---
    const updateFavorites = (newFavorites: FavoriteProduct[]) => {
        // 1. Atualiza o estado local
        setFavoriteProducts(newFavorites);
        // 2. Persiste no localStorage
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        // 3. Notifica o Header
        dispatchFavoritesUpdate();
    };

    const removeFromFavorites = (productId: number) => {
        const newFavorites = favoriteProducts.filter(item => item.id !== productId);
        updateFavorites(newFavorites);
    }

    const clearFavorites = () => {
        updateFavorites([]);
    }

    // --- Lógica de Carrinho (Ações de adição permanecem as mesmas, mas com a função de persistência) ---
    const addToCart = (productId: number) => {
        const productToAdd = favoriteProducts.find(p => p.id === productId)
        if (!productToAdd || !productToAdd.inStock) return

        let cartData: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')

        const existingItem = cartData.find(item => item.id === productId)
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            cartData.push({
                id: productToAdd.id,
                name: productToAdd.name,
                price: priceToNumber(productToAdd.price),
                quantity: 1
            })
        }

        localStorage.setItem('cart', JSON.stringify(cartData))
        dispatchCartUpdate()
        alert(`"${productToAdd.name}" adicionado ao carrinho!`)
    }

    const addAllToCart = () => {
        const inStockItems = favoriteProducts.filter(p => p.inStock)
        if (inStockItems.length === 0) {
            alert('Nenhum produto em estoque para adicionar ao carrinho.')
            return
        }

        let cartData: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')

        inStockItems.forEach(productToAdd => {
            const existingItem = cartData.find(item => item.id === productToAdd.id)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                cartData.push({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: priceToNumber(productToAdd.price),
                    quantity: 1
                })
            }
        })

        localStorage.setItem('cart', JSON.stringify(cartData))
        dispatchCartUpdate()
        alert(`${inStockItems.length} produto(s) em estoque adicionados ao carrinho!`)
    }

    // --- Lógica de Filtragem e Ordenação ---
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...favoriteProducts]

        // 1. Filtragem por Categoria
        if (categoryFilter) {
            result = result.filter(product => product.category === categoryFilter)
        }

        // 2. Filtragem por Disponibilidade
        if (availabilityFilter) {
            result = result.filter(product =>
                availabilityFilter === 'in-stock' ? product.inStock : !product.inStock
            )
        }

        // 3. Ordenação
        result.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return priceToNumber(a.price) - priceToNumber(b.price)
                case 'price-high':
                    return priceToNumber(b.price) - priceToNumber(a.price)
                case 'rating':
                    return b.rating - a.rating
                case 'discount':
                    return b.discount - a.discount
                case 'recent':
                default:
                    return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
            }
        })

        return result
    }, [favoriteProducts, sortBy, categoryFilter, availabilityFilter])


    const clearFilters = () => {
        setSortBy('recent')
        setCategoryFilter('')
        setAvailabilityFilter('')
    }

    // --- Componente Card ---
    const ProductCard = ({ product }: { product: FavoriteProduct }) => (
        <div className="favorite-card">
            <div className="favorite-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="favorite-image"
                />
                <div className="discount-badge">
                    -{product.discount}%
                </div>
                <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="remove-favorite-btn"
                >
                    <Heart className="heart-icon filled" />
                </button>
                {!product.inStock && (
                    <div className="out-of-stock-overlay">
                        <span className="out-of-stock-text">Fora de Estoque</span>
                    </div>
                )}
            </div>
            <div className="favorite-content">
                <div className="favorite-meta">
                    <span className="category-tag">
                        {product.category}
                    </span>
                    <span className="added-date">
                        Adicionado em {new Date(product.addedDate).toLocaleDateString('pt-BR')}
                    </span>
                </div>
                <h3 className="favorite-title">{product.name}</h3>
                <div className="rating-container">
                    <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`star ${i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}`}
                            />
                        ))}
                    </div>
                    <span className="rating-text">({product.reviews})</span>
                </div>
                <div className="price-container">
                    <span className="current-price">{product.price}</span>
                    <span className="original-price">{product.originalPrice}</span>
                </div>
                <div className="favorite-actions">
                    <button
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                        className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                    >
                        <ShoppingCart className="cart-icon" />
                        {product.inStock ? 'Adicionar' : 'Indisponível'}
                    </button>
                    <button
                        onClick={() => removeFromFavorites(product.id)}
                        className="remove-btn"
                    >
                        <Trash2 className="trash-icon" />
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container py-8">
                {/* Header */}
                <div className="favorites-header">
                    <div className="favorites-title-section">
                        <h1 className="favorites-title">
                            <Heart className="title-heart" />
                            Meus Favoritos
                        </h1>
                        <p className="favorites-subtitle">
                            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto salvo' : 'produtos salvos'}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filters-container">
                        <div className="filter-label">
                            <Filter className="filter-icon" />
                            <span>Filtros:</span>
                        </div>

                        {/* ORDENAR POR */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="recent">Adicionados recentemente</option>
                            <option value="price-low">Menor preço</option>
                            <option value="price-high">Maior preço</option>
                            <option value="rating">Melhor avaliação</option>
                            <option value="discount">Maior desconto</option>
                        </select>

                        {/* FILTRAR POR CATEGORIA */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todas as categorias</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        {/* FILTRAR POR DISPONIBILIDADE */}
                        <select
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Disponibilidade</option>
                            <option value="in-stock">Em estoque</option>
                            <option value="out-of-stock">Fora de estoque</option>
                        </select>

                        <button onClick={clearFilters} className="clear-filters-btn">
                            Limpar filtros
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                {favoriteProducts.length > 0 ? (
                    <div className="favorites-grid grid-view">
                        {filteredAndSortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-favorites">
                        <Heart className="empty-heart" />
                        <h3 className="empty-title">
                            Sua lista de favoritos está vazia
                        </h3>
                        <p className="empty-text">
                            Explore nossos produtos e adicione seus favoritos para facilitar suas compras futuras
                        </p>
                        <button className="btn btn-primary" onClick={() => {/* Redirecionar para home/produtos */ }}>
                            Explorar Produtos
                        </button>
                    </div>
                )}

                {/* Mensagem de Filtro Vazio */}
                {favoriteProducts.length > 0 && filteredAndSortedProducts.length === 0 && (
                    <div className="empty-favorites" style={{ paddingTop: '2rem' }}>
                        <Filter className="empty-heart" style={{ color: '#9ca3af' }} />
                        <h3 className="empty-title" style={{ fontSize: '1.25rem' }}>
                            Nenhum resultado encontrado.
                        </h3>
                        <p className="empty-text">
                            Ajuste seus filtros ou clique em "Limpar filtros".
                        </p>
                    </div>
                )}


                {/* Quick Actions */}
                {favoriteProducts.length > 0 && (
                    <div className="quick-actions">
                        <h3 className="quick-actions-title">Ações Rápidas</h3>
                        <div className="quick-actions-buttons">
                            <button className="btn btn-primary" onClick={addAllToCart}>
                                Adicionar Todos ao Carrinho ({favoriteProducts.filter(p => p.inStock).length} em estoque)
                            </button>
                            <button className="btn-danger" onClick={clearFavorites}>
                                Limpar Lista ({favoriteProducts.length} itens)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}