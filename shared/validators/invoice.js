const joi = require("joi");
const { InvoiceStatus } = require("../enums");

const InvoiceSchema = joi.object({
  issue_date: joi.date().required().messages({
    "*": "Issue date is required",
  }),
  due_date: joi.date().required().messages({
    "*": "Due date is required",
  }),
  status: joi
    .string()
    .valid(...Object.values(InvoiceStatus))
    .default(InvoiceStatus.UNPAID),
  sales_order_id: joi.number().allow(null).optional(),
  memo: joi.string().allow("", null).optional(),
  discount: joi.number().allow("", null).optional(),
  sub_total: joi.number().required().messages({
    "*": "Sub total is required",
  }),
  total: joi.number().required().messages({
    "*": "Total is required",
  }),

  // with condition fields
  customer_id: joi.when("sales_order_id", {
    is: joi.exist(),
    then: joi.forbidden(),
    otherwise: joi.number().required().messages({
      "*": "Customer id is required",
    }),
  }),

  employee_id: joi.when("sales_order_id", {
    is: joi.exist(),
    then: joi.forbidden(),
    otherwise: joi.number().required().messages({
      "*": "Employee id is required",
    }),
  }),
});

const InvoiceProductSchema = joi.object({
  product_id: joi.number().required().messages({
    "*": "Product id is required",
  }),
  quantity: joi.number().min(1).required().messages({
    "*": "Quantity is required",
  }),
  price: joi.number().min(0.01).required().messages({
    "*": "Price is required",
  }),
  total: joi.number().min(0.01).required().messages({
    "*": "Total is required",
  }),
});

const InvoiceWithProductsSchema = joi.object({
  invoice: InvoiceSchema.required(),
  products: joi.when("invoice.sales_order_id", {
    is: joi.exist(),
    then: joi.forbidden(),
    otherwise: joi.array().items(InvoiceProductSchema).min(1).required(),
  }),
});

module.exports = {
  InvoiceSchema,
  InvoiceWithProductsSchema,
};
