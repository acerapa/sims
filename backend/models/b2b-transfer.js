const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const Branch = require("../models/branch");
const { TransferType } = require("shared/enums");
const User = require("./user");

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
    str_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    branch_to: {
      type: DataTypes.INTEGER,
      references: {
        model: Branch,
        key: "id",
      },
    },
    branch_from: {
      type: DataTypes.INTEGER,
      references: {
        model: Branch,
        key: "id",
      },
    },
    processed_by: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
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
