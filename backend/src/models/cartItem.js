import { Model, DataTypes } from 'sequelize'

export default class CartItem extends Model {
  static init(sequelize) {
    return super.init(
      {
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        variantSelected: {
          type: DataTypes.STRING,
        },
        imageSelected: {
          type: DataTypes.STRING,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
    CartItem.belongsTo(models.Order, {
      as: 'order',
      foreignKey: 'orderId',
    })
    CartItem.belongsTo(models.Product, {
      as: 'product',
      foreignKey: 'productId',
    })
  }
}
