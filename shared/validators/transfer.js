const Joi = require("joi");
const { BranchStatus } = require("../enums");
const { ValidatorHelpers } = require("../helpers/validators-helpers");
const { AddressSchema } = require("./user");

const BranchSchema = Joi.object({
  name: Joi.string().required(),
  branch_manager: Joi.number().required(),
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

module.exports = {
  BranchSchema,
  BranchUpdateSchema,
  BranchCreateSchema,
};
