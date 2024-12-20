const Joi = require("joi");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const AddressSchema = Joi.object({
  address1: Joi.string().allow(null, ""),
  address2: Joi.string().allow(null, "").optional(),
  city: Joi.string().allow(null, ""),
  postal: Joi.string().allow(null, ""),
  province: Joi.string().allow(null, ""),
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
  fb_profile: Joi.string().allow(null, "").optional(),
}).options({
  allowUnknown: true,
});

const VendorCreateSchema = Joi.object({
  vendor: VendorSchema.required(),
  address: ValidatorHelpers.makeSchemaFieldOptional(AddressSchema),
});

const VendorUpdateSchema = Joi.object({
  vendor: ValidatorHelpers.makeSchemaFieldOptional(VendorSchema),
  address: ValidatorHelpers.makeSchemaFieldOptional(AddressSchema),
});

module.exports = {
  VendorSchema,
  AddressSchema,
  VendorCreateSchema,
  VendorUpdateSchema,
};
