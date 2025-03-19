const { Model, DataTypes } = require("sequelize");
const Customer = require("./customer");
const SalesOrder = require("./sales-order");
const { sequelize } = require(".");
const User = require("./user");
const { InvoiceStatus } = require("shared/enums");

class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(InvoiceStatus),
      defaultValue: InvoiceStatus.UNPAID,
    },
    payment_method: {
      type: DataTypes.INTEGER,
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
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrder,
        key: "id",
      },
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sub_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

module.exports = Invoice;
