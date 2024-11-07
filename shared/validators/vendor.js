const Joi = require("joi");

const AddressSchema = Joi.object({
  address1: Joi.string(),
  address2: Joi.string(),
  city: Joi.string(),
  postal: Joi.string(),
  province: Joi.string(),
}).options({
  allowUnknown: true,
});

const VendorSchema = Joi.object({
  company_name: Joi.string().required(),
  annotation: Joi.string(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string(),
  email: Joi.string().email({ tlds: { allow: false } }),
  telephone: Joi.string(),
  fax: Joi.string(),
  address: AddressSchema,
}).options({
  allowUnknown: true,
});

module.exports = { VendorSchema, AddressSchema };
