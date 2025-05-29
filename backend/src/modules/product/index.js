import express from 'express'
import { getProducts } from './controller/product'

const app = express()

const router = express.Router()
app.use(express.json())

router.get('/', getProducts)

export default router
