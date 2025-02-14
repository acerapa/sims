const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const { TransferType } = require("shared");
const Branch = require("./branch");
const User = require("./user");
const Supplier = require("./supplier");
const { StockTransferStatus } = require("shared/enums");

class StockTransfer extends Model {}

StockTransfer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(TransferType),
      defaultValue: TransferType.STR,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    when: {
      type: DataTypes.DATE,
    },
    str_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(StockTransferStatus),
      defaultValue: StockTransferStatus.OPEN,
    },
    po_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    branch_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Branch,
        key: "id",
      },
    },
    branch_from: {
      type: DataTypes.INTEGER,
      references: {
        model: Branch,
        allowNull: true,
        key: "id",
      },
    },
    processed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Supplier,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = StockTransfer;
