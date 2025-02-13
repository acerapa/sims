const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");
const Product = require("./product");

class ServiceDetails extends Model {}

ServiceDetails.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

module.exports = ServiceDetails;
