// src/app/products/[id]/page.tsx

import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '../../data/products'
import ProductDetailClient from './ProductDetailClient'

// A função generateStaticParams está correta e é necessária para as rotas estáticas
export async function generateStaticParams() {
  const allProducts = getAllProducts()
  return allProducts.map((product) => ({
    id: product.id,
  }))
}

// CORREÇÃO: Tipagem do componente Page feita diretamente e de forma concisa.
// O tipo 'any' garante que a tipagem do componente não entre em conflito
// com a definição interna complexa do Next.js para PageProps em componentes assíncronos.
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}