const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Supplier = require("./supplier");
const { PurchaseOrderType, PurchaseOrderStatus } = require("shared");
const Address = require("./address");

class PurchaseOrder extends Model {}

PurchaseOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ref_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bill_due: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Supplier,
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(PurchaseOrderType),
      allowNull: true,
      defaultValue: PurchaseOrderType.COD,
    },
    term_start: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(PurchaseOrderStatus),
      defaultValue: PurchaseOrderStatus.OPEN,
    },
    delivery_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_id: {
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

module.exports = PurchaseOrder;
