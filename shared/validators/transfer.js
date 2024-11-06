const Joi = require("joi");
const {
  BranchStatus,
  TransferType,
  ProductTransferStatus,
} = require("../enums");
const { ValidatorHelpers } = require("../helpers/validators-helpers");
const { AddressSchema } = require("./user");

const BranchSchema = Joi.object({
  name: Joi.string().required(),
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

const BranchTransferSchema = Joi.object({
  memo: Joi.string().allow(null, ""),
  type: Joi.valid(...Object.values(TransferType)).required(),
  when: Joi.date().required(),
  branch_to: Joi.number().required(),
  branch_from: Joi.number().required(),
  processed_by: Joi.number().required(),
  str_id: Joi.number().when("type", {
    is: TransferType.STR,
    then: Joi.allow(null, "").optional(),
    otherwise: Joi.required(),
  }),
});

const ProductTransferSchema = Joi.object({
  product_id: Joi.number().required(),
  transfer_id: Joi.number().optional(),
  quantity: Joi.number().required(),
  // quantity_received: Joi.number().allow(null, 0),
  // status: Joi.string().valid(...Object.values(ProductTransferStatus)),
  amount: Joi.number().required(),
  cost: Joi.number().required(),
  description: Joi.string().allow(null, ""),
  // remarks: Joi.string().allow(null, ""),
});

const BranchTransferCreateSchema = Joi.object({
  transfer: BranchTransferSchema.required(),
  products: Joi.array().items(ProductTransferSchema).min(1).required(),
});

const BranchTransferUpdateSchema = Joi.object({
  transfer: ValidatorHelpers.makeSchemaFieldOptional(BranchTransferSchema),
  products: ValidatorHelpers.makeSchemaFieldOptional(
    Joi.array().items(ProductTransferSchema)
  ),
});

module.exports = {
  BranchSchema,
  BranchUpdateSchema,
  BranchCreateSchema,
  BranchTransferSchema,
  ProductTransferSchema,
  BranchTransferCreateSchema,
  BranchTransferUpdateSchema,
};
