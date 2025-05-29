'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/FormError'
import { createOrder } from '@/lib/api'
import {
  validateEmail,
  validatePhoneNumber,
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  getTransactionOutcome,
} from '@/lib/utils'

interface CheckoutFormProps {
  cartItem: CartItem
}

export default function CheckoutForm({ cartItem }: CheckoutFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
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
  })

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Special handling for card number
    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 16) {
        setFormData({
          ...formData,
          [name]: digitsOnly,
        })
      }
      return
    }

    // Special handling for expiry date (MM/YY format)
    if (name === 'expiryDate') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 4) {
        let formattedValue = digitsOnly
        if (digitsOnly.length > 2) {
          formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
        }
        setFormData({
          ...formData,
          [name]: formattedValue,
        })
      }
      return
    }

    // Special handling for CVV
    if (name === 'cvv') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 3) {
        setFormData({
          ...formData,
          [name]: digitsOnly,
        })
      }
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Basic required field validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        } is required`
      }
    })

    // Specific validations
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number'
    }

    if (formData.cardNumber && !validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number'
    }

    if (formData.cvv && !validateCVV(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid 3-digit CVV'
    }

    if (formData.expiryDate && !validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate =
        'Please enter a valid expiry date (MM/YY) in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create order request payload
      const orderData = {
        ...formData,
        productId: cartItem.productId,
        variant: cartItem.variant,
        quantity: cartItem.quantity,
        imageUrl: cartItem.productImage,
      }

      const response = await createOrder(orderData)

      // Redirect to thank you page
      router.push(`/thank-you/${response.order.orderNumber}`)
    } catch (error) {
      console.error('Error submitting order:', error)
      setErrors({
        form: 'An error occurred while processing your order. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {errors.form && <FormError message={errors.form} />}

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Personal Information</h3>

            <div>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-destructive' : ''}
              />
              <FormError message={errors.name} />
            </div>

            <div>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-destructive' : ''}
              />
              <FormError message={errors.email} />
            </div>

            <div>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='10-digit number'
                className={errors.phoneNumber ? 'border-destructive' : ''}
              />
              <FormError message={errors.phoneNumber} />
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Shipping Address</h3>

            <div>
              <Label htmlFor='address'>Address</Label>
              <Input
                id='address'
                name='address'
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'border-destructive' : ''}
              />
              <FormError message={errors.address} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='city'>City</Label>
                <Input
                  id='city'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'border-destructive' : ''}
                />
                <FormError message={errors.city} />
              </div>

              <div>
                <Label htmlFor='state'>State</Label>
                <Input
                  id='state'
                  name='state'
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'border-destructive' : ''}
                />
                <FormError message={errors.state} />
              </div>
            </div>

            <div>
              <Label htmlFor='zipCode'>Zip Code</Label>
              <Input
                id='zipCode'
                name='zipCode'
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'border-destructive' : ''}
              />
              <FormError message={errors.zipCode} />
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Payment Information</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              For simulation: Use last digit 1 for approval, 2 for decline, 3
              for gateway error
            </p>

            <div>
              <Label htmlFor='cardNumber'>Card Number</Label>
              <Input
                id='cardNumber'
                name='cardNumber'
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder='16-digit number'
                className={errors.cardNumber ? 'border-destructive' : ''}
              />
              <FormError message={errors.cardNumber} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='expiryDate'>Expiry Date</Label>
                <Input
                  id='expiryDate'
                  name='expiryDate'
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder='MM/YY'
                  className={errors.expiryDate ? 'border-destructive' : ''}
                />
                <FormError message={errors.expiryDate} />
              </div>

              <div>
                <Label htmlFor='cvv'>CVV</Label>
                <Input
                  id='cvv'
                  name='cvv'
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder='3-digit code'
                  className={errors.cvv ? 'border-destructive' : ''}
                />
                <FormError message={errors.cvv} />
              </div>
            </div>
          </div>

          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className='animate-spin mr-2'>⊚</span>
                Processing...
              </>
            ) : (
              'Complete Order'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
