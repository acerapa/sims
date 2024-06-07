const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('.');

class ProductCategory extends Model { }

ProductCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    timestamps: true
  }
)

module.exports = ProductCategory;
