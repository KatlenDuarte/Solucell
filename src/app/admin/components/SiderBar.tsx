'use client'

import { FC } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingCart, BarChart3, Settings, Users, LogOut, Home , ShoppingBag} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/Sidebar.module.css'

const Sidebar: FC = () => {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Produtos', path: '/admin/pages/products' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/admin/pages/orders' },
    { icon: ShoppingBag, label: 'Loja Física', path: '/admin/pages/physical-sales' },
    { icon: BarChart3, label: 'Relatórios', path: '/admin/reports' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ]

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img
          src="/images/logo-solucell.png"
          alt="Logo da Loja Ecommerce"
          className={styles.logoImage}
        />
      </div>

      {/* Menu */}
      <nav className={styles.nav}>
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon
            let isActive = pathname === item.path
            if (item.path !== '/admin') {
              isActive = pathname.startsWith(item.path)
            }


            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={isActive ? styles.active : ''} 
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className={styles.userInfo}>
        <button onClick={signOut}>
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar