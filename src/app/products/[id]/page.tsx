// src/app/products/[id]/page.tsx

import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '../../data/products'
import ProductDetailClient from './ProductDetailClient'

// Rotas estáticas
export async function generateStaticParams() {
  const allProducts = await getAllProducts()
  return allProducts.map((product) => ({
    id: product.id,
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProductPage(props: any) {
  const { params } = props
  const product = await getProductById(params.id)

  if (!product) notFound()

  return <ProductDetailClient product={product} />
}

