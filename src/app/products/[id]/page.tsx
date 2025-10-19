// src/app/products/[id]/page.tsx

import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '../../data/products'
import ProductDetailClient from './ProductDetailClient'

// Note: No need for the explicit interface ProductPageProps anymore,
// but if you keep it, make sure it's not trying to satisfy an unnecessary 'PageProps' constraint.
// For now, we'll keep the structure but simplify the typing when calling the function.

export async function generateStaticParams() {
  const allProducts = getAllProducts()
  return allProducts.map((product) => ({
    id: product.id,
  }))
}

// Use inline typing for the component arguments.
// The component is async, and Next.js passes the params object directly.
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}