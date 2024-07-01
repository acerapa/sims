const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");

class ProductSupplier extends Model {}

ProductSupplier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
			allowNull: false
    },
		supplier_id: {
      type: DataTypes.INTEGER,
			allowNull: false
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = ProductSupplier;
