const path = require('path');
const { Umzug } = require('umzug');
const { sequelize, Sequelize } = require('../models');

module.exports = {
	migrator: async () => {
		const umzug = new Umzug({
				storage: 'sequelize',
				storageOptions: { sequelize },
				migrations: {
					// Parameters for the migrations
					params: [
						sequelize.getQueryInterface(), // queryInterface
						Sequelize, // Sequelize
						sequelize, // sequelize instance
					],
					// Path to your migration files
					path: path.join(__dirname, 'migrations'),
					// Pattern to match only JavaScript files
					pattern: /\.js$/,
				},
		});

		return await umzug.up();
	}
}