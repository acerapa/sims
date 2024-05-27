const Joi = require('joi');

const UserSchema = Joi.object({
	username: Joi.string().required(),
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	middle_name: Joi.string(),
	password: Joi.string().required(),
	type: Joi.string().valid(
		'admin',
		'manager',
		'cashier',
		'inventory'
	).required()
});

module.exports = { UserSchema };