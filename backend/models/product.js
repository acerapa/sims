const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const ProductCategories = require("./product-category");
const Account = require("./account");

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ["inventory", "non-inventory"],
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchase_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sale_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    item_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCategories,
        key: "id",
      },
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    timestamps: true,
    paranoid: false,
  }
);

module.exports = Product;
