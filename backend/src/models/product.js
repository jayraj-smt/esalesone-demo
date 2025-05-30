import { Model, DataTypes } from 'sequelize'

export default class Product extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.TEXT,
        },
        price: {
          type: DataTypes.FLOAT,
        },
        inventoryCount: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        paranoid: true,
        underscored: true,
      }
    )
  }

  static associate(models) {
    Product.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'productId',
    })
    Product.hasMany(models.ProductImage, {
      as: 'productImages',
      foreignKey: 'productId',
    })
  }
}
