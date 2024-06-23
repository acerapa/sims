const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('.');

class ProductOrder extends Model { }

ProductOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: true
  }
);

module.exports = ProductOrder;
