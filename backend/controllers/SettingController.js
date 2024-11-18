const ProductSettings = require("../models/product-setting");
const Product = require("../models/product");

module.exports = {
  all: async (req, res) => {
    try {
      const productReorderingPoints = await ProductSettings.findAll({
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["id", "name"],
          },
        ],
      });

      res.sendResponse(
        { productReorderingPoints },
        "Successfully fetched",
        200
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => ".e.message, 400);
    }
  },

  register: async (req, res) => {
    try {
      const orderingPoint = await ProductSettings.create({
        point: req.body.point,
      });
      await orderingPoint.addProducts(req.body.products);

      res.sendResponse({}, "Successfully created!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  update: async (req, res) => {
    try {
      const reorderingPoint = await ProductSettings.findByPk(req.body.id);
      reorderingPoint.update({ point: req.body.point });
      await reorderingPoint.setProducts(req.body.products);

      res.sendResponse({}, "Successfully updated!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong!", 400);
    }
  },

  destroy: async (req, res) => {
    try {
      await ProductSettings.destroy({ where: { id: req.params.id } });
      res.sendResponse({}, "Successfully deleted!");
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message);
    }
  },
};
