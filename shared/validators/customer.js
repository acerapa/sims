const joi = require("joi");
const { AddressSchema } = require("./user");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const CustomerSchema = joi.object({
  first_name: joi.string().required().messages({
    "*": "First name is required",
  }),
  last_name: joi.string().required().messages({
    "*": "Last name is required",
  }),
  address: ValidatorHelpers.makeSchemaFieldOptional(AddressSchema).options({
    allowUnknown: true,
  }),
  viber: joi.string().allow("", null),
  phone_number: joi.string().allow("", null),
  facebook_url: joi.string().allow("", null),
});

module.exports = {
  CustomerSchema,
};
