'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProduct } from '@/lib/api'
import { Product } from '@/types/product'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await getProduct()
        setProducts(products)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product page

    if (product.inventoryCount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Out of Stock',
        description: 'This product is currently out of stock.',
      })
      return
    }

    const defaultVariant = product.productImages[0]

    addToCart({
      productId: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      variant: defaultVariant.variant,
      imageUrl: defaultVariant.imageUrl,
      quantity: 1,
    })

    toast({
      title: 'Added to Cart',
      description: `${product.title} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-xl font-semibold mb-2'>No products found</h2>
        <p className='text-muted-foreground'>
          Check back later for new products.
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <Card className='overflow-hidden h-full transition-all duration-200 hover:shadow-md group'>
            <div className='relative h-64 bg-gray-100'>
              <Image
                src={product.productImages[0].imageUrl}
                alt={product.title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
              {product.inventoryCount <= 0 && (
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                  <span className='text-white font-semibold px-4 py-2 bg-red-500 rounded'>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            <CardContent className='p-4'>
              <h3 className='font-medium truncate'>{product.title}</h3>
              <p className='text-sm text-muted-foreground mb-2 line-clamp-2'>
                {product.description}
              </p>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-bold'>
                  ₹{product.price.toLocaleString()}
                </span>
                <span className='text-xs text-muted-foreground'>
                  {product.productImages.length}{' '}
                  {product.productImages.length === 1 ? 'variant' : 'variants'}
                </span>
              </div>
              <div className='flex flex-col gap-2'>
                <Button
                  variant='outline'
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={product.inventoryCount <= 0}
                  className='hover:bg-black hover:text-white'
                >
                  <ShoppingCart className='mr-2 h-4 w-4' />
                  Add to Cart
                </Button>
                <Button
                  variant='outline'
                  onClick={(e) => {
                    router.push(`/product/${product.id}`)
                  }}
                  disabled={product.inventoryCount <= 0 || isLoading}
                  className='hover:bg-black hover:text-white'
                >
                  <ShoppingBag className='mr-2 h-4 w-4' />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
