const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");
const Branch = require("./branch");

class BranchMember extends Model {}

BranchMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
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

module.exports = BranchMember;
