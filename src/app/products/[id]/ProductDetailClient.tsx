"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  CreditCard,
  ArrowLeft,
  Plus,
  Minus,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Header from '../../components/Header'
import { useApp } from '../../context/AppContext'
import { Product } from '../../data/products'
import styles from './ProductDetail.module.css'

interface ProductDetailProps {
  product: Product
}

const DUMMY_REVIEWS = [
  {
    id: 1,
    author: "Camila F.",
    rating: 5,
    text: "O produto superou minhas expectativas! A entrega foi rápida e a qualidade é excelente. Recomendo a todos!",
    date: "12/05/2024"
  },
  {
    id: 2,
    author: "Rafael M.",
    rating: 4,
    text: "Muito bom, cumpre o que promete. A única ressalva é que achei a cor um pouco diferente da foto, mas nada grave.",
    date: "01/05/2024"
  },
  {
    id: 3,
    author: "Júlia S.",
    rating: 5,
    text: "Melhor compra do ano! Chegou bem embalado e antes do prazo. O custo-benefício é imbatível.",
    date: "25/04/2024"
  }
]

const ProductDetailClient: React.FC<ProductDetailProps> = ({ product }) => {
  const router = useRouter()
  const { cart, favorites } = useApp()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('specs')
  const [cep, setCep] = useState('')
  const [freightPrice, setFreightPrice] = useState<number | null>(null)

  const isFav = favorites.isFavorite(product.id)

  // 📦 Adicionar ao carrinho
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      cart.addToCart(product)
    }
  }

  // ❤️ Favoritar
  const handleFavoriteClick = () => {
    favorites.toggleFavorite(product)
  }

  // 📤 Compartilhar
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    }
  }

  // 💸 Formatador de preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // 🖼️ Galeria de imagens
  const productImages = [
    product.image,
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
  ]

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % productImages.length)
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length)

  // ⭐ Renderiza estrelas
  const renderStars = (rating: number, size: 'small' | 'large' = 'large') => {
    const starClassName = size === 'large' ? styles.star : styles.starSmall
    return (
      <div className={size === 'large' ? styles.stars : styles.reviewStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`${starClassName} ${star <= rating ? styles.starFilled : ''}`} />
        ))}
      </div>
    )
  }

  // 🚚 Cálculo do frete
  const calculateFreight = () => {
    const lojaCep = '33206132'
    if (!cep || cep.length < 8) {
      alert('Digite um CEP válido.')
      return
    }

    // Simulação básica — diferença de CEP em valor numérico
    const distance = Math.abs(parseInt(cep.replace(/\D/g, '')) - parseInt(lojaCep)) / 10000
    const price = distance * 0.7
    setFreightPrice(price < 10 ? 10 : price) // frete mínimo R$10
  }

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.wrapper}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <button onClick={() => router.back()} className={styles.backButton}>
              <ArrowLeft className={styles.backIcon} />
              Voltar
            </button>
            <span className={styles.breadcrumbText}>
              Home &gt; {product.category} &gt; {product.name}
            </span>
          </div>

          <div className={styles.productContainer}>
            {/* IMAGENS */}
            <div className={styles.imageSection}>
              <div className={styles.mainImageContainer}>
                <button onClick={prevImage} className={styles.imageNav}>
                  <ChevronLeft className={styles.navIcon} />
                </button>

                <div className={styles.mainImage}>
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  {product.discount && product.discount > 0 && (
                    <span className={styles.discountBadge}>-{product.discount}%</span>
                  )}
                </div>

                <button onClick={nextImage} className={styles.imageNav}>
                  <ChevronRight className={styles.navIcon} />
                </button>
              </div>

              <div className={styles.thumbnails}>
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* INFORMAÇÕES */}
            <div className={styles.infoSection}>
              <div className={styles.badges}>
                {product.isNew && <span className={styles.badgeNew}>NOVO</span>}
                {product.isBestSeller && <span className={styles.badgeBestSeller}>MAIS VENDIDO</span>}
                {product.badge && <span className={styles.badgeSpecial}>{product.badge}</span>}
              </div>

              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productDescription}>{product.description}</p>

              <div className={styles.rating}>
                {renderStars(product.rating, 'large')}
                <span className={styles.ratingText}>
                  {product.rating.toFixed(1)} ({product.reviews} avaliações)
                </span>
                <button className={styles.reviewsLink} onClick={() => setActiveTab('reviews')}>
                  Ver todas as avaliações
                </button>
              </div>

              {/* Preços */}
              <div className={styles.pricing}>
                {product.discount && product.discount > 0 && product.originalPrice && (
                  <span className={styles.originalPrice}>De: {formatPrice(product.originalPrice)}</span>
                )}
                <span className={styles.currentPrice}>{formatPrice(product.currentPrice)}</span>
                <span className={styles.installments}>
                  ou {product.installments}x de {formatPrice(product.installmentPrice)} sem juros
                </span>
                {product.discount && product.discount > 0 && product.originalPrice && (
                  <span className={styles.savingsAmount}>
                    Você economiza {formatPrice(product.originalPrice - product.currentPrice)}
                  </span>
                )}
              </div>

              {/* Quantidade */}
              <div className={styles.quantitySection}>
                <label className={styles.quantityLabel}>Quantidade:</label>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.quantityButton}
                    disabled={quantity <= 1}
                  >
                    <Minus className={styles.quantityIcon} />
                  </button>
                  <span className={styles.quantity}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className={styles.quantityButton}>
                    <Plus className={styles.quantityIcon} />
                  </button>
                </div>
                <span className={styles.stock}>Em estoque</span>
              </div>

              {/* Ações */}
              <div className={styles.actions}>
                <button onClick={handleAddToCart} className={styles.addToCartButton}>
                  <ShoppingCart className={styles.actionIcon} />
                  Adicionar ao Carrinho
                </button>
                <div className={styles.actionsMinor}>
                  <button
                    onClick={handleFavoriteClick}
                    className={`${styles.favoriteButton} ${isFav ? styles.favoriteActive : ''}`}
                  >
                    <Heart className={styles.actionIcon} />
                    {isFav ? 'Remover dos Favoritos' : 'Favoritar'}
                  </button>

                  <button onClick={handleShare} className={styles.shareButton}>
                    <Share2 className={styles.actionIcon} />
                    Compartilhar
                  </button>
                </div>
              </div>

              {/* Benefícios */}
              <div className={styles.benefits}>
                <div className={styles.benefit}>
                  <Truck className={styles.benefitIcon} />
                  <div>
                    <strong>Frete Grátis</strong>
                    <p>Para compras acima de R$ 199</p>
                  </div>
                </div>

                <div className={styles.benefit}>
                  <CreditCard className={styles.benefitIcon} />
                  <div>
                    <strong>{product.installments}x sem juros</strong>
                    <p>No cartão de crédito</p>
                  </div>
                </div>

                <div className={styles.benefit}>
                  <Shield className={styles.benefitIcon} />
                  <div>
                    <strong>Garantia</strong>
                    <p>Produto original com garantia de 12 meses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className={styles.detailsSection}>
            <div className={styles.tabsHeader}>
              <button
                className={`${styles.tab} ${activeTab === 'specs' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Especificações
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Avaliações ({product.reviews})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'shipping' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Entrega
              </button>
            </div>

            <div className={styles.tabContent}>
              {/* ESPECIFICAÇÕES */}
              {activeTab === 'specs' && (
                <div className={styles.specifications}>
                  <h3>Especificações Técnicas</h3>
                  <div className={styles.specGrid}>
                    <div><strong>Marca:</strong> {product.brand}</div>
                    <div><strong>Modelo:</strong> {product.name}</div>
                    <div><strong>Categoria:</strong> {product.category}</div>
                    <div><strong>Garantia:</strong> 12 meses</div>
                    {product.storage !== 'N/A' && (
                      <div><strong>Armazenamento:</strong> {product.storage}</div>
                    )}
                  </div>
                </div>
              )}

              {/* AVALIAÇÕES */}
              {activeTab === 'reviews' && (
                <div className={styles.reviews}>
                  <h3>Avaliações de Clientes</h3>
                  <div className={styles.reviewsList}>
                    {DUMMY_REVIEWS.map((review) => (
                      <div key={review.id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                          <span className={styles.reviewAuthor}>{review.author}</span>
                          {renderStars(review.rating, 'small')}
                        </div>
                        <p className={styles.reviewText}>{review.text}</p>
                        <span className={styles.reviewDate}>Avaliado em {review.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ENTREGA */}
              {activeTab === 'shipping' && (
                <div className={styles.shipping}>
                  <h3>Opções de Entrega e Retirada</h3>
                  <div className={styles.shippingOptions}>
                    <div className={styles.shippingOption}>
                      <strong>Entrega em 24h</strong>
                      <p>Calcule o frete</p>
                      <span>Receba em até <strong>24 horas</strong> após a confirmação do pagamento.</span>
                      <div className={styles.freightCalculator}>
                        <label htmlFor="cep">Digite seu CEP:</label>
                        <div className={styles.cepInputRow}>
                          <input
                            id="cep"
                            type="text"
                            maxLength={9}
                            placeholder="33206-132"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            className={styles.cepInput}
                          />
                          <button onClick={calculateFreight} className={styles.calcButton}>
                            Calcular
                          </button>
                        </div>
                        {freightPrice !== null && (
                          <p className={styles.freightResult}>
                            Valor estimado: <strong>R$ {freightPrice.toFixed(2)}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={styles.shippingOption}>
                      <strong>Retirar na Loja – Jardim da Glória</strong>
                      <p>Grátis</p>
                      <span>Disponível em até <strong>2 horas</strong>.</span>
                    </div>

                    <div className={styles.shippingOption}>
                      <strong>Retirar na Loja – Vila Esportiva</strong>
                      <p>Grátis</p>
                      <span>Disponível em até <strong>2 horas</strong>.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetailClient
