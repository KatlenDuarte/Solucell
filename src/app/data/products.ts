// ⭐️ NOVA INTERFACE
export interface ProductDetails {
    material?: string;
    color?: string;
    protection?: string;
    // Usado para "Condição/Grau de Recondicionamento" em produtos seminovos
    compatibility?: string; 
}

export interface Product {
    id: string;
    name: string;
    description: string;
    currentPrice: number;
    originalPrice?: number;
    installments: number;
    installmentPrice: number;
    discount?: number;
    image: string;
    rating: number;
    reviews: number;
    category: string;
    brand: string;
    storage: string;
    badge?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    details?: ProductDetails;
}

export const featuredProducts: Product[] = [
    {
        id: "1",
        name: "iPhone 15 Pro Max",
        description: "Smartphone Apple com chip A17 Pro, câmera de 48MP e tela Super Retina XDR",
        currentPrice: 8999.99,
        originalPrice: 10999.99,
        installments: 12,
        installmentPrice: 749.99,
        discount: 18,
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        rating: 5,
        reviews: 127,
        category: "Smartphone",
        brand: "Apple",
        storage: "512GB",
        badge: "LANÇAMENTO",
        isNew: true,
        isBestSeller: true,
    },
    {
        id: "2",
        name: "Samsung Galaxy S24 Ultra",
        description: "Smartphone Samsung com S Pen, câmera de 200MP e tela Dynamic AMOLED 2X",
        currentPrice: 7299.99,
        originalPrice: 8999.99,
        installments: 12,
        installmentPrice: 608.33,
        discount: 19,
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
        rating: 5,
        reviews: 89,
        category: "Smartphone",
        brand: "Samsung",
        storage: "256GB",
        isBestSeller: true,
    },
    {
        id: "3",
        name: "AirPods Pro 2ª Geração",
        description: "Fones de ouvido Apple com cancelamento ativo de ruído e áudio espacial",
        currentPrice: 1899.99,
        originalPrice: 2299.99,
        installments: 10,
        installmentPrice: 189.99,
        discount: 17,
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        rating: 5,
        reviews: 203,
        category: "Fones",
        brand: "Apple",
        storage: "N/A",
        badge: "OFERTA",
        isBestSeller: true,
    },
];

export const smartphoneProducts: Product[] = [
    {
        id: "5",
        name: "iPhone 14 Pro",
        description: "Smartphone Apple com chip A16 Bionic, Dynamic Island e câmera Pro",
        currentPrice: 6999.99,
        originalPrice: 8499.99,
        installments: 12,
        installmentPrice: 583.33,
        discount: 18,
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
        rating: 5,
        reviews: 245,
        category: "Smartphone",
        brand: "Apple",
        storage: "128GB",
        isBestSeller: true,
    },
    {
        id: "6",
        name: "Samsung Galaxy S23",
        description: "Smartphone Samsung com processador Snapdragon 8 Gen 2 e câmera de 50MP",
        currentPrice: 3999.99,
        originalPrice: 4999.99,
        installments: 12,
        installmentPrice: 333.33,
        discount: 20,
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
        rating: 4,
        reviews: 178,
        category: "Smartphone",
        brand: "Samsung",
        storage: "256GB",
    },
    {
        id: "7",
        name: "iPhone 13",
        description: "Smartphone Apple com chip A15 Bionic, sistema de câmera dupla avançado",
        currentPrice: 4299.99,
        originalPrice: 5399.99,
        installments: 12,
        installmentPrice: 358.33,
        discount: 20,
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
        rating: 5,
        reviews: 312,
        category: "Smartphone",
        brand: "Apple",
        storage: "64GB",
    },
    {
        id: "8",
        name: "Xiaomi 13 Pro",
        description: "Smartphone Xiaomi com câmera Leica, carregamento rápido de 120W",
        currentPrice: 2799.99,
        originalPrice: 3499.99,
        installments: 10,
        installmentPrice: 279.99,
        discount: 20,
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
        rating: 4,
        reviews: 134,
        category: "Smartphone",
        brand: "Xiaomi",
        storage: "512GB",
        badge: "OFERTA",
    },
    {
        id: "9",
        name: "OnePlus 11",
        description: "Smartphone OnePlus com Snapdragon 8 Gen 2 e carregamento SuperVOOC",
        currentPrice: 3299.99,
        originalPrice: 3999.99,
        installments: 12,
        installmentPrice: 274.99,
        discount: 18,
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
        rating: 4,
        reviews: 87,
        category: "Smartphone",
        brand: "OnePlus",
        storage: "256GB",
    },
    {
        id: "10",
        name: "Google Pixel 8",
        description: "Smartphone Google com chip Tensor G3 e câmera com IA avançada",
        currentPrice: 3599.99,
        originalPrice: 4299.99,
        installments: 12,
        installmentPrice: 299.99,
        discount: 16,
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
        rating: 4,
        reviews: 92,
        category: "Smartphone",
        brand: "Google",
        storage: "128GB",
        isNew: true,
    },
];

