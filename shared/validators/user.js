const Joi = require("joi");
const { UserType } = require("shared/enums");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const UserSchema = Joi.object({
  username: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  middle_name: Joi.string().allow(null, ""),
  password: Joi.string().required(),
  position: Joi.string()
    .valid(...Object.values(UserType))
    .required(),
  status: Joi.number(),
  date_started: Joi.date().required(),
  date_ended: Joi.date().allow(null),
});

const AddressSchema = Joi.object({
  address1: Joi.string().required().messages({ "*": "Address 1 is required" }),
  address2: Joi.string().optional().messages({ "*": "Address 2 is required" }),
  city: Joi.string().required().messages({ "*": "City is required" }),
  province: Joi.string().required().messages({ "*": "Province is required" }),
  postal: Joi.string().required().messages({ "*": "Postal is required" }),
});

const UserUpdateSchema = ValidatorHelpers.makeSchemaFieldOptional(UserSchema);

module.exports = { UserSchema, UserUpdateSchema, AddressSchema };
