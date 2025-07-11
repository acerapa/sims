const Product = require("../models/product")
const PurchaseOrder = require("../models/purchase-order")
const Supplier = require("../models/supplier")
const ProductDetails = require("../models/product-details")
const { groupPurchaseByVendor } = require("../services/PurchaseReportService")
const { PurchaseOrderStatus } = require("shared")

module.exports = {
	purchaseByVendor: async (req, res) => {
		try {
			const purchaseOrders = await PurchaseOrder.findAll({
				where: {
					status: PurchaseOrderStatus.COMPLETED
				},
				include: [
					{
						model: Supplier,
						as: 'supplier'
					},
					{
						model: Product,
						as: 'products',
						attributes: ['id'],
						include: [
							{
								model: ProductDetails,
								as: 'product_details'
							}
						]
					}
				]
			})

			const grouped = groupPurchaseByVendor(purchaseOrders)

			res.sendResponse({purchase_by_vendor: grouped}, "Successfully retrieved!")
		} catch (e) {
			console.log(e)
			res.sendError({e}, "Something went wrong!")
		}
	}
}
