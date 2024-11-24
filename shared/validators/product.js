const Joi = require("joi");

const CategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "name is required",
    "string.empty": "name is required",
    "any.required": "name is required",
  }),
});

const ProductReorderSchema = Joi.object({
  point: Joi.number().required().messages({
    "number.base": "point is required",
    "number.empty": "point is required",
    "any.required": "point is required",
  }),
  products: Joi.array().items(Joi.number()).optional(),
});

const ProductSchema = Joi.object();

module.exports = { CategorySchema, ProductReorderSchema, ProductSchema };
