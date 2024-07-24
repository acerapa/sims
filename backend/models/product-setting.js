const { sequelize, Sequelize } = require("./");
const { DataTypes, Model } = Sequelize;

class ProductSettings extends Model {}

ProductSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = ProductSettings;
