const Joi = require("joi");

const AccountSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "name is required",
    "string.empty": "name is required",
    "any.required": "name is required",
  }),
  type: Joi.string().required().messages({
    "string.base": "type is required",
    "string.empty": "type is required",
    "any.required": "type is required",
  }),
});

module.exports = { AccountSchema };
