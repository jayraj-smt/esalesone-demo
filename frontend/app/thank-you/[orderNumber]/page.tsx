import { getOrderByNumber, getOrders, getProduct, getProducts } from '@/lib/api'
import { notFound } from 'next/navigation'
import ThankYouContent from '@/components/thank-you/ThankYouContent'

interface ThankYouPageProps {
  params: {
    orderNumber: string
  }
}

export async function generateStaticParams() {
  const { orders } = await getOrders()

  return orders.map((order) => ({
    orderNumber: order?.orderNumber?.toString(),
  }))
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const order = await getOrderByNumber(params.orderNumber)

  if (!order) {
    return notFound()
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <ThankYouContent order={order} />
    </div>
  )
}
