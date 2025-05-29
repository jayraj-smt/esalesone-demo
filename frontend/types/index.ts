interface ProductImage {
  id: number
  imageUrl: string
  variant: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  inventoryCount: number
  productImages: ProductImage[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface Order {
  id: number
  orderNumber: string
  productId: number
  name: string
  email: string
  phoneNumber: string
  address: string
  city: string
  state: string
  zipCode: string
  cardNumber: string
  expiryDate: string
  cvv: string
  variantSelected: string | null
  quantity: number
  subtotal: string
  total: string
  transactionStatus: 'approved' | 'declined' | 'gateway_error'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  product?: Product
  imageSelected: string
}

export interface CartItem {
  productId: number
  variant: string
  quantity: number
  product: Product
  productImage: string
}
