const { Model, DataTypes } = require("sequelize");
const User = require("./user");
const { sequelize } = require("./");

class PhysicalInventoryAdjustment extends Model {}

PhysicalInventoryAdjustment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    physical_inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
  }
);

module.exports = PhysicalInventoryAdjustment;
