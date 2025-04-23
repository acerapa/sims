const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");
const { DeliveryStatus } = require("shared/enums");
const Address = require("./address");
const SalesOrder = require("./sales-order");

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
    use_customer_address: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Address,
        key: "id",
      },
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrder,
        key: "id",
      },
    },
  },
  {
    sequelize,
  }
);

module.exports = Delivery;
