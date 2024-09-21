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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date intended for the Physical Inventory",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    time_start: {
      type: DataTypes.TIME,
      defaultValue: new Date(),
    },
    time_end: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = PhysicalInventory;
