'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Truck,
    CreditCard,
    Smartphone,
    Tablet,
    Headphones,
    Watch,
    Star,
    Search,
    ShoppingCart,
    Heart,
    Zap,
    Gift,
    Menu
} from 'lucide-react';

// NOTE: Esta importação não pode ser resolvida porque este ambiente exige que todo o código 
// (JS/TSX e CSS) esteja em um único arquivo. 
// Usamos classes de utilidade Tailwind CSS no JSX como alternativa.
import styles from '../styles/CardsProducts.module.css'; 

// === TIPAGENS ===

interface Product {
    id: number;
    name: string;
    price: string;
    originalPrice: string;
    image: string;
    rating: number;
    discount: string;
}

interface Category {
    name: string;
    icon: React.ElementType;
    count: string;
    color: 'gradBlue' | 'gradPurple' | 'gradGreen' | 'gradRed';
}

interface Benefit {
    icon: React.ElementType;
    title: string;
    description: string;
}

interface ProductSectionProps {
    title: string;
    subtitle: string;
    products: Product[];
    showViewAll: boolean;
    showFilters?: boolean;
}

// === MOCK DATA ===

const getInstallment = (priceString: string) => {
    const numericPrice = parseFloat(priceString.replace('R$', '').replace('.', '').replace(',', '.'))
    const installmentValue = numericPrice / 12
    return `12x de ${installmentValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    })} sem juros`
}

const mockProducts: Product[] = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 'R$ 8.999,00', originalPrice: 'R$ 9.999,00', image: 'https://placehold.co/400x400/93c5fd/1e40af?text=iPhone+15', rating: 4.9, discount: '10%' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 'R$ 7.499,00', originalPrice: 'R$ 8.299,00', image: 'https://placehold.co/400x400/a78bfa/5b21b6?text=S24+Ultra', rating: 4.8, discount: '15%' },
    { id: 3, name: 'MacBook Air M2', price: 'R$ 12.999,00', originalPrice: 'R$ 14.999,00', image: 'https://placehold.co/400x400/e5e7eb/4b5563?text=MacBook', rating: 4.9, discount: '13%' },
    { id: 4, name: 'iPad Pro 12.9"', price: 'R$ 9.999,00', originalPrice: 'R$ 11.499,00', image: 'https://placehold.co/400x400/6ee7b7/047857?text=iPad+Pro', rating: 4.7, discount: '13%' }
];

const featuredProducts = mockProducts;
const smartphoneProducts = mockProducts;
const accessoryProducts = mockProducts;

// Mapeamento de cores para classes ou estilos inline
const colorMap: Record<Category['color'], string> = {
    gradBlue: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    gradPurple: 'bg-gradient-to-br from-purple-500 to-pink-500',
    gradGreen: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    gradRed: 'bg-gradient-to-br from-red-500 to-orange-500',
};

const categories: Category[] = [
    { name: 'Smartphones', icon: Smartphone, count: '250+ produtos', color: 'gradBlue' },
    { name: 'Tablets', icon: Tablet, count: '80+ produtos', color: 'gradPurple' },
    { name: 'Acessórios', icon: Headphones, count: '500+ produtos', color: 'gradGreen' },
    { name: 'Smartwatches', icon: Watch, count: '120+ produtos', color: 'gradRed' }
];

const benefits: Benefit[] = [
    { icon: Truck, title: 'Frete Grátis', description: 'Em compras acima de R$ 299' },
    { icon: CreditCard, title: 'Parcelamento', description: 'Em até 12x sem juros' }
];

// === COMPONENTES AUXILIARES (TSX) ===

const ProductCard: React.FC<{ p: Product, i: number, delayOffset?: number }> = ({ p, i, delayOffset = 0 }) => {
    const fullStars = Math.floor(p.rating);

    // Se CSS Modules estivesse funcionando, usaríamos: className={styles.productCard}
    // Como não está, mantemos as classes Tailwind para que o estilo seja aplicado:
    return (
        <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: (i * 0.1) + delayOffset }}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:scale-[1.03] relative"
        >
            <a href={`/produto/${p.id}`}>
                {/* Image Wrapper */}
                <div className="relative overflow-hidden">
                    <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-44 object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = `https://placehold.co/400x400/ef4444/fff?text=${p.name.substring(0, 10).replace(' ', '+')}`;
                        }}
                    />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        -{p.discount}
                    </span>
                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg text-gray-400 hover:text-red-500 transition duration-300 opacity-0 group-hover:opacity-100 border-none">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-800 mb-1 leading-snug min-h-[3rem] line-clamp-2">{p.name}</h3>
                    
                    <div className="flex items-center text-yellow-500 mb-2">
                        {[...Array(5)].map((_, idx) => (
                            <Star 
                                key={idx} 
                                className={`w-3 h-3 ${idx < fullStars ? 'fill-yellow-500' : 'text-gray-300'}`} 
                            />
                        ))}
                        <span className="text-xs text-gray-500 ml-2 font-medium">{p.rating}</span>
                    </div>

                    <p className="text-sm text-gray-400 line-through mb-0.5">{p.originalPrice}</p>
                    <p className="text-2xl font-extrabold text-blue-600 mb-1">{p.price}</p>

                    <p className="text-xs text-gray-500 mt-1 font-medium">
                        {getInstallment(p.price)}
                    </p>
                </div>
            </a>
        </motion.div>
    );
};

