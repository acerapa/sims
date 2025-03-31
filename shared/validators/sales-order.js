const joi = require("joi");
const { AddressSchema } = require("./user");
const { SalesOrderStatus, SalesOrderType } = require("../enums/index");
const { ValidatorHelpers } = require("../helpers/validators-helpers");

const SalesOrderSchema = joi.object({
  memo: joi.string().allow("", null).optional(),
  purchase_date: joi.date().required(),
  type: joi
    .string()
    .valid(...Object.values(SalesOrderType))
    .required(),
  status: joi
    .string()
    .valid(...Object.values(SalesOrderStatus))
    .default(SalesOrderStatus.OPEN),

  // references
  user_id: joi.number().allow("", null).optional(),
  customer_id: joi.number().required(),
  payment_mehtod_id: joi.number().required(),
  delivery_id: joi.number().allow("", null).optional(),
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
