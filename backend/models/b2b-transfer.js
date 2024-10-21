const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Branch = require("../models/branch");
const Address = require("./address");
const { TransferType } = require("shared/enums");

class B2BTransfer extends Model {}

B2BTransfer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(TransferType),
      allowNull: true,
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    ibrr_id: {
      type: DataTypes.INTEGER,
      references: {
        model: B2BTransfer,
        key: "id",
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Branch,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = B2BTransfer;
