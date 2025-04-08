const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const ProductSetting = require("./product-setting");
const Product = require("./product");

class ProductDetails extends Model {}

ProductDetails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchase_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sales_description: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    is_manually_set_cost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    product_setting_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductSetting,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
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

module.exports = ProductDetails;
