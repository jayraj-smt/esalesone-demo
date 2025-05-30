'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { getProduct } from '@/lib/api'
import { Product, ProductImage } from '@/types/product'
import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductImage | null>(
    null
  )
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { products } = await getProduct()
        const foundProduct = products.find((p) => p.id === parseInt(params.id))

        if (foundProduct) {
          setProduct(foundProduct)
          setSelectedVariant(foundProduct.productImages[0])
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  const handleVariantChange = (variant: ProductImage) => {
    setSelectedVariant(variant)
  }

  const handleQuantityChange = (value: number) => {
    if (product && product.inventoryCount > 0) {
      const newQuantity = Math.max(
        1,
        Math.min(product.inventoryCount, quantity + value)
      )
      setQuantity(newQuantity)
    }
  }

  const handleBuyNow = () => {
    if (product && selectedVariant) {
      if (product.inventoryCount <= 0) {
        toast({
          variant: 'destructive',
          title: 'Out of Stock',
          description: 'This product is currently out of stock.',
        })
        return
      }

      addToCart({
        productId: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        variant: selectedVariant.variant,
        imageUrl: selectedVariant.imageUrl,
        quantity,
      })
      router.push('/checkout')
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Product not found</h1>
        <p className='mb-6'>
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-8'>
        <div className='relative h-[500px] bg-gray-100 rounded-lg overflow-hidden'>
          {selectedVariant && (
            <Image
              src={selectedVariant.imageUrl}
              alt={product.title}
              fill
              className='object-contain'
              sizes='(max-width: 768px) 100vw, 50vw'
              priority
            />
          )}
          {product.inventoryCount <= 0 && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <span className='text-white font-semibold px-4 py-2 bg-red-500 rounded'>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold mb-2'>{product.title}</h1>
          <p className='text-2xl font-semibold mb-4'>
            ₹{product.price.toLocaleString()}
          </p>
          <p className='text-gray-700 mb-6'>{product.description}</p>

          <div className='mb-6'>
            <h3 className='text-sm font-medium mb-2'>Available Colors</h3>
            <div className='flex flex-wrap gap-2'>
              {product.productImages.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant)}
                  className={cn(
                    'border-2 rounded-md p-1 transition-all',
                    selectedVariant?.id === variant.id
                      ? 'border-primary scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className='relative w-16 h-16 rounded overflow-hidden'>
                    <Image
                      src={variant.imageUrl}
                      alt={variant.variant}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <p className='text-xs mt-1'>{variant.variant}</p>
                </button>
              ))}
            </div>
          </div>

          <div className='mb-8'>
            <h3 className='text-sm font-medium mb-2'>Quantity</h3>
            <div className='flex items-center'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || product.inventoryCount <= 0}
              >
                <MinusIcon className='h-4 w-4' />
              </Button>
              <span className='w-12 text-center'>{quantity}</span>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleQuantityChange(1)}
                disabled={
                  quantity >= product.inventoryCount ||
                  product.inventoryCount <= 0
                }
              >
                <PlusIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <Button
            size='lg'
            onClick={handleBuyNow}
            className='w-full md:w-auto'
            disabled={product.inventoryCount <= 0}
          >
            <ShoppingCartIcon className='mr-2 h-5 w-5' />
            {product.inventoryCount <= 0 ? 'Out of Stock' : 'Buy Now'}
          </Button>

          <div className='mt-8 text-sm text-muted-foreground'>
            <p
              className={cn(
                product.inventoryCount <= 0
                  ? 'text-red-500'
                  : product.inventoryCount < 10
                  ? 'text-orange-500'
                  : 'text-green-500'
              )}
            >
              {product.inventoryCount <= 0
                ? 'Out of Stock'
                : product.inventoryCount < 10
                ? `Low Stock: Only ${product.inventoryCount} units left`
                : `In Stock: ${product.inventoryCount} units`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
