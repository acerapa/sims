const { ProductType } = require("shared/enums");
const Account = require("../models/account");
const Product = require("../models/product");
const ProductCategory = require("../models/product-category");
const ProductDetails = require("../models/product-details");
const ProductSettings = require("../models/product-setting");
const Supplier = require("../models/supplier");

const groupCategories = (cts) => {
  const categories = [...cts];
  categories.forEach((category, ndx) => {
    if (category.dataValues.general_cat) {
      parentCategoryIndex = categories.findIndex(
        (cat) => cat.id == category.dataValues.general_cat
      );

      if (parentCategoryIndex > -1) {
        if (!categories[parentCategoryIndex].dataValues.sub_categories) {
          categories[parentCategoryIndex].dataValues.sub_categories = [];
        }

        categories[parentCategoryIndex].dataValues.sub_categories.push(
          category
        );
      }
    }
  });

  return [...categories];
};

const findProduct = async (id) => {
  return await Product.findOne({
    where: { id, type: ProductType.INVENTORY },
    include: [
      {
        model: Supplier,
        as: "suppliers",
        attributes: ["id"],
        through: { attributes: ["cost"] },
      },
      {
        model: Account,
        as: "income",
        attributes: ["id"],
      },
      {
        model: Account,
        as: "expense",
        attributes: ["id"],
      },
      {
        model: ProductCategory,
        as: "categories",
        attributes: ["id", "name"],
      },
      {
        model: ProductDetails,
        as: "product_details",
        include: {
          model: ProductSettings,
          as: "product_setting",
        },
      },
    ],
  });
};

module.exports = {
  findProduct,
  groupCategories,
};
