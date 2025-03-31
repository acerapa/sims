const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");
const { DeliveryStatus } = require("shared/enums");

class Delivery extends Model {}

Delivery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    courier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(DeliveryStatus),
      defaultValue: DeliveryStatus.PENDING,
    },
  },
  {
    sequelize,
  }
);

module.exports = Delivery;
