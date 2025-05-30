'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import LoadingSpinner from '@/components/ui/loading-spinner'

const checkoutFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  state: z.string().min(2, { message: 'State is required.' }),
  zipCode: z
    .string()
    .regex(/^\d{5,6}$/, { message: 'Zip code must be 5-6 digits.' }),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: 'Card number must be 16 digits.' }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Format must be MM/YY.' })
    .refine(
      (val) => {
        const [month, year] = val.split('/')
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
        return expiry > new Date()
      },
      { message: 'Card has expired.' }
    ),
  cvv: z.string().regex(/^\d{3}$/, { message: 'CVV must be 3 digits.' }),
})

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

export default function CheckoutPage() {
  const { cartItems, calculateTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  })

  if (cartItems.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Your cart is empty</h1>
        <p className='mb-6'>
          Add some products to your cart before proceeding to checkout.
        </p>
        <Button onClick={() => router.push('/')}>Continue Shopping</Button>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true)

    try {
      // Process based on CVV for simulation
      const cvv = data.cvv
      let transactionResult

      const orderData = {
        ...data,
        cart: cartItems.map((item) => ({
          productId: item.productId,
          variant: item.variant,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
        })),
      }

      // Simulate transaction outcomes based on CVV
      const response = await createOrder(orderData)

      if (response.fullOrder.transactionStatus === 'approved') {
        router.push(`/order-confirmation/${response.fullOrder.orderNumber}`)
        clearCart()
      } else if (response.fullOrder.transactionStatus === 'declined') {
        toast({
          variant: 'destructive',
          title: 'Transaction Declined',
          description:
            'Your card was declined. Please try a different payment method.',
          position: 'top',
        })
      } else if (response.fullOrder.transactionStatus === 'gateway_error') {
        toast({
          variant: 'destructive',
          title: 'Payment Gateway Error',
          description:
            "We're experiencing technical difficulties. Please try again later.",
        })
      } else {
        router.push(`/order-confirmation/${response.fullOrder.orderNumber}`)
        clearCart()
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        variant: 'destructive',
        title: 'Checkout Failed',
        description:
          'There was an error processing your order. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Checkout</h1>

      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <h2 className='text-xl font-semibold mb-4'>
                  Customer Information
                </h2>

                <div className='grid md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder='John Doe' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='john@example.com'
                            type='email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder='1234567890' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <Input {...field} />
                      <FormControl></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='city'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='state'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='zipCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder='10001' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className='my-4' />

                <h2 className='text-xl font-semibold mb-4'>
                  Payment Information
                </h2>
                <p className='text-xs text-muted-foreground mb-4'>
                  For testing: Use CVV "123" for approved, "212" for declined,
                  "312" for gateway error
                </p>

                <FormField
                  control={form.control}
                  name='cardNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='1234567890123456'
                          maxLength={16}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='expiryDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (MM/YY)</FormLabel>
                        <FormControl>
                          <Input placeholder='09/26' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='cvv'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder='123' maxLength={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size='sm' className='mr-2' />{' '}
                      Processing...
                    </>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className='md:col-span-1'>
          <div className='bg-white p-6 rounded-lg shadow-sm border sticky top-6'>
            <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

            <div className='space-y-4 mb-6'>
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variant}`}
                  className='flex gap-3'
                >
                  <div className='relative w-20 h-20 bg-gray-100 rounded'>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className='object-cover rounded'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium text-sm'>{item.title}</h3>
                    <p className='text-xs text-muted-foreground'>
                      Variant: {item.variant}
                    </p>
                    <div className='flex justify-between mt-1'>
                      <p className='text-sm'>Qty: {item.quantity}</p>
                      <p className='text-sm font-medium'>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className='my-4' />

            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator className='my-2' />
              <div className='flex justify-between font-bold'>
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
