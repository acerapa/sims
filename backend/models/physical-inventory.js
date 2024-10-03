const { DataTypes, Model } = require("sequelize");
const User = require("./user");
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
    date_started: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date intended for the Physical Inventory",
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(PhysicalInventoryStatus),
      defaultValue: PhysicalInventoryStatus.DRAFT,
    },
    inventory_incharge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    branch_manager: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    date_ended: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = PhysicalInventory;
