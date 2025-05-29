'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.productImages[0].variant || ''
  )
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedImage, setSelectedImage] = useState(
    product?.productImages[0]?.imageUrl
  )

  useEffect(() => {
    try {
      const savedCartItem = sessionStorage?.getItem('cartItem')
      if (savedCartItem) {
        const parsedCartItem = JSON.parse(savedCartItem)
        if (parsedCartItem.productId === product.id) {
          setSelectedVariant(parsedCartItem?.variant)
          setQuantity(parsedCartItem?.quantity)
        }
      }
    } catch (error) {
      console.error('Error loading saved selections:', error)
    }
  }, [product.id])

  const increaseQuantity = () => {
    if (quantity < product.inventoryCount) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleBuyNow = () => {
    const cartItem = {
      productId: product.id,
      variant: selectedVariant,
      quantity,
      product,
      productImage: selectedImage,
    }

    // Store the cart item in session storage
    sessionStorage.setItem('cartItem', JSON.stringify(cartItem))
    router.push('/checkout')
  }

  const handleVariantChange = (variant: string) => {
    setSelectedVariant(variant)
    const matchedImage = product.productImages.find(
      (img) => img.variant === variant
    )
    if (matchedImage) {
      setSelectedImage(matchedImage.imageUrl)
    }
  }

  const handleImageClick = (imageUrl: string, variant: string) => {
    setSelectedImage(imageUrl)
    setSelectedVariant(variant)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* <div className='relative aspect-square overflow-hidden rounded-lg'>
        <Image
          src={selectedImage}
          alt={product.title}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 50vw'
          priority
        />
      </div> */}
      <div className='space-y-4'>
        <div className='relative aspect-square overflow-hidden rounded-lg'>
          <Image
            src={selectedImage}
            alt={product.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
          />
        </div>

        {product.productImages?.length > 1 && (
          <div className='flex space-x-2 overflow-x-auto'>
            {product.productImages.map((img, idx) => (
              // <div
              //   key={img.id}
              //   className='w-20 h-20 relative flex-shrink-0 border rounded cursor-pointer hover:opacity-80'
              //   onClick={() => setSelectedImage(img.imageUrl)}
              // >
              <div
                key={img.id}
                className={`w-20 h-20 relative flex-shrink-0 border rounded cursor-pointer hover:opacity-80 ${
                  selectedImage === img.imageUrl ? 'border-primary' : ''
                }`}
                onClick={() => handleImageClick(img.imageUrl, img.variant)}
              >
                <Image
                  src={img.imageUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className='object-cover rounded'
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Card className='p-6'>
        <h1 className='text-2xl font-bold mb-2'>{product.title}</h1>
        <p className='text-2xl font-semibold text-primary mb-4'>
          {formatCurrency(product.price)}
        </p>

        <div className='space-y-6'>
          <p className='text-muted-foreground'>{product.description}</p>

          {/* <div>
            <Label htmlFor='variant'>Variant</Label>
            <Select value={selectedVariant} onValueChange={setSelectedVariant}>
              <SelectTrigger id='variant' className='w-full mt-1'>
                <SelectValue placeholder='Select variant' />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant} value={variant}>
                    {variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <div className='space-y-2'>
            <Label>Variant</Label>
            <Select value={selectedVariant} onValueChange={handleVariantChange}>
              <SelectTrigger className='max-w-xs'>
                <SelectValue placeholder='Select variant' />
              </SelectTrigger>
              <SelectContent>
                {product.productImages.map((img) => (
                  <SelectItem key={img.variant} value={img.variant}>
                    {img.variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='quantity'>Quantity</Label>
            <div className='flex items-center mt-1'>
              <Button
                variant='outline'
                size='icon'
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className='h-10 w-10'
              >
                <MinusIcon className='h-4 w-4' />
              </Button>
              <div className='w-12 text-center mx-2'>{quantity}</div>
              <Button
                variant='outline'
                size='icon'
                onClick={increaseQuantity}
                disabled={quantity >= product.inventoryCount}
                className='h-10 w-10'
              >
                <PlusIcon className='h-4 w-4' />
              </Button>
              <div className='ml-4 text-sm text-muted-foreground'>
                {product.inventoryCount} available
              </div>
            </div>
          </div>

          <div className='pt-4'>
            <Button className='w-full' size='lg' onClick={handleBuyNow}>
              <ShoppingCart className='mr-2 h-5 w-5' />
              Buy Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
