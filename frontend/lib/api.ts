import { Product, Order } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProducts(): Promise<{
  products: Product[]
  totalItems: number
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/product`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], totalItems: 0 }
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const { products } = await getProducts()
    return products.find((product) => product.id === id) || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function createOrder(
  orderData: any
): Promise<{ message: string; order: Order }> {
  try {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    return response.json()
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getOrders(): Promise<{
  orders: Order[]
  totalItems: number
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/order`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch order')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching order:', error)
    return { orders: [], totalItems: 0 }
  }
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/order/${orderNumber}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch order')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}
