'use client'
import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  Truck,
  CreditCard,
  ArrowRight,
} from 'lucide-react'
import './carrinho.css'

// Define a estrutura de um item do carrinho
type CartItem = {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  quantity: number
  color?: string
  storage?: string
  inStock: boolean
  maxQuantity: number
}

type ShippingOption = {
  id: string
  name: string
  time: string
  price: number | null
}

const getDistanceByCep = (storeCep: string, userCep: string) => {
  const divisor = 100000
  const distance = Math.abs(
    parseInt(storeCep.replace('-', '')) - parseInt(userCep.replace('-', ''))
  )
  return Math.max(1, distance / divisor)
}

// Função auxiliar para disparar o evento de atualização do carrinho
const dispatchCartUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartUpdated'))
  }
}

export default function Cart() {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [userCep, setUserCep] = useState('')
  
  // Estado inicial como array vazio, será preenchido pelo localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const router = useRouter()
  const storeCep = '33206-072'

  const shippingOptionsBase: ShippingOption[] = [
    { id: 'express', name: 'Entrega em até 24h', time: 'Até 24h', price: null },
    { id: 'pickup-gloria', name: 'Retirar na Loja Jardim da Glória', time: 'Imediato', price: 0 },
    { id: 'pickup-vila', name: 'Retirar na Loja Vila Esportiva', time: 'Imediato', price: 0 },
  ]

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(shippingOptionsBase)
  const [selectedShipping, setSelectedShipping] = useState<string>('express')

  // 1. Efeito para carregar o carrinho do localStorage ao montar o componente
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Erro ao carregar carrinho do localStorage:", e)
        setCartItems([])
      }
    } else {
      // Usar os dados mockados se o localStorage estiver vazio (apenas para teste inicial)
      // Remova este bloco em produção real
      const initialMockItems: CartItem[] = [
        {
          id: 1,
          name: 'Smartphone Premium Galaxy',
          price: 1299.0,
          originalPrice: 1599.0,
          image:
            'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=200',
          quantity: 1,
          color: 'Preto',
          storage: '128GB',
          inStock: true,
          maxQuantity: 5,
        },
        {
          id: 2,
          name: 'Fone Bluetooth Premium',
          price: 49.0,
          originalPrice: 399.0,
          image:
            'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200',
          quantity: 2,
          color: 'Branco',
          inStock: true,
          maxQuantity: 10,
        },
      ]
      setCartItems(initialMockItems);
      localStorage.setItem('cart', JSON.stringify(initialMockItems));
      dispatchCartUpdate();
    }
  }, []) // Executa apenas uma vez na montagem

  // 2. Efeito para sincronizar o carrinho com o localStorage e o Header
  useEffect(() => {
    // Evita salvar no primeiro render se o carrinho estiver vazio (carregando)
    if (cartItems.length > 0 || localStorage.getItem('cart') !== JSON.stringify(cartItems)) {
        localStorage.setItem('cart', JSON.stringify(cartItems))
        dispatchCartUpdate() // Dispara o evento para atualizar o Header
    }
  }, [cartItems]) // Executa sempre que cartItems é alterado


  // Efeito para garantir que a opção de frete selecionada é válida
  useEffect(() => {
    if (!shippingOptions.find(option => option.id === selectedShipping)) {
      setSelectedShipping(shippingOptions[0]?.id ?? 'express')
    }
  }, [shippingOptions, selectedShipping])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )
    )
    // O useEffect [cartItems] fará a sincronização e o dispatch
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
    // O useEffect [cartItems] fará a sincronização e o dispatch
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'desconto10') {
      setAppliedCoupon('DESCONTO10')
      setCouponCode('')
    } else {
      alert('Cupom inválido')
    }
  }

  const calculateShipping = () => {
    if (!userCep || userCep.length < 8) {
      alert('Digite um CEP válido para calcular o frete')
      setShippingOptions(shippingOptionsBase)
      return
    }
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const freeShippingThreshold = 199
    const isFreeShipping = subtotal >= freeShippingThreshold

    const newShippingOptions = shippingOptionsBase.map((option) => {
      if (option.id === 'express') {
        let price: number
        if (isFreeShipping) {
          price = 0
        } else {
          const distance = getDistanceByCep(storeCep, userCep)
          price = distance * 0.7
        }
        return { ...option, price: parseFloat(price.toFixed(2)) }
      }
      return option
    })

    setShippingOptions(newShippingOptions)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon ? subtotal * 0.1 : 0
  const selectedOption = shippingOptions.find((option) => option.id === selectedShipping)
  const shipping = selectedOption?.price ?? null
  const total = subtotal - discount + (shipping ?? 0)

  // Caso o carrinho esteja vazio
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-8">
          <div className="empty-cart">
            <ShoppingCart className="empty-cart-icon" />
            <h2 className="empty-cart-title">Seu carrinho está vazio</h2>
            <p className="empty-cart-text">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/')}>
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Carrinho com itens
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <div className="cart-header">
          <h1 className="cart-title">
            <ShoppingCart className="cart-title-icon" />
            Carrinho de Compras
          </h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no seu carrinho
          </p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-content">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <div className="cart-item-specs">
                      {item.color && <p>Cor: {item.color}</p>}
                      {item.storage && <p>Armazenamento: {item.storage}</p>}
                      <p className={item.inStock ? 'in-stock' : 'out-of-stock'}>
                        {item.inStock ? 'Em estoque' : 'Fora de estoque'}
                      </p>
                    </div>
                    <div className="cart-item-price">
                      <span className="current-price">R$ {item.price.toFixed(2)}</span>
                      {item.originalPrice > item.price && (
                        <span className="original-price">R$ {item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <button onClick={() => removeItem(item.id)} className="remove-item-btn">
                      <Trash2 className="trash-icon" />
                    </button>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        <Minus className="quantity-icon" />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="quantity-btn"
                      >
                        <Plus className="quantity-icon" />
                      </button>
                    </div>
                    <div className="item-total">
                      Total: R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="continue-shopping" onClick={() => router.push('/')}>
              ← Continuar Comprando
            </button>
          </div>

          <div className="order-summary">
            <div className="summary-card">
              <h3 className="summary-title">Resumo do Pedido</h3>

              <div className="coupon-section">
                <label className="coupon-label">Cupom de Desconto</label>
                <div className="coupon-input-group">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Digite o código"
                    className="coupon-input"
                  />
                  <button onClick={applyCoupon} className="coupon-apply-btn">
                    <Tag className="tag-icon" />
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="coupon-applied">
                    <Tag className="tag-icon-small" />
                    Cupom {appliedCoupon} aplicado!
                  </p>
                )}
              </div>

              <div className="shipping-section">
                <label className="shipping-label">
                  <Truck className="truck-icon" />
                  Opções de Entrega
                </label>
                <div className='cep-input-group'>
                  <input
                    type="text"
                    value={userCep}
                    onChange={(e) => setUserCep(e.target.value.replace(/\D/g, ''))}
                    placeholder="Digite seu CEP (apenas números)"
                    className="coupon-input"
                    maxLength={8}
                  />
                  <button onClick={calculateShipping} className="coupon-apply-btn">
                    Calcular Frete
                  </button>
                </div>

                <div className="shipping-options">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className="shipping-option">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="shipping-radio"
                      />
                      <div className="shipping-info">
                        <div className="shipping-name">{option.name}</div>
                        <div className="shipping-time">{option.time}</div>
                      </div>
                      <div className="shipping-price">
                        {option.price === null
                          ? 'Calcular'
                          : option.price === 0
                            ? 'Grátis'
                            : `R$ ${option.price.toFixed(2)}`}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-line">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="price-line discount">
                    <span>Desconto</span>
                    <span>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="price-line">
                  <span>Entrega</span>
                  <span>
                    {shipping === null
                      ? 'A calcular'
                      : shipping === 0
                        ? 'Grátis'
                        : `R$ ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="price-total">
                  <div className="total-line">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="checkout-btn" disabled={shipping === null && selectedShipping === 'express'}>
                <CreditCard className="credit-card-icon" />
                Finalizar Compra
                <ArrowRight className="arrow-icon" />
              </button>

              <div className="security-info">
                <p>🔒 Compra 100% segura e protegida</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}