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
  annotation: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string()
    .allow(null, "")
    .email({ tlds: { allow: false } })
    .optional(),
  telephone: Joi.string().allow(null, "").optional(),
  fax: Joi.string().allow(null, "").optional(),
}).options({
  allowUnknown: true,
});

const VendorCreateSchema = Joi.object({
  vendor: VendorSchema.required(),
  address: AddressSchema.required(),
});

module.exports = { VendorSchema, AddressSchema, VendorCreateSchema };
