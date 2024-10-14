const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");

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
