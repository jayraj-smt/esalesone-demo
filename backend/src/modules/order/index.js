import express from 'express'
import { createOrder, getOrderByOrderNumber, getOrders } from './controller/order'

const app = express()

const router = express.Router()
app.use(express.json())

router.get('/:orderNumber', getOrderByOrderNumber)
router.get('/', getOrders)
router.post('/', createOrder)

export default router
