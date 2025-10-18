"use client"

import React from 'react'
import Header from './components/Header'
import SubHeader from './components/SubHeader'
import ProductSection from './components/ProductSection'
import {
    featuredProducts,
    smartphoneProducts,
    accessoryProducts,
    usedPhoneProducts
} from './data/products'

import styles from './styles/Home.module.css'
import Footer from './components/footer/Footer'

const HomePage: React.FC = () => {
    return (
        <div className={styles.pageContainer}>
            <Header />
            <SubHeader />

            <main>
                <ProductSection
                    title="🔥 Produtos em Oferta"
                    subtitle="Os mais vendidos com os melhores preços"
                    products={featuredProducts}
                    showViewAll
                    maxItems={4}
                    link="/ofertas"
                />

                <div className={styles.whiteSection}>
                    <ProductSection
                        title="📱 Smartphones"
                        subtitle="Encontre o celular ideal para você"
                        products={smartphoneProducts}
                        showViewAll
                        showFilters
                        maxItems={6}
                        link="/pages/smartphones"
                    />
                </div>

                <div className={styles.whiteSection}>
                    <ProductSection
                        title="🎧 Acessórios"
                        subtitle="Complete sua experiência mobile"
                        products={accessoryProducts}
                        showViewAll
                        showFilters
                        maxItems={6}
                        link="/pages/acessorios"
                    />
                </div>

                <div className={styles.graySection}>
                    <ProductSection
                        title="✨ Celulares Seminovos"
                        subtitle="Grandes marcas com preços que cabem no bolso"
                        products={usedPhoneProducts}
                        showViewAll
                        maxItems={4}
                        link="/pages/seminovos"
                    />
                </div>

                <section className={styles.ctaSection}>
                    <div className={styles.ctaContainer}>
                        <h2 className={styles.ctaTitleStore}>Visite Nossas Lojas Físicas!</h2>

                        <div className={styles.addressList}>
                            <div className={styles.addressItem}>
                                <h3>Loja 1 (Matriz)</h3>
                                <p>R. Melo Franco, 216 - Jardim da Glória</p>
                                <p>Vespasiano - MG, 33206-072</p>
                            </div>

                            <div className={styles.addressItem}>
                                <h3>Loja 2 (Filial)</h3>
                                <p>R. Sete de Setembro, 15 - Vila Esportiva</p>
                                <p>Vespasiano - MG, 33202-400</p>
                            </div>
                        </div>

                        <div className={styles.mapContainer}>
                            <iframe
                                // 🌟 CORREÇÃO APLICADA: Substituído o link inválido
                                // Nota: Substitua este URL (ou o '1' no final) pelo URL real de incorporação do seu Google Maps.
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15000!2d-43.9100!3d-19.7000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQzJzM0LjkiUyA0M8KwNTUnMzcuNSJX!5e0!3m2!1spt-BR!2sbr!4v1678899888888!5m2!1spt-BR!2sbr"
                                loading="lazy"
                                className={styles.mapIframe}
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização da Loja 2 em Vespasiano, MG"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default HomePage