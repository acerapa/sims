const User = require('../models/User');
const bcryptJS = require('bcryptjs');

module.exports = {
	login: async (req, res) => {
		const response = {
			message: 'Incorrect Credentials',
			status: 401
		};

		const user = await User.findOne({ where: { username: req.body.username } });

		if (user) {
			if (await bcryptJS.compare(req.body.password, user.password)) {
				response.status = 200;
				response.message = 'Successfully login!';
			}
		}

		res.status(response.status).json(response);
	},

	register: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		}

		const data = req.body;

		if (data.password) {
			data.password = await bcryptJS.hash(data.password, 10);
		}

		try {
			const user = await User.create(data);
			response.message = 'Succesfully Registered!';
			response.status = 200;
			response.data = { user };
		} catch (e) {
			response.message = response.message + ' ' + e.message;
		}

		res.status(response.status).json(response);
	}
}
