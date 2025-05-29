import { Model, DataTypes } from 'sequelize'

export default class Order extends Model {
  static init(sequelize) {
    return super.init(
      {
        orderNumber: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.STRING,
        },
        city: {
          type: DataTypes.STRING,
        },
        state: {
          type: DataTypes.STRING,
        },
        zipCode: {
          type: DataTypes.STRING,
        },
        cardNumber: {
          type: DataTypes.STRING,
        },
        expiryDate: {
          type: DataTypes.STRING,
        },
        cvv: {
          type: DataTypes.STRING,
        },
        variantSelected: {
          type: DataTypes.STRING,
        },
        quantity: {
          type: DataTypes.INTEGER,
        },
        subtotal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        transactionStatus: {
          type: DataTypes.ENUM('approved', 'declined', 'gateway_error'),
          allowNull: false,
        },
        imageSelected: {
          type: DataTypes.STRING,
        },
        productId: {
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
    Order.belongsTo(models.Product, {
      as: 'product',
      foreignKey: 'productId',
      targetKey: 'id',
    })
  }
}