export const accessoryProducts: Product[] = [
    {
        id: "11",
        name: "Carregador Sem Fio MagSafe",
        description: "Carregador sem fio Apple MagSafe com alinhamento magnético perfeito",
        currentPrice: 449.99,
        originalPrice: 549.99,
        installments: 6,
        installmentPrice: 74.99,
        discount: 18,
        image: "https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg",
        rating: 5,
        reviews: 167,
        category: "Carregadores",
        brand: "Apple",
        storage: "N/A",
    },
    {
        id: "12",
        name: "Fone JBL Tune 760NC",
        description: "Fone de ouvido JBL com cancelamento de ruído ativo e 50h de bateria",
        currentPrice: 399.99,
        originalPrice: 599.99,
        installments: 8,
        installmentPrice: 49.99,
        discount: 33,
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        rating: 4,
        reviews: 234,
        category: "Fones",
        brand: "JBL",
        storage: "N/A",
        badge: "SUPER OFERTA",
    },
    {
        id: "4",
        name: "Capinha MagSafe iPhone 15",
        description: "Capinha oficial Apple com tecnologia MagSafe e proteção premium",
        currentPrice: 299.99,
        originalPrice: 399.99,
        installments: 6,
        installmentPrice: 49.99,
        discount: 25,
        image: "https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg",
        rating: 4,
        reviews: 156,
        category: "Capinhas",
        brand: "Apple",
        storage: "N/A",
        badge: "MAIS VENDIDO",
        details: { 
            material: 'Silicone',
            color: 'Preto',
            protection: 'Básica',
            compatibility: 'iPhone 15, iPhone 15 Pro, iPhone 14, iPhone 13', 
        }
    },
    {
        id: "13",
        name: "Capinha Spigen Ultra Hybrid",
        description: "Capinha transparente com proteção militar e bordas reforçadas",
        currentPrice: 129.99,
        originalPrice: 179.99,
        installments: 3,
        installmentPrice: 43.33,
        discount: 28,
        image: "https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg",
        rating: 5,
        reviews: 445,
        category: "Capinhas",
        brand: "Spigen",
        storage: "N/A",
        isBestSeller: true,
        details: { 
            material: 'Híbrido',
            color: 'Transparente',
            protection: 'Militar',
            compatibility: 'Samsung S24 Ultra, Samsung S24 Plus, Galaxy S23',
        }
    },
    {
        id: "17",
        name: "Capinha Couro Premium S24",
        description: "Capinha de couro legítimo para Samsung Galaxy S24.",
        currentPrice: 199.99,
        originalPrice: 249.99,
        installments: 4,
        installmentPrice: 49.99,
        discount: 20,
        image: "https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg",
        rating: 5,
        reviews: 72,
        category: "Capinhas",
        brand: "LeatherCo",
        storage: "N/A",
        isNew: true,
        details: {
            material: 'Couro',
            color: 'Vermelho',
            protection: 'Anti-impacto',
            compatibility: 'Samsung S24, Samsung S24 FE',
        }
    },
    {
        id: "14",
        name: "Power Bank Anker 20000mAh",
        description: "Carregador portátil Anker com carregamento rápido PowerIQ 3.0",
        currentPrice: 249.99,
        originalPrice: 329.99,
        installments: 5,
        installmentPrice: 49.99,
        discount: 24,
        image: "https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg",
        rating: 5,
        reviews: 189,
        category: "Carregadores",
        brand: "Anker",
        storage: "N/A",
    },
    {
        id: "15",
        name: "Suporte Veicular Magnético",
        description: "Suporte para carro com ímã ultra forte e rotação 360°",
        currentPrice: 89.99,
        originalPrice: 129.99,
        installments: 3,
        installmentPrice: 29.99,
        discount: 31,
        image: "https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg",
        rating: 4,
        reviews: 278,
        category: "Suportes",
        brand: "Universal",
        storage: "N/A",
    },
    {
        id: "16",
        name: "Película 3D Curva Premium",
        description: "Película de vidro temperado 3D com cobertura total da tela",
        currentPrice: 59.99,
        originalPrice: 99.99,
        installments: 2,
        installmentPrice: 29.99,
        discount: 40,
        image: "https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg",
        rating: 4,
        reviews: 356,
        category: "Películas",
        brand: "Premium",
        storage: "N/A",
        badge: "LIQUIDAÇÃO",
    },
];

