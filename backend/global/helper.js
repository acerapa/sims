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
	},

	responseFormatter: (req, res, next) => {
		res.sendResponse = (data, message='Success', status=200) => {
			res.status(status).json({
				message,
				status,
				data
			});
		}

		res.sendError = (data, message="Something went wrong!", status=400) => {
			res.status(status).json({
				message,
				status,
				data
			});
		}

		next();
	}
}