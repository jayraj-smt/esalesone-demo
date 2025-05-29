import Image from 'next/image';
import { CartItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  cartItem: CartItem;
}

export default function OrderSummary({ cartItem }: OrderSummaryProps) {
  const { product, quantity, variant, productImage } = cartItem;
  const subtotal = product.price * quantity;
  const total = subtotal; // No shipping or tax for this demo

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
            <Image
              src={productImage}
              alt={product.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{product.title}</h4>
            <p className="text-muted-foreground text-xs">Variant: {variant}</p>
            <p className="text-muted-foreground text-xs">Qty: {quantity}</p>
            <p className="font-medium">{formatCurrency(product.price)}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>{formatCurrency(subtotal)}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-muted-foreground">Shipping</p>
            <p>Free</p>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>{formatCurrency(total)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
