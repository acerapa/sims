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
  sales_order_id: joi.number().optional(),
});

module.exports = {
  DeliverySchema,
};
