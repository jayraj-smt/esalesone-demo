import Image from 'next/image';
import Link from 'next/link';
import { Order } from '@/types';
import { formatCurrency, maskCardNumber } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ThankYouContentProps {
  order: Order;
}

export default function ThankYouContent({ order }: ThankYouContentProps) {
  const { transactionStatus, product } = order;

  const getStatusContent = () => {
    switch (transactionStatus) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: 'Payment Approved',
          message: 'Your order has been successfully processed. Thank you for your purchase!',
          buttonText: 'Continue Shopping'
        };
      case 'declined':
        return {
          icon: <XCircle className="h-12 w-12 text-destructive" />,
          title: 'Payment Declined',
          message: 'Unfortunately, your payment was declined. Please try again with a different payment method.',
          buttonText: 'Try Again'
        };
      case 'gateway_error':
        return {
          icon: <AlertCircle className="h-12 w-12 text-amber-500" />,
          title: 'Payment Gateway Error',
          message: 'We encountered an issue processing your payment. This could be a temporary problem. Please try again later.',
          buttonText: 'Try Again'
        };
      default:
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: 'Order Received',
          message: 'We\'ve received your order and will process it shortly.',
          buttonText: 'Continue Shopping'
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center">
          {statusContent.icon}
          <span className="ml-2">{statusContent.title}</span>
        </h1>
        <p className="text-muted-foreground mt-2">{statusContent.message}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order #{order.orderNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {product && (
                  <div className="relative h-24 w-24 overflow-hidden rounded-md flex-shrink-0">
                    <Image
                      src={order.imageSelected}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">{product?.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    Variant: {order.variantSelected || 'Default'}
                  </p>
                  <p className="text-muted-foreground text-sm">Qty: {order.quantity}</p>
                  <p className="font-medium mt-1">{formatCurrency(parseFloat(order.subtotal))}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p>{formatCurrency(parseFloat(order.subtotal))}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-muted-foreground">Shipping</p>
                  <p>Free</p>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>{formatCurrency(parseFloat(order.total))}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <p className="text-sm">{order.name}</p>
                <p className="text-sm">{order.email}</p>
                <p className="text-sm">{order.phoneNumber}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm">{order.address}</p>
                <p className="text-sm">{order.city}, {order.state} {order.zipCode}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-sm">Card: **** **** **** {order.cardNumber.slice(-4)}</p>
                <p className="text-sm">Expiry: {order.expiryDate}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Date</h3>
                <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm">{new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-4">
          <Link href="/">
            <Button size="lg">
              <Home className="mr-2 h-4 w-4" />
              {statusContent.buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
