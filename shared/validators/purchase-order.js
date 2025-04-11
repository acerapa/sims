const Joi = require("joi");
const { AddressSchema } = require("./user");
const { ValidatorHelpers } = require("../helpers/validators-helpers");
const {
  ProductOrderedStatus,
  PhysicalInventoryStatus,
  PurchaseOrderStatus,
} = require("shared/enums");

const PurchaseOrderSchema = Joi.object({
  ref_no: Joi.string().required().messages({
    "*": "Ref no. is required",
  }),
  date: Joi.date().label("Date").required(),
  bill_due: Joi.date().label("Bill due").required(),
  amount: Joi.number().label("Amount").required(),
  memo: Joi.string().allow("", null).optional(),
  supplier_id: Joi.alternatives(Joi.string(), Joi.number())
    .required()
    .messages({
      "*": "Supplier is required",
    }),
  type: Joi.string().label("Type").valid("term", "cod").required(),
  term_start: Joi.date()
    .label("Term Start")
    .when("type", {
      is: "term",
      then: Joi.required(),
      otherwise: Joi.allow(null, "").optional(),
    }),
  status: Joi.string()
    .valid("open", "confirmed", "completed", "cancelled")
    .optional(),
});

const PurchaseProductSchema = Joi.object({
  product_id: Joi.alternatives(Joi.string(), Joi.number()).required(),
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

// receiving purchase orders
const ReceiveOrderSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(PurchaseOrderStatus))
    .required()
    .messages({
      "*": "Status is required",
    }),
  delivery_number: Joi.string().required().messages({
    "*": "Delivery number is required",
  }),
});

const ReceivePurchaseProductSchema = Joi.object({
  id: Joi.number().required().messages({
    "*": "Id is required",
  }),
  quantity_received: Joi.number().required().messages({
    "*": "Quantity received is required",
  }),
  remarks: Joi.string().allow(null, "").optional(),
  status: Joi.string()
    .valid(
      ProductOrderedStatus.COMPLETE,
      ProductOrderedStatus.INCOMPLETE,
      ProductOrderedStatus.NOT_RECEIVED
    )
    .required()
    .messages({
      "*": "Status is required",
    }),
});

const ReceivePurchaseOrderSchema = Joi.object({
  order: ReceiveOrderSchema.required(),
  products: Joi.array().items(ReceivePurchaseProductSchema).min(1).required(),
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
  ReceivePurchaseOrderSchema,
  PurchaseOrderCreationSchema,
  PhysicalInventoryItemSchema,
  PhysicalInventoryUpdateSchema,
  PhysicalInventoryCreateSchema,
  PhysicalInventoryItemUpdateSchema,
};
