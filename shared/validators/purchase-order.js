const Joi = require("joi");

module.exports = {
  PurchaseOrderSchema: Joi.object({
    ref_no: Joi.string().required(),
    date: Joi.date().required(),
    bill_due: Joi.date().required(),
    amount: Joi.number().required(),
    memo: Joi.string().optional(),
    supplier_id: Joi.string().required(),
    type: Joi.string().valid("term", "cod").required(),
    term_start: Joi.date().when("type", {
      is: "term",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    status: Joi.string()
      .valid("open", "confirmed", "completed", "cancelled")
      .required(),
  }),
  PurchaseProductSchema: Joi.object({
    product_id: Joi.alternatives(Joi.string(), Joi.number()),
  }),
};
