const User = require('../models/User');
const bcryptJS = require('bcryptjs');
const { UserSchema, UserSchemaUpdate } = require('../validator/User');

module.exports = {
	all: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 500
		};

		try {
			const users = await User.findAll({
				attributes: {
					exclude: [
						'password'
					]
				},
				order: [
					['createdAt', 'DESC']
				]
			});

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
		const { error } = UserSchema.validate(data);

		if (!error) {
			if (data.password) {
				data.password = await bcryptJS.hash(data.password, 10);
			}

			try {
				await User.create(data);
				response.message = 'Succesfully Registered!';
				response.status = 200;
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
	},

	update: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		}

		const data = {};
		Object.keys(req.body).forEach(key => {
			if (key != 'id') {
				data[key] = req.body[key];
			}
		});

		const { error } = UserSchemaUpdate.validate(data);

		if (!error) {
			try {
				await User.update(data, { where: { id: req.body.id } });
				response.message = 'Successfully updated!';
				response.status = 200;
			} catch (e) {
				response.message += e.message;
			}
		} else {
			response.data = error;
		}

		res.status(response.status).json(response);
	},

	delete: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		};

		try {
			const user = await User.findByPk(req.body.user_id);
			if (user !== null) {
				await user.destroy();
				response.message = 'Successfully deleted!';
				response.status = 200;
			} else {
				response.message = 'User not found!';
				response.status = 404;
			}
		} catch (e) {
			response.message += e.message;
		}

		res.status(response.status).json(response);
	}
}