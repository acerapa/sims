const { ProductType, ProductStatus } = require("shared/enums");

const Joi = require("joi");

const CategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "name is required",
    "string.empty": "name is required",
    "any.required": "name is required",
  }),
  general_cat: Joi.number().allow(null, "").optional(),
});

const ProductReorderSchema = Joi.object({
  point: Joi.number().required().messages({
    "number.base": "point is required",
    "number.empty": "point is required",
    "any.required": "point is required",
  }),
  products: Joi.array().items(Joi.number()).optional(),
});

const ProductSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ProductType))
    .required(),
  name: Joi.string().required(),
  purchase_description: Joi.string().optional(),
  sale_description: Joi.string().optional(),
  price: Joi.number().required(),
  item_code: Joi.string().required(),
  brand: Joi.string().optional(),
  quantity_in_stock: Joi.number().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
  category_id: Joi.number().required(),
  cost: Joi.number().optional(),
  income_account: Joi.number().required(),
  expense_account: Joi.number().required(),
  product_setting_id: Joi.number().optional(),
  suppliers: Joi.when("type", {
    is: ProductType.NON_INVENTORY,
    then: Joi.array().optional(),
    otherwise: Joi.array().items(Joi.number()).min(1).required(),
  }),
});

module.exports = { CategorySchema, ProductReorderSchema, ProductSchema };
