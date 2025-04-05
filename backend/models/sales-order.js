const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Customer = require("./customer");
const User = require("./user");
const PaymentMethod = require("./payment-method");

const { SalesOrderStatus, SalesOrderType } = require("shared/enums");

class SalesOrder extends Model {}

SalesOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(SalesOrderType),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(SalesOrderStatus),
      defaultValue: SalesOrderStatus.OPEN,
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PaymentMethod,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      comment: "Sales Person",
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Customer,
        key: "id",
      },
    },
    has_delivery: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = SalesOrder;
