const Joi = require('joi');

const AuthSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required()
});

module.exports = AuthSchema;
