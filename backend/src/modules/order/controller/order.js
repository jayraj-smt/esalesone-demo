import { v4 as uuidv4 } from 'uuid'
import { sendApprovedEmail, sendFailedEmail } from '../../../utils/sendEmail'

const simulateTransaction = (cvv) => {
  // Per requirements:
  // Enter 1 → Approved
  // Enter 2 → Declined
  // Enter 3 → Gateway Failure
  // Any CVV 3-digit number, Expiry date future
  console.log('Simulating transaction with CVV:', cvv);

  if (cvv === '123') return 'approved'
  if (cvv === '212') return 'declined'
  if (cvv === '312') return 'gateway_error'
  return 'approved'
}

export const createOrder = async (req, res) => {
  try {
    const {
      context: {
        models: { Product, Order },
      },
      body: {
        name,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        cardNumber,
        expiryDate,
        cvv,
        productId,
        variant,
        quantity,
        imageUrl
      },
    } = req
    console.log('Creating order with data:', req.body)

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !cardNumber ||
      !expiryDate ||
      !cvv ||
      !productId ||
      !variant ||
      !quantity ||
      !imageUrl
    ) {
      return res.status(400).json({ error: 'All fields are required.' })
    }

    const product = await Product.findByPk(productId)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (product?.inventoryCount < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory.' })
    }

    const transactionStatus = simulateTransaction(cvv)
    console.log(`Transaction status: ${transactionStatus}`)

    const subtotal = product?.price * quantity
    const total = subtotal

    const orderNo = uuidv4()
    console.log(`Order number generated: ${orderNo}`)

    const order = await Order.create({
      orderNumber: uuidv4(),
      productId: product?.id,
      name,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      cardNumber,
      expiryDate,
      cvv,
      variantSelected: variant,
      imageSelected: imageUrl,
      quantity,
      subtotal,
      total,
      transactionStatus,
    })

    if (transactionStatus === 'approved') {
      product.inventoryCount -= quantity
      await product.save()
      await sendApprovedEmail(order)
    } else {
      await sendFailedEmail(order)
    }

    // const emailTemplate =
    //   status === 'approved'
    //     ? `<h1>Order Confirmed</h1><p>Order #${order.orderNumber}</p>`
    //     : `<h1>Order Failed</h1><p>Transaction ${status.toUpperCase()}</p>`

    // await sendEmail({
    //   to: email,
    //   subject: `Order ${status}`,
    //   html: emailTemplate,
    // })

    // res.status(200).json({ orderId: order.id, status })
    res.status(201).json({
      message: `Order ${transactionStatus}`,
      order,
    })
  } catch (error) {
    console.error('Error while create order:', error)
    res
      .status(500)
      .json({ error: 'Error while create order', details: error.message })
  }
}

export const getOrderByOrderNumber = async (req, res) => {
  try {
    const {
      context: {
        models: { Order, Product },
      },
      params: { orderNumber },
    } = req

    const order = await Order.findOne({
      where: { orderNumber },
      include: [{ model: Product, as: 'product' }],
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    res.status(200).json(order)
  } catch (error) {
    console.error('Error while fetching order by number:', error)
    res.status(500).json({
      error: 'Error while fetching order by number',
      details: error.message,
    })
  }
}

export const getOrders = async (req, res) => {
  try {
    const {
      context: {
        models: { Order },
      },
    } = req

    const { rows: orders, count: totalItems } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
    })

    res.status(200).json({ orders, totalItems })
  } catch (error) {
    console.error('Error while fetching orders:', error)
    res.status(500).json({
      error: 'Error while fetching orders',
      details: error.message,
    })
  }
}
