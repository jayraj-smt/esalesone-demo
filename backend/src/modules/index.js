import express from 'express'

import orderRoute from './order'
import productRoute from './product'

const router = express.Router()

router.use('/order', orderRoute)
router.use('/product', productRoute)

export default router
