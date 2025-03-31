const joi = require("joi");
const { InvoiceStatus } = require("../enums");

const InvoiceSchema = joi.object({
  issue_date: joi.date().required(),
  due_date: joi.date().required(),
  status: joi
    .string()
    .valid(...Object.values(InvoiceStatus))
    .default(InvoiceStatus.UNPAID),
  sales_order_id: joi.number().required(),
  memo: joi.string().allow("", null).optional(),
  discount: joi.number().allow("", null).optional(),
  sub_total: joi.number().required(),
  total: joi.number().required(),
});

module.exports = {
  InvoiceSchema,
};
