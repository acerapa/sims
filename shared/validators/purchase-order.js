const Joi = require("joi");
const { AddressSchema } = require("./user");
const { ValidatorHelpers } = require("../helpers/validators-helpers");
const { ProductOrderedStatus } = require("./../enums/purchase-order")

const PurchaseOrderSchema = Joi.object({
  ref_no: Joi.string().required(),
  date: Joi.date().required(),
  bill_due: Joi.date().required(),
  amount: Joi.number().required(),
  memo: Joi.string().optional(),
  supplier_id: Joi.alternatives(Joi.string(), Joi.number()).required(),
  type: Joi.string().valid("term", "cod").required(),
  term_start: Joi.date().when("type", {
    is: "term",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  status: Joi.string()
    .valid("open", "confirmed", "completed", "cancelled")
    .optional(),
});

const PurchaseProductSchema = Joi.object({
  product_id: Joi.alternatives(Joi.string(), Joi.number()).required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  quantity: Joi.number().required(),
  cost: Joi.number().required(),
  amount: Joi.number().required(),
  quantity_received: Joi.number().optional(),
  status: Joi.string().valid(...Object.values(ProductOrderedStatus))
});

const PurchaseOrderCreationSchema = Joi.object({
  order: PurchaseOrderSchema.required(),
  address: AddressSchema.required(),
  products: Joi.array().items(PurchaseProductSchema).min(1).required()
})

const PurchaseOrderUpdateSchema = Joi.object({
  order: ValidatorHelpers.makeSchemaFieldOptional(PurchaseOrderSchema),
  address: ValidatorHelpers.makeSchemaFieldOptional(AddressSchema),
  products: ValidatorHelpers.makeSchemaFieldOptional(Joi.array().items(PurchaseProductSchema).min(1))
})

module.exports = {
  PurchaseOrderSchema,
  PurchaseProductSchema,
  PurchaseOrderUpdateSchema,
  PurchaseOrderCreationSchema,
};
