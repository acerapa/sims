const Joi = require("joi");

const ReceivePaymentsSchema = Joi.object({
  amount: Joi.number().required().min(1).messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),
  remaining_balance: Joi.number().required().messages({
    "number.base": "Remaining balance must be a number",
    "any.required": "Remaining balance is required",
  }),
  payment_date: Joi.date().required().messages({
    "date.base": "Payment date must be a valid date",
    "any.required": "Payment date is required",
  }),
  payment_method_id: Joi.number().required().messages({
    "number.base": "Payment method ID must be a number",
    "any.required": "Payment method ID is required",
  }),
  invoice_id: Joi.number().required().messages({
    "number.base": "Invoice id must be a number",
    "any.required": "Invoice id is required",
  }),
  user_id: Joi.number().required().messages({
    "number.base": "User id must be a number",
    "any.required": "User id is required",
  }),
});

module.exports = {
  ReceivePaymentsSchema,
};
