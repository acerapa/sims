const User = require('../models/user');
const bcryptJS = require('bcryptjs');
const { UserSchema } = require('../validator/User');

module.exports = {
	all: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 500
		};

		try {
			const users = await User.findAll();

			response.message = 'Successfully Fetched!';
			response.status = 200;
			response.data = { users };
		} catch (e) {
			response.message = response.message + ' => ' + e.message;
			response.error = e;
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
		const { error } = await UserSchema.validate(data);

		if (!error) {
			if (data.password) {
				data.password = await bcryptJS.hash(data.password, 10);
			}

			try {
				const user = await User.create(data);
				response.message = 'Succesfully Registered!';
				response.status = 200;
				response.data = { user };
			} catch (e) {
				response.message = response.message + ' => ' + e.message;
				if (e.name == 'SequelizeUniqueConstraintError') {
					response.message = 'username must be unique!';
				}
			}
		} else {
			response.data = error;
		}


		res.status(response.status).json(response);
	}
}