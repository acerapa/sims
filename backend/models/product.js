const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");
const { ItemType } = require("shared");
const Account = require("./account");

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(ItemType),
      allowNull: false,
    },
    income_account: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Account,
        key: "id",
      },
    },
    expense_account: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Account,
        key: "id",
      },
    },
  },
  {
    sequelize,
  }
);

module.exports = Product;
