"use client";

import React, { useState } from 'react';
import Link from 'next/link';
// ⭐️ IMPORTAR useRouter para redirecionamento programático
import { useRouter } from 'next/navigation';
import styles from './ProductCard.module.css';

// ----------------------------------------------------------------------
// ⭐️ NOVIDADE: Hook de Autenticação Usando o Next.js Router
const useAuth = () => {
  // 1. Hook de Roteamento Real
  const router = useRouter();

  // 2. Estado de login SIMULADO.
  // ⚠️ EM PROJETO REAL: Substitua esta linha pela sua lógica real de verificação de login (ex: useSession().status === 'authenticated')
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Defina como true para testar o sucesso da ação.

  return { isLoggedIn, router };
}
// ----------------------------------------------------------------------


interface ProductCardProps {
  // ... (mantenha todas as props existentes)
  id: string
  name: string
  description: string
  currentPrice: number
  originalPrice?: number
  installments: number
  installmentPrice: number
  discount?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  isNew?: boolean
  isBestSeller?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  currentPrice,
  originalPrice,
  installments,
  installmentPrice,
  discount,
  image,
  rating,
  reviews,
  badge,
  isNew,
  isBestSeller
}) => {
  // Puxando o estado de autenticação e o router
  const { isLoggedIn, router } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // ----------------------------------------------------------------------
  // ⭐️ FUNÇÃO GUARDIÃ: Redireciona para /login ou executa a ação
  const handleAction = (actionType: 'cart' | 'wishlist', actionCallback: () => void) => {
    if (!isLoggedIn) {
      // Se NÃO estiver logado, redireciona para a página de login
      router.push('/login');
      return;
    }

    // Se estiver logado, executa a ação desejada
    actionCallback();
  };

  const handleAddToCart = () => {
    // Ação de sucesso (só é chamada se isLoggedIn for true)
    console.log(`Produto ${id} adicionado ao carrinho.`);
    alert(`"${name}" adicionado ao carrinho!`);
  };

  const handleToggleWishlist = () => {
    // Ação de sucesso (só é chamada se isLoggedIn for true)
    setIsFavorite(prev => !prev);
    console.log(`Produto ${id} alterado na lista de desejos. Favorito: ${!isFavorite}`);
    alert(`"${name}" ${isFavorite ? 'removido' : 'adicionado'} da lista de desejos.`);
  };
  // ----------------------------------------------------------------------

  // ... (mantenha as funções formatPrice e renderStars)
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.starFilled : styles.starEmpty}`}
      >
        ★
      </span>
    ))
  }

  const productDetailPath = `/products/${id}`;

  return (
    <div className={styles.productCard}>
      {/* Badges (omitido para brevidade) */}
      <div className={styles.badges}>
        {discount && (
          <span className={styles.discountBadge}>
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className={styles.newBadge}>
            NOVO
          </span>
        )}
        {isBestSeller && (
          <span className={styles.bestSellerBadge}>
            MAIS VENDIDO
          </span>
        )}
        {badge && (
          <span className={styles.customBadge}>
            {badge}
          </span>
        )}
      </div>

      {/* Product Image (omitido para brevidade) */}
      <div className={styles.imageContainer}>
        <Link href={productDetailPath} className={styles.productLink}>
          <img
            src={image}
            alt={name}
            className={styles.productImage}
          />

          <div className={styles.overlay}>
            <div className={styles.quickViewBtn}>
              Ver Detalhes
            </div>
          </div>
        </Link>
      </div>

      {/* Product Info (omitido para brevidade) */}
      <div className={styles.productInfo}>
        {/* Rating */}
        <div className={styles.rating}>
          <div className={styles.stars}>
            {renderStars(rating)}
          </div>
          <span className={styles.reviewCount}>({reviews})</span>
        </div>

        {/* Product Name */}
        <Link href={productDetailPath} className={styles.productNameLink}>
          <h3 className={styles.productName}>{name}</h3>
        </Link>


        {/* Description */}
        <p className={styles.productDescription}>{description}</p>

        {/* Pricing */}
        <div className={styles.pricing}>
          {originalPrice && (
            <div className={styles.originalPrice}>
              De: {formatPrice(originalPrice)}
            </div>
          )}
          <div className={styles.currentPrice}>
            {formatPrice(currentPrice)}
          </div>
          <div className={styles.installments}>
            em até {installments}x de {formatPrice(installmentPrice)} sem juros
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* ⭐️ Botão Carrinho: Redireciona se não estiver logado */}
          <button
            className={styles.addToCartBtn}
            onClick={() => handleAction('cart', handleAddToCart)}
          >
            Adicionar ao Carrinho
          </button>
          {/* ⭐️ Botão Lista de Desejos: Redireciona se não estiver logado */}
          <button
            className={`${styles.wishlistBtn} ${isFavorite ? styles.wishlistFilled : ''}`}
            onClick={() => handleAction('wishlist', handleToggleWishlist)}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard