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
});

const ProductSupplierSchema = Joi.object({
  supplier_id: Joi.number().required(),
  cost: Joi.number().min(1).required(),
});

const ProductDetailsSchema = Joi.object({
  purchase_description: Joi.string().required().messages({
    "*": "Purchase Description is required",
  }),
  sales_description: Joi.string().required().messages({
    "*": "Sales Description is required",
  }),
  item_code: Joi.string().required(),
  cost: Joi.number().label("Cost").optional(),
  stock: Joi.number().required().messages({
    "number.base": "Stock must be a number",
    "any.required": "Stock is required",
  }),
  is_manually_set_cost: Joi.boolean().optional(),
  status: Joi.valid(...Object.values(ProductStatus)).required(),
  product_setting_id: Joi.number().allow(null, 0, "").optional(),
});

const ServiceDetailsSchema = Joi.object({
  description: Joi.string().required().messages({
    "string.base": "Description must be a string",
    "*": "Description is required",
  }),
});

const ProductSchema = Joi.object({
  name: Joi.string().when(Joi.ref("type"), {
    is: ItemType.NON_INVENTORY,
    then: Joi.required().messages({
      "*": "Name is required",
    }),
    otherwise: Joi.allow(null, "").optional(),
  }),
  price: Joi.number().required().messages({
    "*": "Price is required",
  }),
  type: Joi.valid(...Object.values(ItemType)).required(),
  income_account: Joi.number().required().messages({
    "*": "Income account is required",
  }),
  expense_account: Joi.number().required().messages({
    "*": "Expense account is required",
  }),
  pref_sup_id: Joi.number().required().messages({
    "*": "Preferred Supplier is required!"
  })
});

const ProductItemSchema = Joi.object({
  product: ProductSchema,
  details: ProductDetailsSchema,
  suppliers: Joi.array().items(ProductSupplierSchema).min(1),
  category: Joi.number().required().messages({
    "any.required": "Category is required!",
  }),
}).options({ stripUnknown: true });

const ServiceItemSchema = Joi.object({
  service: ProductSchema,
  details: ServiceDetailsSchema,
});

module.exports = {
  ProductSchema,
  CategorySchema,
  ProductItemSchema,
  ServiceItemSchema,
  ProductReorderSchema,
};
