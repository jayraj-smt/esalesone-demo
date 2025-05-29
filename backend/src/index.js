import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import config from '../config/config'
import routes from './modules'
import models from './models'
import { createOrder } from './modules/order/controller/order'

require('dotenv').config()

const corsOptions = {
  credentials: true,
  origin: true,
}

const app = express()
app.use(cors(corsOptions))

app.use(express.json())
app.use(bodyParser.json({ limit: '1000mb' }))
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }))

app.use((req, res, next) => {
  req.context = {
    models,
  }
  next()
})

app.use('/api', routes)

app.post('/', createOrder)

models.sequelize
  .sync()
  .then(async () => {
    app.listen(config.server.port, () => {
      console.log(
        `🚀 Server ready at http://${config.server.host}:${config.server.port}`
      )
    })
    return true
  })
  .catch((error) => console.log(error))
