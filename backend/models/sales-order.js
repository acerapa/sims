const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Customer = require("./customer");
const Address = require("./address");
const { SalesOrderStatus } = require("shared/enums");

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
    date_order: {
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
    status: {
      type: DataTypes.ENUM,
      values: Object.values(SalesOrderStatus),
      defaultValue: SalesOrderStatus.OPEN,
    },
    shipment_address_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Address,
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
