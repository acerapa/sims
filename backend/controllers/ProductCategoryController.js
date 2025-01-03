const ProductCategory = require("../models/product-category");

module.exports = {
  all: async (req, res) => {
    try {
      const categories = await ProductCategory.findAll({
        order: [["createdAt", "DESC"]],
        include: {
          model: ProductCategory,
          as: "sub_categories",
        },
        where: {
          general_cat: null,
        },
      });
      res.sendResponse({ categories }, "Successfully fetched!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  register: async (req, res) => {
    try {
      await ProductCategory.create(req.body);
      res.sendResponse({}, "Successfully created!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  update: async (req, res) => {
    try {
      await ProductCategory.update(
        { name: req.body.name },
        { where: { id: req.body.id } }
      );
      res.sendResponse({}, "Successfully updated!", 200);
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
