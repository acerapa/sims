const Joi = require("joi");
const { AddressSchema } = require("./user");
const { ValidatorHelpers } = require("../helpers/validators-helpers");
const {
  ProductOrderedStatus,
  PhysicalInventoryStatus,
} = require("shared/enums");

const PurchaseOrderSchema = Joi.object({
  ref_no: Joi.string().required(),
  date: Joi.date().required(),
  bill_due: Joi.date().required(),
  amount: Joi.number().required(),
  memo: Joi.string().optional(),
  supplier_id: Joi.alternatives(Joi.string(), Joi.number()).required(),
  type: Joi.string().valid("term", "cod").required(),
  term_start: Joi.date().when("type", {
    is: "term",
    then: Joi.required(),
    otherwise: Joi.allow(null, ""),
  }),
  status: Joi.string()
    .valid("open", "confirmed", "completed", "cancelled")
    .optional(),
});

const PurchaseProductSchema = Joi.object({
  product_id: Joi.alternatives(Joi.string(), Joi.number()).required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  quantity: Joi.number().required(),
  cost: Joi.number().required(),
  amount: Joi.number().required(),
  quantity_received: Joi.number().optional(),
  remarks: Joi.string().allow(null, "").optional(),
  status: Joi.string().valid(...Object.values(ProductOrderedStatus)),
});

const PurchaseOrderCreationSchema = Joi.object({
  order: PurchaseOrderSchema.required(),
  address: AddressSchema.required(),
  products: Joi.array().items(PurchaseProductSchema).min(1).required(),
});

const PurchaseOrderUpdateSchema = Joi.object({
  order: ValidatorHelpers.makeSchemaFieldOptional(PurchaseOrderSchema),
  address: ValidatorHelpers.makeSchemaFieldOptional(AddressSchema),
  products: ValidatorHelpers.makeSchemaFieldOptional(
    Joi.array().items(PurchaseProductSchema).min(1)
  ),
});

// Physical Inventory
const PhysicalInventorySchema = Joi.object({
  date_started: Joi.date().required(),
  date_ended: Joi.date().allow(null).optional(),
  status: Joi.string().valid(...Object.values(PhysicalInventoryStatus)),
  inventory_incharge: Joi.number().required(),
  branch_manager: Joi.number().required(),
});

// Physical Inventory Item
const PhysicalInventoryItemSchema = Joi.object({
  id: Joi.number().optional(),
  quantity: Joi.number().required(),
  product_id: Joi.number().required(),
  physical_inventory_id: Joi.number().required(),
  physical_quantity: Joi.number().min(0).required(),
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
  items: PhysicalInventoryItemUpdateSchema,
});

module.exports = {
  PurchaseOrderSchema,
  PurchaseProductSchema,
  PhysicalInventorySchema,
  PurchaseOrderUpdateSchema,
  PurchaseOrderCreationSchema,
  PhysicalInventoryItemSchema,
  PhysicalInventoryUpdateSchema,
  PhysicalInventoryCreateSchema,
  PhysicalInventoryItemUpdateSchema,
};
