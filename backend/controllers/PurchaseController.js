const Product = require("../models/product");
const PurchaseOrder = require("../models/purchase-order");
const Supplier = require("../models/supplier");
const ProductDetails = require("../models/product-details");
const { groupPurchaseByVendor } = require("../services/PurchaseReportService");
const { PurchaseOrderStatus } = require("shared");
const { Op } = require("sequelize");

module.exports = {
	purchaseByVendor: async (req, res) => {
		try {
			const { from, to } = req.query;
			const purchaseOrders = await PurchaseOrder.findAll({
				where: {
					status: PurchaseOrderStatus.COMPLETED,
					received_date: {
						[Op.gte]: new Date(from),
						[Op.lte]: new Date(to),
					},
				},
				include: [
					{
						model: Supplier,
						as: "supplier",
					},
					{
						model: Product,
						as: "products",
						attributes: ["id"],
						include: [
							{
								model: ProductDetails,
								as: "product_details",
							},
						],
					},
				],
			});

			const grouped = groupPurchaseByVendor(purchaseOrders);

			res.sendResponse(
				{ purchase_by_vendor: grouped },
				"Successfully retrieved!",
			);
		} catch (e) {
			console.log(e);
			res.sendError({ e }, "Something went wrong!");
		}
	},
};
