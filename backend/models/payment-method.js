const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("./");

class PaymentMethod extends Model {}

PaymentMethod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

module.exports = PaymentMethod;
