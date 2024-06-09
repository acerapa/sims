const Joi = require('joi');

const AccountSchema = Joi.object({
	name: Joi.string().required(),
	type: Joi.string().required()
});

module.exports = AccountSchema;
