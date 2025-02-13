const { DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");
const { UserType } = require("shared");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_started: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_ended: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 8,
      },
    },
    position: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(UserType),
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = User;
