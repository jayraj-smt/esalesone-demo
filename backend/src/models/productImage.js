import { Model, DataTypes } from 'sequelize'

export default class ProductImage extends Model {
  static init(sequelize) {
    return super.init(
      {
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        variant: {
          type: DataTypes.STRING,
          allowNull: false,
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
    ProductImage.belongsTo(models.Product, {
      as: 'product',
      foreignKey: 'productId',
      targetKey: 'id',
    })
  }
}
