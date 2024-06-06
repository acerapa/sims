const Joi = require('joi');

const UserSchema = Joi.object({
	username: Joi.string().required(),
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	middle_name: Joi.string().allow(null),
	password: Joi.string().required(),
	position: Joi.string().valid(
		'admin',
		'cashier',
		'inventory'
	).required(),
	status: Joi.number().required(),
	date_started: Joi.date(),
	date_ended: Joi.date().allow(null)
});

const UserSchemaUpdate = Joi.object({
	username: Joi.string(),
	first_name: Joi.string(),
	last_name: Joi.string(),
	middle_name: Joi.string().allow(null),
	position: Joi.string().valid(
		'admin',
		'cashier',
		'inventory'
	),
	status: Joi.number(),
	date_started: Joi.date(),
	date_ended: Joi.date().allow(null)
}).options({
	allowUnknown: true
});

module.exports = { UserSchema, UserSchemaUpdate };
