const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('.');

class Product extends Model { }

const fields = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purchase_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  selling_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  purchase_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  selling_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  item_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantityInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: { // to be discused
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
};

const options = {
  sequelize,
  timestamps: true,
  paranoid: false
};

Product.init(fields, options);

module.exports = Product;
