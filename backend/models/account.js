const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('.');

class Account extends Model {}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    paranoid: true,
    timestamps: true
  }
);

module.exports = Account;
