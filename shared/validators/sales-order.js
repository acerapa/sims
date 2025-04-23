const joi = require("joi");
const { SalesOrderStatus, SalesOrderType } = require("../enums/index");
const { DeliverySchema } = require("./delivery");

const SalesOrderSchema = joi.object({
  memo: joi.string().allow("", null).optional(),
  purchase_date: joi
    .date()
    .required()
    .messages({ "*": "Purchase date is required" }),
  type: joi
    .string()
    .valid(...Object.values(SalesOrderType))
    .required()
    .messages({ "*": "Type is required" }),
  status: joi
    .string()
    .valid(...Object.values(SalesOrderStatus))
    .default(SalesOrderStatus.OPEN),

  // references
  user_id: joi.number().allow("", null).optional(),
  customer_id: joi
    .number()
    .not(null)
    .required()
    .messages({ "*": "Customer is required" }),
  payment_method_id: joi
    .number()
    .not(null)
    .required()
    .messages({ "*": "Payment method is required" }),
  has_delivery: joi.boolean(),
  sub_total: joi.number().required().messages({
    "*": "Sub total is required",
  }),
  total: joi.number().required().messages({
    "*": "Total is required",
  }),
  total_discount: joi.number().label("Total Discount").optional(),
});

const SalesOrderProductSchema = joi.object({
  discount: joi.number().optional(),
  product_id: joi.number().required(),
  quantity: joi.number().min(1).required(),
  description: joi.string().allow("", null).optional(),
  serial_number: joi.string().allow("", null).optional(),
  price: joi.number().required(),
  total: joi.number().required(),
});

const SalesOrderCreateSchema = joi.object({
  sales_order: SalesOrderSchema.required(),
  sales_order_products: joi
    .array()
    .items(SalesOrderProductSchema)
    .min(1)
    .required(),
  delivery: DeliverySchema.optional(),
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
