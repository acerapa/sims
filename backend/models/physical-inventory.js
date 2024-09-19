const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const { PhysicalInventoryStatus } = require("shared/enums/purchase-order");

class PhysicalInventory extends Model {}

PhysicalInventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date intended for the Physical Inventory",
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(PhysicalInventoryStatus),
      defaultValue: PhysicalInventoryStatus.DRAFT,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = PhysicalInventory;
