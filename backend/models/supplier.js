const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../models');

class Supplier extends Model { }

Supplier.init(
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
);

module.exports = Supplier;
