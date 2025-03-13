const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");
const Customer = require("./customer");
const User = require("./user");
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
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
    // TODO: to be add
    // invoice_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Invoice,
    //     key: "id",
    //   },
    // },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrder,
        key: "id",
      },
    },
    prepared_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
      },
    },
  },
  {
    sequelize,
  }
);

module.exports = Delivery;
