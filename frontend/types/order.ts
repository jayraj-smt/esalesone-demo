import { Product } from './product';

export interface CartItem {
  id: number;
  productId: number;
  variantSelected: string;
  imageSelected: string;
  quantity: number;
  price: number;
  orderId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: Omit<Product, 'productImages'>;
}

export interface Order {
  id: number;
  orderNumber: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  subtotal: string;
  total: string;
  transactionStatus: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productId: number | null;
  product: Product | null;
  cartItems: CartItem[];
}