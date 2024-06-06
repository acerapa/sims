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
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true
  }
)

module.exports = ProductCategory;
