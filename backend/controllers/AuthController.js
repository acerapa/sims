const User = require('../models/user');
const bcryptJS = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation Schema
const { AuthSchema, VerifyTokenSchema } = require('../validator/Auth');
const { UserSchema } = require('../validator/User');

module.exports = {
	login: async (req, res) => {
		const response = {
			message: 'Incorrect Credentials',
			status: 401
		};

		const { value, error } = AuthSchema.validate(req.body);
		if (!error) {
			const user = await User.findOne({ where: { username: value.username } });

			if (user) {
				if (await bcryptJS.compare(value.password, user.password)) {

					// generate access token and refresh token
					const accessToken = jwt.sign({ user_id: user.id, refresh: false }, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXP });
					const refressToken = jwt.sign({ user_id: user.id, refresh: true }, process.env.REFRESH_TOKEN_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXP });

					response.status = 200;
					response.message = 'Successfully login!';
					response.data = {
						access: accessToken,
						refresh: refressToken
					}
				}
			}
		} else {
			response.data = error;
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
			}
		} else {
			response.data = error;
		}


		res.status(response.status).json(response);
	},

	verify: async (req, res) => {
		const response = {
			status: 401,
			message: 'Invalid access token',
			data: {
				isValid: false
			}
		}

		const { value, error } = VerifyTokenSchema.validate(req.body);
		let data;

		if (!error) {
			try {
				data = jwt.verify(value.token, process.env.SECRET_KEY);
				response.status = 200;
				response.message = 'Token is valid';
				response.data = { isValid: true };
			} catch (e) {
				response.message = response.message + ' => ' + e.message;
			}
		} else {
			response.data = { ...response.data, error };
		}

		return res.status(response.status).json(response);
	},

	refresh: async (req, res) => {
		const response = {
			status: 401,
			message: 'Invalid Refresh Token'
		};

		try {
			const data = jwt.verify(req.body.refresh, process.env.REFRESH_TOKEN_KEY);

			if (data && data.refresh) {
				// generate new access and refresh token
				const accessToken = jwt.sign({ user_id: data.user_id, refresh: false }, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXP });
				const refressToken = jwt.sign({ user_id: data.user_id, refresh: true }, process.env.REFRESH_TOKEN_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXP });

				response.status = 200;
				response.message = 'Successfully refresh tokens';
				response.data = {
					access: accessToken,
					refresh: refressToken
				}
			}
		} catch (e) {
			response.message = response.message + ' => ' + e.message;
		}

		res.status(response.status).json(response);
	},

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
	}
}
