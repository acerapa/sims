const Joi = require("joi");

const PhysicalInventoryAdjustmentSchema = Joi.object({
  date_recorded: Joi.date().required().messages({
    "date.base": "Date must be a date",
    "any.required": "Date is required",
  }),
  physical_inventory_id: Joi.number().required().messages({
    "number.base": "Physical Inventory ID must be a number",
    "any.required": "Physical Inventory ID is required",
  }),
  user_id: Joi.number().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is required",
  }),
});

const ItemToAdjustmentsSchema = Joi.object({
  item_id: Joi.number().required().messages({
    "number.base": "Item ID must be a number",
    "any.required": "Item ID is required",
  }),
  adjustment_id: Joi.number().allow(null, "").optional().messages({
    "number.base": "Adjustment ID must be a number",
  }),
  current_quantity: Joi.number().required().messages({
    "number.base": "Current Quantity must be a number",
    "any.required": "Current Quantity is required",
  }),
  new_quantity: Joi.number().allow(null, "").optional().messages({
    "number.base": "New Quantity must be a number",
  }),
  difference: Joi.number().default(0).messages({
    "number.base": "Difference must be a number",
  }),
});

const PhysicalInventoryAdjustmentSchemaWithItems = Joi.object({
  adjustment_information: PhysicalInventoryAdjustmentSchema,
  items: Joi.array().items(ItemToAdjustmentsSchema).min(1).required().messages({
    "array.base": "Items must be an array",
    "any.required": "Items are required",
  }),
});

module.exports = {
  ItemToAdjustmentsSchema,
  PhysicalInventoryAdjustmentSchema,
  PhysicalInventoryAdjustmentSchemaWithItems,
};
