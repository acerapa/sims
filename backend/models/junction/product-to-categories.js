const { Model, DataTypes } = require("sequelize");
const Product = require("../product");
const ProductCategory = require("../product-category");
const { sequelize } = require("../");

class ProductToCategories extends Model {}

ProductToCategories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCategory,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = ProductToCategories;
