const Joi = require('joi');

const UserSchema = Joi.object({
	username: Joi.string().required(),
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	middle_name: Joi.string(),
	password: Joi.string().required(),
	position: Joi.string().valid(
		'admin',
		'cashier',
		'inventory'
	).required(),
	status: Joi.number().required(),
	date_started: Joi.date()
});

module.exports = { UserSchema };