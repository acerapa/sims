// const path = require('path');
// const { Umzug, SequelizeStorage } = require('umzug');
// const { sequelize } = require('../models');

const execSync = require('child_process').execSync;

module.exports = {
	migrator: async () => {
			return new Promise((resolve, reject) => {
				try {
					execSync('node_modules/.bin/sequelize db:migrate', { stdio: 'inherit' });
					resolve('OK');
				} catch (e) {
					reject(e);
				}
			});
	}
}