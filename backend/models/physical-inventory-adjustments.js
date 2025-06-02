const { Model, DataTypes } = require("sequelize");
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
  },
  {
    sequelize,
  }
);

module.exports = PhysicalInventoryAdjustment;
