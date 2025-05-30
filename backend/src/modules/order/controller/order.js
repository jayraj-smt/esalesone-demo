import { v4 as uuidv4 } from 'uuid'
import { sendApprovedEmail, sendFailedEmail } from '../../../utils/sendEmail'

const simulateTransaction = (cvv) => {
  if (cvv === '123') return 'approved'
  if (cvv === '212') return 'declined'
  if (cvv === '312') return 'gateway_error'
  return 'approved'
}

export const createOrder = async (req, res) => {
  try {
    const {
      context: {
        models: { Product, Order, CartItem },
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
        cart,
      },
    } = req

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
      !Array.isArray(cart) ||
      cart.length === 0
    ) {
      return res
        .status(400)
        .json({ error: 'All fields and non-empty cart are required.' })
    }

    let subtotal = 0
    const orderItems = []

    for (const item of cart) {
      const { productId, quantity, variant, imageUrl } = item

      if (!productId || !quantity || !variant || !imageUrl) {
        return res.status(400).json({
          error:
            'Each cart item must include productId, variant, quantity, and imageUrl.',
        })
      }

      const product = await Product.findByPk(productId)
      if (!product) {
        return res.status(404).json({ error: `Product not found` })
      }

      if (product.inventoryCount < quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient inventory for ${product.title}` })
      }

      subtotal += product.price * quantity

      orderItems.push({
        productId,
        variantSelected: variant,
        imageSelected: imageUrl,
        quantity,
        price: product.price,
      })
    }

    const transactionStatus = simulateTransaction(cvv)
    const total = subtotal
    const orderNumber = uuidv4()

    const order = await Order.create({
      orderNumber,
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
      subtotal,
      total,
      transactionStatus,
    })

    for (const item of orderItems) {
      await CartItem.create({
        ...item,
        orderId: order.id,
      })

      const product = await Product.findByPk(item.productId)
      product.inventoryCount -= item.quantity
      await product.save()
    }

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    })

    if (transactionStatus === 'approved') {
      await sendApprovedEmail(fullOrder)
    } else {
      await sendFailedEmail(fullOrder)
    }

    res.status(201).json({
      message: `Order ${transactionStatus}`,
      fullOrder,
    })
  } catch (error) {
    console.error('Error while creating order:', error)
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message })
  }
}

export const getOrderByOrderNumber = async (req, res) => {
  try {
    const {
      context: {
        models: { Order, Product, CartItem },
      },
      params: { orderNumber },
    } = req

    const order = await Order.findOne({
      where: { orderNumber },
      include: [
        { model: Product, as: 'product' },
        {
          model: CartItem,
          as: 'cartItems',
          include: [{ model: Product, as: 'product' }],
        },
      ],
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
