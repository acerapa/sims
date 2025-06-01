const Joi = require("joi");
const { PhysicalInventoryStatus } = require("../enums");
const { ValidatorHelpers } = require("../helpers");

const PhysicalInventorySchema = Joi.object({
  date_started: Joi.date().required(),
  date_ended: Joi.date().allow(null).optional(),
  status: Joi.string().valid(...Object.values(PhysicalInventoryStatus)),
  inventory_incharge: Joi.number().required().messages({
    "number.base": "Inventory Incharge must be a number",
    "any.required": "Inventory Incharge is required",
  }),
  branch_manager: Joi.number().required().messages({
    "number.base": "Branch Manager must be a number",
    "any.required": "Branch Manager is required",
  }),
});

// Physical Inventory Item
const PhysicalInventoryItemSchema = Joi.object({
  id: Joi.number().optional(),
  quantity: Joi.number().required(),
  product_id: Joi.number().required(),
  physical_quantity: Joi.number().min(0).required(),
  physical_inventory_id: Joi.number().allow(null, "").optional(),
});

const PhysicalInventoryCreateSchema = Joi.object({
  physical_inventory: PhysicalInventorySchema.required(),
  items: Joi.array().items(PhysicalInventoryItemSchema).min(1),
});

const PhysicalInventoryItemUpdateSchema =
  ValidatorHelpers.makeSchemaFieldOptional(PhysicalInventoryItemSchema);

const PhysicalInventoryUpdateSchema = Joi.object({
  physical_inventory: ValidatorHelpers.makeSchemaFieldOptional(
    PhysicalInventorySchema
  ),
  items: Joi.array().items(PhysicalInventoryItemUpdateSchema).min(1),
});

module.exports = {
  PhysicalInventorySchema,
  PhysicalInventoryItemSchema,
  PhysicalInventoryCreateSchema,
  PhysicalInventoryUpdateSchema,
  PhysicalInventoryItemUpdateSchema,
};
