const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('../models');

module.exports = {
	migrator: async () => {
		const umzug = new Umzug({
			migrations: {glob: 'migrations/*.js'},
			context: sequelize.getQueryInterface(),
			storage: new SequelizeStorage({sequelize}),
			logger: console,
		});

		return await umzug.up();
	}
}