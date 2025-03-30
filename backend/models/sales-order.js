const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Customer = require("./customer");
const Address = require("./address");
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
    date_delivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bill_due: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Customer,
        key: "id",
      },
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
    has_delivery: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    shipment_address_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Address,
        key: "id",
      },
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PaymentMethod,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = SalesOrder;
