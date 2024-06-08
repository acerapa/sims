const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize, Sequelize } = require('../models');

module.exports = {
	migrator: async () => {
		const umzug = new Umzug({
			storage: new SequelizeStorage({sequelize}),

			migrations: {
				params: [
					sequelize.getQueryInterface(),
					Sequelize
				],
				path: path.join(__dirname, "./migrations")
			}
		});

		return await umzug.up();
	}
}