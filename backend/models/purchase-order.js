const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Supplier = require("./supplier");

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
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    amount: {
      type: DataTypes.FLOAT,
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
      values: ["term", "cod"],
      allowNull: true,
      defaultValue: "cod",
    },
    term_start: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = PurchaseOrder;
