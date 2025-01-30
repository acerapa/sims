const ProductCategory = require("../models/product-category");
const { groupCategories } = require("../services/ProductService");

module.exports = {
  all: async (req, res) => {
    try {
      const categories = await ProductCategory.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.sendResponse(
        { categories, grouped: groupCategories(categories) },
        "Successfully fetched!",
        200
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  register: async (req, res) => {
    try {
      const category = await ProductCategory.create(req.body);
      res.sendResponse({ category }, "Successfully created!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  update: async (req, res) => {
    try {
      await ProductCategory.update(
        { name: req.body.name },
        { where: { id: req.params.id } }
      );

      const category = await ProductCategory.findOne({
        where: {
          id: req.params.id,
        },
      });

      res.sendResponse({ category }, "Successfully updated!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
    }
  },

  delete: async (req, res) => {
    try {
      await ProductCategory.destroy({ where: { id: req.params.id } });
      res.sendResponse({}, "Successfully deleted!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },
};
