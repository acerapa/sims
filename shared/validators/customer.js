const joi = require("joi");
const { AddressSchema } = require("./user");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const CustomerSchema = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  address: ValidatorHelpers.makeSchemaFieldOptional(AddressSchema).options({
    allowUnknown: true,
  }),
});

module.exports = {
  CustomerSchema,
};
