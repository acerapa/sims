const { ProductType } = require("shared/enums");
const { sequelize } = require("../../models");
const Product = require("../../models/product");
const ServiceDetails = require("../../models/service-details");

const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const data = {
      ...req.body.validated.service,
      service_details: req.body.validated.details,
    };

    const service = await Product.create(data, {
      include: {
        model: ServiceDetails,
        as: "service_details",
      },
      transaction,
    });

    await transaction.commit();
    res.sendResponse({ service }, "Successfully registered!");
  } catch (e) {
    res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Product.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        type: ProductType.NON_INVENTORY,
      },
      include: {
        model: ServiceDetails,
        as: "service_details",
      },
    });

    res.sendResponse({ services }, "Successfully fetched!");
  } catch (e) {
    res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
  }
};

const getService = async (req, res) => {
  try {
    const service = await Product.findByPk(req.params.id, {
      include: {
        model: ServiceDetails,
        as: "service_details",
      },
    });

    res.sendResponse({ service }, "Successfully fetched!");
  } catch (e) {
    res.sendError(e, "Something wen't wrong! =>" + e.message, 400);
  }
};

module.exports = {
  register,
  getService,
  getServices,
};
