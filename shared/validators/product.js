const { ProductType, ProductStatus, ItemType } = require("shared/enums");

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

const ProductDetailsSchema = Joi.object({
  purchase_description: Joi.string().optional(),
  sale_description: Joi.string().optional(),
  item_code: Joi.string().required(),
  stock: Joi.number().required(),
  cost: Joi.number().optional(),
  status: Joi.valid(...Object.values(ProductStatus)).required(),
  product_setting_id: Joi.number().required(),
  product_id: Joi.number().required(),
});

const ServiceDetailsSchema = Joi.object({
  product_id: Joi.number().required(),
  description: Joi.string().required(),
});

const ProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.valid(...Object.values(ItemType)).required(),
  income_account: Joi.number().required(),
  expense_account: Joi.number().required(),
});

const ProductItemSchema = Joi.object({
  product: ProductSchema,
  details: ProductDetailsSchema,
});

const ServiceItemSchema = Joi.object({
  service: ProductSchema,
  service: ServiceDetailsSchema,
});

module.exports = {
  ProductSchema,
  CategorySchema,
  ProductItemSchema,
  ServiceItemSchema,
  ProductReorderSchema,
};
