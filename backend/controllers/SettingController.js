const ProductSettings = require("../models/product-setting");
const Product = require("../models/product");
const ProductDetails = require("../models/product-details");
const { UniqueConstraintError } = require("sequelize");

module.exports = {
  all: async (req, res) => {
    try {
      const productReorderingPoints = await ProductSettings.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: ProductDetails,
            as: "product_details",
            attributes: ["id"],
            include: {
              model: Product,
              as: "product",
            },
          },
        ],
      });

      res.sendResponse(
        { productReorderingPoints },
        "Successfully fetched",
        200
      );
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
    }
  },

  register: async (req, res) => {
    try {
      const point = await ProductSettings.create({
        point: req.body.point,
      });

      res.sendResponse({ point }, "Successfully created!", 200);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        res.sendError(
          {
            name: e.name,
            error: e.message,
            stack: e.stack,
            message: "Point already exists!",
          },
          "Something went wrong!",
          400
        );
      } else {
        res.sendError(e, "Something wen't wrong! => " + e.message, 400);
      }
    }
  },

  update: async (req, res) => {
    try {
      await ProductSettings.update(
        { point: req.body.point },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      const point = await ProductSettings.findByPk(req.params.id);

      res.sendResponse({ point }, "Successfully updated!", 200);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        res.sendError(
          {
            name: e.name,
            error: e.message,
            stack: e.stack,
            message: "Point already exists!",
          },
          "Something went wrong!",
          400
        );
      } else {
        res.sendError(e, "Something wen't wrong!", 400);
      }
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
