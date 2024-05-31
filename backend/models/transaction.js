const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('.');

class Transaction extends Model { }

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    postingType: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_recorded: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },

  {
    sequelize,
    timestamps: true,
    paranoid: true
  }
);

module.exports = Transaction;