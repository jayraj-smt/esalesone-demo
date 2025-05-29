'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import { CartItem } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItem, setCartItem] = useState<CartItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedCartItem = sessionStorage.getItem('cartItem')
      if (!storedCartItem) {
        router.push('/')
        return
      }

      setCartItem(JSON.parse(storedCartItem))
    } catch (error) {
      console.error('Error retrieving cart item:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  console.log('Cart Item:', cartItem);


  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      </div>
    )
  }

  if (!cartItem) {
    return null // Will redirect to home page from useEffect
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl md:text-3xl font-bold mb-8 text-center'>
        Complete Your Purchase
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <CheckoutForm cartItem={cartItem} />
        </div>
        <div>
          <OrderSummary cartItem={cartItem} />
        </div>
      </div>
    </div>
  )
}
