const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('.');

class User extends Model { }

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 8
      }
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [
        'admin',
        'manager',
        'cashier',
        'inventory'
      ]
    }
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true
  }
);

module.exports = User;
