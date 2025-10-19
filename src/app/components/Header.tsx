'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Search, ShoppingCart, User, Heart, Menu, X,
    Smartphone, SmartphoneCharging, Headphones, BatteryCharging, LogIn, LogOut
} from 'lucide-react'
import styles from '../styles/Header.module.css'

interface CartItem {
    quantity: number;
    price: number;
}

const Header = () => {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [userName, setUserName] = useState('João')
    const [cartItemCount, setCartItemCount] = useState(0)
    const [cartTotal, setCartTotal] = useState('R$ 0,00')
    const [wishlistCount, setWishlistCount] = useState(0)

    useEffect(() => {
        const updateCounters = () => {
            const cartData: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')

            const totalItems = cartData.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

            const totalPrice = cartData
                .reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

            setCartItemCount(totalItems)
            setCartTotal(totalPrice)

            // CORREÇÃO AQUI: Substituímos 'any[]' por 'string[]'
            const favoriteData: string[] = JSON.parse(localStorage.getItem('favoriteProducts') || '[]')
            setWishlistCount(favoriteData.length)
        }

        updateCounters()

        window.addEventListener('cartUpdated', updateCounters)
        window.addEventListener('favoritesUpdated', updateCounters)

        return () => {
            window.removeEventListener('cartUpdated', updateCounters)
            window.removeEventListener('favoritesUpdated', updateCounters)
        }
    }, [])

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])
    const goTo = (path: string) => {
        router.push(path)
        setIsMenuOpen(false)
    }

    const handleDesktopSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) goTo(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }

    const handleMobileSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            goTo(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleLogoClick = () => goTo('/')

    const handleAccountAction = () => {
        if (isLoggedIn) {
            goTo('/pages/account')
        } else {
            goTo('/login')
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUserName('')
        goTo('/')
    }

    const navLinks = [
        { label: 'Smartphones', icon: <Smartphone className={styles.w5H5} />, path: '/pages/smartphones' },
        { label: 'Acessórios', icon: <SmartphoneCharging className={styles.w5H5} />, path: '/pages/acessorios' },
        { label: 'Cases', icon: <Smartphone className={styles.w5H5} />, path: '/pages/cases' },
        { label: 'Fones', icon: <Headphones className={styles.w5H5} />, path: '/pages/fones' },
        { label: 'Carregadores', icon: <BatteryCharging className={styles.w5H5} />, path: '/pages/carregadores' },
        { label: 'Ofertas', path: '/ofertas', highlight: 'red' },
        { label: 'Lançamentos', path: '/lancamentos', highlight: 'purple' },
    ]

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <button className={styles.logoGroup} onClick={handleLogoClick}>
                        <Image
                            src="/images/logo-solucell.png"
                            alt="Logo"
                            width={120}
                            height={32}
                            className={styles.logo}
                        />
                    </button>

                    <form onSubmit={handleDesktopSearch} className={styles.searchDesktopWrapper}>
                        <div className={`${styles.searchInputGroup} ${isSearchFocused ? styles.searchFocused : ''}`}>
                            <input
                                type="text"
                                placeholder="Busque por iPhone, Samsung, capinhas, fones..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <button type="submit" className={styles.searchButton}>Buscar</button>
                        </div>
                    </form>

                    <div className={styles.userActions}>
                        <button
                            className={`${styles.actionItem} ${styles.accountAction} ${styles.hideOnTablet}`}
                            onClick={handleAccountAction}
                        >
                            <User className={styles.w5H5} />
                            <div className={styles.hiddenMdText}>
                                {isLoggedIn ? (
                                    <>
                                        <div className={styles.actionTextSmall}>Olá,</div>
                                        <div className={styles.actionTextMedium}>{userName}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.actionTextSmall}>Minha</div>
                                        <div className={styles.actionTextMedium}>Conta</div>
                                    </>
                                )}
                            </div>
                        </button>

                        <button className={`${styles.actionItem} ${styles.wishlistAction}`} onClick={() => goTo('/pages/wishlist')}>
                            <Heart className={styles.wishlistIcon} />
                            <span className={`${styles.badge} ${styles.badgeRed}`}>{wishlistCount}</span>
                        </button>

                        <button className={`${styles.actionItem} ${styles.cartAction}`} onClick={() => goTo('/pages/cart')}>
                            <div className={styles.cartButton}>
                                <ShoppingCart className={styles.w5H5} />
                                <div className={styles.hiddenSmText}>
                                    <div className={styles.actionTextSmall}>Carrinho</div>
                                    <div className={styles.actionTextBold}>{cartTotal}</div>
                                </div>
                                <span className={`${styles.badge} ${styles.badgeRed}`}>{cartItemCount}</span>
                            </div>
                        </button>

                        <button onClick={toggleMenu} className={styles.menuToggleButton}>
                            {isMenuOpen ? <X className={styles.w6H6} /> : <Menu className={styles.w6H6} />}
                        </button>
                    </div>
                </div>

                <div className={styles.searchMobileWrapper}>
                    <div className={styles.searchInputGroupMobile}>
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className={styles.searchInputMobile}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleMobileSearch}
                        />
                        <Search
                            className={styles.searchIconMobile}
                            onClick={() => {
                                if (searchQuery.trim()) goTo(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.navBarWrapper}>
                <div className={styles.container}>
                    <nav className={styles.navMenu}>
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                className={
                                    link.highlight === 'red'
                                        ? styles.navLinkHighlightRed
                                        : link.highlight === 'purple'
                                            ? styles.navLinkHighlightPurple
                                            : styles.navLink
                                }
                                onClick={() => goTo(link.path)}
                            >
                                {link.icon && link.icon}
                                <span>{link.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {isMenuOpen && (
                <div className={styles.mobileMenuOverlay}>
                    <nav className={styles.mobileNavContent}>
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                className={`${styles.mobileNavItem} ${link.highlight ? styles.mobileNavHighlight : ''}`}
                                onClick={() => goTo(link.path)}
                            >
                                {link.icon && link.icon} {link.label}
                            </button>
                        ))}
                        <div className={styles.mobileAccountActions}>
                            {isLoggedIn ? (
                                <>
                                    <div className={styles.welcomeMobile}>Olá, {userName}!</div>
                                    <button className={styles.mobileAccountButton} onClick={() => goTo('/pages/account')}>
                                        <User className={styles.w5H5} /> Minha Conta
                                    </button>
                                    <button className={styles.mobileLogoutButton} onClick={handleLogout}>
                                        <LogOut className={styles.w5H5} /> Sair
                                    </button>
                                </>
                            ) : (
                                <button className={styles.mobileAccountButton} onClick={() => goTo('/pages/login')}>
                                    <LogIn className={styles.w5H5} /> Acessar ou Criar Conta
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header