export interface ProductImage {
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
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  productImages: ProductImage[]
}
