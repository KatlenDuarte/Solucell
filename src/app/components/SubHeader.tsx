"use client";

import React from "react";
import {
    Zap,
    Shield,
    CreditCard,
    Truck,
    Star,
    Percent,
    Gift,
    Clock,
} from "lucide-react";
import styles from "../styles/SubHeader.module.css";
import Link from "next/link"; // ✅ para rotas internas do Next.js

interface Benefit {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface Category {
    name: string;
    image: string;
    discount: string;
    link: string;
}

const SubHeader: React.FC = () => {
    const benefits: Benefit[] = [
        {
            icon: <Truck className="w-5 h-5" />,
            title: "Frete Grátis",
            description: "Acima de R$ 199",
        },
        {
            icon: <CreditCard className="w-5 h-5" />,
            title: "12x Sem Juros",
            description: "No cartão de crédito",
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Compra Segura",
            description: "Temos lojas físicas",
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Entrega Rápida",
            description: "Receba em poucas horas",
        },
    ];

    const categories: Category[] = [
        {
            name: "Smartphones",
            image: "images/smartphones.webp",
            discount: "Até 15% OFF",
            link: "/pages/smartphones",
        },
        {
            name: "Semi Novos",
            image: "images/semi-novos.jpg",
            discount: "Até 20% OFF",
            link: "/pages/seminovos",
        },
        {
            name: "Fones Bluetooth",
            image: "images/fone-semfio.jpg",
            discount: "Até 30% OFF",
            link: "/pages/fones",
        },
        {
            name: "Capinhas",
            image: "/images/case.webp",
            discount: "A partir de R$ 19",
            link: "/pages/cases",
        },
    ];

    return (
        <div className={styles["subheader-container"]}>
            {/* Barra de Benefícios */}
            <div className={styles["benefits-bar"]}>
                <div className={styles["sub-container"]}>
                    <div className={styles["benefits-grid"]}>
                        {benefits.map((benefit, index) => (
                            <div key={index} className={`${styles["benefit-item"]} group`}>
                                <div className={styles["benefit-icon-wrapper"]}>
                                    <div className={styles["text-blue-600"]}>{benefit.icon}</div>
                                </div>
                                <div>
                                    <div className={styles["benefit-title"]}>{benefit.title}</div>
                                    <div className={styles["benefit-description"]}>
                                        {benefit.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seção principal com banner */}
            <div className={styles["sub-container"]}>
                <div className="py-8">
                    {/* Banner Hero */}
                    <div className={styles["hero-banner"]}>
                        <div className={styles["hero-content"]}>
                            <div className={styles["hero-flex"]}>
                                <div className={styles["hero-text-block"]}>
                                    <div className={styles["tag-group"]}>
                                        <Percent className="w-6 h-6" />
                                        <span className={styles["promo-tag"]}>INAUGURAÇÃO</span>
                                    </div>
                                    <h2 className={styles["hero-title"]}>
                                        Nossa Loja Online Chegou!
                                    </h2>
                                    <p className={styles["hero-subtitle"]}>
                                        Aproveite descontos de até 40% em smartphones e acessórios
                                        selecionados
                                    </p>
                                    <div className={styles["hero-actions"]}>
                                        <button className={styles["hero-button"]}>
                                            Confira Agora
                                        </button>
                                        <div className={styles["countdown-timer"]}>
                                            <Clock className="w-4 h-4" />
                                            <span>Promoção válida até: 2 dias restantes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles["discount-box"]}>
                                    <div className={styles["discount-box-percent"]}>40%</div>
                                    <div className={styles["discount-box-text"]}>de desconto</div>
                                    <div className={styles["star-rating"]}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${styles["star-icon"]}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["hero-decoration-1"]}></div>
                        <div className={styles["hero-decoration-2"]}></div>
                    </div>

                    {/* Grelha de Categorias com links */}
                    <div>
                        <h3 className={styles["section-title"]}>Categorias em Destaque</h3>
                        <div className={styles["categories-grid"]}>
                            {categories.map((category, index) => (
                                <Link
                                    key={index}
                                    href={category.link}
                                    className={`${styles["category-card"]} group`}
                                >
                                    <div className={styles["category-image-wrapper"]}>
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className={styles["category-image"]}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://placehold.co/400x400/CCCCCC/333333?text=Imagem+Indisponível";
                                            }}
                                        />
                                    </div>
                                    <div className={styles["category-info"]}>
                                        <h4 className={styles["category-name"]}>{category.name}</h4>
                                        <div className={styles["category-discount"]}>
                                            {category.discount}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubHeader;
