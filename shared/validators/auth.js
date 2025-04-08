const Joi = require("joi");

const AuthSchema = Joi.object({
  username: Joi.string().required().messages({
    "*": "Username is required",
  }),
  password: Joi.string().required().messages({
    "*": "Password is required",
  }),
});

const VerifyTokenSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = { AuthSchema, VerifyTokenSchema };
