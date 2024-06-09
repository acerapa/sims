const execSync = require('child_process').execSync;

module.exports = {
	migrator: async () => {
			return new Promise((resolve, reject) => {
				try {
					execSync('yarn sequelize db:migrate', { stdio: 'inherit' });
					resolve('OK');
				} catch (e) {
					reject(e);
				}
			});
	}
}