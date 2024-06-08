const path = require('path');
const { Umzug } = require('umzug');
const { sequelize, Sequelize } = require('../models');

module.exports = {
	migrator: async () => {
		const umzug = new Umzug({
			storage: "sequelize",
			storageOptions: {
				sequelize: sequelize
			},
			migrations: {
				params: [
					sequelize.getQueryInterface(),
					Sequelize
				],
				path: path.join(__dirname, "./migrations")
			}
		});

		return await umzug.run();
	}
}