const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Address = require("./address");

class Customer extends Model {}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Address,
        key: "id",
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    viber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: true,
    timestamps: true,
  }
);

module.exports = Customer;
