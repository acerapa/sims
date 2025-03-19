const joi = require("joi");
const { InvoiceStatus } = require("../enums");

const InvoiceSchema = joi.object({
  issue_date: joi.date().required(),
  due_date: joi.date().required(),
  user_id: joi.number().required(),
  status: joi
    .string()
    .valid(...Object.values(InvoiceStatus))
    .default(InvoiceStatus.UNPAID),
  payment_method: joi.number().required(),
  customer_id: joi.number().required(),
  sales_order_id: joi.number().allow(null, "").optional(),
  memo: joi.string().allow("", null).optional(),
  discount: joi.number().optional(),
  sub_total: joi.number().required(),
  total: joi.number().required(),
});

const InvoiceItemSchema = joi.object({
  product_id: joi.number().required(),
  description: joi.string().optional(),
  quantity: joi.number().required(),
  price: joi.number().required(),
  total: joi.number().required(),
});

module.exports = {
  InvoiceSchema,
  InvoiceItemSchema,
};
