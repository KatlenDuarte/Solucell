import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '../../data/products'
import ProductDetailClient from './ProductDetailClient'

interface ProductPageProps {
  params: {
    id: string 
  }
}

export async function generateStaticParams() {
  const allProducts = getAllProducts()
  return allProducts.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}