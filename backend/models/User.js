const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../models');

const fields = {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 8
    }
  }
};

const options = {
  sequelize,
  timestamps: true,
  paranoid: true
};

class User extends Model {
  fields = fields;
  options = options;

  static getFields = () => {
    return fields;
  }
}

User.init(fields, options);

module.exports = User;
