const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("./index");
const { NotificationStatus, NotificationType } = require("shared/enums");

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(NotificationStatus),
      defaultValue: NotificationStatus.UNREAD,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(NotificationType),
      defaultValue: NotificationType.GENERAL,
    },
    // We should add a user type specific notification here
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Notification;
