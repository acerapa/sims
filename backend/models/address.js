const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");

class Address extends Model {}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Address;
