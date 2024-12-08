const Joi = require("joi");
const {
  BranchStatus,
  TransferType,
  ProductTransferStatus,
} = require("shared/enums");
const { ValidatorHelpers } = require("../helpers/validators-helpers");
const { AddressSchema } = require("./user");

const BranchSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Branch name is required",
    "any.required": "Branch name is required",
  }),
  branch_manager: Joi.number().required(),
  is_current: Joi.boolean().optional(),
  status: Joi.string().valid(...Object.values(BranchStatus)),
});

const BranchCreateSchema = Joi.object({
  branch: BranchSchema.required(),
  address: AddressSchema.required(),
});

const BranchUpdateSchema = Joi.object({
  branch: ValidatorHelpers.makeSchemaFieldOptional(BranchSchema),
  address: ValidatorHelpers.makeSchemaFieldOptional(AddressSchema),
});

const StockTransferSchema = Joi.object({
  po_no: Joi.alternatives(Joi.string(), Joi.number()).when("type", {
    is: TransferType.FIX,
    then: Joi.required(),
    otherwise: Joi.allow(null, "").optional(),
  }),
  memo: Joi.string().allow(null, ""),
  type: Joi.valid(...Object.values(TransferType)).required(),
  when: Joi.date().required(),
  branch_to: Joi.number().when("type", {
    is: TransferType.RMA,
    then: Joi.allow(null, "").optional(),
    otherwise: Joi.required(),
  }),
  branch_from: Joi.number().when("type", {
    is: TransferType.FIX,
    then: Joi.allow(null, "").optional(),
    otherwise: Joi.required(),
  }),
  processed_by: Joi.number().required(),
  str_id: Joi.number().when("type", {
    is: TransferType.IBRR,
    then: Joi.required(),
    otherwise: Joi.allow(null, "").optional(),
  }),
  supplier_id: Joi.number().when("type", {
    is: TransferType.RMA,
    then: Joi.required(),
    otherwise: Joi.allow(null, "").optional(),
  }),
});

const ProductTransferSchema = Joi.object({
  product_id: Joi.number().required(),
  transfer_id: Joi.number().optional(),
  quantity: Joi.number().required(),
  quantity_received: Joi.number().allow(null, 0),
  status: Joi.string()
    .valid(...Object.values(ProductTransferStatus))
    .allow(null, ""),
  amount: Joi.number().required(),
  cost: Joi.number().required(),
  description: Joi.string().allow(null, ""),
  serial_number: Joi.string().allow(null, "").optional(),
  problem: Joi.string().allow(null, "").optional(),
  remarks: Joi.string().allow(null, ""),
});

const StockTransferCreateSchema = Joi.object({
  transfer: StockTransferSchema.required(),
  products: Joi.array().items(ProductTransferSchema).min(1).required(),
});

const StockTransferUpdateSchema = Joi.object({
  transfer: ValidatorHelpers.makeSchemaFieldOptional(StockTransferSchema),
  products: ValidatorHelpers.makeSchemaFieldOptional(
    Joi.array().items(ProductTransferSchema)
  ),
});

module.exports = {
  BranchSchema,
  BranchUpdateSchema,
  BranchCreateSchema,
  StockTransferSchema,
  ProductTransferSchema,
  StockTransferCreateSchema,
  StockTransferUpdateSchema,
};
