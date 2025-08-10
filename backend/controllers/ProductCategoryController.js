const { sequelize } = require("../models");
const ProductCategory = require("../models/product-category");
const { linkedCategories } = require("../services/ProductService");

module.exports = {
  all: async (req, res) => {
    try {
      const categories = await ProductCategory.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.sendResponse(
        { categories, grouped: linkedCategories(categories) },
        "Successfully fetched!",
        200
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  byId: async (req, res) => {
    const category = await ProductCategory.findByPk(req.params.id);
    res.sendResponse({ category }, "Successfully fetched!", 200);
  },

  getParent: async (req, res) => {
    try {
      const id = req.params.id;
      const query = `
        WITH RECURSIVE parent_tree AS (
          SELECT id, name, general_cat, 1 as level
          FROM productcategories
          WHERE id = ${id}

          UNION ALL

          SELECT c.id, c.name, c.general_cat, pt.level + 1
          FROM productcategories c
          JOIN parent_tree pt ON pt.general_cat = c.id 
        )
        SELECT * FROM parent_tree ORDER BY level DESC;
      `;

      const categories = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      res.sendResponse({ categories }, "Successfully fetched!");
    } catch (error) {
      res.sendError({}, "Something went wrong!");
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