// ⭐️ LISTA DE PRODUTOS SEMINOVOS COM RATING E REVIEWS ZERADOS
export const usedPhoneProducts: Product[] = [
    {
        id: "201",
        name: "iPhone 12 128GB Seminovos (Ótimo)",
        description: "iPhone recondicionado, estado de novo, com garantia de 6 meses.",
        currentPrice: 2899.00,
        originalPrice: 4299.00,
        installments: 10,
        installmentPrice: 289.90,
        discount: 33,
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        rating: 0, // Zero Rating
        reviews: 0, // Zero Reviews
        category: "Seminovos",
        brand: "Apple",
        storage: "128GB",
        badge: "GRAU ÓTIMO",
        details: { 
            compatibility: 'Ótimo' // Condição ÓTIMO
        }
    },
    {
        id: "202",
        name: "Samsung Galaxy S22 256GB Seminovos (Bom)",
        description: "Celular Samsung com desempenho top, em bom estado, pequenos sinais de uso.",
        currentPrice: 2199.00,
        originalPrice: 3899.00,
        installments: 10,
        installmentPrice: 219.90,
        discount: 44,
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
        rating: 0, // Zero Rating
        reviews: 0, // Zero Reviews
        category: "Seminovos",
        brand: "Samsung",
        storage: "256GB",
        details: {
            compatibility: 'Bom' // Condição BOM
        }
    },
    {
        id: "203",
        name: "iPhone 11 64GB Seminovos (Regular)",
        description: "Um clássico Apple, funcional e com preço acessível. Sinais visíveis de uso.",
        currentPrice: 1599.00,
        originalPrice: 2599.00,
        installments: 8,
        installmentPrice: 199.87,
        discount: 38,
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
        rating: 0, // Zero Rating
        reviews: 0, // Zero Reviews
        category: "Seminovos",
        brand: "Apple",
        storage: "64GB",
        details: {
            compatibility: 'Regular' // Condição REGULAR
        }
    },
    {
        id: "204",
        name: "Xiaomi 12 Pro 128GB Seminovos (Bom)",
        description: "Flagship Xiaomi em condição Bom, com carregamento rápido. Poucas marcas de uso.",
        currentPrice: 1999.00,
        originalPrice: 3299.00,
        installments: 10,
        installmentPrice: 199.90,
        discount: 39,
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
        rating: 0, // Zero Rating
        reviews: 0, // Zero Reviews
        category: "Seminovos",
        brand: "Xiaomi",
        storage: "128GB",
        details: {
            compatibility: 'Bom' // Condição BOM
        }
    },
];

// ⭐️ LISTA DE TODOS OS PRODUTOS ATUALIZADA
export const allProducts: Product[] = [
    ...featuredProducts,
    ...smartphoneProducts,
    ...accessoryProducts,
    ...usedPhoneProducts, 
];

export const getAllProducts = (): Product[] => {
    return allProducts;
};

export const getProductById = (id: string | string[] | undefined): Product | null => {
    const productId = Array.isArray(id) ? id[0] : id;
    return allProducts.find((p) => p.id === productId) || null;
};