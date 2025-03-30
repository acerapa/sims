const joi = require("joi");
const { AddressSchema } = require("./user");
const { SalesOrderStatus, SalesOrderType } = require("../enums/index");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const SalesOrderSchema = joi.object({
  memo: joi.string().allow("", null).optional(),
  purchase_date: joi.date().required(),
  delivery_date: joi.date().when("has_delivery", {
    is: true,
    then: joi.required(),
    otherwise: joi.allow("", null).optional(),
  }),
  bill_due: joi.date().allow("", null).optional(),
  customer_id: joi.number().required(),
  payment_method_id: joi.number().required(),
  type: joi
    .string()
    .valid(...Object.values(SalesOrderType))
    .required(),
  status: joi.string().valid(...Object.values(SalesOrderStatus)),
  has_delivery: joi.boolean().optional(),
});

const SalesOrderProductSchema = joi.object({
  product_id: joi.number().required(),
  description: joi.string().allow("", null).optional(),
  quantity: joi.number().min(1).required(),
  discount: joi.number().optional(),
  price: joi.number().required(),
  total: joi.number().required(),
});

const SalesOrderCreateSchema = joi.object({
  sales_order: SalesOrderSchema,
  sales_order_products: joi
    .array()
    .items(SalesOrderProductSchema)
    .min(1)
    .required(),
  shipment_address: joi.when(joi.ref("sales_order.has_delivery"), {
    is: true,
    then: AddressSchema.required(),
    otherwise:
      ValidatorHelpers.makeSchemaFieldOptional(AddressSchema).optional(),
  }),
});

const PaymentMethodSchema = joi.object({
  name: joi.string().required(),
});

module.exports = {
  SalesOrderSchema,
  PaymentMethodSchema,
  SalesOrderCreateSchema,
  SalesOrderProductSchema,
};
