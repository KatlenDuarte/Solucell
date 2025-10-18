'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertTriangle, Plus } from 'lucide-react'
import { lumi } from './lib/lumi'
import Link from 'next/link' 
import styles from './styles/Dashboard.module.css'

interface Product {
  _id: string
  name: string
  price: number
  quantity: number
  inStock: boolean
  category: string
  imageUrl?: string
  createdAt?: string | Date
}

interface DashboardStats {
  totalProducts: number
  inStockProducts: number
  outOfStockProducts: number
  lowStockProducts: number

  totalSalesToday: number
  totalSalesMonth: number
  productsSoldToday: number
  productsSoldMonth: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    totalSalesToday: 0,
    totalSalesMonth: 0,
    productsSoldToday: 0,
    productsSoldMonth: 0,
  })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // --- SIMULAÇÃO DE DADOS DE VENDAS ---
      const salesData = {
        totalSalesToday: 1250.75,
        totalSalesMonth: 35890.00, 
        productsSoldToday: 45,
        productsSoldMonth: 1280,
      }

      // Buscar todos os produtos
      // Fazendo desestruturação segura da lista com um fallback.
      const { list } = await lumi.entities.products.list({
        sort: { createdAt: -1 }
      })

      // Garante que 'typedProducts' é um array, mesmo se a lista for nula/undefined
      const typedProducts: Product[] = (list as unknown as Product[]) || []

      // Cálculo de estatísticas de estoque
      const totalProducts = typedProducts.length
      const inStockProducts = typedProducts.filter(p => p.inStock).length
      const outOfStockProducts = typedProducts.filter(p => !p.inStock).length
      const lowStockProducts = typedProducts.filter(p => p.quantity <= 5).length

      setStats({
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        lowStockProducts,
        ...salesData,
      })

      setRecentProducts(typedProducts.slice(0, 5))
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      // Em caso de erro, define o estado para 0 para garantir que a interface renderize
      setStats({
        totalProducts: 0,
        inStockProducts: 0,
        outOfStockProducts: 0,
        lowStockProducts: 0,
        totalSalesToday: 0,
        totalSalesMonth: 0,
        productsSoldToday: 0,
        productsSoldMonth: 0,
      })
      setRecentProducts([])

    } finally {
      // CORREÇÃO CRUCIAL: Garante que o loading seja desativado 
      // independente do sucesso ou falha da chamada.
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'eletronicos': 'Eletrônicos',
      'roupas': 'Roupas',
      'casa': 'Casa',
      'esportes': 'Esportes',
      'livros': 'Livros',
      'beleza': 'Beleza',
      'outros': 'Outros'
    }
    return categories[category] || category
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral da sua loja ecommerce</p>
      </div>

      <div className={styles.statsGrid}>

        {/* 1. Total de Vendas do Dia */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconBg} ${styles.iconBlue}`}>
              <DollarSign size={24} />
            </div>
            <div className={styles.textGroup}>
              <p className={styles.cardLabel}>Vendas (Dia)</p>
              <p className={styles.cardValue}>{formatPrice(stats.totalSalesToday)}</p>
            </div>
          </div>
        </div>

        {/* 2. Total de Vendas do Mês */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconBg} ${styles.iconPurple}`}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.textGroup}>
              <p className={styles.cardLabel}>Vendas (Mês)</p>
              <p className={styles.cardValue}>{formatPrice(stats.totalSalesMonth)}</p>
            </div>
          </div>
        </div>

        {/* 3. Produtos Vendidos no Dia */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconBg} ${styles.iconGreen}`}>
              <ShoppingCart size={24} />
            </div>
            <div className={styles.textGroup}>
              <p className={styles.cardLabel}>Produtos Vendidos (Dia)</p>
              <p className={styles.cardValue}>{stats.productsSoldToday}</p>
            </div>
          </div>
        </div>

        {/* 4. Produtos Vendidos no Mês */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconBg} ${styles.iconYellow}`}>
              <Package size={24} />
            </div>
            <div className={styles.textGroup}>
              <p className={styles.cardLabel}>Produtos Vendidos (Mês)</p>
              <p className={styles.cardValue}>{stats.productsSoldMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Produtos Recentes */}
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Produtos Recentes</h2>
            <Link href="/products" passHref legacyBehavior>
              <button className={styles.viewAllButton}>
                Ver todos
              </button>
            </Link>
          </div>
          <div className={styles.listBody}>
            {recentProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <Package className={styles.emptyIcon} size={48} />
                <p className={styles.emptyText}>Nenhum produto cadastrado</p>
                <button className={styles.addButton}>
                  <Plus size={16} />
                  <span>Adicionar primeiro produto</span>
                </button>
              </div>
            ) : (
              <div className={styles.productList}>
                {recentProducts.map((product) => (
                  <div key={product._id} className={styles.productItem}>
                    <img
                      src={product.imageUrl || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=100'}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <p className={styles.productName}>{product.name}</p>
                      <p className={styles.productDetails}>
                        {getCategoryLabel(product.category)} • {formatPrice(product.price)}
                      </p>
                    </div>
                    <div className={styles.productMetrics}>
                      <p className={styles.productQuantity}>{product.quantity} un.</p>
                      <span className={`${styles.statusBadge} ${product.inStock
                          ? styles.statusAvailable
                          : styles.statusUnavailable
                        }`}>
                        {product.inStock ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Ações Rápidas</h2>
          </div>
          <div className={styles.listBody}>
            <div className={styles.quickActionsList}>
              {/* Adicionar Produto */}
              <button className={styles.actionButton}>
                <div className={`${styles.actionIconBg} ${styles.iconBlue}`}>
                  <Plus size={20} />
                </div>
                <div className={styles.actionText}>
                  <p className={styles.actionTitle}>Adicionar Produto</p>
                  <p className={styles.actionSubtitle}>Cadastre um novo produto na loja</p>
                </div>
              </button>

              {/* Ver Pedidos */}
              <button className={styles.actionButton}>
                <div className={`${styles.actionIconBg} ${styles.iconGreen}`}>
                  <ShoppingCart size={20} />
                </div>
                <div className={styles.actionText}>
                  <p className={styles.actionTitle}>Ver Pedidos</p>
                  <p className={styles.actionSubtitle}>Gerencie os pedidos dos clientes</p>
                </div>
              </button>

              {/* Clientes */}
              <button className={styles.actionButton}>
                <div className={`${styles.actionIconBg} ${styles.iconPurple}`}>
                  <Users size={20} />
                </div>
                <div className={styles.actionText}>
                  <p className={styles.actionTitle}>Clientes</p>
                  <p className={styles.actionSubtitle}>Visualize dados dos clientes</p>
                </div>
              </button>

              {/* Estoque Baixo */}
              <button className={styles.actionButton}>
                <div className={`${styles.actionIconBg} ${styles.iconYellow}`}>
                  <AlertTriangle size={20} />
                </div>
                <div className={styles.actionText}>
                  <p className={styles.actionTitle}>Estoque Baixo</p>
                  <p className={styles.actionSubtitle}>
                    **{stats.lowStockProducts}** produtos com estoque baixo
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeContent}>
          <div>
            <h3 className={styles.welcomeTitle}>Bem-vindo ao seu Painel Administrativo!</h3>
            <p className={styles.welcomeText}>
              Gerencie sua loja ecommerce de forma eficiente. Adicione produtos, controle estoque e acompanhe vendas.
            </p>
          </div>
          <div className={styles.welcomeIconWrapper}>
            <Package size={64} className={styles.welcomeIcon} />
          </div>

        </div>
      </div>
    </div>
  )
}