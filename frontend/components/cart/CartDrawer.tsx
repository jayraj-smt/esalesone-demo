'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Trash2,
  MinusCircle,
  PlusCircle,
  ShoppingBag
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any products to your cart yet.
        </p>
        <SheetClose asChild>
          <Button onClick={() => router.push('/')}>Continue Shopping</Button>
        </SheetClose>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4">
        <h2 className="font-semibold text-lg flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Your Cart
        </h2>
        <span className="text-sm text-muted-foreground">
          {cartItems.reduce((total, item) => total + item.quantity, 0)} items
        </span>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto py-4">
        {cartItems.map((item) => (
          <div
            key={`${item.productId}-${item.variant}`}
            className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
          >
            <div className="relative w-20 h-20 bg-gray-100 rounded">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">{item.title}</h3>
                <button
                  onClick={() => removeFromCart(item.productId, item.variant)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Variant: {item.variant}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </button>
                  <span className="mx-2 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{calculateTotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-medium pt-2">
            <span>Total</span>
            <span>₹{calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <SheetClose asChild>
          <Button onClick={handleCheckout} className="w-full">
            Proceed to Checkout
          </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
              Continue Shopping
            </Button>
          </SheetClose>
        </div>
      </div>
    </div>
  );
}
