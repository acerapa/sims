const ProductSettings = require("../models/product-setting");
const Product = require("../models/product");
const ProductDetails = require("../models/product-details");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

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
      const orderingPoint = await ProductSettings.create({
        point: req.body.point,
      });

      if (req.body.products) {
        await Promise.all(
          req.body.products.map((p) =>
            ProductDetails.update(
              { product_setting_id: orderingPoint.id },
              {
                where: {
                  product_id: p,
                },
              }
            )
          )
        );
      }

      const point = await ProductSettings.findOne({
        where: {
          id: orderingPoint.dataValues.id,
        },
        include: {
          model: ProductDetails,
          as: "product_details",
          include: {
            model: Product,
            as: "product",
          },
        },
      });

      res.sendResponse({ point }, "Successfully created!", 200);
    } catch (e) {
      res.sendError(e, "Something wen't wrong! => " + e.message, 400);
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

      if (req.body.products) {
        const products = await Product.findAll({
          where: {
            id: {
              [Op.in]: sequelize.literal(
                `(SELECT product_id FROM ${ProductDetails.getTableName()} WHERE product_setting_id=${req.params.id})`
              ),
            },
          },
          include: {
            model: ProductDetails,
            as: "product_details",
            attributes: ["id", "product_setting_id"],
          },
        });

        const toAdd = req.body.products.filter((product_id) => {
          return !products.map((p) => p.id).includes(product_id);
        });

        const toRemove = products.filter((product) => {
          return !req.body.products.includes(product.id);
        });

        await Promise.all([
          ...toAdd.map((product_id) => {
            return ProductDetails.update(
              { product_setting_id: req.params.id },
              {
                where: {
                  product_id: product_id,
                },
              }
            );
          }),
          ...toRemove.map((product) => {
            return product.product_details.update({ point: null });
          }),
        ]);
      }

      const point = await ProductSettings.findOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: ProductDetails,
          as: "product_details",
          include: {
            model: Product,
            as: "product",
          },
        },
      });

      // re arrange data
      point.dataValues.products = point.dataValues.product_details.length
        ? point.dataValues.product_details.map((pd) => pd.product)
        : [];

      res.sendResponse({ point }, "Successfully updated!", 200);
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
