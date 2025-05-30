import { Product } from '@/types/product'
import { Order } from '@/types/order'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Get all products
export async function getProduct(): Promise<{
  products: Product[]
  totalItems: number
}> {
  try {
    const response = await fetch(`${API_URL}/product`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { products: data.products, totalItems: data.totalItems }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return { products: [], totalItems: 0 }
  }
}

// Create a new order
export async function createOrder(orderData: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to create order:', error)
    return null
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_URL}/order/${orderNumber}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return null
  }
}
