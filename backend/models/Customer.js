const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('.');

class Customer extends Model { }

Customer.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		middle_name: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		sequelize,
		paranoid: true,
		timestamps: true
	}
);

module.exports = Customer;
