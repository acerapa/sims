const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");
const { BranchStatus } = require("shared/enums");
const Address = require("./address");

class Branch extends Model {}

Branch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_manager: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      values: Object.values(BranchStatus),
    },
    address_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Address,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Branch;
