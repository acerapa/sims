const joi = require("joi");
const { DeliveryStatus } = require("../enums");
const { AddressSchema } = require("./user");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const DeliverySchema = joi.object({
  delivery_date: joi.date().required().messages({
    "date.base": "Delivery date must be a valid date",
    "any.required": "Delivery date is required",
  }),
  courier: joi.string().required().messages({ "*": "Courier is required" }),
  status: joi.string().valid(...Object.values(DeliveryStatus)),
  address_id: joi.number().allow("", null).optional(),
  address: joi.when("address_id", {
    is: joi.exist(),
    then: AddressSchema.required(),
    otherwise:
      ValidatorHelpers.makeSchemaFieldOptional(AddressSchema).optional(),
  }),
  use_customer_address: joi.boolean(),
  sales_order_id: joi.number().optional(),
});

const DeliveryStatusSchema = joi.object({
  status: joi
    .string()
    .valid(...Object.values(DeliveryStatus))
    .required()
    .messages({
      "*": "Status is required",
    }),
});

module.exports = {
  DeliverySchema,
  DeliveryStatusSchema,
};
