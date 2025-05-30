const { Model, DataTypes } = require("sequelize");
const Invoice = require("./invoice");
const PaymentMenthod = require("./payment-method");
const { sequelize } = require(".");
const User = require("./user");
const { InvoiceStatus } = require("shared/enums");

class ReceivedPayment extends Model {}

ReceivedPayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remaining_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    amounts_payable: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    invoice_status: {
      type: DataTypes.ENUM,
      values: Object.values(InvoiceStatus),
      allowNull: false,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PaymentMenthod,
        key: "id",
      },
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Invoice,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = ReceivedPayment;
