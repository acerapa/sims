const Joi = require("joi");
const { UserType } = require("shared/enums");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const UserSchema = Joi.object({
  username: Joi.string().required().messages({
    "*": "Username is required",
  }),
  first_name: Joi.string().required().messages({
    "*": "First name is required",
  }),
  last_name: Joi.string().required().messages({
    "*": "Last name is required",
  }),
  middle_name: Joi.string().allow(null, ""),
  password: Joi.string().required().messages({
    "*": "Password is required",
  }),
  position: Joi.string()
    .valid(...Object.values(UserType))
    .required()
    .messages({
      "*": "Position is required",
    }),
  status: Joi.number(),
  date_started: Joi.date().required().messages({
    "*": "Date started is required",
  }),
  date_ended: Joi.date().allow(null),
});

const AddressSchema = Joi.object({
  address1: Joi.string().required().messages({ "*": "Address 1 is required" }),
  address2: Joi.string()
    .allow(null, "")
    .optional()
    .messages({ "*": "Address 2 must be a string if provided" }),
  city: Joi.string().required().messages({ "*": "City is required" }),
  province: Joi.string().required().messages({ "*": "Province is required" }),
  postal: Joi.string().required().messages({ "*": "Postal is required" }),
});

const UserUpdateSchema = ValidatorHelpers.makeSchemaFieldOptional(UserSchema);

module.exports = { UserSchema, UserUpdateSchema, AddressSchema };
