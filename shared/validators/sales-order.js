const joi = require("joi");
const { AddressSchema } = require("./user");

const SalesOrderSchema = joi.object({
  memo: joi.string().allow("", null).optional(),
  date_order: joi.date().required(),
  date_delivery: joi.date().allow("", null).optional(),
  bill_due: joi.date().allow("", null).optional(),
  customer_id: joi.number().required(),
  shipment_address: joi.number().required(),
});

const SalesOrderProductSchema = joi.object({
  sales_order_id: joi.number().required(),
  product_id: joi.number().required(),
  description: joi.string().allow("", null).optional(),
  quantity: joi.number().required(),
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
  shipment_address: AddressSchema,
});

module.exports = {
  SalesOrderSchema,
  SalesOrderCreateSchema,
  SalesOrderProductSchema,
};
