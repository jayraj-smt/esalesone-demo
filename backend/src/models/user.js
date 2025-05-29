import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        phone: {
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
      },
      {
        sequelize,
        paranoid: true,
        underscored: true,
      }
    )
  }

  static associate(models) {
    User.hasMany(models.Order, {
      as: 'userOrders',
      foreignKey: 'userId',
    })
  }
}
