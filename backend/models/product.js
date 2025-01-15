const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Account = require("./account");
const ProductSetting = require("./product-setting");
const Item = require("./item");

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchase_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sale_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    item_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    product_setting_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductSetting,
        key: "id",
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Item,
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
