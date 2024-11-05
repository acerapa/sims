const Joi = require("joi");
const { UserType } = require("../enums/user");
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
  address1: Joi.string().required(),
  address2: Joi.string().optional(),
  city: Joi.string().required(),
  province: Joi.string().required(),
  postal: Joi.string().required()
})

const UserUpdateSchema = ValidatorHelpers.makeSchemaFieldOptional(UserSchema);

module.exports = { UserSchema, UserUpdateSchema, AddressSchema };