const ProductSection: React.FC<ProductSectionProps> = ({ title, subtitle, products, showViewAll, showFilters = false }) => {
    const [filter, setFilter] = useState('Destaques');

    return (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{title}</h2>
                <p className="text-xl text-gray-500">{subtitle}</p>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="flex justify-center mb-10 gap-3 overflow-x-auto pb-2">
                    {['Destaques', 'Mais Vendidos', 'Novidades', 'Em Promoção'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-full text-base font-semibold transition duration-300 whitespace-nowrap border-none cursor-pointer 
                                ${filter === f 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/50' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                {products.map((p, i) => (
                    <ProductCard key={p.id} p={p} i={i} />
                ))}
            </div>

            {/* View All Button */}
            {showViewAll && (
                <div className="text-center mt-12">
                    <button className="inline-flex items-center bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full font-bold text-lg transition duration-300 shadow-md hover:bg-blue-50 hover:shadow-xl group">
                        Ver Catálogo Completo
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            )}
        </section>
    );
};

const Header: React.FC = () => {
    // Note: Mobile menu state would be implemented here, but is omitted for brevity and single-file focus.
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-xl z-50 h-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                
                {/* Logo */}
                <div className="text-3xl font-extrabold text-blue-600 tracking-tight">MobileShop</div>
                
                {/* Navigation Links (Desktop) */}
                <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
                    {['Home', 'Smartphones', 'Acessórios', 'Ofertas'].map((item) => (
                        <a key={item} href="#" className="py-2 border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600 transition duration-300">
                            {item}
                        </a>
                    ))}
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition duration-300 border-none">
                        <Search className="w-6 h-6" />
                    </button>
                    
                    <button className="p-2 relative text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition duration-300 border-none">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">2</span>
                    </button>
                    
                    <button className="hidden sm:block bg-blue-600 text-white px-5 py-2 rounded-full font-bold transition duration-300 shadow-lg hover:bg-blue-700 border-none cursor-pointer">
                        Login
                    </button>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition duration-300 border-none">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

const SubHeader: React.FC = () => (
    <div className="bg-gray-50 pt-24 pb-16"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-600">
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full text-blue-600">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-0.5">{benefit.title}</h4>
                                <p className="text-sm text-gray-600">{benefit.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 md:p-12 text-white mb-12 shadow-2xl">
                <div className="max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Grande Oferta Mobile</h2>
                    <p className="text-xl md:text-2xl text-blue-200">Aproveite descontos incríveis hoje!</p>
                </div>
            </div>

            {/* Categories Title */}
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8 pt-4">
                Explore Nossas Categorias
            </h3>
            
            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                    const Icon = category.icon;
                    const gradientClass = colorMap[category.color];
                    
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 cursor-pointer transition duration-300 hover:shadow-xl hover:scale-105"
                        >
                            <div className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-white shadow-lg ${gradientClass}`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h4>
                            <p className="text-sm text-gray-500">{category.count}</p>
                        </div>
                    );
                })}
            </div>

        </div>
    </div>
);

const Footer: React.FC = () => (
    <footer className="bg-gray-900 text-white mt-auto pt-10 pb-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-5 mb-8">
                
                {/* Logo Section */}
                <div className="col-span-2 md:col-span-2">
                    <h5 className="font-extrabold text-2xl mb-4 text-blue-400">MobileShop</h5>
                    <p className="text-sm text-gray-400 max-w-xs">Sua loja de confiança para os melhores gadgets e acessórios do mercado.</p>
                </div>
                
                {/* Navigation Links Placeholder */}
                <div className="md:col-span-1">
                    <h5 className="font-bold text-lg mb-4">Navegação</h5>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-blue-400 transition">Sobre Nós</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition">Fale Conosco</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition">Política de Troca</a></li>
                    </ul>
                </div>

                {/* Categories Placeholder */}
                <div className="md:col-span-1">
                    <h5 className="font-bold text-lg mb-4">Categorias</h5>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-blue-400 transition">Smartphones</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition">Acessórios</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition">Ofertas</a></li>
                    </ul>
                </div>
                
                {/* Social Media */}
                <div className="md:col-span-1">
                    <h5 className="font-bold text-lg mb-4">Siga-nos</h5>
                    <div className="flex space-x-4 text-gray-400">
                        <Zap className="w-6 h-6 hover:text-blue-400 cursor-pointer transition" />
                        <Gift className="w-6 h-6 hover:text-blue-400 cursor-pointer transition" />
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} MobileShop. Todos os direitos reservados.
            </div>
        </div>
    </footer>
);


// === COMPONENTE PRINCIPAL (TSX) ===

export default function CardsProducts() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            
            <Header />
            
            <SubHeader />
            
            <main className="flex-grow"> 
                {/* Featured Products */}
                <ProductSection
                    title="🔥 Produtos em Destaque"
                    subtitle="Os mais vendidos com os melhores preços"
                    products={featuredProducts}
                    showViewAll={true}
                />

                {/* Smartphones Section */}
                <div className="bg-white py-16">
                    <ProductSection
                        title="📱 Smartphones"
                        subtitle="Encontre o celular ideal para você"
                        products={smartphoneProducts}
                        showViewAll={true}
                        showFilters={true}
                    />
                </div>

                {/* Accessories Section */}
                <ProductSection
                    title="🎧 Acessórios"
                    subtitle="Complete sua experiência mobile"
                    products={accessoryProducts}
                    showViewAll={true}
                    showFilters={true}
                />

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-6 rounded-2xl shadow-2xl text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                            Não encontrou o que procura?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Temos mais de 10.000 produtos em nosso catálogo completo
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition duration-300 hover:bg-gray-100 hover:scale-105 shadow-xl border-none cursor-pointer">
                            Ver Catálogo Completo
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
