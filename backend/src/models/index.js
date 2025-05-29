import Sequelize from 'sequelize'
import config from '../../config/config'
// import User from './user'
import Product from './product'
import Order from './order'
import ProductImage from './productImage'

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'postgres',
    port: config.development.port,
    // underscored: true,
    logging: false,
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000,
    // },
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  }
)

const models = {
  // User: User.init(sequelize, Sequelize),
  Product: Product.init(sequelize, Sequelize),
  Order: Order.init(sequelize, Sequelize),
  ProductImage: ProductImage.init(sequelize, Sequelize),
}

try {
  sequelize.authenticate()
  console.log('Connection has been established successfully.......')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

export default models
